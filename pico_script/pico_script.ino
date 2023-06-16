

#include <ArduinoMqttClient.h>
#include <WiFi.h>
#include <FastLED.h>


#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif


#define CLIENT_ID "Hourglass1"
// #define CLIENT_ID "Hourglass2"


#define PIN 2
#define NUM_LEDS 14


#include "arduino_secrets.h"
char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);


CRGBArray<NUM_LEDS> leds;


unsigned long pixelPrevious = 0;        // Previous Pixel Millis
int          patternCurrent = 0;       // Current Pattern Number
int           pixelInterval = 50;       // Pixel Interval (ms)



const char broker[]    = "192.168.1.7";
int        port        = 1883;
const char inTopic[] = "hourglass/change";

uint8_t gHue = 0; // rotating "base color" used by many of the patterns

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

    delay(5000);
    rp2040.reboot();
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


  // FastLED.addLeds<WS2812B,PIN>(leds, NUM_LEDS);
  FastLED.addLeds<WS2812B,2,GRB>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(64);

}

void loop() {
  mqttClient.poll();

  // If mqtt has disconncted, restart pico
  if(!mqttClient.connected()) rp2040.reboot();

  unsigned long currentMillis = millis();                     //  Update current time

  if(currentMillis - pixelPrevious >= pixelInterval) {    
    gHue+=10;    
    FastLED.show();  
    pixelPrevious = currentMillis;                            //  Run current frame
    switch (patternCurrent) {
      case 1:
        rainbow(); // Flowing rainbow cycle along the whole strip
        break;
      case 2:
        purpleCircle(); 
        break;
      case 3:
        white();
        break;
      case 4:
        strobe();
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

  int beforePattern = patternCurrent;
  
  if(strcmp(message, "aran") ==0) {
    patternCurrent = 1;
  }else if(strcmp(message, "off") ==0) {
    patternCurrent = 0;
  }else if(strcmp(message, "standard") == 0) {
    patternCurrent = 2;
  }else if(strcmp(message, "white") ==0){
    patternCurrent = 3;
  }else if(strcmp(message, "strobe")==0) {
    patternCurrent = 4;

  }

  if(patternCurrent != beforePattern)
    offEffect();

  Serial.print("\"");
  Serial.print(message);
  Serial.print("\" - ");
  Serial.print(patternCurrent);
  Serial.println();
}


void offEffect() {
  fill_solid(leds, NUM_LEDS, CRGB(0,0,0));

}

void rainbow() 
{
  // FastLED's built-in rainbow generator
  fill_rainbow_circular( leds, NUM_LEDS, gHue);
}

void addGlitter( fract8 chanceOfGlitter) 
{
  if( random8() < chanceOfGlitter) {
    leds[ random16(NUM_LEDS) ] += CRGB::White;
  }
}

void strobe() {
  fadeToBlackBy( leds, NUM_LEDS, 96);
  addGlitter(90);
}

void white() {
  fill_solid(leds, NUM_LEDS, CRGB::White);
}


int coolPos = 0;

void purpleCircle()
{
  // a colored dot sweeping back and forth, with fading trails
  fadeToBlackBy( leds, NUM_LEDS, 70);

  //beatsin16()
  leds[coolPos%14] = CRGB::Indigo;
  coolPos++;
  if(coolPos >=140){
    coolPos = 0;
  }
}

