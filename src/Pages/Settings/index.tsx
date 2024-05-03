import { useState, useEffect } from 'react';
import './style.scss';

export function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className='container-settings'>
      <h1>Settings</h1>
      <button onClick={toggleTheme} className='themeButton'>
        Mudar Tema
      </button>
    </div>
  )
}