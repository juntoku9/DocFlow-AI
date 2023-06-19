import 'mapbox-gl/dist/mapbox-gl.css';

import classNames from 'classnames';
import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

function Map({ className, options, ...props }) {
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29vZHRoZW1lcyIsImEiOiJjanU5eHR4N2cybDU5NGVwOHZwNGprb3E0In0.msdw9q16dh8v4azJXUdiXg';
  const MAP_STYLES = 'mapbox://styles/mapbox/light-v9';

  const classes = classNames('ratio ratio-21x9 overflow-hidden', className);

  return (
    <div className={classes} {...props}>
      <ReactMapGL
        width="100%"
        height="100%"
        style={{ position: 'absolute' }}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLES}
        {...options}
      />
    </div>
  );
}

export default Map;
