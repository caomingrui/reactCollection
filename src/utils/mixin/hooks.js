import React, { useState, useEffect, useReducer, useContext } from 'react';

// 生命周期状态
export const useText1 = () => {
    const [state, setState] = useState(false);
    const changeDtate = (boo) => {
        setState(boo);
    }

    return {
        state,
        setState,
        changeDtate
    }
}

export const useArrOperate = () => {

    // 删除处理
    const deleteArr = (arr, ind) => {
        let list = JSON.parse(JSON.stringify(arr));

        function eachArr (arr) {
            arr.map((res, index) => {
                if (res.key==ind) {
                    arr.splice(index, index+1);
                }
                else {
                    if (res.children) {
                        eachArr(res.children);
                    }
                }
            });
            return arr;
        }
        let lists = eachArr(list);
        return compConvert(lists);
    };

    // component 转化
    const compConvert = (list) => {
        const arr = [...list];
        arr.map((item, ind) => {
            item.component = React.lazy(() => import('@/'+ item.routePath));
            if (item.children) {
                compConvert(item.children);
            }
        });
        return arr;
    }

    return {
        deleteArr
    }
}

