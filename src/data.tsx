import { DateTime } from "luxon";
import {
  IProject,
  IJob,
  ISkillGroup,
  INetwork,
  ILanguage,
  IPublication
} from "./types";

const DATE_FORMAT = "dd-MM-yyyy";
export const RESUME_LINK =
  "https://docs.google.com/document/d/16Fkdy_C7LjiDxMtol0pBb7x8EW2xeLKpwzO7CcCRt3k/edit#heading=h.nrl5r7tqva24";

export const PROJECTS: IProject[] = [
  {
    name: "Amazon Web Services",
    logoUrl: "/images/aws.png",
    description: "AWS Detective, a new cybersecurity service.",
    link: "https://www.aws.com/detective"
  },
  {
    name: "Noteflight",
    logoUrl: "/images/noteflight.png",
    description:
      "The future of online music notation. An online music notation editor to create, transcribe and play classical music.",
    link: "http://www.noteflight.com"
  },
  {
    name: "Whatameal",
    logoUrl: "/images/whatameal.png",
    description: "Share and create recipes online.",
    link: "https://www.whatameal.com"
  },
  {
    name: "Volotea",
    logoUrl: "/images/volotea.png",
    description: "A new European airline. ",
    link: "https://www.volotea.com/en"
  },
  {
    name: "jordibartolome.me",
    logoUrl: "/images/jordibartolome.png",
    description: "This site! Feel free to fork it on github.",
    link: "/"
  },
  {
    name: "music21",
    logoUrl: "/images/music21.png",
    description:
      "A python based toolkit for computed-aided musicology. It has never been easier to analyze music.",
    link: "http://web.mit.edu/music21/"
  }
];

export const JOBS: IJob[] = [
  {
    title: "Front End Engineer",
    company: "Amazon Web Services",
    link: "https://www.aws.com",
    city: "Cambridge, MA, United States",
    startDate: DateTime.fromFormat("22-07-2019", DATE_FORMAT),
    description:
      "Worked on the development and release of <a href='https://www.aws.com' class='regularLink' target='_blank'>AWS Detective</a>, a new AWS cybersecurity service. ",
    bullets: [
      // "Optimization of the heavy Javascript Noteflight Editor, improving loading and editing algorithms. ",
      // "Implemented React/Redux.",
      // "Development of a real time audio transcription using Machine Learning with BrainJS.",
      // "Built a whole new commerce system."
    ]
  },
  {
    title: "Principal Software Engineer",
    company: "Noteflight",
    link: "https://www.noteflight.com",
    city: "Somerville, MA, United States",
    startDate: DateTime.fromFormat("04-11-2013", DATE_FORMAT),
    endDate: DateTime.fromFormat("19-07-2019", DATE_FORMAT),
    description:
      "<a href='http://www.noteflight.com' class='regularLink' target='_blank'>Noteflight</a> is a heavy Javascript app to write musical scores online. Worked on the full scope of Noteflight's software stack, from the frontend to the backend. Led and mentored a team of developers and worked on the design and prioritization of the projects.",
    bullets: [
      "Optimization of the heavy Javascript Noteflight Editor, improving loading and editing algorithms. ",
      "Implemented React/Redux.",
      "Development of a real time audio transcription using Machine Learning with BrainJS.",
      "Built a whole new commerce system."
    ]
  },
  {
    title: "Web consultant",
    company: "Newshore",
    link: "http://www.newshore.es",
    city: "Barcelona, Catalonia",
    startDate: DateTime.fromFormat("04-05-2012", DATE_FORMAT),
    endDate: DateTime.fromFormat("28-10-2013", DATE_FORMAT),
    description:
      "Development of <a href='http://www.volotea.com' class='regularLink' target='_blank'>Volotea</a>. A new European airline. Umbraco, .NET, Javascript and CSS.",
    bullets: [
      "Designed part of the architecture of the Content Management System (CMS) and optimized the performance of the web.",
      "Also designed different windows services and web services related to the website."
    ]
  },
  {
    title: "Consultant",
    company: "Better Consultants",
    link: "http://www.betterconsultants.es",
    city: "Barcelona, Catalonia",
    startDate: DateTime.fromFormat("04-10-2011", DATE_FORMAT),
    endDate: DateTime.fromFormat("02-05-2012", DATE_FORMAT),
    description:
      "Development of software for the national police. Visual Basic, Cobol and SQL.",
    bullets: [
      "Software analyzer and developer of Business Intelligence applications for the national police department."
    ]
  },
  {
    title: "Researcher",
    company: "Massachusetts Institute of Technology",
    link: "http://web.mit.edu/music21/",
    city: "Cambridge, MA, United States",
    startDate: DateTime.fromFormat("01-06-2011", DATE_FORMAT),
    endDate: DateTime.fromFormat("12-09-2011", DATE_FORMAT),
    description:
      "Development of <a href='http://web.mit.edu/music21/' class='regularLink' target='_blank'>music21</a>. Developed in Python.",
    bullets: [
      "Participated in the “music21” project, a set of tools for helping scholars and other active listeners answer questions about music quickly and simply.",
      "Developed a software that detects, in real time, through audio and signal processing techniques, the note that a musician plays and shows the score properly. Advisor: Dr. Michael Scott Cuthbert.",
      "The results of this project were published in 'New applications to Score Following and feature extraction beyond MIDI', by J. Bartolomé and M.S. Cuthbert (NIPS 2011 – Music and Machine Learning Workshop. December 2011, Granada, Spain)",
      "Example of some developed applications <a class='regularLink' href='http://www.youtube.com/watch?v=h48hSl6syyw' target='_blank'>here</a>."
    ]
  }
];

export const EDUCATIONS = [
  {
    title: "Telecommunications Engineering - BSc and MSc",
    university: "Polytechnic University of Catalonia",
    startDate: DateTime.fromFormat("12-09-2005", DATE_FORMAT),
    endDate: DateTime.fromFormat("28-06-2011", DATE_FORMAT),
    description:
      "Relevant coursework: Programming, Signal Processing, Telematics, Mathematics, Physics and Electronics."
  },
  {
    title: "Master thesis",
    university: "Pompeu Fabra University",
    startDate: DateTime.fromFormat("01-01-2011", DATE_FORMAT),
    endDate: DateTime.fromFormat("28-06-2011", DATE_FORMAT),
    description:
      "Development of Master’s Thesis titled: 'Alignment of the recording of a violin performance with the corresponding musical score', consisting on the development of a software to process the audio signal and the movement of the bow, in order to find the notes played by a violinist. Advisor: Dr. Xavier Serra."
  },
  {
    title: "Music - violin",
    university: "Conservatori Municipal de Barcelona",
    startDate: DateTime.fromFormat("01-09-1999", DATE_FORMAT),
    endDate: DateTime.fromFormat("28-06-2006", DATE_FORMAT),
    description: "Violin, harmony, orchestra... lots of years, lots of things!"
  }
];

export const SKILLS: ISkillGroup[] = [
  {
    group: "Javascript Technologies",
    className: "jsTechnologies skillsGroupWrapper",
    elements: [
      "Javascript ES6",
      "React/Redux",
      "Knockout",
      "Web audio API",
      "BrainJS"
    ]
  },
  {
    group: "Web Technologies",
    className: "webTechnologies skillsGroupWrapper",
    elements: [
      "HTML5",
      "Webpack",
      "CSS",
      "ElasticSearch",
      "AWS",
      "Web Services"
    ]
  },
  {
    group: "Programming Languages",
    className: "programmingLanguages skillsGroupWrapper",
    elements: ["Ruby on Rails", "Python", "Django", "Java", "C#"]
  },
  {
    group: "Others",
    className: "others skillsGroupWrapper",
    elements: ["Git", "SEO"]
  }
];

export const LANGUAGES: ILanguage[] = [
  {
    language: "Catalan",
    level: "Native"
  },
  {
    language: "Spanish",
    level: "Native"
  },
  {
    language: "English",
    level: "Proficiency"
  }
];

export const PUBLICATIONS: IPublication[] = [
  {
    title:
      "Symbolic Music Information Retrieval with music21: New Applications to Score Following and Feature Extraction Beyond MIDI.",
    where: "NIPS'11 - Music Machine Learning",
    date: DateTime.fromFormat("16-12-2011", DATE_FORMAT),
    link:
      "https://web.mit.edu/music21/papers/Bartolome-Guillen_Cuthbert_ScoreFollower.pdf"
  }
];

export const NETWORKS: INetwork[] = [
  {
    className: "fa fa-fw fa-at",
    link: "mailto:jordi.bartolome.guillen@gmail.com"
  },
  {
    className: "fa fa-fw fa-linkedin",
    link:
      "https://www.linkedin.com/pub/jordi-bartolom%C3%A9-guill%C3%A9n/35/667/533"
  },
  {
    className: "fa fa-fw fa-github",
    link: "https://github.com/jordibartolome"
  },
  // {
  // 	className: "fa fa-fw fa-twitter",
  // 	link: "https://www.twitter.com/jordibartolome"
  // },
  {
    className: "fa fa-fw fa-youtube",
    link: "https://www.youtube.com/user/tubasu"
  }
  // {
  // 	className: "fa fa-fw fa-google-plus",
  // 	link: "https://plus.google.com/+JordiBartolom%C3%A9Guill%C3%A9n/posts"
  // }
];
