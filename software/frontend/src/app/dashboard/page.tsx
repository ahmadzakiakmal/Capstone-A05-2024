"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import PopUp from "@/components/PopUp";
import mqtt, { MqttClient } from "mqtt";
import { FormEvent, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import PlayIcon from "@/../public/PlayIcon.png";
import PauseIcon from "@/../public/PauseIcon.png";
import Image from "next/image";
import axios from "axios";

type DataPoint = {
  time: string;
  value: number;
};

export default function Dashboard() {
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [averageAmplitude, setAverageAmplitude] = useState<number>(0);
  const [maxAmplitude, setMaxAmplitude] = useState<number>(0);
  const [rms, setRms] = useState<number>(0);
  const [maxRms, setMaxRms] = useState<number>(0);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<number>(0);

  const reset = () => {
    setRealtimeData([]);
    setHistoricalData([]);
    setAverageAmplitude(0);
    setMaxAmplitude(0);
    setRms(0);
    setMaxRms(0);
    setIsRecording(false);
  };

  useEffect(() => {
    setTimeout(() => {}, 10);
    const client = mqtt.connect("ws://localhost:8083/mqtt");
    client.on("connect", () => console.log("connected to broker"));

    client.on("message", (_, message) => {
      const newDataPoint = {
        time: new Date().getMilliseconds().toString(),
        value: Number(message.toString()),
      };
      setHistoricalData((prevData: DataPoint[]) => {
        const newData: DataPoint[] = [...prevData, newDataPoint];
        if (newData.length > 400) newData.shift();
        return newData;
      });

      setRealtimeData((prevData: DataPoint[]) => {
        const newData: DataPoint[] = [...prevData, newDataPoint];
        if (newData.length > 100) newData.shift();

        const sumSquared: number = newData.reduce((acc, data) => {
          return acc + ((data.value * 3.3) / 4095) ** 2;
        }, 0);
        setRms(Number(sumSquared.toFixed(2)) / (newData.length > 100 ? 100 : newData.length));
        setMaxRms((prev) => {
          return Math.max(prev, sumSquared / (newData.length > 100 ? 100 : newData.length));
        });

        return newData;
      });

      setMaxAmplitude((prev) => {
        return Math.max(prev, (newDataPoint.value * 3.3) / 4095);
      });

      setAverageAmplitude((prevAvg) => {
        return (prevAvg + (newDataPoint.value * 3.3) / 4095) / 2;
      });
    });
    setMqttClient(client);
  }, []);

  return (
    <main className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <PopUp
        show={showPopUp}
        confirmText="Save"
      >
        <div className="flex flex-col gap-[10px]">
          <h1 className="text-[24px] text-dark-1 font-semibold text-center">Enter Identity</h1>
          <p className="max-w-[400px] text-dark-1 text-center">Fill out the following identity form.</p>
          <form
            className="text-black flex flex-col gap-[15px]"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (!patientName) {
                return alert("Nama wajib diisi");
              }
              if (patientAge === 0) {
                return alert("Umur wajib diisi");
              }
              const requestBody = {
                name: patientName,
                age: patientAge,
                maxRms,
                averageAmplitude,
                maxAmplitude,
              };
              axios
                .post("http://localhost:5000/patient-data", requestBody)
                .then((res) => {
                  console.log(res.data.message);
                  alert("Data berhasil disimpan dengan id " + res.data.id);
                  setShowPopUp(false);
                })
                .catch((err) => {
                  console.log(err.response.data.message);
                  alert(err.response.data.message);
                });
              console.log(requestBody);
            }}
          >
            <label>
              Name
              <input
                type="text"
                className="bg-[#dedede] !outline-none !text-black w-full px-[15px] py-[12px] text-[20px] font-medium rounded-[10px]"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </label>
            <label>
              Age
              <input
                type="number"
                className="bg-[#dedede] !outline-none !text-black w-full px-[15px] py-[12px] text-[20px] font-medium rounded-[10px]"
                value={patientAge}
                onChange={(e) => {
                  setPatientAge(Number(e.target.value));
                }}
              />
            </label>
            <div className="w-full h-[2px] bg-[#dedede] mt-2" />
            <div>
              <h1 className="text-center font-medium mb-1">Recording Results</h1>
              <div className="flex justify-between gap-5">
                <span>Max RMS:</span> <span>{maxRms.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between gap-5">
                <span>Max Amplitude:</span> <span>{maxAmplitude.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between gap-5">
                <span>Average Amplitude:</span> <span>{averageAmplitude.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between gap-5">
                <span>Examination Date:</span> <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <Button
              type="submit"
              className="text-white font-medium"
            >
              Save Data
            </Button>
          </form>
        </div>
      </PopUp>
      <div className="text-black p-10 flex flex-col gap-5">
        <div className="flex justify-end gap-2">
          <Button
            className="text-white !font-medium flex items-center justify-center gap-2"
            onClick={() => {
              setIsRecording(!isRecording);
              if (isRecording) {
                mqttClient?.unsubscribe("esp32/data", (err) => {
                  if (err) {
                    return console.log(err);
                  }
                  console.log("Unsubscribed to topic");
                });
                setShowPopUp(true);
              } else {
                mqttClient?.subscribe("esp32/data", (err) => {
                  if (err) {
                    return console.log(err);
                  }
                  console.log("Subscribed to topic");
                });
              }
            }}
          >
            {isRecording ? (
              <Image
                src={PauseIcon}
                alt="Pause Recording"
              />
            ) : (
              <Image
                src={PlayIcon}
                alt="Start Recording"
              />
            )}
            {isRecording ? "End " : "Start "} Recording
          </Button>
          {isRecording && (
            <Button
              className="text-white"
              onClick={() => {
                reset();
                mqttClient?.unsubscribe("esp32/data");
              }}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex gap-5">
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Real-time EMG Signal</h1>
            <ResponsiveContainer
              width="100%"
              height={200}
            >
              <LineChart data={realtimeData}>
                <CartesianGrid />
                <XAxis dataKey="time" />
                <YAxis domain={[0,4095]} />
                <Line
                  dataKey="value"
                  stroke="#16AAC3"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Historical Trend</h1>
            <ResponsiveContainer
              width="100%"
              height={200}
            >
              <LineChart data={historicalData}>
                <CartesianGrid />
                <XAxis dataKey="time" />
                <YAxis domain={[0,4095]} />
                <Line
                  dataKey="value"
                  stroke="#16AAC3"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="flex gap-5">
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Average Amplitude</h1>
            <p className="text-4xl font-bold">{averageAmplitude.toFixed(2)} V</p>
          </Card>

          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Peak Amplitude</h1>
            <p className="text-4xl font-bold">{maxAmplitude.toFixed(2)} V</p>
          </Card>
        </div>

        <div className="flex gap-5">
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Root Mean Squared (RMS)</h1>
            <p className="text-4xl font-bold">{rms.toFixed(2)} V</p>
          </Card>
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Max RMS</h1>
            <p className="text-4xl font-bold">{maxRms.toFixed(2)} V</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
