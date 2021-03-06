// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

//require('three/examples/jsm/loaders/GLTFLoader.js')

//console.log(GLTFLoader)

const canvasSketch = require('canvas-sketch');
const { RGBA_ASTC_10x5_Format } = require('three');

const settings = {
  // dimensions: [200, 200],
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl'
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('#000000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0.2, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader()

  const texture = loader.load('earth.jpg')
  const textureMoon = loader.load('moon.jpg')

  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: texture
  });

  const materialMoon = new THREE.MeshStandardMaterial({ map: textureMoon })

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const moonGroup = new THREE.Group()

  const meshMoon = new THREE.Mesh(geometry, materialMoon)
  meshMoon.position.set(1.5, 0.5, 0.5)
  meshMoon.scale.setScalar(0.25)
  moonGroup.add(meshMoon)
  scene.add(moonGroup)

  const light = new THREE.PointLight('white', 1.5)
  light.position.set(-1, 1, -2)
  scene.add(light)

  scene.add(new THREE.PointLightHelper(light, 0.2))
  scene.add(new THREE.GridHelper(10, 20))
  scene.add(new THREE.AxesHelper(5))

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      moonGroup.rotation.y = time * 0.1
      mesh.rotation.y = time * 0.2
      meshMoon.rotation.y = time * 0.1
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
