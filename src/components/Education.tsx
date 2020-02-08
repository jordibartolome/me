import React, { Component } from "react";
import Bullet from "./Bullet";

import { IEducation } from "../types";
import { createDateText } from "../js/utils";
import { createPositionText } from "../js/utils";

interface IEducationProps {
  education: IEducation;
}

export default class Education extends Component<IEducationProps, {}> {
  renderBullets(bullets: string[]) {
    return bullets.map(bullet => <Bullet text={bullet} />);
  }

  render() {
    const { education } = this.props;

    return (
      <div className="education">
        <div className="resumeSectionHeader dimmed">
          {createPositionText(education.title, education.university)}
          <div className="date">
            {createDateText(education.startDate, {
              endDate: education.endDate,
              showMonth: false
            })}
          </div>
        </div>
        <div className="resumeDescriptionWrapper">
          <p
            className="resumeDescription"
            dangerouslySetInnerHTML={{ __html: education.description }}
          ></p>
          {education.bullets && this.renderBullets(education.bullets)}
        </div>
      </div>
    );
  }
}
