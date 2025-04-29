'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import { Send, AlertCircle, Smile, MessageCircle } from 'lucide-react';

export default function ChatroomPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState(null); // Store full user data
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null); // Use ref for socket

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Try to get a valid ObjectId from localStorage or generate one
    const getValidObjectId = () => {
      // Check if we've already stored a valid ObjectId
      const storedId = localStorage.getItem('validObjectId');
      if (storedId && storedId.match(/^[0-9a-f]{24}$/)) {
        return storedId;
      }
      
      // If not, generate a new valid MongoDB ObjectId
      // MongoDB ObjectId is 24 hex characters
      const generateObjectId = () => {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
        const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
        const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
        return timestamp + machineId + processId + counter;
      };
      
      const newId = generateObjectId();
      localStorage.setItem('validObjectId', newId);
      return newId;
    };
    
    // Decode the JWT token to get user info directly
    // This is a workaround since the /auth/me endpoint is returning 404
    const getUserFromToken = (token) => {
      try {
        // JWT tokens are in the format header.payload.signature
        // We need to extract the payload part
        const payload = token.split('.')[1];
        // Decode the base64 string
        const decodedPayload = atob(payload);
        // Parse the JSON
        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    // Get user info from token or try fetching from API
    const fetchUserInfo = async () => {
      try {
        // First try to decode from token
        const decodedUser = getUserFromToken(token);
        if (decodedUser && decodedUser.id) {
          setUserData({
            _id: decodedUser.id || decodedUser._id || decodedUser.sub,
            email: decodedUser.email || username || 'User'
          });
          setUsername(decodedUser.email || 'User');
          return;
        }
        
        // If token decoding fails, try the API
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const user = await res.json();
          setUserData(user);
          setUsername(user.email);
        } else {
          // If API fails, create a temporary user object with a valid ObjectId
          console.warn('Auth endpoint not available, using fallback user data');
          const validObjectId = getValidObjectId();
          setUserData({ _id: validObjectId });
          const storedUsername = localStorage.getItem('username') || 'User_' + validObjectId.slice(0, 5);
          setUsername(storedUsername);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        // Create fallback user data with valid ObjectId
        const validObjectId = getValidObjectId();
        setUserData({ _id: validObjectId });
        const storedUsername = localStorage.getItem('username') || 'User_' + validObjectId.slice(0, 5);
        setUsername(storedUsername);
      }
    };

    fetchUserInfo();

    // Connect to WebSocket server
    socketRef.current = io('http://localhost:3000', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setError('');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', () => {
      setError('Failed to connect to chat server');
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('Received message:', message);
      
      // Don't add duplicate messages
      setMessages(prev => {
        // Filter out any temporary message we might have added
        const filteredMessages = prev.filter(m => !m.tempId || m.tempId !== message.tempId);
        return [...filteredMessages, message];
      });
    });

    fetchMessages(token);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [router]);

  async function fetchMessages(token) {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort messages to ensure newest are at the bottom
        const sortedMessages = data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      setError('Network error when loading messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (newMessage.trim() === '') return; // Only check for empty message
    
    try {
      // Get the user ID - make sure it's a valid MongoDB ObjectId
      let userId = userData?._id;
      
      // If userId is missing or invalid, generate a valid ObjectId format
      if (!userId || !userId.match(/^[0-9a-f]{24}$/)) {
        console.warn('Using stored or generating new ObjectId');
        userId = localStorage.getItem('validObjectId');
        
        // If no stored ID, generate a new one
        if (!userId || !userId.match(/^[0-9a-f]{24}$/)) {
          const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
          const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
          const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
          const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
          userId = timestamp + machineId + processId + counter;
          localStorage.setItem('validObjectId', userId);
        }
      }
      
      console.log('Sending message with userId:', userId, 'valid format:', !!userId.match(/^[0-9a-f]{24}$/));
      
      // Add message to local state first for immediate feedback
      const tempMessage = {
        text: newMessage,
        user: { email: username || 'You' },
        createdAt: new Date().toISOString(),
        // Use a temporary ID to identify the message
        tempId: Math.random().toString(36).substring(2, 15),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Send the message with the userId and text
      socketRef.current.emit('sendMessage', {
        text: newMessage,
        userId: userId,
      }, (acknowledgement) => {
        console.log('Message acknowledged:', acknowledgement);
      });
      
      setNewMessage(''); // Clear the input field after sending
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isCurrentUser = (msg) => {
    // Check if the message has a temporary ID (our local message)
    if (msg.tempId) return true;
    
    // Otherwise check by email
    return msg.user?.email === username;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      
      {/* Debug Info Button - Helps you troubleshoot */}
      <div className="bg-gray-100 border-gray-300 border p-2 m-2 rounded">
        <details>
          <summary className="cursor-pointer text-gray-600 font-medium">Debug Info</summary>
          <div className="pt-2 text-sm">
            <p>Socket Connected: {isConnected ? 'Yes' : 'No'}</p>
            <p>Username: {username || 'Not set'}</p>
            <p>User ID: {userData?._id || 'Not set'}</p>
            <p>Messages: {messages.length}</p>
          </div>
        </details>
      </div>

      {!isConnected && (
        <div className="bg-yellow-100 border-yellow-400 border-l-4 p-4 flex items-center">
          <AlertCircle size={20} className="text-yellow-600 mr-2" />
          <p className="text-yellow-700">Reconnecting to chat server...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-red-400 border-l-4 p-4 flex items-center">
          <AlertCircle size={20} className="text-red-600 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size={48} className="mb-4 text-gray-400" />
            <p className="text-center">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = isCurrentUser(msg);
            return (
              <div 
                key={index} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border rounded-bl-none shadow'
                  }`}
                >
                  {!isUser && (
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {msg.user?.email || 'Unknown User'}
                    </p>
                  )}
                  <p className="break-words">{msg.text}</p>
                  <p 
                    className={`text-xs text-right mt-1 ${
                      isUser ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {msg.createdAt ? formatTime(msg.createdAt) : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex items-center p-4 bg-white border-t shadow-sm">
        <button 
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
        >
          <Smile size={20} />
        </button>
        <input 
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-3 mx-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={!isConnected || newMessage.trim() === ''}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
