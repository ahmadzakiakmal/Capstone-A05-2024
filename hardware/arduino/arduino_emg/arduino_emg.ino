int emgReadings[10];
int currentIndex = 0;

void setup() {
  Serial.begin(9600);
  for (int i; i < 10; i++) {
    emgReadings[i] = 0;
  }
}

void loop() {
  int lowerbit = 800 % 256;
  int upperbit = (800 >> 8) % 256;
  Serial.print(lowerbit);  //Tofreezethelowerlimit 
  Serial.print(" ");
  Serial.print(upperbit);  //Tofreezethelowerlimit 
  Serial.print(" ");
  Serial.print("840");  //Tofreezetheupperlimit 
  Serial.print(" ");

  int sensorValue = analogRead(A0);
  emgReadings[currentIndex] = sensorValue;
  Serial.print(sensorValue);
  Serial.print(" ");

  // Serial.println(sensorValue);
  // for(int i = 0; i < 10; i++) {
  //   // Serial.print(emgReadings[i]);
  //   Serial.print(" ");
  // }
  // Serial.println("");

  unsigned long squaredSum = 0;
  for(int i = 0; i < 10; i++) {
    squaredSum += pow(emgReadings[i], 2);
  }
  // Serial.println(squaredSum);

  float average = squaredSum / 10;
  float rms = sqrt(average);

  Serial.print(rms);
  Serial.println("");

  currentIndex++;
  if(currentIndex >= 10) {
    currentIndex = 0;
  }
}