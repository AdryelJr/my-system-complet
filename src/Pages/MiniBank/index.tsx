import './style.scss';
import coinsSvg from '../../assets/svg/coins.svg';
import { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import { AuthContext } from '../../contexts/userAuth';

export function MiniBank() {
    const { user } = useContext(AuthContext);
    const [coins, setCoins] = useState<number | null>(null);
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.id);

            // Função para atualizar o estado das moedas
            const updateCoins = (snapshot: any) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setCoins(userData.userInfoGame.coins);
                }
            };

            // Escuta as mudanças em tempo real
            const unsubscribe = onValue(userRef, updateCoins);

            // Limpeza
            return () => unsubscribe();
        }
    }, [user]);

    const handleTransfer = async () => {
        if (!user) return;

        const db = getDatabase();
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            let recipientId = '';
            let recipientCoins = 0;

            // Procurar pelo usuário destinatário pelo email
            for (const id in usersData) {
                if (usersData[id].email === recipientEmail) {
                    recipientId = id;
                    recipientCoins = usersData[id].userInfoGame.coins;
                    break;
                }
            }

            if (!recipientId) {
                setMessage('Usuário destinatário não encontrado');
                return;
            }

            if (transferAmount <= 0 || transferAmount > coins!) {
                setMessage('Valor de transferência inválido');
                return;
            }

            // Atualizar saldo do remetente e do destinatário
            const updates: any = {};
            updates['/users/' + user.id + '/userInfoGame/coins'] = coins! - transferAmount;
            updates['/users/' + recipientId + '/userInfoGame/coins'] = recipientCoins + transferAmount;

            await update(ref(db), updates);
            setMessage('Transferência realizada com sucesso');
        } else {
            console.log("No data available");
        }
    };

    return (
        <div className={'container-miniBank'}>
            {coins !== null ? (
                <>
                    <div className='content-miniBank'>
                        <div className='div-header-xp'>
                            <div className='div-coins'>
                                <img src={coinsSvg} alt='Coins' />
                                <p>Moedas: {coins}</p>
                            </div>
                        </div>
                    </div>
                    <div className='transaction-section'>
                        <input
                            type="email"
                            placeholder="Email do destinatário"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Quantidade de moedas"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(Number(e.target.value))}
                        />
                        <button onClick={handleTransfer}>Transferir Moedas</button>
                        {message && <p>{message}</p>}
                    </div>
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
