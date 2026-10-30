import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Disc3, FileAudio2, Loader2, Music2, Plus, UploadCloud, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../ui/Upload.css'
import { useMusicStore } from '../store/useMusicStore'

const Upload = () => {
  const [mode, setMode] = useState('track')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedTracks, setSelectedTracks] = useState([])
  const navigate = useNavigate()
  const {
    musics,
    getMusics,
    uploadMusic,
    createAlbum,
    isUploading,
    isCreatingAlbum,
  } = useMusicStore()

  useEffect(() => {
    getMusics()
  }, [getMusics])

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || !file) {
      toast.error('Add a title and choose an audio file')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('music', file)


    const success = await uploadMusic(formData)
    
  }

  const handleAlbumSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim() || selectedTracks.length === 0) {
      toast.error('Add an album title and select at least one track')
      return
    }

    const success = await createAlbum({
      title: title.trim(),
      musics: selectedTracks,
    })

    if (success) {
      setTitle('')
      setSelectedTracks([])
    }
  }

  const toggleTrack = (trackId) => {
    setSelectedTracks((current) => current.includes(trackId)
      ? current.filter((id) => id !== trackId)
      : [...current, trackId])
  }

  return (
    <main className="upload-page">
      <section className="upload-shell" aria-labelledby="upload-heading">
        <Link className="upload-back" to="/">
          <ArrowLeft aria-hidden="true" />
          Back to library
        </Link>

        <div className="upload-heading">
          <span className="upload-icon">
            {mode === 'track' ? <Music2 aria-hidden="true" /> : <Disc3 aria-hidden="true" />}
          </span>
          <div>
            <p className="upload-eyebrow">Rythm for artists</p>
            <h1 id="upload-heading">{mode === 'track' ? 'Share your sound' : 'Put your tracks together'}</h1>
            <p className="upload-description">
              {mode === 'track' ? 'Add a track to your music library.' : 'Create an album from tracks you have uploaded.'}
            </p>
          </div>
        </div>

        <div className="upload-tabs" role="tablist" aria-label="Upload type">
          <button
            className={`upload-tab${mode === 'track' ? ' active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'track'}
            onClick={() => setMode('track')}
          >
            <Music2 aria-hidden="true" /> Track
          </button>
          <button
            className={`upload-tab${mode === 'album' ? ' active' : ''}`}
            type="button"
            role="tab"
            aria-selected={mode === 'album'}
            onClick={() => setMode('album')}
          >
            <Disc3 aria-hidden="true" /> Album
          </button>
        </div>

        {mode === 'track' ? (
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="upload-field">
            <label htmlFor="track-title">Track title</label>
            <input
              id="track-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give your track a name"
              maxLength={120}
              required
            />
          </div>

          <div className="upload-field">
            <label htmlFor="track-file">Audio file</label>
            <label className={`upload-dropzone${file ? ' has-file' : ''}`} htmlFor="track-file">
              <input
                id="track-file"
                className="upload-file-input"
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                required={!file}
              />
              {file ? (
                <span className="upload-file-details">
                  <FileAudio2 aria-hidden="true" />
                  <span className="upload-file-name">{file.name}</span>
                  <span className="upload-file-size">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                </span>
              ) : (
                <span className="upload-prompt">
                  <UploadCloud aria-hidden="true" />
                  <strong>Choose an audio file</strong>
                  <span>MP3, WAV, M4A and other audio formats</span>
                </span>
              )}
            </label>
            {file && (
              <button
                className="upload-remove"
                type="button"
                onClick={() => {
                  setFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                aria-label="Remove selected file"
              >
                <X aria-hidden="true" />
                Remove file
              </button>
            )}
          </div>

          {file && (
            <div className="upload-preview">
              <span>Preview</span>
              <audio controls src={previewUrl}>Your browser does not support audio playback.</audio>
            </div>
          )}

          <button className="upload-submit" type="submit" disabled={isUploading || !file || !title.trim()}>
            {isUploading ? (
              <><Loader2 className="upload-spinner" aria-hidden="true" /> Uploading track...</>
            ) : (
              <><UploadCloud aria-hidden="true" /> Upload track</>
            )}
          </button>
          <p className="upload-note">Your track will be added to the Rythm music library.</p>
        </form>
        ) : (
          <form className="upload-form" onSubmit={handleAlbumSubmit}>
            <div className="upload-field">
              <label htmlFor="album-title">Album title</label>
              <input
                id="album-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your album a name"
                maxLength={120}
                required
              />
            </div>

            <fieldset className="album-track-picker">
              <legend>
                Select tracks
                <span>{selectedTracks.length} selected</span>
              </legend>
              {musics.length > 0 ? (
                <div className="album-track-list">
                  {musics.map((music) => (
                    <label className="album-track-option" key={music._id}>
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(music._id)}
                        onChange={() => toggleTrack(music._id)}
                      />
                      <span className="album-track-art"><Music2 aria-hidden="true" /></span>
                      <span className="album-track-title">{music.title}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="album-track-empty">
                  <Disc3 aria-hidden="true" />
                  <p>No tracks uploaded yet.</p>
                  <button type="button" onClick={() => setMode('track')}>
                    <Plus aria-hidden="true" /> Upload your first track
                  </button>
                </div>
              )}
            </fieldset>

            <button
              className="upload-submit"
              type="submit"
              disabled={isCreatingAlbum || !title.trim() || selectedTracks.length === 0}
            >
              {isCreatingAlbum ? (
                <><Loader2 className="upload-spinner" aria-hidden="true" /> Creating album...</>
              ) : (
                <><Disc3 aria-hidden="true" /> Create album</>
              )}
            </button>
            <p className="upload-note">Select one or more tracks you’ve uploaded to Rythm.</p>
          </form>
        )}
      </section>
    </main>
  )
}

export default Upload
