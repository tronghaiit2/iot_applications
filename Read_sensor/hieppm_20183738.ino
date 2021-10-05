#include <MQUnifiedsensor.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

//Definitions
#define placa "Arduino UNO"
#define Voltage_Resolution 5
#define pin 33 //Analog input 0 of your arduino
#define type "MQ-135" //MQ135
#define ADC_Bit_Resolution 10 // For arduino UNO/MEGA/NANO
#define RatioMQ135CleanAir 3.6//RS / R0 = 3.6 ppm

MQUnifiedsensor MQ135(placa, Voltage_Resolution, ADC_Bit_Resolution, pin, type);


const char* ssid = "Bach Khoa";
const char* password =  "bachkhoa2000";
const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char* mqttUser = "hieppm";
const char* mqttPassword = "123456";
String tmp;

// list topic
const char* topic = "/MQ135/HoangMai/data";


WiFiClient espClient;
PubSubClient client(espClient);


void setup_MQ135(){
    
  MQ135.setRegressionMethod(1); //_PPM =  a*ratio^b
  
  MQ135.init(); 
  MQ135.setRL(10);
  Serial.print("Calibrating please wait.");
  float calcR0 = 0;
  for(int i = 1; i<=10; i ++)
  {
    MQ135.update(); // Update data, the arduino will be read the voltage on the analog pin
    calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    Serial.print(".");
  }
  MQ135.setR0(calcR0/10);
  Serial.println("  done!.");
  
  if(isinf(calcR0)) {Serial.println("Warning: Conection issue founded, R0 is infite (Open circuit detected) please check your wiring and supply"); while(1);}
  if(calcR0 == 0){Serial.println("Warning: Conection issue founded, R0 is zero (Analog pin with short circuit to ground) please check your wiring and supply"); while(1);}
}
String Float2CharArray(float data){
  
  String data_str = String(data);
  return data_str;
}

void checkStatus(boolean r, String topic){
  if(r == 1) {
    Serial.print("publish successfully ");
    Serial.println(topic);
  }
  else {
    Serial.print("publish fail ");
    Serial.println(topic);
  }
}


void run() {
  MQ135.update(); // Update data, the arduino will be read the voltage on the analog pin

  MQ135.setA(605.18); MQ135.setB(-3.937); // Configurate the ecuation values to get CO concentration
  float CO = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup

  MQ135.setA(77.255); MQ135.setB(-3.18); // Configurate the ecuation values to get Alcohol concentration
  float Alcohol = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup

  MQ135.setA(110.47); MQ135.setB(-2.862); // Configurate the ecuation values to get CO2 concentration
  float CO2 = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup

  MQ135.setA(44.947); MQ135.setB(-3.445); // Configurate the ecuation values to get Tolueno concentration
  float Tolueno = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup

  MQ135.setA(102.2 ); MQ135.setB(-2.473); // Configurate the ecuation values to get NH4 concentration
  float NH4 = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup

  MQ135.setA(34.668); MQ135.setB(-3.369); // Configurate the ecuation values to get Acetona concentration
  float Acetona = MQ135.readSensor(); // Sensor will read PPM concentration using the model and a and b values setted before or in the setup
  MQ135.serialDebug();

  StaticJsonBuffer<400> JSONbuffer;
  // create a JSON object
  JsonObject& JSONencoder = JSONbuffer.createObject();
  JSONencoder["CO"] = CO;
  JSONencoder["CO2"] = CO2;
  JSONencoder["NH4"] = NH4;
  JSONencoder["Tolueno"] = Tolueno;
  JSONencoder["Acetona"] = Acetona;
  JSONencoder["Alcohol"] = Alcohol;
  char JSONmessageBuffer[200];
  JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

  // publish data to broker
  if (client.publish(topic, JSONmessageBuffer) == true) {
    Serial.println("Success sending message");
  } 
  else {
    Serial.println("Error sending message");
  }
 
  client.loop();
  delay(1000);
}

void setup(){
  Serial.begin(115200);
  
  initWiFi();
  Serial.print("RRSI: ");
  Serial.println(WiFi.RSSI());

  delay(2000);
  setup_MQ135();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

}

void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void loop(){
    while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword )) {
      Serial.println("connected");
    }
    else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(1000);
    }
   }
    run();
    client.loop();
  
  
}
