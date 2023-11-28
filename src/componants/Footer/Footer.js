import React from "react";
import '../Footer/Footer.css'

function Footer() {
    return (
        <div className="Footer">
            <div className="footer-section">
                <h3>Contact Us</h3>
                <p>Email: info@example.com</p>
                <p>Phone: 000</p>
            </div>
            <div className="footer-section">
                <h3>About Us</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit....</p>
            </div>
            <div className="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/form">Create Invoice</a></li>
                    <li><a href="/sett">Settings</a></li>
                </ul>
            </div>
            <div className="copyright-section">
                <p>&copy; All rights reserved</p>
            </div>
        </div>

    )
}


export default Footer;