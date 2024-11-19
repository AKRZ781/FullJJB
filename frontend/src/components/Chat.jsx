import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { initializeSocket, disconnectSocket, getSocket } from "../socket"; // Utilisation directe des fonctions socket
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();
  let socket;

  useEffect(() => {
    const token = getTokenFromCookie("token");
    if (!token) {
      console.warn("Token introuvable dans les cookies.");
      setTimeout(() => {
        navigate("/login"); // Redirection avec un délai de 2 secondes
      }, 2000);
      return;
    }

    // Initialise le socket après la vérification de l'authentification
    socket = initializeSocket(token);
    console.log("initialisation",socket);
    

    if (socket) {
    // Émission de la requête pour récupérer les anciens messages
    socket.emit("fetch_messages");

    // Écoute de la réponse du serveur avec les messages
    socket.on("previous_messages", (messages) => {
      setMessages(messages);
      scrollToEnd();
    });}

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("new_chat_message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToEnd();
    });

    socket.on("message_deleted", (msgId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== msgId));
    });

    socket.on("typing", (user) => {
      if (user.id !== currentUser.id) {
        setIsTyping(true);
      }
    });

    socket.on("stop_typing", (user) => {
      if (user.id !== currentUser.id) {
        setIsTyping(false);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setMessage("Erreur de connexion au chat.");
      navigate("/login");
    });

    fetchAuthStatus();

    return () => {
      // Nettoyage des événements et déconnexion propre
      if (socket) {
        socket.off("new_chat_message");
        socket.off("message_deleted");
        socket.off("typing");
        socket.off("stop_typing");
        socket.off("previous_messages");
        socket.off("fetch_error");
        disconnectSocket();
      }
    };
  }, []);

  const getTokenFromCookie = (cookieName) => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`));
    console.log("Cookie trouvé:", cookie);
    return cookie ? cookie.split("=")[1] : null;
  };

  const fetchAuthStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/whoami`, {
        withCredentials: true,
      });
      if (res.data.Status === "Success") {
        setAuth(true);
        setCurrentUser(res.data.User);
        fetchUsers();
        fetchMessages();
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    } catch (err) {
      console.error("Error fetching authentication status:", err);
      setMessage("Erreur d'authentification.");
      navigate("/login");
    }
  };

 const fetchMessages = () => {
  const socket = getSocket(); // Récupérer l'instance socket
  if (!socket) {
    console.error("Socket non initialisé.");
    setMessage("Erreur : connexion au serveur perdue.");
    return;
  }

  // Émettre une requête pour récupérer les messages
  socket.emit("fetch_messages");

  // Écouter les messages envoyés par le serveur
  socket.on("previous_messages", (messages) => {
    setMessages(messages);
    scrollToEnd();
  });

  // Gérer les erreurs éventuelles
  socket.on("fetch_error", (error) => {
    console.error("Erreur lors de la récupération des messages :", error);
    setMessage("Erreur lors de la récupération des messages.");
  });

  // Nettoyage des écouteurs lors du démontage
  return () => {
    socket.off("previous_messages");
    socket.off("fetch_error");
  };
};


  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        withCredentials: true,
      });
      if (res.data.Status === "Success") {
        setUsers(res.data.Users);
      } else {
        setMessage("Erreur de chargement des utilisateurs.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("Erreur de chargement des utilisateurs.");
    }
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value.slice(0, 200));
    const socket = getSocket();
    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentUser);
    }
    
    const typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit("stop_typing", currentUser);
    }, 1000);
    clearTimeout(typingTimeout);
  };

  const handleNewMessageSubmit = (e) => {
    console.log("BLALALAsubmitLALALAL");
    e.preventDefault();
    if (!newMessage.trim()) return;
    const socket = getSocket();
    console.log("socket",socket);
    
    // Envoi du message via Socket.IO
    if (socket) {
      socket.emit("create_message", { message: newMessage });
      setNewMessage("");
    } else {
      setMessage("Erreur : connexion au serveur perdue.");
      console.error("Socket non initialisé.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const socket = getSocket();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      if (socket) {
        // Émettre l'événement de suppression au serveur via Socket.IO
        socket.emit("delete_message", messageId);
  
        // Suppression optimiste : mettre à jour immédiatement les messages locaux
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      } else {
        console.error("Socket non initialisé.");
        setMessage("Impossible de supprimer le message (socket non connecté).");
      }
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="container-fluid d-flex min-vh-100 p-0" style={{ backgroundColor: "#000235", color: "white" }}>
      <div className="d-flex flex-grow-1">
        <div className="bg-dark text-white p-4" style={{ width: "250px", minWidth: "250px" }}>
          <h3>Membres de la Communauté</h3>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user.id} className="list-group-item bg-dark text-white">
                {user.name || "Utilisateur inconnu"}
              </li>
            ))}
          </ul>
        </div>
        <div className="container-fluid d-flex flex-column p-0">
          <div className="container mt-5">
            <h2>Chat Communautaire</h2>
            {auth ? (
              <div className="bg-dark text-white rounded p-4">
                <div className="border p-3 rounded bg-secondary">
                  <div className="mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {messages.map((msg) => (
                      <div key={msg.id} className="d-flex align-items-center mb-3">
                        <div className="p-3 rounded bg-dark text-white">
                          <p className="mb-1">
                            <strong>{msg.sender?.id === currentUser.id ? "Moi" : msg.sender?.name || "Utilisateur inconnu"}</strong>
                          </p>
                          <p className="mb-0">{msg.message}</p>
                        </div>
                        {/* Si l'utilisateur est un administrateur, afficher le bouton de suppression */}
                        {currentUser.role === "admin" && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="btn btn-danger btn-sm ml-2"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    {isTyping && <em>Un utilisateur est en train d'écrire...</em>}
                    <div ref={messageEndRef} />
                  </div>
                  <form onSubmit={handleNewMessageSubmit}>
                    <div className="input-group">
                      <textarea
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        className="form-control bg-dark text-white"
                        placeholder="Écrire un message..."
                        required
                      />
                      <button type="submit" className="btn btn-primary">Envoyer</button>
                    </div>
                  </form>
                </div>
                <div className="mt-3">
                  <button
                    className="btn bg-dark text-white border-light"
                    onClick={() => navigate("/home")}
                  >
                    Retour aux techniques
                  </button>
                </div>
              </div>
              
            ) : (
              <p>{message || "Veuillez vous connecter pour accéder au chat."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
