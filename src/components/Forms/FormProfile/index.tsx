import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth'
import './style.scss'
import { Cads } from '../../Cards';

export function FormProfile() {
    const { user, updateName } = useAuth();
    const [name, setName] = useState('');
    const [isNameUpdated, setIsNameUpdated] = useState(false);

    useEffect(() => {
        if (isNameUpdated) {
            const timer = setTimeout(() => {
                setIsNameUpdated(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isNameUpdated]);

    function atualizarNome(event: FormEvent) {
        event.preventDefault();
        if (name.trim() !== '') {
            updateName(name).then(() => {
                setIsNameUpdated(true);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    return (
        <div className="container-formProfile">
            <form onSubmit={atualizarNome}>
                <div className='div-displayName'>
                    <h1>Nome</h1>
                    <p>Esse será o nome exibido publicamente.</p>
                    <h2>Nome</h2>
                    <input
                        type="text"
                        placeholder={user?.name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='div-email'>
                    <h1>Email</h1>
                    <p>Contate o suporte para troca de email.</p>
                    <h2>Email</h2>
                    <input
                        type="text"
                        placeholder={user?.email}
                        readOnly
                    />
                </div>
                <div className='div-button'>
                    <button>Salvar Mudanças</button>
                </div>
            </form>
            <Cads span={"Nome alterado com sucesso!"} isVisible={isNameUpdated} />
        </div>
    )
}