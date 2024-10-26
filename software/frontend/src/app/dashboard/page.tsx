"use client";
import Button from "@/components/Button";
import { useEffect } from "react";

export default function Dashboard() {
  async function getPorts() {
    if ("serial" in navigator) {
      const ports = await navigator.serial.getPorts();
      console.log(ports);
    }
  }
  useEffect(() => {
    getPorts();
  });
  return (
    <>
      Dashboard
      <Button
        onClick={async () => {
          const port = await navigator.serial.requestPort();
          console.log(port);
          await port.open({ baudRate: 9600 });
          const reader = port.readable.getReader();

          // Listen to data coming from the serial device.
          for (let i = 0; i < 10; i ++) {
            setTimeout(() => {}, 500)
            const { value, done } = await reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            // value is a Uint8Array.
            console.log(value);
          }
        }}
      >
        Test
      </Button>
    </>
  );
}
