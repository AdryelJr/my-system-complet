import { useNavigate } from 'react-router-dom';
import { ButtonSair } from '../../components/Buttons/ButtonSair';
import { useAuth } from '../../hooks/useAuth';
import './style.scss';

export function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login')
    }

    return (
        <div className='container-settings'>
            <h1>Home</h1>
            <ButtonSair />
        </div>
    )
}