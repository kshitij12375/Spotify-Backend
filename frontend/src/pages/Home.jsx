import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useMusicStore } from '../store/useMusicStore';
import "../ui/Home.css"
import { useNavigate } from 'react-router-dom';
import { getMusicCover } from '../lib/musicCovers'

const Home = () => {


  const {getMusics,musics,getAlbums,albums,setId}=useMusicStore();

  const Navigate=useNavigate();

 useEffect(()=>{

  getMusics();
  getAlbums();

 },[getMusics,getAlbums])
  

 const handleEvent=(id)=>{

          setId(id);
          Navigate("/album");
 }
  return (
    <div className="home-page">

      {
      albums.map((album)=>(
        <div className='album-card' key={album._id}>

          <button onClick={()=>{handleEvent(album._id)}}> {album.title} </button>

        </div>
      ))
      }
      {musics.map((music) => (
        <div className="music-card" key={music._id}>
          <img className="music-cover" src={getMusicCover(music._id)} alt="" />
          <audio
            className="music-player"
            controls
            onPlay={(event) => {
              document.querySelectorAll(".music-player").forEach((player) => {
                if (player !== event.currentTarget) player.pause();
              });
            }}
          >
            <source src={music.uri} type="audio/mpeg" />
          </audio>

          <div>{music.title} </div>
        </div>


      ))}
      
    </div>
  )
}

export default Home
