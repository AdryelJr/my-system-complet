import './style.scss'

import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from '../../components/Menu';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function Layout() {
    const [linkName, setLinkName] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user])
    
    useEffect(() => {
        const storageDarkMode = localStorage.getItem('darkMode');
        if (storageDarkMode) {
            document.body.classList.toggle('dark-mode', JSON.parse(storageDarkMode));
        }
    }, [])


    return (
        <div className='container-layout'>
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
