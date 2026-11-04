// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";
// import { ChatContext } from "./ChatContext";
// import api from "../src/api/axios";


// export const ChatProvider = ({ children })=>{

//    const [messages, setMessages] = useState([]);
//    const [users, setUsers] = useState([]);
//    const [selectedUser, setSelectedUser] = useState(null)
//    const [unseenMessages, setUnseenMessages] = useState({})


//   const { socket, authUser } = useContext(AuthContext);

//    // function to get all users for sidebar

//    const getUsers = async () =>{
//     try {
//      const {data} = await api.get("/api/messages/users");
//      if(data.success){
//       setUsers(data.users)
//       setUnseenMessages(data.unseenMessages)
//      }
//     } catch (error) {
//       toast.error(error.message)
//     }
//    }

//    // function to get messages for selected user
//     const getMessages = async (userId) =>{
//     try {
//      const {data} =  await api.get(`/api/messages/${userId}`);
//       if (data.success){
//         setMessages(data.messages)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//    }

//    // function to send message to selected user

//    const sendMessage = async (messageData)=>{
//     try {
//       const {data} = await api.post(`/api/messages/send/${selectedUser._id}`, messageData);
//       if(data.success){
//         setMessages((prevMessages)=>[...prevMessages, data.newMessage])
//       }else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//    }

//    // function to subscribe to messages for selected user
//    const subscribeToMessages = () => {
//   if (!socket) return () => {};

//   const handler = (newMessage) => {
//     if (selectedUser && newMessage.senderId === selectedUser._id) {
//       newMessage.seen = true;
//       setMessages(prev => [...prev, newMessage]);
//       api.put(`/api/messages/mark/${newMessage._id}`);
//     } else {
//       const senderId = newMessage.senderId;
//       setUnseenMessages(prev => ({
//         ...prev,
//         [senderId]: prev[senderId] ? prev[senderId] + 1 : 1
//       }));
//     }
//   };

//   socket.on("newMessage", handler);

//   return () => {
//     socket.off("newMessage", handler);
//   };
// };


//    //function to unsubscribe from messages

//    const unsubscribeFromMessages =()=>{
//     if(socket) socket.off("newMessage");
//    }

//    useEffect(()=>{
//     subscribeToMessages();
//     return ()=> unsubscribeFromMessages();
//    },[socket, selectedUser])

//    // to fetch users when authUser changes

//    useEffect(() => {
//   if (authUser) {
//     getUsers(); // fetch users after login
//   } else {
//     setUsers([]);
//     setMessages([]);
//     setSelectedUser(null);
//     setUnseenMessages({});
//   }


// }, [authUser]);

  

//     const value = {
//   messages,
//   users,
//   selectedUser,
//   getUsers,
//   getMessages,
//   sendMessage,
//   setSelectedUser,
//   unseenMessages,
//   setUnseenMessages,
// };


//   return (

//     <ChatContext.Provider value={value}>
//       { children  }
//     </ChatContext.Provider>
//   )
// }

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { ChatContext } from "./ChatContext";
import api from "../src/api/axios";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, authUser } = useContext(AuthContext);

  // -----------------------------
  // Function to get all users for sidebar
  // -----------------------------
  const getUsers = async () => {
    try {
      
      const { data } = await api.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Function to get messages for selected user
  // -----------------------------
  const getMessages = async (userId) => {
    try {
      const { data } = await api.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Function to send message to selected user
  // -----------------------------
  const sendMessage = async (messageData) => {
    try {
      const { data } = await api.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // -----------------------------
  // Function to subscribe to messages for selected user
  // -----------------------------
  const subscribeToMessages = () => {
    if (!socket) return () => {};

    const handler = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Mark as seen and add to messages
        setMessages((prev) => [...prev, { ...newMessage, seen: true }]);
        api.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // Increment unseen message count
        const senderId = newMessage.senderId;
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handler);

    // Cleanup function for effect
    return () => {
      socket.off("newMessage", handler);
    };
  };

  // -----------------------------
  // Effect to subscribe to socket messages
  // -----------------------------
  useEffect(() => {
    return subscribeToMessages();
  }, [socket, selectedUser]);

  // -----------------------------
  // Effect to fetch users when authUser changes
  // -----------------------------
  useEffect(() => {
    if (authUser) {
      getUsers(); // fetch users after login
    } else {
      setUsers([]);
      setMessages([]);
      setSelectedUser(null);
      setUnseenMessages({});
    }
  }, [authUser]);

  // -----------------------------
  // Context value
  // -----------------------------
  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };
  console.log("🟢 ChatProvider users:", users.length);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
