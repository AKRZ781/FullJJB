import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSocket } from './SocketProvider';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(false); // Nouvel état pour gérer "en train d'écrire"
  const [isTyping, setIsTyping] = useState(false); // État pour les autres utilisateurs "en train d'écrire"
  const messageEndRef = useRef(null);
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthStatus();
  }, [socket]);

  useEffect(() => {
    if (auth) {
      fetchMessages();
    }
  }, [auth]);

  useEffect(() => {
    if (socket) {
      socket.on('new_chat_message', (msg) => {
        setMessages(prevMessages => {
          const messageExists = prevMessages.some(m => m.id === msg.id);
          if (!messageExists) {
            return [...prevMessages, msg];
          }
          return prevMessages;
        });
        scrollToEnd();
      });

      socket.on('message_deleted', (msgId) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
      });

      // Gérer l'état "en train d'écrire"
      socket.on('typing', (user) => {
        if (user.id !== currentUser.id) {
          setIsTyping(true);
        }
      });

      socket.on('stop_typing', (user) => {
        if (user.id !== currentUser.id) {
          setIsTyping(false);
        }
      });

      return () => {
        socket.off('new_chat_message');
        socket.off('message_deleted');
        socket.off('typing');
        socket.off('stop_typing');
      };
    }
  }, [socket]);

  const fetchAuthStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/whoami`, { withCredentials: true });
      if (res.data.Status === "Success") {
        setAuth(true);
        setCurrentUser(res.data.User);
        fetchUsers();
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    } catch (err) {
      if (err.response && err.response.status === 401 && err.response.data.error === "Token expired") {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {}, { withCredentials: true });
          await fetchAuthStatus();
        } catch (refreshErr) {
          setMessage('Failed to refresh token');
        }
      } else {
        setMessage('Failed to fetch authentication status.');
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/chat-messages`, { withCredentials: true });
      if (res.data.Status === "Success") {
        setMessages(res.data.Messages);
        scrollToEnd();
      } else {
        setMessage('Failed to load chat messages');
      }
    } catch (err) {
      setMessage('Error fetching chat messages');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users`, { withCredentials: true });
      if (res.data.Status === "Success") {
        setUsers(res.data.Users);
      } else {
        setMessage('Failed to load users');
      }
    } catch (err) {
      setMessage('Error fetching users');
    }
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value.slice(0, 200));
    if (!typing) {
      setTyping(true);
      socket.emit('typing', currentUser);
    }
    clearTimeout(typingTimeout);
    const typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('stop_typing', currentUser);
    }, 1000);
  };

  const handleNewMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const messageData = { message: newMessage };
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat/chat-messages`, messageData, { withCredentials: true });
      if (res.data.Status === "Success") {
        if (socket) {
          socket.emit('new_message', res.data.Message);
        }
        setNewMessage('');
        setTyping(false);
        socket.emit('stop_typing', currentUser);
      } else {
        setMessage('Failed to send message');
      }
    } catch (err) {
      setMessage('Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/chat/chat-messages/${messageId}`, { withCredentials: true });
        if (res.data.Status === "Success") {
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
          if (socket) {
            socket.emit('delete_message', messageId);
          }
        } else {
          setMessage('Failed to delete message');
        }
      } catch (err) {
        setMessage('Error deleting message');
      }
    }
  };

  const handleAccessTechniques = () => {
    navigate('/home');
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="container-fluid d-flex min-vh-100 p-0" style={{ backgroundColor: '#000235', color: 'white' }}>
      <div className="d-flex flex-grow-1">
        <div className="bg-dark text-white p-4" style={{ width: '250px', minWidth: '250px' }}>
          <h3>Membres de la Communauté</h3>
          <ul className="list-group">
            {users.map(user => (
              <li key={user.id} className="list-group-item bg-dark text-white">
                {user.name || 'Unknown'}
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
                  <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {messages.map(msg => {
                      return (
                        <div key={msg.id} className="d-flex align-items-center mb-3">
                          <div className="p-3 rounded bg-dark text-white" style={{ backgroundColor: '#dc3545', flexGrow: 1, maxWidth: '70%' }}>
                            <p className="mb-1"><strong>{msg.sender?.id === currentUser.id ? 'Moi' : msg.sender?.name || 'Unknown'}</strong></p>
                            <p className="mb-0">{msg.message}</p>
                          </div>
                          {currentUser.role === 'admin' && (
                            <button onClick={() => handleDeleteMessage(msg.id)} className="btn btn-danger btn-sm ml-2">
                              &times;
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="text-white">
                        <em>Un utilisateur est en train d'écrire...</em>
                      </div>
                    )}
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
                        style={{ resize: 'none' }}
                      ></textarea>
                      <button type="submit" className="btn" style={{ backgroundColor: '#dc3545', color: 'white' }}>Envoyer</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3>{message}</h3>
              </div>
            )}
          </div>
          <div className="container mt-3">
            <button type="button" className="btn btn-dark ms-3" onClick={handleAccessTechniques}>
              Accéder aux Techniques
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
