import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls";
import pic from "../src/img/lm-1.png";
import { bouncHover, clickEvent, generateUUID } from '../src/js/threeLibrary'
import THREEx from "../src/js/KeyboardState";
import targetPic from '../src/img/target.jpg'
const todosReducer = (state, action) => {
    state = action;
    return state;
}

const states = {
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const [control, setControl] = useReducer(todosReducer, []); //
    const [target, setTarget] = useReducer(todosReducer, ''); // 碰撞目标
    const [targetList, setTargetList] = useReducer(todosReducer, []); // 紫蛋群目标
    const [stateDa, setStateDa] = useReducer(todosReducer, states); //  测试组件共享数据
    const {init, animate} = Operation(renderer, scene, camera, target, targetList, setTargetList, stateDa, setStateDa);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        init(setRenderer, setCamera, setScene, setTarget);
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
const Operation = (renderer, scene, camera, target, targetList, setTargetList, stateDa, setStateDa) => {

    let keyboard = new THREEx.KeyboardState();
    const {elvesBounc} = bouncHover(scene);
    let time, times;
    let num = 0, left = 0, endPoint = 50;

    // 初始化
    const init = (setRenderer, setCamera, setScene, setTarget) => {
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
        setCamera(camera);
        // 场景
        const scene = new THREE.Scene();
        setScene(scene);
        // 加载模型 setTarget -- 设置当前碰撞目标
        models(scene, setTarget);
        // 点击事件
        clictEventList(scene, camera, renderer);
        // 光源
        light(scene);
    }

    // 键盘监听事件
    const keyboardMonitor = () => {
        // 调整弧线位置
        const lineModel = () => {
            scene.children.map(res => {
                if (res.name == 'line') {
                    scene.remove(res);
                    changeCurve(scene, num, left, endPoint);
                }
            });
        }

        if (keyboard.pressed("A")) {
            left --;
            let obj = stateDa;
            obj.left = left;
            setStateDa(obj);
            lineModel();
        }
        if (keyboard.pressed("D")) {
            left ++;
            let obj = stateDa;
            obj.left = left;
            setStateDa(obj);
            lineModel();
        }

        if (keyboard.pressed("Q")) {
            endPoint ++;
            let obj = stateDa;
            obj.endPoint = endPoint;
            setStateDa(obj);
            lineModel();
        }
        if (keyboard.pressed("E")) {
            endPoint--;
            let obj = stateDa;
            obj.endPoint = endPoint;
            setStateDa(obj);
            lineModel();
        }

        if (keyboard.pressed("W")) {
            num ++;
            let obj = stateDa;
            obj.num = num;
            setStateDa(obj);
            lineModel();
        }
        if (keyboard.pressed("S")) {
            num--;
            let obj = stateDa;
            obj.num = num;
            setStateDa(obj);
            lineModel();
        }

        if (keyboard.pressed("left")) {
            console.log('l')
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
    }

    // 点击事件集
    const clictEventList = (scene, camera, renderer) => {
        // 发射紫蛋按钮
        clickEvent(scene, camera, renderer, 'but', (da) => {
            console.log('biubiubiu');
            const balls = bullet();    // 小子弹
            let name = generateUUID(); // 唯一key
            balls.name = name;
            scene.add(balls);
            // 添加碰撞对象群
            targetList.push(balls);
            setTargetList(targetList);

            trajectory(scene, name, balls);
            // clearInterval(time);
            // clearTimeout(times);
            // time = setInterval(() => {
            //     trajectory(scene, name); //紫蛋轨迹
            // }, 40);
            // times = setTimeout(() => {
            //     clearInterval(time);
            //     scene.remove(balls); // 清除紫蛋模型
            // }, 400);
        });

        // 调整曲线按钮
        clickEvent(scene, camera, renderer, 'curve', (da) => {
            console.log('curvecurvecurve');
            changeCurve(scene);
        });
    }

    // 曲线轨迹
    const changeCurve = (scene, num = 0, left = 0, endPoint = 50) => {
        let geometry = new THREE.Geometry();
        let p1 = new THREE.Vector3(0, -40, 0);
        let p2 = new THREE.Vector3(0, 0, num);
        let p3 = new THREE.Vector3(left, endPoint, 0);
        // 三维二次贝赛尔曲线
        let curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
        console.log(curve)
        let points = curve.getPoints(100);
        geometry.setFromPoints(points);
        //材质对象
        let material = new THREE.PointsMaterial({
            color: 0xa03232
        });
        //线条模型对象
        let line = new THREE.Points(geometry, material);
        line.name = 'line';
        // console.log(curve.ArcCurve)
        scene.add(line); //线条对象添加到场景中
    }

    //trajectory 小球轨迹
    const trajectory = (scene, name, model) => {
        if (scene) {
            console.log('s'+ stateDa.num, 'z' + stateDa.left)
            clearInterval(time);
            time = setInterval(() => {
                // console.log(model.position.y)
                model.position.y += 5;
                console.log(stateDa.endPoint)
                if (model.position.y >= stateDa.endPoint) {
                    scene.remove(model);
                    clearInterval(time);
                    // setTimeout(() => {
                    //     scene.children.map(res => {
                    //         if (res.name == 'line') {
                    //             scene.remove(res);
                    //         }
                    //     });
                    // }, 200)
                }

                if (model.position.y > ((-40 + stateDa.endPoint)/2) && model.position.y >  ((-40 + stateDa.endPoint)/2) + ((40 + stateDa.endPoint)/8)) {
                    model.position.z -= stateDa.num/((40 + stateDa.endPoint)/5);
                }
                else if (model.position.y > ((-40 + stateDa.endPoint)/2) && model.position.y < ((-40 + stateDa.endPoint)/2) + ((40 + stateDa.endPoint)/8)) {
                    model.position.z -= stateDa.num/(((40 + stateDa.endPoint)/5) + 4);
                }
                else if (model.position.y < ((-40 + stateDa.endPoint)/2) && model.position.y > -((-40 + stateDa.endPoint)/2) + ((40 + stateDa.endPoint)/8)) {
                    model.position.z += stateDa.num/(((40 + stateDa.endPoint)/5) + 4);
                }
                else {
                    model.position.z += stateDa.num/((40 + stateDa.endPoint)/5);
                }
                if (stateDa.left != 0) {
                    model.position.x += stateDa.left/((40 + stateDa.endPoint)/5);
                }
            }, 20);
        }
    }

    // 方块动画
    const squareAni = (scene, model) => {
        setInterval(() => {
            model.position.x += 1;
            if (model.position.x >= 20) {
                model.position.x = -20;
            }
        }, 200);
    }

    // 模型集
    const models = (scene, setTarget) => {
        // 大方块
        const ball = new THREE.BoxGeometry(20, 5, 20, 30, 30, 30);
        const texture = new THREE.TextureLoader().load(targetPic);
        const material = new THREE.MeshBasicMaterial({
            color: 0x5d82e4,
            map: texture
        });
        const ballMesh= new THREE.Mesh(ball, material);
        ballMesh.name = 'ball';
        ballMesh.position.y = 40;
        setTarget(ballMesh);
        squareAni(scene, ballMesh);
        scene.add(ballMesh);

        // 平面
        const plane = new THREE.PlaneGeometry(60, 100, 100, 100);
        const planeMes = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
            color: 0xdae2e9
        }));
        planeMes.position.z = -10;
        planeMes.name = 'plane';
        scene.add(planeMes);

        // 弹框出蛋按钮
        let model = elvesBounc('biu');
        model.position.set(30, 20, 40);
        model.name = 'but';
        scene.add(model);

        // 弹框弧度按钮
        let modelCurve = elvesBounc('曲线');
        modelCurve.position.set(-30, 20, 40);
        modelCurve.name = 'curve';
        scene.add(modelCurve);
    }

    //单独小球紫蛋模型
    const bullet = () => {
        // 小球
        const ballA = new THREE.SphereGeometry(2, 20, 20);
        const ballAMesh = new THREE.Mesh(ballA, new THREE.MeshBasicMaterial({
            color: 0x0d3119
        }));
        ballAMesh.position.y = -40;
        return ballAMesh;
    }

    // 光源
    const light = (scene) => {
        let directionalLight = new THREE.DirectionalLight(0x8f948d, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
        directionalLight.position.set(10, 2, 10);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->
        scene.add(directionalLight);
    }

    // 紫蛋碰撞监测
    const update = () => {
        let originPoint = target.position.clone();
        let state = false;
        let da = '';
        for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
            // 顶点原始坐标
            let localVertex = target.geometry.vertices[vertexIndex].clone();
            // 顶点经过变换后的坐标
            let globalVertex = localVertex.applyMatrix4(target.matrix);
            let directionVector = globalVertex.sub(target.position);

            let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            let collisionResults = ray.intersectObjects(targetList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                state = true;
                da = collisionResults;
                break;
            }
            state = false;
        }

        if (state) {
            scene.children.map(res => {
                if (res.name == 'ball') {
                    console.log(res)
                    let x1 = res.position.x;
                    console.log(x1)
                    const {x, y, z} = da[0].point;
                    console.log(x,y,z);
                    console.log( (x1) - x )
                }
            })
        } else {
            // message.innerText = "Safe";
        }
    }

    // 渲染函数
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        keyboardMonitor();
        update(); // 碰撞监测


        // trajectory();
    }

    return {
        init,
        animate
    }
}
