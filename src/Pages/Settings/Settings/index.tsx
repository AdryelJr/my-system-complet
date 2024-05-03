import './style.scss';

import { Link, Outlet, useLocation } from 'react-router-dom';

export function Settings({ setActiveLink }: any) {
  const location = useLocation();

  const isActive = (path: string, name: string) => {
    if (location.pathname === path) {
      setActiveLink(name);
      return true;
    }
    return false;
  }

  return (
    <div className='container-settings'>
      <div className='content-settings'>
        <ul>
          <li>
            <Link className={isActive('/profile', 'Configurações') ? 'active' : ''} to={'profile'}>Meu perfil</Link>
          </li>
          <li>
            <Link className={isActive('/appearance', 'Configurações') ? 'active' : ''} to={'appearance'}>Aparência</Link>
          </li>
        </ul>
      </div>

      <div className='div-content'>
        <Outlet />
      </div>

    </div>
  )
}