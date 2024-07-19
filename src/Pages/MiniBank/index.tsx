import './style.scss';
import coinsSvg from '../../assets/svg/coins.svg';
import { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { AuthContext } from '../../contexts/userAuth';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function MiniBank() {
    const { user } = useContext(AuthContext);
    const [coins, setCoins] = useState<number | null>(null);

    useEffect(() => {
        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.id);

            const updateCoins = (snapshot: any) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setCoins(userData.userInfoGame.coins);
                }
            };
            const unsubscribe = onValue(userRef, updateCoins);
            return () => unsubscribe();
        }
    }, [user]);


    const location = useLocation();
    const isActive = (path: string) => {
        const locationSegments = location.pathname.split('/');
        const pathSegments = path.split('/');
        return locationSegments[locationSegments.length - 1] === pathSegments[pathSegments.length - 1];
    }

    return (
        <div className={'container-miniBank'}>
            {coins !== null ? (
                <>
                    <div className='content-miniBank'>
                        <div className='div-nav'>
                            <ul>
                                <li>
                                    <Link className={isActive('/minibank') ? 'active' : ''} to={''}>Loja</Link>
                                </li>
                                <li>
                                    <Link className={isActive('jogos') ? 'active' : ''} to={'jogos'}>Jogos</Link>
                                </li>
                                <li>
                                    <Link className={isActive('transacoes') ? 'active' : ''} to={'transacoes'}>Transações</Link>
                                </li>
                            </ul>
                        </div>
                        <div className='div-coins'>
                            <img src={coinsSvg} alt='Coins' />
                            <p>Moedas: {coins}</p>
                        </div>
                    </div>
                    <Outlet />
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
