import React, {memo, useEffect, useState, useReducer} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import pic from "../src/img/lm-1.png";

const todosReducer = (state, action) => {
    state = action;
    return state;
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const [controls, setControls] = useReducer(todosReducer, []);//
    const {init, animate} = operation(renderer, scene, camera);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        init(setRenderer, setCamera, setScene, setControls);
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
        <p>我是傻子全景</p>
    );
});

// 所有操作
const operation = (renderer, scene, camera) => {
    // 初始化
    const init = (setRenderer, setCamera, setScene, setControls) => {
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

        models(scene);

        // 光源
        light(scene);
    }

    // 全景模型
    const models = (scene) => {
        const box = new THREE.BoxGeometry(200, 200, 200);
        const texture = new THREE.TextureLoader();
        const pic1 = texture.load(pic);
        const pic2 = texture.load(pic);
        const pic3 = texture.load(pic);
        const pic4 = texture.load(pic);
        const pic5 = texture.load(pic);
        const pic6 = texture.load(pic);

        const boxPanel = [
            new THREE.MeshBasicMaterial( { map: pic1} ),
            new THREE.MeshBasicMaterial( { map: pic2} ),
            new THREE.MeshBasicMaterial( { map: pic3} ),
            new THREE.MeshBasicMaterial( { map: pic4} ),
            new THREE.MeshBasicMaterial( { map: pic5} ),
            new THREE.MeshBasicMaterial( { map: pic6} ),
        ];

        const mesh = new THREE.Mesh(box, boxPanel);
        mesh.geometry.scale( 1, 1, - 1 );
        scene.add(mesh);
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
    }

    return {
        init,
        animate
    }
}
