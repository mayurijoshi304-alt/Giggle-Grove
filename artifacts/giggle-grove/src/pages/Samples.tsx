import { useListBooks, getListBooksQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, ExternalLink, Share2 } from "lucide-react";

export default function Samples() {
  const { data: books, isLoading } = useListBooks({
    query: { queryKey: getListBooksQueryKey() }
  });
  
  const { user, incrementPreview } = useAuth();
  
  const FREE_PREVIEW_LIMIT = 3;

  const handlePreview = (url: string | null | undefined) => {
    if (!url) {
      toast.error("Preview not available for this book yet.");
      return;
    }
    if (user && (user.freePreviewsUsed || 0) >= FREE_PREVIEW_LIMIT) {
      toast.error("Free preview limit reached. Please sign up to view more!");
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
    <div className="bg-[#FAFAFA] py-16 min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Sample Library</h1>
          <p className="text-lg text-muted-foreground">
            Explore our magical personalized storybooks and colouring pages.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mt-4">
              Free previews used: {user.freePreviewsUsed || 0} / {FREE_PREVIEW_LIMIT}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !books?.length ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-primary/40" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Coming Soon!</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Our magical sample books are being prepared. Check back soon — something wonderful is on the way!
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white" onClick={() => window.location.href = '/contact'}>
                Get Notified
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {books.map((book, i) => (
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
                    src={book.coverUrl}
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
                      onClick={() => handlePreview(book.previewUrl)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      View PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-10 w-10 border-slate-200 shrink-0"
                      onClick={() => handleShare(book.id)}
                      title="Share this book"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
