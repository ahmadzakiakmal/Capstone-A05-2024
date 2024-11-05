import { ReactNode } from "react";
import Card from "./Card";
import Button from "./Button";

interface Props {
  children: ReactNode;
  show: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function PopUp({
  children,
  show,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: Props) {
  if (show)
    return (
      <div className="w-screen h-screen fixed top-0 left-0 bg-dark-1/80 z-[10] flex flex-col justify-center items-center text-dark-1">
        <Card>
          {children}
          <div className="flex justify-center gap-5 text-white mt-6">
            {onConfirm && <Button onClick={() => onConfirm()}>{confirmText}</Button>}
            {onCancel && <Button onClick={() => onCancel()}>{cancelText}</Button>}
          </div>
        </Card>
      </div>
    );
}
