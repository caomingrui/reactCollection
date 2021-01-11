import React from 'react';
import { Redirect } from 'react-router-dom'
import { NotFound } from "../page/404/notFound";

const A = React.lazy(() => import('@/test/A'));
// const Ind = React.lazy(() => import('../page/collectPlay/index'));

const Ind = React.lazy(async () => {
    const { Ind } = await import("@/page/collectPlay/index");
    return { default: Ind.default || Ind };
});

const Test = React.lazy(async () => {
    const Test = await import("@/page/testMixins/index");
    return { default: Test.default || Test };
});

const Admin = React.lazy(() => import('@/page/admin/index'));

const Three = React.lazy(() => import('@/page/threeStudy/index'));
const ANI = React.lazy(() => import('@/page/threeStudy/test/game'));

const routes = [
    {
        path: '/A', auth: true, component: ANI
    },
    { path: '/', exact: true, auth: true, render: () => <Redirect to="/NotFound" /> },
    {
        path: '/col', auth: true, component: Ind
    },
    {
        path: '/test', auth: true, component: Test
    },
    {
        path: '/admin', auth: true, component: Admin
    },
    {
        path: '/three', auth: true, component: Three
    },
    { path: '/*' ,component: NotFound }
];

export const isState = false;

export default routes;
