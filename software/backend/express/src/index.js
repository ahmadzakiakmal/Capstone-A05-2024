const express = require("express")
const app = express()
const port = 5000
const mqtt = require("mqtt")
const dotenv = require("dotenv")

dotenv.config({ debug: true, path: "./src/config/.env" });

const requiredEnvVars = ['MQTT_BROKER_ADDRESS', 'MQTT_USERNAME', 'MQTT_PASSWORD'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Error: Missing environment variable: ${varName}`);
    process.exit(1);
  }
});

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_ADDRESS, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

mqttClient.on("connect", () => {
  console.log("Connected to broker");
  mqttClient.subscribe('esp32/data', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic: esp32/data');
    }
  });
})

mqttClient.on('error', (err) => {
  console.error('Connection error: ', err);
  mqttClient.end();
});

mqttClient.on("message", (topic, message) => {
  console.log(topic, "→", message.toString());
})

app.get('/', (req, res) => {
  res.sendFile("views/index.html", { root: __dirname })
})

app.listen(port, () => {
  console.log(`MyoSense server running on port ${port}`)
})