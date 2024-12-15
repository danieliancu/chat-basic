import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bună, cu ce te pot ajuta?' },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null); // Ref pentru corpul chat-ului

  // Funcția pentru a derula automat la ultimul mesaj
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  // Derulăm automat când se adaugă un mesaj nou
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error.message);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'An error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Previne comportamentul implicit al Enter
      handleSend(); // Trimite mesajul
    }
  };

  return (
    <div style={styles.chatWrapper}>
      {/* Chat Header */}
      <div style={styles.chatHeader}>
        <span style={styles.chatTitle}>Assistant</span>
      </div>

      {/* Chat Body */}
      <div style={styles.chatBody} ref={chatBodyRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.loading}>Typing...</div>}
      </div>

      {/* Chat Input */}
      <div style={styles.chatInputWrapper}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Adăugăm handler-ul pentru Enter
          placeholder="Type a message"
          style={styles.chatInput}
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatWrapper: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    height: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  chatHeader: {
    padding: '10px',
    backgroundColor: '#128C7E',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  chatTitle: {
    fontSize: '16px',
  },
  chatBody: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto', // Adăugăm scroll vertical
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#ECE5DD',
  },
  message: {
    maxWidth: '70%',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    textAlign: 'right',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  loading: {
    alignSelf: 'flex-start',
    fontStyle: 'italic',
    color: '#999',
  },
  chatInputWrapper: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px 15px',
    backgroundColor: '#128C7E',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default App;
