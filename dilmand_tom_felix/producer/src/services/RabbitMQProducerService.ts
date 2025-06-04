import * as amqp from "amqplib";
import dotenv from "dotenv";
import { LampCommand } from "../types/LampCommandsType";
import {
  closeRabbitMQConnection,
  createRabbitMQChannel,
  rabbitMQConfig
} from "../config/rabbitmq";

dotenv.config();

export class RabbitMQProducerService {
  private channel: amqp.Channel | null = null;
  private readonly queueName: string = rabbitMQConfig.lampCommandQueue;

  constructor() {}

  public isConnected(): boolean {
    return !!this.channel;
  }

  public async connect(): Promise<void> {
    try {
      this.channel = await createRabbitMQChannel();
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await closeRabbitMQConnection();
      this.channel = null;
    } catch (error: any) {
      throw error;
    }
  }

  private async sendCommand(command: LampCommand): Promise<void> {
    if (!this.channel) {
      console.log("Channel not ready");
      await this.connect();
      return;
    }

    try {
      const msgBuffer = Buffer.from(JSON.stringify(command));
      await this.channel.sendToQueue(this.queueName, msgBuffer, {
        persistent: false,
        contentType: "application/json",
      });
      console.log("[x] Sent:", command);
    } catch (error) {
      console.error("Error sending command:", error);
      throw error;
    }
  }

  public async turnOn(): Promise<void> {
    return this.sendCommand({ command: "on" });
  }

  public async turnOff(): Promise<void> {
    return this.sendCommand({ command: "off" });
  }

  public async setBrightness(value: number): Promise<void> {
    if (value < 0 || value > 100) {
      throw new Error("Helligkeit muss zwischen 0 und 100 liegen.");
    }
    return this.sendCommand({ command: "brightness", value });
  }

  public async setColor(color: string): Promise<void> {
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error("Color must be a valid hex color (e.g., #FF0000)");
    }
    return this.sendCommand({ command: "color", value: color });
  }
}

export const rabbitMQService = new RabbitMQProducerService();
