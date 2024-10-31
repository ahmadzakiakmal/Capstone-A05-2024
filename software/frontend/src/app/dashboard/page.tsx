"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type DataPoint = {
  time: string;
  value: number;
};

export default function Dashboard() {
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [averageAmplitude, setAverageAmplitude] = useState(0);
  const [peakAmplitude, setPeakAmplitude] = useState(0);

  const getEMGData = () => {
    return Math.sin(Date.now() / 1000) * Math.random() * 50 + 50;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = { time: new Date().toLocaleTimeString(), value: getEMGData() };

      setRealtimeData((prevData: DataPoint[]) => {
        const newData = [...prevData, newDataPoint];
        // console.log(newDataPoint);
        if (newData.length > 50) newData.shift();
        return newData;
      });

      setHistoricalData((prevData: DataPoint[]) => {
        const newData: DataPoint[] = [...prevData, newDataPoint];
        // console.log(newDataPoint);
        if (newData.length > 1000) newData.shift();
        return newData;
      });

      setAverageAmplitude((prevAvg) => {
        // console.log((prevAvg + newDataPoint.value) / 2);
        return (prevAvg + newDataPoint.value) / 2;
      });
      setPeakAmplitude((prevPeak) => {
        // console.log(Math.max(prevPeak, newDataPoint.value));
        return Math.max(prevPeak, newDataPoint.value);
      });
    }, 100);

    return () => clearInterval(interval);
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
                <Line dataKey="value" stroke="#16AAC3" />
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
                <Line dataKey="value" stroke="#16AAC3" />
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
            <p className="text-4xl font-bold">{peakAmplitude.toFixed(2)}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
