import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { io } from 'socket.io-client';
import grassTextureUrl from './texturas/pisoMadeira2.jpg';
import paredeTextura from './texturas/parede.jpg'; // Importando a textura da parede
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

interface WallProps {
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
}

interface Player {
  id: string;
  x: number;
  y: number;
  z: number;
}

export function Mundo3D() {
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3(0, 0, 0)); // Para movimentação e física
  const gravity = 0.005;
  const jumpSpeed = 0.2;
  const maxJumps = 2; // Número máximo de pulos
  const jumps = useRef(0); // Contador de pulos realizados
  const isGrounded = useRef(false); // Verifica se o jogador está no chão
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const worldBounds = {
    xMin: -50,
    xMax: 50,
    zMin: -50,
    zMax: 50
  };

  function createWall({ width, height, depth, x, y, z }: WallProps) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);

    // Carregar a textura e criar o material
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load(paredeTextura);

    // Ajustar propriedades da textura para melhorar a qualidade
    wallTexture.minFilter = THREE.LinearFilter;
    wallTexture.magFilter = THREE.LinearFilter;
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;

    // Criar o material com a textura
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y + height / 2, z);
    return wall;
  }

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1000 / 555, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('mundo-3d');

    const wallHeight = 5;
    const wallThickness = 1;

    if (container) {
      container.innerHTML = '';
      renderer.setSize(1000, 555);
      container.appendChild(renderer.domElement);

      scene.background = new THREE.Color(0x87ceeb);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(grassTextureUrl, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        scene.add(ground);
      });

      // Adicionando as paredes com a textura
      scene.add(createWall({
        width: worldBounds.xMax - worldBounds.xMin,
        height: wallHeight,
        depth: wallThickness,
        x: (worldBounds.xMin + worldBounds.xMax) / 2,
        y: -2, // Altura do chão
        z: worldBounds.zMin - wallThickness / 2
      }));
      scene.add(createWall({
        width: worldBounds.xMax - worldBounds.xMin,
        height: wallHeight,
        depth: wallThickness,
        x: (worldBounds.xMin + worldBounds.xMax) / 2,
        y: -2, // Altura do chão
        z: worldBounds.zMax + wallThickness / 2
      }));
      scene.add(createWall({
        width: wallThickness,
        height: wallHeight,
        depth: worldBounds.zMax - worldBounds.zMin,
        x: worldBounds.xMin - wallThickness / 2,
        y: -2, // Altura do chão
        z: (worldBounds.zMin + worldBounds.zMax) / 2
      }));
      scene.add(createWall({
        width: wallThickness,
        height: wallHeight,
        depth: worldBounds.zMax - worldBounds.zMin,
        x: worldBounds.xMax + wallThickness / 2,
        y: -2, // Altura do chão
        z: (worldBounds.zMin + worldBounds.zMax) / 2
      }));

      camera.position.set(0, 2, 5);
      cameraRef.current = camera;

      const controls = new PointerLockControls(camera, renderer.domElement);
      controlsRef.current = controls;

      container.addEventListener('click', () => {
        controls.lock();
      });

      const moveSpeed = 0.1;

      const handleKeyDown = (event: KeyboardEvent) => {
        keys.current[event.code] = true;
      };
      const handleKeyUp = (event: KeyboardEvent) => {
        keys.current[event.code] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      socketRef.current = io('http://localhost:3000'); // Conectando ao servidor

      socketRef.current.on('connect', () => {
        console.log('Conectado ao servidor:', socketRef.current?.id);
      });

      socketRef.current.on('newPlayer', (player: Player) => {
        setPlayers((prevPlayers) => ({ ...prevPlayers, [player.id]: player }));
      });

      socketRef.current.on('move', (player: Player) => {
        setPlayers((prevPlayers) => ({ ...prevPlayers, [player.id]: player }));
      });

      socketRef.current.on('playerDisconnected', (playerId: string) => {
        setPlayers((prevPlayers) => {
          const updatedPlayers = { ...prevPlayers };
          delete updatedPlayers[playerId];
          return updatedPlayers;
        });
      });

      function animate() {
        requestAnimationFrame(animate);

        if (cameraRef.current) {
          const camera = cameraRef.current;
          const controls = controlsRef.current;

          if (controls) {
            // Movimento do jogador
            if (keys.current['KeyW']) controls.moveForward(moveSpeed);
            if (keys.current['KeyS']) controls.moveForward(-moveSpeed);
            if (keys.current['KeyA']) controls.moveRight(-moveSpeed);
            if (keys.current['KeyD']) controls.moveRight(moveSpeed);

            // Física e pular
            if (keys.current['Space'] && (jumps.current < maxJumps || isGrounded.current)) {
              velocity.current.y = jumpSpeed; // Aplica força de pulo
              keys.current['Space'] = false; // Evita múltiplos pulos
              jumps.current++;
              isGrounded.current = false; // O jogador não está mais no chão
            }

            velocity.current.y -= gravity; // Aplica gravidade

            // Atualiza posição da câmera
            camera.position.add(velocity.current);

            // Simula colisão com o chão
            if (camera.position.y < 2) { // Ajuste para a altura correta
              camera.position.y = 2;
              velocity.current.y = 0;
              if (!isGrounded.current) {
                jumps.current = 0; // Reinicia o contador de pulos ao tocar o chão
                isGrounded.current = true; // O jogador está no chão
              }
            }

            // Limite do mundo
            camera.position.x = Math.max(worldBounds.xMin, Math.min(camera.position.x, worldBounds.xMax));
            camera.position.z = Math.max(worldBounds.zMin, Math.min(camera.position.z, worldBounds.zMax));

            // Emitir a posição atual do jogador para o servidor
            if (socketRef.current) {
              socketRef.current.emit('move', { x: camera.position.x, y: camera.position.y, z: camera.position.z });
            }
          }
        }

        renderer.render(scene, camera);
      }

      animate();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div id="mundo-3d">
      {Object.values(players).map((player) => (
        <div key={player.id}>
          Jogador {player.id} - Posição: {player.x}, {player.y}, {player.z}
        </div>
      ))}
    </div>
  );
}
