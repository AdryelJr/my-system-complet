import './style.scss';
import binSvg from '../../assets/svg/bin.svg';
import editSvg from '../../assets/svg/edit.svg';
import checkedSvg from '../../assets/svg/checked.svg';
import { useAuth } from '../../hooks/useAuth';
import { FormEvent, useEffect, useState } from 'react';
import { onValue, push, ref, remove, set, update } from 'firebase/database';
import { database } from '../../services/firebase';
import { CardEditList } from '../../components/Cards/CardEditList';

export function TodoList() {
    const { user } = useAuth();
    const [inputItem, setInputItem] = useState('');
    const [inputPreco, setInputPreco] = useState(0);
    const newItem: any = {
        Item: inputItem,
        Preço: inputPreco,
        Conferido: false
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

    async function checkedItemBanco(itemId: string, checked: boolean) {
        try {
            const itemRef = ref(database, `users/${user?.id}/TodoList/${itemId}`);
            await update(itemRef, {
                Conferido: checked
            })
        } catch (error) {
            console.error('Erro ao checar item:', error);
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
    const [cardEdit, setCardEdit] = useState(Boolean);
    const [cardPlaceholderName, setCardPlaceholderName] = useState("");
    const [cardPlaceholderPrice, setCardPlaceholderPrice] = useState('');
    const [itemId, setItemId] = useState('');
    function handleEdit(Item: string, Preço: string, Id: string) {
        setCardEdit(true);
        setCardPlaceholderName(Item);
        setCardPlaceholderPrice(Preço);
        setItemId(Id);
    }

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
                                <li key={index} className={item.Conferido ? 'strikethrough' : ''}>
                                    {item.Item} - {parseFloat(item.Preço).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    <button onClick={() => handleEdit(item.Item, item.Preço, item.id)}>
                                        <img src={editSvg} alt="edit" />
                                    </button>
                                    <div className='div-actionsItem'>
                                        <button onClick={() => checkedItemBanco(item.id, !item.Conferido)}>
                                            <img src={checkedSvg} alt="checked" />
                                        </button>
                                        <button onClick={() => handleDeleteItem(item.id)}>
                                            <img src={binSvg} alt="lixeira" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <CardEditList
                        cardPlaceholderName={cardPlaceholderName}
                        cardPlaceholderPrice={cardPlaceholderPrice}
                        cardEdit={cardEdit}
                        setCardEdit={setCardEdit}
                        setId={itemId}
                    />
                </div>
            </div>
        </div>
    )
}
