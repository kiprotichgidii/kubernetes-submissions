const crypto = require('crypto');

// Generate a random UUID on startup
const randomString = crypto.randomUUID();

// Function to output the string with timestamp
function outputWithTimestamp() {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${randomString}`);
}

// Output immediately on startup
outputWithTimestamp();

// Then output every 5 seconds
setInterval(outputWithTimestamp, 5000);