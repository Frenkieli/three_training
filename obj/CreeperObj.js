class Creeper {
  constructor() {
    // 苦力怕臉部貼圖
    const headMap = new THREE.TextureLoader().load(
      "https://dl.dropboxusercontent.com/s/bkqu0tty04epc46/creeper_face.png"
    );
    // 苦力怕皮膚貼圖
    const skinMap = new THREE.TextureLoader().load(
      "https://dl.dropboxusercontent.com/s/eev6wxdxfmukkt8/creeper_skin.png"
    );

    // 身體與腳的材質設定
    const skinMat = new THREE.MeshStandardMaterial({
      roughness: 0.3, // 粗糙度
      metalness: 0.8, // 金屬感
      // transparent: true, // 透明與否
      // opacity: 0.9, // 透明度
      side: THREE.DoubleSide, // 雙面材質
      map: skinMap, // 皮膚貼圖
    });

    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4);
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2);
    const footGeo = new THREE.BoxGeometry(2, 3, 2);

    // 準備頭部與臉的材質
    const headMaterials = [];
    for (let i = 0; i < 6; i++) {
      let map;

      if (i === 4) map = headMap;
      else map = skinMap;

      headMaterials.push(new THREE.MeshStandardMaterial({ map: map }));
    }

    // 頭
    this.head = new THREE.Mesh(headGeo, headMaterials);
    this.head.position.set(0, 6, 0);
    this.head.rotation.y = 0.5 // 稍微的擺頭

    // 身體
    this.body = new THREE.Mesh(bodyGeo, skinMat);
    this.body.position.set(0, 0, 0);

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, skinMat);
    this.foot1.position.set(-1, -5.5, 2);
    this.foot2 = this.foot1.clone(); // 剩下三隻腳都複製第一隻的 Mesh
    this.foot2.position.set(-1, -5.5, -2);
    this.foot3 = this.foot1.clone();
    this.foot3.position.set(1, -5.5, 2);
    this.foot4 = this.foot1.clone();
    this.foot4.position.set(1, -5.5, -2);

    // 將四隻腳組合為一個 group
    this.feet = new THREE.Group();
    this.feet.add(this.foot1);
    this.feet.add(this.foot2);
    this.feet.add(this.foot3);
    this.feet.add(this.foot4);

    // 將頭、身體、腳組合為一個 group
    this.creeper = new THREE.Group();
    this.creeper.add(this.head);
    this.creeper.add(this.body);
    this.creeper.add(this.feet);

    // 苦力怕投影設定，利用 traverse 遍歷各個子元件設定陰影
    this.creeper.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }
}
