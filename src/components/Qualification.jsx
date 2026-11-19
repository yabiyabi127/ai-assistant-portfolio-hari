import React, { useEffect, useState } from "react";
import { RepoSlides } from "./RepoSlides.jsx";

export default function Qualification() {
  const [activeTab, setActiveTab] = useState("education");
  return (
    <section className="qualification section">
      <h2 className="section__title">Qualification</h2>
      <span className="section__subtitle">My personal journey</span>
      <div className="qualification__container container">
        <div className="qualification__tabs">
          <div
            className={`qualification__button button--flex ${activeTab === "education" ? "qualification__active" : ""}`}
            data-target="#education"
            onClick={() => setActiveTab("education")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveTab("education");
            }}
          >
            <i className="uil uil-graduation-cap qualification__icon"></i>
            Education
          </div>
          <div
            className={`qualification__button button--flex ${activeTab === "experience" ? "qualification__active" : ""}`}
            data-target="#experience"
            onClick={() => setActiveTab("experience")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setActiveTab("experience");
            }}
          >
            <i className="uil uil-briefcase-alt qualification__icon"></i>
            Experience
          </div>
        </div>
        <div className="qualification__section">
          <div
            className={`qualification__content ${activeTab === "education" ? "qualification__active" : ""}`}
            data-content=""
            id="education"
          >
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Teknik Informatika</h3>
                <span className="qualification__subtitle">
                  Indonesia - SMK ISLAMIYAH
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2014 - 2017
                </div>
              </div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
              <div>
                <h3 className="qualification__title">Frontend Develover</h3>
                <span className="qualification__subtitle">
                  Indonesia - BUILT WITH ANGGA
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2018
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">UI/UX Design</h3>
                <span className="qualification__subtitle">
                  Indonesia - BUILT WITH ANGGA
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2019
                </div>
              </div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
              <div>
                <h3 className="qualification__title">Backend PHP</h3>
                <span className="qualification__subtitle">
                  Indonesia - DICODING
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2019
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Teknik Informatika</h3>
                <span className="qualification__subtitle">
                  Indonesia - Indonesia University of Computer
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2017 - 2021
                </div>
              </div>
              <div>
                <div className="qualification__rounder"></div>
              </div>
            </div>
          </div>

          <div
            className={`qualification__content ${activeTab === "experience" ? "qualification__active" : ""}`}
            data-content=""
            id="experience"
          >
            <div className="qualification__data">
              <div></div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
              <div>
                <h3 className="qualification__title">Front end Engineer</h3>
                <span className="qualification__subtitle">
                  Indonesia - PT Blue Bird Group.{" "}
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2024 - 2025
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Front end Engineer</h3>
                <span className="qualification__subtitle">
                  Indonesia - PT Bank Mandiri (Persero) Tbk.{" "}
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2023 - 2024
                </div>
              </div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
              <div>
                <h3 className="qualification__title">Front end Engineer</h3>
                <span className="qualification__subtitle">
                  Indonesia - PT Bea dan Cukai{" "}
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2022 - 2023
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Front end Develover</h3>
                <span className="qualification__subtitle">
                  Indonesia - LIPI BANDUNG
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2020 - 2021
                </div>
              </div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <div className="qualification__rounder"></div>
                <div className="qualification__line"></div>
              </div>
              <div>
                <h3 className="qualification__title">
                  Freelance as Frontend & UI design
                </h3>
                <span className="qualification__subtitle">
                  Indonesia - UNIKOM
                </span>
                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i>
                  2019 - 2021
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
