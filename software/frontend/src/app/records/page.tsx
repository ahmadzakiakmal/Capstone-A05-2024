"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";

type PatientData = {
  ID: number;
  Name: string;
  Age: number;
  MaxRms: number;
  MaxAmplitude: number;
  AverageAmplitude: number;
  CreatedAt: string;
};

export default function RecordsPage() {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/patient-data")
      .then((res) => {
        console.log(res.data.data);
        setPatientData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <main className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <section className="px-10 pt-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPatientData((prev) => prev.filter((pd) => pd.Name.toLowerCase() == searchKeyword.toLowerCase()));
          }}
        >
          <label className="text-dark-1 flex items-center gap-3">
            Search:
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="bg-white text-dark-1 px-1 py-2 w-[300px] text-[18px] rounded-[8px] shadow-sm"
            />
          </label>
        </form>
      </section>

      <section className="p-10 flex flex-col gap-5">
        {patientData.map((pd) => {
          return (
            <div
              key={pd.ID}
            >
              <Card className="text-dark-1 shadow-md p-4 flex items-center gap-10">
                <p className="min-w-[300px]">
                  <span className="font-medium">{pd.Name}</span>
                  <br />
                  {new Date(pd.CreatedAt).toLocaleDateString()}
                </p>
                <p className="min-w-[200px]">Age: {pd.Age}</p>
                <p className="min-w-[200px]">Avg. Amplitude: {pd.AverageAmplitude.toFixed(2)} V</p>
                <p className="min-w-[200px]">Max Amplitude: {pd.MaxAmplitude.toFixed(2)} V</p>
                <p className="min-w-[200px]">Max RMS: {pd.MaxRms.toFixed(2)} V</p>
              </Card>
            </div>
          );
        })}
      </section>
    </main>
  );
}
