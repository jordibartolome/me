import tippy from "tippy.js";
import React, { Component } from "react";
import { ISkillGroup } from "../types";

import "tippy.js/dist/tippy.css";

interface ISkillProps {
  skillGroup: ISkillGroup;
}

export default class SkillGroup extends Component<ISkillProps, {}> {
  componentDidMount() {
    const { skillGroup } = this.props;
    tippy(`#${this.idCreator(skillGroup.id)}`, {
      content: `${skillGroup.group}`
    });
  }

  idCreator(id: string): string {
    return `skill-${id}`;
  }

  render() {
    const { skillGroup } = this.props;

    const skills = skillGroup.elements.map((skill: string, index: number) => {
      return (
        <p key={index} className="skill">
          {skill}
        </p>
      );
    });

    return (
      <div id={this.idCreator(skillGroup.id)} className={skillGroup.className}>
        {skills}
      </div>
    );
  }
}
