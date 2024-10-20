import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, className, disabled = false }: Props) {
  return (
    <button
      disabled = {disabled}
      className={`px-6 py-[10px] bg-dark-1 hover:bg-dark-2 transition-colors active:bg-black active:shadow-[0_0_2px_rgba(0,0,0,.9)] rounded-[10px] font-semibold disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
