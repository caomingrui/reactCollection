import React, {useState, useEffect, useReducer, useContext, memo} from 'react';

export const Storage = (props) => {

    const getStor = () => {
       return JSON.parse(localStorage.getItem('routeMess'));
    }

    const setStor = (data) => {
        localStorage.setItem('routeMess', JSON.stringify(data));
    }

    const getKeys = () => {
        const [father, child] = getStor();
        return [[String(father.key)], [String(child.key)]];
    }

    const getBreadcrumb = () => {
        const [father, child] = getStor();
        return [father.name, child.name];
    }

    return {
        getStor,
        setStor,
        getKeys,
        getBreadcrumb
    }
}
