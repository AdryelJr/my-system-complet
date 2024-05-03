import './style.scss';

import { Link, Outlet, useLocation } from 'react-router-dom';

export function Settings() {
  const location = useLocation();

  const isActive = (path: string) => {
    const locationSegments = location.pathname.split('/');
    const pathSegments = path.split('/');
    return locationSegments[locationSegments.length - 1] === pathSegments[pathSegments.length - 1];
  }

  return (
    <div className='container-settings'>
      <div className='content-settings'>
        <ul>
          <li>
            <Link className={isActive('/settings') ? 'active' : ''} to={''}>Meu perfil</Link>
          </li>
          <li>
            <Link className={isActive('appearance') ? 'active' : ''} to={'appearance'}>Aparência</Link>
          </li>
        </ul>
      </div>

      <div className='div-content'>
        <Outlet />
      </div>
    </div>
  )
}