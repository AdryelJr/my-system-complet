// MenuGame2.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Game2 } from './Game2';
import { useAuth } from '../../hooks/useAuth';

const socket = io('https://servidor-my-system.vercel.app/');

export function MenuGame2() {
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const { user } = useAuth(); // Obtenha o usuário autenticado

    useEffect(() => {
        const handleUpdateRooms = (rooms: string[]) => {
            console.log('Salas recebidas:', rooms);
            setRooms(rooms);
        };

        // Ouve atualizações de salas
        socket.on('updateRooms', handleUpdateRooms);

        // Solicita a lista de salas quando o componente é montado
        socket.emit('getRooms');

        // Limpeza do socket ao desmontar o componente
        return () => {
            socket.off('updateRooms', handleUpdateRooms);
        };
    }, []);

    const handleJoinRoom = (room: string) => {
        setSelectedRoom(room);
        if (user && user.name) {
            socket.emit('joinRoom', room, user.name);
        } else {
            console.error('Usuário não autenticado');
        }
    };

    if (selectedRoom) {
        return <Game2 roomName={selectedRoom} />;
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
