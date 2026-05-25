import { useState, useEffect, useRef } from "react";
import {
  useListBooks,
  getListBooksQueryKey,
  useGetAdminSettings,
  getGetAdminSettingsQueryKey,
} from "@workspace/api-client-react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  BookOpen, Share2, ChevronLeft, ChevronRight,
  Download, Printer, Lock, MessageCircle, Mail,
  CheckCircle2, X, Unlock,
} from "lucide-react";
import { SiGooglepay, SiPhonepe } from "react-icons/si";

const WHATSAPP_NUMBER = "13304949649";
const EMAIL = "hello@gigglegrove.com";

/* ─── Purchased-books persistence ───────────────────────── */
function getPurchased(): Set<number> {
  try {
    const raw = localStorage.getItem("gg_purchased_books");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}
function markPurchased(id: number) {
  const s = getPurchased();
  s.add(id);
  localStorage.setItem("gg_purchased_books", JSON.stringify([...s]));
}

/* ─── BookPreviewModal ───────────────────────────────────── */
type Book = {
  id: number;
  title: string;
  previewUrl?: string | null;
  type: string;
  ageRange?: string | null;
};

function BookPreviewModal({
  book,
  freeLimit,
  onClose,
}: {
  book: Book;
  freeLimit: number;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const [unlocked, setUnlocked] = useState(() => getPurchased().has(book.id));
  const [paidStep, setPaidStep] = useState<"none" | "options" | "confirmed">("none");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const url = book.previewUrl || "";
  const isBlocked = !unlocked && page > freeLimit;

  /* update iframe page via src fragment */
  const iframeSrc = url ? `${url}#page=${page}` : null;

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => {
    if (isBlocked) return;
    setPage((p) => p + 1);
  };

  const handleUnlock = () => {
    markPurchased(book.id);
    setUnlocked(true);
    setPaidStep("confirmed");
    toast.success("🎉 Full book unlocked! Download or print below.");
  };

  const waMsg = encodeURIComponent(
    `Hi Giggle Grove! I'd like to purchase the full book: "${book.title}". Please send payment details.`
  );
  const mailSubj = encodeURIComponent(`Purchase: ${book.title}`);
  const mailBody = encodeURIComponent(
    `Hi Giggle Grove,\n\nI'd like to purchase the full book: "${book.title}".\nPlease send payment details.\n\nThank you!`
  );

  const payMethods = [
    {
      label: "Pay via WhatsApp",
      sub: "Chat to complete your order",
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      bg: "bg-green-50 border-green-200 hover:bg-green-100",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`,
    },
    {
      label: "Pay via Email",
      sub: "Send us your order",
      icon: <Mail className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      href: `mailto:${EMAIL}?subject=${mailSubj}&body=${mailBody}`,
    },
    {
      label: "Google Pay / UPI",
      sub: "We'll send UPI ID on WhatsApp",
      icon: <SiGooglepay size={22} className="text-slate-600" />,
      bg: "bg-slate-50 border-slate-200 hover:bg-slate-100",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! UPI payment for "${book.title}"`)}`,
    },
    {
      label: "PhonePe / Card",
      sub: "Contact us for card / PhonePe",
      icon: <SiPhonepe size={18} className="text-purple-600" />,
      bg: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! PhonePe/Card payment for "${book.title}"`)}`,
    },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden rounded-3xl border-primary/20 shadow-2xl bg-slate-950 flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#6b21a8] via-primary to-[#ec4899] shrink-0">
          <div className="min-w-0">
            <p className="text-white font-serif font-bold text-base leading-tight truncate">{book.title}</p>
            <p className="text-white/60 text-xs">{book.type === "storybook" ? "📖 Storybook" : "🎨 Colouring Book"}{book.ageRange ? ` · Ages ${book.ageRange}` : ""}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            {unlocked && url && (
              <>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setTimeout(() => window.focus(), 500)}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </a>
              </>
            )}
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative flex-1 min-h-0 bg-slate-900">
          {iframeSrc ? (
            <iframe
              ref={iframeRef}
              key={page}
              src={iframeSrc}
              className="w-full h-full border-0"
              style={{ minHeight: 420 }}
              title={`${book.title} – page ${page}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm py-24">
              No PDF link available
            </div>
          )}

          {/* Paywall overlay */}
          <AnimatePresence>
            {isBlocked && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center z-10"
              >
                {paidStep === "none" && (
                  <m.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-white text-2xl font-serif font-bold mb-2">Free preview ends here</h3>
                    <p className="text-slate-300 text-sm mb-1">You've viewed <span className="text-primary font-bold">{freeLimit} free pages</span>.</p>
                    <p className="text-slate-400 text-sm mb-6">Purchase the full book to download, print &amp; keep it forever!</p>
                    <Button
                      onClick={() => setPaidStep("options")}
                      className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-bold rounded-2xl text-base shadow-lg"
                    >
                      🛒 Purchase Full Book
                    </Button>
                    <button
                      onClick={() => { markPurchased(book.id); setUnlocked(true); setPaidStep("confirmed"); toast.success("Book unlocked!"); }}
                      className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                    >
                      I've already paid → Unlock now
                    </button>
                  </m.div>
                )}

                {paidStep === "options" && (
                  <m.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full">
                    <h3 className="text-white text-xl font-serif font-bold mb-1">Choose how to pay</h3>
                    <p className="text-slate-400 text-xs mb-5">After payment, tap "Unlock" below to access the full book.</p>
                    <div className="space-y-2 mb-4">
                      {payMethods.map((m2, i) => (
                        <a
                          key={i}
                          href={m2.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${m2.bg} cursor-pointer`}
                        >
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">{m2.icon}</div>
                          <div className="text-left">
                            <p className="font-bold text-slate-800 text-sm">{m2.label}</p>
                            <p className="text-slate-500 text-xs">{m2.sub}</p>
                          </div>
                          <span className="ml-auto text-slate-300 text-sm">→</span>
                        </a>
                      ))}
                    </div>
                    <Button
                      onClick={handleUnlock}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-4 h-4" /> I've Paid — Unlock Full Book
                    </Button>
                    <button onClick={() => setPaidStep("none")} className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">← Back</button>
                  </m.div>
                )}

                {paidStep === "confirmed" && (
                  <m.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-sm w-full text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-white text-2xl font-serif font-bold mb-2">Full Book Unlocked! 🎉</h3>
                    <p className="text-slate-300 text-sm mb-6">Use the Download &amp; Print buttons at the top to save your book.</p>
                    <Button onClick={() => { setUnlocked(true); }} className="w-full bg-primary text-white rounded-2xl h-11">
                      Continue Reading
                    </Button>
                  </m.div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Page Nav + Status */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={page <= 1}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>

          <div className="text-center">
            {unlocked ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm">Page {page} — Full Access</span>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white font-semibold text-sm">Page {page}</p>
                <p className="text-slate-500 text-xs">{Math.max(0, freeLimit - page + 1) > 0 ? `${Math.max(0, freeLimit - page + 1)} free page${freeLimit - page + 1 !== 1 ? "s" : ""} left` : "Purchase to continue"}</p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            disabled={isBlocked}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-30"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Samples Page ──────────────────────────────────── */
export default function Samples() {
  const { data: books, isLoading } = useListBooks({
    query: { queryKey: getListBooksQueryKey() },
  });
  const { data: settings } = useGetAdminSettings({
    query: { queryKey: getGetAdminSettingsQueryKey() },
  });

  const freeLimit = settings?.freePreviewLimit ?? 5;

  const [activeBook, setActiveBook] = useState<Book | null>(null);

  const handleShare = (id: number) => {
    const url = `${window.location.origin}/samples?book=${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const openBook = (book: Book) => {
    if (!book.previewUrl) {
      toast.error("Preview not available yet.");
      return;
    }
    setActiveBook(book);
  };

  return (
    <div className="bg-[#FAFAFA] py-16 min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Sample Library</h1>
          <p className="text-lg text-muted-foreground mb-3">
            Explore our magical personalized storybooks and colouring pages.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            Free preview: first <strong>{freeLimit} pages</strong> of each book — purchase to download &amp; print the full book
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !books?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-primary/40" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Coming Soon!</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Our magical sample books are being prepared. Check back soon!
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white" onClick={() => window.location.href = "/contact"}>
                Get Notified
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {books.map((book, i) => {
              const isPurchased = getPurchased().has(book.id);
              return (
                <m.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={book.coverUrl || undefined}
                      alt={book.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/600x800/f3e8ff/a855f7?text=${encodeURIComponent(book.title)}`;
                      }}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <Badge className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold border-0 shadow-sm">
                        {book.type === "storybook" ? "📖 Storybook" : "🎨 Colouring Book"}
                      </Badge>
                      {book.ageRange && (
                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs border-0 shadow-sm">
                          Ages {book.ageRange}
                        </Badge>
                      )}
                    </div>
                    {isPurchased && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          <CheckCircle2 className="w-3 h-3" /> Purchased
                        </span>
                      </div>
                    )}
                    {/* Free pages badge */}
                    {!isPurchased && (
                      <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                          <BookOpen className="w-3 h-3" /> {freeLimit} free pages
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-foreground mb-1 leading-snug">{book.title}</h3>
                    {book.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{book.description}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm h-10"
                        onClick={() => openBook(book)}
                      >
                        {isPurchased ? (
                          <><Download className="w-3.5 h-3.5 mr-1.5" /> Download</>
                        ) : (
                          <><BookOpen className="w-3.5 h-3.5 mr-1.5" /> Read Preview</>
                        )}
                      </Button>
                      {isPurchased && (
                        <a
                          href={book.previewUrl ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0"
                          title="Print book"
                        >
                          <Printer className="w-4 h-4" />
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl h-10 w-10 border-slate-200 shrink-0"
                        onClick={() => handleShare(book.id)}
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </m.div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-app PDF viewer modal */}
      {activeBook && (
        <BookPreviewModal
          book={activeBook}
          freeLimit={freeLimit}
          onClose={() => setActiveBook(null)}
        />
      )}
    </div>
  );
}
