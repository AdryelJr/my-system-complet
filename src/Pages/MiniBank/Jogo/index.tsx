import { PrimeiroGame } from "../../../Jogos/jogo1";
import './style.scss';

export function JogosPage() {
    return (
        <div className="container-JogosPage">
            <h3>Jogo 1</h3>

            <PrimeiroGame />
        </div>
    )
}