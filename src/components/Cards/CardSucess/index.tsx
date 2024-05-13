import './style.scss';

type spanType = {
    span: string;
    isVisible: boolean;
}

export function Cads({ span, isVisible }: spanType) {
    return (
        <div className={`cardNomeAlterado ${isVisible ? 'visible' : ''}`}>
            <span>{span}</span>
        </div>
    )
}