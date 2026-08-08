import * as THREE from "three";
import type { Hotspot } from "../anatomy-data";

export type Marker = {
  hotspot: Hotspot;
  dot: THREE.Sprite;
  pulse: THREE.Sprite;
  /** 3D volumetric glowing core mesh for pathology */
  coreMesh?: THREE.Mesh;
  /** 3D expanding shockwave sphere for pathology */
  shockwaveMesh?: THREE.Mesh;
  /** 3D point light for internal tissue illumination */
  pointLight?: THREE.PointLight;
  /** The point on the mesh this marker belongs to, in pivot space. */
  anchor: THREE.Vector3;
  /** Current facing/occlusion fade, 0–1. */
  opacity: number;
  /** Hover + selection emphasis, 0–1. */
  emphasis: number;
  /** Whether this landmark is affected by medical symptoms */
  isSymptom?: boolean;
};

const TAU = Math.PI * 2;
const SURFACE_LIFT = 0.04;
const VIEW_LIFT = 0.25;
const PULSE_SECONDS = 4.5;

function rgba(color: THREE.Color, alpha: number) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function dotTexture(hex: string, isSymptom = false) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const color = new THREE.Color(isSymptom ? "#ef4444" : hex);

  // Outer radiant glow
  const halo = ctx.createRadialGradient(c, c, size * 0.18, c, c, size * 0.5);
  halo.addColorStop(0, rgba(color, isSymptom ? 0.9 : 0.45));
  halo.addColorStop(0.5, rgba(color, isSymptom ? 0.45 : 0.16));
  halo.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(c, c, c, 0, TAU);
  ctx.fill();

  // Dark contrast ring
  ctx.beginPath();
  ctx.arc(c, c, size * 0.32, 0, TAU);
  ctx.fillStyle = isSymptom ? "rgba(220, 38, 38, 0.6)" : "rgba(30, 41, 59, 0.3)";
  ctx.fill();

  // Pure white inner rim
  ctx.beginPath();
  ctx.arc(c, c, size * 0.28, 0, TAU);
  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
  ctx.fill();

  // Center colored core
  ctx.beginPath();
  ctx.arc(c, c, size * (isSymptom ? 0.22 : 0.18), 0, TAU);
  ctx.fillStyle = rgba(color, 1);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ringTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.42, 0, TAU);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 3D Hotspot and Pathology Beacon Visualizer Layer.
 * Renders glowing sprites, 3D volumetric core meshes, pulsating shockwaves,
 * and internal tissue illumination point lights on affected anatomical zones.
 */
export class HotspotLayer {
  private markers: Marker[] = [];
  private ring = ringTexture();
  private group = new THREE.Group();
  private pixelScale = 0.022;
  private time = 0;
  private selectedAt = -PULSE_SECONDS;
  private lastSelectedId: string | null = null;
  private symptomFocusIds = new Set<string>();

  private readonly world = new THREE.Vector3();
  private readonly toCamera = new THREE.Vector3();
  private readonly outward = new THREE.Vector3();
  private readonly center = new THREE.Vector3();
  private readonly projected = new THREE.Vector3();
  private readonly localCamera = new THREE.Vector3();
  private readonly lift = new THREE.Vector3();

  constructor() {
    this.group.name = "hotspot-layer";
    this.group.renderOrder = 10;
  }

  get list(): readonly Marker[] {
    return this.markers;
  }

  setSymptomFocus(ids: string[]) {
    this.symptomFocusIds = new Set(ids);
    this.markers.forEach((m) => {
      const isAffected = this.symptomFocusIds.has(m.hotspot.id);
      m.isSymptom = isAffected;
      if (m.coreMesh) m.coreMesh.visible = isAffected;
      if (m.shockwaveMesh) m.shockwaveMesh.visible = isAffected;
      if (m.pointLight) {
        m.pointLight.visible = isAffected;
        m.pointLight.intensity = isAffected ? 3.8 : 0;
      }
      if (isAffected) {
        m.pulse.material.color.set(m.hotspot.color || "#ef4444");
      }
    });
  }

  clearSymptomFocus() {
    this.symptomFocusIds.clear();
    this.markers.forEach((m) => {
      m.isSymptom = false;
      if (m.coreMesh) m.coreMesh.visible = false;
      if (m.shockwaveMesh) m.shockwaveMesh.visible = false;
      if (m.pointLight) m.pointLight.visible = false;
    });
  }

  attach(pivot: THREE.Group, hotspots: Hotspot[], meshes: THREE.Mesh[]) {
    this.clear();
    if (!hotspots.length) return;

    const anchors = snapToSurface(hotspots, pivot, meshes);
    const sphereGeo = new THREE.SphereGeometry(0.12, 18, 18);
    const shockwaveGeo = new THREE.SphereGeometry(0.24, 16, 16);

    hotspots.forEach((hotspot, index) => {
      const isSymptom = this.symptomFocusIds.has(hotspot.id);
      const colorHex = hotspot.color || "#ef4444";

      // 1. 2D Billboard Sprite Dot
      const dot = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: dotTexture(colorHex, isSymptom),
          transparent: true,
          depthWrite: false,
          depthTest: true,
          sizeAttenuation: false,
          toneMapped: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          polygonOffsetUnits: -12,
        }),
      );
      dot.position.copy(anchors[index]);
      dot.renderOrder = 15;

      // 2. 2D Pulse Ring
      const pulse = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.ring,
          color: new THREE.Color(colorHex),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: true,
          sizeAttenuation: false,
          toneMapped: false,
        }),
      );
      pulse.position.copy(anchors[index]);
      pulse.renderOrder = 14;

      // 3. 3D Volumetric Glowing Core Mesh (Physical 3D highlight)
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 2.8,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
      });
      const coreMesh = new THREE.Mesh(sphereGeo, coreMat);
      coreMesh.position.copy(anchors[index]);
      coreMesh.visible = isSymptom;
      coreMesh.renderOrder = 12;

      // 4. 3D Pulsing Shockwave Mesh (Physical 3D expanding aura)
      const shockMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        wireframe: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockMat);
      shockwaveMesh.position.copy(anchors[index]);
      shockwaveMesh.visible = isSymptom;
      shockwaveMesh.renderOrder = 11;

      // 5. 3D Point Light (Illuminates translucent organ tissue from within)
      const pointLight = new THREE.PointLight(new THREE.Color(colorHex), isSymptom ? 3.8 : 0, 3.5, 2);
      pointLight.position.copy(anchors[index]);
      pointLight.visible = isSymptom;

      this.group.add(coreMesh, shockwaveMesh, pointLight, pulse, dot);

      this.markers.push({
        hotspot,
        dot,
        pulse,
        coreMesh,
        shockwaveMesh,
        pointLight,
        anchor: anchors[index].clone(),
        opacity: 0,
        emphasis: 0,
        isSymptom,
      });
    });

    this.group.position.set(0, 0, 0);
    pivot.add(this.group);
    this.applyScale();
  }

  setPixelSize(pixels: number, viewportHeight: number, fovDegrees: number) {
    const fov = THREE.MathUtils.degToRad(fovDegrees);
    this.pixelScale = 2 * (pixels / Math.max(viewportHeight, 1)) * Math.tan(fov / 2);
    this.applyScale();
  }

  private applyScale() {
    this.markers.forEach((marker) => {
      const symptomBoost = marker.isSymptom ? 1.45 : 1;
      const scale =
        this.pixelScale *
        symptomBoost *
        (1 + marker.emphasis * 0.35) *
        (0.74 + 0.26 * marker.opacity);
      marker.dot.scale.setScalar(scale);
    });
  }

  update(
    camera: THREE.Camera,
    delta: number,
    selectedId: string | null,
    hoveredId: string | null,
  ) {
    if (!this.markers.length) return true;
    this.time += delta;
    this.group.updateWorldMatrix(true, false);
    this.group.getWorldPosition(this.center);
    this.localCamera.copy(camera.position);
    this.group.worldToLocal(this.localCamera);

    if (selectedId !== this.lastSelectedId) {
      this.lastSelectedId = selectedId;
      this.selectedAt = this.time;
    }
    const beating = this.time - this.selectedAt < PULSE_SECONDS;
    const hasSymptomFocus = this.symptomFocusIds.size > 0;

    let settled = true;
    for (const marker of this.markers) {
      this.lift.copy(this.localCamera).sub(marker.anchor);
      const span = this.lift.length();
      if (span > 1e-4) this.lift.multiplyScalar(VIEW_LIFT / span);
      else this.lift.set(0, 0, 0);
      marker.dot.position.copy(marker.anchor).add(this.lift);
      marker.pulse.position.copy(marker.dot.position);

      marker.dot.getWorldPosition(this.world);
      this.outward.copy(this.world).sub(this.center);
      const radius = this.outward.length();
      this.toCamera.copy(camera.position).sub(this.world).normalize();
      const facing = radius > 1e-4 ? this.outward.divideScalar(radius).dot(this.toCamera) : 1;
      let target = THREE.MathUtils.smoothstep(facing, -0.05, 0.3);

      const isSymptom = this.symptomFocusIds.has(marker.hotspot.id);
      if (hasSymptomFocus) {
        if (isSymptom) {
          target = Math.max(target, 0.98);
        } else {
          target *= 0.2; // Dim non-symptomatic hotspots!
        }
      }

      const active =
        marker.hotspot.id === selectedId ||
        marker.hotspot.id === hoveredId ||
        (hasSymptomFocus && isSymptom);
      const emphasisTarget = active ? 1 : 0;
      const ease = 1 - Math.exp(-delta * 12);

      if (Math.abs(target - marker.opacity) > 0.002) settled = false;
      if (Math.abs(emphasisTarget - marker.emphasis) > 0.002) settled = false;
      marker.opacity += (target - marker.opacity) * ease;
      marker.emphasis += (emphasisTarget - marker.emphasis) * ease;

      marker.dot.material.opacity = marker.opacity;
      marker.dot.visible = marker.opacity > 0.01;

      // Update 3D Volumetric Pathology Meshes & Lights
      if (isSymptom) {
        settled = false;
        const pulseCycle = (this.time * 1.4) % 1;
        const pulseScale = 1.0 + Math.sin(this.time * 3.5) * 0.18;

        if (marker.coreMesh) {
          marker.coreMesh.visible = true;
          marker.coreMesh.scale.setScalar(pulseScale);
          (marker.coreMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
            2.5 + Math.sin(this.time * 4) * 1.2;
        }

        if (marker.shockwaveMesh) {
          marker.shockwaveMesh.visible = true;
          const waveScale = 1.0 + pulseCycle * 2.2;
          marker.shockwaveMesh.scale.setScalar(waveScale);
          (marker.shockwaveMesh.material as THREE.MeshBasicMaterial).opacity =
            (1 - pulseCycle) * 0.65;
        }

        if (marker.pointLight) {
          marker.pointLight.visible = true;
          marker.pointLight.intensity = 3.2 + Math.sin(this.time * 4) * 1.5;
        }
      } else {
        if (marker.coreMesh) marker.coreMesh.visible = false;
        if (marker.shockwaveMesh) marker.shockwaveMesh.visible = false;
        if (marker.pointLight) marker.pointLight.visible = false;
      }

      // Sprite pulse ring
      if (marker.emphasis > 0.01 || isSymptom) {
        marker.pulse.visible = true;
        if (beating || marker.hotspot.id === hoveredId || isSymptom) {
          const beat = (this.time * 0.9) % 1;
          marker.pulse.material.opacity =
            marker.emphasis * marker.opacity * (1 - beat) * (isSymptom ? 0.98 : 0.85);
          marker.pulse.scale.setScalar(this.pixelScale * (1.2 + beat * 1.8));
          settled = false;
        } else {
          marker.pulse.material.opacity = marker.emphasis * marker.opacity * 0.45;
          marker.pulse.scale.setScalar(this.pixelScale * 1.6);
        }
      } else if (marker.pulse.visible) {
        marker.pulse.visible = false;
      }
    }
    this.applyScale();
    return settled;
  }

  pick(
    x: number,
    y: number,
    camera: THREE.Camera,
    width: number,
    height: number,
    radius = 26,
  ) {
    let best: Marker | null = null;
    let bestDistance = radius;
    for (const marker of this.markers) {
      if (marker.opacity < 0.15) continue;
      marker.dot.getWorldPosition(this.projected).project(camera as THREE.PerspectiveCamera);
      if (this.projected.z > 1) continue;
      const px = (this.projected.x * 0.5 + 0.5) * width;
      const py = (-this.projected.y * 0.5 + 0.5) * height;
      const distance = Math.hypot(px - x, py - y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = marker;
      }
    }
    return best;
  }

  screenPosition(
    id: string,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
  ) {
    const marker = this.markers.find((item) => item.hotspot.id === id);
    if (!marker) return null;
    marker.dot.getWorldPosition(this.projected).project(camera);
    return {
      x: (this.projected.x * 0.5 + 0.5) * width,
      y: (-this.projected.y * 0.5 + 0.5) * height,
      opacity: marker.opacity,
    };
  }

  clear() {
    this.markers.forEach((marker) => {
      marker.dot.material.map?.dispose();
      marker.dot.material.dispose();
      marker.pulse.material.dispose();
      if (marker.coreMesh) {
        marker.coreMesh.geometry.dispose();
        (marker.coreMesh.material as THREE.Material).dispose();
      }
      if (marker.shockwaveMesh) {
        marker.shockwaveMesh.geometry.dispose();
        (marker.shockwaveMesh.material as THREE.Material).dispose();
      }
    });
    this.markers = [];
    this.group.clear();
    this.group.removeFromParent();
  }

  dispose() {
    this.clear();
    this.ring.dispose();
  }
}

function snapToSurface(
  hotspots: Hotspot[],
  pivot: THREE.Group,
  meshes: THREE.Mesh[],
): THREE.Vector3[] {
  if (!meshes.length) return hotspots.map((h) => new THREE.Vector3(...h.position));

  const raycaster = new THREE.Raycaster();
  const worldPoint = new THREE.Vector3();
  const localTarget = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const directions = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
  ];

  return hotspots.map((hotspot) => {
    localTarget.set(...hotspot.position);
    pivot.localToWorld(worldPoint.copy(localTarget));

    let bestHit: THREE.Intersection | null = null;
    let minDistance = Infinity;

    for (const dir of directions) {
      raycaster.set(worldPoint, dir);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0 && hits[0].distance < minDistance) {
        minDistance = hits[0].distance;
        bestHit = hits[0];
      }
    }

    if (bestHit && minDistance < 1.8) {
      const hitPoint = bestHit.point.clone();
      if (bestHit.face) {
        normal.copy(bestHit.face.normal).transformDirection(bestHit.object.matrixWorld);
        hitPoint.addScaledVector(normal, SURFACE_LIFT);
      }
      return pivot.worldToLocal(hitPoint);
    }

    return localTarget.clone();
  });
}
