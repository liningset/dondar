import { useRef } from "react";
import gsap from "gsap";

export default function Header({ setService }) {
  let themeBtn = useRef(null);
  let homeBtn = useRef(null);
  let navContainer = useRef(null);
  let sunIcon = useRef(null);
  let moonIcon = useRef(null);
  let activeTheme = sessionStorage.getItem("theme");

  function applyThemeAnimation(sunFrom, sunTo, moonFrom, moonTo) {
    try {
      gsap
        .timeline({ defaults: { duration: 0.125 } })
        .fromTo(
          sunIcon.current,
          { opacity: sunFrom.op, rotate: sunFrom.rot },
          { opacity: sunTo.op, rotate: sunTo.rot }
        )
        .fromTo(
          moonIcon.current,
          { opacity: moonFrom.op, rotate: moonFrom.rot },
          { opacity: moonTo.op, rotate: moonTo.rot },
          "-=0.125"
        );
    } catch {
      if (sunTo.op === 0) {
        sunIcon.current.style.opacity = "0";
        moonIcon.current.style.opacity = "1";
      } else {
        sunIcon.current.style.opacity = "1";
        moonIcon.current.style.opacity = "0";
      }
    }
  }

  function toggleTheme() {
    switch (activeTheme) {
      case "dark": {
        sessionStorage.setItem("theme", "light");
        activeTheme = sessionStorage.getItem("theme");
        applyThemeAnimation(
          { op: 0, rot: "90deg" },
          { op: 1, rot: 0 },
          { op: 1, rot: 0 },
          { op: 0, rot: "-90deg" }
        );
        break;
      }
      case "light":
      default: {
        sessionStorage.setItem("theme", "dark");
        activeTheme = sessionStorage.getItem("theme");
        applyThemeAnimation(
          { op: 1, rot: 0 },
          { op: 0, rot: "90deg" },
          { op: 0, rot: "-90deg" },
          { op: 1, rot: 0 }
        );
        break;
      }
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
        <div className="logo" onClick={() => goHome()}>
          <img src="./dondar.png" />
        </div>
        <ul className="navlist">
          <li title="switch theme">
            <button
              className="theme-toggle-btn"
              ref={themeBtn}
              onClick={() => toggleTheme()}
            >
              <i
                className="fas fa-sun"
                style={{
                  opacity: activeTheme === "light" || !activeTheme ? 1 : 0,
                }}
                ref={sunIcon}
              ></i>
              <i
                className="fas fa-moon"
                style={{ opacity: activeTheme === "dark" ? 1 : 0 }}
                ref={moonIcon}
              ></i>
            </button>
          </li>
          <li title="go home">
            <button className="home-btn" ref={homeBtn} onClick={() => goHome()}>
              <i className="fas fa-home"></i>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
