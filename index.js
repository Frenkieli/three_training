// 生成苦力怕並加到場景
function createCreeper(scene) {
  const creeperObj = new Creeper();
  scene.add(creeperObj.creeper);
}

function init() {
  let scene = new THREE.Scene();
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1.0);
  renderer.shadowMap.enable = true;
  document.body.appendChild(renderer.domElement);

  // 相機位置
  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(50, 50, 50); // 相機位置
  camera.lookAt(scene.position); // 相機焦點

  // 光源

  let pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(-20, 40, 20);
  scene.add(pointLight);

  // 產生苦力怕
  createCreeper(scene);

  // 簡單的地板
  const planeGeometry = new THREE.PlaneGeometry(60, 60);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI; // 使平面與 y 軸垂直，並讓正面朝上
  plane.position.set(0, -7, 0);
  scene.add(plane);
  let axes = new THREE.AxesHelper(20); // 參數為座標軸長度
  scene.add(axes);
  renderer.render(scene, camera);
}

init();
