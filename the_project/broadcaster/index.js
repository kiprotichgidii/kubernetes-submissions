const { connect, StringCodec } = require('nats');
const axios = require('axios');

const NATS_URL = process.env.NATS_URL || 'nats://my-nats:4222';
const BROADCASTER_URL = process.env.BROADCASTER_URL;
const sc = StringCodec();

async function run() {
  try {
    const nc = await connect({ servers: NATS_URL });
    console.log(`Connected to NATS at ${NATS_URL}`);

    // Subscribe with a Queue Group 'broadcaster-workers'
    // This ensures that if we have 6 replicas, only one will process the message.
    const sub = nc.subscribe('todo_updates', { queue: 'broadcaster-workers' });
    console.log('Subscribed to "todo_updates" with queue group "broadcaster-workers"');

    for await (const m of sub) {
      const data = JSON.parse(sc.decode(m.data));
      console.log('Received message:', data);

      await sendToBroadcaster(data);
    }
  } catch (err) {
    console.error('Error connecting to NATS:', err);
    // Retry logic could be added here, or let k8s restart the pod
    process.exit(1);
  }
}

async function sendToBroadcaster(data) {
  if (!BROADCASTER_URL) {
    console.log('BROADCASTER_URL not set. Skipping POST.');
    return;
  }

  const isDiscord = BROADCASTER_URL.includes('discord');

  let payload;
  if (isDiscord) {
    let messagePrefix = "A todo was updated:";
    if (data.message && data.message.startsWith("New todo created")) {
      messagePrefix = "A New todo was created:";
    } else if (data.message && data.message.startsWith("Todo") && data.message.includes("updated")) {
      messagePrefix = "A todo was updated:";
    }

    payload = {
      content: messagePrefix + "\n```json\n" + JSON.stringify(data, null, 2) + "\n```"
    };
  } else {
    payload = data;
  }

  try {
    await axios.post(BROADCASTER_URL, payload);
    console.log('Message sent to broadcaster URL');
  } catch (error) {
    console.error(`Failed to send to broadcaster: ${error.message} (URL: ${BROADCASTER_URL})`);
  }
}

run();
