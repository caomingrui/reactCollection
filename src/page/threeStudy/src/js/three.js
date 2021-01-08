import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// 加载必须
export function loadMustBe(setRenderer, setCamera, setScene, elem) {
    console.log(elem)
    let renderer = new THREE.WebGL1Renderer({
        canvas: elem,
        antialias: true,
        alpha: true
    });

    // let width = (document.getElementById('container').getBoundingClientRect().width - 20);
    // // let height = document.getElementById('container').getBoundingClientRect().height;
    // let height = 770;
    // renderer.setSize( width, height);

    renderer.setSize( elem.offsetWidth, elem.offsetHeight);
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

// 渲染
export function loadRender(camera, renderer, scene) {
    let controls = new OrbitControls(camera, renderer.domElement);
    function aa() {
        renderer.render(scene, camera)
    }

    controls.addEventListener('change', aa);
    renderer.render(scene, camera);
}
