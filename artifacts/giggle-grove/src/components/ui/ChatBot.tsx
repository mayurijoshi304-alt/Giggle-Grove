import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center p-0 z-40 animate-pulse-glow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-primary/20 z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center">
              <div className="font-serif font-bold text-primary">Giggle Guide</div>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <div className="p-4 flex-grow bg-slate-50/50 h-64 overflow-y-auto">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-primary/10 shadow-sm text-sm mb-4">
                Hi there! I'm your Giggle Guide. How can I help make magic today?
              </div>
            </div>
            
            <div className="p-3 bg-white border-t">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">Tell me a story about a brave bunny</span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-slate-100 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
