
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
