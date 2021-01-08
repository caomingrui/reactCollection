
// 贴图与精灵对象联系
import * as THREE from "three";
import Apic from "../src/img/A.jpg";
import pic2 from "../src/img/2.jpg";
import pic1 from "../src/img/1.jpg";
import spritePic from "../src/img/lm-1.png";
import Tree from "../src/img/tree.png";

const useTest = (scene, renderer, camera) => {

    const test = () => {
        let box = new THREE.BoxGeometry(20, 20,20);
        let material = new THREE.MeshBasicMaterial({
            color: 0x598d77,
            wireframe: true
        })
        scene.add(new THREE.Mesh(box, material));
    }

    const textureTest = () => {
        let doiArr = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(20, 0, 0),
            new THREE.Vector3(20, 20, 0),
            new THREE.Vector3(0, 20, 0),
        ];
        let shape = new THREE.Shape(doiArr);
        let geometryTest = new THREE.ShapeGeometry(shape, 30);
        let material = new THREE.MeshBasicMaterial({
            color: 0xc2b0bb,
            side: THREE.DoubleSide
        });

        let textureLoader = new THREE.TextureLoader();// 加载颜色纹理贴图
        let texture = textureLoader.load(Apic);// 加载凹凸贴图
        let textureBump = textureLoader.load(pic2);
        texture.repeat.set(0.05, 0.05);
        let materials = new THREE.MeshPhongMaterial({
            color: 0x7a6aac,
            normalMap: texture,
            normalScale: new THREE.Vector2(4, 4)
        }); //材质对象Material

        // 平行光
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
        directionalLight.position.set(0, 0, 50);
        // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
        // directionalLight.target = geometryTest;
        scene.add(directionalLight);

        scene.add(new THREE.Mesh(geometryTest, materials));
    }

    // 凹凸贴图
    const AbumpMap = () => {
        let doiArr = [
            new THREE.Vector3(20, -10, 0),
            new THREE.Vector3(0, -10, 0),
            new THREE.Vector3(0, -30, 0),
            new THREE.Vector3(20, -30, 0),
        ];
        let shape = new THREE.Shape(doiArr);
        // 拉伸
        // 扫描
        // let curvePath = new THREE.SplineCurve3([ // 设置扫描路径
        //     new THREE.Vector3( 0, 0, 0 ),
        //     new THREE.Vector3( 0, 0, 10 )
        // ]);
        let geometryTest = new THREE.ShapeGeometry(shape, 30);
        let geometry = new THREE.ExtrudeGeometry(
            shape,
            {
                amount:20,//拉伸长度
                bevelEnabled:false//无倒角
            }
        );
        let texture = new THREE.TextureLoader();
        let pic1Obj = texture.load(pic1);
        let pic2Obj = texture.load(pic2);

        let material = new THREE.MeshPhongMaterial({
            map: pic1Obj,
            bumpMap: pic2Obj,
            bumpScale: 3
        });
        pic1Obj.repeat.set(.07, .07);
        pic2Obj.repeat.set(.07, .07);
        pic2Obj.wrapS = THREE.RepeatWrapping;// 水平
        pic2Obj.wrapT = THREE.RepeatWrapping;// 垂直
        pic1Obj.wrapS = THREE.RepeatWrapping;// 水平
        pic1Obj.wrapT = THREE.RepeatWrapping;// 垂直
        scene.add(new THREE.Mesh(geometry, material));

        let ambient = new THREE.AmbientLight(0x53555c);
        scene.add(ambient);
    }

    // 精灵模型Sprite
    const elfModel = () => {
        let textTrue = new THREE.TextureLoader().load(spritePic);
        // for (let i = 0;i < 100; i++) {
        // 创建精灵材质对象SpriteMaterial
        let spriteMaterial = new THREE.SpriteMaterial({
            color: 0x56669e,
            rotation: Math.PI / 4, // 选择精灵对象45度， 弧度值
            map: textTrue,
        });
        //创建精灵模型对象， 不需要几何体geometry参数
        let sprite = new THREE.Sprite(spriteMaterial);
        scene.add(sprite);

        // 控制精灵大小，比如可视化中精灵大小表征数据大小
        sprite.scale.set(3, 3, 1); //// 只需要设置x、y两个分量就可以
        let k1 = Math.random() - .5;
        let k2 = Math.random() - .5;
        let k3 = Math.random() - .5;
        sprite.position.set(50 * k1, 50 * k2, 50 * k3)
        // }
    }

    // 精灵模型test 森林
    const forest = () => {
        const texture = new THREE.TextureLoader();
        const tree = texture.load(Tree);

        for (let i=0;i<30;i++) {
            let k1 = Math.random() - .5;
            let k2 = Math.random() - .5;
            let k3 = Math.random() - .1;
            TreeObj(tree, [k1, k2, k3]);
        }
    }

    // 创建坡度
    const hill = () => {
        let doiArr = [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
        ];
    }

    // 创建树的精灵对象
    const TreeObj = (pic, arr) => {
        const spriteMaterial = new THREE.SpriteMaterial({
            color: 0x7baa88,
            map: pic
        });
        let sprite = new THREE.Sprite(spriteMaterial);

        function renderTest() {
            if (renderer != undefined) {
                sprite.position.y -= .5;
                if (sprite.position.y <= -20 ) {
                    sprite.position.y = 30;
                }
                scene.add(sprite);
                renderer.render(scene, camera); //执行渲染操作
                requestAnimationFrame(renderTest);//请求再次执行渲染函数render，渲染下一帧
            }
        }
        renderTest()
        scene.add(sprite);
        sprite.scale.set(3, 3, 1);
        sprite.position.set(50 * arr[0], 10 * arr[2], 50 * arr[1])
    }

    return {
        test,
        textureTest,
        AbumpMap,
        elfModel,
        forest
    }
}

export default useTest;
