export default function Layout({ user, page, onNavigate, onLogout, children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => onNavigate("home")}>♫ Spotify</a>
        <button className={page === "home" ? "nav active" : "nav"} onClick={() => onNavigate("home")}>
          Home
        </button>
        {user.role === "artist" && (
          <button className={page === "studio" ? "nav active" : "nav"} onClick={() => onNavigate("studio")}>
            Artist studio
          </button>
        )}
        <div className="account">
          <span>{user.username} · {user.role}</span>
          <button className="text-button" onClick={onLogout}>Log out</button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
