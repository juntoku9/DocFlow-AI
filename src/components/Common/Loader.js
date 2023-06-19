import React from 'react';

const Loader = (props) => (
    <div className="loader">
        <div className="spinner-border text-success" role="status">
            <span className="sr-only">{props.message}</span>
        </div>
    </div>
);

Loader.defaultProps = {
    message: 'Loading...'
}

export default Loader;