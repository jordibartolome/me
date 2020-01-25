import React, { Component } from "react";

interface IBulletProps {
  text: string;
}

export default class Bullet extends Component<IBulletProps> {
  render() {
    const { text } = this.props;

    return (
      <div className="bulletWrapper">
        <p className="bulletSymbol">-</p>
        <p
          className="resumeBullet"
          dangerouslySetInnerHTML={{ __html: text }}
        ></p>
      </div>
    );
  }
}
