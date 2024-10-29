"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

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
      <div className="text-black font-mono p-10 flex flex-col gap-5">
        <Card>
          <p>
            {realtimeData.map((d) => {
              return (
                <>
                  <span>{d.value.toFixed(2)}, </span>
                </>
              );
            })}
          </p>
        </Card>

        <Card>
          <p>{averageAmplitude}</p>
        </Card>

        <Card>
          <p>{peakAmplitude}</p>
        </Card>
      </div>
    </main>
  );
}
