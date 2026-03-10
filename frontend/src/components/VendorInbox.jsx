import { useState, useEffect } from 'react';
import { getConversations } from '../services/api';
import ChatBox from './ChatBox';

export default function VendorInbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const fetchConvos = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data.conversations);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvos();
    const interval = setInterval(fetchConvos, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Inbox</h2>
      
      {loading ? (
        <div className='spinner-wrap'><div className='spinner' /></div>
      ) : conversations.length === 0 ? (
         <div className='card' style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>
          No messages yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {conversations.map((c) => (
            <div 
              key={c.partner._id}
              className='card'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                border: c.unread > 0 ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                backgroundColor: c.unread > 0 ? 'rgba(79, 70, 229, 0.05)' : 'var(--glass-bg)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setActiveChat(c.partner)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                {c.partner.name.charAt(0).toUpperCase()}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {c.partner.name}
                  {c.unread > 0 && (
                    <span style={{
                      backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem',
                      padding: '2px 6px', borderRadius: '10px'
                    }}>
                      {c.unread} new
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                  {c.lastMessage}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChat && (
        <ChatBox
          partnerId={activeChat._id}
          partnerModel={activeChat.model}
          partnerName={activeChat.name}
          onClose={() => {
            setActiveChat(null);
            fetchConvos(); // Refresh to clear unread counts immediately
          }}
        />
      )}
    </div>
  );
}
