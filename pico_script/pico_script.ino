

#include <ArduinoMqttClient.h>
#include <WiFi.h>

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif


#define CLIENT_ID Hourglass1

#define PIN 3
#define LED_COUNT 14


#include "arduino_secrets.h"
char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, PIN, NEO_GRB + NEO_KHZ800);

unsigned long pixelPrevious = 0;        // Previous Pixel Millis
unsigned long patternPrevious = 0;      // Previous Pattern Millis
char          patternCurrent[] = "off";       // Current Pattern Number
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
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

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
  if((currentMillis - patternPrevious) >= patternInterval) {  //  Check for expired time
    patternPrevious = currentMillis;
    patternCurrent++;                                         //  Advance to next pattern
    if(patternCurrent >= 7)
      patternCurrent = 0;
  }
  
  if(currentMillis - pixelPrevious >= pixelInterval) {        //  Check for expired time
    pixelPrevious = currentMillis;                            //  Run current frame
    switch (patternCurrent) {
      case 7:
        theaterChaseRainbow(50); // Rainbow-enhanced theaterChase variant
        break;
      case 6:
        rainbow(10); // Flowing rainbow cycle along the whole strip
        break;     
      case 5:
        theaterChase(strip.Color(0, 0, 127), 50); // Blue
        break;
      case 4:
        theaterChase(strip.Color(127, 0, 0), 50); // Red
        break;
      case 3:
        theaterChase(strip.Color(127, 127, 127), 50); // White
        break;
      case 2:
        colorWipe(strip.Color(0, 0, 255), 50); // Blue
        break;
      case 1:
        colorWipe(strip.Color(0, 255, 0), 50); // Green
        break;        
      default:
        colorWipe(strip.Color(255, 0, 0), 50); // Red
        break;
    }
  }

  
}

void onMqttMessage(int messageSize) {
  // we received a message, print out the topic and contents
  Serial.print("Received a message with topic '");
  Serial.print(mqttClient.messageTopic());
  Serial.print("', duplicate = ");
  Serial.print(mqttClient.messageDup() ? "true" : "false");
  Serial.print(", QoS = ");
  Serial.print(mqttClient.messageQoS());
  Serial.print(", retained = ");
  Serial.print(mqttClient.messageRetain() ? "true" : "false");
  Serial.print("', length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

  char message[100];
  int messageArrSize = 0;

  // use the Stream interface to print the contents
  while (mqttClient.available()) {
    message[messageArrSize] = (char)mqttClient.read();
    messageArrSize++;
  }
  
  patternCurrent = message;

  Serial.print(message);

}

void offEffect() {
  
}

void rainbow(uint8_t wait) {
  uint16_t i, j;



  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}
