import gsap from "gsap";

export default function Button({ classN, text, clickEvent }) {
  return (
    <button
      className={`button ${classN}`}
      onClick={(e) => {
        try {
          gsap
            .timeline({ defaults: { duration: 0.5 } })
            .to(".home-wrapper", { y: -50, opacity: 0 })
            .to("header", { opacity: 0, y: "-100%" }, "-=0.25")
            .to("footer", { opacity: 0, y: "100%" }, "-=0.5");
        } catch {
          document
            .querySelectorAll("#root > *")
            .forEach((el) => (el.style.opacity = "1"));
        }

        setTimeout(() => {
          sessionStorage.setItem("service", classN);
          clickEvent(sessionStorage.getItem("service"));
          e.target.setAttribute("data-load", sessionStorage.getItem("service"));

          window.scrollTo(0, 0);
        }, 800);
      }}
    >
      {text}
    </button>
  );
}
