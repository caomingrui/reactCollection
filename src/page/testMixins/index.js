import React, { memo } from 'react'
import { useText1 } from '@/utils/mixin/hooks'

export default memo(() => {

    return (
        <>
            <p> 我是实验地 </p>
            <Test1></Test1>
            <Test2></Test2>
            <Test3></Test3>
        </>
    )
});

export const Test1 =  memo(() => {
    const { state, setState, changeDtate  } = useText1();

    return (
        <div> 我是1号实验机 { state?'true': 'false' }
            <p onClick={() => {setState(true)}}>1</p>
            <p onClick={() => {changeDtate(true)}}>2</p>
        </div>
    )
});

export const Test2 =  memo(() => {
    const { state, setState, changeDtate  } = useText1();

    return (
        <div> 我是2号实验机 { state?'true': 'false' }
            <p onClick={() => {setState(true)}}>1</p>
            <p onClick={() => {changeDtate(true)}}>2</p>
        </div>
    )
});


export const Test3 =  memo(() => {
    const { state, setState, changeDtate  } = useText1;

    return (
        <p> 我是2号实验机 { state?'true': 'false' }</p>
    )
});
