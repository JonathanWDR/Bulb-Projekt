import amqp from 'amqplib';
import { createRabbitMQChannel, publishLampStatus, rabbitMQConfig } from '../config/rabbitmq';
import { ILampDevice, } from '../types/ILamp';
import { LampCommand } from '../types/LampCommandsType';
import { CommandStrategyFactory } from './CommandStrategyFactory';
import { MockLampDevice } from '../config/mockLamp';
import { createTplinkDeviceConnection } from '../config/tplink'; // <-- Fehlender Import

export class RabbitMQConsumerService {
    private amqpChannel: amqp.Channel | null = null;
    private commandStrategyFactory: CommandStrategyFactory;
    private device: ILampDevice;
    private mockDevice: MockLampDevice;
    private lastKnownState: any = { poweredOn: false, brightness: 100, color: "#ffffff" };

    constructor(device: ILampDevice) {
        this.commandStrategyFactory = new CommandStrategyFactory();
        this.device = device;
        this.mockDevice = new MockLampDevice();
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
        
        // Erwarteten Zustand berechnen
        const expectedState = await this.getExpectedState(cmd);
        
        // Versuchen, eine Verbindung zur echten Lampe herzustellen
        let deviceToUse = this.device;
        let isMock = false;
        
        try {
            console.log("Versuche Verbindung zur echten Lampe herzustellen...");
            deviceToUse = await createTplinkDeviceConnection();
        } catch (err) {
            console.warn("Echte Lampe nicht erreichbar, benutze MockDevice.");
            deviceToUse = this.mockDevice;
            isMock = true;
        }
        
        try {
            // Befehl ausführen
            const strategy = this.commandStrategyFactory.getStrategy(cmd.command);
            if (!strategy) {
                throw new Error(`Unsupported command: ${cmd.command}`);
            }
            
            await strategy.execute(deviceToUse, cmd, this.amqpChannel!);
            
            // Aktuellen Zustand abfragen und speichern
            const currentState = await deviceToUse.getCurrentState();
            this.lastKnownState = { ...currentState };
            
            // Status mit Mock-Info veröffentlichen
            const statusWithInfo = { 
                ...currentState, 
                isMockDevice: isMock 
            };
            
            await publishLampStatus(statusWithInfo, this.amqpChannel!);
            
        } catch (error: any) {
            console.error(`Error processing lamp command ${cmd.command}:`, error);
            
            // Bei Fehler trotzdem erwarteten Zustand mit Fehlerinfo zurückgeben
            if (this.amqpChannel) {
                const errorState = {
                    ...expectedState,
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
    
    // Hilfsmethode zum Berechnen des erwarteten Zustands
    private async getExpectedState(cmd: LampCommand): Promise<any> {
        // Basiszustand aus letztem bekannten Zustand
        const baseState = { ...this.lastKnownState };
        
        // Änderung basierend auf Befehl
        switch (cmd.command) {
            case 'on':
                return { ...baseState, poweredOn: true };
            case 'off':
                return { ...baseState, poweredOn: false };
            case 'brightness':
                return { ...baseState, brightness: (cmd as any).value };
            case 'color':
                return { ...baseState, color: (cmd as any).value };
            case 'morse':
                // Morse ändert den Zustand während der Ausführung
                return { ...baseState, morseActive: true, morseText: (cmd as any).value };
            default:
                return baseState;
        }
    }

}
