import React, { Component } from "react";
import ReactMapGL, { Marker, NavigationControl, Popup } from "react-map-gl";
import debounce from "tiny-debounce";
import ReactDOM from "react-dom";
import CityPin from "./CityPin";
import CityInfo from "./CityInfo";

const defaultLocation = {
  latitude: 40.775306,
  longitude: -73.95117
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pitch: 50.0,
        latitude: 40.775306,
        longitude: -73.95117,
        zoom: 11.2
      },
      popupInfo: null
    };
  }

  setViewportSizeState = () => {
    const viewport = { ...this.state.viewport };
    if (this.parentNode) {
      const { width, height } = this.parentNode.getBoundingClientRect();
      viewport.width = width;
      viewport.height = height;
      this.setState({ viewport });
    }
  };

  windowResizeHandler = e => this.setViewportSizeState();

  debouncedWindowResizeHandler = debounce(this.windowResizeHandler, 300);

  componentDidMount() {
    // https://github.com/okonet/react-container-dimensions/blob/master/src/index.js
    // because https://github.com/uber/react-map-gl/issues/135
    // you cannot enter % or vh/vw for uber's react-map-gl viewport.width/height
    this.parentNode = ReactDOM.findDOMNode(this).parentNode;
    this.setViewportSizeState();
    window.addEventListener("resize", this.debouncedWindowResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedWindowResizeHandler);
  }

  updateViewport = viewport => this.setState({ viewport: { ...viewport } });

  // https://github.com/uber/react-map-gl/blob/master/examples/controls/src/app.js
  _renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <CityInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    const { viewport } = this.state;

    return (
      // textAlign: left
      // https://github.com/uber/react-map-gl/issues/326#issuecomment-371185515
      // <div style={{ width: "95%", height: "95%" }}>

      <div>
        <ReactMapGL
          style={{ textAlign: "left" }}
          mapboxApiAccessToken={
            "pk.eyJ1IjoiZGFuY2UyZGllIiwiYSI6ImNqa3Voa254bDk1bjEzcW1sOTFlbjl0eW8ifQ.d72JL668F0_uoLLK1lqhGQ"
          }
          {...viewport}
          onViewportChange={this.updateViewport}
        >
          <div style={{ position: "absolute", right: 0 }}>
            <NavigationControl
              onViewportChange={this.updateViewport}
              showCompass={false}
            />
          </div>
          <Marker
            latitude={defaultLocation.latitude}
            longitude={defaultLocation.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <CityPin
              size={20}
              onClick={() =>
                this.setState(prevState => ({
                  ...prevState,
                  popupInfo: {
                    ...viewport,
                    city: "New York",
                    state: "NY",
                    image:
                      "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg"
                  }
                }))
              }
            />
          </Marker>

          {this._renderPopup()}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
