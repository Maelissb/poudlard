import './NavBar.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NavLink } from '../../../@types/navlink';


const NavBar = () => {
  const [navLinks, setNavLinks] = useState<NavLink[] | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (localStorage.getItem('token')) {
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }
  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/nav-links`, {
          method: 'GET',
          headers: headers
        });
        if (!response.ok) {

          throw new Error('Failed to fetch nav links');
        }
        const data = await response.json();
        setNavLinks(data);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
        console.error(error);
      }
    };

    fetchNavLinks();
  }, []);


  return (
    <nav>
      <ul>
        {navLinks && navLinks.map((navLink) => (
          <li key={navLink.url} className={navLink.url === location.pathname ? 'active' : ''}>
            <Link to={navLink.url}>{navLink.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;

<Link to="/staff" />