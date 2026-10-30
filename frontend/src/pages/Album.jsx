import React from 'react'
import { useMusicStore } from '../store/useMusicStore'
import { getMusicCover } from '../lib/musicCovers'

const Album = () => {

 const {Id,albums}=useMusicStore();
 const album=albums.find((item)=>item._id===Id);


  return (
    <div className="album-page">
      {album ? (
        <>
          <h1>{album.title}</h1>
          {album.musics.map((music)=>(
            <div className="music-card" key={music._id}>
              <img className="music-cover" src={getMusicCover(music._id)} alt="" />
              <audio className="music-player" controls>
                <source src={music.uri} type="audio/mpeg" />
              </audio>
              <div>{music.title}</div>
            </div>
          ))}
        </>
      ) : (
        <p>Album not found.</p>
      )}
    </div>
  )
}

export default Album
