import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
// Terrain Generation
const terrainGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
const terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x3c8f3c });
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// Apply heightmap
const vertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
  vertices[i + 2] = noise.simplex2(
    vertices[i] / 10,
    vertices[i + 1] / 10
  ) * 2;
}