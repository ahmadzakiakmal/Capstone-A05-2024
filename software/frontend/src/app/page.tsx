"use client"

import Image from "next/image";
import Logo from "@/../public/Logo.png";
import Button from "@/components/Button";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<number>(0);
  return (
    <main className="bg-gradient-to-tr from-cyan-primary to-green-primary min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white/90 rounded-[10px] py-20 px-40 flex flex-col justify-center items-center gap-5">
        {step === 0 && (
          <Landing
            onButtonClick={() => {
              setStep((prev) => prev + 1);
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

