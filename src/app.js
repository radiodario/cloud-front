var THREE = require('three.js');

var renderer, scene, camera, stats;

var cloudMaker = require('./cloud.js');

var clouds = [],
    uniforms, attributes;

var vc1;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var colors = [
  0x22ffaa,
  0xff22aa,
  0xaaff22,
  0xffaa22,
  0x22aaff,
  0xaa22ff,
  0xfa2fa2,
  0x2222ff
];


init();
animate();

var step;

function init() {

  renderer = new THREE.WebGLRenderer();
  renderer.sortObjects = false;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );

  var aspect = WIDTH / HEIGHT;

  camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000 );
  camera.position.z = 300;

  scene = new THREE.Scene();

  var max = camera.position.z - camera.far;

  step = Math.abs(max/colors.length);

  console.log(step)
  // for (var i = colors.length-1; i >= 0; i--) {
  for (var i = colors.length - 1; i >= 0; i--) {
    var c = cloudMaker(camera, colors[i]);
    c.mesh.position.z += -step + (i * step);
    console.log("cloud with position", c.mesh.position.z);

    clouds.push(c);
    scene.add(c.mesh);
  }

  renderer.setClearColor(colors[colors.length -1 ]);


  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  render();
  // stats.update();

}

function render() {
  var time = Date.now() * 0.01;
  var minPos = camera.position.z;
  // iterate backwards

  var removeMesh;

  for (var i = clouds.length -1; i >= 0 ; i--) {
    clouds[i].update();
    if (clouds[i].mesh.position.z > (camera.position.z)) {

      removeMesh = clouds[i].mesh;
      renderer.setClearColor(clouds[i].col);
      clouds[i] = cloudMaker(camera, colors[i]);
      scene.add(clouds[i].mesh);
    }
  }

  scene.remove(removeMesh);

  camera.fov = 45;
  camera.updateProjectionMatrix();

  renderer.render( scene, camera );

}



