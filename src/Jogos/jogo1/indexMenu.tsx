export function MenuGame1({ onStart }: { onStart: () => void }) {
    return (
        <div className="menuGame1">
            <h1>Bem-vindo ao Jogo</h1>
            <button onClick={onStart}>Jogar</button>
        </div>
    )
}