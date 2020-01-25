import React, { Component } from "react";

import "../styles/reset.css";
import "../styles/base.scss";
import { IJob, IEducation, ISkillGroup, ILanguage } from "../types";
import Job from "./Job";
import Education from "./Education";
import SkillGroup from "./SkillGroup";
import Language from "./Language";

interface IResumeProps {
  jobs: IJob[];
  educations: IEducation[];
  skills: ISkillGroup[];
  languages: ILanguage[];
}

export default class Resume extends Component<IResumeProps, {}> {
  renderJobs() {
    const { jobs } = this.props;
    return jobs.map(job => <Job job={job} />);
  }

  renderEducation() {
    const { educations } = this.props;
    return educations.map(education => <Education education={education} />);
  }

  renderSkills() {
    const { skills } = this.props;
    return skills.map(skillGroup => <SkillGroup skillGroup={skillGroup} />);
  }

  renderLanguages() {
    const { languages } = this.props;
    return languages.map(language => <Language language={language} />);
  }

  render() {
    return (
      <div className="resumeWrapper">
        <div className="resumeHeader">
          <h2>
            <p className="name">Jordi Bartolomé</p>
            <p className="jobTitle">, Software engineer</p>
          </h2>
        </div>
        <div className="resumeSection" id="workExperience">
          <p className="resumeTitle">Experience</p>
          {this.renderJobs()}
        </div>
        <div className="resumeSection" id="education">
          <p className="resumeTitle">Education</p>
          {this.renderEducation()}
        </div>
        <div className="resumeSection" id="education">
          <p className="resumeTitle">Computer Skills</p>
          {this.renderSkills()}
        </div>
        <div className="resumeSection" id="education">
          <p className="resumeTitle">Languages</p>
          {this.renderLanguages()}
        </div>
      </div>
    );
  }
}
