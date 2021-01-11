import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from 'three';
import {loadMustBe} from "./objectCollision";
import {loadRender} from "../src/js/three";
import THREEx from "../src/js/KeyboardState";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { bouncHover } from '../src/js/threeLibrary';
import pic2 from "../src/img/2.jpg";
import pic1 from "../src/img/1.jpg";

const todosReducer = (state, action) => {
    state = action;
    return state;
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const [target, setTarget] = useReducer(todosReducer, '');// 操作当前目标
    const [targetArr, setTargetArr] = useReducer(todosReducer, []);// 碰撞目标
    const [controls, setControls] = useReducer(todosReducer, []);//
    const {init, animate} = operation(renderer, scene, camera, target, targetArr);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        init(setRenderer, setCamera, setScene, setControls, setTarget, setTargetArr);

    },[]);

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀");
            setBoolValue(false);
            animate();
        }
        setBoolValue(true);
    },[renderer]);

    return (
        <p>我是傻子游戏</p>
    );
});

// 所有操作
const operation = (renderer, scene, camera, movingCube, collideMeshList) => {
    let collision = false;
    let keyboard = new THREEx.KeyboardState();
    const {testABounc, elvesBounc} = bouncHover(scene);
    let num = 0;
    // 初始化 + 模型
    const init = (setRenderer, setCamera, setScene, setControls, setTarget, setTargetArr) => {
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
        let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );
        setControls(new OrbitControls(camera, renderer.domElement));
        setCamera(camera);
        // 场景
        const scene = new THREE.Scene();
        setScene(scene);

        // 操作小球
        const ballA = new THREE.SphereGeometry(2, 10, 10);
        const materialBallA = new THREE.LineBasicMaterial({
            color: 0xf60e11,
        });
        const meshBallA = new THREE.Line(ballA, materialBallA);
        setTarget(meshBallA);
        scene.add(meshBallA);

        // 平面
        const plane = new THREE.PlaneGeometry(100, 900, 100, 100);
        const materialPlane = new THREE.MeshBasicMaterial({
            color: 0xc0e5f0,
            side: THREE.DoubleSide
        });
        const meshPlane = new THREE.Mesh(plane, materialPlane);
        meshPlane.rotation.set(-Math.PI/2, 0, 0);
        meshPlane.position.set(0, -2.5, 0);
        scene.add(meshPlane);
        let index = 0;
        let time = setInterval(() => {
            index++;
            if (index>=50) {
                clearInterval(time)
            }
            else {
                randomBox(setTargetArr, scene);
            }
        }, 1000)
        // 光源
        light(scene);
    }

    // 光源
    const light = (scene) => {
        let directionalLight = new THREE.DirectionalLight(0x8f948d, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
        directionalLight.position.set(10, 2, 10);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->
        scene.add(directionalLight);
    }

    // 键盘监听事件
    const keyboardMonitor = () => {
        let moveDistance = 1;
        let rotateAngle = Math.PI / 2 * 1;

        if (keyboard.pressed("A")) {
            console.log(1)
            movingCube.rotation.y += rotateAngle;
        }
        if (keyboard.pressed("D")) {
            console.log(2)
            movingCube.rotation.y += rotateAngle;
        }

        if (keyboard.pressed("left")) {
            console.log('l')
            if (movingCube.position.x>=-49) {
                if (collision) {
                    collision = false
                    movingCube.position.x += moveDistance;
                }
                else {
                    movingCube.position.x -= moveDistance;
                }
            }
            // scene.rotation.z = Math.PI/15;
            // setTimeout(() => {
            //     scene.rotation.z = 0;
            // }, 300)
        }
        if (keyboard.pressed("right")) {
            console.log('r')
            if (movingCube.position.x<=49) {
                if (collision) {
                    collision = false
                    movingCube.position.x -= moveDistance;
                } else {
                    movingCube.position.x += moveDistance;
                }
            }
        }
        if (keyboard.pressed("up")) {
            console.log('s');
            if (collision) {
                collision = false
                movingCube.position.z = 0;
                movingCube.position.x = 0;
            }
            else {
                movingCube.position.z -= moveDistance;
            }
        }
        if (keyboard.pressed("down")) {
            console.log('x')
            if (collision) {
                collision = false
                movingCube.position.z = 0;
                movingCube.position.x = 0;
            }
            else {
                movingCube.position.z += moveDistance;
            }
        }
    }

    // 提示撞击次数
    const countNum = () => {
        let model = elvesBounc('触碰' + num);
        model.position.set(30, 20, 0);
        scene.add(model);
    }

    // 碰撞
    const update = () => {
        keyboardMonitor();
        countNum();
        squareOffset();

        let originPoint = movingCube.position.clone();
        let state = false;
        for (let vertexIndex = 0; vertexIndex < movingCube.geometry.vertices.length; vertexIndex++) {
            // 顶点原始坐标
            let localVertex = movingCube.geometry.vertices[vertexIndex].clone();
            // 顶点经过变换后的坐标
            let globalVertex = localVertex.applyMatrix4(movingCube.matrix);
            let directionVector = globalVertex.sub(movingCube.position);

            let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            let collisionResults = ray.intersectObjects(collideMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                state = true;
                break;
            }
            state = false;
        }

        if (state) {
            // console.log("Crash");
            num ++;
            collision = true;
        } else {
            // message.innerText = "Safe";
        }
    }

    // 方块整体平移
    const squareOffset = () => {
        // var directionalLight = new THREE.DirectionalLight(0x2e99d8, 1);
        // // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
        // directionalLight.position.set(10, 2, 10);
        // // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->

        collideMeshList.map(res => {
            // directionalLight.target = res;
            res.position.z += .1;
        });
        // scene.add(directionalLight);
    }

    // 渲染函数
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        update();
    }

    // 返回一个介于min和max之间的随机数
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 随机小方块
    const randomBox = (setTargetArr, scene) => {
        const box = new THREE.BoxGeometry(5, 5, 5, 10, 10, 10);

        let texture = new THREE.TextureLoader();// 加载颜色纹理贴图

        let pic1Obj = texture.load(pic1);
        let pic2Obj = texture.load(pic2);

        let material = new THREE.MeshPhongMaterial({
            map: pic1Obj,
            bumpMap: pic2Obj,
            bumpScale: 3
        });

        const mesh = new THREE.Mesh(box, material);
        mesh.position.set(getRandomArbitrary(-50, 50), 0, getRandomArbitrary(0, -300));
        collideMeshList.push(mesh);
        setTargetArr(collideMeshList);
        mesh.name = 'box';
        scene.add(mesh);
    }

    return {
        init,
        animate
    }
}
