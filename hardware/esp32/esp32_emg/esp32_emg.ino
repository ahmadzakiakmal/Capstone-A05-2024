#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <PubSubClient.h>
// #include <ESPAsyncWebServer.h>
// #include "LittleFS.h"
// #include <Arduino_JSON.h>
// #include <Adafruit_Sensor.h>

// Display Libraries
#include <lvgl.h>
#include <TFT_eSPI.h>
#include <image.h>

#define EMG_PIN 33
#define SCREEN_WIDTH 240
#define SCREEN_HEIGHT 320
#define DRAW_BUF_SIZE (SCREEN_WIDTH * SCREEN_HEIGHT / 10 * (LV_COLOR_DEPTH / 8))
uint32_t draw_buf[DRAW_BUF_SIZE / 4];

const char* ssid = "MyoSense";
const char* password = "44444444";
const char* mqtt_host = "192.168.137.1";
const int mqtt_port = 1883; 
const char* mqtt_username = "MyoSenseDevice";
const char* mqtt_password = "myosense314159";
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  // EMG Setup
  pinMode(EMG_PIN, INPUT);

  // WiFi & MQTT Setup
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.print("Got IP: ");  
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_host, mqtt_port);

  // Display Setup
  String LVGL_Arduino = String("LVGL Library Version: ") + lv_version_major() + "." + lv_version_minor() + "." + lv_version_patch();
  Serial.println(LVGL_Arduino);
  lv_init();
  lv_display_t * disp;
  disp = lv_tft_espi_create(SCREEN_WIDTH, SCREEN_HEIGHT, draw_buf, sizeof(draw_buf));
  lv_display_set_rotation(disp, LV_DISPLAY_ROTATION_270);
  // drawImage();
}

void loop() {
  // put your main code here, to run repeatedly:
  lv_task_handler(); 
  lv_tick_inc(1); 

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int sensorValue = readEMG();
  // Serial.println(sensorValue);
  String sensorValueStr = String(sensorValue);
  client.publish("esp32/data", (const uint8_t*)sensorValueStr.c_str(), sensorValueStr.length());
  delay(1);
}

int readEMG() {
  return analogRead(EMG_PIN);

  // use random value when sensor is not connected
  // return random(0, 1024);
}

void drawImage(void) {
  LV_IMAGE_DECLARE(my_image);
  lv_obj_t * img1 = lv_image_create(lv_screen_active());
  lv_image_set_src(img1, &my_image);
  lv_obj_align(img1, LV_ALIGN_CENTER, 0, 0);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("myosense-esp32")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}