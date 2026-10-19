import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const cover = (id, width = 480) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

const demoTracks = [
  { id: 'd1', title: 'Golden Hour', artist: 'Juno Bloom', album: 'Soft Focus', duration: 213, art: cover('photo-1470225620780-dba8ba36b745') },
  { id: 'd2', title: 'Somewhere, Slowly', artist: 'The Sunday Club', album: 'Small Hours', duration: 187, art: cover('photo-1519608487953-e999c86e7455') },
  { id: 'd3', title: 'Blue Skies Again', artist: 'Mira Sol', album: 'Daydreaming', duration: 202, art: cover('photo-1470252649378-9c29740c9fa8') },
  { id: 'd4', title: 'Afterglow', artist: 'Coastline', album: 'Tidal', duration: 231, art: cover('photo-1507525428034-b723cf961d3e') },
  { id: 'd5', title: 'Night Drive', artist: 'Paper Planes', album: 'The Long Way Home', duration: 196, art: cover('photo-1519608487953-e999c86e7455') },
  { id: 'd6', title: 'Wildflower', artist: 'June & Jane', album: 'Wildflower', duration: 179, art: cover('photo-1490750967868-88aa4486c946') },
  { id: 'd7', title: 'Coffee Shop Rain', artist: 'Theo Parks', album: 'Window Seat', duration: 221, art: cover('photo-1445116572660-236099ec97a0') },
  { id: 'd8', title: 'Lemonade Skies', artist: 'Nia Rivers', album: 'Good Things', duration: 205, art: cover('photo-1470252649378-9c29740c9fa8') },
]

const collections = [
  { title: 'A little bit of everything', subtitle: 'Your daily mix', art: cover('photo-1493225457124-a3eb161ffa5f'), color: '#c47756' },
  { title: 'Easy mornings', subtitle: 'A softer start', art: cover('photo-1470252649378-9c29740c9fa8'), color: '#9eaa81' },
  { title: 'Indie discoveries', subtitle: 'Fresh finds for you', art: cover('photo-1500530855697-b586d89ba3ee'), color: '#8a7598' },
  { title: 'The long way home', subtitle: 'Windows down, volume up', art: cover('photo-1500534623283-312aade485b7'), color: '#bf8e53' },
  { title: 'Quiet evenings', subtitle: 'Take a moment', art: cover('photo-1519608487953-e999c86e7455'), color: '#637786' },
  { title: 'Fresh air', subtitle: 'Songs for outside', art: cover('photo-1470770841072-f978cf4d019e'), color: '#639083' },
]

function Icon({ name, size = 22, fill = 'none' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill, 'aria-hidden': true }
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    library: <><path d="M4 4v16M9 4v16M14 5l4.2-1 3.6 15.5-4.2 1z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrowLeft: <><path d="m15 18-6-6 6-6" /></>,
    arrowRight: <><path d="m9 18 6-6-6-6" /></>,
    play: <path d="m8 5 12 7-12 7z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor" stroke="none" /></>,
    shuffle: <><path d="m18 14 3 3-3 3M18 4l3 3-3 3M3 7h3c4 0 7 10 11 10h4M3 17h3c1.3 0 2.5-1.2 3.6-2.7M14.4 9.7C15.2 8.2 16 7 17 7h4" /></>,
    previous: <><path d="M6 5v14M19 5 8 12l11 7z" fill="currentColor" stroke="none" /></>,
    next: <><path d="M18 5v14M5 5l11 7-11 7z" fill="currentColor" stroke="none" /></>,
    volume: <><path d="M4 10v4h4l5 4V6l-5 4z" /><path d="M17 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12" /></>,
    heart: <path d="M20.8 8.8c0 5.3-8.8 10-8.8 10s-8.8-4.7-8.8-10A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.8 2.2Z" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    down: <path d="m6 9 6 6 6-6" />,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
    volumeOff: <><path d="M4 10v4h4l5 4V6l-5 4zM17 9l5 6m0-6-5 6" /></>,
  }
  return <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

function normalizeTrack(track, index) {
  const artist = track.artist
  return {
    id: track._id || track.id || `track-${index}`,
    title: track.title || 'Untitled track',
    artist: typeof artist === 'string' ? artist : artist?.username || 'Unknown artist',
    album: track.album?.title || 'Single',
    duration: Number(track.duration) || 210,
    art: track.cover || track.album?.cover || demoTracks[index % demoTracks.length].art,
    uri: track.uri || '',
  }
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resonance-user') || 'null')
    } catch {
      return null
    }
  })
  const [tracks, setTracks] = useState(demoTracks)
  const [albums, setAlbums] = useState([])
  const [activeTrack, setActiveTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState('Home')
  const [libraryFilter, setLibraryFilter] = useState('Playlists')
  const [liked, setLiked] = useState([])
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '', role: 'user' })
  const [uploadForm, setUploadForm] = useState({ title: '', music: null })
  const [volume, setVolume] = useState(0.75)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const loadLibrary = async () => {
      try {
        const [musicResponse, albumResponse] = await Promise.all([
          fetch('/api/music/', { credentials: 'include' }),
          fetch('/api/music/albums', { credentials: 'include' }),
        ])
        if (!musicResponse.ok) {
          const result = await musicResponse.json().catch(() => ({}))
          throw new Error(result.message || 'Could not load your music library.')
        }
        const musicData = await musicResponse.json()
        const albumData = albumResponse.ok ? await albumResponse.json() : { albums: [] }
        if (cancelled) return
        const backendTracks = (musicData.musics || []).map(normalizeTrack)
        if (backendTracks.length) setTracks(backendTracks)
        setAlbums(albumData.albums || [])
        setNotice(backendTracks.length ? '' : 'Your library is ready. Add music to see your tracks here.')
      } catch (error) {
        if (!cancelled) setNotice(`${error.message} Showing the listening preview instead.`)
      }
    }
    loadLibrary()
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (activeTrack?.uri && audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
          setNotice('This track could not be played. Try another track.')
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [activeTrack, isPlaying, muted, volume])

  useEffect(() => {
    if (!activeTrack || !isPlaying || activeTrack.uri) return undefined
    const timer = window.setInterval(() => {
      setCurrentTime((time) => {
        if (time + 1 >= activeTrack.duration) {
          if (!repeat) setIsPlaying(false)
          return 0
        }
        return time + 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [activeTrack, isPlaying, repeat])

  const filteredTracks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return tracks
    return tracks.filter((track) =>
      `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query, tracks])

  const playTrack = (track) => {
    if (activeTrack?.id === track.id) {
      setIsPlaying((playing) => !playing)
      return
    }
    setCurrentTime(0)
    setActiveTrack(track)
    setIsPlaying(true)
  }

  const playNext = () => {
    const playlist = filteredTracks.length ? filteredTracks : tracks
    if (!playlist.length) return
    const currentIndex = playlist.findIndex((track) => track.id === activeTrack?.id)
    const nextIndex = shuffle ? Math.floor(Math.random() * playlist.length) : (currentIndex + 1) % playlist.length
    setCurrentTime(0)
    setActiveTrack(playlist[nextIndex])
    setIsPlaying(true)
  }

  const playPrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0)
      if (audioRef.current) audioRef.current.currentTime = 0
      return
    }
    const playlist = filteredTracks.length ? filteredTracks : tracks
    const currentIndex = playlist.findIndex((track) => track.id === activeTrack?.id)
    const previousIndex = (currentIndex - 1 + playlist.length) % playlist.length
    setCurrentTime(0)
    setActiveTrack(playlist[previousIndex])
    setIsPlaying(true)
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setLoading(true)
    setNotice('')
    const isRegister = authMode === 'register'
    try {
      const response = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(isRegister
          ? authForm
          : { username: authForm.username, email: authForm.email || authForm.username, password: authForm.password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || result.Message || 'Unable to sign in. Please try again.')
      const account = result.user
      const profile = { id: account._id, username: account.username, email: account.email, role: account.role }
      localStorage.setItem('resonance-user', JSON.stringify(profile))
      setUser(profile)
      setAuthOpen(false)
      setAuthForm({ username: '', email: '', password: '', role: 'user' })
      setNotice(`Welcome${profile.username ? `, ${profile.username}` : ''}. Your library is ready.`)
    } catch (error) {
      setNotice(error.message || 'Could not connect to the music service.')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      setNotice('Could not contact the server, but you have been signed out on this device.')
    }
    localStorage.removeItem('resonance-user')
    setUser(null)
    setAlbums([])
    setTracks(demoTracks)
    setNotice('You have been signed out.')
  }

  const uploadTrack = async (event) => {
    event.preventDefault()
    if (!uploadForm.music) {
      setNotice('Choose an audio file before uploading.')
      return
    }
    const data = new FormData()
    data.append('title', uploadForm.title)
    data.append('music', uploadForm.music)
    setLoading(true)
    try {
      const response = await fetch('/api/music/upload', { method: 'POST', credentials: 'include', body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || result.Message || 'The track could not be uploaded.')
      const newTrack = normalizeTrack(result.music, tracks.length)
      setTracks((previous) => [newTrack, ...previous])
      setUploadOpen(false)
      setUploadForm({ title: '', music: null })
      setNotice('Your track is live in the library.')
    } catch (error) {
      setNotice(error.message || 'The upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = (trackId) =>
    setLiked((current) => current.includes(trackId) ? current.filter((id) => id !== trackId) : [...current, trackId])

  const chooseNav = (nav) => {
    setActiveNav(nav)
    if (nav === 'Search') document.querySelector('#search-input')?.focus()
    if (nav === 'Home') setQuery('')
  }

  const shownCards = query ? filteredTracks.slice(0, 6).map((track) => ({
    title: track.title, subtitle: track.artist, art: track.art, track,
  })) : collections.map((item) => ({ ...item }))

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); chooseNav('Home') }} aria-label="Resonance home">
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span>resonance</span>
        </a>

        <nav className="primary-nav" aria-label="Main navigation">
          {[
            { title: 'Home', icon: 'home' },
            { title: 'Search', icon: 'search' },
          ].map((item) => (
            <button key={item.title} className={`nav-link ${activeNav === item.title ? 'selected' : ''}`} onClick={() => chooseNav(item.title)}>
              <Icon name={item.icon} size={21} /><span>{item.title}</span>
            </button>
          ))}
        </nav>

        <section className="library-panel">
          <div className="library-heading">
            <button className={`nav-link library-title ${activeNav === 'Library' ? 'selected' : ''}`} onClick={() => chooseNav('Library')}>
              <Icon name="library" size={21} /><span>Your library</span>
            </button>
            <button className="icon-button library-add" aria-label="Create playlist" title="Create playlist" onClick={() => setNotice('Your library is ready for your own playlists.')}>
              <Icon name="plus" size={20} />
            </button>
          </div>
          <div className="library-filters">
            {['Playlists', 'Artists', 'Albums'].map((filter) => (
              <button key={filter} onClick={() => setLibraryFilter(filter)} className={`filter-chip ${libraryFilter === filter ? 'active' : ''}`}>{filter}</button>
            ))}
          </div>
          {libraryFilter === 'Artists' ? (
            <div className="empty-library"><span className="empty-avatar">♫</span><p>Artists you follow will show up here.</p></div>
          ) : libraryFilter === 'Albums' && albums.length ? (
            <div className="library-list">
              {albums.slice(0, 6).map((album) => (
                <button key={album._id} className="library-item" onClick={() => setNotice(`Album: ${album.title}`)}>
                  <span className="library-art"><Icon name="library" size={19} /></span>
                  <span><strong>{album.title}</strong><small>Album · {album.artist?.username || 'Artist'}</small></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="library-list">
              <button className="library-item liked-item" onClick={() => setActiveNav('Liked Songs')}>
                <span className="liked-art"><Icon name="heart" size={22} fill="currentColor" /></span>
                <span><strong>Liked Songs</strong><small>Playlist · {liked.length} songs</small></span>
              </button>
              <button className="library-item" onClick={() => setActiveNav('Made for you')}>
                <img className="library-art" src={collections[0].art} alt="" />
                <span><strong>Your daily mix</strong><small>Made for you</small></span>
              </button>
              <button className="library-item" onClick={() => setActiveNav('Recently played')}>
                <img className="library-art" src={collections[1].art} alt="" />
                <span><strong>Recently played</strong><small>Keep the good going</small></span>
              </button>
            </div>
          )}
          <div className="sidebar-promo">
            <p className="promo-eyebrow">YOUR SOUND, YOUR WAY</p>
            <p>Build a library that feels like you.</p>
            {!user && <button onClick={() => { setAuthMode('register'); setAuthOpen(true) }}>Join for free <span>↗</span></button>}
          </div>
        </section>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="history-buttons">
            <button className="icon-button history-button" aria-label="Go back" onClick={() => window.history.back()}><Icon name="arrowLeft" size={20} /></button>
            <button className="icon-button history-button" aria-label="Go forward" onClick={() => window.history.forward()}><Icon name="arrowRight" size={20} /></button>
          </div>
          <label className={`search-box ${activeNav === 'Search' ? 'search-focused' : ''}`}>
            <Icon name="search" size={20} />
            <input id="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you want to play?" aria-label="Search songs, artists, or albums" />
            {query && <button className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
          </label>
          <div className="account-actions">
            {user ? (
              <div className="account-menu">
                {user.role === 'artist' && <button className="upload-button" onClick={() => setUploadOpen(true)}><Icon name="upload" size={17} /> Upload</button>}
                <button className="profile-button" title={user.email || user.username} onClick={signOut}><span className="profile-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</span><span className="profile-name">{user.username}</span><Icon name="down" size={16} /></button>
              </div>
            ) : (
              <>
                <button className="text-button signup-button" onClick={() => { setAuthMode('register'); setAuthOpen(true) }}>Sign up</button>
                <button className="login-button" onClick={() => { setAuthMode('login'); setAuthOpen(true) }}>Log in</button>
              </>
            )}
          </div>
        </header>

        <div className="content-scroll">
          <section className="welcome-section">
            <div className="welcome-copy">
              <p className="eyebrow">A SOUNDTRACK FOR RIGHT NOW</p>
              <h1>{user ? `Good to have you here, ${user.username}.` : 'Find your next favorite.'}</h1>
              <p className="welcome-description">A little more feeling in everything you listen to.</p>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
              <div className="art-sun" /><div className="art-moon" />
              <span className="art-note note-one">♪</span><span className="art-note note-two">♫</span>
              <div className="art-label">SOUND<br />IN MOTION</div>
            </div>
          </section>

          {!user && (
            <div className="preview-banner">
              <div><strong>Your next favorite is waiting.</strong><span>Sign in to connect your library and keep your music close.</span></div>
              <button onClick={() => { setAuthMode('register'); setAuthOpen(true) }}>Get started <span>→</span></button>
            </div>
          )}
          {notice && <div className="notice-bar" role="status"><span className="notice-dot" />{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')}><Icon name="close" size={16} /></button></div>}

          <section className="section-block">
            <div className="section-heading">
              <div><p className="eyebrow">{query ? 'THE GOOD STUFF' : 'MADE FOR THE MOMENT'}</p><h2>{query ? `Results for “${query}”` : 'Made for your kind of day'}</h2></div>
              <button className="see-all" onClick={() => { setActiveNav('Search'); document.querySelector('#search-input')?.focus() }}>{query ? 'Clear search' : 'See all'} <span>↗</span></button>
            </div>
            {shownCards.length ? (
              <div className="card-grid">
                {shownCards.map((item, index) => (
                  <article className="music-card" key={item.title + index} style={{ '--card-color': item.color || '#8d756b' }}>
                    <button className="card-art-button" aria-label={`Play ${item.title}`} onClick={() => playTrack(item.track || tracks[index % tracks.length])}>
                      <img className="card-art" src={item.art} alt="" />
                      <span className="card-play"><Icon name={activeTrack?.id === item.track?.id && isPlaying ? 'pause' : 'play'} size={23} /></span>
                    </button>
                    <button className="card-title" onClick={() => item.track && playTrack(item.track)}>{item.title}</button>
                    <p>{item.subtitle || item.description || 'A collection for every kind of day'}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-results"><span>✳</span><strong>No matches just yet</strong><p>Try a different song, artist, or album name.</p><button onClick={() => setQuery('')}>Back to your picks</button></div>
            )}
          </section>

          <section className="section-block tracks-section">
            <div className="section-heading">
              <div><p className="eyebrow">FIND YOUR FLOW</p><h2>{query ? 'Matching tracks' : 'A few good places to start'}</h2></div>
              <button className="see-all" onClick={() => setActiveNav('Library')}>Open your library <span>↗</span></button>
            </div>
            <div className="track-table">
              <div className="track-table-head"><span>#</span><span>Title</span><span>Album</span><span>Time</span></div>
              {filteredTracks.slice(0, 6).map((track, index) => (
                <div className={`track-row ${activeTrack?.id === track.id ? 'playing-row' : ''}`} key={track.id}>
                  <button className="track-index" onClick={() => playTrack(track)} aria-label={`Play ${track.title}`}>
                    {activeTrack?.id === track.id && isPlaying ? <span className="playing-bars"><i /><i /><i /></span> : <><span className="track-number">{String(index + 1).padStart(2, '0')}</span><span className="row-play"><Icon name="play" size={15} /></span></>}
                  </button>
                  <button className="track-info" onClick={() => playTrack(track)}>
                    <img src={track.art} alt="" /><span><strong>{track.title}</strong><small>{track.artist}</small></span>
                  </button>
                  <button className="track-album" onClick={() => setNotice(`From ${track.album}`)}>{track.album}</button>
                  <div className="track-actions">
                    <button className={`like-button ${liked.includes(track.id) ? 'is-liked' : ''}`} aria-label={liked.includes(track.id) ? 'Unlike song' : 'Like song'} onClick={() => toggleLike(track.id)}><Icon name="heart" size={17} fill={liked.includes(track.id) ? 'currentColor' : 'none'} /></button>
                    <span>{formatTime(track.duration)}</span>
                    <button className="track-more" aria-label={`More options for ${track.title}`} onClick={() => toggleLike(track.id)}><Icon name="more" size={19} /></button>
                  </div>
                </div>
              ))}
              {!filteredTracks.length && <div className="empty-tracks">No tracks found. Try another search.</div>}
            </div>
          </section>

          <footer className="page-footer">
            <a className="footer-brand" href="#" onClick={(event) => event.preventDefault()}>resonance<span>®</span></a>
            <p>Made for the moments in between.</p>
            <span>© 2026 Resonance</span>
          </footer>
        </div>
      </main>

      <footer className="player-bar">
        <div className="now-playing">
          {activeTrack ? (
            <>
              <img className="now-playing-art" src={activeTrack.art} alt="" />
              <div className="now-playing-copy"><strong>{activeTrack.title}</strong><span>{activeTrack.artist}</span></div>
              <button className={`like-button player-like ${liked.includes(activeTrack.id) ? 'is-liked' : ''}`} aria-label="Like current song" onClick={() => toggleLike(activeTrack.id)}><Icon name="heart" size={17} fill={liked.includes(activeTrack.id) ? 'currentColor' : 'none'} /></button>
            </>
          ) : <div className="player-empty"><span className="player-empty-icon">♫</span><span>Pick a song to get started</span></div>}
        </div>
        <div className="player-center">
          <div className="player-controls">
            <button className={`player-control secondary-control ${shuffle ? 'control-active' : ''}`} aria-label="Shuffle" onClick={() => setShuffle((value) => !value)}><Icon name="shuffle" size={17} /></button>
            <button className="player-control" aria-label="Previous track" onClick={playPrevious}><Icon name="previous" size={19} /></button>
            <button className="main-play" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={() => activeTrack ? setIsPlaying((playing) => !playing) : playTrack(tracks[0])}><Icon name={isPlaying ? 'pause' : 'play'} size={20} /></button>
            <button className="player-control" aria-label="Next track" onClick={playNext}><Icon name="next" size={19} /></button>
            <button className={`player-control secondary-control ${repeat ? 'control-active' : ''}`} aria-label="Repeat" onClick={() => setRepeat((value) => !value)}><span className="repeat-icon">↻</span></button>
          </div>
          <div className="progress-row">
            <span>{formatTime(currentTime)}</span>
            <input className="progress-slider" type="range" min="0" max={activeTrack?.duration || 1} value={Math.min(currentTime, activeTrack?.duration || 1)} aria-label="Track progress" style={{ '--progress': `${activeTrack ? (currentTime / activeTrack.duration) * 100 : 0}%` }} onChange={(event) => {
              const time = Number(event.target.value)
              setCurrentTime(time)
              if (audioRef.current && activeTrack?.uri) audioRef.current.currentTime = time
            }} />
            <span>{formatTime(activeTrack?.duration || 0)}</span>
          </div>
        </div>
        <div className="player-extras">
          <button className="player-control queue-button" aria-label="Queue" onClick={() => setNotice('Up next: ' + (tracks[0]?.title || 'Nothing queued'))}><Icon name="library" size={17} /></button>
          <button className="player-control volume-button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((value) => !value)}><Icon name={muted ? 'volumeOff' : 'volume'} size={19} /></button>
          <input className="volume-slider" aria-label="Volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(event) => { setVolume(Number(event.target.value)); setMuted(false) }} />
        </div>
        <audio ref={audioRef} src={activeTrack?.uri || undefined} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onEnded={(event) => {
          if (repeat) {
            event.currentTarget.currentTime = 0
            event.currentTarget.play().catch(() => setIsPlaying(false))
          } else {
            playNext()
          }
        }} />
      </footer>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={activeNav === 'Home' ? 'selected' : ''} onClick={() => chooseNav('Home')}><Icon name="home" size={21} />Home</button>
        <button className={activeNav === 'Search' ? 'selected' : ''} onClick={() => chooseNav('Search')}><Icon name="search" size={21} />Search</button>
        <button className={activeNav === 'Library' ? 'selected' : ''} onClick={() => chooseNav('Library')}><Icon name="library" size={21} />Your library</button>
      </nav>

      {authOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false) }}>
          <section className="dialog auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="dialog-close" aria-label="Close dialog" onClick={() => setAuthOpen(false)}><Icon name="close" size={20} /></button>
            <div className="dialog-brand"><span className="brand-mark"><span /><span /><span /><span /></span> resonance</div>
            <p className="eyebrow">{authMode === 'login' ? 'WELCOME BACK' : 'MAKE IT YOURS'}</p>
            <h2 id="auth-title">{authMode === 'login' ? 'Good music misses you.' : 'Your sound starts here.'}</h2>
            <p className="dialog-description">{authMode === 'login' ? 'Sign in and pick up right where you left off.' : 'Create an account and make room for more.'}</p>
            <form onSubmit={submitAuth} className="dialog-form">
              <label>Username or email<input required autoFocus value={authForm.username} onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })} placeholder="Your username" /></label>
              {authMode === 'register' && <>
                <label>Email<input required type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="you@example.com" /></label>
                <label className="select-label">I am joining as
                  <select value={authForm.role} onChange={(event) => setAuthForm({ ...authForm, role: event.target.value })}><option value="user">Listener</option><option value="artist">Artist</option></select>
                </label>
              </>}
              <label>Password<input required type="password" minLength="6" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="Your password" /></label>
              <button className="dialog-submit" type="submit" disabled={loading}>{loading ? 'One moment…' : authMode === 'login' ? 'Log in' : 'Create account'}</button>
            </form>
            <p className="auth-switch">{authMode === 'login' ? 'New around here?' : 'Already have an account?'} <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setNotice('') }}>{authMode === 'login' ? 'Sign up' : 'Log in'}</button></p>
          </section>
        </div>
      )}

      {uploadOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setUploadOpen(false) }}>
          <section className="dialog upload-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-title">
            <button className="dialog-close" aria-label="Close dialog" onClick={() => setUploadOpen(false)}><Icon name="close" size={20} /></button>
            <p className="eyebrow">FOR THE CREATORS</p><h2 id="upload-title">Put your music out there.</h2>
            <p className="dialog-description">Upload an audio track to add it to the Resonance library.</p>
            <form className="dialog-form" onSubmit={uploadTrack}>
              <label>Track title<input required value={uploadForm.title} onChange={(event) => setUploadForm({ ...uploadForm, title: event.target.value })} placeholder="Give your track a name" /></label>
              <label className="file-picker">Audio file<input required type="file" accept="audio/*" onChange={(event) => setUploadForm({ ...uploadForm, music: event.target.files?.[0] || null })} /><span><Icon name="upload" size={20} />{uploadForm.music?.name || 'Choose an audio file'}</span></label>
              <button className="dialog-submit" type="submit" disabled={loading}>{loading ? 'Uploading…' : 'Upload track'}</button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
