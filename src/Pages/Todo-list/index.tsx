import './style.scss';
import binSvg from '../../assets/svg/bin.svg';
import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useEffect, useState } from 'react';
import { onValue, push, ref, remove, set } from 'firebase/database';
import { database } from '../../services/firebase';

export function TodoList() {
    const { user } = useAuth();
    const [inputItem, setInputItem] = useState('');
    const [inputPreco, setInputPreco] = useState(0);
    const newItem: any = {
        Item: inputItem,
        Preço: inputPreco,
    }

    const [precoFinal, setPrecoFinal] = useState('');
    const [listaItensBancoDados, setListaItensBancoDados] = useState<any>([]);
    useEffect(() => {
        const newItemRef = ref(database, `users/${user?.id}/TodoList`);
        onValue(newItemRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const items = Object.values(data);
                setListaItensBancoDados(items);
                const total = items.reduce((acc: number, item: any) => acc + parseFloat(item.Preço), 0);
                setPrecoFinal(total.toFixed(2));

            } else {
                setListaItensBancoDados([])
                setPrecoFinal('');
            }
        });
    }, [user?.id]);

    async function gravarItemBanco(event: FormEvent) {
        event?.preventDefault();

        if (inputItem.trim() !== '') {
            try {
                const itemRef = ref(database, `users/${user?.id}/TodoList`);
                const newItemRef = await push(itemRef);
                const newItemId = newItemRef.key;
                const newItemWithId = { ...newItem, id: newItemId };
                await set(newItemRef, newItemWithId);
                setInputItem('');
                setInputPreco(0);
            } catch (error) {
                console.error('Erro ao gravar item:', error);
            }
        }
    }


    const handleDeleteItem = async (itemId: string) => {
        try {
            const itemRef = ref(database, `users/${user?.id}/TodoList/${itemId}`);
            await remove(itemRef);
        } catch (error) {
            console.error('Erro ao deletar item:', error);
        }
    };

    return (
        <div className="container-todolist">
            <div className="content-todolist">
                <form onSubmit={gravarItemBanco}>
                    <input
                        className='input1'
                        type="text"
                        placeholder='Item'
                        onChange={(event) => setInputItem(event.target.value)}
                        value={inputItem}
                    />
                    <input
                        className='input2'
                        type="number"
                        placeholder='R$'
                        onChange={(event) => setInputPreco(parseFloat(event.target.value))}
                        value={inputPreco !== 0 ? inputPreco : ''}
                    />
                    <button>Adicionar</button>
                </form>
                <div className='content-items'>
                    <div className='div-title'>
                        <h3>Lista de Compras</h3> <span>{precoFinal ? `Total: $${precoFinal}` : 'Total: $0'}</span>
                    </div>
                    <ul>
                        {listaItensBancoDados.map((item: any, index: any) => {
                            return (
                                <li key={index}>
                                    {item.Item} - {parseFloat(item.Preço).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    <button onClick={() => handleDeleteItem(item.id)}>
                                        <img src={binSvg} alt="lixeira" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>
        </div>
    )
}
