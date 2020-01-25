import React, { Component } from "react";
import { IProject } from "../types";

interface IProjectCardProps {
  project: IProject;
}

export default class ProjectCard extends Component<IProjectCardProps> {
  render() {
    const { project } = this.props;
    return (
      <div className="project">
        <div
          style={{ backgroundImage: `url(${project.logoUrl})` }}
          className="projectLogo"
        />
        <div className="textWrapper">
          <p className="projectTitle">{project.name}</p>
          <p className="projectDescription">{project.description}</p>
        </div>
      </div>
    );
  }
}
