import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const useMusicStore=create((set,get)=>({
         

    musics:[],
    albums:[],
    isMusicLoading:false,
    Id:null,
    isUploading:false,
    isCreatingAlbum:false,



    getMusics:async ()=>{

        set({isMusicLoading:true});
        try {
            const res=await axiosInstance.get("/music/");
            console.log(res.data);
            set({musics:res.data.musics});
            
        } catch (error) {

            
        console.log("Error in getting musics",error);
        toast.error("Something went wrong");
            
        }
        finally{
            set({isMusicLoading:false});
        }

    },

    getAlbums:async ()=>{
        try {

            const res=await axiosInstance.get("/music/albums");

            console.log(res.data);

            set({albums:res.data.albums});
            
        } catch (error) {
             console.log("Error in getting albums",error);
            toast.error("Something went wrong");
        }

    },

    setId:(Id)=>{
        set({Id:Id});
    },

    uploadMusic:async (formData)=>{
        set({isUploading:true});
        try {
            await axiosInstance.post('/music/upload', formData)
            toast.success('Track uploaded successfully')
            await get().getMusics()
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not upload this track. Please try again.')
            return false
        } finally {
            set({isUploading:false});
        }
    },

    createAlbum:async (data)=>{
        set({isCreatingAlbum:true});
        try {
            await axiosInstance.post('/music/album', data)
            toast.success('Album created successfully')
            await get().getAlbums()
            return true
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not create this album. Please try again.')
            return false
        } finally {
            set({isCreatingAlbum:false});
        }
    },



}))