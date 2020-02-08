import React, { Component } from "react";

import { ICourse } from "../types";
import { createDateText } from "../js/utils";

interface IcourseProps {
  course: ICourse;
}

export default class Course extends Component<IcourseProps> {
  render() {
    const { course } = this.props;

    return (
      <div className="course">
        <div className="resumeSectionHeader mediumSizeTitle">
          <span>{course.title}</span> -{" "}
          <span className="coursePlace">{course.where}</span>
          <div className="date">
            {createDateText(course.date, {
              showMonth: false,
              showEndDate: false
            })}
          </div>
        </div>
      </div>
    );
  }
}
