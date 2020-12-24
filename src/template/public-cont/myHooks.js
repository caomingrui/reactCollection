import React, { useState , useContext, useReducer, useEffect } from 'react';
import axios from 'axios'

/**
 * 函数组件自动调用请求钩子
 * useEffect - 引用副作用操作 如发送请求
 *
 * @param num
 * @param url
 * @return {[boolean, undefined]}
 */
export const useRequestHooks = (num, url) => {
    const [state, setState] = useState(true);
    const [da, setDa] = useState();

    useEffect( () => {
        axios.get(url)
            .then(res => {
                console.log(res);
                setState(false);
                setDa(res.data)
            })
    }, [num]);

    return [state, da];
}

const requestS = (state, action) => {
    // return new Promise(resolve => {
        axios.get(action)
            .then(res => {
                // resolve(res.data)
                console.log('------  ---------');
                state = res.data;
                console.log(res.data)
                return state;
            })

        return 123;
    // })
}

export const useClickRequest = (url) => {
    const [da, setDa] = useState('');
    const [state, dispatch] = useReducer(requestS, url);
    console.log(state)
    // console.log(da)
    return [dispatch, state];
}


export const publicState = {
    name: 0,
    test: ''
}

export const reducer = (state, action) => {
    // switch (action.type) {
    //     case 'name':
    //         return { ...state, name: state.name + 1 };
    //     case 'age':
    //         return '404'
    // }
    console.log('--------- 我被触发了 ----------')
    console.log(action.data)
    console.log('--------- 我被触发了 ----------')
    return { ...state, name: state.name = action.data  }
}


export const initState = false;
export const initReducer = (state, action) => {
    if (action.type == 'a') {
        return state = !state
    }
    else if (action.type == 'b') {
        return state + 1;
    }
    else if (action.type == 'c') {
        return state - 1;
    }
}


export const requestAllTest = (url) => {
        return axios({
            url: url,
            method: 'get',
        })
}


    class Observer {
        listeners = new Map()
        triggerQuene = new Map()
        setTrigger(channel, fun) {

        }
        trigger(channel, e = null) {

        }
    }
export const observer = new Observer()


//然后自定义一个hook，来等待其他组件通过observer.trigger函数更新数据


export function useBind(event, init, trans = (e) => e) {
    const [value, setValue] = useState(init)

    useEffect(() => {
        observer.setTrigger(event, e => {
            setValue(trans(e))
        })
        return () => {
            observer.removeTrigger(event)
        }
    }, [])
    return value;
}