import './style.scss'

import { Outlet } from 'react-router-dom';
import { Menu } from '../../components/Menu';
import { useState } from 'react';

export function Layout() {
    const [linkName, setLinkName] = useState('');

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
