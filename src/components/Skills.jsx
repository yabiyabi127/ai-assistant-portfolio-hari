import React, { useState } from "react";

export default function Skills() {
  const [openSkills, setOpenSkills] = useState(0);
  return (
    <section className="skills section" id="skills">
      <h2 className="section__title">Skills</h2>
      <span className="section__subtitle">My technical level</span>
      <div className="skills__container container grid">
        <div>
          <div
            className={`skills__content ${openSkills === 0 ? "skills__open" : "skills__close"}`}
          >
            <div
              className="skills__header"
              aria-expanded={openSkills === 0}
              onClick={() =>
                setOpenSkills((current) => (current === 0 ? -1 : 0))
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenSkills((current) => (current === 0 ? -1 : 0));
                }
              }}
            >
              <i className="uil uil-brackets-curly skills__icon"></i>
              <div>
                <h1 className="skills__title">Front end Developer</h1>
                <span className="skills__subtitle">More than 4 Years</span>
              </div>
              <i className="uil uil-angle-down skills__arrow"></i>
            </div>
            <div className="skills__list grid">
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">HTML</h3>
                  <span className="skills__number">82%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__html"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">CSS</h3>
                  <span className="skills__number">85%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__css"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">JavaScript</h3>
                  <span className="skills__number">70%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__js"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">React Js</h3>
                  <span className="skills__number">81%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__react"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Angular Framework Js</h3>
                  <span className="skills__number">81%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__react"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Vue Js</h3>
                  <span className="skills__number">81%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__react"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Git</h3>
                  <span className="skills__number">89%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__git"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Sass CSS</h3>
                  <span className="skills__number">82%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__sass"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Bootstrap</h3>
                  <span className="skills__number">84%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__bootstrap"></span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`skills__content ${openSkills === 1 ? "skills__open" : "skills__close"}`}
          >
            <div
              className="skills__header"
              aria-expanded={openSkills === 1}
              onClick={() =>
                setOpenSkills((current) => (current === 1 ? -1 : 1))
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenSkills((current) => (current === 1 ? -1 : 1));
                }
              }}
            >
              <i className="uil uil-server-network-alt skills__icon"></i>
              <div>
                <h1 className="skills__title">Back end Developer</h1>
                <span className="skills__subtitle">More than 2 Years</span>
              </div>
              <i className="uil uil-angle-down skills__arrow"></i>
            </div>
            <div className="skills__list grid">
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">ASP.NET Core</h3>
                  <span className="skills__number">84%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__php"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Laravel</h3>
                  <span className="skills__number">84%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__php"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Codeigneter</h3>
                  <span className="skills__number">80%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__ci"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">My SQL</h3>
                  <span className="skills__number">70%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__sql"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">SQL Server</h3>
                  <span className="skills__number">70%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__mongo"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Node Js</h3>
                  <span className="skills__number">72%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__node"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Express Js</h3>
                  <span className="skills__number">74%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__express"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`skills__content ${openSkills === 2 ? "skills__open" : "skills__close"}`}
          >
            <div
              className="skills__header"
              aria-expanded={openSkills === 2}
              onClick={() =>
                setOpenSkills((current) => (current === 2 ? -1 : 2))
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenSkills((current) => (current === 2 ? -1 : 2));
                }
              }}
            >
              <i className="uil uil-icons skills__icon"></i>
              <div>
                <h1 className="skills__title">Designer</h1>
                <span className="skills__subtitle">More than 1 Years</span>
              </div>
              <i className="uil uil-angle-down skills__arrow"></i>
            </div>
            <div className="skills__list grid">
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Figma</h3>
                  <span className="skills__number">89%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__figma"></span>
                </div>
              </div>
              <div className="skills__data">
                <div className="skills__titles">
                  <h3 className="skills__name">Adobe XD</h3>
                  <span className="skills__number">84%</span>
                </div>
                <div className="skills__bar">
                  <span className="skills__percentage skills__xd"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
