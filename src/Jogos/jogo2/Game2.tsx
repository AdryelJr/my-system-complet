import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Game2Props {
    roomName: string;
    playerName?: string;
}

interface Player {
    id: string;
    name: string;
}

export function Game2({ roomName, playerName }: Game2Props) {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (roomName && playerName) {
            socket.emit('joinRoom', roomName, playerName);

            const handlePlayersUpdate = (players: Player[]) => {
                setPlayers(players);
            };
            socket.on('updatePlayers', handlePlayersUpdate);
            return () => {
                socket.off('updatePlayers', handlePlayersUpdate);
                socket.emit('leaveRoom', roomName);
            };
        }
    }, [roomName, playerName]);

    console.log('jogadores lista', players);

    return (
        <div>
            <p>Lista Sala {roomName}</p>
            <div>
                {players.length === 0 ? (
                    <p>Nenhum jogador na sala</p>
                ) : (
                    players.map(player => (
                        <p key={player.id}>{player.name}</p>
                    ))
                )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {players.map(player => (
                    <div key={player.id} style={{ margin: '10px', textAlign: 'center' }}>
                        <div>{player.name}</div>
                        <div
                            style={{
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                backgroundColor: 'orangered',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '5px',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
