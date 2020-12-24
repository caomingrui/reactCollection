import React, { useState, useEffect, useReducer, useContext } from 'react';

export const setStorage = (key, val) => {
    localStorage.setItem(key, val);
}

export const getStorage = (key) => {
    return localStorage.getItem(key);
}
