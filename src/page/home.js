import React from 'react';
import PropTypes from 'prop-types';
import PublicData from "../test/publicData";
import PublicLeft from "../template/public-left";
import PublicCont from "../template/public-cont/public-cont";
import './home.sass'

class Homes extends React.Component {
    constructor(props) {
        super(props);

    }

    getHomeMsg = (result, msg) => {
        this.setState({
            data: msg
        })
    }

    render() {
        return (
            <div id='home'>
                <PublicLeft parent = { this }></PublicLeft>
                <PublicCont parent = { this }></PublicCont>
            </div>
        )
    }
}

export default Homes