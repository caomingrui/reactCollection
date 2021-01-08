import React, {memo, useEffect, useState, useReducer} from "react";
import { loadRender } from '../src/js/three';
import * as THREE from 'three';

const todosReducer = (state, action) => {
    state = action;
    return state;
}

// 加载必须
export function loadMustBe(setRenderer, setCamera, setScene) {
    let renderer = new THREE.WebGL1Renderer();

    let width = window.innerWidth;
    let height =window.innerHeight;
    renderer.setSize( width, height);

    // renderer.setSize( elem.offsetWidth, elem.offsetHeight);
    renderer.setClearColor(0xe6d0d0, .0);

    setRenderer(renderer);
    document.body.appendChild( renderer.domElement );
    renderer.shadowMapEnabled = true;
    renderer.shadowMap.enabled = true;
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


export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(1000);
    const {merge} = modelTests(camera, renderer, scene);
    const [bear, setBear] = useState();

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        const width = '100%';
        setCanvasWidth(width);
        loadMustBe(setRenderer, setCamera, setScene, document.getElementById('canvasCollision'));
    },[])

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀");
            setBoolValue(false);
            merge();

            loadRender(camera, renderer, scene);
        }
        setBoolValue(true);
    },[renderer])

    return (123
        // <canvas id="canvasCollision" width='1000' height='700' style={{width: canvasWidth, height: '100%'}}></canvas>
    );
});


// 模型
const modelTests = (camera, renderer, scene) => {
    // 球1
    const modeBall = () => {
        const ball = new THREE.SphereGeometry(10, 100, 100);
        const ballMaterial = new THREE.MeshBasicMaterial({
            color: 0x93a8a7
        });
        const meshBall = new THREE.Mesh(ball, ballMaterial);
        return meshBall;
    }

    // 球2
    const modeBallB = () => {
        const ball = new THREE.SphereGeometry(10, 100, 100);
        const ballMaterial = new THREE.MeshBasicMaterial({
            color: 0x7e8ebd
        });
        const meshBall = new THREE.Mesh(ball, ballMaterial);
        return meshBall;
    }

    // 小球
    const modeBallC = () => {
        const ball = new THREE.SphereGeometry(2, 100, 100);
        const ballMaterial = new THREE.MeshBasicMaterial({
            color: 0xf8450f
        });
        const meshBall = new THREE.Mesh(ball, ballMaterial);
        return meshBall;
    }

    // 场地
    const siteModel = () => {
        const sizePanel = new THREE.PlaneGeometry(100, 100);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0x5d485d,
            side: THREE.DoubleSide
        });
        const meshPanel = new THREE.Mesh(sizePanel, panelMaterial);
        return meshPanel;
    }



    // 合并
    const merge = (type) => {
        const ball1 = modeBall();
        ball1.name = 'ball1';
        ball1.position.set(0, 20, 20);
        const ball2 = modeBallB();
        ball2.name = 'ball2';
        ball2.position.set(0, -20, 20);
        const ball3 = modeBallC();
        ball3.name = 'ball3';
        ball3.position.set(0, -10, 20);
        scene.add(ball3);
        scene.add(ball1);
        scene.add(ball2);
        const bottom = siteModel();
        scene.add(bottom);
        const collideMeshList = [];
        collideMeshList.push(ball1);
        collideMeshList.push(ball2);
        console.log(collideMeshList)
        console.log(ball1.geometry.vertices)
        console.log(ball1.position.clone())
        console.log(scene.children)

        var moveDistance = 1; // 200 pixels per second
        var rotateAngle = Math.PI / 2 * 10;

        document.onkeydown=function(event){
            let e = event || window.event ;

            if(e && e.keyCode==40){ //下
                console.log('xia');
                ball3.position.z += moveDistance;
            }
            if(e && e.keyCode==37){ //左
                console.log('zuo')
                ball3.position.x -= moveDistance;
            }
            if(e && e.keyCode==39){ //右
                console.log('you')
                ball3.position.x += moveDistance;
            }
            if(e && e.keyCode==38){ // 上
                console.log('shang')
                ball3.position.z -= moveDistance;
            }
            scene.add(ball3);
            renderer.render(scene, camera);
            // test(ball3, collideMeshList)
        };

        // let originPoint = ball3.position.clone();
        // let crash = false;
        // for (let vertexIndex = 0; vertexIndex < ball3.geometry.vertices.length; vertexIndex++) {
        //     // 顶点原始坐标
        //     let localVertex = ball3.geometry.vertices[vertexIndex].clone();
        //     // 顶点经过变换后的坐标
        //     let globalVertex = localVertex.applyMatrix4(ball3.matrix);
        //     // 获得由中心指向顶点的向量
        //     let directionVector = globalVertex.sub(ball3.position);
        //
        //     // 将方向向量初始化
        //     let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        //     // 检测射线与多个物体的相交情况
        //     let collisionResults = ray.intersectObjects(collideMeshList);
        //     // 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
        //     if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        //         crash = true;   // crash 是一个标记变量
        //         break;
        //     }
        //     crash = false;
        // }
        // if (crash) {
        //     console.log('pengzhuang')
        // }
        // else {
        //     console.log('???')
        // }

    }

    const test =  (ball3, collideMeshList) => {
        let originPoint = ball3.position.clone();
        let crash = false;
        for (let vertexIndex = 0; vertexIndex < ball3.geometry.vertices.length; vertexIndex++) {
            // 顶点原始坐标
            let localVertex = ball3.geometry.vertices[vertexIndex].clone();
            // 顶点经过变换后的坐标
            let globalVertex = localVertex.applyMatrix4(ball3.matrix);
            // 获得由中心指向顶点的向量
            let directionVector = globalVertex.sub(ball3.position);

            // 将方向向量初始化
            let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            // 检测射线与多个物体的相交情况
            let collisionResults = ray.intersectObjects(collideMeshList);
            // 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                crash = true;   // crash 是一个标记变量
                break;
            }
            crash = false;
        }
        if (crash) {
            // console.log('pengzhuang')
        }
        else {
            // console.log('???')
        }
    }

    return {
        merge
    }
}

// 碰撞监测
const collisionTest = (camera, renderer, scene) => {
    console.log()
}
