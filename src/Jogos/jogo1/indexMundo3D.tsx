import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import io from 'socket.io-client';
import grassTextureUrl from './texturas/pisoMadeira2.jpg';
import paredeTextura from './texturas/parede.jpg';

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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<PointerLockControls | null>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const gravity = 0.005;
  const jumpSpeed = 0.2;
  const maxJumps = 2;
  const jumps = useRef(0);
  const isGrounded = useRef(false);

  const [players, setPlayers] = useState<{ [key: string]: Player }>({});
  const [isConnected, setIsConnected] = useState(false);

  const worldBounds = {
    xMin: -50,
    xMax: 50,
    zMin: -50,
    zMax: 50
  };

  const socket = useRef(io('https://servidor-my-complete-system.vercel.app/')).current;

  function createWall({ width, height, depth, x, y, z }: WallProps) {
    const wallGeometry = new THREE.BoxGeometry(width, height, depth);
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load(paredeTextura);
    wallTexture.minFilter = THREE.LinearFilter;
    wallTexture.magFilter = THREE.LinearFilter;
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y + height / 2, z);
    return wall;
  }

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('move', (data: { id: string, x: number, y: number, z: number }) => {
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [data.id]: { id: data.id, x: data.x, y: data.y, z: data.z }
      }));
    });

    socket.on('newPlayer', (data: Player) => {
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [data.id]: data
      }));
    });

    socket.on('playerDisconnected', (id: string) => {
      setPlayers(prevPlayers => {
        const { [id]: _, ...rest } = prevPlayers;
        return rest;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [isConnected]);


  useEffect(() => {
    if (!isConnected) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1000 / 555, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('mundo-3d');

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

      scene.add(createWall({
        width: worldBounds.xMax - worldBounds.xMin,
        height: 5,
        depth: 1,
        x: (worldBounds.xMin + worldBounds.xMax) / 2,
        y: -2,
        z: worldBounds.zMin - 1 / 2
      }));
      scene.add(createWall({
        width: worldBounds.xMax - worldBounds.xMin,
        height: 5,
        depth: 1,
        x: (worldBounds.xMin + worldBounds.xMax) / 2,
        y: -2,
        z: worldBounds.zMax + 1 / 2
      }));
      scene.add(createWall({
        width: 1,
        height: 5,
        depth: worldBounds.zMax - worldBounds.zMin,
        x: worldBounds.xMin - 1 / 2,
        y: -2,
        z: (worldBounds.zMin + worldBounds.zMax) / 2
      }));
      scene.add(createWall({
        width: 1,
        height: 5,
        depth: worldBounds.zMax - worldBounds.zMin,
        x: worldBounds.xMax + 1 / 2,
        y: -2,
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
              velocity.current.y = jumpSpeed;
              keys.current['Space'] = false;
              jumps.current++;
              isGrounded.current = false;
            }

            velocity.current.y -= gravity;

            camera.position.add(velocity.current);

            if (camera.position.y < 2) {
              camera.position.y = 2;
              velocity.current.y = 0;
              if (!isGrounded.current) {
                jumps.current = 0;
                isGrounded.current = true;
              }
            }

            camera.position.x = Math.max(worldBounds.xMin, Math.min(camera.position.x, worldBounds.xMax));
            camera.position.z = Math.max(worldBounds.zMin, Math.min(camera.position.z, worldBounds.zMax));

            // Enviar a posição do jogador para o servidor
            socket.emit('move', {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z
            });
          }
        }

        renderer.render(scene, camera);
      }

      animate();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        renderer.dispose();
      };
    }
  }, [isConnected]);

  if (!isConnected) {
    return <div>Conectando ao servidor...</div>;
  }

  return <div id="mundo-3d"></div>;
}
