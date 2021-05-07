// #include <Arduino.h>
#include "DHT.h"
#define DHTPIN 12
DHT dht(DHTPIN, DHT11);
void setup()
{
  Serial.begin(9600);
  dht.begin();
  pinMode(13, OUTPUT);
  pinMode(12, INPUT);
  digitalWrite(13, HIGH);
}
void loop()
{
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (!isnan(h) || !isnan(t))
  {
    Serial.print("h" + String(h) + "t" + String(t) + "*");
  }
  delay(2000);
}