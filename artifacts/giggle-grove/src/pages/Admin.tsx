import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";
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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ExternalLink, Plus, BookOpen, Users, BarChart2, Settings, Link2, Image, FileText, Tag, Loader2 } from "lucide-react";

const EMPTY_BOOK = {
  title: "",
  type: "storybook" as "storybook" | "coloring_book",
  coverUrl: "",
  previewUrl: "",
  canvaLink: "",
  driveLink: "",
  instagramLink: "",
  description: "",
  ageRange: ""
};

export default function Admin() {
  const { admin, loaded } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogin, setShowLogin] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState(EMPTY_BOOK);

  useEffect(() => {
    if (loaded && !admin) setShowLogin(true);
  }, [loaded, admin]);

  const { data: stats } = useGetStatsSummary({ query: { enabled: !!admin, queryKey: getGetStatsSummaryQueryKey() } });
  const { data: books, isLoading: booksLoading } = useListBooks({ query: { enabled: !!admin, queryKey: getListBooksQueryKey() } });
  const { data: influencers } = useListInfluencers({ query: { enabled: !!admin, queryKey: getListInfluencersQueryKey() } });
  const { data: users } = useListUsers({ query: { enabled: !!admin, queryKey: getListUsersQueryKey() } });
  const { data: settings } = useGetAdminSettings({ query: { enabled: !!admin, queryKey: getGetAdminSettingsQueryKey() } });

  const deleteBook = useDeleteBook();
  const createBook = useCreateBook();
  const updateSettings = useUpdatePreviewLimit();
  const [previewLimit, setPreviewLimit] = useState("");

  useEffect(() => {
    if (settings) setPreviewLimit(settings.freePreviewLimit.toString());
  }, [settings]);

  const handleDeleteBook = (id: number) => {
    if (!confirm("Delete this book from the sample library?")) return;
    deleteBook.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
        toast.success("Book removed");
      }
    });
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    createBook.mutate({ data: newBook }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
        toast.success("Sample book added!");
        setShowAddBook(false);
        setNewBook(EMPTY_BOOK);
      },
      onError: () => toast.error("Failed to add book. Check all required fields.")
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

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <AdminLoginModal open={showLogin} onOpenChange={setShowLogin} />
        <div className="text-center">
          <h2 className="text-white text-2xl font-serif mb-2">Admin Access Required</h2>
          <p className="text-slate-400 text-sm mb-6">Please log in through the Admin Corner to continue.</p>
          <button onClick={() => setShowLogin(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
            Open Admin Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", Icon: BarChart2 },
    { id: "samples", label: "Sample PDFs", Icon: BookOpen },
    { id: "influencers", label: "Influencers", Icon: Users },
    { id: "users", label: "Users", Icon: Users },
    { id: "settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-900 flex text-slate-300">
      {/* Sidebar */}
      <div className="w-60 bg-slate-950 border-r border-slate-800 p-5 flex flex-col shrink-0">
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Admin Corner</p>
          <p className="text-white font-serif text-lg">Giggle Grove</p>
        </div>
        <nav className="space-y-1 flex-grow">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-3 text-sm ${
                activeTab === id ? "bg-indigo-600/20 text-indigo-300 font-medium" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <p className="text-xs text-slate-600 mt-6">Logged in as admin</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Sample Books", value: stats?.totalBooks ?? 0, color: "text-indigo-400" },
                { label: "Registered Users", value: stats?.totalUsers ?? 0, color: "text-emerald-400" },
                { label: "Active Influencers", value: stats?.activeInfluencers ?? 0, color: "text-amber-400" },
                { label: "Referral Clicks", value: stats?.totalReferralClicks ?? 0, color: "text-pink-400" },
              ].map((s, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                  <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setActiveTab("samples")} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Add Sample PDF
                </Button>
                <Button onClick={() => setActiveTab("influencers")} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700 rounded-xl">
                  View Influencers
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── SAMPLE PDFs CORNER ── */}
        {activeTab === "samples" && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white">Sample PDFs</h1>
                <p className="text-slate-400 text-sm mt-1">Add your own PDF links — they appear on the Sample Stories page for visitors.</p>
              </div>
              <Button
                onClick={() => setShowAddBook(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Sample PDF
              </Button>
            </div>

            {/* ADD FORM (inline, shown when clicked) */}
            {showAddBook && (
              <div className="bg-slate-800 border border-indigo-500/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> New Sample Book
                </h3>
                <form onSubmit={handleCreateBook} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Book Title *
                      </label>
                      <Input
                        required
                        value={newBook.title}
                        onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white h-11 rounded-xl"
                        placeholder="e.g. Luna and the Magical Forest"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Book Type *</label>
                      <select
                        required
                        value={newBook.type}
                        onChange={e => setNewBook({ ...newBook, type: e.target.value as any })}
                        className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="storybook">📖 Storybook</option>
                        <option value="coloring_book">🎨 Colouring Book</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Age Range</label>
                      <Input
                        value={newBook.ageRange}
                        onChange={e => setNewBook({ ...newBook, ageRange: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white h-11 rounded-xl"
                        placeholder="e.g. 3–6"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-emerald-400" /> PDF Link * <span className="text-emerald-400 font-bold">(paste your PDF URL here)</span>
                      </label>
                      <Input
                        required
                        value={newBook.previewUrl}
                        onChange={e => setNewBook({ ...newBook, previewUrl: e.target.value })}
                        className="bg-slate-900 border-emerald-500/40 text-white h-11 rounded-xl focus-visible:ring-emerald-500"
                        placeholder="https://drive.google.com/... or any PDF link"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5" /> Cover Image URL
                      </label>
                      <Input
                        value={newBook.coverUrl}
                        onChange={e => setNewBook({ ...newBook, coverUrl: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white h-11 rounded-xl"
                        placeholder="https://... (Unsplash, Google Drive image, etc.)"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Short Description</label>
                      <Input
                        value={newBook.description}
                        onChange={e => setNewBook({ ...newBook, description: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white h-11 rounded-xl"
                        placeholder="A short description shown on the sample card"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={createBook.isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-6">
                      {createBook.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      Add to Library
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => { setShowAddBook(false); setNewBook(EMPTY_BOOK); }} className="text-slate-400 hover:text-white rounded-xl h-11">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* BOOK LIST */}
            {booksLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : !books?.length ? (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-16 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 font-medium mb-2">No sample books yet</p>
                <p className="text-slate-500 text-sm mb-6">Click "Add Sample PDF" to upload your first book link.</p>
                <Button onClick={() => setShowAddBook(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Sample
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {books.map(book => (
                  <div key={book.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-lg shrink-0 bg-slate-700"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-16 bg-slate-700 rounded-lg shrink-0 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{book.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">
                          {book.type === "storybook" ? "📖 Storybook" : "🎨 Colouring Book"}
                        </span>
                        {book.ageRange && <span className="text-xs text-slate-500">Ages {book.ageRange}</span>}
                      </div>
                      {book.previewUrl && (
                        <p className="text-xs text-indigo-400 truncate mt-1">{book.previewUrl}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {book.previewUrl && (
                        <a
                          href={book.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-700"
                          title="Test PDF link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
                        title="Remove book"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INFLUENCERS ── */}
        {activeTab === "influencers" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Influencers</h1>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 text-sm font-medium text-slate-400">Name</th>
                    <th className="p-4 text-sm font-medium text-slate-400">Instagram</th>
                    <th className="p-4 text-sm font-medium text-slate-400">Referral Code</th>
                    <th className="p-4 text-sm font-medium text-slate-400 text-right">Clicks</th>
                    <th className="p-4 text-sm font-medium text-slate-400 text-right">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {influencers?.map(inf => (
                    <tr key={inf.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 text-white font-medium">{inf.name}</td>
                      <td className="p-4 text-indigo-300 text-sm">{inf.instagramHandle ? `@${inf.instagramHandle}` : '—'}</td>
                      <td className="p-4"><code className="px-2 py-1 bg-slate-900 rounded text-xs text-emerald-400">{inf.referralCode}</code></td>
                      <td className="p-4 text-right text-sm">{inf.clicks}</td>
                      <td className="p-4 text-right text-green-400 font-semibold">${inf.commissionTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  {!influencers?.length && (
                    <tr><td colSpan={5} className="p-12 text-center text-slate-500">No influencers registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Registered Users</h1>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 text-sm font-medium text-slate-400">Name</th>
                    <th className="p-4 text-sm font-medium text-slate-400">Email</th>
                    <th className="p-4 text-sm font-medium text-slate-400">Referred By</th>
                    <th className="p-4 text-sm font-medium text-slate-400 text-right">Previews Used</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(u => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 text-white">{u.name || '—'}</td>
                      <td className="p-4 text-sm">{u.email}</td>
                      <td className="p-4"><code className="text-xs text-indigo-300">{u.referredBy || '—'}</code></td>
                      <td className="p-4 text-right text-sm">{u.freePreviewsUsed || 0}</td>
                    </tr>
                  ))}
                  {!users?.length && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-500">No users registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-lg">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-semibold text-white">Free Page Views per Book</h3>
              <p className="text-sm text-slate-400">How many pages visitors can read for free before the paywall appears. After payment they unlock download &amp; print of the full book.</p>
              <div className="flex gap-3">
                <Input
                  type="number"
                  min={0}
                  value={previewLimit}
                  onChange={(e) => setPreviewLimit(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white w-28 h-11 rounded-xl"
                />
                <Button
                  onClick={handleSaveSettings}
                  disabled={updateSettings.isPending}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white h-11 rounded-xl"
                >
                  {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
