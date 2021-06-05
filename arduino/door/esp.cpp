#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

WiFiClient wifiClient;
const char* ssid     = "zoo";
const char* password = "---";

const char* host = "http://192.168.100.10";

void setup() {
  Serial.begin(115200);
  delay(100);

//  Serial.println();
//  Serial.println();
//  Serial.print("Connecting to ");
//  Serial.println(ssid);

  WiFi.begin(ssid, password);

 while (WiFi.status() != WL_CONNECTED) {
    delay(500);
//    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP()); 
}

void loop() {
  String msg = Serial.readStringUntil('\n');
  if (msg != "") {
   if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;   
    http.begin(wifiClient, "http://192.168.100.10:5000");     
    http.addHeader("Content-Type", "text/plain");  
 
    int httpCode = http.POST(msg);  
    String payload = http.getString();                 
// 
//    Serial.println(httpCode);  
//    Serial.println(payload);   
    http.end();
  } 
  }
  
 
}