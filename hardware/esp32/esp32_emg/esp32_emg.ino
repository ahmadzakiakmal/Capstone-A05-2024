#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <PubSubClient.h>

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

lv_obj_t *wifi_status_label;
lv_obj_t *mqtt_status_label; 

void setup() {
  Serial.begin(115200);
  pinMode(EMG_PIN, INPUT);

  // Display Setup
  String LVGL_Arduino = String("LVGL Library Version: ") + lv_version_major() + "." + lv_version_minor() + "." + lv_version_patch();
  Serial.println(LVGL_Arduino);
  lv_init();
  lv_display_t *disp;
  disp = lv_tft_espi_create(SCREEN_WIDTH, SCREEN_HEIGHT, draw_buf, sizeof(draw_buf));
  lv_display_set_rotation(disp, LV_DISPLAY_ROTATION_270);
  wifi_status_label = lv_label_create(lv_scr_act());
  mqtt_status_label = lv_label_create(lv_scr_act());
  lv_label_set_text(wifi_status_label, "WiFi: Connecting...");
  lv_obj_align(wifi_status_label, LV_ALIGN_BOTTOM_MID, 0, -30);
  lv_label_set_text(mqtt_status_label, "MQTT: Connecting...");
  lv_obj_align(mqtt_status_label, LV_ALIGN_BOTTOM_MID, 0, -10);
  drawImage();

  // WiFi and MQTT Setup
  Serial.print("Connecting to ");
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
  lv_label_set_text(wifi_status_label, "WiFi: Connected");
  client.setServer(mqtt_host, mqtt_port);
}

void loop() {
  lv_task_handler(); 
  lv_tick_inc(1); 

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  int sensorValue = readEMG();
  String sensorValueStr = String(sensorValue);
  Serial.println(sensorValue);
  client.publish("esp32/data", (const uint8_t*)sensorValueStr.c_str(), sensorValueStr.length());
  delay(1);
}

int readEMG() {
  return analogRead(EMG_PIN);
}

void drawImage(void) {
  LV_IMAGE_DECLARE(my_image);
  lv_obj_t *img1 = lv_img_create(lv_scr_act());
  lv_img_set_src(img1, &my_image);
  lv_obj_align(img1, LV_ALIGN_CENTER, 0, -30);
}

void reconnect() {
  // Loop until MQTT is reconnected
  while (!client.connected()) {
    drawImage();
    Serial.print("Attempting MQTT connection...");
    lv_label_set_text(mqtt_status_label, "MQTT: Connecting...");

    if (client.connect("myosense-esp32")) {
      Serial.println("connected");
      lv_label_set_text(mqtt_status_label, "MQTT: Connected"); 
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
