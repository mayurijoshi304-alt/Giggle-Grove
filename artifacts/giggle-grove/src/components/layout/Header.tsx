import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";
import { AuthModals } from "@/components/auth/AuthModals";
import { useAuth } from "@/hooks/use-auth";
import { m, AnimatePresence } from "framer-motion";
import { Mail, Instagram, MessageCircle, Menu, X } from "lucide-react";

const WHATSAPP_NUMBER = "13304949649";
const EMAIL = "hello@gigglegrove.com";
const INSTAGRAM = "https://instagram.com/gigglegrove";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/samples", label: "Sample Stories" },
  { href: "/influencer", label: "Programs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutUser, admin, logoutAdmin } = useAuth();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (type: "signin" | "signup") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          MEGA TOP BAR — Brand + Links + Contact
         ══════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#6b21a8] via-primary to-[#ec4899] shadow-lg">

        {/* Row 1 — Brand info + contact links */}
        <div className="border-b border-white/20">
          <div className="container mx-auto px-4 h-10 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm tracking-wide">✨ Giggle Grove</span>
              <span className="hidden md:inline text-white/60 text-xs">|</span>
              <span className="hidden md:inline text-white/80 text-xs">Magical, personalized storytelling &amp; colouring books for little ones</span>
            </div>
            {/* Contact + Social */}
            <div className="flex items-center gap-4">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Email Us</span>
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Row 2 — Nav links + Auth */}
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Admin Corner */}
          <div className="w-32 shrink-0">
            {admin ? (
              <div className="flex items-center gap-2">
                <button onClick={logoutAdmin} className="text-xs text-white/70 hover:text-white transition-colors font-medium">Logout</button>
                <Link href="/admin" className="text-xs text-white font-bold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">Dashboard</Link>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="text-xs font-semibold text-white/80 hover:text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors border border-white/20"
              >
                Admin Corner
              </button>
            )}
          </div>

          {/* Nav Links — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  location === link.href
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/90 hover:text-white hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 w-32 justify-end shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 hidden md:inline truncate max-w-[80px]">Hi, {user.name}</span>
                <button onClick={logoutUser} className="text-xs text-white/80 hover:text-white font-medium transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => openAuth("signin")} className="text-sm font-semibold text-white/90 hover:text-white transition-colors hidden sm:block whitespace-nowrap">
                  Sign In
                </button>
                <button onClick={() => openAuth("signup")} className="text-sm font-bold bg-white text-primary hover:bg-white/90 px-4 py-1.5 rounded-full shadow-sm transition-all whitespace-nowrap">
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button className="lg:hidden text-white ml-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[96px] left-0 right-0 z-40 bg-gradient-to-b from-[#6b21a8] to-primary border-t border-white/20 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    location === link.href ? "bg-white text-primary" : "text-white hover:bg-white/20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/20 mt-2 pt-3 flex flex-col gap-2">
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 px-4 py-2 text-white/80 text-sm"><Mail className="w-4 h-4" /> {EMAIL}</a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-white/80 text-sm"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 text-white/80 text-sm"><Instagram className="w-4 h-4" /> Instagram</a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <AdminLoginModal open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen} />
      <AuthModals open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultType={authType} />
    </>
  );
}
