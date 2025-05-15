import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { serviceType } from "@repo/utilities";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: `${serviceType.user}_queue`,
          queueOptions: { durable: false },
        },
      },
      {
        name: "QUOTE_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: `${serviceType.quote}_queue`,
          queueOptions: { durable: false },
        },
      },
      {
        name: "OTHER_SERVICES",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: `${serviceType.other}_queue`,
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
