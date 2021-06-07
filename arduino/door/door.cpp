#include <NewPing.h>

#define PIN_TRIG 12
#define PIN_ECHO 11

#define MAX_DISTANCE 500

#define MIN_DISTANCE 15

#define MIN_DELTA 50

NewPing sonar(PIN_TRIG, PIN_ECHO, MAX_DISTANCE);
unsigned int distance = sonar.ping_cm();
unsigned int norm;
void setup()
{
    Serial.begin(115200);

    int vals[15];
    for (int counter = 0; counter < 15; counter++)
    {
        distance = sonar.ping_cm();
        vals[counter] = distance;
        delay(50);
    };
    int sum = 0;
    for (int i = 0; i < 15; i++)
    {
        sum += vals[i];
    }

    norm = sum / 15;
    Serial.println(norm);
}
unsigned int prev = MAX_DISTANCE;

void loop()
{

    delay(50);

    distance = sonar.ping_cm();
    if (distance > MIN_DISTANCE)
    {
        int delta = prev - distance;
        if (delta > MIN_DELTA || distance + MIN_DELTA < norm)
        {
            Serial.print(prev);
            Serial.print('-');
            Serial.print(distance);
            Serial.print('-');
            Serial.println(norm);
        }
    }
    prev = distance;
}
