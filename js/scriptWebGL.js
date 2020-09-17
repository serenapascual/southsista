/** SHADER SOURCE CODE */
const vertexShaderSource = `\n
attribute vec3 position;\n
uniform mat4 Pmatrix;\n
uniform mat4 Vmatrix;\n
uniform mat4 Mmatrix;\n
attribute vec3 color;\n
varying vec3 vColor;\n
void main(void) {\n
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n
  vColor=color;\n
}`;

const fragmentShaderSource = `\n
precision mediump float;\n
varying vec3 vColor;\n
void main(void) {\n
gl_FragColor = vec4(vColor, 1.);\n
}`;

function getShader(source, type, typeString, context) {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    alert(`Error in ${typeString} shader: ${context.getShaderInfoLog(shader)}`);
    return false;
  }
  return shader;
}

/** MAIN */
function main() {
  const CANVAS = document.getElementById('canvas');
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  // Capture mouse events
  const AMORTIZATION = 0.95;
  let drag = false;
  let oldX;
  let oldY;
  let dX = 0;
  let dY = 0;
  let theta;
  let phi;

  function mouseDown(e) {
    drag = true;
    oldX = e.pageX;
    oldY = e.pageY;
    e.preventDefault();
    return false;
  }

  function mouseUp(e) {
    drag = false;
  }

  function mouseMove(e) {
    if (!drag) return false;
    dX = (e.pageX - oldX) * 2 * Math.PI / CANVAS.width;
    dY = (e.pageY - oldY) * 2 * Math.PI / CANVAS.height;
    theta += dX;
    phi += dY;
    oldX = e.pageX;
    oldY = e.pageY;
    e.preventDefault();
  }

  CANVAS.addEventListener('mousedown', mouseDown, false);
  CANVAS.addEventListener('mouseup', mouseUp, false);
  CANVAS.addEventListener('mouseout', mouseUp, false);
  CANVAS.addEventListener('mousemove', mouseMove, false);

  // Get WebGL context
  let GL;
  try {
    GL = CANVAS.getContext('experimental-webgl', { antialias: true });
  } catch (e) {
    alert('Your browser is not compatible with WebGL :-(');
    return false;
  }

  // Create shaders and shader program
  const vertexShader = getShader(vertexShaderSource, GL.VERTEX_SHADER, 'VERTEX', GL);
  const fragmentShader = getShader(fragmentShaderSource, GL.FRAGMENT_SHADER, 'FRAGMENT', GL);

  let shaderProgram = GL.createProgram();
  GL.attachShader(shaderProgram, vertexShader);
  GL.attachShader(shaderProgram, fragmentShader);
  GL.linkProgram(shaderProgram);

  // Link GLSL variables to js constants
  const _Pmatrix = GL.getUniformLocation(shaderProgram, 'Pmatrix');
  const _Vmatrix = GL.getUniformLocation(shaderProgram, 'Vmatrix');
  const _Mmatrix = GL.getUniformLocation(shaderProgram, 'Mmatrix');
  const _color = GL.getAttribLocation(shaderProgram, 'color');
  const _position = GL.getAttribLocation(shaderProgram, 'position');

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  GL.useProgram(shaderProgram);

  // Geometry data
  const cubeVertices = [
    -1, -1, -1, 1, 1, 0,
    1, -1, -1, 1, 1, 0,
    1, 1, -1, 1, 1, 0,
    -1, 1, -1, 1, 1, 0,

    -1, -1, 1, 0, 0, 1,
    1, -1, 1, 0, 0, 1,
    1, 1, 1, 0, 0, 1,
    -1, 1, 1, 0, 0, 1,

    -1, -1, -1, 0, 1, 1,
    -1, 1, -1, 0, 1, 1,
    -1, 1, 1, 0, 1, 1,
    -1, -1, 1, 0, 1, 1,

    1, -1, -1, 1, 0, 0,
    1, 1, -1, 1, 0, 0,
    1, 1, 1, 1, 0, 0,
    1, -1, 1, 1, 0, 0,

    -1, -1, -1, 1, 0, 1,
    -1, -1, 1, 1, 0, 1,
    1, -1, 1, 1, 0, 1,
    1, -1, -1, 1, 0, 1,

    -1, 1, -1, 0, 1, 0,
    -1, 1, 1, 0, 1, 0,
    1, 1, 1, 0, 1, 0,
    1, 1, -1, 0, 1, 0,
  ];
  const cubeVerticesBuffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, cubeVerticesBuffer);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeVertices), GL.STATIC_DRAW);

  const cubeFaces = [
    0, 1, 2,
    0, 2, 3,
    4, 5, 6,
    4, 6, 7,
    8, 9, 10,
    8, 10, 11,
    12, 13, 14,
    12, 14, 15,
    16, 17, 18,
    16, 18, 19,
    20, 21, 22,
    20, 22, 23,
  ];

  const cubeFacesBuffer = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, cubeFacesBuffer);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeFaces), GL.STATIC_DRAW);

//   // Matrix initialization
  const projectionMatrix = LIBS.getProjection(40, CANVAS.width / CANVAS.height, 1, 100);
  const moveMatrix = LIBS.getI4();
  const viewMatrix = LIBS.getI4();

  LIBS.translateZ(viewMatrix, -6);
  theta = 0;
  phi = 0;

  // Drawing
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  let timeOld = 0;
  function draw(time) {
    const delta = time - timeOld;
    if (!drag) {
      dX *= AMORTIZATION;
      dY *= AMORTIZATION;
      theta += dX;
      phi += dY;
    }
    LIBS.setI4(moveMatrix);
    LIBS.rotateY(moveMatrix, theta);
    LIBS.rotateX(moveMatrix, phi);
    timeOld = time;

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GL.uniformMatrix4fv(_Pmatrix, false, projectionMatrix);
    GL.uniformMatrix4fv(_Vmatrix, false, viewMatrix);
    GL.uniformMatrix4fv(_Mmatrix, false, moveMatrix);

    GL.bindBuffer(GL.ARRAY_BUFFER, cubeVerticesBuffer);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, cubeFacesBuffer);
    GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);

    GL.flush();

    window.requestAnimationFrame(draw);
  }

  draw(0);
  return true;
}
