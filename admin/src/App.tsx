import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Droplets, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.admin !== true) {
        await signOut(auth);
        setMessage("This account is not an approved administrator.");
        return;
      }
      setSignedIn(true);
      setMessage(`Signed in as ${credential.user.email ?? "administrator"}`);
    } catch {
      setMessage("Sign-in failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setSignedIn(false);
    setPassword("");
    setMessage("");
  }

  return (
    <main className="page-shell">
      <section className="login-card">
        <div className="brand-mark"><Droplets size={30} /></div>
        <p className="eyebrow">PURIFIX OPERATIONS</p>
        <h1>PurifiX <span>Admin</span></h1>
        <p className="intro">Manage orders, service requests and dealer access from one place.</p>
        {!signedIn ? (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Administrator email</label>
            <div className="input-wrap"><Mail size={18} /><input id="email" type="email" autoComplete="username" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <label htmlFor="password">Password</label>
            <div className="input-wrap"><LockKeyhole size={18} /><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <button type="submit" disabled={loading}>{loading ? "Verifying…" : "Sign in securely"}</button>
          </form>
        ) : (
          <div className="signed-in">
            <ShieldCheck size={34} />
            <h2>Administrator verified</h2>
            <p>{message}</p>
            <button type="button" onClick={handleLogout}>Sign out</button>
            <p className="notice">Dashboard data panels will be enabled after the Firestore access checks are configured.</p>
          </div>
        )}
        {!signedIn && message && <p className="error" role="alert">{message}</p>}
        <div className="security-note"><ShieldCheck size={17} /><span>Administrator access is verified with Firebase claims.</span></div>
      </section>
      <footer>PurifiX · Clean water. Clear operations.</footer>
    </main>
  );
}
