import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TweenMax, Power2, TimelineLite} from "gsap";

const todosReducer = (state, action) => {
    state = action;
    return state;
}

// 组件共享值
const states = {
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [state, setState] = useReducer(todosReducer, states);       // 共享值
    const [boolValue, setBoolValue] = useState(false);
    const {init, animate} = operation(renderer, scene, camera);

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
})

// 操作
const operation = (renderer, scene, camera) => {
    // 初始化
    const init = (setRenderer, setCamera, setScene) => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        // 渲染器
        let renderer = new THREE.WebGL1Renderer();
        renderer.setSize( width, height);
        renderer.setClearColor(0x1f1d1d, 1);
        setRenderer(renderer);
        document.body.appendChild( renderer.domElement );
        renderer.shadowMapEnabled = true;
        renderer.shadowMap.enabled = true;
        //相机视角
        let camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );
        // 控制器
        let orbit = new OrbitControls(camera, renderer.domElement);
        orbit.addEventListener('keydown', (e)=>{});
        setCamera(camera);
        // 场景
        const scenes = new THREE.Scene();
        setScene(scenes);

        // 加载模型
        modelList(scenes);
    }

    // 模型
    const modelList = (scenes) => {
        // 球模型
        const ballModel = () => {
            const ball = new THREE.SphereGeometry(20, 50, 50);
            const ballMaterial = new THREE.PointsMaterial({
                color:0xffffff,
                size: 1
            });
            const ballMesh = new THREE.Points(ball, ballMaterial);
            return ballMesh;
        }

        // 画点 + 带字
        const drawPoint = (text) => {
            let width = 512, height = 256;
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = '#C3C3C3';
            ctx.fillRect(0, 0, width, height);
            ctx.font = 50 +'px  bold';
            ctx.fillStyle = '#2891FF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.failIfMajorPerformanceCaveat = false;
            ctx.fillText(text, width/2,height/2);
            return canvas;
        }

        // 矩形模型
        const rectangular = () => {
            const box = new THREE.PlaneGeometry(20, 40, 50, 50);
            const ballMaterial = new THREE.PointsMaterial({
                color:0xffffff,
                size: 1
            });
            const boxMesh = new THREE.Points(box, ballMaterial);
            return boxMesh;
        }

        const ballMesh = ballModel();
        const boxMesh = rectangular();
        let sprite;
        console.log( boxMesh.geometry.vertices.length );
        const recModel = boxMesh.geometry.vertices;
        // 遍历小球顶点
        ballMesh.geometry.vertices.map((res, ind) => {
            let {x, y, z} = res;

            if (ind < 3000) {
                //为每个粒子附魔
                const spriteMaterial = new THREE.SpriteMaterial({
                    color: 0xdcdfd3,
                    map: new THREE.CanvasTexture(drawPoint('a'))
                });


                sprite = new THREE.Sprite(spriteMaterial);

                let timerandom = 1 * Math.random();
                //为每个点加动画
                TweenMax.to(
                    sprite.position,
                    timerandom,
                    {x: x + (0.5 - Math.random()) * 100, y: y + (0.5 - Math.random()) * 100, z: z + (Math.random() * 100), delay: 1.8}
                );


                TweenMax.to(
                    sprite.position,
                    2 * timerandom,
                    {x: '0', y: '0', z: '0', delay: 3+timerandom,}
                );

                TweenMax.to(
                    sprite.position,
                    4 * timerandom,
                    {x: recModel[ind].x, y: recModel[ind].y, z: recModel[ind].z, delay: 5+timerandom,}
                );

                TweenMax.to(
                    sprite.position,
                    6 * timerandom,
                    {x: recModel[ind].x + (0.5 - Math.random()) * 100, y: recModel[ind].y + (0.5 - Math.random()) * 100, z: recModel[ind].z + (Math.random() * 100), delay: 7+timerandom,}
                );

                scenes.add(sprite);
            }
        })


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
