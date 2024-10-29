import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({children, className}: Props) {
  return(
    <div className={`bg-white opacity-90 rounded-[10px] p-10 ${className}`}>
      {children}
    </div>
  )
}