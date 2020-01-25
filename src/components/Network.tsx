import React, { Component } from "react";
import { INetwork } from "../types";

interface INetworkProps {
  network: INetwork;
}

export default class Network extends Component<INetworkProps> {
  render() {
    const { network } = this.props;

    return (
      <div
        className="contactMeOption opacityTransition"
        data-bind="event: {click: redirect}"
      >
        <i className={network.className} />
      </div>
    );
  }
}
