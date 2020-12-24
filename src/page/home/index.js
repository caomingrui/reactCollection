import React, { useState, useEffect, useReducer, useContext } from 'react';
import { HomeRight } from './template/homeRight'
import { HomeLeft } from './template/homeLeft'
import { HomeTop } from './template/homeTop'
import './css/homeTem.sass'

export const Home = (props) => {

    return (
        <div className="home">
            <HomeTop></HomeTop>
            <div className="home-main">
                <div className="home-cont-left">
                    <HomeLeft child={ props }></HomeLeft>
                </div>
                <div className="home-cont-right">
                    <HomeRight></HomeRight>
                </div>
            </div>
        </div>
    );
}
