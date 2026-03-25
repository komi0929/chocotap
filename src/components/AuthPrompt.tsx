"use client";

import { GoogleIcon, CloseIcon } from "./Icons";

interface AuthPromptProps {
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export default function AuthPrompt({ onClose, onContinueAsGuest }: AuthPromptProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="relative glass-card p-6 w-full max-w-sm animate-slide-up z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-dim hover:text-choco transition">
          <CloseIcon />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-choco to-choco-warm flex items-center justify-center">
            <span className="text-white text-lg">🍫</span>
          </div>
          <h3 className="font-serif text-xl font-semibold text-choco">
            チェックインするには
          </h3>
          <p className="text-sm text-text-dim mt-1">
            記録を保存するためにアカウントを作成してください
          </p>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-cream-deep text-sm font-medium text-choco hover:shadow-md transition-all duration-200">
          <GoogleIcon className="w-5 h-5" />
          Google でログイン
        </button>

        {/* Email */}
        <button className="w-full mt-3 py-3 rounded-2xl bg-choco text-white text-sm font-medium hover:bg-choco-warm transition-all duration-200">
          メールで登録
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-cream-deep" />
          <span className="text-xs text-text-dim">or</span>
          <div className="flex-1 h-px bg-cream-deep" />
        </div>

        {/* Guest continue */}
        <button
          onClick={onContinueAsGuest}
          className="w-full py-2.5 text-sm text-text-dim hover:text-choco transition"
        >
          ゲストのまま記録する
        </button>
        <p className="text-[10px] text-text-dim text-center mt-1">
          ※ ゲストの記録はこの端末にのみ保存されます
        </p>
      </div>
    </div>
  );
}
