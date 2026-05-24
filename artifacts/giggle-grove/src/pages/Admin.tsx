import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  useGetStatsSummary, 
  getGetStatsSummaryQueryKey,
  useListBooks,
  getListBooksQueryKey,
  useDeleteBook,
  useUpdatePreviewLimit,
  useGetAdminSettings,
  getGetAdminSettingsQueryKey,
  useCreateBook,
  useListInfluencers,
  getListInfluencersQueryKey,
  useListUsers,
  getListUsersQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ExternalLink, Plus } from "lucide-react";

export default function Admin() {
  const { admin } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!admin) {
      setLocation("/");
    }
  }, [admin, setLocation]);

  // Queries
  const { data: stats } = useGetStatsSummary({
    query: { enabled: !!admin, queryKey: getGetStatsSummaryQueryKey() }
  });
  
  const { data: books } = useListBooks({
    query: { enabled: !!admin, queryKey: getListBooksQueryKey() }
  });

  const { data: influencers } = useListInfluencers({
    query: { enabled: !!admin, queryKey: getListInfluencersQueryKey() }
  });

  const { data: users } = useListUsers({
    query: { enabled: !!admin, queryKey: getListUsersQueryKey() }
  });

  const { data: settings } = useGetAdminSettings({
    query: { enabled: !!admin, queryKey: getGetAdminSettingsQueryKey() }
  });

  // Mutations
  const deleteBook = useDeleteBook();
  const createBook = useCreateBook();
  const updateSettings = useUpdatePreviewLimit();

  const [previewLimit, setPreviewLimit] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  // New Book State
  const [newBook, setNewBook] = useState({
    title: "",
    type: "storybook" as const,
    coverUrl: "",
    previewUrl: "",
    canvaLink: "",
    driveLink: "",
    instagramLink: "",
    description: "",
    ageRange: ""
  });

  useEffect(() => {
    if (settings) {
      setPreviewLimit(settings.freePreviewLimit.toString());
    }
  }, [settings]);

  const handleDeleteBook = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBook.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
          toast.success("Book deleted");
        }
      });
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    createBook.mutate({ data: newBook }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
        toast.success("Book added successfully");
        setIsAddBookOpen(false);
        setNewBook({
          title: "", type: "storybook", coverUrl: "", previewUrl: "",
          canvaLink: "", driveLink: "", instagramLink: "", description: "", ageRange: ""
        });
      }
    });
  };

  const handleSaveSettings = () => {
    updateSettings.mutate({ data: { freePreviewLimit: parseInt(previewLimit) || 3 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminSettingsQueryKey() });
        toast.success("Settings saved");
      }
    });
  };

  if (!admin) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex text-slate-300">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
        <h2 className="text-xl font-serif text-white mb-8">Dashboard</h2>
        <nav className="space-y-2 flex-grow">
          {[
            { id: "overview", label: "Overview" },
            { id: "books", label: "Books Manager" },
            { id: "influencers", label: "Influencers" },
            { id: "users", label: "Users" },
            { id: "settings", label: "Settings" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-indigo-600/20 text-indigo-300 font-medium" : "hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Books", value: stats?.totalBooks || 0 },
                { label: "Registered Users", value: stats?.totalUsers || 0 },
                { label: "Active Influencers", value: stats?.activeInfluencers || 0 },
                { label: "Referral Clicks", value: stats?.totalReferralClicks || 0 },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-sm">
                  <div className="text-sm font-medium text-slate-400 mb-2">{stat.label}</div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "books" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Manage Books</h1>
              <Button onClick={() => setIsAddBookOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add New Book
              </Button>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 font-medium">Cover</th>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Age Range</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books?.map(book => (
                    <tr key={book.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <img src={book.coverUrl} alt="" className="w-10 h-14 object-cover rounded shadow-sm bg-slate-700" />
                      </td>
                      <td className="p-4 font-medium text-white">{book.title}</td>
                      <td className="p-4"><span className="px-2 py-1 rounded-full bg-slate-700/50 text-xs border border-slate-600">{book.type}</span></td>
                      <td className="p-4 text-sm">{book.ageRange || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {book.previewUrl && (
                            <a href={book.previewUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-400 transition-colors">
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button onClick={() => handleDeleteBook(book.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!books?.length && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">No books found in the library.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "influencers" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Influencers</h1>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Instagram</th>
                    <th className="p-4 font-medium">Code</th>
                    <th className="p-4 font-medium text-right">Clicks</th>
                    <th className="p-4 font-medium text-right">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {influencers?.map(inf => (
                    <tr key={inf.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 text-white">{inf.name}</td>
                      <td className="p-4 text-indigo-300">{inf.instagramHandle || '-'}</td>
                      <td className="p-4"><code className="px-2 py-1 bg-slate-900 rounded text-xs">{inf.referralCode}</code></td>
                      <td className="p-4 text-right">{inf.clicks}</td>
                      <td className="p-4 text-right text-green-400 font-medium">${inf.commissionTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-8">Registered Users</h1>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Referred By</th>
                    <th className="p-4 font-medium text-right">Previews Used</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(u => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 text-white">{u.name || '-'}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4"><code className="text-xs text-indigo-300">{u.referredBy || '-'}</code></td>
                      <td className="p-4 text-right">{u.freePreviewsUsed || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6 max-w-xl">
            <h1 className="text-3xl font-bold text-white mb-8">Platform Settings</h1>
            
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-medium text-white">Free Preview Limit</h3>
              <p className="text-sm text-slate-400">Number of free samples a user can view before requiring signup/upgrade.</p>
              
              <div className="flex gap-4">
                <Input 
                  type="number"
                  value={previewLimit}
                  onChange={(e) => setPreviewLimit(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white w-32 h-11"
                />
                <Button 
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white h-11"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Book Modal */}
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-white font-serif">Add New Book to Library</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBook} className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Title *</label>
              <Input required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <select 
                required 
                value={newBook.type} 
                onChange={e => setNewBook({...newBook, type: e.target.value as any})}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="storybook">Storybook</option>
                <option value="coloring_book">Colouring Book</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Range</label>
              <Input value={newBook.ageRange} onChange={e => setNewBook({...newBook, ageRange: e.target.value})} className="bg-slate-800 border-slate-700 text-white" placeholder="e.g. 3-6" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Cover Image URL *</label>
              <Input required value={newBook.coverUrl} onChange={e => setNewBook({...newBook, coverUrl: e.target.value})} className="bg-slate-800 border-slate-700 text-white" placeholder="https://..." />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">PDF Preview URL</label>
              <Input value={newBook.previewUrl} onChange={e => setNewBook({...newBook, previewUrl: e.target.value})} className="bg-slate-800 border-slate-700 text-white" placeholder="https://..." />
            </div>
            
            <div className="space-y-2 col-span-2 mt-4 pt-4 border-t border-slate-800">
              <Button type="submit" disabled={createBook.isPending} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                Save Book
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
