import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiGooglepay, SiPhonepe } from "react-icons/si";
import { Check, MessageCircle, Mail, X } from "lucide-react";

const WHATSAPP_NUMBER = "13304949649";
const EMAIL = "hello@gigglegrove.com";

type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  color: string;
};

const PLANS: Plan[] = [
  {
    name: "Single Adventure",
    price: "$9.99",
    period: "one-time",
    features: ["1 Personalized AI Storybook", "Instant PDF Download", "Custom Avatar Generation"],
    color: "bg-white border-slate-200"
  },
  {
    name: "Magic Monthly",
    price: "$24.99",
    period: "per month",
    features: ["4 Storybooks per month", "Unlimited Colouring Pages", "Priority Support"],
    color: "bg-gradient-to-br from-primary to-purple-600"
  }
];

function CheckoutModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const isSubscription = plan.period === "per month";
  const waMessage = encodeURIComponent(
    `Hi! I'd like to order the Giggle Grove ${plan.name} plan (${plan.price}${isSubscription ? "/month" : ""}). Please let me know the next steps!`
  );
  const emailSubject = encodeURIComponent(`Giggle Grove Order — ${plan.name}`);
  const emailBody = encodeURIComponent(
    `Hi Giggle Grove team,\n\nI'd like to purchase the ${plan.name} plan at ${plan.price}${isSubscription ? "/month" : ""}.\n\nPlease send me the payment details.\n\nThank you!`
  );

  const paymentMethods = [
    {
      label: "Pay via WhatsApp",
      sublabel: "Chat with us to complete your order",
      icon: <MessageCircle className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50 border-green-200 hover:bg-green-100",
      textColor: "text-green-800",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`,
    },
    {
      label: "Pay via Email",
      sublabel: "Send us your order by email",
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-800",
      href: `mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`,
    },
    {
      label: "Google Pay / UPI",
      sublabel: "We'll send you our UPI ID on WhatsApp",
      icon: <SiGooglepay size={28} className="text-slate-600" />,
      bg: "bg-slate-50 border-slate-200 hover:bg-slate-100",
      textColor: "text-slate-800",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I want to pay via Google Pay / UPI for the ${plan.name} plan.`)}`,
    },
    {
      label: "PhonePe / Card",
      sublabel: "Contact us for secure card & PhonePe payment",
      icon: <SiPhonepe size={24} className="text-purple-600" />,
      bg: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      textColor: "text-purple-800",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I want to pay via PhonePe or Card for the ${plan.name} plan.`)}`,
    },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-primary/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-purple-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-white text-left">
              Complete Your Order
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <p className="font-bold text-lg">{plan.name}</p>
            <p className="text-3xl font-bold mt-1">{plan.price} <span className="text-sm font-normal text-white/80">/ {plan.period}</span></p>
            <ul className="mt-3 space-y-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                  <Check className="w-4 h-4 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-6 space-y-3">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Choose How to Pay</p>
          {paymentMethods.map((method, i) => (
            <a
              key={i}
              href={method.href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer block ${method.bg}`}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                {method.icon}
              </div>
              <div>
                <p className={`font-bold text-sm ${method.textColor}`}>{method.label}</p>
                <p className="text-xs text-slate-500">{method.sublabel}</p>
              </div>
              <div className="ml-auto text-slate-300">→</div>
            </a>
          ))}
          <p className="text-xs text-center text-slate-400 mt-4 pt-2">
            We'll confirm your order and deliver your magical book within 24 hours. 🪄
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

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
              {["1 Personalized AI Storybook", "Instant PDF Download", "Custom Avatar Generation"].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs"><Check className="w-3 h-3" /></div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full h-12 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold"
              variant="outline"
              onClick={() => setSelectedPlan(PLANS[0])}
            >
              Get Started — $9.99
            </Button>
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
              {["4 Storybooks per month", "Unlimited Colouring Pages", "Priority Support"].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-3 h-3" /></div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full h-12 rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-lg transition-all"
              onClick={() => setSelectedPlan(PLANS[1])}
            >
              Subscribe Now — $24.99/mo
            </Button>
          </div>

        </div>

        {/* Payment Methods */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-semibold gap-2 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all" onClick={() => setSelectedPlan(PLANS[0])}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Card
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md transition-all" onClick={() => setSelectedPlan(PLANS[0])}>
              <SiGooglepay size={40} />
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md transition-all" onClick={() => setSelectedPlan(PLANS[0])}>
              <SiPhonepe size={32} />
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm font-bold text-lg cursor-pointer hover:border-primary/30 hover:shadow-md transition-all" onClick={() => setSelectedPlan(PLANS[0])}>
              UPI
            </div>
            <div className="bg-white h-16 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm gap-2 font-medium cursor-pointer hover:border-primary/30 hover:shadow-md transition-all" onClick={() => setSelectedPlan(PLANS[0])}>
              <MessageCircle className="w-5 h-5 text-green-500" />
              WhatsApp
            </div>
          </div>
        </div>

      </div>

      {selectedPlan && <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </div>
  );
}
