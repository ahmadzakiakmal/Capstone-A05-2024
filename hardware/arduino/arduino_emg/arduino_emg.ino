void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print(200);  //Tofreezethelowerlimit 
  Serial.print(" ");
  Serial.print(700);  //Tofreezetheupperlimit 
  Serial.print(" ");
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
}