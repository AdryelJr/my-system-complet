import { useState } from 'react';
import './style.scss';
import { Mundo3D } from './indexMundo3D';
import { MenuGame1 } from './indexMenu';

export function PrimeiroGame() {
  const [inGame, setInGame] = useState(false);

  return (
    <div className='container-primeiroGame'>
      {inGame ? <Mundo3D /> : <MenuGame1 onStart={() => setInGame(true)} />}
    </div>
  );
}
