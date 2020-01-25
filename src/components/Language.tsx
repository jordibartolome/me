import React, { Component } from "react";
import { ILanguage } from "../types";

interface ILanguageProps {
  language: ILanguage;
}

export default class Language extends Component<ILanguageProps> {
  render() {
    const { language } = this.props;

    return (
      <div className="education">
        <div className="resumeSectionHeader">
          <span className="important">{language.language}</span>:{" "}
          {language.level}
        </div>
      </div>
    );
  }
}
