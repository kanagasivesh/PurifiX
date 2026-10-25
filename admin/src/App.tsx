import { useCallback, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, type DocumentData } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Droplets, LockKeyhole, Mail, ShieldCheck, LayoutDashboard, ShoppingBag, Users, Wrench, Package, RefreshCw, LogOut, AlertTriangle, CheckCircle2, Clock, Search, ArrowUpRight } from "lucide-react";
import "./App.css";

type RecordRow = { id: string; data: DocumentData };
type Dataset = { rows: RecordRow[]; error?: string };
type Tab = "overview" | "orders" | "products" | "dealers" | "services";
const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; collection: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, collection: "" },
  { id: "orders", label: "Orders", icon: ShoppingBag, collection: "orders" },
  { id: "products", label: "Products", icon: Package, collection: "products" },
  { id: "dealers", label: "Dealers", icon: Users, collection: "users" },
  { id: "services", label: "Service desk", icon: Wrench, collection: "serviceBookings" },
];
const money = (v: unknown) => typeof v === "number" ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v) : "—";
const readable = (v: unknown) => typeof v === "string" ? v : v == null ? "—" : String(v);
const titleCase = (v: string) => v.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^./, c => c.toUpperCase());

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [datasets, setDatasets] = useState<Record<string, Dataset>>({});
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const refresh = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    const names = ["orders", "products", "users", "serviceBookings"];
    const result: Record<string, Dataset> = {};
    await Promise.all(names.map(async name => {
      try {
        const snap = await getDocs(collection(db, name));
        result[name] = { rows: snap.docs.map(d => ({ id: d.id, data: d.data() })) };
      } catch (e) {
        result[name] = { rows: [], error: e instanceof Error ? e.message : "Could not load this collection" };
      }
    }));
    setDatasets(result);
    setLastUpdated(new Date().toLocaleTimeString());
    setBusy(false);
  }, [user]);

  useEffect(() => { if (user) void refresh(); }, [user, refresh]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMessage(""); setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.admin !== true) { await signOut(auth); setMessage("This account is not an approved administrator."); return; }
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign-in failed. Check your email and password.");
    } finally { setLoading(false); }
  }
  async function handleLogout() { await signOut(auth); setPassword(""); setMessage(""); setDatasets({}); }
  async function updateOrder(row: RecordRow, status: string) {
    try { await updateDoc(doc(db, "orders", row.id), { status, updatedAt: new Date().toISOString() }); await refresh(); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not update order. Check Firestore rules."); }
  }

  if (!user) return (
    <main className="page-shell"><section className="login-card">
      <div className="brand-mark"><Droplets size={30} /></div><p className="eyebrow">PURIFIX OPERATIONS</p><h1>PurifiX <span>Admin</span></h1>
      <p className="intro">Manage orders, service requests and dealer access from one place.</p>
      <form onSubmit={handleLogin}><label htmlFor="email">Administrator email</label><div className="input-wrap"><Mail size={18} /><input id="email" type="email" autoComplete="username" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
      <label htmlFor="password">Password</label><div className="input-wrap"><LockKeyhole size={18} /><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
      <button type="submit" disabled={loading}>{loading ? "Verifying…" : "Sign in securely"}</button></form>
      {message && <p className="error" role="alert">{message}</p>}<div className="security-note"><ShieldCheck size={17} /><span>Administrator access is verified with Firebase claims.</span></div>
    </section><footer>PurifiX · Clean water. Clear operations.</footer></main>
  );

  const orders = datasets.orders?.rows ?? [];
  const products = datasets.products?.rows ?? [];
  const people = datasets.users?.rows ?? [];
  const services = datasets.serviceBookings?.rows ?? [];
  const dealers = people.filter(r => ["dealer", "pending", "dealer_pending"].includes(String(r.data.role ?? r.data.accountType ?? r.data.status ?? "").toLowerCase()));
  const pendingOrders = orders.filter(r => ["pending", "new"].includes(String(r.data.status ?? "pending").toLowerCase())).length;
  const selected = tabs.find(t => t.id === tab)!;
  const rows = tab === "orders" ? orders : tab === "products" ? products : tab === "dealers" ? dealers : services;
  const filtered = rows.filter(r => (r.id + " " + Object.values(r.data).filter(v => typeof v === "string" || typeof v === "number").join(" ")).toLowerCase().includes(search.toLowerCase()));
  const fields = tab === "orders" ? ["status", "totalINR", "total", "customerName", "userId", "createdAt"] : tab === "products" ? ["name", "sku", "priceINR", "stock", "active", "category"] : tab === "dealers" ? ["name", "email", "role", "status", "businessName", "phone"] : ["status", "name", "userId", "serviceType", "phone", "createdAt"];
  return <div className="admin-layout">
    <aside className="sidebar"><div className="side-brand"><span className="brand-mark small"><Droplets size={22}/></span><div><b>PurifiX</b><small>ADMIN CONSOLE</small></div></div>
      <p className="nav-caption">WORKSPACE</p><nav>{tabs.map(t => { const Icon = t.icon; return <button key={t.id} className={tab === t.id ? "nav-item active" : "nav-item"} onClick={() => { setTab(t.id); setSearch(""); }}><Icon size={18}/><span>{t.label}</span>{t.id === "orders" && pendingOrders > 0 && <em>{pendingOrders}</em>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="user-chip"><span className="avatar">{(user.email ?? "A").slice(0,1).toUpperCase()}</span><div><b>{user.email}</b><small>Verified administrator</small></div></div><button className="logout-btn" onClick={handleLogout}><LogOut size={17}/> Sign out</button></div>
    </aside>
    <main className="dashboard-main"><header className="topbar"><div><p className="eyebrow">PURIFIX OPERATIONS</p><h1>{selected.label}</h1><p className="top-subtitle">Monitor your clean-water business from one workspace.</p></div><div className="top-actions"><span className="live-pill"><i/> Firebase connected</span><button className="refresh-btn" onClick={() => void refresh()} disabled={busy}><RefreshCw size={16} className={busy ? "spin" : ""}/> {busy ? "Refreshing" : "Refresh"}</button></div></header>
      {message && <div className="inline-alert"><AlertTriangle size={18}/>{message}<button onClick={() => setMessage("")}>Dismiss</button></div>}
      {tab === "overview" ? <>
        <div className="welcome-strip"><div><span className="welcome-tag">ADMIN OVERVIEW</span><h2>Good to have you back.</h2><p>Here’s the latest snapshot of your PurifiX workspace.</p></div><div className="welcome-icon"><Droplets size={42}/></div></div>
        <section className="stats-grid">{[
          {label:"Total orders",value:orders.length,icon:ShoppingBag,sub:pendingOrders+" awaiting action",tone:"teal"},
          {label:"Active products",value:products.filter(r=>r.data.active !== false).length,icon:Package,sub:products.length+" catalogue records",tone:"blue"},
          {label:"Dealer accounts",value:dealers.length,icon:Users,sub:"Detected from user profiles",tone:"purple"},
          {label:"Service requests",value:services.length,icon:Wrench,sub:services.filter(r=>String(r.data.status).toLowerCase()==="pending").length+" pending",tone:"orange"},
        ].map(s=>{const Icon=s.icon;return <article className="stat-card" key={s.label}><div className={"stat-icon "+s.tone}><Icon size={20}/></div><span>{s.label}</span><strong>{s.value}</strong><small>{s.sub}</small></article>;})}</section>
        <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h3>Recent orders</h3><p>Latest customer activity</p></div><button className="text-btn" onClick={()=>setTab("orders")}>View all <ArrowUpRight size={15}/></button></div>
          {orders.length ? orders.slice(0,5).map(r=><div className="activity-row" key={r.id}><div className="activity-icon"><ShoppingBag size={17}/></div><div className="activity-info"><b>Order #{r.id.slice(0,8)}</b><small>{readable(r.data.customerName ?? r.data.email ?? r.data.userId)}</small></div><div className="activity-end"><b>{money(r.data.totalINR ?? r.data.total)}</b><span className={"status "+String(r.data.status??"pending").toLowerCase()}>{readable(r.data.status??"pending")}</span></div></div>) : <Empty error={datasets.orders?.error} text="Orders will appear here when customers place them."/>}
        </section><section className="panel"><div className="panel-heading"><div><h3>Operations health</h3><p>Data access status</p></div><CheckCircle2 size={20} color="#138c83"/></div>
          {[["Products catalogue",datasets.products],["Orders",datasets.orders],["User profiles",datasets.users],["Service desk",datasets.serviceBookings]].map(([name,data])=><div className="health-row" key={String(name)}><span className="health-dot" style={{background:(data as Dataset|undefined)?.error?"#d97706":"#159b87"}}/><span>{String(name)}</span><b>{(data as Dataset|undefined)?.error?"Needs access":(data as Dataset|undefined)?.rows.length ?? "Loading"}</b></div>)}<p className="last-updated"><Clock size={14}/> Last refreshed {lastUpdated || "just now"}</p></section></div>
      </> : <section className="panel table-panel"><div className="panel-heading"><div><h3>{selected.label}</h3><p>{tab==="dealers"?"Dealer-related user profiles; approval actions require a validated dealer workflow.":tab==="services"?"Customer service bookings and repair requests.":tab==="products"?"Catalogue records currently stored in Firestore.":"Track and update customer order status."}</p></div><span className="record-count">{filtered.length} records</span></div>
        <div className="table-tools"><div className="search-box"><Search size={17}/><input placeholder={"Search "+selected.label.toLowerCase()+"…"} value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
        {datasets[selected.collection]?.error ? <Empty error={datasets[selected.collection].error} text="Firestore denied access to this collection."/> : filtered.length === 0 ? <Empty text={busy?"Loading records…":"No matching records found."}/> : <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Record ID</th>{fields.map(f=><th key={f}>{titleCase(f)}</th>)}{tab==="orders"&&<th>Quick action</th>}</tr></thead><tbody>{filtered.slice(0,100).map(r=><tr key={r.id}><td className="record-id">{r.id.slice(0,12)}</td>{fields.map(f=><td key={f}>{f==="priceINR"||f==="totalINR"||f==="total"||f==="dealerPriceINR"?money(r.data[f]):f==="status"||f==="active"?<span className={"status "+String(r.data[f]??"unknown").toLowerCase()}>{readable(r.data[f])}</span>:readable(r.data[f])}</td>)}{tab==="orders"&&<td><select aria-label={"Update order "+r.id} value={String(r.data.status??"pending")} onChange={e=>void updateOrder(r,e.target.value)}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>}</tr>)}</tbody></table></div>}
        <p className="table-footnote">Showing up to 100 records. Refresh to fetch the latest Firestore data.</p>
      </section>}
      <footer className="dashboard-footer">PurifiX Admin · Secure operations console <span>Built for cleaner water operations</span></footer>
    </main>
  </div>;
}
function Empty({text,error}:{text:string;error?:string}) { return <div className="empty-state"><div className="empty-icon"><AlertTriangle size={22}/></div><b>{text}</b>{error&&<small>{error}</small>}</div>; }
