const LIBS = {
  degToRad(angle) {
    return (angle * Math.PI / 180);
  },

  getProjection(angle, aspectRatio, zMin, zMax) {
    const tan = Math.tan(LIBS.degToRad(0.5 * angle));
    const A = -(zMax + zMin) / (zMax - zMin);
    const B = (-2 * zMax * zMin) / (zMax - zMin);
    return [
      0.5 / tan, 0, 0, 0,
      0, 0.5 * aspectRatio / tan, 0, 0,
      0, 0, A, -1,
      0, 0, B, 0,
    ];
  },

  getI4() {
    return [1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1];
  },

  setI4(m) {
    m[0] = 1; m[1] = 0; m[2] = 0; m[3] = 0;
    m[4] = 0; m[5] = 1; m[6] = 0; m[7] = 0;
    m[8] = 0; m[9] = 0; m[10] = 1; m[11] = 0;
    m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1;
  },

  rotateX(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const oldM1 = m[1];
    const oldM5 = m[5];
    const oldM9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + oldM1 * s;
    m[6] = m[6] * c + oldM5 * s;
    m[10] = m[10] * c + oldM9 * s;
  },

  rotateY(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const oldM0 = m[0];
    const oldM4 = m[4];
    const oldM8 = m[8];

    m[0] = m[0] * c + m[2] * s;
    m[4] = m[4] * c + m[6] * s;
    m[8] = m[8] * c + m[10] * s;

    m[2] = m[2] * c - oldM0 * s;
    m[6] = m[6] * c - oldM4 * s;
    m[10] = m[10] * c - oldM8 * s;
  },

  rotateZ(m, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const oldM0 = m[0];
    const oldM4 = m[4];
    const oldM8 = m[8];

    m[0] = m[0] * c - m[1] * s;
    m[4] = m[4] * c - m[5] * s;
    m[8] = m[8] * c - m[9] * s;

    m[1] = m[1] * c + oldM0 * s;
    m[5] = m[5] * c + oldM4 * s;
    m[9] = m[9] * c + oldM8 * s;
  },

  translateZ(m, t) {
    m[14] += t;
  },
};
