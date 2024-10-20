import Image from "next/image";
import Logo from "@/../public/Logo.png";
import Button from "@/components/Button";

export default function Home() {
  return(
    <main className="bg-gradient-to-tr from-cyan-primary to-green-primary min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white/90 rounded-[10px] py-20 px-40 flex flex-col justify-center items-center gap-5">
         <Image src={Logo} alt="Logo" />
         <Button>
          Start
         </Button>
      </div>
    </main>
  )
}