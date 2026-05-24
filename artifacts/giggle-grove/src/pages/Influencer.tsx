import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterInfluencer } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";

export default function Influencer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [locationStr, setLocationStr] = useState("");
  
  const [registeredCode, setRegisteredCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const registerMutation = useRegisterInfluencer();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    registerMutation.mutate({
      data: {
        name,
        email,
        instagramHandle: instagramHandle || undefined,
        location: locationStr || undefined
      }
    }, {
      onSuccess: (res) => {
        setRegisteredCode(res.referralCode);
        toast.success("Welcome to the family! Your code is ready.");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const copyLink = () => {
    if (!registeredCode) return;
    const link = `https://gigglegroove.com/?ref=${registeredCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Share the Magic, <br />
              <span className="text-primary">Earn Rewards</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join the Giggle Grove Influencer Program. Share personalized storybooks with your audience and earn generous commissions on every sale.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "20% commission on every generated book",
                "Exclusive access to new features",
                "Free monthly books for your own kids",
                "Custom promo cards for your stories/reels"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="font-medium text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            {registeredCode ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-4"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-center">You're all set!</h3>
                <p className="text-center text-muted-foreground">
                  Your personalized referral link is ready to share.
                </p>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Your Referral Link</label>
                  <div className="flex gap-2">
                    <Input 
                      readOnly 
                      value={`https://gigglegroove.com/?ref=${registeredCode}`}
                      className="bg-white font-mono text-sm"
                    />
                    <Button onClick={copyLink} size="icon" variant="outline" className="shrink-0 bg-white">
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-xl p-6 mt-6">
                  <h4 className="font-bold text-primary mb-2">Performance Tracker</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-slate-800">0</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Clicks</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-primary">$0.00</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Earned</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5 relative z-10">
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-1">Apply Now</h3>
                  <p className="text-sm text-muted-foreground mb-6">Takes less than a minute.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-slate-50"
                    placeholder="Sarah Smith"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-slate-50"
                    placeholder="sarah@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Instagram Handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                    <Input 
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="h-12 bg-slate-50 pl-8"
                      placeholder="sarah.styles"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Location (City, State)</label>
                  <Input 
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}
                    className="h-12 bg-slate-50"
                    placeholder="e.g. Columbus, OH"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg shadow-primary/20 mt-4"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Generate My Referral Link
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
