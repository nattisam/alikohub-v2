const amqp = require('amqplib');

async function fulfill() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  const exchange = 'payment_events';
  
  const message = {
    pattern: 'payment.succeeded',
    data: {
      userId: '5DSw8oxbeGRzqCmGaBnrbO7orI12', // studdu@gmail.com
      amount: 100,
      currency: 'ETB',
      purpose: 'COURSE_PURCHASE_5',
      metadata: {
        courseId: 5,
        enrollmentId: 49,
        userId: '5DSw8oxbeGRzqCmGaBnrbO7orI12'
      }
    }
  };

  await channel.assertExchange(exchange, 'fanout', { durable: true });
  channel.publish(exchange, '', Buffer.from(JSON.stringify(message)));
  
  console.log('Published payment.succeeded event to NestJS:', JSON.stringify(message, null, 2));
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

fulfill().catch(console.error);
