import '../styles/Header.css'
import '../styles/global.css'

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">מתכונים</h1>
                <nav className="header-nav">
                    <ul className="header-menu">
                        <li className="header-menu-item"><a href="home">בית</a></li>
                        <li className="header-menu-item"><a href="recipes">מתכונים</a></li>
                        <li className="header-menu-item"><a href="about">אודות</a></li>
                        <li className="header-menu-item"><a href="contact">צור קשר</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;