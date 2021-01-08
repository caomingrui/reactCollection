import * as THREE from 'three';
import React, {memo, useEffect, useState, useReducer} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import useTest from "./test/mapTest";


// 加载必须
function loadMustBe(setRenderer,setCamera, setScene) {
    let renderer = new THREE.WebGL1Renderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x495670, 1);
    console.log(renderer)
    setRenderer(renderer);
    document.body.appendChild( renderer.domElement );
    // renderer.shadowMapEnabled = true;
    // // 相机视角
    let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    /**
     * 正投影相机设置
     */
//     var width = window.innerWidth; //窗口宽度
//     var height = window.innerHeight; //窗口高度
//     var k = width / height; //窗口宽高比
//     var s = 150; //三维场景显示范围控制系数，系数越大，显示的范围越大
// //创建相机对象
//     var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 500);
//     camera.position.set(200, 300, 200); //设置相机位置
//     let scene = new THREE.Scene();
//     camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    setCamera(camera);

    // 场景
    setScene(new THREE.Scene());
}

// 渲染
function loadRender(camera, renderer, scene) {
    let controls = new OrbitControls(camera, renderer.domElement);
    function aa() {
        renderer.render(scene, camera)
    }

    controls.addEventListener('change', aa);
    renderer.render(scene, camera);
}

const todosReducer = (state, action) => {
    state = action;
    return state;
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, ''); // 相机
    const [scene, setScene] = useReducer(todosReducer, '');// 场景
    const [boolValue, setBoolValue] = useState(false);
    const {test, textureTest, AbumpMap, elfModel, forest} = useTest(scene, renderer, camera);
    const {frameAnima} = useAnimation(scene, renderer, camera);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        loadMustBe(setRenderer, setCamera, setScene);
    },[])

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀");
            setBoolValue(false);
            test();
            textureTest();
            AbumpMap();
            elfModel();
            forest();

            // 动画
            frameAnima();
            loadRender(camera, renderer, scene);
        }
        setBoolValue(true);
    },[renderer])

    return ''
})

const useAnimation = (scene, renderer, camera) => {
    // 编辑关键帧播放
    const frameAnima = () => {
        const box = new THREE.BoxGeometry(50, 20, 20);
        const sphere = new THREE.SphereGeometry(20, 20, 20);

        let boxStyle = new THREE.MeshPhongMaterial({
            color: 0x90b499
        });
        let sphereStyle = new THREE.MeshPhongMaterial({
            color: 0xbdb789
        });
        let boxMesh = new THREE.Mesh(box, boxStyle);
        let sphereMesh = new THREE.Mesh(sphere, sphereStyle);
        let group = new THREE.Group()
        console.log(group)
        boxMesh.name = 'box';
        sphereMesh.name = 'sphere';
        group.add(boxMesh);
        group.add(sphereMesh);
        scene.add(group);
        console.log(scene)
        keyFrameData(group);
    }

    // 创建命名对象关键帧数据
    const keyFrameData = (group) => {
        let times = [0, 10];// 关键帧时间数组
        let values = [0, 0, 0, 150, 0, 0];// 与时间点对应的值组成的数组

        const postTrack = new THREE.KeyframeTrack('box.position', times, values);

        const colorKF = new THREE.KeyframeTrack('box.material.color', [10, 50], [1, 0, 0, 0, 0, 1]);
        const sphereSize = new THREE.KeyframeTrack('sphere.scale', [0, 100], [1, 1, 1, .5, .5, .5])
        const clip = new THREE.AnimationClip('default', 100, [postTrack, sphereSize, colorKF]);

        console.log(group)
        const mixer = new THREE.AnimationMixer(group);
        const AnimationAction = mixer.clipAction(clip);
//通过操作Action设置播放方式
        AnimationAction.timeScale = 20;//默认1，可以调节播放速度
// AnimationAction.loop = THREE.LoopOnce; //不循环播放
        AnimationAction.play();//开始播放

        // 创建一个时钟对象Clock
        const clock = new THREE.Clock();
        // 渲染函数
        function render() {
            renderer.render(scene, camera); //执行渲染操作
            requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

            //clock.getDelta()方法获得两帧的时间间隔
            // 更新混合器相关的时间
            mixer.update(clock.getDelta());
        }
        render();
    }

    return {
        frameAnima
    }
}
