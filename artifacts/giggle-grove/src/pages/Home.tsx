import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Palette, Zap, Star, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Magical animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-amber-100/50 -z-20" />
        <div className="absolute inset-0 animate-gradient-shift bg-[length:200%_200%] bg-gradient-to-br from-purple-200/20 via-pink-200/20 to-blue-200/20 -z-10" />
        
        {/* Floating elements */}
        <m.div 
          className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-300 rounded-full blur-xl opacity-60 -z-10"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.div 
          className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-purple-300 rounded-full blur-xl opacity-60 -z-10"
          animate={{ y: [20, -20, 20], x: [10, -10, 10], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 z-10 text-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/60 text-primary font-bold text-sm tracking-wider mb-6 border border-primary/10 shadow-sm backdrop-blur-sm">
              ✨ WHERE IMAGINATION COMES ALIVE
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Turn your child into the <br />
              <span className="gradient-text">Hero of the Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto font-medium">
              Magical, personalized AI storybooks and colouring pages crafted instantly for your little one. 
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/services">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 w-full sm:w-auto animate-pulse-glow">
                  Create a Story
                </Button>
              </Link>
              <Link href="/samples">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 border-primary/20 text-primary hover:bg-primary/5 w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                  View Samples
                </Button>
              </Link>
            </div>
          </m.div>
        </div>
        
        {/* Custom wave divider at bottom */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none z-0">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.72,189.41,100.2,235.8,84.14,278.4,70.52,321.39,56.44Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Magic in Every Page</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to spark joy and creativity in your child's daily routine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Stories",
                desc: "Your child's name, their avatar, their adventure. AI weaves them into magical worlds.",
                Icon: BookOpen,
                color: "bg-pink-100 text-pink-600"
              },
              {
                title: "Custom Colouring Books",
                desc: "Turn family photos or imaginative prompts into beautiful colouring pages.",
                Icon: Palette,
                color: "bg-amber-100 text-amber-600"
              },
              {
                title: "Instant PDF Delivery",
                desc: "Download, print, or read on your tablet instantly. Magic doesn't wait.",
                Icon: Zap,
                color: "bg-purple-100 text-purple-600"
              },
              {
                title: "Child Avatar Creator",
                desc: "Upload a photo and create a custom avatar that stars in every story.",
                Icon: Star,
                color: "bg-blue-100 text-blue-600"
              },
              {
                title: "Influencer Referrals",
                desc: "Share your unique link and earn 20% commission on every book created.",
                Icon: Users,
                color: "bg-green-100 text-green-600"
              },
              {
                title: "3 Free Previews",
                desc: "Try before you buy — explore 3 full sample books with no commitment.",
                Icon: Shield,
                color: "bg-rose-100 text-rose-600"
              }
            ].map((feature, i) => (
              <m.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Influencer Teaser */}
      <section className="py-24 relative overflow-hidden bg-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,3,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-primary/10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 font-bold text-sm tracking-wider">
                FOR CREATORS
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                Join the Giggle Grove Family
              </h2>
              <p className="text-lg text-muted-foreground">
                Are you a parenting or lifestyle influencer? Share the magic with your audience and earn commissions on every magical book created through your link.
              </p>
              <Link href="/influencer">
                <Button size="lg" className="rounded-full bg-foreground text-white hover:bg-foreground/90 mt-4">
                  Learn About Our Program
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 p-2 animate-float">
                <div className="w-full h-full rounded-full bg-white/50 backdrop-blur-sm border border-white flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full h-full opacity-80">
                    <div className="bg-pink-300 rounded-tl-full rounded-br-3xl rounded-tr-xl rounded-bl-xl" />
                    <div className="bg-purple-300 rounded-tr-full rounded-bl-3xl rounded-tl-xl rounded-br-xl" />
                    <div className="bg-amber-300 rounded-bl-full rounded-tr-3xl rounded-tl-xl rounded-br-xl" />
                    <div className="bg-teal-300 rounded-br-full rounded-tl-3xl rounded-tr-xl rounded-bl-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
