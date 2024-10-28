import Image from "next/image";
import Logo from "@/../public/Logo.png"

export default function Navbar() {
  return(
    <nav className="flex flex-row justify-between items-center bg-gradient-to-tr from-green-primary to-cyan-primary px-6 py-3">
      <Image src={Logo} alt="Logo" className="size-[80px]" />

      <button className="flex flex-col gap-[5px]">
        <div className="h-[7px] w-10 bg-dark-1 rounded-full" />
        <div className="h-[7px] w-10 bg-dark-1 rounded-full" />
        <div className="h-[7px] w-10 bg-dark-1 rounded-full" />
      </button>
    </nav>
  )
}