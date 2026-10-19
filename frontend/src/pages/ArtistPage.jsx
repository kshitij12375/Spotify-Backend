import { useEffect, useState } from "react";
import { request } from "../api";
import TrackList from "../components/TrackList";

export default function ArtistPage() {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [musicData, albumData] = await Promise.all([request("/music"), request("/music/albums")]);
    setTracks(musicData.musics || []);
    setAlbums(albumData.albums || []);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function upload(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("music");
    if (!file?.size) return setError("Choose an audio file to upload.");

    try {
      await request("/music/upload", { method: "POST", body: form });
      formElement.reset();
      setMessage("Track uploaded.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function createAlbum(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const musics = form.getAll("musics");
    try {
      await request("/music/album", {
        method: "POST",
        body: JSON.stringify({ title: form.get("title"), musics }),
      });
      formElement.reset();
      setMessage("Album created.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <header className="page-heading">
        <p className="eyebrow">ARTIST STUDIO</p>
        <h1>Share your sound.</h1>
        <p className="muted">Upload tracks and group them into albums.</p>
      </header>
      {error && <p className="notice error">{error}</p>}
      {message && <p className="notice success">{message}</p>}
      <section className="forms-grid">
        <form className="panel" onSubmit={upload}>
          <h2>Upload a track</h2>
          <label>Track title<input name="title" required /></label>
          <label>Audio file<input name="music" type="file" accept="audio/*" required /></label>
          <button className="primary">Upload track</button>
        </form>
        <form className="panel" onSubmit={createAlbum}>
          <h2>Create an album</h2>
          <label>Album title<input name="title" required /></label>
          <label>
            Add tracks
            <select name="musics" multiple size="5">
              {tracks.map((track) => <option value={track._id} key={track._id}>{track.title}</option>)}
            </select>
          </label>
          <button className="primary">Create album</button>
          <p className="muted hint">Hold Ctrl (Windows) or Command (Mac) to select multiple tracks.</p>
        </form>
      </section>
      <section className="section">
        <h2>Your tracks</h2>
        <TrackList tracks={tracks} />
      </section>
      <section className="section">
        <h2>Your albums</h2>
        {albums.length ? <ul className="album-list">{albums.map((album) => <li key={album._id}>{album.title}</li>)}</ul> : <p className="muted">No albums yet.</p>}
      </section>
    </>
  );
}
