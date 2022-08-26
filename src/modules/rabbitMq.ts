import amqp from 'amqplib/callback_api';
import { RabbitMqEventTypes } from '../interfaces/rabbitMqQueues';

type exchangeOptions = {
  name: string;
  routingKey: string;
};

export async function sendMessage(
  options: exchangeOptions,
  msg: object,
  eventType: RabbitMqEventTypes
) {
  try {
    amqp.connect('amqp://localhost:5672', function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        // channel.assertQueue(queue, {
        //   durable: false,
        // });
        channel.publish(
          options.name,
          options.routingKey,
          Buffer.from(JSON.stringify({ ...msg, eventType }))
        );
        // channel.sendToQueue(
        //   queue,
        //   Buffer.from(JSON.stringify({ ...msg, eventType }))
        // );
        console.log(' [x] sending %s', msg);
      });
      setTimeout(function () {
        connection.close();
      }, 2000);
    });
  } catch (error) {
    console.log(error);
  }
}
