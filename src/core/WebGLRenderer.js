import { createProgram, bindFloatAttribute, setCanvasSize } from './gl.js';
import { backgroundVertex, backgroundFragment } from '../shaders/background.js';
import { coreVertex, coreFragment } from '../shaders/core.js';
import { cityVertex, cityFragment } from '../shaders/city.js';
import { overexposureVertex, overexposureFragment } from '../shaders/overexposure.js';
import { particleVertex, particleFragment } from '../shaders/particles.js';

export class WebGLRenderer {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.state = state;
    this.gl = null;
    this.programs = {};
    this.buffers = {};
  }

  mount() {
    this.gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });

    if (!this.gl) {
      document.documentElement.classList.add('no-webgl');
      return;
    }

    const gl = this.gl;
    this.programs.background = createProgram(gl, backgroundVertex, backgroundFragment);
    this.programs.core = createProgram(gl, coreVertex, coreFragment);
    this.programs.city = createProgram(gl, cityVertex, cityFragment);
    this.programs.overexposure = createProgram(gl, overexposureVertex, overexposureFragment);
    this.programs.particles = createProgram(gl, particleVertex, particleFragment);

    this.buffers.quad = gl.createBuffer();
    this.buffers.particlePositions = gl.createBuffer();
    this.buffers.particleMeta = gl.createBuffer();
    this.buffers.particleMotion = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
  }

  resize(width, height, dpr) {
    if (!this.gl) return;
    setCanvasSize(this.canvas, width, height, dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render({ world, particles }) {
    const gl = this.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.drawBackground();
    this.drawCore(particles);
    this.drawParticles(particles);
    this.drawOverexposure();
    this.drawCity();
  }

  drawBackground() {
    const { gl, state } = this;
    const program = this.programs.background;
    gl.useProgram(program);
    gl.disable(gl.BLEND);
    bindFloatAttribute(gl, program, 'a_position', this.buffers.quad, 2);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, 'u_pointer'), state.pointer.nx, state.pointer.ny);
    gl.uniform2f(gl.getUniformLocation(program, 'u_core'), 0, 0);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.time);
    gl.uniform1f(gl.getUniformLocation(program, 'u_bend'), state.scene.bend);
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), state.scene.exposure);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  drawCore(particles) {
    const { gl, state } = this;
    const program = this.programs.core;
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    bindFloatAttribute(gl, program, 'a_position', this.buffers.quad, 2);
    gl.uniform2f(gl.getUniformLocation(program, 'u_core'), 0, 0);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.time);
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), state.scene.exposure);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dive'), state.scene.dive);
    gl.uniform1f(gl.getUniformLocation(program, 'u_feedback'), particles?.starPulse || 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  drawParticles(particles) {
    const { gl, state } = this;
    const program = this.programs.particles;
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.particlePositions);
    gl.bufferData(gl.ARRAY_BUFFER, particles.positions, gl.DYNAMIC_DRAW);
    bindFloatAttribute(gl, program, 'a_position', this.buffers.particlePositions, 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.particleMeta);
    gl.bufferData(gl.ARRAY_BUFFER, particles.meta, gl.DYNAMIC_DRAW);
    bindFloatAttribute(gl, program, 'a_meta', this.buffers.particleMeta, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.particleMotion);
    gl.bufferData(gl.ARRAY_BUFFER, particles.motion, gl.DYNAMIC_DRAW);
    bindFloatAttribute(gl, program, 'a_motion', this.buffers.particleMotion, 2);

    gl.uniform2f(gl.getUniformLocation(program, 'u_pointer'), state.pointer.nx, state.pointer.ny);
    gl.uniform3f(gl.getUniformLocation(program, 'u_camera'), state.camera.x, state.camera.y, state.camera.z);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dpr'), state.quality.dpr);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.time);
    gl.uniform2f(gl.getUniformLocation(program, 'u_core'), 0, 0);
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), state.scene.exposure);
    gl.drawArrays(gl.POINTS, 0, particles.drawCount || particles.count);
  }

  drawOverexposure() {
    const { gl, state } = this;
    if (state.scene.exposure <= 0.01 && state.scene.whiteout <= 0.002) return;
    const program = this.programs.overexposure;
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    bindFloatAttribute(gl, program, 'a_position', this.buffers.quad, 2);
    gl.uniform2f(gl.getUniformLocation(program, 'u_core'), 0, 0);
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), state.scene.exposure);
    gl.uniform1f(gl.getUniformLocation(program, 'u_whiteout'), state.scene.whiteout);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dive'), state.scene.dive);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  drawCity() {
    const { gl, state } = this;
    if (state.scene.cityReveal <= 0.002) return;
    const program = this.programs.city;
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    bindFloatAttribute(gl, program, 'a_position', this.buffers.quad, 2);
    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.time);
    gl.uniform1f(gl.getUniformLocation(program, 'u_reveal'), state.scene.cityReveal);
    gl.uniform1f(gl.getUniformLocation(program, 'u_dive'), state.scene.dive);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose() {
    if (!this.gl) return;
    Object.values(this.buffers).forEach((buffer) => this.gl.deleteBuffer(buffer));
    Object.values(this.programs).forEach((program) => this.gl.deleteProgram(program));
  }
}
