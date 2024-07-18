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
                            <Link className={isActive('/minibank', 'Mini Bank') ? 'active' : ''} to={'minibank'}>
                                <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#838383"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M510.002,309.835l-0.068-0.326l-0.076-0.334l-26.508-112.721l-0.106-0.417l-0.106-0.418 c-16.668-62.217-73.294-105.666-137.712-105.666H166.579c-64.418,0-121.045,43.449-137.712,105.666l-0.114,0.418l-0.099,0.417 L2.147,309.174l-0.076,0.326l-0.068,0.326c-9.749,46.43,16.926,92.496,62.036,107.168l1.586,0.509 c9.24,3.012,18.89,4.544,28.624,4.544c32.668,0,63.128-17.404,79.758-45.489l22.556-33.343l0.561-0.835l0.509-0.872 c0.796-1.388,2.276-2.253,3.861-2.253h109.02c1.586,0,3.066,0.865,3.862,2.253l0.508,0.872l0.562,0.835l22.555,33.343 c16.63,28.085,47.09,45.489,79.766,45.489c9.734,0,19.384-1.532,28.67-4.56l1.533-0.493 C493.07,402.331,519.737,356.257,510.002,309.835z M439.318,390.397l-1.54,0.501c-6.608,2.154-13.353,3.186-20.014,3.186 c-22.646,0-44.283-11.949-56.088-32.433l-23.064-34.101c-5.788-10.053-16.508-16.258-28.101-16.258h-109.02 c-11.592,0-22.312,6.206-28.101,16.258l-23.063,34.101c-11.804,20.484-33.434,32.433-56.081,32.433 c-6.661,0-13.405-1.032-20.013-3.186l-1.548-0.501c-31.431-10.219-50.102-42.485-43.311-74.819l26.508-112.722 c13.42-50.102,58.826-84.94,110.696-84.94h178.847c51.869,0,97.276,34.838,110.696,84.94l26.508,112.722 C489.413,347.912,470.75,380.178,439.318,390.397z"></path> <polygon points="157.453,172.061 123.912,172.061 123.912,210.579 85.387,210.579 85.387,244.105 123.912,244.105 123.912,282.637 157.453,282.637 157.453,244.105 195.978,244.105 195.978,210.579 157.453,210.579 "></polygon> <path d="M365.721,206.247c11.668,0,21.113-9.445,21.113-21.098c0-11.669-9.445-21.114-21.113-21.114 c-11.653,0-21.098,9.445-21.098,21.114C344.622,196.802,354.068,206.247,365.721,206.247z"></path> <path d="M323.509,206.247c-11.653,0-21.106,9.453-21.106,21.098c0,11.669,9.453,21.122,21.106,21.122 c11.661,0,21.106-9.453,21.106-21.122C344.615,215.7,335.17,206.247,323.509,206.247z"></path> <path d="M365.721,248.459c-11.653,0-21.098,9.445-21.098,21.114c0,11.653,9.445,21.098,21.098,21.098 c11.668,0,21.113-9.445,21.113-21.098C386.834,257.904,377.388,248.459,365.721,248.459z"></path> <path d="M407.933,206.247c-11.653,0-21.099,9.453-21.099,21.098c0,11.669,9.446,21.122,21.099,21.122 c11.66,0,21.113-9.453,21.113-21.122C429.046,215.7,419.593,206.247,407.933,206.247z"></path> </g> </g></svg>
                                Mini Bank
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
                <svg width={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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