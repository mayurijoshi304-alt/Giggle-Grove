import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Services() {
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      toast.success("Photo uploaded successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Magical Services</h1>
          <p className="text-lg text-muted-foreground">Everything you need to create unforgettable moments for your little ones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Storybooks */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">AI Storybooks</h3>
            <p className="text-muted-foreground mb-6">
              Custom stories where your child is the main character. Choose the theme, moral, and setting.
            </p>
            <Button className="w-full rounded-xl bg-pink-600 hover:bg-pink-700 text-white">
              Create Storybook
            </Button>
          </m.div>

          {/* AI Colouring Books */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Custom Colouring Books</h3>
            <p className="text-muted-foreground mb-6">
              Turn any idea into a beautiful, printable colouring page. Perfect for rainy afternoons.
            </p>
            <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
              Create Colouring Book
            </Button>
          </m.div>

          {/* Avatar Creator */}
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 md:col-span-2"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3">Avatar Creator</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a photo of your child to generate a magical Pixar-style avatar to use in all their stories.
                </p>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button variant="outline" className="w-full rounded-xl border-2 border-dashed border-purple-200 text-purple-700 bg-purple-50 h-14">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    Choose Photo to Upload
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                {photo ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-purple-200/50">
                    <img src={photo} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}
