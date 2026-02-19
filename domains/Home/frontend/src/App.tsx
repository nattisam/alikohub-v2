import React from 'react';

function App() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <header>
        <h1 style={{ color: '#1a73e8' }}>AlikoHub Home</h1>
        <p>Welcome to the main hub for AlikoHub services.</p>
      </header>
      <main style={{ 
        display: 'grid', 
        gap: '1rem', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        marginTop: '2rem'
      }}>
        <section style={cardStyle}>
          <h2>Academy</h2>
          <p>Manage courses and students.</p>
        </section>
        <section style={cardStyle}>
          <h2>Con-Tech</h2>
          <p>Construction technology solutions.</p>
        </section>
        <section style={cardStyle}>
          <h2>Events</h2>
          <p>Upcoming industry events.</p>
        </section>
        <section style={cardStyle}>
          <h2>Careers</h2>
          <p>Find your next opportunity.</p>
        </section>
      </main>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export default App;
