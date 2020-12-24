import React from 'react'
import { Route } from 'react-router-dom'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css';

const FancyRoute = props => {
    React.useState(nprogress.start());

    React.useEffect(() => {
        nprogress.done();
        return () => nprogress.start();
    });

    return (
        <Route {...props} />
    );
};

export default FancyRoute;
