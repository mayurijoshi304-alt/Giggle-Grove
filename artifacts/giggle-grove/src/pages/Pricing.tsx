import { Button } from "@/components/ui/button";
import { SiGooglepay, SiPhonepe, SiVisa, SiMastercard } from "react-icons/si";

export default function Pricing() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the magic that fits your family.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          
          {/* Single Book */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-serif font-bold mb-2">Single Adventure</h3>
            <p className="text-muted-foreground mb-6">Perfect for a special occasion or gift.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground"> / book</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">✓</div>
                <span>1 Personalized AI Storybook</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">✓</div>
                <span>Instant PDF Download</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">✓</div>
                <span>Custom Avatar Generation</span>
              </li>
            </ul>
            <Button className="w-full h-12 rounded-xl" variant="outline">Choose Single</Button>
          </div>

          {/* Subscription */}
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider">
              MOST POPULAR
            </div>
            
            <h3 className="text-2xl font-serif font-bold mb-2">Magic Monthly</h3>
            <p className="text-white/80 mb-6">A new adventure every week.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$24.99</span>
              <span className="text-white/80"> / month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow text-white/90">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span>4 Storybooks per month</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span>Unlimited Colouring Pages</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span>Priority Support</span>
              </li>
            </ul>
            <Button className="w-full h-12 rounded-xl bg-white text-primary hover:bg-white/90 font-bold">Subscribe Now</Button>
          </div>

        </div>

        {/* Payment Methods */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-semibold gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Card
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
              <SiGooglepay size={40} />
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
              <SiPhonepe size={32} />
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-bold text-lg">
              UPI
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm gap-2 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1a2 2 0 0 0 2-2V7"/><path d="M21 12v.01"/></svg>
              QR Code
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
