import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {

    const { clearCart} = useContext(ShopContext);
    const [menu, setMenu] = useState("home");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { getTotalCartItems } = useContext(ShopContext);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth-token'));
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        handleMenuClick(location.pathname);
    }, [location.pathname]);

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        clearCart();
        window.location.replace('/');
    };

    const getNavbarColor = () => {
        switch (location.pathname) {
            case '/allcategory':
                return 'pink';
            case '/about':
                return 'yellow';
            case '/login':
                return 'green';
            case '/cart':
                return 'lightgreen';
            case '/donuts':
                return 'g';
            case '/cupcakes':
                return 'p';
            case '/iclairs':
                return 'g1';
            case '/track-order':
                return 'r';
            case '/contact':
                return 'pp';
            case '/paymentportal':
                return 'gg'
            default:
                if (/^\/product\/\d+$/.test(location.pathname)) { // Match /product/:productId pattern
                    return 'b';
                }
                return '';
        }
    };

    return (
        <div className={`navbar ${getNavbarColor()}`}>
            <img src={assets.logo} alt="" className="logo" />
            <ul className="navbar-menu">
                <li onClick={() => handleMenuClick('/')} className={menu === "/" ? "active" : ""}><Link to='/'>Home</Link></li>
                <li onClick={() => handleMenuClick('/allcategory')} className={menu === "/allcategory" ? "active" : ""}><Link to='/allcategory'>Menu</Link></li>
                <li onClick={() => handleMenuClick('/about')} className={menu === "/about" ? "active" : ""}><Link to='/about'>About</Link></li>
                <li onClick={() => handleMenuClick('/contact')} className={menu === "/contact" ? "active" : ""}><Link to='/contact'>Contact</Link></li>
            </ul>

            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <Link to='/cart' onClick={() => handleMenuClick('/cart')}><img src={assets.basket_icon} alt="" /></Link>
                    <div className="dot">{getTotalCartItems()}</div>
                </div>
                <div className="profile-section">
                    {isAuthenticated ? (
                        <div onClick={() => setDropdownVisible(!dropdownVisible)}>
                            <img className='profile-icon' src={assets.logout} alt="Profile" />
                        </div>
                    ) : (
                        <Link to='/login' className="login-link" onClick={() => handleMenuClick('/login')}>
                            <img className='profile-icon' src={assets.profile_icon} alt="Profile" />
                        </Link>
                    )}
                    {dropdownVisible && isAuthenticated && (
                        <div className="dropdown-menu">
                            <Link to='/track-order' className="dropdown-item" onClick={() => setDropdownVisible(false)}>Track Order</Link>
                            <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
