
import "./footer.scss";


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>
                        Welcome to ShoeShop, your one-stop destination for the latest and
                        trendiest footwear. We are committed to providing high-quality
                        products and exceptional customer service.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <a href="/shop">Shop</a>
                        </li>
                        <li>
                            <a href="/about">About Us</a>
                        </li>
                        <li>
                            <a href="/contact">Contact Us</a>
                        </li>
                        <li>
                            <a href="/faq">FAQs</a>
                        </li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@shoeshop.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: 123 Shoe Street, Fashion City</p>
                </div>

                {/* Social Media Section */}
                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com/cshosain" target="_blank" rel="noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://x.com" target="_blank" rel="noreferrer">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="https://linkedin.com/in/cshosain" target="_blank" rel="noreferrer">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} ShoeShop-Hosain. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;