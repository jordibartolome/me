import React, { Component } from "react";
import { ISection } from "../types";

const SECTIONS: ISection[] = [
  {
    text: "Home",
    selector: "#home",
    position: 0
  },
  {
    text: "Projects",
    selector: "#projects",
    position: 0
  },
  {
    text: "Resume",
    selector: "#resume",
    position: 0
  },
  {
    text: "Hobbies",
    selector: "#hobbies",
    position: 0
  },
  {
    text: "Contact",
    selector: "#contact",
    position: 0
  }
];

const NAV_BAR_HEIGHT = 40;

interface INavBarState {
  top: boolean;
  selectedElement: number;
}

export default class NavBar extends Component<{}, INavBarState> {
  constructor(props: any) {
    super(props);

    this.state = {
      top: true,
      selectedElement: 0
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.calculatePositions = this.calculatePositions.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);

    this.calculatePositions();
  }

  calculatePositions() {
    const app: HTMLElement = document.querySelector("#app") as HTMLElement;
    // Check if app is present
    if (!app) {
      setTimeout(this.calculatePositions, 10);
    } else {
      for (let i = 0; i < SECTIONS.length; i++) {
        const section = SECTIONS[i];
        const element: HTMLElement = document.querySelector(
          section.selector
        ) as HTMLElement;

        section.position = element.offsetTop;
      }
    }
  }

  handleResize() {
    this.calculatePositions();
  }

  handleScroll() {
    const selected = this.calculateCurrentSelected();
    const selectedElement = SECTIONS.indexOf(selected);
    const currentY = window.scrollY;
    this.setState({
      top: currentY === 0,
      selectedElement
    });
  }

  handleClick(section: ISection) {
    window.scroll(0, section.position - NAV_BAR_HEIGHT);
  }

  calculateCurrentSelected(): ISection {
    const currentY = window.scrollY;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const section = SECTIONS[i];
      if (section.position - NAV_BAR_HEIGHT <= currentY) {
        return section;
      }
    }

    return SECTIONS[0];
  }

  renderElements() {
    const { selectedElement } = this.state;

    return SECTIONS.map((section: ISection, index: number) => {
      return (
        <div
          key={index}
          className={`navItem ${index === selectedElement ? "selected" : ""}`}
          onClick={() => {
            this.handleClick(section);
          }}
        >
          {section.text}
        </div>
      );
    });
  }

  render() {
    const { top } = this.state;

    return (
      <div id="navBar" className={`navBar ${top ? "top" : ""}`}>
        {this.renderElements()}
      </div>
    );
  }
}
