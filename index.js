import { OrbitControls } from "../lib/OrbitControls.js";

let renderer, scene, camera;
let cameraControl, stats, gui;
let ambientLight, pointLight, spotLight, directionalLight;

let datGUIControls = new (function () {
  this.AmbientLight = true;
  this.PointLight = false;
  this.Spotlight = false;
  this.DirectionalLight = false;
})();

// 生成苦力怕並加到場景
function createCreeper() {
  const creeperObj = new Creeper();
  scene.add(creeperObj.creeper);
}

function initStats() {
  const stats = new Stats();
  stats.setMode(0);
  document.getElementById("stats").appendChild(stats.domElement);
  return stats;
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
  renderer.shadowMap.enabled = true;
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
  plane.receiveShadow = true; // 顯示陰影
  scene.add(plane);

  // 產生苦力怕物件並加到場景
  createCreeper();

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

  // 將渲染出來的畫面放到網頁上的 DOM
  document.body.appendChild(renderer.domElement);
}

function render() {
  stats.update();
  cameraControl.update();
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
