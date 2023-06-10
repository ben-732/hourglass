

#include <ArduinoMqttClient.h>
#include <WiFi.h>

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif


#define CLIENT_ID "Hourglass1"

#define PIN 2
#define LED_COUNT 14


#include "arduino_secrets.h"
char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, PIN, NEO_GRB + NEO_KHZ800);

unsigned long pixelPrevious = 0;        // Previous Pixel Millis
unsigned long patternPrevious = 0;      // Previous Pattern Millis
int          patternCurrent = 0;       // Current Pattern Number
int           patternInterval = 5000;   // Pattern Interval (ms)
int           pixelInterval = 50;       // Pixel Interval (ms)
int           pixelQueue = 0;           // Pattern Pixel Queue
int           pixelCycle = 0;           // Pattern Pixel Cycle
uint16_t      pixelCurrent = 0;         // Pattern Current Pixel Number
uint16_t      pixelNumber = LED_COUNT;  // Total Number of Pixels



const char broker[]    = "192.168.1.5";
int        port        = 1883;
const char inTopic[] = "hourglass/change";

const long interval = 10000;
unsigned long previousMillis = 0;

int count = 0;

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  // while (!Serial) {
  //   ; // wait for serial port to connect. Needed for native USB port only
  // }

  // attempt to connect to WiFi network:
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  mqttClient.setId(CLIENT_ID);


  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  // set the message receive callback
  mqttClient.onMessage(onMqttMessage);

  Serial.print("Subscribing to topic: ");
  Serial.println(inTopic);
  Serial.println();

  mqttClient.subscribe(inTopic, 1);


  Serial.print("Waiting for messages on topic: ");
  Serial.println(inTopic);
  Serial.println();


  strip.begin();
  strip.setBrightness(50);
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  mqttClient.poll();

  unsigned long currentMillis = millis();                     //  Update current time

  
  if(currentMillis - pixelPrevious >= pixelInterval) {        //  Check for expired time
    pixelPrevious = currentMillis;                            //  Run current frame
    switch (patternCurrent) {
      case 1:
        rainbow(10); // Flowing rainbow cycle along the whole strip
        break;
      case 2:
        mainEffect(); 
        break;    
      case 0:             
      default:
        offEffect(); 
        break;
    }
  }

  
}

void onMqttMessage(int messageSize) {
  // we received a message, print out the topic and contents

  char message[100];
  int messageArrSize = 0;

  // use the Stream interface to print the contents
  while (mqttClient.available()) {
    message[messageArrSize] = (char)mqttClient.read();
    messageArrSize++;
  }

  message[messageArrSize] = '\0';
  
  if(strcmp(message, "aran") ==0) {
    patternCurrent = 1;
  }else if(strcmp(message, "off") ==0) {
    patternCurrent = 0;
  }else if(strcmp(message, "standard") == 0) {
    patternCurrent = 2;
  }

  
  Serial.print("\"");
  Serial.print(message);
  Serial.print("\" - ");
  Serial.print(patternCurrent);
  Serial.println();


}

void offEffect() {
  strip.fill();
  strip.show();
}

void mainEffect() {
  if(pixelInterval != 150)
    pixelInterval = 150;

  int effect_length = LED_COUNT / 2;

  strip.fill(strip.Color(255, 255, 255));

  for(uint16_t i=0; i < 10; i++) {
    if(i < 7) {
      strip.setPixelColor(
        (i + pixelCycle) % 14, 
        strip.Color(255 - (131 / 7) * (i), 255 - (255 / 7) * (i), 255)
      );
      continue;
    }
      strip.setPixelColor((i + pixelCycle) % 14, strip.Color(124, 0, 255));

         
  }

  pixelCycle++;

  if(pixelCycle >= LED_COUNT)
    pixelCycle = 0; 

  strip.show();
}




void white() {
  strip.fill(strip.Color(255, 255, 255));
}

void rainbow(uint8_t wait) {
  if(pixelInterval != wait)
    pixelInterval = wait;                   
  for(uint16_t i=0; i < pixelNumber; i++) {
    strip.setPixelColor(i, Wheel((i + pixelCycle) & 255)); //  Update delay time  
  }
  strip.show();                             //  Update strip to match
  pixelCycle++;                             //  Advance current cycle
  if(pixelCycle >= 256)
    pixelCycle = 0;                         //  Loop the cycle back to the begining
}

uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

