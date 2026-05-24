import { useListBooks, getListBooksQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Samples() {
  const { data: books, isLoading } = useListBooks({
    query: { queryKey: getListBooksQueryKey() }
  });
  
  const { user, incrementPreview } = useAuth();
  
  const FREE_PREVIEW_LIMIT = 3;

  const handlePreview = (url: string | null) => {
    if (!url) {
      toast.error("Preview not available for this book.");
      return;
    }
    
    if (user && (user.freePreviewsUsed || 0) >= FREE_PREVIEW_LIMIT) {
      toast.error("Free preview limit reached. Please upgrade to view more!");
      // Here you would trigger an upgrade modal
      return;
    }

    incrementPreview();
    window.open(url, '_blank');
  };

  const handleShare = (id: number) => {
    const url = `${window.location.origin}/samples?book=${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Sample Library</h1>
          <p className="text-lg text-muted-foreground mb-4">Discover the magic of personalized storytelling.</p>
          
          {user && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              Free previews used: {user.freePreviewsUsed || 0} / {FREE_PREVIEW_LIMIT}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books?.map((book, i) => (
              <m.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative perspective-1000"
              >
                {/* 3D Card Container */}
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-500 transform-style-3d group-hover:rotate-y-[-10deg] group-hover:rotate-x-[5deg] group-hover:shadow-2xl group-hover:shadow-primary/30 bg-white">
                  
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x800/f8f9fa/a8a29e?text=${encodeURIComponent(book.title)}`;
                    }}
                  />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-md text-slate-800 font-medium">
                      {book.type === "storybook" ? "Storybook" : "Colouring Book"}
                    </Badge>
                    {book.ageRange && (
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-slate-800 border-none shadow-sm">
                        Ages {book.ageRange}
                      </Badge>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-3">
                    <h3 className="text-white font-serif font-bold text-xl text-center mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {book.title}
                    </h3>
                    
                    <Button 
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                      onClick={() => handlePreview(book.previewUrl)}
                    >
                      View Sample PDF
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full rounded-full border-white/30 text-white hover:bg-white/20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                      onClick={() => handleShare(book.id)}
                    >
                      Share with Influencer
                    </Button>
                  </div>
                </div>
                
                {/* Fallback title for mobile/accessibility when not hovering */}
                <div className="mt-4 md:hidden">
                  <h3 className="font-serif font-bold text-lg">{book.title}</h3>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
