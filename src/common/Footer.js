import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo"></div>

      <div className="footer-inner">
        <ul className="social">
          <li>
            <a
              href="https://twitter.com/LiningSet"
              className="fab fa-twitter twitter"
            ></a>
          </li>
          <li>
            <a
              href="https://github.com/liningset"
              className="fab fa-github github"
            ></a>
          </li>
        </ul>
        <span>developed by liningset</span>
      </div>
    </footer>
  );
}
