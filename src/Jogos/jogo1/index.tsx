// src/PrimeiroGame.tsx
import './style.scss';
import { Canvas } from '@react-three/fiber';
import { MeshStandardMaterial, PlaneGeometry, AmbientLight, DirectionalLight } from 'three';

export function PrimeiroGame() {

  return (
    <div className='container-primeiroGame'>
      <Canvas style={{ width: '1000px', height: '600px' }}>
        {/* Luzes */}
        <AmbientLight color="white" intensity={0.5} />
        <DirectionalLight position={[10, 10, 10]} intensity={1} />

        {/* Céu Azul */}
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial color="skyblue" side={2} />
        </mesh>

        {/* Grama Verde */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1000, 1000]} />
          <MeshStandardMaterial color="green" />
        </mesh>
      </Canvas>
    </div>
  );
}
