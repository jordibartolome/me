import React, { Component } from "react";
import { IProject } from "../types";

interface IProjectCardProps {
  project: IProject;
}

export default class ProjectCard extends Component<IProjectCardProps> {
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { project } = this.props;
    window.open(project.link, "_blank");
  }

  render() {
    const { project } = this.props;
    return (
      <div className="project" onClick={this.handleClick}>
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
