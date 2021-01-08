import React, {memo, useEffect, useState, useReducer} from "react";
import { loadMustBe, loadRender } from '../src/js/three';
import useTest from "./mapTest";
import * as THREE from 'three';
import {SkinnedMesh} from "three";
import vr from '../src/img/vr.png'
import modelTest from '../src/img/Kirche3D.obj';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import axios from "axios";
import Bee from "../src/img/Bee.glb";
import {ThreeMFLoader} from "three/examples/jsm/loaders/3MFLoader";

const todosReducer = (state, action) => {
    state = action;
    return state;
}

// 清除节点
const clearNode = () => {
    let elements = document.querySelectorAll('canvas');
    for(let i = elements.length - 1; i >= 0; i--) {
        elements[i].parentNode.removeChild(elements[i]);
    }
}

export default memo(() => {
    const [renderer, setRenderer] = useReducer(todosReducer, ''); // 渲染器
    const [camera, setCamera] = useReducer(todosReducer, '');     // 相机
    const [scene, setScene] = useReducer(todosReducer, '');       // 场景
    const [boolValue, setBoolValue] = useState(false);
    const {Bone} = useSkeletal(scene, renderer, camera);
    const { loadModelObj, loadBee } = loadModel(scene, renderer, camera);
    const [canvasWidth, setCanvasWidth] = useState(1000);
    const {testABounc, elvesBounc} = bouncHover(scene);

    useEffect(() => {
        console.log("组件挂载完成之后执行:");
        const width = (document.getElementById('container').getBoundingClientRect().width - 20);
        setCanvasWidth(width);
        loadMustBe(setRenderer, setCamera, setScene, document.getElementById('canvas'));
    },[])

    useEffect(() => {
        if(boolValue) {
            console.log("依赖更新了呀");
            setBoolValue(false);
            // Bone();
            // panorama(scene);
            loadModelObj();
            loadBee();
            // 面
            bottomSurface(scene);
            console.log(scene)
            // 点击模型


            clickEvent(scene, camera, renderer, 'house', (res) => {
                console.log('我是house');
                console.log(res);

                // let model = testABounc();
                let model = elvesBounc('我是城堡');
                const {x, y, z} = res.point;
                model.position.set(-10 + x, 20 + y, z);
                scene.add(model);
                renderer.render(scene, camera);
                // setTimeout(() => {
                //     console.log(scene);
                //     let arr = scene;
                //     scene.children.map((res, ind) => {
                //         if (res.name == 'surfaceModel') {
                //             scene.remove(res);
                //         }
                //     })
                //     loadRender(camera, renderer, arr);
                // }, 1000)
            }, true);

            clickEvent(scene, camera, renderer, 'bee110', (res) => {
                console.log('我是bee');
                console.log(res);

                let model = elvesBounc('我是小蜜蜂');
                const {x, y, z} = res.point;
                model.position.set(-10 + x, 20 + y, z);
                scene.add(model);
                renderer.render(scene, camera);
            }, true);


            loadRender(camera, renderer, scene);
        }
        setBoolValue(true);
    },[renderer])

    return (
        <>
            { canvasWidth }
            <canvas width='1000' height='700' style={{width: canvasWidth + 'px'}} id="canvas"></canvas>
        </>
    )
})


// 骨骼动画 作废
const useSkeletal = (scene, renderer, camera) => {
    // 骨头关节
    const Bone = () => {
        // 设置三个关节
        const Bone1 = new THREE.Bone(); // 作为根关节
        const Bone2 = new THREE.Bone();
        const Bone3 = new THREE.Bone();
        // 设置父子关系 多个骨头关节构成一个树结构
        Bone1.add(Bone2);
        Bone2.add(Bone3);
        // 设置关节之间相对位置 根关节默认（0， 0， 0）
        Bone2.position.y = 60;// 2相对1位置
        Bone3.position.y = 40;// 3相对2位置

        skeleton([Bone1, Bone3, Bone3]);
    }

    // 骨架
    const skeleton = (arr) => {
        // 所有Bone 对象插入到Skeletal中
        // const skeleton = new THREE.Skeleton(arr);
        //
        // console.log(skeleton.bones);
        // 骨骼关联网络模型
        // SkinnedMesh.add(arr[0]);  // 根骨头关节添加到网络模型
        // SkinnedMesh.bind(skeleton);// 网络模型绑定到骨骼系统


        /**
         * 创建骨骼网格模型SkinnedMesh
         */
// 创建一个圆柱几何体，高度120，顶点坐标y分量范围[-60,60]
        var geometry = new THREE.CylinderGeometry(5, 10, 120, 50, 300);
        geometry.translate(0, 60, 0); //平移后，y分量范围[0,120]
        console.log("name", geometry.vertices); //控制台查看顶点坐标
//
        /**
         * 设置几何体对象Geometry的蒙皮索引skinIndices、权重skinWeights属性
         * 实现一个模拟腿部骨骼运动的效果
         */
//遍历几何体顶点，为每一个顶点设置蒙皮索引、权重属性
//根据y来分段，0~60一段、60~100一段、100~120一段
        for (var i = 0; i < geometry.vertices.length; i++) {
            var vertex = geometry.vertices[i]; //第i个顶点
            if (vertex.y <= 60) {
                // 设置每个顶点蒙皮索引属性  受根关节Bone1影响
                geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
                // 设置每个顶点蒙皮权重属性
                // 影响该顶点关节Bone1对应权重是1-vertex.y/60
                geometry.skinWeights.push(new THREE.Vector4(1 - vertex.y / 60, 0, 0, 0));
            } else if (60 < vertex.y && vertex.y <= 60 + 40) {
                // Vector4(1, 0, 0, 0)表示对应顶点受关节Bone2影响
                geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0));
                // 影响该顶点关节Bone2对应权重是1-(vertex.y-60)/40
                geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 60) / 40, 0, 0, 0));
            } else if (60 + 40 < vertex.y && vertex.y <= 60 + 40 + 20) {
                // Vector4(2, 0, 0, 0)表示对应顶点受关节Bone3影响
                geometry.skinIndices.push(new THREE.Vector4(2, 0, 0, 0));
                // 影响该顶点关节Bone3对应权重是1-(vertex.y-100)/20
                geometry.skinWeights.push(new THREE.Vector4(1 - (vertex.y - 100) / 20, 0, 0, 0));
            }
        }
// 材质对象
        var material = new THREE.MeshPhongMaterial({
            skinning: true, //允许蒙皮动画
            // wireframe:true,
        });
// 创建骨骼网格模型
        var SkinnedMesh = new THREE.SkinnedMesh(geometry, material);
        SkinnedMesh.position.set(0, 120, 50); //设置网格模型位置
        SkinnedMesh.rotateX(Math.PI); //旋转网格模型
        scene.add(SkinnedMesh); //网格模型添加到场景中

        /**
         * 骨骼系统
         */
        var Bone1 = new THREE.Bone(); //关节1，用来作为根关节
        var Bone2 = new THREE.Bone(); //关节2
        var Bone3 = new THREE.Bone(); //关节3
// 设置关节父子关系   多个骨头关节构成一个树结构
        Bone1.add(Bone2);
        Bone2.add(Bone3);
// 设置关节之间的相对位置
//根关节Bone1默认位置是(0,0,0)
        Bone2.position.y = 60; //Bone2相对父对象Bone1位置
        Bone3.position.y = 40; //Bone3相对父对象Bone2位置

// 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
        var skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
// console.log(skeleton.bones);
// 返回所有关节的世界坐标
// skeleton.bones.forEach(elem => {
//   console.log(elem.getWorldPosition(new THREE.Vector3()));
// });
//骨骼关联网格模型
        SkinnedMesh.add(Bone1); //根骨头关节添加到网格模型
        SkinnedMesh.bind(skeleton); //网格模型绑定到骨骼系统
        console.log(SkinnedMesh);
        /**
         * 骨骼辅助显示
         */
        var skeletonHelper = new THREE.SkeletonHelper(SkinnedMesh);
        scene.add(skeletonHelper);

// 转动关节带动骨骼网格模型出现弯曲效果  好像腿弯曲一样
        skeleton.bones[1].rotation.x = 0.5;
        skeleton.bones[2].rotation.x = 0.5;


        var n = 0;
        var T = 50;
        var step = 0.01;
// 渲染函数
        function render() {
            renderer.render(scene, camera);
            requestAnimationFrame(render);
            n += 1;
            if (n < T) {
                // 改变骨关节角度
                skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step;
                skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step;
                skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x + 2 * step;
            }
            if (n < 2 * T && n > T) {
                skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step;
                skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step;
                skeleton.bones[2].rotation.x = skeleton.bones[2].rotation.x - 2 * step;
            }
            if (n === 2 * T) {
                n = 0;
            }
        }
        render();
    }

    return {
        Bone
    }
}

// 全景
const panorama = (scene) => {
    const circle = new THREE.SphereGeometry(20, 50, 50);
    circle.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader().load(vr);
    const material = new THREE.MeshPhongMaterial({
        map: texture
    });

    // var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
    // directionalLight.position.set(0, 0, 10);
    // // // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->
    // // directionalLight.target = material;
    // scene.add(directionalLight);

    scene.add(new THREE.Mesh(circle, material));
}

// 加载模型
const loadModel = (scene, renderer, camera) => {
    // 请求 http://localhost/3d/low.obj
    const requestGet = () => {
        axios.get('/data/3d/Bee.glb')
            .then(res => {
                console.log(res);
            })
    }

    // 加载OBJ
    const loadModelObj = () => {
        const loadObj = new OBJLoader();
        requestGet();
        // // 平行光-->
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算-->
        directionalLight.position.set(10, 10, 1);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0-->
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 10;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.fov = 20;

        scene.add(directionalLight);

        loadObj.load('https://cywarr.github.io/small-shop/Kirche3D.obj', function (obj) {
            let ambient = new THREE.AmbientLight(0x444444);
            scene.add(ambient);
            console.log(obj);
            obj.position.set(-5, 0, 25);
            obj.rotateX(-Math.PI/2)
            // obj.rotation.set(-Math.PI/2, Math.PI/2, Math.PI/4);
            // obj.scale.set(1, 1, 1); //放大obj组对象
            // obj.children[0].material.color.set(0xff0000);
            obj.children[0].material = new THREE.MeshPhongMaterial({
                color: 0xa57a7a,
                metalness: 0.6
            })

            directionalLight.target = obj;
            scene.add(directionalLight);


            // 设置产生投影的网格模型
            obj.castShadow = true;
            obj.name = 'house';
            console.log(obj)
            scene.add(obj);
        });
    }

    // 加载glb 小蜜蜂
    const loadBee = () => {
        const loader = new GLTFLoader();

        loader.load('http://localhost:3000/static/media/Bee.f791180e.glb', (obj) => {
            console.log(obj)
            // obj.position.set(-5, 0, 25);
            obj.scene.name = 'bee';
            scene.add(obj.scene);
        });

        // clickEvent(scene, camera, 'plane', (res) => {
        //     res.object.scale.set(1.5, 1.5, 1.5);
        //     res.object.material.color.set( 0xec8b8b );
        //     setTimeout(() => {
        //         res.object.scale.set(1, 1, 1);
        //         scene.add(res.object);
        //         renderer.render(scene, camera);
        //     }, 1000)
        //     // res.object.MeshPhongMaterial
        //     scene.add(res.object);
        //     renderer.render(scene, camera);
        // });
    }

    return {
        loadModelObj,
        loadBee
    }
}

// 底部平面
const bottomSurface = (screen) => {
    const doiArr = [
        new THREE.Vector3(30, 1, 0),
        new THREE.Vector3(30, 0, 0),
        new THREE.Vector3(-30, -1, 0),
        new THREE.Vector3(-30, 0, 0),
    ];

    const plane = new THREE.Shape(doiArr);
    // 填充
    const geometryBottom = new THREE.ShapeGeometry(plane, 30);
    // 拉伸
    const geometryTensile = new THREE.ExtrudeGeometry(
        plane,
        {
            amount:60,//拉伸长度
            bevelEnabled:false,//无倒角
        }
    );

    const material = new THREE.MeshPhongMaterial({
        color: 0xf0f6f6
    })

    const planeObj = new THREE.Mesh(geometryTensile, material);
    planeObj.receiveShadow = true;
    planeObj.name = 'plane';
    screen.add(planeObj);
}

// 悬停弹框 跟随鼠标
const bouncHover = (scene) => {
    // text style 这个操作很秀
    const textStyle = (text) => {
        let width = 512, height = 256;
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#C3C3C3';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 50 +'px " bold';
        ctx.fillStyle = '#2891FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2,height/2);
        return canvas;
    }

    // 测试弹框A
    const testABounc = (location) => {
        const plane = new THREE.PlaneGeometry(30, 30);

        const material = new THREE.MeshBasicMaterial({
            color: 0xe44e4e,
            side: THREE.DoubleSide,
            map: new THREE.CanvasTexture(textStyle('Hello THREE'))
        });

        console.log(plane.vertices)
        // plane.vertices = location;
        const surfaceModel = new THREE.Mesh(plane, material);
        surfaceModel.name = 'surfaceModel';
        // scene.add(surfaceModel);
        return surfaceModel;
    }

    // 精灵弹框
    const elvesBounc = (text) => {
        const spriteMaterial = new THREE.SpriteMaterial({
            color: 0xdcdfd3,
            map: new THREE.CanvasTexture(textStyle(text))
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 10, 1);
        sprite.name = 'bounc';
        return sprite;
    }

    return {
        testABounc,
        elvesBounc
    }
}

/**
 * 点击触发事件
 * @param { object } scene 场景
 * @param { object } camera 相机对象
 * @param { strig } key 点击模型名称name
 * @param { Function } callBack 点击触发动作
 * @param { Boolean } depth 深度寻找
 * */
const clickEvent = (scene, camera, renderer, key, callBack, depth = false) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function clickSimulation(event) {
        event.preventDefault();     //阻止默认事件
        event.stopPropagation();    //阻止传播
        // 全屏使用x | y 坐标
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = (event.clientY / window.innerWidth) * 2 + 1;

        let mainCanvas = document.querySelector('canvas');
        // 局部使用x | y 坐标
        mouse.x = ( (event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects( scene.children, true );

        // 简易版去重
        const arr = [];
        intersects.map(( res, ind) => {
            if ( arr.length == 0 ) {
                arr.push( res )
            }
            else {
                arr.map( da => {
                    if (res.object.uuid != da.object.uuid) {
                        arr.push( res );
                    }
                });
            }
        });

        arr.map( res => {
            if ( !depth ) {
                if ( res.object.name == key ) {
                    callBack( res );
                }
            }
            else {
                if ( res.object.parent.name == key ) {
                    callBack( res );
                }
            }
        });

        if (arr.length == 0) { // 点击空白关闭弹框
            scene.children.map(res => {
                if (res.name == 'bounc') {
                    scene.remove(res);
                    renderer.render(scene, camera);
                }
            });
        }
    }

    window.addEventListener( 'click', clickSimulation, false );
}
