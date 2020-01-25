import { DateTime } from "luxon";

export interface IProject {
  name: string;
  logoUrl: string;
  description: string;
  link: string;
  backgroundColor: string;
  letterColor: string;
}

export interface IJob {
  title: string;
  company: string;
  link: string;
  city: string;
  description: string;
  startDate: DateTime;
  endDate?: DateTime;
  bullets: string[];
}

export interface IEducation {
  title: string;
  university: string;
  description: string;
  startDate: DateTime;
  endDate?: DateTime;
  bullets?: string[];
}

export interface ISkillGroup {
  group: string;
  className: string;
  elements: string[];
}

export interface ILanguage {
  language: string;
  level: string;
}

export interface INetwork {
  className: string;
  link: string;
}