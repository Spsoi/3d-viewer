
let scene, camera, renderer, controls, hlight, directionalLight, light, light2, light3, light4, car;
let currentModel = 0;
let foldersName = [];
function init() {
  createScene();
  createCamera();
  createLights();
  createRenderer();
  createControls();
  loadModel(currentModel);
  animate();
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#5C5C5C');
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.rotation.y = 45 / 180 * Math.PI;
  camera.position.set(800, 100, 1000);
}

function createLights() {
  hlight = new THREE.AmbientLight(0x404040, 50);
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // light = new THREE.PointLight('#FDB813', 5);
  // light.position.set(0, 300, 500);
  // scene.add(light);

  // light2 = new THREE.PointLight('#FDB813', 10);
  // light2.position.set(500, 100, 0);
  // scene.add(light2);

  // light3 = new THREE.PointLight('#FDB813', 10);
  // light3.position.set(0, 100, -500);
  // scene.add(light3);

  // light4 = new THREE.PointLight('#FDB813', 10);
  // light4.position.set(-500, 300, 500);
  // scene.add(light4);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.enableInertia = true;
  controls.inertiaFactor = 0.9;
}

function loadModel(modelIndex) {
  currentModel = modelIndex;
  console.log(car);

  if (car) {
    scene.remove(car);
  }
  
  let loader = new THREE.GLTFLoader();
  console.log('loadModel');
  loader.load(`models/${foldersName[modelIndex]}/scene.gltf`, function (gltf) {
    car = gltf.scene.children[0];
    car.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);
  });
}

let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  let delta = clock.getDelta();

  controls.update(delta);

  renderer.render(scene, camera);
}

async function getFolders() {
  try {
    const response = await fetch('folder.php', {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });
    let data = await response.json();
    data =  JSON.parse(JSON.stringify(data));
    const propertyValues = Object.values(data);
    foldersName = propertyValues.filter(str => !str.includes('.'));
    init();
    return foldersName;
  } 
  catch (error) {
    console.error(error);
  }
}

getFolders().then(foldersName => {
  console.log(foldersName);
  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Предыдущая модель';
  prevBtn.style.position = 'absolute';
  prevBtn.style.top = '10px';
  prevBtn.style.left = '10px';
  prevBtn.classList.add("button", "button-primary");
  document.body.appendChild(prevBtn);
  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Следующая модель';
  nextBtn.style.position = 'absolute';
  nextBtn.style.top = '10px';
  nextBtn.style.right = '10px';
  nextBtn.classList.add("button", "button-secondary");
  document.body.appendChild(nextBtn);
  
  let currentModelIndex = 0;
  const totalModels = foldersName.length;
  
  function loadModelAtIndex(index) {
    if (car) {
      const parent = car.parent;
      parent.remove( car );
    }
    let loader = new THREE.GLTFLoader();
    const folderName = foldersName[index];
    loader.load(`models/${folderName}/scene.gltf`, function (gltf) {
      car = gltf.scene.children[0];
      car.scale.set(0.5, 0.5, 0.5);
      scene.add(gltf.scene);
    });
  }
  
  prevBtn.addEventListener('click', () => {
  currentModelIndex--;
  if (currentModelIndex < 0) {
    currentModelIndex = totalModels - 1;
  }
    loadModelAtIndex(currentModelIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    currentModelIndex++;
    if (currentModelIndex >= totalModels) {
      currentModelIndex = 0;
    }
      loadModelAtIndex(currentModelIndex);
    });
  }); 