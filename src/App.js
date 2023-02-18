import React, { useEffect } from "react";
import Home from "./Home";
import gsap from "gsap";

export default function App() {
  useEffect(() => {
    try {
      gsap
        .timeline({ defaults: { duration: 0.5 } })
        .fromTo(
          "#root > .wrapper",
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0 }
        )
        .fromTo(
          "#root > section",
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0 },
          "-=0.5"
        )
        .fromTo(
          "#root > header",
          { opacity: 0, y: "-100%" },
          { opacity: 1, y: 0 },
          "-=0.25"
        )
        .fromTo(
          "#root > footer",
          { opacity: 0, y: "100%" },
          { opacity: 1, y: 0 },
          "-=0.5"
        );
    } catch {
      document
        .querySelectorAll("#root > *")
        .forEach(el => (el.style.opacity = "1"));
    }
  });

  return <Home />;
}
