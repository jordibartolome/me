import React, { Component } from "react";
import {
  PROJECTS,
  JOBS,
  EDUCATIONS,
  SKILLS,
  LANGUAGES,
  NETWORKS
} from "../data";
import ProjectCard from "./ProjectCard";
import Resume from "./Resume";
import Network from "./Network";

import "../styles/reset.css";
import "../styles/base.scss";
import "../styles/font-awesome.min.css";

export default class App extends Component {
  renderProjects() {
    const projectsJsx: JSX.Element[] = PROJECTS.map(project => (
      <ProjectCard project={project} />
    ));

    return (
      <div className="section" id="projects">
        <div className="sectionTitleWrapper">
          <h3 className="sectionTitle">Some of the projects I worked on</h3>
        </div>
        <div className="projects">{projectsJsx}</div>
      </div>
    );
  }

  renderResume() {
    return (
      <div className="section" id="resume">
        <div className="sectionTitleWrapper">
          <h3 className="sectionTitle">Resume</h3>
        </div>
        <Resume
          jobs={JOBS}
          educations={EDUCATIONS}
          skills={SKILLS}
          languages={LANGUAGES}
        />
      </div>
    );
  }

  renderHobbies() {
    return (
      <div className="section" id="hobbies">
        <div className="sectionTitleWrapper">
          <h3 className="sectionTitle">Hobbies</h3>
        </div>
        <iframe
          width="560"
          height="315"
          src="//www.youtube.com/embed/mYQ-U8lCtRI"
        ></iframe>
        <iframe
          width="560"
          height="315"
          src="//www.youtube.com/embed/f_6TG91ma7E"
        ></iframe>
      </div>
    );
  }

  renderNetworks() {
    const networksJsx: JSX.Element[] = NETWORKS.map(network => (
      <Network network={network} />
    ));

    return (
      <div className="section" id="contact">
        <div className="sectionTitleWrapper">
          <h3 className="sectionTitle">Contact me</h3>
        </div>
        <div className="contactMeOptions">{networksJsx}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrap">
        <div id="homeCover"></div>
        <div className="section" id="home"></div>

        <div className="homeWrapper">
          <h1 id="name">Jordi Bartolomé</h1>
          <h2 id="jobTitle">Software developer</h2>
          <i className="fa fa-fw fa-arrow-down" id="arrowDown"></i>
        </div>

        {this.renderProjects()}
        {this.renderResume()}
        {this.renderHobbies()}
        {this.renderNetworks()}

        <div className="footer">
          <span>
            The project is Open Source (MIT License), so feel free to fork it or
            get any inspiration in{" "}
            <a
              className="regularLink"
              href="https://github.com/jordibartolome/me"
              target="_blank"
            >
              Github
            </a>
          </span>
        </div>
      </div>
    );
  }
}
