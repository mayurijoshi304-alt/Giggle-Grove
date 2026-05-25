import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, PackageCheck, Loader2, Phone, Hash,
  Download, Printer, CheckCircle2, Clock, Zap,
  BookOpen, Truck, AlertCircle, MessageCircle,
} from "lucide-react";

const WHATSAPP_NUMBER = "13304949649";

type Order = {
  id: number;
  orderRef: string;
  customerName: string;
  phone: string;
  email: string | null;
  bookTitle: string;
  planName: string;
  status: string;
  downloadUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG: Record<string, {
  label: string; color: string; bg: string; border: string;
  icon: React.ReactNode; desc: string; step: number;
}> = {
  received: {
    label: "Order Received", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200",
    icon: <PackageCheck className="w-5 h-5 text-blue-600" />,
    desc: "We've received your order and it's in our queue!", step: 1,
  },
  in_progress: {
    label: "Being Created", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200",
    icon: <Zap className="w-5 h-5 text-amber-600" />,
    desc: "Our AI is crafting your magical personalized book right now! ✨", step: 2,
  },
  ready: {
    label: "Ready to Download", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    desc: "Your book is ready! Download and print it below.", step: 3,
  },
  delivered: {
    label: "Delivered", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200",
    icon: <Truck className="w-5 h-5 text-purple-600" />,
    desc: "Your book has been delivered. Enjoy reading! 🎉", step: 4,
  },
};

const STEPS = [
  { key: "received", label: "Received", icon: <PackageCheck className="w-4 h-4" /> },
  { key: "in_progress", label: "Creating", icon: <Zap className="w-4 h-4" /> },
  { key: "ready", label: "Ready", icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", icon: <Truck className="w-4 h-4" /> },
];

function ProgressStepper({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 1;
  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {STEPS.map((s, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                done ? "bg-emerald-500 border-emerald-500 text-white" :
                active ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" :
                "bg-white border-slate-200 text-slate-400"
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : s.icon}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${active ? "text-primary" : done ? "text-emerald-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.received;
  const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6b21a8] via-primary to-[#ec4899] px-6 py-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium mb-1">Order Reference</p>
            <p className="text-2xl font-bold font-mono tracking-wider">{order.orderRef}</p>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4 text-white/70 text-sm">
          <span>📖 {order.bookTitle}</span>
          <span>·</span>
          <span>{order.planName}</span>
          <span>·</span>
          <span>📅 {date}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        <ProgressStepper status={order.status} />

        <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${cfg.bg} ${cfg.border} mb-5`}>
          {cfg.icon}
          <div>
            <p className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</p>
            <p className="text-slate-600 text-sm mt-0.5">{cfg.desc}</p>
          </div>
        </div>

        {order.notes && (
          <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
            <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-slate-600 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Download + Print when ready */}
        {(order.status === "ready" || order.status === "delivered") && order.downloadUrl && (
          <div className="flex gap-3 mb-4">
            <a
              href={order.downloadUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-2xl transition-colors shadow-lg shadow-emerald-200"
            >
              <Download className="w-4 h-4" /> Download Full Book
            </a>
            <a
              href={order.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 px-5 rounded-2xl transition-colors"
            >
              <Printer className="w-4 h-4" /> Print
            </a>
          </div>
        )}

        {/* Still waiting */}
        {order.status !== "ready" && order.status !== "delivered" && (
          <div className="flex items-center gap-2 text-slate-500 text-sm px-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              Your book will be ready within <strong>24 hours</strong>.{" "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! Checking status for order ${order.orderRef}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Message us on WhatsApp
              </a>{" "}
              if you have questions.
            </span>
          </div>
        )}
      </div>
    </m.div>
  );
}

export default function OrderTracker() {
  const [mode, setMode] = useState<"phone" | "ref">("phone");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrders(null);

    try {
      const param = mode === "phone" ? `phone=${encodeURIComponent(query.trim())}` : `ref=${encodeURIComponent(query.trim())}`;
      const res = await fetch(`/api/orders/track?${param}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Order[] = await res.json();
      setOrders(data);
      if (data.length === 0) setError("No orders found. Try your WhatsApp number or order reference code.");
    } catch {
      setError("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#f9f5ff] to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">Enter your WhatsApp number or order reference to see your book's status.</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 mb-8">
          {/* Toggle */}
          <div className="flex gap-2 mb-5 bg-slate-100 rounded-2xl p-1">
            <button
              onClick={() => { setMode("phone"); setQuery(""); setOrders(null); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "phone" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Phone className="w-4 h-4" /> WhatsApp Number
            </button>
            <button
              onClick={() => { setMode("ref"); setQuery(""); setOrders(null); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "ref" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Hash className="w-4 h-4" /> Order Reference
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={mode === "phone" ? "e.g. +1 330 494 9649" : "e.g. GG-ABC123"}
              className="flex-1 h-12 rounded-2xl border-slate-200 text-base"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </form>

          {mode === "phone" && (
            <p className="text-xs text-slate-400 mt-3 px-1">Enter the WhatsApp number you used when placing your order (with or without country code).</p>
          )}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <m.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-semibold text-sm mb-1">Order not found</p>
                <p className="text-red-600 text-sm">{error}</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm trying to track my Giggle Grove order but can't find it.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Contact us on WhatsApp
                </a>
              </div>
            </m.div>
          )}

          {orders && orders.length > 0 && (
            <m.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <p className="text-sm text-slate-500 px-1">Found <strong>{orders.length}</strong> order{orders.length !== 1 ? "s" : ""}</p>
              {orders.map(order => <OrderCard key={order.id} order={order} />)}
            </m.div>
          )}
        </AnimatePresence>

        {/* Help strip */}
        {!orders && !error && (
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400">
              Don't have an order yet?{" "}
              <a href="/pricing" className="text-primary font-semibold hover:underline">View our plans →</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
