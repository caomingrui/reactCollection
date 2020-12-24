import React from 'react';

export let states = {
    name: 'caomingrui',
    age: 20,
    gg: {
        aa: '嘤嘤嘤'
    },
    lineData: '123', // 当前点击值
    abc: '',
    routeList: [
        // {'path': '/', 'com': 'Homes', 'cont': ''},
        // {'path': '/test', 'com': 'test', 'cont': ''},
        // {'path': '/Homes', 'com': 'Homes', 'cont': ''},
        // {'path': '/App', 'com': 'App', 'cont': ''},
    ],
    testRouteInter: true, // 测试路由拦截
}

class PublicDatas extends React.Component {
    constructor(props) {
        super(props);

        this.states = states;
        console.log('开始1')
    }

    componentWillMount() {
        console.log('开始2')
    }

    componentDidMount() {
        console.log('开始3')
    }

    componentWillUnmount() {
        console.log('结束')
    }

    getData(key) {

        if (Object.prototype.toString.call(key) == "[object String]") {
            return this.states[key];
        }
        else if (Object.prototype.toString.call(key) == "[object Array]") {
            return this.getChildObj(key);
        }
    }

    setData(key, val) {
        if (Object.prototype.toString.call(key) == "[object String]") {
            this.states[key] = val;
            console.log(this.states[key])
        }
        else if (Object.prototype.toString.call(key) == "[object Array]") {
            this.setChildObj(key, val);
        }

        this.setState({
            states: this.states
        })
    }

    getChildObj(key) {
        let da = key.reduce((and, line) => {
            return and[line]
        }, this.states)

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
        }, this.states)
    }
}

export default PublicDatas