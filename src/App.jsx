import React from 'react';
import { ToastContainer } from 'react-toastify';
import HomePage from '@/components/pages/HomePage';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-neon-bg relative overflow-auto scrollbar-neon">
      {/* Animated background grid */}
      <div className="absolute inset-0 game-grid" style={{
        backgroundSize: '20px 20px',
        opacity: 0.1
      }} />
      
      {/* Glowing orbs for ambient lighting */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 animate-pulse-neon" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-20 animate-pulse-neon" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent rounded-full blur-3xl opacity-10 animate-pulse-neon" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
<HomePage />
      </motion.div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#1a1a2e',
          border: '1px solid #00ffff',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          color: '#ffffff'
        }}
      />
    </div>
  );
}

export default App;