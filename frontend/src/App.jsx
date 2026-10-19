import { useState } from "react";
import { request } from "./api";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import ArtistPage from "./pages/ArtistPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("spotify-user") || "null"));
  const [page, setPage] = useState("home");
  const [error, setError] = useState("");

  function login(account) {
    localStorage.setItem("spotify-user", JSON.stringify(account));
    setUser(account);
  }

  async function logout() {
    setError("");
    try {
      await request("/auth/logout", { method: "POST" });
      localStorage.removeItem("spotify-user");
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user) return <AuthPage onLogin={login} />;

  return (
    <Layout user={user} page={page} onNavigate={setPage} onLogout={logout}>
      {error && <p className="notice error">{error}</p>}
      {page === "studio" && user.role === "artist" ? <ArtistPage /> : <HomePage />}
    </Layout>
  );
}
