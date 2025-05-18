# 3D Action RPG Development Roadmap (JavaScript / WebGL)

A step-by-step plan to build a 3D Action RPG using Three.js and ARPG mechanics.

---

## Phase 1: 3D World Construction (Three.js Core)

### Step 1.1: Setup Base Project

1. Install dependencies:

   ```bash
   npm install three @types/three three-gltf-loader cannon-es
   ```

2. Create HTML canvas container:

   ```html
   <div id="game-container"></div>
   ```

### Step 1.2: Initialize 3D World

```javascript
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
```

### Step 1.3: Terrain Generation

```javascript
// Procedural terrain with Perlin noise
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
```

---

## Phase 2: Core ARPG Mechanics

### Step 2.1: Player Controller

```javascript
class Player {
  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.add(
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.5, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      )
    );

    this.stats = {
      health: 100,
      stamina: 100,
      attack: 20,
    };

    this.velocity = new THREE.Vector3();
    this.isGrounded = false;
  }

  update(deltaTime) {
    // Movement logic using keyboard input
  }
}
```

### Step 2.2: Combat System

```javascript
class CombatSystem {
  constructor() {
    this.attackCooldown = 0;
  }

  meleeAttack(target) {
    const hitBox = new THREE.Box3().setFromObject(player.mesh);
    if (hitBox.intersectsBox(target.hitBox)) {
      target.takeDamage(player.stats.attack);
    }
  }

  projectileAttack() {
    const projectileGeometry = new THREE.SphereGeometry(0.2);
    const projectile = new THREE.Mesh(
      projectileGeometry,
      redMaterial
    );
    projectile.position.copy(player.mesh.position);
    scene.add(projectile);

    // Add physics with Cannon.js
    const projectileBody = new CANNON.Body({ mass: 1 });
    projectileBody.addShape(new CANNON.Sphere(0.2));
    world.addBody(projectileBody);
  }
}
```

---

## Phase 3: Advanced Systems

### Step 3.1: Enemy AI

```javascript
class EnemyAI {
  constructor() {
    this.states = {
      IDLE: 0,
      CHASE: 1,
      ATTACK: 2,
    };
    this.currentState = this.states.IDLE;
  }

  update(target) {
    switch (this.currentState) {
      case this.states.IDLE:
        if (distanceToPlayer < 10) this.currentState = this.states.CHASE;
        break;
      case this.states.CHASE:
        // Pathfinding logic
        break;
    }
  }
}
```

### Step 3.2: Inventory System

```javascript
class Inventory {
  constructor() {
    this.items = [];
    this.equipped = {
      weapon: null,
      armor: null,
    };
  }

  addItem(item) {
    this.items.push(item);
    // Update Three.js UI representation
    const itemIcon = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: item.texture })
    );
    uiScene.add(itemIcon);
  }
}
```

---

## Phase 4: Optimization & Polish

### Step 4.1: Level of Detail (LOD)

```javascript
const treeLOD = new THREE.LOD();
treeLOD.addLevel(highDetailModel, 50);  // <50 units
treeLOD.addLevel(mediumDetailModel, 100); // <100 units
treeLOD.addLevel(lowDetailModel, 200);   // <200 units
scene.add(treeLOD);
```

### Step 4.2: Shaders for Effects

```glsl
// Fragment shader for health bar
uniform vec3 color;
uniform float progress;

void main() {
  if (gl_FragCoord.x > progress * resolution.x) discard;
  gl_FragColor = vec4(color, 1.0);
}
```

---

## Phase 5: Integration & Testing

1. **Physics Integration**:

   ```javascript
   const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

   function updatePhysics() {
     world.step(1/60);
     // Sync Three.js meshes with Cannon.js bodies
   }
   ```

2. **Event System**:

   ```javascript
   class GameEvent {
     static emit(event, data) {
       document.dispatchEvent(
         new CustomEvent(event, { detail: data })
       );
     }
   }

   // Usage: GameEvent.emit('player-damaged', { amount: 20 });
   ```

---

## Recommended Libraries

* **3D Core**: Three.js + Cannon.js (physics)
* **UI**: Tweakpane (for debugging), Phaser (optional for 2D UI)
* **Animation**: Three.js AnimationMixer
* **Networking**: Socket.io (for multiplayer)

## Development Roadmap

1. **Week 1-2**: Core 3D world with terrain and basic movement
2. **Week 3-4**: Combat system + enemy AI
3. **Week 5**: Inventory/Progression systems
4. **Week 6**: Optimization & polish
5. **Week 7**: QA testing & bug fixes

> **Tip:** Start with simple collision boxes before complex physics, and prototype combat using primitive shapes before integrating final 3D models. Use Three.js examples for skeletal animations and post-processing effects.
