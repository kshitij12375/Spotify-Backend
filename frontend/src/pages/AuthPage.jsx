import { useState } from "react";
import { request } from "../api";

export default function AuthPage({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form);

    try {
      const data = await request(`/auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      onLogin({ username: data.user.username, role: data.user.role });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <a className="brand" href="#">♫ Spotify</a>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        {error && <p className="notice error">{error}</p>}
        <label>Username<input name="username" required autoComplete="username" /></label>
        {register && (
          <>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label>
              Account type
              <select name="role">
                <option value="user">Listener</option>
                <option value="artist">Artist</option>
              </select>
            </label>
          </>
        )}
        <label>Password<input name="password" type="password" required minLength="6" autoComplete={register ? "new-password" : "current-password"} /></label>
        <button className="primary wide" disabled={busy}>{busy ? "Please wait..." : register ? "Create account" : "Log in"}</button>
        <p className="muted switch-auth">
          {register ? "Already have an account?" : "New to Spotify?"}{" "}
          <button type="button" className="text-button" onClick={() => { setRegister(!register); setError(""); }}>
            {register ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </main>
  );
}
