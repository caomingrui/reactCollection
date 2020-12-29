const colorData = {
    // 头部logo 区域
    navLeftColor: '#8f92d7',

    // 侧边栏整体颜色
    sidebarColor: '#001529',

    // 侧边栏展开颜色
    sidebarAnColor: '#000c17',

    // 选中侧边栏颜色
    checkBarColor: '#1890ff',

    // 头部区域颜色
    navColor: '#ffffff',

    // 面包屑区域颜色
    breadCrumbsColor: '#ffffff',

    // 主体内容区域颜色
    contentColor: '#f0f2f5'
};


// 末尾追加最高级别
const addLevel = () => {
    // Object.keys(colorData).map(res => {
    //     colorData[res] += ' !important';
    // });
    let color = JSON.parse(localStorage.getItem('colorData'))==null?colorData: JSON.parse(localStorage.getItem('colorData'));

    return color;
}

export default addLevel();
