import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

import { toast } from 'react-hot-toast';





export const useAuthStore=create((set,get)=>({

    authUser:null,
    isSigning:false,
    isLogin:false,
    isCheckingAuth:false,


    checkAuth:async ()=>{
        set({isCheckingAuth:true});

        try {
            const res=await axiosInstance.get("/auth/me");

            set({authUser:res.data});


        } catch (error) {
            console.log("Error in check auth",error);
        }

        finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async (data)=>{

        set({isSigning:true});
        try {

            const res=await axiosInstance.post("/auth/register",data);

            set({authUser:res.data});


            toast.success("Account created succesffully")


            
        } catch (error) {
            console.log("Error in signup",error);
            toast.error("Something went wrong");
        }
        finally{
            set({isSigning:false});
        }

    },
    login:async(data)=>{
        set({isLogin:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Login successfully");

            
        } catch (error) {


            console.log("Error in login",error);
            toast.error("Something went wrong");
            
        }
        finally{
            set({isLogin:false});
        }

    },
    logout:async ()=>{
        try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
            
        } catch (error) {

            console.log("Error in logout",error);
            toast.error("Error in logout");
            
        }

    }
  

}))