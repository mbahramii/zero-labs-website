"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string; // e.g., "شماره تلفن" or "اکانت"
}

export default function ConfirmDeleteModal({ 
  isOpen, onClose, onConfirm, itemName, itemType 
}: ConfirmDeleteModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-soft p-6 m-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          
          <h3 className="text-lg font-bold text-text-primary mb-2">
            آیا مطمئن هستید؟
          </h3>
          
          <p className="text-sm text-text-secondary mb-6">
            آیا می‌خواهید {itemType} <span className="font-semibold text-text-primary">{itemName}</span> را حذف کنید؟ 
            این عملیات قابل بازگشت نیست.
          </p>
          
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-bg py-3 text-sm font-medium text-text-secondary hover:bg-surface-soft transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              بله، حذف کن
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute left-4 top-4 text-text-secondary hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}