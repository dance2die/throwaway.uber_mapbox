import React, { PureComponent } from "react";

// https://github.com/uber/react-map-gl/blob/master/examples/controls/src/city-info.js
export default class CityInfo extends PureComponent {
  render() {
    const { info } = this.props;
    const displayName = `${info.city}, ${info.state}`;

    return (
      <div>
        <div>
          {displayName} |{" "}
          <a
            target="_new"
            href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}
          >
            Wikipedia
          </a>
        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}
