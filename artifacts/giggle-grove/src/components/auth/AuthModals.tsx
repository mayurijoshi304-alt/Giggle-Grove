import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useCreateUser } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "signin" | "signup";
}

export function AuthModals({ open, onOpenChange, defaultType = "signin" }: AuthModalsProps) {
  const [type, setType] = useState<"signin" | "signup">(defaultType);
  const { loginUser } = useAuth();
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const createUser = useCreateUser();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) return;
    
    loginUser(signInEmail, "Parent");
    toast.success("Welcome back to Giggle Grove!");
    onOpenChange(false);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpName) return;

    createUser.mutate({
      data: {
        email: signUpEmail,
        name: signUpName,
        referralCode: referralCode || undefined
      }
    }, {
      onSuccess: (user) => {
        loginUser(user.email, user.name || "Parent");
        toast.success("Account created! Let the magic begin.");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("Failed to create account. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[2rem] border-primary/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 opacity-90" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-pink-300/30 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl" />
        
        <div className="relative p-8 z-10">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-serif text-center gradient-text">
              {type === "signin" ? "Welcome Back" : "Join the Magic"}
            </DialogTitle>
            <p className="text-center text-muted-foreground text-sm mt-2">
              {type === "signin" 
                ? "Sign in to continue your storytelling journey." 
                : "Create an account to unlock personalized stories."}
            </p>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {type === "signin" ? (
              <motion.form 
                key="signin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignIn} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary/80">Email Address</label>
                  <Input 
                    required
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="bg-white/60 border-primary/10 focus-visible:ring-primary/40 rounded-xl h-11"
                    placeholder="parent@example.com"
                  />
                </div>
                
                <Button type="submit" className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 mt-4">
                  Sign In
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  New to Giggle Grove?{" "}
                  <button type="button" onClick={() => setType("signup")} className="text-primary font-semibold hover:underline">
                    Create an account
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignUp} 
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary/80">Parent's Name</label>
                  <Input 
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="bg-white/60 border-primary/10 focus-visible:ring-primary/40 rounded-xl h-11"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary/80">Email Address</label>
                  <Input 
                    required
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="bg-white/60 border-primary/10 focus-visible:ring-primary/40 rounded-xl h-11"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary/80 flex justify-between">
                    <span>Referral Code</span>
                    <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                  </label>
                  <Input 
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="bg-white/60 border-primary/10 focus-visible:ring-primary/40 rounded-xl h-11 uppercase"
                    placeholder="MAGIC123"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 mt-4"
                  disabled={createUser.isPending}
                >
                  {createUser.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Join the Magic
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setType("signin")} className="text-primary font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
