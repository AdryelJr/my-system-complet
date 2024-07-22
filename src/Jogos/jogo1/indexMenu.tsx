import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './style.scss';
import soundButton from './sound/soundbutton.mp3'; // Importa o áudio

interface MenuGame1Props {
    onStart: () => void;
}

export function MenuGame1({ onStart }: MenuGame1Props) {
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [rooms, setRooms] = useState<string[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const socketRef = useRef<ReturnType<typeof io> | null>(null);

    useEffect(() => {
        const audio = new Audio(soundButton);
        audio.addEventListener('canplaythrough', () => setIsAudioLoaded(true));
        audioRef.current = audio;

        const menuBackground = document.querySelector(".menuGame1");

        function createParticle() {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.width = `${Math.random() * 20 + 10}px`;
            particle.style.height = particle.style.width;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            if (menuBackground) {
                menuBackground.appendChild(particle);
            }
        }

        for (let i = 0; i < 30; i++) {
            createParticle();
        }

        // Conectar ao servidor e escutar atualizações de salas
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('updateRooms', (availableRooms: string[]) => {
            setRooms(availableRooms.slice(0, 2)); // Mostrar apenas duas salas
        });

        return () => {
            const particles = document.querySelectorAll(".particle");
            particles.forEach(p => p.remove());
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const handleClick = () => {
        // Reproduz o áudio apenas se estiver carregado
        if (isAudioLoaded && audioRef.current) {
            audioRef.current.play().catch(error => console.error("Erro ao reproduzir o áudio:", error));
        }
        if (selectedRoom) {
            socketRef.current?.emit('joinRoom', selectedRoom);
            onStart();
        } else {
            console.error("Nenhuma sala selecionada");
        }
    };

    return (
        <div className="menuGame1">
            <h1>Bem-vindo ao Jogo</h1>
            <div className="rooms-list">
                <h3>Salas Disponíveis</h3>
                <ul>
                    {rooms.length > 0 ? (
                        rooms.map((room, index) => (
                            <li key={index}>
                                <button onClick={() => setSelectedRoom(room)}>{room}</button>
                            </li>
                        ))
                    ) : (
                        <li>Nenhuma sala disponível</li>
                    )}
                </ul>
            </div>
            <button onClick={handleClick}>Jogar</button>
        </div>
    );
}
