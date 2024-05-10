import './style.scss';
import binSvg from '../../assets/svg/bin.svg';
// import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';

export function TodoList() {
    // const { user } = useAuth();
    const [inputItem, setInputItem] = useState('');
    const [inputPreco, setInputPreco] = useState('');

    function createNewItem(event: FormEvent) {
        event?.preventDefault();
        const newItem = {
            Item: inputItem,
            Preço: inputPreco
        }
        console.log(newItem);
        setInputItem('');
        setInputPreco('');
    }

    return (
        <div className="container-todolist">
            <div className="content-todolist">
                <form onSubmit={createNewItem}>
                    <input
                        className='input1'
                        type="text"
                        placeholder='Item'
                        onChange={(event) => setInputItem(event.target.value)}
                    />
                    <input
                        className='input2'
                        type="number"
                        placeholder='R$'
                        onChange={(event) => setInputPreco(event.target.value)}
                    />
                    <button>Adicionar</button>
                </form>

                <div>
                    <ul>
                        <li>
                            1 item adicionado
                            <button>
                                Deletar
                                <img src={binSvg} alt="lixeira" />
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
