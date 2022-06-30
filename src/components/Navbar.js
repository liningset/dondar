export default function Navbar() {
  return (
    <div className="nav-container">
      <nav className="navbar">
        <ul className="navlist">
          <li>
            <a href="#"></a>
          </li>
          <li>
            <button className="theme-toggle-btn" data-theme="light">
              <i className="fas fa-moon"></i>
            </button>
            <button className="info-btn">
              <i className="fas fa-info"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
