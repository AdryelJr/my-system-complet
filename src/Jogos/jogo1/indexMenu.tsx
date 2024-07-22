import { useEffect, useRef, useState } from 'react';
import './style.scss';
import soundButton from './sound/soundbutton.mp3'; // Importa o áudio

interface MenuGame1Props {
    onStart: () => void;
}

export function MenuGame1({ onStart }: MenuGame1Props) {
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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

        return () => {
            const particles = document.querySelectorAll(".particle");
            particles.forEach(p => p.remove());
        };
    }, []);

    const handleClick = () => {
        // Reproduz o áudio apenas se estiver carregado
        if (isAudioLoaded && audioRef.current) {
            audioRef.current.play().catch(error => console.error("Erro ao reproduzir o áudio:", error));
        }
        onStart();
    };

    return (
        <div className="menuGame1">
            <h1>Bem-vindo ao Jogo</h1>
            <button onClick={handleClick}>Jogar</button>
        </div>
    );
}
