import React from 'react';

let state = {
    name: 'caomingrui',
    age: 20,
    gg: {
        aa: '嘤嘤嘤'
    },
    lineData: '123' // 当前点击值
}

class PublicData extends React.Component {
    constructor(props) {
        super(props);

        this.state = state;
    }

    getData(key) {

        if (Object.prototype.toString.call(key) == "[object String]") {
            return this.state[key];
        }
        else if (Object.prototype.toString.call(key) == "[object Array]") {
            return this.getChildObj(key);
        }
    }

    setData(key, val) {
        if (Object.prototype.toString.call(key) == "[object String]") {
            this.state[key] = val;
        }
        else if (Object.prototype.toString.call(key) == "[object Array]") {
            this.setChildObj(key, val);
        }
    }

    getChildObj(key) {
        let da = key.reduce((and, line) => {
            return and[line]
        }, this.state)
        return da;
    }

    setChildObj(key, val) {
        key.reduce((and, line, ind) => {

            if (ind == key.length - 1) {
                and[line] = val;
                return and
            }
            else {
                return and[line]
            }
        }, this.state)
    }
}

export default PublicData