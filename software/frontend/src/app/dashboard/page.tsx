"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type DataPoint = {
  time: string;
  value: number;
};

export default function Dashboard() {
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [averageAmplitude, setAverageAmplitude] = useState<number>(0);
  const [peakAmplitude, setPeakAmplitude] = useState<number>(0);
  const [rms, setRms] = useState<number>(0);

  useEffect(() => {
    const client = mqtt.connect("ws://192.168.137.1:8083/mqtt", {
      username: "myosense-frontend",
      password: "myosensefrontend",
    });
    console.log(client.connected);

    client.on("connect", () => {
      console.log("connected to broker via ws");
      client.subscribe("esp32/data", (err) => {
        if (err) {
          return console.log("Error :", err);
        }
        console.log("Subscribed to esp32/data");
      });
    });

    client.on("message", (topic, message) => {
      const newDataPoint = {
        time: new Date().getMilliseconds().toString(),
        value: Number(message.toString()),
      };
      setHistoricalData((prevData: DataPoint[]) => {
        const newData: DataPoint[] = [...prevData, newDataPoint];
        if (newData.length > 500) newData.shift();
        return newData;
      });

      setRealtimeData((prevData: DataPoint[]) => {
        const newData: DataPoint[] = [...prevData, newDataPoint];
        if (newData.length > 20) newData.shift();

        const sumSquared: number = newData.slice(-4).reduce((acc, data) => {
          return acc + data.value ** 2
        }, 0);
        setRms(sumSquared / (newData.length > 4 ? 4 : newData.length));

        return newData;
      });

      setPeakAmplitude((prevPeak) => {
        return Math.max(prevPeak, newDataPoint.value);
      });

      setAverageAmplitude((prevAvg) => {
        return (prevAvg + newDataPoint.value) / 2;
      });
    });
  }, []);

  return (
    <main className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <div className="text-black p-10 flex flex-col gap-5">
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
                <YAxis />
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
                <YAxis />
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
            <p className="text-4xl font-bold">{averageAmplitude.toFixed(2)}</p>
          </Card>

          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Peak Amplitude</h1>
            <p className="text-4xl font-bold">{peakAmplitude.toFixed(2)}</p>
          </Card>
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Root Mean Squared (RMS)</h1>
            <p className="text-4xl font-bold">{rms.toFixed(2)}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
