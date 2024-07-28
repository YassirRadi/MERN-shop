import React from "react";
import './Footer.css';
import { assets } from '../../assets/assets';
import { useLocation } from "react-router-dom";
import assert from "assert";




const Footer = () => {

    const location = useLocation();

    const getFooterColor = () => {
        switch (location.pathname) {
            case '/allcategory':
                return 'pink';
            case '/about':
                return 'yellow';
            case '/login':
                return 'green';
            case '/cart':
                return 'lightgreen';
            case '/contact':
                return 'pp';
            case '/paymentportal':
                return 'gg';
            case '/track-order':
                return 'r';
            default:
                if (/^\/product\/\d+$/.test(location.pathname)) { // Match /product/:productId pattern
                    return 'b';
                }
                return '';
        }
    };

    return(
        <div className={`footer ${getFooterColor()}`}>
            <div className="footer-logo">
                <img src={assets.logo} alt="" />
            </div>
            <ul className="footer-links">
                <li>About</li>
                <li>Categories</li>
                <li>Branches</li>
                <li>Contact</li>
            </ul>
            <div className="footer-social-icon">
                <div className="footer-icons-container">
                    <img src={assets.whatsapp} alt="" />
                </div>

                <div className="footer-icons-container">
                    <img src={assets.facebook} alt="" />
                </div>

                <div className="footer-icons-container">
                    <img src={assets.instagram} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={assets.youtube} alt="" />
                </div>
            </div>

            <div className="footer-copyright">
                <hr />
                <p>Copyright@GoNuts With DoNuts - ALl Right Reserved</p>
            </div>
            
        </div>
    )
}

export default Footer;
