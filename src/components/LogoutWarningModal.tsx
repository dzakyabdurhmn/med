import { useState } from "react";
import { X, LogOut, AlertTriangle } from "lucide-react";

interface LogoutWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  isDoctor?: boolean;
}

export function LogoutWarningModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "Dokter",
  isDoctor = true,
}: LogoutWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="card-warm p-6 max-w-md w-full border-[#D1D0C6] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <span className="text-base font-medium text-[#191918]">
              Konfirmasi Logout
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6A6A64] hover:text-[#191918] p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[#191918] font-medium text-sm">
              {isDoctor 
                ? `Apakah Anda yakin ingin keluar dari akun ${userName}?` 
                : `Apakah Anda yakin ingin keluar dari akun Anda?`
              }
            </p>
            <p className="text-sm text-[#474744] leading-relaxed">
              {isDoctor 
                ? "Anda akan keluar dari sesi dokter DPJP. Semua data yang belum disimpan akan hilang."
                : "Anda akan keluar dari sesi saat ini. Data yang belum tersimpan akan hilang."
              }
            </p>
          </div>

          {/* Status badge jika ada */}
          {isDoctor && (
            <div className="badge-warm badge-warm-brand px-3 py-1.5 text-xs justify-center">
              <span className="text-[#9E1B2E]">⚠️ Sesi Dokter DPJP Aktif</span>
            </div>
          )}

          {/* Dampak logout */}
          <div className="bg-[#F8F7F0] border border-[#E3E2D8] rounded-[2px] p-3 space-y-1.5">
            <p className="text-xs font-medium text-[#191918] uppercase tracking-[0.05em]">
              Yang akan hilang:
            </p>
            <ul className="text-xs text-[#474744] space-y-1 list-disc list-inside">
              <li>Progress pengisian resume medis yang belum disimpan</li>
              <li>Sesi konsultasi aktif yang belum diarsipkan</li>
              <li>Perubahan pada form rekam medis yang belum tersimpan</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECEBDF]">
          <button
            type="button"
            onClick={onClose}
            className="btn-warm btn-warm-outline btn-warm-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-warm btn-warm-primary btn-warm-sm bg-[#9E1B2E] hover:bg-[#7A1523] border-[#9E1B2E]"
          >
            <LogOut size={14} className="text-white" />
            <span className="text-white">Logout Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function useLogoutWarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);
  const [userName, setUserName] = useState("Dokter");
  const [isDoctor, setIsDoctor] = useState(true);

  const showLogoutWarning = (
    confirmCallback: () => void,
    options?: {
      userName?: string;
      isDoctor?: boolean;
    }
  ) => {
    setUserName(options?.userName || "Dokter");
    setIsDoctor(options?.isDoctor ?? true);
    setOnConfirmCallback(() => confirmCallback);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const Modal = () => (
    <LogoutWarningModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      userName={userName}
      isDoctor={isDoctor}
    />
  );

  return {
    showLogoutWarning,
    Modal,
    isOpen,
  };
}