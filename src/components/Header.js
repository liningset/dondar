import { useRef } from "react";
import gsap from "gsap";

export default function Header({ setService }) {
  let themeBtn = useRef(null);
  let homeBtn = useRef(null);
  let navContainer = useRef(null);
  let themeIcon = useRef(null);
  let activeTheme = sessionStorage.getItem("theme");

  function applyThemeAnimation(from, to, icon) {
    try {
      gsap.fromTo(
        themeIcon.current,
        { rotate: from },
        {
          duration: 0.25,
          rotate: to,
          onComplete: function () {
            themeIcon.current.className = `fas fa-${icon}`;
          },
        }
      );
    } catch {
      themeIcon.current.className = `fas fa-${icon}`;
    }
  }

  function toggleTheme() {
    if (activeTheme === "dark" || !activeTheme) {
      sessionStorage.setItem("theme", "light");
      activeTheme = sessionStorage.getItem("theme");
      applyThemeAnimation(0, "180deg", "sun");
    } else {
      sessionStorage.setItem("theme", "dark");
      activeTheme = sessionStorage.getItem("theme");
      applyThemeAnimation("180deg", 0, "moon");
    }
    document.body.dataset.theme = sessionStorage.getItem("theme");
  }

  function goHome() {
    if (!sessionStorage.getItem("service")) return;

    try {
      gsap
        .timeline({ defaults: { duration: 0.5 } })
        .fromTo("#root > main", { opacity: 1, y: 0 }, { opacity: 0, y: -50 })
        .fromTo(
          "#root > section",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -50 },
          "-=0.5"
        )
        .fromTo(
          "#root > header",
          { opacity: 1, y: 0 },
          { opacity: 0, y: "-100%" },
          "-=0.25"
        )
        .fromTo(
          "#root > footer",
          { opacity: 1, y: 0 },
          { opacity: 0, y: "100%" },
          "-=0.5"
        );
    } catch {
      document
        .querySelectorAll("#root > *")
        .forEach((el) => (el.style.opacity = "1"));
    }

    setTimeout(() => {
      setService("");
      sessionStorage.setItem("service", "");
    }, 800);
  }

  return (
    <header className="nav-container" ref={navContainer}>
      <nav className="navbar">
        <ul className="navlist-left">
          <li title="go home">
            <button className="home-btn" ref={homeBtn} onClick={() => goHome()}>
              <i className="fas fa-home"></i>
            </button>
          </li>
          <li title="switch theme">
            <button
              className="theme-toggle-btn"
              ref={themeBtn}
              onClick={() => toggleTheme()}
            >
              <i
                className={
                  document.body.dataset.theme === "dark"
                    ? "fas fa-moon"
                    : "fas fa-sun"
                }
                ref={themeIcon}
              ></i>
            </button>
          </li>
        </ul>
        <ul className="navlist-right">
          <li>
            <a href="#">Info</a>
          </li>
          <li>
            <a href="#">Help</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
