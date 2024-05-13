import { FormEvent, useState } from 'react';
import './style.scss';
import { ref, update } from 'firebase/database';
import { useAuth } from '../../../hooks/useAuth';
import { database } from '../../../services/firebase';

type CardListProps = {
    cardPlaceholderPrice: string,
    cardPlaceholderName: string,
    setId: string,
    cardEdit: boolean,
    setCardEdit: (value: boolean) => void
}

export function CardEditList({ setId, cardPlaceholderPrice, cardPlaceholderName, cardEdit, setCardEdit }: CardListProps) {
    const { user } = useAuth();
    const [newPrice, setNewPrice] = useState<number | null>(null);
    const handleEditRemove = () => {
        setCardEdit(false);
    }

    async function updateItemPrice(itemId: string, newPrice: number) {
        try {
            const itemRef = ref(database, `users/${user?.id}/TodoList/${itemId}`);
            await update(itemRef, {
                Preço: newPrice
            });
        } catch (error) {
            console.error('Erro ao atualizar preço do item:', error);
        }
    }

    const handleSaveChanges = async (itemId: string, event: FormEvent) => {
        event?.preventDefault();
        if (newPrice !== null) {
            await updateItemPrice(itemId, newPrice);
            setCardEdit(false);
        }
    }

    return (
        <div className={`container-cardEditList ${cardEdit ? "cardEdit" : ""}`}>
            <div className='div-title'>
                <h3>Editar item</h3>
                <button onClick={handleEditRemove}>x</button>
            </div>

            <div className='content-cardEditList'>
                <form>
                    <span>Nome item</span>
                    <input
                        className='input-name'
                        type="text"
                        placeholder={cardPlaceholderName}
                        disabled
                    />
                    <span>Preço item</span>
                    <input
                        type="number"
                        placeholder={cardPlaceholderPrice}
                        onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    />
                    <button onClick={(e) => handleSaveChanges(setId, e)}>Salvar Alteração</button>
                </form>
            </div>
        </div>
    )
}
