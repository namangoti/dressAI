import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles } from "lucide-react";

type Tab = "login" | "signup";
type SocialProvider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.91 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 fill-current" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

export default function Login() {
  const { login, signup, socialLogin } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      let err: string | null = null;
      if (tab === "login") {
        err = login(email.trim(), password);
      } else {
        if (name.trim().length < 2) {
          err = "Please enter your full name.";
        } else if (password.length < 6) {
          err = "Password must be at least 6 characters.";
        } else {
          err = signup(name.trim(), email.trim(), password);
        }
      }
      if (err) setError(err);
      setLoading(false);
    }, 500);
  }

  function handleSocial(provider: SocialProvider) {
    setSocialLoading(provider);
    setTimeout(() => {
      socialLogin(provider);
      setSocialLoading(null);
    }, 900);
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Brand header */}
      <div className="bg-gradient-to-br from-primary via-purple-600 to-pink-500 pt-14 pb-12 px-6 flex flex-col items-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-xl">
          <span className="text-white font-black text-3xl italic leading-none">M</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-1">DressAI</h1>
        <p className="text-white/75 text-sm flex items-center gap-1.5">
          <Sparkles size={12} /> Virtual Try-On Fashion
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 -mt-5 bg-background rounded-t-3xl px-5 pt-7 pb-10 overflow-y-auto">

        {/* Social login buttons */}
        <div className="space-y-3 mb-6">
          <button
            data-testid="button-google-login"
            onClick={() => handleSocial("google")}
            disabled={!!socialLoading || loading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-border bg-background font-semibold text-sm text-foreground hover-elevate active-elevate-2 transition-all disabled:opacity-60"
          >
            {socialLoading === "google" ? (
              <span className="w-5 h-5 rounded-full border-2 border-border border-t-foreground animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          <button
            data-testid="button-apple-login"
            onClick={() => handleSocial("apple")}
            disabled={!!socialLoading || loading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-[#000] text-white font-semibold text-sm hover-elevate active-elevate-2 transition-all disabled:opacity-60"
          >
            {socialLoading === "apple" ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <AppleIcon />
            )}
            Continue with Apple
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Tab switcher */}
        <div className="flex bg-secondary/50 rounded-xl p-1 mb-5">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              data-testid={`tab-${t}`}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Full Name
              </label>
              <input
                data-testid="input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
                className="w-full h-12 rounded-xl border border-border bg-secondary/30 px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Email
            </label>
            <input
              data-testid="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full h-12 rounded-xl border border-border bg-secondary/30 px-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                data-testid="input-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                className="w-full h-12 rounded-xl border border-border bg-secondary/30 px-4 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                data-testid="button-toggle-password"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p data-testid="text-auth-error" className="text-destructive text-xs font-medium px-1">
              {error}
            </p>
          )}

          <Button
            data-testid="button-submit-auth"
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/25"
            disabled={loading || !!socialLoading}
          >
            {loading
              ? tab === "login" ? "Logging in…" : "Creating account…"
              : tab === "login" ? "Log In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              data-testid={`link-switch-to-${tab === "login" ? "signup" : "login"}`}
              onClick={() => switchTab(tab === "login" ? "signup" : "login")}
              className="text-primary font-semibold"
            >
              {tab === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-6 px-4 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
