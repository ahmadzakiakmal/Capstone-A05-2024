"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import PopUp from "@/components/PopUp";
import mqtt, { MqttClient } from "mqtt";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type DataPoint = {
  time: string;
  value: number;
};

type Recording = {
  phase: number;
  m: number;
  rms: number;
};

export default function Dashboard() {
  const [realtimeData, setRealtimeData] = useState<DataPoint[]>([]);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [averageAmplitude, setAverageAmplitude] = useState<number>(0);
  const [peakAmplitude, setPeakAmplitude] = useState<number>(0);
  const [rms, setRms] = useState<number>(0);
  const [maxRms, setMaxRms] = useState<number>(0);
  const [showPopUp, setShowPopUp] = useState<boolean>(true);
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const [phase, setPhase] = useState<number>(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const reset = () => {
    setRealtimeData([]);
    setHistoricalData([]);
    setAverageAmplitude(0);
    setPeakAmplitude(0);
    setRms(0);
    setMaxRms(0);
  };

  useEffect(() => {
    setTimeout(() => {}, 10);
    const client = mqtt.connect("ws://192.168.137.1:8083/mqtt");
    client.on("connect", () => console.log("connected to broker"));

    client.on("message", (topic, message) => {
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
          if (phase === 1) {
            console.log(Math.max(prev, sumSquared / (newData.length > 100 ? 100 : newData.length)));
          }
          return Math.max(prev, sumSquared / (newData.length > 100 ? 100 : newData.length));
        });

        return newData;
      });

      setPeakAmplitude((prev) => {
        return Math.max(prev, (newDataPoint.value * 3.3) / 4095);
      });

      setAverageAmplitude((prevAvg) => {
        return (prevAvg + (newDataPoint.value * 3.3) / 4095) / 2;
      });
    });
    setMqttClient(client);
  }, []);

  useEffect(() => {
    if (!mqttClient) return;
    reset();
    mqttClient.subscribe("esp32/data", (error) => {
      if (error) console.log("Error subscribing to topic");
      else console.log("Subscribed");
    });

    setTimeout(() => {
      mqttClient.unsubscribe("esp32/data");
      console.log("Unsubscribed");
      setShowPopUp(true);
    }, 5000);
  }, [phase]);

  // useEffect(() => {
  //   const client = mqtt.connect("ws://192.168.137.1:8083/mqtt", {
  //     username: "myosense-frontend",
  //     password: "myosensefrontend",
  //   });
  //   console.log(client.connected);

  //   client.on("connect", () => {
  //     console.log("connected to broker via ws");
  //     client.subscribe("esp32/data", (err) => {
  //       if (err) {
  //         return console.log("Error :", err);
  //       }
  //       console.log("Subscribed to esp32/data");
  //     });
  //   });

  //   client.on("message", (topic, message) => {
  //     const newDataPoint = {
  //       time: new Date().getMilliseconds().toString(),
  //       value: Number(message.toString()),
  //     };
  //     setHistoricalData((prevData: DataPoint[]) => {
  //       const newData: DataPoint[] = [...prevData, newDataPoint];
  //       if (newData.length > 400) newData.shift();
  //       return newData;
  //     });

  //     setRealtimeData((prevData: DataPoint[]) => {
  //       const newData: DataPoint[] = [...prevData, newDataPoint];
  //       if (newData.length > 100) newData.shift();

  //       const sumSquared: number = newData.reduce((acc, data) => {
  //         return acc + ((data.value * 3.3) / 4095) ** 2;
  //       }, 0);
  //       setRms(Number(sumSquared.toFixed(2)) / (newData.length > 100 ? 100 : newData.length));
  //       setMaxRms((prev) => {
  //         return Math.max(prev, sumSquared / (newData.length > 100 ? 100 : newData.length));
  //       });

  //       return newData;
  //     });

  //     setPeakAmplitude((prev) => {
  //       return Math.max(prev, (newDataPoint.value * 3.3) / 4095);
  //     });

  //     setAverageAmplitude((prevAvg) => {
  //       return (prevAvg + (newDataPoint.value * 3.3) / 4095) / 2;
  //     });
  //   });
  // }, []);

  return (
    <main className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <PopUp
        show={showPopUp}
        onConfirm={() => {
          if (phase === 0) {
            // setRecordings((prev) => {
            //   console.log({phase, m: peakAmplitude, rms: maxRms})
            //   return [...prev, {phase, m: peakAmplitude, rms: maxRms}]
            // })
            setPhase(1);
            setShowPopUp(false);
          }
          if (phase === 1) {
            setRecordings((prev) => {
              return [...prev, { phase, m: peakAmplitude, rms: maxRms }];
            });
            setPhase(2);
            setShowPopUp(false);
          }
          if (phase === 2) {
            setRecordings((prev) => {
              return [...prev, { phase, m: peakAmplitude, rms: maxRms }];
            });
            console.log("log m/rms", Math.log(peakAmplitude / recordings[0].rms));
          }
        }}
      >
        <div className="text-[18px] max-w-[500px]">
          <h1 className="text-[24px] font-semibold text-center mb-6">Phase {phase}</h1>
          <p className="text-center">
            {phase === 2 && (
              <span>
                RMS: {recordings[0].rms.toFixed(2)}
                <br />
                M: {peakAmplitude.toFixed(2)}
                <br />
                Log(M/RMS): {Math.log(peakAmplitude / recordings[0].rms).toFixed(2)}
                <br />
                Conlusion: {Math.log(peakAmplitude / recordings[0].rms) > 1.1 ? "Functional Weakness" : "Normal"}
              </span>
            )}
            {phase === 0 && (
              <span>
                <strong>Connect the EMG sensor&apos;s electrodes and attach them to the muscle</strong>.
                <br />
                Once done, click Start
              </span>
            )}
          </p>
        </div>
      </PopUp>
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

        <div className="flex gap-5">
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Max RMS</h1>
            <p className="text-4xl font-bold">{maxRms.toFixed(2)}</p>
          </Card>
          {/* 
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Peak Amplitude</h1>
            <p className="text-4xl font-bold">{peakAmplitude.toFixed(2)}</p>
          </Card>
          <Card className="w-full">
            <h1 className="text-[25px] font-medium mb-5">Root Mean Squared (RMS)</h1>
            <p className="text-4xl font-bold">{rms.toFixed(2)}</p>
          </Card> */}
        </div>
      </div>
    </main>
  );
}
