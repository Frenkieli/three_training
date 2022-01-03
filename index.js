import { OrbitControls } from "../lib/OrbitControls.js";

let renderer, scene, camera;
let cameraControl, stats;

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
  scene = new THREE.Scene();

  // 相機設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(30, 30, 30);
  camera.lookAt(scene.position);

  // 三軸座標輔助
  let axes = new THREE.AxesHelper(20);
  scene.add(axes);

  stats = initStats();

  // 渲染器設定
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

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
  scene.add(plane);

  // 產生苦力怕物件並加到場景
  createCreeper();

  // 簡單的 spotlight 照亮物體
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-10, 40, 30);
  scene.add(spotLight);
  // let spotHelper = new THREE.SpotLightHelper(spotLight)
  // scene.add(spotHelper)

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
