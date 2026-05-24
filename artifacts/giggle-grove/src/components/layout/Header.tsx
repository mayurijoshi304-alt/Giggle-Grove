import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";
import { AuthModals } from "@/components/auth/AuthModals";
import { useAuth } from "@/hooks/use-auth";
import { m, AnimatePresence } from "framer-motion";
import { Mail, Instagram, MessageCircle, Menu, X, Search, BookOpen, FileText } from "lucide-react";
import { useListBooks, getListBooksQueryKey } from "@workspace/api-client-react";

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

const PAGE_RESULTS = [
  { href: "/", label: "Home", desc: "Giggle Grove homepage" },
  { href: "/services", label: "Services", desc: "AI Storybooks, Colouring Books, Avatar Creator" },
  { href: "/samples", label: "Sample Stories", desc: "Browse our sample book library" },
  { href: "/influencer", label: "Programs", desc: "Influencer referral & commission program" },
  { href: "/pricing", label: "Pricing", desc: "Single $9.99 · Magic Monthly $24.99/mo" },
  { href: "/contact", label: "Contact", desc: "Get in touch with our team" },
];

function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const { data: books } = useListBooks({ query: { queryKey: getListBooksQueryKey() } });

  const q = query.trim().toLowerCase();

  const pageMatches = q
    ? PAGE_RESULTS.filter(p =>
        p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      )
    : PAGE_RESULTS.slice(0, 4);

  const bookMatches = q && books
    ? books.filter(b => b.title.toLowerCase().includes(q))
    : [];

  const hasResults = pageMatches.length > 0 || bookMatches.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (href: string) => {
    navigate(href);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className={`flex items-center gap-2 bg-white/15 hover:bg-white/20 border rounded-full px-3 h-8 transition-all duration-200 ${open ? "bg-white/25 border-white/50 ring-2 ring-white/30" : "border-white/25"}`}>
        <Search className="w-3.5 h-3.5 text-white/70 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search pages, books…"
          className="bg-transparent text-white placeholder-white/50 text-xs w-full outline-none font-medium"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-white/50 hover:text-white transition-colors shrink-0">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && hasResults && (
          <m.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
          >
            {pageMatches.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Pages</p>
                {pageMatches.map(p => (
                  <button
                    key={p.href}
                    onMouseDown={() => handleSelect(p.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">{p.label}</p>
                      <p className="text-xs text-slate-400 truncate">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {bookMatches.length > 0 && (
              <div className={pageMatches.length > 0 ? "border-t border-slate-100" : ""}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Sample Books</p>
                {bookMatches.map(book => (
                  <button
                    key={book.id}
                    onMouseDown={() => handleSelect("/samples")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">{book.title}</p>
                      <p className="text-xs text-slate-400">{book.type === "storybook" ? "Storybook" : "Colouring Book"}{book.ageRange ? ` · Ages ${book.ageRange}` : ""}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {q && !hasResults && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                No results for "<span className="font-semibold text-slate-600">{query}</span>"
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const { user, logoutUser, admin, logoutAdmin } = useAuth();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const openAuth = (type: "signin" | "signup") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#6b21a8] via-primary to-[#ec4899] shadow-lg">

        {/* Row 1 — Brand + Contact */}
        <div className="border-b border-white/20">
          <div className="container mx-auto px-4 h-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm tracking-wide">✨ Giggle Grove</span>
              <span className="hidden md:inline text-white/60 text-xs">|</span>
              <span className="hidden md:inline text-white/80 text-xs">Magical, personalized storytelling &amp; colouring books for little ones</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <Mail className="w-3.5 h-3.5" /><span className="hidden sm:inline">Email Us</span>
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <Instagram className="w-3.5 h-3.5" /><span className="hidden sm:inline">Instagram</span>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-medium transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /><span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Row 2 — Nav + Auth */}
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Admin Corner */}
          <div className="shrink-0">
            {admin ? (
              <div className="flex items-center gap-2">
                <button onClick={logoutAdmin} className="text-xs text-white/70 hover:text-white transition-colors font-medium">Logout</button>
                <Link href="/admin" className="text-xs text-white font-bold bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">Dashboard</Link>
              </div>
            ) : (
              <button onClick={() => setIsAdminModalOpen(true)} className="text-xs font-semibold text-white/80 hover:text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors border border-white/20 whitespace-nowrap">
                Admin Corner
              </button>
            )}
          </div>

          {/* Nav Links — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  location === link.href ? "bg-white text-primary shadow-sm" : "text-white/90 hover:text-white hover:bg-white/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — Search + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search — desktop */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 hidden md:inline truncate max-w-[70px]">Hi, {user.name}</span>
                <button onClick={logoutUser} className="text-xs text-white/80 hover:text-white font-medium transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => openAuth("signin")} className="text-sm font-semibold text-white/90 hover:text-white transition-colors hidden sm:block whitespace-nowrap">Sign In</button>
                <button onClick={() => openAuth("signup")} className="text-sm font-bold bg-white text-primary hover:bg-white/90 px-4 py-1.5 rounded-full shadow-sm transition-all whitespace-nowrap">Sign Up</button>
              </>
            )}

            {/* Mobile: search + hamburger */}
            <button className="lg:hidden text-white" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
              <Search className="w-5 h-5" />
            </button>
            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Row 3 — Mobile Search */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/20 overflow-visible"
            >
              <div className="px-4 py-3">
                <SearchBar />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Nav Dropdown */}
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
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${location === link.href ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
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
