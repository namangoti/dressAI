import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles } from "lucide-react";

type Tab = "login" | "signup";

export default function Login() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="bg-gradient-to-br from-primary via-purple-600 to-pink-500 pt-16 pb-12 px-6 flex flex-col items-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4 shadow-xl">
          <span className="text-white font-black text-3xl italic leading-none">M</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-1">DressAI</h1>
        <p className="text-white/75 text-sm flex items-center gap-1">
          <Sparkles size={12} /> Virtual Try-On Fashion
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 -mt-5 bg-background rounded-t-3xl px-6 pt-8 pb-10">

        {/* Tabs */}
        <div className="flex bg-secondary/50 rounded-xl p-1 mb-7">
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
            className="w-full h-12 rounded-xl font-bold text-sm shadow-md shadow-primary/25 mt-2"
            disabled={loading}
          >
            {loading
              ? tab === "login" ? "Logging in…" : "Creating account…"
              : tab === "login" ? "Log In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
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

        <p className="text-[10px] text-muted-foreground text-center mt-8 px-4 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
