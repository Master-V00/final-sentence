// Scene setup: creates Three.js scene and basic objects.
// Exposes window.GAME3D with useful references for game logic.
(function(){
  const container = document.getElementById('container');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 5, 25);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.6, 4);

  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080808);
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const spot = new THREE.PointLight(0xffffff, 1.1, 20);
  spot.position.set(3,4,3);
  scene.add(spot);

  // floor
  const floorGeo = new THREE.PlaneGeometry(30,30);
  const floorMat = new THREE.MeshStandardMaterial({ color:0x050505, roughness:0.9 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -1.1;
  scene.add(floor);

  // table
  const tableGeo = new THREE.BoxGeometry(3.4, 0.22, 1.7);
  const tableMat = new THREE.MeshStandardMaterial({ color:0x6b3d1a, metalness:0.05, roughness:0.6 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.set(0, -0.5, -0.4);
  scene.add(table);

  // man group (will try to load GLB then fallback to blocky)
  const man = new THREE.Group();
  scene.add(man);

  // head/body placeholders (initially used for fallback)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshStandardMaterial({color:0xffe0bd}));
  head.position.y = 0.9;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9,1.1,0.5), new THREE.MeshStandardMaterial({color:0x222222}));
  body.position.y = 0;
  const mask = new THREE.Mesh(new THREE.BoxGeometry(0.52,0.18,0.02), new THREE.MeshStandardMaterial({color:0x0a0a0a}));
  mask.position.set(0,0.9,0.27);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8), new THREE.MeshStandardMaterial({color:0xffffff}));
  eyeL.position.set(-0.11,0.92,0.29); eyeL.scale.set(1,1,0.8); eyeL.visible = false;
  const eyeR = eyeL.clone(); eyeR.position.x = 0.11;

  // assemble fallback man
  man.add(body);
  man.add(head);
  man.add(mask);
  man.add(eyeL);
  man.add(eyeR);

  // gun
  const gun = new THREE.Group();
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.9,8), new THREE.MeshStandardMaterial({color:0x222222}));
  barrel.rotation.z = Math.PI/2; barrel.position.set(0.8,0.6,0.05);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.15,0.22,0.45), new THREE.MeshStandardMaterial({color:0x111111}));
  grip.position.set(0.25,0.45,0.05);
  gun.add(barrel); gun.add(grip);
  man.add(gun);

  man.position.set(0,-0.35,-2.0);

  const rimLight = new THREE.SpotLight(0xfff2c9, 0.6, 10, Math.PI/6);
  rimLight.position.set(0,4,0);
  rimLight.target = table;
  scene.add(rimLight);

  // controls (disabled except for debug)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enabled = false;

  window.addEventListener('resize', ()=> {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Attempt to load assets/models/man.glb if present
  if (window.THREE && window.THREE.GLTFLoader) {
    try {
      const loader = new THREE.GLTFLoader();
      loader.setPath('assets/models/');
      loader.load('man.glb', function(gltf){
        // remove fallback parts
        man.clear();
        gltf.scene.traverse(n => { if (n.isMesh) n.castShadow = true; });
        gltf.scene.position.set(0,-0.6,-2.0);
        gltf.scene.scale.set(1,1,1);
        man.add(gltf.scene);
        console.log('Loaded man.glb');
      }, undefined, function(err){
        console.warn('No man.glb or failed to load - using fallback.');
      });
    } catch(e) {
      console.warn('GLTFLoader not available as module - using fallback.');
    }
  }

  // expose helpful refs
  window.GAME3D = {
    container, scene, camera, renderer, man, table, mask, head, eyeL, eyeR,
    updateNameTagPosition: function(){
      const nameTag = document.getElementById('nameTag');
      const worldPos = new THREE.Vector3(0, table.position.y + 0.14, table.position.z - 0.4);
      const proj = worldPos.clone().project(camera);
      const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
      const y = ( -proj.y * 0.5 + 0.5) * window.innerHeight;
      nameTag.style.left = `${x}px`;
      nameTag.style.top = `${y}px`;
      nameTag.textContent = "لاعب غير معروف";
    }
  };

  // simple render loop
  const clock = new THREE.Clock();
  (function render(){
    const dt = clock.getDelta();
    // small breathing animation
    const t = performance.now() * 0.001;
    man.rotation.y = Math.sin(t*0.3) * 0.02;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  })();

})();
