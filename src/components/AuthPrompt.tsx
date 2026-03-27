"use client";

import { useState } from "react";
import { GoogleIcon, CloseIcon } from "./Icons";

interface AuthPromptProps {
  onClose: () => void;
  onContinueAsGuest: () => void;
  onSignInWithGoogle: () => void;
  onSignInWithEmail?: (email: string, password: string) => Promise<{ error: unknown }>;
  onSignUpWithEmail?: (email: string, password: string) => Promise<{ error: unknown }>;
}

export default function AuthPrompt({
  onClose,
  onContinueAsGuest,
  onSignInWithGoogle,
  onSignUpWithEmail,
}: AuthPromptProps) {
  const [mode, setMode] = useState<"choice" | "email">("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError("");
    setLoading(true);

    try {
      if (isSignUp && onSignUpWithEmail) {
        const { error: err } = await onSignUpWithEmail(email, password);
        if (err) {
          setError(String((err as { message?: string }).message || "登録に失敗しました"));
        } else {
          setSuccess("確認メールを送信しました。メール内のリンクをクリックしてください。");
        }
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-choco/50" onClick={onClose} />

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

        {mode === "choice" ? (
          <>
            {/* Google Login */}
            <button
              onClick={onSignInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-cream-deep text-sm font-medium text-choco hover:shadow-md transition-all duration-200"
            >
              <GoogleIcon className="w-5 h-5" />
              Google でログイン
            </button>

            {/* Email mode */}
            <button
              onClick={() => setMode("email")}
              className="w-full mt-3 py-3 rounded-2xl bg-choco text-white text-sm font-medium hover:bg-choco-warm transition-all duration-200"
            >
              メールで登録
            </button>
          </>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-cream-deep text-sm text-choco placeholder:text-text-dim/60 outline-none focus:ring-2 focus:ring-choco-milk/30"
              required
            />
            <input
              type="password"
              placeholder="パスワード（6文字以上）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-cream-deep text-sm text-choco placeholder:text-text-dim/60 outline-none focus:ring-2 focus:ring-choco-milk/30"
              minLength={6}
              required
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-choco text-white text-sm font-medium hover:bg-choco-warm transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "処理中..." : isSignUp ? "アカウント作成" : "ログイン"}
            </button>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-xs text-text-dim hover:text-choco transition"
            >
              {isSignUp ? "すでにアカウントをお持ちの方 →" : "新規登録はこちら →"}
            </button>

            <button
              type="button"
              onClick={() => setMode("choice")}
              className="w-full text-xs text-text-dim hover:text-choco transition"
            >
              ← 戻る
            </button>
          </form>
        )}

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
