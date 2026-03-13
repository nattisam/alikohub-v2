const { ClientProxyFactory, Transport } = require('@nestjs/microservices');

async function main() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: 'auth-service',
      port: 3011,
    },
  });

  console.log('Connecting to auth-service via TCP...');
  await client.connect();

  console.log('Sending login request...');
  try {
    const result = await client.send({ cmd: 'login' }, {
      email: 'admin@alikohub.com',
      password: 'AdminPassword123!',
    }).toPromise();
    console.log('Login result:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Login error:', e);
  } finally {
    await client.close();
  }
}

main();
