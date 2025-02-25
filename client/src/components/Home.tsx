import '../styles/global.css'
import Header from './Header';

const Home = () => {
    return (
        <>
            <Header />
            <div>
                <h2>ברוכים הבאים לאתר המתכונים שלנו!</h2>
                <h3>כאן תוכלו למצוא מגוון רחב של מתכונים טעימים ובריאים.</h3>
                <p>התחילו לחפש את המתכון המושלם עבורכם!</p>
            </div>
        </>
    );
};

export default Home;