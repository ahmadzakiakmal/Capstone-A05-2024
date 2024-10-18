import Image from "next/image";
import Logo from "@/../public/Logo.png";

export default function Home() {
  return(
    <main className="bg-gradient-to-tr from-cyan-primary to-green-primary min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white/90 rounded-[10px] py-20 px-40">
         <Image src={Logo} alt="Logo" />
      </div>
    </main>
  )
}