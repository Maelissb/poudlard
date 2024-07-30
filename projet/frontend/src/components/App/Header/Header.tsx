
import './Header.scss';
import { Link } from 'react-router-dom';
import ContextMenu from './ContextMenu';

const Header = () => {

  const token = localStorage.getItem('token');
  return (
    <header>
      <div className='header_container'>
        <Link to="/">
          <img src="/poudlard.png" alt="Logo de Poudlard" />
        </Link>
        <h1>Poudlard's portal</h1>
      </div>


      {token && <ContextMenu />}
      {!token && <Link to="/login">
        <img src="/locked.png" alt="" />
      </Link>}


    </header>
  );
}

export default Header;
