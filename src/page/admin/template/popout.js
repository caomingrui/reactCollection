import React, {useState, useEffect, useReducer, useContext, memo} from 'react';
import { Modal, Button } from 'antd';

// this 弹框
export default memo((props) => {
    const [ok, Cancel] = props.popoutBut;

    const handleOk = () => {
        ok();
    };

    const handleCancel = () => {
        props.popout[1](false);
    };

    return (
        <>
            <Modal title="Basic Modal" visible={props.popout[0]} width={props.width} onOk={handleOk} onCancel={handleCancel}>
                { props.children }
            </Modal>
        </>
    );
});
