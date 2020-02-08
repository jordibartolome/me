import React, { Component } from "react";

import { IPublication } from "../types";
import { createDateText } from "../js/utils";

interface IPublicationProps {
  publication: IPublication;
}

export default class Publication extends Component<IPublicationProps, {}> {
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { publication } = this.props;
    window.open(publication.link, "_blank");
  }

  render() {
    const { publication } = this.props;

    return (
      <div className="publication">
        <div className="resumeSectionHeader">
          <p
            className="publicationTitle mediumSizeTitle"
            onClick={this.handleClick}
          >
            {publication.title}
          </p>
          <div className="date">
            {createDateText(publication.date, {
              showMonth: false,
              showEndDate: false
            })}
          </div>
        </div>
        <div className="resumeDescriptionWrapper">
          <p
            className="resumeDescription"
            dangerouslySetInnerHTML={{ __html: publication.where }}
          ></p>
        </div>
      </div>
    );
  }
}
