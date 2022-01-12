import { OrbitControls } from "../lib/OrbitControls.js";

var renderer, scene, camera, tween, tweenBack;
var cameraControl, stats, gui;
var ambientLight, pointLight, spotLight, directionalLight, sphereLightMesh;
var rotateAngle = 0;
var invert = 1;
var creeperObj;
var startTracking = false;

var startRotateHead = false;
var startWalking = false;
var startScaleBody = false;

function tweenHandler() {
  let offset = { x: 0, z: 0, rotateY: 0 };
  let target = { x: 20, z: 20, rotateY: 0.7853981633974484 }; // 目標值

  // 苦力怕走動及轉身補間動畫
  const onUpdate = () => {
    // 移動
    creeperObj.feet.position.x = offset.x;
    creeperObj.feet.position.z = offset.z;
    creeperObj.head.position.x = offset.x;
    creeperObj.head.position.z = offset.z;
    creeperObj.body.position.x = offset.x;
    creeperObj.body.position.z = offset.z;

    // 轉身
    if (target.x > 0) {
      creeperObj.feet.rotation.y = offset.rotateY;
      creeperObj.head.rotation.y = offset.rotateY;
      creeperObj.body.rotation.y = offset.rotateY;
    } else {
      creeperObj.feet.rotation.y = -offset.rotateY;
      creeperObj.head.rotation.y = -offset.rotateY;
      creeperObj.body.rotation.y = -offset.rotateY;
    }
  };

  // 計算新的目標值
  const handleNewTarget = () => {
    // 限制苦力怕走路邊界
    if (camera.position.x > 30) target.x = 20;
    else if (camera.position.x < -30) target.x = -20;
    else target.x = camera.position.x;
    if (camera.position.z > 30) target.z = 20;
    else if (camera.position.z < -30) target.z = -20;
    else target.z = camera.position.z;

    const v1 = new THREE.Vector2(0, 1); // 原點面向方向
    const v2 = new THREE.Vector2(target.x, target.z); // 苦力怕面向新相機方向

    // 內積除以純量得兩向量 cos 值
    let cosValue = v1.dot(v2) / (v1.length() * v2.length());

    // 防呆，cos 值區間為（-1, 1）
    if (cosValue > 1) cosValue = 1;
    else if (cosValue < -1) cosValue = -1;

    // cos 值求轉身角度
    target.rotateY = Math.acos(cosValue);
  };

  // 朝相機移動
  tween = new TWEEN.Tween(offset)
    .to(target, 3000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      invert = -1;
      tweenBack.start();
    });

  // 回原點
  tweenBack = new TWEEN.Tween(offset)
    .to({ x: 0, z: 0, rotateY: 0 }, 3000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(onUpdate)
    .onComplete(() => {
      handleNewTarget(); // 計算新的目標值
      invert = 1;
      tween.start();
    });
}

// 生成苦力怕並加到場景
function createCreeper() {
  creeperObj = new Creeper();
  tweenHandler(creeperObj, camera);
  scene.add(creeperObj.creeper);
}

function initStats() {
  const stats = new Stats();
  stats.setMode(0);
  document.getElementById("stats").appendChild(stats.domElement);
  return stats;
}

// 點光源繞 Y 軸旋轉動畫
function pointLightAnimation() {
  if (rotateAngle > 2 * Math.PI) {
    rotateAngle = 0; // 超過 360 度後歸零
  } else {
    rotateAngle += 0.03; // 遞增角度
  }
  // 光源延橢圓軌道繞 Y 軸旋轉
  sphereLightMesh.position.x = 20 * Math.sin(rotateAngle);
  sphereLightMesh.position.z = 20 * Math.cos(rotateAngle);
  // 點光源位置與球體同步
  pointLight.position.copy(sphereLightMesh.position);
}

// 畫面初始化
function init() {
  // 建立場景
  scene = new THREE.Scene();

  // 顯示動畫影格
  stats = initStats();
  // 三軸座標輔助
  let axes = new THREE.AxesHelper(20);
  scene.add(axes);

  // 渲染器設定
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 渲染陰影
  renderer.shadowMap.enabled = true; // 設定需渲染陰影效果
  renderer.shadowMap.type = 2; // THREE.PCFSoftShadowMap

  // 相機設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(30, 30, 30);
  camera.lookAt(scene.position);

  // 建立 OrbitControls
  cameraControl = new OrbitControls(camera, renderer.domElement);
  cameraControl.enableDamping = true; // 啟用阻尼效果
  cameraControl.dampingFactor = 0.25; // 阻尼系數
  // cameraControl.autoRotate = true // 啟用自動旋轉

  // 簡單的地板
  const planeGeometry = new THREE.PlaneGeometry(60, 60);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, -7, 0);
  plane.receiveShadow = true; // 接受陰影
  scene.add(plane);

  // 產生苦力怕物件並加到場景
  createCreeper();

  // 設置環境光與聚光燈
  let ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // 設置聚光燈幫忙照亮物體
  let spotLight = new THREE.SpotLight(0xf0f0f0);
  spotLight.position.set(30, 20, 30);
  // spotLight.castShadow = true;
  // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
  scene.add(spotLight);

  let spotLight2 = new THREE.SpotLight(0xf0f0f0);
  spotLight2.position.set(-30, 20, -30);
  // spotLight2.castShadow = true;
  // let spotLight2Helper = new THREE.SpotLightHelper(spotLight2);
  // scene.add(spotLight2Helper);
  scene.add(spotLight2);

  // 移動點光源

  pointLight = new THREE.PointLight(0xccffcc, 1, 100); // 顏色, 強度, 距離
  pointLight.castShadow = true; // 這個光源會有陰影
  pointLight.position.set(-40, 40, 30);
  // let pointLightHelper = new THREE.PointLightHelper(pointLight);
  // scene.add(pointLightHelper);
  scene.add(pointLight);

  // 小球體模擬點光源實體
  const sphereLightGeo = new THREE.SphereGeometry(0.3);
  const sphereLightMat = new THREE.MeshBasicMaterial({ color: 0xccffcc });
  sphereLightMesh = new THREE.Mesh(sphereLightGeo, sphereLightMat);
  sphereLightMesh.castShadow = true;
  // sphereLightMesh.position.y = 16;
  sphereLightMesh.position.set(-40, 40, 30);

  scene.add(sphereLightMesh);

  // testLightTool(); // 光源測試
  // testCreeperMoveToll(); // 動畫測試
  testCreeperTaget(); // 動畫測試
  // 將渲染出來的畫面放到網頁上的 DOM
  document.body.appendChild(renderer.domElement);
}

function render() {
  stats.update();
  cameraControl.update();
  pointLightAnimation(); // 更新光點動畫
  // creeperObj.creeperHeadRotate(startRotateHead);
  // creeperObj.creeperFeetWalk(startWalking);
  // creeperObj.creeperScaleBody(startScaleBody);
  creeperObj.creeperFeetWalk(true);

  TWEEN.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

init();
render();

// 自動隨著畫面縮放
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function testCreeperTaget() {
  let datGUIControls = new (function () {
    this.startTracking = false;
  })();
  gui = new dat.GUI();
  gui.add(datGUIControls, "startTracking").onChange(function (e) {
    startTracking = e;
    console.log({
      startTracking,
      invert,
    });
    if (invert > 0) {
      if (startTracking) {
        tween.start();
      } else {
        tween.stop();
      }
    } else {
      if (startTracking) {
        tweenBack.start();
      } else {
        tweenBack.stop();
      }
    }
  });
}

function testCreeperMoveToll() {
  let datGUIControls = new (function () {
    this.startRotateHead = false;
    this.startWalking = false;
    this.startScaleBody = false;
  })();
  // dat.GUI 控制面板
  gui = new dat.GUI();
  gui.add(datGUIControls, "startRotateHead").onChange(function (e) {
    startRotateHead = e;
  });
  gui.add(datGUIControls, "startWalking").onChange(function (e) {
    startWalking = e;
  });
  gui.add(datGUIControls, "startScaleBody").onChange(function (e) {
    startScaleBody = e;
  });
}

function testLightTool() {
  // 光源測試

  let datGUIControls = new (function () {
    this.AmbientLight = true;
    this.PointLight = false;
    this.Spotlight = false;
    this.DirectionalLight = false;
  })();
  // 設置環境光 AmbientLight
  ambientLight = new THREE.AmbientLight(0xeeff00);
  scene.add(ambientLight);
  // ambientLight.visible = false;

  // 基本點光源 PointLight
  pointLight = new THREE.PointLight(0xeeff00);
  pointLight.castShadow = true;
  pointLight.position.set(-10, 20, 20);
  scene.add(pointLight);
  let pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);
  pointLight.visible = false;
  pointLightHelper.visible = false;

  // 設置聚光燈 SpotLight
  spotLight = new THREE.SpotLight(0xeeff00);
  spotLight.position.set(-10, 20, 20);
  spotLight.castShadow = true;
  scene.add(spotLight);
  let spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  spotLight.visible = false;
  spotLightHelper.visible = false;

  // 基本平行光 DirectionalLight
  directionalLight = new THREE.DirectionalLight(0xeeff00);
  directionalLight.position.set(-10, 20, 20);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  let directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
  );
  scene.add(directionalLightHelper);
  directionalLight.visible = false;
  directionalLightHelper.visible = false;

  gui = new dat.GUI();
  gui.add(datGUIControls, "AmbientLight").onChange(function (e) {
    ambientLight.visible = e;
  });
  gui.add(datGUIControls, "PointLight").onChange(function (e) {
    pointLight.visible = e;
    pointLightHelper.visible = e;
  });
  gui.add(datGUIControls, "Spotlight").onChange(function (e) {
    spotLight.visible = e;
    spotLightHelper.visible = e;
  });
  gui.add(datGUIControls, "DirectionalLight").onChange(function (e) {
    directionalLight.visible = e;
    directionalLightHelper.visible = e;
  });
}
