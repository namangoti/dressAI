import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Crown,
  FileText,
  Shield,
  MessageCircle,
  LogIn,
  Trash2,
  Info,
  Star,
  Share2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

function SectionRow({
  icon,
  label,
  right,
  destructive,
  onClick,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  destructive?: boolean;
  onClick?: () => void;
  testId?: string;
}) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover-elevate transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
            destructive
              ? "bg-destructive/10 text-destructive"
              : "bg-card text-foreground"
          }`}
        >
          {icon}
        </div>
        <span className={`font-medium ${destructive ? "text-destructive" : ""}`}>
          {label}
        </span>
      </div>
      {right ?? <ChevronRight size={18} className="text-muted-foreground" />}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground px-1">
        {title}
      </h3>
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 divide-y divide-border/40">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const appVersion = "1.0.0";

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "DressAI Try-On", url: window.location.origin });
    }
  }

  function handleDeleteAccount() {
    if (window.confirm("Are you sure? This will permanently delete your account.")) {
      localStorage.removeItem("dressai-users");
      logout();
    }
  }

  return (
    <MobileLayout title="Profile">
      <div className="p-5 pt-2 space-y-6">

        {/* Avatar */}
        <div className="flex flex-col items-center pt-2 pb-1">
          <div className="relative mb-3">
            <div className="w-22 h-22 rounded-full overflow-hidden border-4 border-background shadow-lg" style={{ width: 88, height: 88 }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-background">
              <Crown size={13} />
            </div>
          </div>
          <h2 className="text-xl font-bold">{user?.name ?? "Guest"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
        </div>

        {/* Premium card */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown size={15} className="text-yellow-300" />
                <span className="font-bold text-yellow-300">Premium Member</span>
              </div>
              <p className="text-xs text-white/80">Unlimited try-ons &amp; HD saves</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-white/20 text-white border-0"
              data-testid="button-manage-premium"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Support */}
        <Section title="Support">
          <SectionRow
            testId="button-terms"
            icon={<FileText size={17} />}
            label="Terms &amp; Conditions"
          />
          <SectionRow
            testId="button-privacy"
            icon={<Shield size={17} />}
            label="Privacy Policy"
          />
          <SectionRow
            testId="button-contact"
            icon={<MessageCircle size={17} />}
            label="Contact Us"
          />
        </Section>

        {/* Account */}
        <Section title="Account">
          <SectionRow
            testId="button-login"
            icon={<LogIn size={17} />}
            label="Log In"
          />
          <SectionRow
            testId="button-delete-account"
            icon={<Trash2 size={17} />}
            label="Delete Account"
            destructive
            onClick={handleDeleteAccount}
          />
        </Section>

        {/* About */}
        <Section title="About">
          <SectionRow
            testId="text-app-version"
            icon={<Info size={17} />}
            label="App Version"
            right={
              <span className="text-sm text-muted-foreground tabular-nums">
                {appVersion}
              </span>
            }
          />
          <SectionRow
            testId="button-rate-app"
            icon={<Star size={17} />}
            label="Rate the App"
          />
          <SectionRow
            testId="button-share-app"
            icon={<Share2 size={17} />}
            label="Share the App"
            onClick={handleShare}
          />
        </Section>

        {/* Log out */}
        <Button
          data-testid="button-logout"
          variant="ghost"
          className="w-full rounded-full h-12 text-destructive gap-2"
          onClick={logout}
        >
          <LogOut size={17} />
          Log Out
        </Button>

      </div>
    </MobileLayout>
  );
}
