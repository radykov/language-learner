// components/Navigation.js
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();
    const showTestRunner = process.env.REACT_APP_GEN_AI_API_KEY?.trim();

    return (
        <nav className="side-nav">
            <div className="nav-header">
                <h2>Menu</h2>
            </div>
            <div className="nav-links">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    📖 Story Viewer
                </Link>
                <Link
                    to="/creator"
                    className={`nav-link ${location.pathname === '/creator' ? 'active' : ''}`}
                >
                    ✏️ Creator Studio
                </Link>
                {showTestRunner && (
                    <Link
                        to="/test"
                        className={`nav-link ${location.pathname === '/test' ? 'active' : ''}`}
                    >
                        🧪 Test Runner
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navigation;