import React, { useEffect, useState } from "react";
import { RepoSlides } from "./RepoSlides.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bg">
        <div className="footer__container container grid">
          <div>
            <h1 className="footer__title">Hari</h1>
            <span className="footer__subtitle">Frontend Developer</span>
          </div>
          <ul className="footer__links">
            <li>
              <a href="#services" className="footer__link">
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="footer__link">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#contact" className="footer__link">
                Contactme
              </a>
            </li>
          </ul>
          <div className="footer__socials">
            <a
              href="https://www.facebook.com/yabiyabi127"
              className="footer__social"
            >
              <i className="uil uil-facebook-f"></i>
            </a>
            <a
              href="https://wa.me/6282118301993?text=Hallo%20Harii,%20saya%20tertarik%20dengan%20CV%20Anda"
              className="footer__social"
            >
              <i className="uil uil-whatsapp"></i>
            </a>
            <a
              href="https://www.instagram.com/yabiyabi127/"
              className="footer__social"
            >
              <i className="uil uil-instagram"></i>
            </a>
          </div>
        </div>
        <p className="footer__copy">© Hari kurniawan. All right reserved</p>
      </div>
    </footer>
  );
}
