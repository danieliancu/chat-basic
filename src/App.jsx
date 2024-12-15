import React, { useState } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      alert('Please enter a message.');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }], // Formatul cerut de OpenAI API
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await res.json();
      setResponse(data.message); // Extragem doar mesajul text
    } catch (error) {
      console.error('Error:', error.message);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React OpenAI Assistant</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows="5"
        style={{
          width: '100%',
          marginBottom: '10px',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
        placeholder="Type your question here..."
      />
      <button
        onClick={handleSend}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
      {response && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;
