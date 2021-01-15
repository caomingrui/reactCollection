import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Kirche3D from '../src/img/Kirche3D.obj'
import {TweenMax} from "gsap";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";


const todosReducer = (state, action) => {
    state = action;
    return state;
};

// 组件共享值
const states = {};

// 着色器练习
export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [state, setState] = useReducer(todosReducer, states);              // 共享值
    const [boolValue, setBoolValue] = useState(false);
    const {init, animate} = operation(renderer, scene, camera, state, setState);

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

    return ('');
});

// 操作
const operation = (renderer, scene, camera, state, setState) => {
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

    // 将几何模型变成几何缓存模型
    const toBufferGeometry = (geometry) => {
        if (geometry.type === 'BufferGeometry') return geometry;
        let bGeometry = new THREE.BufferGeometry();
        console.log(bGeometry.fromGeometry);
        console.log(geometry.vertices)
        let model = bGeometry.fromGeometry(geometry);
        console.log(model)
        return new THREE.BufferGeometry().fromGeometry(geometry);
    }

    // 模型
    const modelList = (scenes) => {

        // 画点 + 带字
        const drawPoint = (text) => {
            let width = 16, height = 8;
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, width, height);
            ctx.font = 12 +'px';
            ctx.fillStyle = '#2891FF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.failIfMajorPerformanceCaveat = false;
            ctx.fillText(text, width/2,height/2);
            return canvas;
        }

        // 平面模型
        const planeModel = () => {

            let uniforms = {
                // 传递的颜色属性
                color: {
                    type: 'v3', // 指定变量类型为三维向量
                    value: new THREE.Color(0xffffff)
                }
            };

            const plane = new THREE.PlaneGeometry(20, 30, 50, 50);
            console.log(state.uniforms)
            let shaderMaterial = new THREE.ShaderMaterial({
                // 传递给shader的属性
                uniforms: uniforms,
                // 获取顶点着色器代码
                vertexShader: document.getElementById('vertexshader').textContent,
                // 获取片元着色器代码
                fragmentShader: document.getElementById('fragmentshader').textContent,
                // 渲染粒子时的融合模式
                blending: THREE.AdditiveBlending,
                // 关闭深度测试
                depthTest: false,
                // 开启透明度
                transparent: true
            });

            let particleSystem = new THREE.Points(plane, shaderMaterial);
            return particleSystem;
        }

        // 模型粒子
        const loadModel = () => {
            return new Promise(resolve => {
                const loadObj = new OBJLoader();
                loadObj.load('http://localhost:3000/static/media/Kirche3D.58b3debe.obj', function (obj) {
                    console.log(obj.children[0].geometry.attributes.position.getX(0))
                    console.log(obj.children[0].geometry.attributes.position.getY(0))
                    console.log(obj.children[0].geometry.attributes.position.getZ(0))
                    console.log(obj.children[0].geometry.attributes.position.getX(1))
                    console.log(obj.children[0].geometry.attributes.position.length);
                    // obj.position.set(-5, 0, 25);
                    // obj.rotateX(-Math.PI/2)
                    // // obj.rotation.set(-Math.PI/2, Math.PI/2, Math.PI/4);
                    // // obj.scale.set(1, 1, 1); //放大obj组对象
                    // // obj.children[0].material.color.set(0xff0000);
                    // obj.children[0].material = new THREE.MeshPhongMaterial({
                    //     color: 0xa57a7a,
                    //     metalness: 0.6
                    // })
                    resolve(obj);
                });
            });
        }

        const plane = planeModel();
        // scenes.add(plane);
        // 模型粒子 遍历
        //let sprite;
        // loadModel().then(res => {
        //     console.log(res);
        //     const chief = res.children[0].geometry.attributes.position.length/3;
        //     for (let i = 0; i < chief; i ++) {
        //         let x = res.children[0].geometry.attributes.position.getX(i);
        //         let y = res.children[0].geometry.attributes.position.getY(i);
        //         let z = res.children[0].geometry.attributes.position.getZ(i);
        //         if (i < 10000) {
        //             const spriteMaterial = new THREE.SpriteMaterial({
        //                 color: 0xdcdfd3,
        //                 map: new THREE.CanvasTexture(drawPoint('a'))
        //             });
        //
        //             sprite = new THREE.Sprite(spriteMaterial);
        //             let timerandom = 1 * Math.random();
        //             //为每个点加动画
        //             TweenMax.to(
        //                 sprite.position,
        //                 timerandom,
        //                 {x: x + (Math.random()) * 40, y: y + (Math.random()) * 40, z: z + (Math.random() * 40), delay: 1.8}
        //             );
        //
        //             scenes.add(sprite);
        //         }
        //     }
        // });

        loadModel().then(res => {
            console.log(res);

            let uniforms = {
                // 传递的颜色属性
                color: {
                    type: 'v3', // 指定变量类型为三维向量
                    value: new THREE.Color(0xffffff)
                }
            };

            let shaderMaterial = new THREE.ShaderMaterial({
                // 传递给shader的属性
                uniforms: uniforms,
                // 获取顶点着色器代码
                vertexShader: document.getElementById('vertexshader').textContent,
                // 获取片元着色器代码
                fragmentShader: document.getElementById('fragmentshader').textContent,
                // 渲染粒子时的融合模式
                blending: THREE.AdditiveBlending,
                // 关闭深度测试
                depthTest: false,
                // 开启透明度
                transparent: true
            });
            console.log(res)
            // res.children[0].geometry.getPoints(100);
            let particleSystem = new THREE.Points(res.children[0].geometry, shaderMaterial);
            scenes.add(particleSystem);

        });

    }

    // 渲染函数
    const animate = () => {
        requestAnimationFrame(animate);
        // modelList(scene);
        // console.log(state.uniforms.u_time.value)
        // let uniformsDa = state;
        // uniformsDa.uniforms.u_time.value += 0.05;
        // setState(uniformsDa);
        renderer.render(scene, camera);
    }

    return {
        init,
        animate
    }
}
