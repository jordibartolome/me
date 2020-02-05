import React, { Component } from "react";
import { ISkillGroup } from "../types";

interface ISkillProps {
  skillGroup: ISkillGroup;
}

export default class SkillGroup extends Component<ISkillProps, {}> {
  render() {
    const { skillGroup } = this.props;

    const skills = skillGroup.elements.map((skill: string, index: number) => {
      return (
        <p key={index} className="skill">
          {skill}
        </p>
      );
    });

    return <div className={skillGroup.className}>{skills}</div>;
  }
}
