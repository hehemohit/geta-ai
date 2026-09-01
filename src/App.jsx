import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Users from './pages/Users';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Users />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#09090b',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            padding: '12px 18px',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'ui-monospace, monospace',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-hex, #10b981)',
              secondary: '#09090b',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#09090b',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
