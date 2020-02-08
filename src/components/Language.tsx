import React, { Component } from "react";
import { ILanguage } from "../types";

interface ILanguageProps {
  language: ILanguage;
}

export default class Language extends Component<ILanguageProps> {
  render() {
    const { language } = this.props;

    return (
      <div className="languages">
        <div className="resumeSectionHeader mediumSizeTitle">
          <span className="important">{language.language}</span>:{" "}
          {language.level}
        </div>
      </div>
    );
  }
}
