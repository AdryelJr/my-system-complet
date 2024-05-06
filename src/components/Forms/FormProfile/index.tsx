import { useAuth } from '../../../hooks/useAuth'
import './style.scss'

export function FormProfile() {
    const { user } = useAuth();
    return (
        <div className="container-formProfile">
            <form>
                <div className='div-displayName'>
                    <h1>Name</h1>
                    <p>Esse será o nome exibido publicamente.</p>
                    <h2>Name</h2>
                    <input
                        type="text"
                        placeholder={user?.name}
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
                    <button>Salvar</button>
                </div>
            </form>

        </div>
    )
}