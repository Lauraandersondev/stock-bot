import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('React object in main.tsx:', React);
console.log('App component:', App);

createRoot(document.getElementById("root")!).render(<App />);
