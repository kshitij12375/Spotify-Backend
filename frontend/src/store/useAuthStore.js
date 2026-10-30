import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigning: false,
    isLogin: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            const res = await axiosInstance.get("/auth/me");
            set({ authUser: res.data.user });
        } catch (error) {
            console.log("Error in check auth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigning: true });

        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.user });
            toast.success("Account created successfully");
            return true;
        } catch (error) {
            console.log("Error in signup", error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        } finally {
            set({ isSigning: false });
        }
    },

    login: async (data) => {
        set({ isLogin: true });

        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });
            toast.success("Login successfully");
            return true;
        } catch (error) {
            console.log("Error in login", error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        } finally {
            set({ isLogin: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Error in logout", error);
            toast.error(error.response?.data?.message || "Error in logout");
        }
    }
}));
