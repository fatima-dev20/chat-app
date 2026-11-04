import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import api from "../src/api/axios"; // axios instance with baseURL
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // Connect socket
  const connectSocket = (userData) => {
    if (!userData || socketRef.current?.connected) return;

    const socket = io(backendUrl, {
      query: { userId: userData._id },
    });

    socket.connect();
    socketRef.current = socket;

    socket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.defaults.headers.common["token"] = token;

    try {
      const { data } = await api.post("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch {
      // silent fail
    }
  };

  // Login or signup
  const login = async (state, credentials, navigate) => {
    try {
      const { data } = await api.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        localStorage.setItem("token", data.token);
        api.defaults.headers.common["token"] = data.token;

        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message);
        console.log("AUTH RESPONSE:", data);


        if (navigate) navigate("/"); // redirect after login/signup
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setOnlineUsers([]);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    toast.success("Logged out successfully");
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await api.post("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        // toast.success("Profile updated successfully");
      }
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Initialize auth on mount
  useEffect(() => {
  const initializeAuth = async () => {
    await checkAuth();
  };

  initializeAuth();

  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };
}, []);


  const value = {
    authUser,
    onlineUsers,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
