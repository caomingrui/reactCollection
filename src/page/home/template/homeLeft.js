import React, { useState, useEffect, useReducer, useContext } from 'react';
import { publicState } from '../data/index'
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import {BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import {logicalExpression} from "@babel/types";
import '../css/accordion.sass'

const { Panel } = Collapse;

const AppContext = React.createContext();

const todosReducer = (state, action) => {
    state = action;
    return state
}


export const HomeLeft = (props) => {

    const [todos, dispatch] = useReducer(todosReducer, { id: 0, list: publicState.homeLeft });

    return (
        <div className="home-left">
            <AppContext.Provider value={ dispatch }>
            {
                todos.list.map((res, index) => {
                    return (
                        <Accordion label={ res.tab } num={res.child.length} id={ res.id }
                                   key={ res.id } index={ index } child={ todos } >
                            {
                                res.child.map((da, ind) => {
                                    return (
                                        <p key={ ind } onClick={ () => { props.child.history.push('/404'); }}> { da.label } </p>
                                    )
                                })
                            }
                        </Accordion>
                    )
                })
            }
            </AppContext.Provider>
        </div>
    );
}

const AccordionState = {
    list: {},
    index: 0
}

const setting_down = (state, action) => {
    console.log(action)
    state.index = action.index;
    return state
}

/**
 *  手风琴残缺版
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function Accordion (props) {
    const [boolValue, setBoolValue] = useState(false);
    const [data, dispatch] = useReducer(setting_down, AccordionState);
    const [isShow, setIsShow] = useState( false );

    const dispatchTest = useContext(AppContext);

    useEffect(() => {
        if(boolValue){
            console.log("组件更新 ---- 123")
            // if (props.child.id == props.index) return
            setIsShow( false )
            setBoolValue(false);
        }
        setBoolValue(true);
    })

    const checkNet = () => {
        publicState.homeLeft.map(res => {
            res.state = true;
            if (res.id == props.id) {
                res.state = false;
            }
        })
        dispatchTest({ id: props.id, list: publicState.homeLeft })

        setIsShow( !isShow  );
    }

    return (
        <div className="Accordion"
             style={ props.child.id != props.index?{ height:  10 + 'px'  }: isShow?{ height:  10 + 'px'  }: { height:  (props.num) * 40  + 'px' }}>

            <label htmlFor="" onClick={ checkNet }>{ props.label }</label>
            <div>
                <Accordion.Item>
                    { props.children }
                </Accordion.Item>
            </div>
        </div>
    )
}

Accordion.Item = (props) => {

    return(
        <div className="accordionItem">
            { props.children }
        </div>
    )
}


