#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <iostream>
#include <cstring>
using namespace std;

WiFiClient wifiClient;
const char *ssid = "zoo";
const char *password = "---";

const char *host = "192.168.100.12";
const char fingerprint[] PROGMEM = "6E 47 47 08 9B F7 B1 90 FA 02 7E F9 CB AF 2D B3 8E EE 4C 18";

const String KEY = "DEhbcs34nbbiNOndsapHNI5dsNCODS";

const int httpsPort = 5000;

int send_req(String msg)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClientSecure httpsClient;
    httpsClient.setFingerprint(fingerprint);
    httpsClient.setTimeout(1000);
    Serial.print("HTTPS Connecting");
    int r = 0;
    while ((!httpsClient.connect(host, httpsPort)) && (r < 3))
    {
      delay(10);
      Serial.print(".");
      r++;
    }
    if (r == 3)
    {
      Serial.println("Connection failed");
      return 0;
    }
    else
    {
      Serial.println("Connected to web");
      String data = "msg=" + msg + "&time=" + String(millis()) + "&key=" + KEY;
      String dataLen = String(data.length());
      Serial.println(dataLen);
      String getData, Link;
      Link = "/";

      httpsClient.print(String("POST ") + Link + " HTTP/1.1\r\n" +
                        "Host: " + host + "\r\n" +
                        "Content-Type: application/x-www-form-urlencoded" + "\r\n" +
                        "Content-Length: " + dataLen + "\r\n\r\n" +
                        data + "\r\n" +
                        "Connection: close\r\n\r\n");

      Serial.println("request sent");
      return 1;
    }
  }
}

void setup()
{
  Serial.begin(115200);
  delay(100);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  send_req("started");
}

void loop()
{
  String msg = Serial.readStringUntil('\n');
  Serial.println(msg);
  if (msg != "")
  {
    Serial.println("apply");
    send_req(msg);
  }
}
