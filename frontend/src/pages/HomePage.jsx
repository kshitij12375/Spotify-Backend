import { useEffect, useState } from "react";
import { request } from "../api";
import TrackList from "../components/TrackList";

export default function HomePage() {
  const [albums, setAlbums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/music/albums")
      .then((data) => setAlbums(data.albums || []))
      .catch((err) => setError(err.message));
  }, []);

  async function openAlbum(id) {
    setError("");
    try {
      const data = await request(`/music/albums/${id}`);
      setSelected(data.albums);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">YOUR MUSIC</p>
        <h1>Good music, good mood.</h1>
        <p className="muted">Discover tracks and albums from your artists.</p>
      </header>
      {error && <p className="notice error">{error}</p>}
      {selected ? (
        <section className="section">
          <button className="text-button" onClick={() => setSelected(null)}>← All music</button>
          <h2>{selected.title}</h2>
          <TrackList tracks={selected.musics || []} />
        </section>
      ) : (
        <>
          <section className="section">
            <h2>Albums</h2>
            {albums.length ? (
              <div className="album-grid">
                {albums.map((album) => (
                  <button className="album-card" key={album._id} onClick={() => openAlbum(album._id)}>
                    <span className="album-art">♫</span>
                    <strong>{album.title}</strong>
                    <span className="muted">{album.artist?.username || "Artist"}</span>
                  </button>
                ))}
              </div>
            ) : <p className="muted">No albums yet.</p>}
          </section>
          <section className="section">
            <h2>All tracks</h2>
            <TrackList />
          </section>
        </>
      )}
    </>
  );
}
