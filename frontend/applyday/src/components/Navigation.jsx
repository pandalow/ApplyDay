import { Link } from 'react-router-dom';

function Navigation(){
    return(
        <nav>
            <div>
                <h1>ApplyDay</h1>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/admin">管理面板</Link>
                </div>
            </div>
        </nav>
    )   
}

export default Navigation