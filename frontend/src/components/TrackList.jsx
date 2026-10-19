import { useEffect, useState } from "react";
import { request } from "../api";

export default function TrackList({ tracks }) {
  const [apiTracks, setApiTracks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!tracks);

  useEffect(() => {
    if (tracks) return;

    request("/music")
      .then((data) => setApiTracks(data.musics || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tracks]);

  const songs = tracks ?? apiTracks;

  if (loading) return <p className="muted">Loading tracks...</p>;
  if (error) return <p className="notice error">{error}</p>;
  if (!songs.length) return <p className="muted">No tracks yet.</p>;

  return (
    <div className="track-list">
      {songs.map((track) => (
        <article className="track" key={track._id || track.id}>
          <div>
            <strong>{track.title}</strong>
            <p className="muted">{track.artist?.username || "Spotify artist"}</p>
          </div>
          <audio controls src={track.uri}>Your browser does not support audio playback.</audio>
        </article>
      ))}
    </div>
  );
}
