import React, { Component } from "react";
import { IJob } from "../types";
import Bullet from "./Bullet";
import { createDateText, createPositionText } from "../js/utils";

interface IJobProps {
  job: IJob;
}

export default class Job extends Component<IJobProps, {}> {
  renderBullets(bullets: string[]) {
    return bullets.map((bullet, index) => <Bullet key={index} text={bullet} />);
  }

  renderDate() {}

  render() {
    const { job } = this.props;

    return (
      <div className="job">
        <div className="resumeSectionHeader dimmed">
          {createPositionText(job.title, job.company, job.city)}

          <div className="date">
            {createDateText(job.startDate, { endDate: job.endDate })}
          </div>
        </div>
        <div className="resumeDescriptionWrapper">
          <p
            className="resumeDescription"
            dangerouslySetInnerHTML={{ __html: job.description }}
          ></p>
          {this.renderBullets(job.bullets)}
        </div>
      </div>
    );
  }
}
