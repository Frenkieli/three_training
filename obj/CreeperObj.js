class Creeper {
  constructor() {
    // 宣告頭、身體、腳幾何體大小
    const headGeo = new THREE.BoxGeometry(4, 4, 4);
    const bodyGeo = new THREE.BoxGeometry(4, 8, 2);
    const footGeo = new THREE.BoxGeometry(2, 3, 2);

    // 馮氏材質設為綠色
    const creeperMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    // 頭
    this.head = new THREE.Mesh(headGeo, creeperMat);
    this.head.position.set(0, 6, 0);

    // 身體
    this.body = new THREE.Mesh(bodyGeo, creeperMat);
    this.body.position.set(0, 0, 0);

    // 四隻腳
    this.foot1 = new THREE.Mesh(footGeo, creeperMat);
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
  }
}
