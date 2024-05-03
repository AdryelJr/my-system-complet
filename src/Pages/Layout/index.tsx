import './style.scss'

import { Outlet } from 'react-router-dom';
import { Menu } from '../../components/Menu';
import { useEffect, useState } from 'react';

export function Layout() {
    const [linkName, setLinkName] = useState('');
    const [darkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            console.log('modo escuro ativado')
        }
    }, [darkMode]);
    
    return (
        <div className={`container-layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='content-left'>
                <Menu setActiveLink={setLinkName} />
            </div>
            <div className='content-right'>
                <div className='div-border-cima'>
                    <span>{linkName}</span>
                </div>
                <div className='div-content'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
