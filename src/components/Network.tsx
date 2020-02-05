import React, { Component } from "react";
import { INetwork } from "../types";

interface INetworkProps {
  network: INetwork;
}

export default class Network extends Component<INetworkProps> {
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { network } = this.props;

    window.open(network.link, "_blank");
  }

  render() {
    const { network } = this.props;

    return (
      <div
        onClick={this.handleClick}
        className="contactMeOption opacityTransition"
      >
        <i className={network.className} />
      </div>
    );
  }
}
