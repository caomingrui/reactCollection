import React from 'react';
import { Redirect } from 'react-router-dom'
import { NotFound } from "../page/404/notFound";


const A = React.lazy(() => import('@/test/A'));
// const Ind = React.lazy(() => import('../page/collectPlay/index'));

const Route = React.lazy(() => import('@/page/admin/setUp/route'));
const User = React.lazy(() => import('@/page/admin/setUp/user'));
const Icon = React.lazy(() => import('@/page/admin/setUp/icon'));
const Columns = React.lazy(() => import('@/page/admin/setUp/column'));

const routeList = [
    {
        path: '/setUp', name: 'setUp', auth: true, component: Route, key: '1', icon: 'SettingOutlined', routePath: 'page/admin/setUp/route',
        children: [
            { path: '/setUp/Route', name: 'route', key: '11', auth: true, component: Route, routePath: 'page/admin/setUp/route', icon: 'BarChartOutlined'},
            { path: '/setUp/User', name: 'user', key: '14', auth: true, component: User, routePath: 'page/admin/setUp/user', icon: 'TeamOutlined'},
            { path: '/setUp/Icon', name: 'icon', key: '15', auth: true, component: Icon, routePath: 'page/admin/setUp/icon', icon: 'UserOutlined'},
            { path: '/setUp/Columns', name: 'column', key: '16', auth: true, component: Columns, routePath: 'page/admin/setUp/column', icon: 'UserOutlined'},
            { path: '/User/Bill', name: 'A', key: '12', auth: true, component: A, routePath: 'test/A', icon: 'UserOutlined'},
            { path: '/User/Alex', name: 'B', key: '13', auth: true, component: Route, routePath: 'test/A', icon: 'UserOutlined'}
        ]
    },
    {
        path: '/User', name: 'User', auth: true, component: A, key: '2', routePath: 'test/A', icon: 'UserOutlined',
        children: [
            { path: '/User/Tom', name: 'Tom', key: '21', auth: true, component: A, routePath: 'test/A', icon: 'UserOutlined'},
            { path: '/User/Bill', name: 'Bill', key: '22', auth: true, component: A, routePath: 'test/A', icon: 'UserOutlined'},
            { path: '/User/Alex', name: 'Alex', key: '23', auth: true, component: A, routePath: 'test/A', icon: 'UserOutlined'}
        ]
    },
];

const routeComponent = (list) => {
    list.map((res, ind) => {
        res.component = React.lazy(() => import('@/' + res.routePath));

        if (res.children) {
            routeComponent(res.children);
        }
    })
    return list;
}

const storageData = JSON.parse(localStorage.getItem('adminRoute'))==null?routeList: routeComponent(JSON.parse(localStorage.getItem('adminRoute')));

const adminRoutes = storageData;

export const isState = false;

export default adminRoutes;
