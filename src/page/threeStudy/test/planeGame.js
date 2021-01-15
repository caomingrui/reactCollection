import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import pic from "../src/img/lm-1.png";
import THREEx from "../src/js/KeyboardState";
const todosReducer = (state, action) => {
    state = action;
    return state;
}

// 作废
export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const [control, setControl] = useReducer(todosReducer, []);//
    const {init, animate} = operation(renderer, scene, camera, control);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        init(setRenderer, setCamera, setScene, setControl);
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

// 所有操作
const operation = (renderer, scene, camera, control) => {
    let keyboard = new THREEx.KeyboardState();
    let perspective = 0; // 视角
    var clock = new THREE.Clock();

    // 初始化
    const init = (setRenderer, setCamera, setScene, setControl) => {
        let renderer = new THREE.WebGL1Renderer();
        let width = window.innerWidth;
        let height = window.innerHeight;
        renderer.setSize( width, height);
        renderer.setClearColor(0x1f1d1d, 1);

        setRenderer(renderer);
        document.body.appendChild( renderer.domElement );
        renderer.shadowMapEnabled = true;
        renderer.shadowMap.enabled = true;
        // // 相机视角
        let camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );
        let orbit = new OrbitControls(camera, renderer.domElement);

        orbit.addEventListener('keydown', (e)=>{
            console.log(e)
        });
        //
        //
        // setControls(orbit);
        setCamera(camera);
        // let control = new FirstPersonControls(camera, renderer.domElement);
        // control.lookSpeed = 0.02;
        // control.movementSpeed = 2;
        // control.noFly = false;
        // control.constrainVertical = true; //约束垂直
        // control.verticalMin = 1.0;
        // control.verticalMax = 2.0;
        // control.lon = 0;
        // control.lat = 0;
        // control.onMouseDown = () => {
        //     console.log(1)
        // }
        // control.onMouseMove = () =>{
        //     console.log(2)
        // }
        // control.onMouseUp = () => {
        //     console.log(3)
        // }
        // setControl(control);
        // console.log(control)

        // 场景
        const scene = new THREE.Scene();
        setScene(scene);
        // 加载模型
        models(scene);
        // 光源
        light(scene);
    }


    // 键盘监听事件
    const keyboardMonitor = () => {

        if (keyboard.pressed("A")) {
            console.log(1);
        }
        if (keyboard.pressed("D")) {
            console.log(2)

        }

        if (keyboard.pressed("left")) {
            console.log('l')
            scene.children.map(res => {
                if (res.name == 'plane') {
                    console.log(res)
                    res.rotation.z += Math.PI/2;
                } else if (res.name == 'ball') {
                    res.position.x -= 2;
                }
            });
        }
        if (keyboard.pressed("right")) {
            console.log('r')
            camera.position.x += 1;
        }
        if (keyboard.pressed("up")) {
            console.log('s');

        }
        if (keyboard.pressed("down")) {
            console.log('x')

        }


        document.addEventListener('mousemove', () => {
            // console.log(12)
        })
    }

    // function initControls(camera) {
    //     controls = new FirstPersonControls(camera);
    //     controls.lookSpeed = 0.2; // 鼠标移动查看的速度
    //     controls.movementSpeed = 20; // 相机移动速度
    //     controls.noFly = true;
    //     controls.constrainVertical = true; // 约束垂直
    //     controls.verticalMin = 1.0;
    //     controls.verticalMax = 2.0;
    //     controls.lon = -100; // 进入初始视角 x 轴的角度
    //     controls.lat = 0; // 初始视角进入后 y 轴的角度
    // }

    // 全景模型
    const models = (scene) => {
        const ball = new THREE.BoxGeometry(20, 20, 20, 30, 30, 30);
        const material = new THREE.MeshBasicMaterial({
            color: 0x5d82e4,
            wireframe: true
        });
        const ballMesh= new THREE.Mesh(ball, material);
        ballMesh.name = 'ball';
        scene.add(ballMesh);

        const plane = new THREE.PlaneGeometry(60, 100, 100, 100);
        const planeMes = new THREE.Mesh(plane, material);
        planeMes.name = 'plane';
        scene.add(planeMes);
    }

    // 光源
    const light = (scene) => {
        let directionalLight = new THREE.DirectionalLight(0x8f948d, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
        directionalLight.position.set(10, 2, 10);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->
        scene.add(directionalLight);
    }


    // 渲染函数
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        keyboardMonitor();
        // if (control!=undefined) {
        //     control.update(clock.getDelta());
        // }
    }

    return {
        init,
        animate
    }
}
