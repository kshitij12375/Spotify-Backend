import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import "../ui/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLogin } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  }

  const formSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() === true) {
      await login(formData);
    }
  }

  return (
    <div className='Login auth-page'>
      <div className='box auth-card'>
        <h1 className='header auth-heading'>Welcome Back</h1>
        <form onSubmit={formSubmit} className='form auth-form'>
          <span className="auth-label">Email</span>
          <input
            className='inp auth-input'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <span className="auth-label">Password</span>
          <input
            className='inp auth-input'
            type='password'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button className='sub-btn auth-submit' type='submit' disabled={isLogin}>
            {isLogin ? <><Loader2 /> Loading ...</> : "Login"}
          </button>
        </form>
        <div className='footer auth-footer'>
          <p>Dont have an account ?{" "}<Link to="/sign">Sign Up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login
