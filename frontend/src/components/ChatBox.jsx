import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatBox({ partnerId, partnerModel, partnerName, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages(partnerId);
      setMessages(data.messages);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Simple polling every 5 seconds for MVP
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [partnerId]); // eslint-disable-line

  useEffect(() => {
    // Scroll to bottom on load and new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await sendMessage({
        recipientId: partnerId,
        recipientModel: partnerModel, // 'Vendor' or 'Buyer'
        content: newMessage.trim()
      });
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      height: '450px',
      backgroundColor: 'var(--bg-dark)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
          {partnerName}
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          &times;
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.02)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet. Say hi!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === user.id;
            return (
              <div key={msg._id} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                backgroundColor: isMe ? 'var(--primary)' : 'var(--bg-light)',
                color: isMe ? '#fff' : 'var(--text-main)',
                padding: '8px 12px',
                borderRadius: '16px',
                borderBottomRightRadius: isMe ? '4px' : '16px',
                borderBottomLeftRadius: isMe ? '16px' : '4px',
                maxWidth: '80%',
                wordBreak: 'break-word',
                fontSize: '0.9rem'
              }}>
                {msg.content}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{
        padding: '12px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        gap: '8px',
        backgroundColor: 'var(--bg-dark)'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'var(--bg-light)',
            color: 'var(--text-main)',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            opacity: newMessage.trim() ? 1 : 0.5
          }}
        >
          <svg style={{ width: '16px', height: '16px', transform: 'translateX(1px)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
