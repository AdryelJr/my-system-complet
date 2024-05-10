import './style.scss';
import binSvg from '../../assets/svg/bin.svg';

export function TodoList() {
    return (
        <div className="container-todolist">
            <div className="content-todolist">
                <form>
                    <input type="text" />
                    <button>Adicionar</button>
                </form>

                <div>
                    <ul>
                        <li>
                            1 item adicionado
                            <button>
                                Deletar
                                <img src={binSvg} alt="lixeira" />
                            </button>
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
    )
}