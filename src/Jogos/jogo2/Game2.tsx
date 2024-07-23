// Game2.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Game2Props {
    roomName: string;
}

export function Game2({ roomName }: Game2Props) {
    const [players, setPlayers] = useState<string[]>([]);

    useEffect(() => {
        socket.emit('joinRoom', roomName);

        const handlePlayersUpdate = (players: string[]) => {
            setPlayers(players);
        };

        socket.on('updatePlayers', handlePlayersUpdate);

        return () => {
            socket.off('updatePlayers', handlePlayersUpdate);
            socket.emit('leaveRoom', roomName);
        };
    }, [roomName]);

    return (
        <div>
            <p>Lista Sala {roomName}</p>
            {players.length === 0 ? (
                <p>Nenhum jogador na sala</p>
            ) : (
                players.map(player => <p key={player}>{player}</p>)
            )}
        </div>
    );
}
