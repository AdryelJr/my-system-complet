import './style.scss'
import { useState, useEffect } from "react";

export function ButtonToggleTheme() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };
    return (
        <>
            <button onClick={toggleTheme} className='themeButton'>
                Mudar Tema
            </button>
        </>
    )
}