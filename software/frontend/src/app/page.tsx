"use client";

import Image from "next/image";
import Logo from "@/../public/Logo.png";
import ConnectYourDevice from "@/../public/ConnectYourDevice.png";
import EnterIPAddress from "@/../public/EnterIPAddress.png";
import SearchingDevice from "@/../public/SearchingDevice.png";
import Connected from "@/../public/Success.png";

import Button from "@/components/Button";
import { Dispatch, SetStateAction, useState } from "react";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");

  return (
    <main className="bg-gradient-to-tr from-cyan-primary to-green-primary min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white/90 rounded-[10px] py-10 flex flex-col justify-center items-center gap-5 min-w-[500px]">
        {step === 0 && (
          <Landing
            onButtonClick={() => {
              setStep((prev) => prev + 1);
            }}
          />
        )}
        {step === 1 && <Step1 onButtonClick={() => setStep((prev) => prev + 1)} />}
        {step === 2 && (
          <Step2
            ipAddress={ipAddress}
            setIpAddress={setIpAddress}
            onButtonClick={() => {
              setIsLoading(true);
              setStep((prev) => prev + 1);
              setTimeout(() => {
                setStep((prev) => prev + 1);
                if (ipAddress === "") {
                  setErrorMessage("Device not found");
                }
                setIsLoading(false);
              }, 2000);
            }}
          />
        )}
        {step > 2 && isLoading && <Loading />}
        {step > 3 && errorMessage === "" && (
          <Success
            onButtonClick={() => {
              setStep((prev) => prev + 1);
            }}
          />
        )}
        {step > 3 && errorMessage !== "" && (
          <Fail
            onButtonClick={() => {
              setStep(0);
              setErrorMessage("");
            }}
          />
        )}
      </div>
    </main>
  );
}

function Landing({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <>
      <Image
        src={Logo}
        alt="Logo"
      />
      <Button onClick={onButtonClick}>Start</Button>
    </>
  );
}

function Step1({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <>
      <Image
        src={ConnectYourDevice}
        alt="Connect Your Device"
      />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Connect Your Device</h1>
        <p className="max-w-[400px] text-dark-1 text-center">
          Connect this device and the EMG device to the same Wi-Fi network. Once done, click Continue.
        </p>
      </div>
      <Button onClick={onButtonClick}>Continue</Button>
    </>
  );
}

function Step2({
  onButtonClick,
  ipAddress,
  setIpAddress,
}: {
  onButtonClick: () => void;
  ipAddress: string;
  setIpAddress: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Image
        src={EnterIPAddress}
        alt="Connect Your Device"
      />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Enter the IP Address</h1>
        <p className="max-w-[400px] text-dark-1 text-center">
          Enter the IP Address of the EMG device shown on its screen.
        </p>
        <input
          type="text"
          className="bg-[#d4e4de] px-2 !outline-none !text-black w-full text-center py-[10px] text-[24px] font-medium"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
      </div>
      <Button onClick={onButtonClick}>Continue</Button>
    </>
  );
}

function Loading() {
  return (
    <>
      <Image
        src={SearchingDevice}
        alt="Connect Your Device"
      />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Looking for Device...</h1>
        <p className="max-w-[400px] text-dark-1 text-center">
          Please wait while we attempt to connect to the EMG device...
        </p>
      </div>
    </>
  );
}

function Success({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <>
      <Image
        src={Connected}
        alt="Connect Your Device"
      />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Device Connected</h1>
        <p className="max-w-[400px] text-dark-1 text-center">The EMG device is now connected and ready to use.</p>
      </div>
      <Button onClick={onButtonClick}>Next</Button>
    </>
  );
}

function Fail({ onButtonClick }: { onButtonClick: () => void }) {
  return (
    <>
      <Image
        src={Connected}
        alt="Connect Your Device"
      />
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[24px] text-dark-1 font-semibold text-center">Device Not Found</h1>
        <p className="max-w-[400px] text-dark-1 text-center">
          The device with the IP address you entered is not found, make sure the device is connected to the same Wi-Fi
          network and try again.
        </p>
      </div>
      <Button onClick={onButtonClick}>Try Again</Button>
    </>
  );
}

