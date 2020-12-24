import React from 'react';
import PropTypes from 'prop-types';
import PublicDatas from "../utils/publicData";
import './publicLeft.sass'

class PublicLeft extends PublicDatas {
    constructor(props) {
        super(props);

        this.list = [{'val': 'haha', 'key': 'cao'}, {'val': 'haha', 'key': 'ming'}, {'val': 'haha', 'key': 'rui'}];
    }

    associat = () => {
        this.props.parent.getHomeMsg(this, '');
    }

    render() {
        return (
            <div className='public-left' onClick={ this.associat }>
                { this.getData('lineData') }
                <div onClick={ () => {this.setData('lineData', '莫挨老子')}}>莫挨老子</div>

                {
                    this.list.map((res => {
                        return (
                            <div onClick={ () => {this.setData('lineData', res.key); let obj = [
                                {'path': '/', 'com': 'Homes', 'cont': ''},
                                {'path': '/test', 'com': 'test', 'cont': ''},
                                {'path': '/Homes', 'com': 'Homes', 'cont': ''}
                            ]
                                this.setData('routeList', obj)
                                console.log(this.getData('routeList'));}} key={res.key}>{ res.val }</div>
                        )
                    }))
                }
            </div>
        )
    }
}

export default PublicLeft