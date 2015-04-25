var THREE = require('three.js');

var id = 0;
var step = 300;
var numberOfPoints = 100;
var radius = 70;


// generates N random points in a unit circle
function RandCircularGeometry(N, scale) {

  var verts = []



  for (var i = 0; i < N; i++) {
    verts.push(randpoint(scale));
  }
  var geom = new THREE.Geometry();

  geom.vertices = verts;

  return geom;
}

function randpoint(scale) {

  var t = 2*Math.PI*Math.random();
  var u = Math.random()+Math.random();
  var r = ((u < 1) ? 1 - u : u);

  return new THREE.Vector3((r*Math.cos(t)) * scale, (r*Math.sin(t))*scale, 0 );


}

module.exports = function(cam, col) {

  var camera = cam;

  var thisId = id;

  var attributes = {
    size: { type: 'f', value: [] },
    ca:   { type: 'c', value: [] }

  };

  var uniforms = {

    amplitude: { type: "f", value: 1.0 },
    color:     { type: "c", value: new THREE.Color( 0xffffff ) },
    texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "img/disc.png" ) },

  };

  uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;

  var shaderMaterial = new THREE.ShaderMaterial( {
    uniforms:       uniforms,
    attributes:     attributes,
    vertexShader:   document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    transparent:    true,
    depthTest: false,
    depthWrite: false,
  });

  var dead = false;

  var maxDistance = Math.abs(camera.position.z - camera.far);

  var geometry = RandCircularGeometry(numberOfPoints, radius);

  var vc1 = geometry.vertices.length;

  var cloud = new THREE.PointCloud( geometry, shaderMaterial );

  cloud.position.z = camera.position.z - camera.far;

  console.log("pos", cloud.position.z);

  var life = step*id++;


  var vertices = cloud.geometry.vertices;
  var values_size = attributes.size.value;
  var values_color = attributes.ca.value;


  for ( var v = 0; v < vertices.length; v ++ ) {

    values_size[ v ] = 10;
    values_color[ v ] = new THREE.Color( col );

    if ( v < vc1 ) {

      // values_color[ v ].setHSL( 0.01 + 0.1 * ( v / vc1 ), 0.99, ( vertices[ v ].y + radius ) / ( 4 * radius ) );

    } else {

      values_size[ v ] = 40;
      // values_color[ v ].setHSL( 0.6, 0.75, 0.25 + vertices[ v ].y / ( 2 * radius ) );

    }

  }


  return {
    col : col,
    mesh : cloud,
    update: function() {

      var time = Date.now() * 0.0005;

      var distTravelled = cloud.position.z - (cam.position.z - cam.far);

      var distTravNorm = distTravelled/maxDistance;

      var speed = 10 * expStep(distTravNorm, 5, -0.5);

      cloud.position.z += 10 - speed;

      if (cloud.position.z > camera.position.z) {
        dead = true;
      }

      for( var i = 0; i < attributes.size.value.length; i ++ ) {

        if ( i < vc1 )
          attributes.size.value[ i ] = 16 + 512 * Math.sin( i + time );


      }

      attributes.size.needsUpdate = true;

    }

  }


}


function expStep( x, k, n )
{
    return Math.exp( -k*Math.pow(x,n) );
}
