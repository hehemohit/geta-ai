import React from 'react';
import { Toaster } from 'react-hot-toast';
import Users from './pages/Users';
import './App.css';

function App() {
  return (
    <>
      <Users />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111827', // gray-900
            color: '#f3f4f6',
            border: '1px solid #374151', // gray-700
            padding: '12px 18px',
            borderRadius: '14px',
            fontSize: '14px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#111827',
            },
          },
        }}
      />
    </>
  );
}

export default App;
