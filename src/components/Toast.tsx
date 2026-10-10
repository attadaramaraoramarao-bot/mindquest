import { useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={20} />,
      bg: "from-emerald-600 to-teal-600",
      border: "border-emerald-400/30",
    },
    error: {
      icon: <XCircle size={20} />,
      bg: "from-rose-600 to-red-600",
      border: "border-rose-400/30",
    },
    info: {
      icon: <Info size={20} />,
      bg: "from-sky-600 to-blue-600",
      border: "border-sky-400/30",
    },
  }[toast.type];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-sm pointer-events-none">
      <div
        className={`slide-up flex items-center gap-2 rounded-2xl bg-gradient-to-r ${config.bg} border ${config.border} px-4 py-3 text-white font-semibold text-sm shadow-xl backdrop-blur-md`}
      >
        {config.icon}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
