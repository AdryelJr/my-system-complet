import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { Game2 } from './Game2';

const socket = io('http://localhost:3000');

export function MenuGame2() {
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const handleUpdateRooms = (rooms: string[]) => {
            console.log('Salas recebidas:', rooms);
            setRooms(rooms);
        };
        socket.on('updateRooms', handleUpdateRooms);
        socket.emit('getRooms');
        return () => {
            socket.off('updateRooms', handleUpdateRooms);
        };
    }, []);

    const handleJoinRoom = (room: string) => {
        setSelectedRoom(room);
        socket.emit('joinRoom', room, user?.name);
    };

    if (selectedRoom) {
        return <Game2 roomName={selectedRoom} playerName={user?.name} />;
    }

    return (
        <div>
            {rooms.length === 0 ? (
                <p>Nenhuma sala disponível</p>
            ) : (
                rooms.map(room => (
                    <button key={room} onClick={() => handleJoinRoom(room)}>
                        {room} - Entrar
                    </button>
                ))
            )}
        </div>
    );
}
