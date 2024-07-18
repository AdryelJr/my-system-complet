import './style.scss';
import coinsSvg from '../../assets/svg/coins.svg';
import { useEffect, useState, useContext } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { AuthContext } from '../../contexts/userAuth';

export function MiniBank() {
    const { user } = useContext(AuthContext);
    const [coins, setCoins] = useState<number | null>(null);
    const [xp, setXp] = useState<number>(0);
    const [level, setLevel] = useState<number>(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + user.id);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setCoins(userData.userInfoGame.coins);
                    const xp = userData.userInfoGame.xp || 0; // Define XP como 0 se não existir
                    setXp(xp);
                    setLevel(calculateLevel(xp));
                } else {
                    console.log("No data available");
                }
            }
        };
        fetchUserData();

        // Adiciona um pequeno delay para a transição suave
        setTimeout(() => setIsLoaded(true), 100);
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
            setCoins(coins! - transferAmount);
            setMessage('Transferência realizada com sucesso');
        } else {
            console.log("No data available");
        }
    };

    const calculateLevel = (xp: number): number => {
        let level = 1;
        let xpForNextLevel = 100;
        while (xp >= xpForNextLevel) {
            xp -= xpForNextLevel;
            level++;
            xpForNextLevel = xpForNextLevel + 50 * (level - 1);
        }
        return level;
    };

    const xpForNextLevel = (level: number): number => {
        return 100 + 50 * (level - 1);
    };

    const getLevelProgress = (xp: number, level: number): number => {
        const currentLevelXp = 100 * (level - 1) + 50 * (level - 2) * (level - 1) / 2;
        const nextLevelXp = currentLevelXp + xpForNextLevel(level);
        return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    };

    return (
        <div className={`container-miniBank ${isLoaded ? 'loaded' : ''}`}>
            {coins !== null ? (
                <>
                    <div className='content-miniBank'>
                        <div className='div-header-xp'>
                            <div className='div-teste'>
                                <div className='div-level'>
                                    <p>Nível: {level}</p>
                                </div>
                                <div className='div-xp'>
                                    <div className='xp-bar' style={{ width: `${getLevelProgress(xp, level)}%` }}></div>
                                    <div className='xp-text'>{xp} XP</div>
                                </div>
                            </div>
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
