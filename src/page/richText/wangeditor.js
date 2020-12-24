import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Form, Modal, Input, Row, Col } from 'antd';
import WangEditors  from 'wangeditor';

export const Editor = () => {

    const [state, setState] = useState({});

    useEffect(() => {
        console.log("组件挂载完成之后执行: 类似componentDidMount")

        const editor = new WangEditors("#editor");
        // editor.customConfig.onchange = html => {
        //     // 传递html editor.txt.html()
        //     onChange(html);// 当编辑器内容改变时
        //     setState( editor.txt.html() )
        // };
        editor.create();
        // 设置初始内容
        editor.txt.html('asdasd');
    }, [])

    return (
        <div id="editor"></div>
    )
}