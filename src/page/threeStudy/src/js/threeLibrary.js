
// 悬停弹框 跟随鼠标
import * as THREE from "three";

export const bouncHover = (scene) => {
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
export const clickEvent = (scene, camera, renderer, key, callBack, depth = false) => {
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
    }

    window.addEventListener( 'click', clickSimulation, false );
}


// 唯一标识
export const generateUUID = () => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
