import { FormEvent } from "react";
import Button from "./Button";

type PatientData = {
  name: string;
  age: number;
  maxRms: number;
  maxAmplitude: number;
  dateOfExamination: string;
};

export default function IdentityForm() {
  return (
    <>
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Enter Identity</h1>
        <p className="max-w-[400px] text-dark-1 text-center">Fill out the following identity form.</p>
        <form className="text-black flex flex-col gap-[15px]">
          <label>
            Name
            <input
              type="text"
              className="bg-[#dedede] !outline-none !text-black w-full px-[15px] py-[12px] text-[20px] font-medium rounded-[10px]"
            />
          </label>
          <label>
            Age
            <input
              type="number"
              className="bg-[#dedede] !outline-none !text-black w-full px-[15px] py-[12px] text-[20px] font-medium rounded-[10px]"
            />
          </label>
          <div className="w-full h-[2px] bg-[#dedede] mt-2" />
          <div>
            <h1 className="text-center font-medium mb-1">Recording Results</h1>
            <div className="flex justify-between gap-5">
              <span>Max RMS:</span> <span>69.42 V</span>
            </div>
            <div className="flex justify-between gap-5">
              <span>Max Amplitude:</span> <span>69.42 V</span>
            </div>
            <div className="flex justify-between gap-5">
              <span>Examination Date:</span> <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
