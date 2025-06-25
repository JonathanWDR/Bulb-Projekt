import amqp from 'amqplib';
import { createRabbitMQChannel, publishLampStatus, rabbitMQConfig } from '../config/rabbitmq';
import { ILampDevice, } from '../types/ILamp';
import { LampCommand } from '../types/LampCommandsType';
import { CommandStrategyFactory } from './CommandStrategyFactory';

export class RabbitMQConsumerService {
    private amqpChannel: amqp.Channel | null = null;
    private commandStrategyFactory: CommandStrategyFactory;
    private device: ILampDevice;
    private isMock: boolean;
    private lastKnownState: any = { poweredOn: false, brightness: 100, color: "#ffffff" };

    constructor(device: ILampDevice, isMock?: boolean) {
        this.commandStrategyFactory = new CommandStrategyFactory();
        this.device = device;
        this.isMock = isMock || false;
    }

    public setDevice(device: ILampDevice): void {
        this.device = device;
    }

    public setIsMock(isMock: boolean): void {
        this.isMock = isMock;
    }

    public async start(): Promise<void> {
        try {
            this.amqpChannel = await createRabbitMQChannel();
            const queueName = rabbitMQConfig.lampCommandQueue;
            console.log('[*] Waiting for messages in:', queueName);

            this.amqpChannel.consume(queueName, async (msg: any) => {
                if (msg !== null && this.amqpChannel) {
                    const rawValue = msg.content.toString();
                    let commandPayload: LampCommand;

                    try {
                        const parsedJson = JSON.parse(rawValue);
                        commandPayload = parsedJson as LampCommand;
                        console.log("Parsed command:", commandPayload);

                        await this.handleCommand(commandPayload);
                        this.amqpChannel.ack(msg);
                    } catch (error: any) {
                        console.error('Error processing message or invalid command structure:', rawValue, error);
                    }
                }
            }, { noAck: false });
        } catch (error) {
            console.error('Error starting lamp command consumer:', error);
            if (this.amqpChannel) {
                this.amqpChannel.close().catch(err => {
                    console.error('Error closing AMQP channel:', err);
                }
                );
            }
        }
    }

    public async stop(): Promise<void> {
        if (this.amqpChannel) {
            await this.amqpChannel.close().catch(err => {
                console.error('Error closing AMQP channel:', err);
            });
            console.log("Attempting to close lamp consumer channel.");
        }
    }

    public async handleCommand(cmd: LampCommand): Promise<void> {
        console.log(`Handling command: ${cmd.command}`, cmd);
        
        let deviceToUse = this.device;
        let isMock = this.isMock;
        
        try {
            const strategy = this.commandStrategyFactory.getStrategy(cmd.command);
            if (!strategy) {
                throw new Error(`Unsupported command: ${cmd.command}`);
            }
            
            await strategy.execute(deviceToUse, cmd, this.amqpChannel!);
            const currentState = await deviceToUse.getCurrentState();
            this.lastKnownState = { ...currentState };
            
            const statusWithInfo = { 
                ...currentState, 
                isMockDevice: isMock 
            };
            
            await publishLampStatus(statusWithInfo, this.amqpChannel!);
            
        } catch (error: any) {
            console.error(`Error processing lamp command ${cmd.command}:`, error);
            
            if (this.amqpChannel) {
                const errorState = {
                    ...this.lastKnownState,
                    isMockDevice: true,
                    error: {
                        message: error.message || 'Unbekannter Fehler',
                        command: cmd.command
                    }
                };
                
                await publishLampStatus(errorState, this.amqpChannel);
            }
        }
    }

}
