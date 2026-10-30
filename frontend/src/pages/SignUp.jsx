import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../ui/SignUp.css";



const SignUp = () => {

const {signup,authUser,isSigning}=useAuthStore();

const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
    role:"user"

});

const validateForm=()=>{
     if (!formData.username.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if(!formData.role){
            return toast.error("Error in role selection");
        }

        return true;
}


const formSubmit=async (e)=>{
    e.preventDefault();


    const success=validateForm();

    if(success){
        await signup(formData);
    }

}





  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={formSubmit}>
        <input className="signup-input signup-name" type='text' value={formData.username} onChange={(e)=>{setFormData({...formData,username:e.target.value})}}/>
        <input className="signup-input signup-email" type='text' value={formData.email} onChange={(e)=>{setFormData({...formData,email:e.target.value})}}/>
        <input className="signup-input signup-password" type='password' value={formData.password} onChange={(e)=>{setFormData({...formData,password:e.target.value})}}/>
        <select className="signup-input signup-role" value={formData.role} onChange={(e)=>{setFormData({...formData,role:e.target.value})}}>
                     <option value="user">Listener</option>
                     <option value="artist">Artist</option>
        </select>

         <button className='sub-btn auth-submit' type='submit' disabled={isSigning}> {isSigning ? (<> <Loader2/> Loading ...</>) : ("Create Account")} </button>

      </form>


      <div className="signup-footer auth-footer">
        <p>Already have an account ? {" "} <Link to="/login" >Sign in</Link></p>
      </div>
    </div>

    
  )
}

export default SignUp
