import amqp from 'amqplib/callback_api';

export async function sendMessage<Object>(queue: string, msg: Object) {
  try {
    amqp.connect('amqp://localhost:5672', function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        channel.assertQueue(queue, {
          durable: false,
        });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(' [x] Enviando %s', msg);
      });
      setTimeout(function () {
        connection.close();
      }, 2000);
    });
  } catch (error) {
    console.log(error);
  }
}
