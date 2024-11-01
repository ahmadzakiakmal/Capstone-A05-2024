#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <WebServer.h>
// #include <ESPAsyncWebServer.h>
// #include "LittleFS.h"
// #include <Arduino_JSON.h>
// #include <Adafruit_Sensor.h>

// Display Libraries
#include <lvgl.h>
#include <TFT_eSPI.h>
#include <image.h>

#define EMG_PIN 2
#define SCREEN_WIDTH 240
#define SCREEN_HEIGHT 320
#define DRAW_BUF_SIZE (SCREEN_WIDTH * SCREEN_HEIGHT / 10 * (LV_COLOR_DEPTH / 8))
uint32_t draw_buf[DRAW_BUF_SIZE / 4];

const char* ssid = "MyoSense";
const char* password = "314159265";

IPAddress local_ip(192,168,1,1);
IPAddress gateway(192,168,1,1);
IPAddress subnet(255,255,255,0);

WebServer server(80);

void setup() {
  Serial.begin(115200);
  // EMG Setup
  pinMode(EMG_PIN, INPUT);

  // Display Setup
  String LVGL_Arduino = String("LVGL Library Version: ") + lv_version_major() + "." + lv_version_minor() + "." + lv_version_patch();
  Serial.println(LVGL_Arduino);
  lv_init();
  lv_display_t * disp;
  disp = lv_tft_espi_create(SCREEN_WIDTH, SCREEN_HEIGHT, draw_buf, sizeof(draw_buf));
  lv_display_set_rotation(disp, LV_DISPLAY_ROTATION_270);
  // drawImage();

  // Access Point Setup
  WiFi.softAP(ssid, password);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  server.on("/", handleOnConnect);
  server.onNotFound(handleNotFound);
  
  server.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  lv_task_handler(); 
  lv_tick_inc(1); 

  int sensorValue = readEMG();
  // Serial.println(sensorValue);

  server.handleClient();
}

int readEMG() {
  return analogRead(EMG_PIN);

  // use random value for now
  // return random(0, 1024);
}

void drawImage(void) {
  LV_IMAGE_DECLARE(my_image);
  lv_obj_t * img1 = lv_image_create(lv_screen_active());
  lv_image_set_src(img1, &my_image);
  lv_obj_align(img1, LV_ALIGN_CENTER, 0, 0);
}

// Web Server Routes
void handleOnConnect() {
  server.send(200, "text/plain", "ESP32 Server");
}

void handleNotFound() {
  server.send(404, "text/plain", "Not found");
}