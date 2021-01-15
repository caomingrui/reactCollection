import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import bj from "../src/img/bg_0.jpg";
import pic1 from "../src/img/card1_thing_0.png";
import card1_thing_0 from "../src/img/card1_thing_0.png";
import card1_thing_1 from "../src/img/card1_thing_1.png";
import card1_thing_2 from "../src/img/card1_thing_2.png";
import card1_thing_3 from "../src/img/card1_thing_3.png";
import card1_thing_4 from "../src/img/card1_thing_4.png";
import card1_thing_5 from "../src/img/card1_thing_5.png";
import card1_thing_6 from "../src/img/card1_thing_6.png";
import card1_thing_7 from "../src/img/card1_thing_7.png";
import card1_thing_8 from "../src/img/card1_thing_8.png";
import card1_thing_9 from "../src/img/card1_thing_9.png";

// 组件公共值
const state = {}

const todosReducer = (state, action) => {
    state = action;
    return state;
}

// 尝试CSS3DRenderer 操作dom
export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);

    const { init, animate } = Operation(renderer, scene, camera);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        init(setRenderer, setCamera, setScene);
    },[]);

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀");
            setBoolValue(false);
            animate();
        }
        setBoolValue(true);
    },[renderer]);

    return '';
});


const objectData = [
    // 卡片
    {
        verticalBg:{
            url:'../src/img/bg_0.jpg',
            width: 1203,
            height: 589,
        },
        ground:{
            url:'../src/img/bg_1.jpg',
            width:1203,
            height: 589,
            rotation:-Math.PI/180*70,
        },
        thingsRotation:Math.PI/180*70,
        things:[
            {
                url: card1_thing_0,
                width:403,
                height: 284,
                x:-80,
                y:-445,
            },
            {
                url: card1_thing_1,
                width:440,
                height: 308,
                x:-360,
                y:-395,
            },
            {
                url: card1_thing_2,
                width:405,
                height: 299,
                x:360,
                y:-395,
            },
            {
                url: card1_thing_3,
                width:1131,
                height: 716,
                x:0,
                y:-395,
            },
            {
                url: card1_thing_4,
                width:358,
                height: 442,
                x:360,
                y:-395,
            },
            {
                url: card1_thing_5,
                width:349,
                height: 448,
                x:-360,
                y:-395,
            },
            {
                url: card1_thing_6,
                width:360,
                height: 522,
                x:-360,
                y:-395,
            },
            {
                url: card1_thing_7,
                width:1404,
                height: 216,
                x:0,
                y:-245,
            },
            {
                url: card1_thing_8,
                width:1118,
                height: 642,
                x:0,
                y:-245,
            },
        ]
    }
];


// 所有操作
const Operation = (renderer, scene, camera) => {
    // 初始化
    const init = (setRenderer, setCamera, setScene) => {
        // 相机初始化
        let cameras = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,500);
        cameras.position.z = 200;
        setCamera(cameras);

        // 场景中的元素在此处添加，代码在下一个片段

        // 渲染器初始化，这里使用的是 CSS3DRenderer 渲染
        let renderers = new CSS3DRenderer();
        console.log(renderers)
        renderers.domElement.className = 'canvasTest';
        renderers.setSize(window.innerWidth,window.innerHeight);
        console.log(renderers);
        document.body.appendChild( renderers.domElement );
        setRenderer(renderers);
        console.log(renderers)

        // 场景初始化
        let scenes = new THREE.Scene();
        setScene(scenes);
        console.log(scene)

        // 控制器初始化
        let controls = new TrackballControls(cameras, renderers.domElement);
        controls.addEventListener('change', (e) => {
            renderers.render(scenes,cameras);
        });


        modelList(scenes, cameras, renderers);

        function animate(){
            requestAnimationFrame(animate);
            controls.update();
        }
        animate();

        renderer = new THREE.WebGLRenderer( { alpha: true } ); // required
        renderer.setClearColor( 0x000000, 0 ); // the default
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        const box = new THREE.BoxGeometry(20, 20, 100, 100);
        const material = new THREE.MeshBasicMaterial({
            color: 0x668596
        });
        scenes.add(new THREE.Mesh(box, material));
    }

    // 加载模型
    const modelList = (scenes, cameras, renderers) => {
        const container = document.createElement('div'); // 使用 js 动态创建 DomElement
        container.className = 'container';
        container.innerHTML=  '1231';
        const objectContainer = new CSS3DObject(container); // 使用 CSS3DObject 将 DomElement 转换为 3d 元素
        console.log()

        console.log(scenes)
        scenes.add(objectContainer); // 将转换好的 3d 元素添加到场景

        objectData.forEach((cardItem,cardIndex)=>{
            // 卡片
            const cardContainer = document.createElement('div');
            cardContainer.style.width = 1448+'px';
            cardContainer.style.height = 750+'px';
            const objectCardContainer = new CSS3DObject(cardContainer);
            objectContainer.add(objectCardContainer); // 通过 object3D 的 add 方法实现嵌套

            //竖直背景
            const card_bg_vertical = document.createElement('div');
            card_bg_vertical.style.width = cardItem.verticalBg.width+'px';
            card_bg_vertical.style.height = cardItem.verticalBg.height+'px';
            card_bg_vertical.style.background = 'url('+bj+') no-repeat';
            const objectCardBgVertical = new CSS3DObject(card_bg_vertical);
            objectCardBgVertical.position.y = -80; // 通过 object3D 的 position 属性改变元素位置
            objectCardContainer.add(objectCardBgVertical);

            // 地面
            const card_groud = document.createElement('div');
            card_groud.style.width = cardItem.ground.width+'px';
            card_groud.style.height = cardItem.ground.height+'px';
            card_groud.style.transformOrigin = 'center top'; // 通过 css 中的 transform-origin 来改变旋转中心
            card_groud.style.background = '#cccccc';
            const objectCardGround = new CSS3DObject(card_groud);
            objectCardGround.position.y = -80;
            objectCardGround.rotation.x = cardItem.ground.rotation; // 通过 object3D 的 rotation 属性来旋转元素
            objectCardContainer.add(objectCardGround);

            // 元素
            cardItem.things.forEach((item,index) => {
                const thing = document.createElement('div');
                thing.style.width = item.width+'px';
                thing.style.height = item.height+'px';
                thing.style.background = 'url('+ item.url +') no-repeat';
                const objectThing = new CSS3DObject(thing);
                objectThing.rotation.x = cardItem.thingsRotation;
                objectThing.position.y = -(index+1) * 68;
                objectThing.position.x = item.x;
                objectThing.position.z = -item.y-300;
                console.log(objectThing.position.x,objectThing.position.y,objectThing.position.z)
                objectCardGround.add(objectThing);
            });
        });
    }

    // 渲染函数
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    return {
        init,
        animate
    }
}
