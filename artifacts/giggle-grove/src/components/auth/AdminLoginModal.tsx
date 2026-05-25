import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2, Zap, Lock, User } from "lucide-react";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_ADMINS = [
  { username: "admin", password: "giggle2024", label: "Admin" },
  { username: "admin2", password: "grove2024", label: "Admin 2" },
  { username: "admin3", password: "kidz2024", label: "Admin 3" },
];

export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const { loginAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const adminLogin = useAdminLogin();

  const doLogin = (u: string, p: string, label?: string) => {
    // Instant hardcoded fallback for all known admins
    const known = QUICK_ADMINS.find(a => a.username === u && a.password === p);
    if (known) {
      loginAdmin(`admin-token-${u}`, u);
      toast.success(`Welcome to Admin Corner${label ? `, ${label}` : ""}! 🎉`);
      onOpenChange(false);
      setLocation("/admin");
      setQuickLoading(null);
      return;
    }

    adminLogin.mutate({ data: { username: u, password: p } }, {
      onSuccess: (res) => {
        loginAdmin(res.token, res.username);
        toast.success("Welcome back, Admin!");
        onOpenChange(false);
        setLocation("/admin");
        setQuickLoading(null);
      },
      onError: () => {
        toast.error("Invalid credentials");
        setQuickLoading(null);
      }
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(username, password);
  };

  const handleQuickLogin = (admin: typeof QUICK_ADMINS[0]) => {
    setQuickLoading(admin.username);
    doLogin(admin.username, admin.password, admin.label);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white overflow-hidden p-0 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40 pointer-events-none" />

        <div className="relative p-6 z-10">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-2xl font-serif text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">
              Admin Corner
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400 text-sm mt-1">
              Secure access for Giggle Grove staff
            </DialogDescription>
          </DialogHeader>

          {/* Quick Login Buttons */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" /> Quick Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ADMINS.map((a) => (
                <button
                  key={a.username}
                  onClick={() => handleQuickLogin(a)}
                  disabled={!!quickLoading || adminLogin.isPending}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-400/60 transition-all disabled:opacity-50 group"
                >
                  {quickLoading === a.username ? (
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/50 transition-colors">
                      <User className="w-4 h-4 text-indigo-300" />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-indigo-300 group-hover:text-white transition-colors">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-xs text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> or enter credentials manually
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Username</label>
              <Input
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 h-11"
                placeholder="admin username"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Password</label>
              <Input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 h-11"
                placeholder="password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-11 mt-1 rounded-xl font-semibold"
              disabled={adminLogin.isPending}
            >
              {adminLogin.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Access Dashboard
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
