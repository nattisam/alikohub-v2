const amqp = require('amqplib');

async function fulfill() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  const exchange = 'payment_events';
  
  const payload = {
    userId: 'a3dnXAMTFTfiyx5lKQ0IA9RmDm13',
    amount: 500,
    currency: 'ETB',
    purpose: 'COURSE_PURCHASE_9',
    metadata: {
      courseId: 9,
      enrollmentId: 42,
      userId: 'a3dnXAMTFTfiyx5lKQ0IA9RmDm13'
    }
  };

  await channel.assertExchange(exchange, 'fanout', { durable: true });
  channel.publish(exchange, '', Buffer.from(JSON.stringify(payload)));
  
  console.log('Published payment.succeeded event:', payload);
  
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

fulfill().catch(console.error);
