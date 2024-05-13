import './style.scss';
import imgLogo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


export function Menu({ setActiveLink, isDarkMode, clickHamb }: any) {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path: string, name: string) => {
        if (location.pathname === path) {
            setActiveLink(name);
            return true;
        }
        return false;
    }

    return (
        <div className={`container-menu${isDarkMode ? 'dark-theme' : ''} ${clickHamb ? 'clickHamb' : ''}`}>
            <div className='logo'>
                <img src={imgLogo} alt="logo" />
                <span>My System</span>
            </div>
            <div className='content-menu-division'>
                <div className='content-menu'>
                    <ul>
                        <li>
                            <Link className={isActive('/', 'Tarefas') ? 'active' : ''} to={'/'}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#838383"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274" stroke="#838383" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M15 18H9" stroke="#838383" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                                Tarefas
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/tolist', 'Todo List') ? 'active' : ''} to={'tolist'}>
                                <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>tasks-all</title> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Combined-Shape" fill="#838383" transform="translate(70.530593, 46.125620)"> <path d="M185.469407,39.207713 L356.136074,39.207713 L356.136074,81.8743797 L185.469407,81.8743797 L185.469407,39.207713 Z M185.469407,188.541046 L356.136074,188.541046 L356.136074,231.207713 L185.469407,231.207713 L185.469407,188.541046 Z M185.469407,337.87438 L356.136074,337.87438 L356.136074,380.541046 L185.469407,380.541046 L185.469407,337.87438 Z M119.285384,-7.10542736e-15 L144.649352,19.5107443 L68.6167605,118.353113 L2.84217094e-14,58.3134476 L21.0721475,34.2309934 L64.0400737,71.8050464 L119.285384,-7.10542736e-15 Z M119.285384,149.333333 L144.649352,168.844078 L68.6167605,267.686446 L2.84217094e-14,207.646781 L21.0721475,183.564327 L64.0400737,221.13838 L119.285384,149.333333 Z M119.285384,298.666667 L144.649352,318.177411 L68.6167605,417.01978 L2.84217094e-14,356.980114 L21.0721475,332.89766 L64.0400737,370.471713 L119.285384,298.666667 Z"> </path> </g> </g> </g></svg>
                                Todo List
                            </Link>
                        </li>
                        <li>
                            <Link className={isActive('/settings', 'Configurações') || isActive('/settings/profile', 'Configurações') || isActive('/settings/appearance', 'Configurações') ? 'active' : ''} to={'settings'}>
                                <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7.82001H22" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 7.82001H4" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M20 16.82H22" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 16.82H12" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8 11.82C10.2091 11.82 12 10.0291 12 7.82001C12 5.61087 10.2091 3.82001 8 3.82001C5.79086 3.82001 4 5.61087 4 7.82001C4 10.0291 5.79086 11.82 8 11.82Z" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16 20.82C18.2091 20.82 20 19.0291 20 16.82C20 14.6109 18.2091 12.82 16 12.82C13.7909 12.82 12 14.6109 12 16.82C12 19.0291 13.7909 20.82 16 20.82Z" stroke="#838383" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                Configurações
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='content-footer-menu'>
                    <div className='div-link'>
                        <Link className={isActive('/help', 'Ajuda') ? 'active' : ''} to={'/help'}>Precisa de ajuda?</Link>
                    </div>
                    <div className='div-perfil'>
                        <img src={user?.avatar} alt="avatar" />
                        <span>{user?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Hamb({ onClick, clickHamb }: any) {

    return (
        <div className={`hamb ${clickHamb ? 'hambAtivo' : ''}`} onClick={onClick}>
            {clickHamb ? <svg width={45} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                :
                <svg width={45} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M4 18L20 18" stroke="#999999" strokeWidth="2" strokeLinecap="round"></path>
                        <path d="M4 12L20 12" stroke="#999999" strokeWidth="2" strokeLinecap="round"></path>
                        <path d="M4 6L20 6" stroke="#999999" strokeWidth="2" strokeLinecap="round"></path>
                    </g>
                </svg>
            }
        </div>
    )
}