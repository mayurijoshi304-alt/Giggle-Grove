import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";
import { AuthModals } from "@/components/auth/AuthModals";
import { useAuth } from "@/hooks/use-auth";
import { m, AnimatePresence } from "framer-motion";
import { Mail, Instagram, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "13304949649"; // US WhatsApp number
const EMAIL = "hello@gigglegrove.com";
const INSTAGRAM = "https://instagram.com/gigglegrove";

export function Header() {
  const [location] = useLocation();
  const { user, logoutUser, admin, logoutAdmin } = useAuth();
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/samples", label: "Sample Stories" },
    { href: "/influencer", label: "Programs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const openAuth = (type: "signin" | "signup") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 h-9 flex items-center justify-between text-xs">
          {/* Tagline */}
          <p className="hidden md:block font-medium truncate">
            ✨ <span className="font-bold">Giggle Grove</span> — Magical, personalized storytelling &amp; colouring books for your little ones.
          </p>
          <p className="md:hidden font-semibold text-xs">✨ Giggle Grove</p>

          {/* Social Links */}
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-medium"
              title="Email Us"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Email Us</span>
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-medium"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-medium"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className="fixed top-9 left-0 right-0 z-50 glass-panel border-b border-primary/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="w-1/4">
            {admin ? (
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" onClick={logoutAdmin} className="border-primary/20 hover:bg-primary/5">
                   Admin Logout
                 </Button>
                 <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary/80">Dashboard</Link>
               </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-4"
                onClick={() => setIsAdminModalOpen(true)}
              >
                Admin Corner
              </Button>
            )}
          </div>

          <nav className="hidden lg:flex w-2/4 justify-center items-center gap-5">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  location === link.href ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="w-1/4 flex justify-end items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:inline-block">Hi, {user.name}</span>
                <Button variant="outline" onClick={logoutUser} className="rounded-full">Logout</Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => openAuth("signin")}
                  className="font-medium hover:text-primary rounded-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => openAuth("signup")}
                  className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md shadow-primary/20"
                >
                  Sign Up
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Toggle Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <m.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background border-b overflow-hidden"
            >
              <div className="flex flex-col py-4 px-4 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-foreground/80 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Mail className="w-4 h-4" /> Email Us
                  </a>
                  <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      <AdminLoginModal open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen} />
      <AuthModals open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultType={authType} />
    </>
  );
}
