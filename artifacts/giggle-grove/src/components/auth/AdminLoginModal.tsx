import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginModal({ open, onOpenChange }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const adminLogin = useAdminLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick demo fallback if API fails or for easy testing
    if (username === "admin" && password === "giggle2024") {
      loginAdmin("demo-token", username);
      toast.success("Welcome to Admin Corner");
      onOpenChange(false);
      setLocation("/admin");
      return;
    }

    adminLogin.mutate({ data: { username, password } }, {
      onSuccess: (res) => {
        loginAdmin(res.token, res.username);
        toast.success("Welcome back, Admin!");
        onOpenChange(false);
        setLocation("/admin");
      },
      onError: () => {
        toast.error("Invalid admin credentials");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white overflow-hidden p-0 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40 pointer-events-none" />
        
        <div className="relative p-6 z-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-serif text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">
              Admin Corner
            </DialogTitle>
            <p className="text-center text-slate-400 text-sm mt-2">
              Secure access for Giggle Grove staff.
              <br />
              <span className="text-xs opacity-50">(demo: admin / giggle2024)</span>
            </p>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Username</label>
              <Input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                placeholder="Enter admin username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                placeholder="Enter password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
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
