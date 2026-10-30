import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import "../ui/Navbar.css";

const Navbar = () => {

    const {authUser,logout}=useAuthStore();
  return (
    <div className="site-header">



      {authUser && authUser.role === "artist" && (
        <Link to="/upload">Upload </Link>
      )}

      
      {authUser ? (
    



        
         <button className="logout-btn" onClick={logout}>
                Logout
        </button>



      ):(
         
        <div className="header-actions">
        <Link className="header-link" to="/login">Login</Link>
        <Link className="header-link header-link-primary" to="/sign"> Sign In</Link>

        </div>
      
      
      
      )}
    </div>
  )
}

export default Navbar
