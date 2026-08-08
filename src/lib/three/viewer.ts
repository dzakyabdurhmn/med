import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { Hotspot } from "../anatomy-data";
import { AnatomyAssetManager, type LoadedOrgan } from "./loaders";
import { HotspotLayer, type Marker } from "./hotspots";
import { PathologyMutator, type PathologyType } from "./pathology-mutator";

type ViewerCallbacks = {
  onLoading: (loading: boolean, progress: number) => void;
  onSelect: (hotspot: Hotspot | null) => void;
};

const DOT_PIXELS = 30;
const CAMERA_FOV = 36;
const DEPTH_PREPASS = "depth-prepass";
const PLINTH_Y = -2.8;
const PLINTH_TOP = PLINTH_Y + 0.05;
const HOME_CAMERA = { x: 0, y: 0.1, z: 4.8 };
const HOME_TARGET = { x: 0, y: 0, z: 0 };

export class AnatomyViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
  private controls: OrbitControls;
  private assets: AnatomyAssetManager;
  private hotspots = new HotspotLayer();
  private pathologyMutator: PathologyMutator;
  private currentPathologyType: PathologyType = "normal";
  private callbacks: ViewerCallbacks;
  private container: HTMLElement;
  private organ: LoadedOrgan | null = null;
  private plinth!: THREE.Mesh;
  private contactShadow!: THREE.Mesh;

  private frame = 0;
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  private depthMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, depthTest: true });
  private crossSection = false;
  private isolated = false;

  private width = 1;
  private height = 1;
  private isVisible = true;
  private isPageVisible = true;

  private dirty = true;
  private busyUntil = 0;
  private loadRequest = 0;

  private basePixelRatio: number;

  private autoRotateWanted = true;
  private interactionUntil = 0;
  private selectedId: string | null = null;
  private hoveredId: string | null = null;
  private hoverProbe: { x: number; y: number } | null = null;
  private pointerId: number | null = null;
  private pointerStart = { x: 0, y: 0 };
  private dragged = false;
  private calloutEl: HTMLElement | null = null;
  private fadeTween: gsap.core.Tween | null = null;
  private disposed = false;

  constructor(container: HTMLElement, callbacks: ViewerCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    const lowPower = typeof window !== "undefined" && (window.matchMedia("(max-width: 780px)").matches || (navigator.hardwareConcurrency ?? 8) < 6);
    this.basePixelRatio = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2) : 1;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !lowPower,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(this.basePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.shadowMap.enabled = false;
    this.renderer.localClippingEnabled = true;
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D anatomy model for AI medical reporting. Drag to rotate, scroll to zoom, and click an anatomical landmark to view findings.",
    );
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(HOME_CAMERA.x, HOME_CAMERA.y, HOME_CAMERA.z);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.8;
    this.controls.maxDistance = 8.5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.65;
    this.controls.target.set(HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z);

    this.assets = new AnatomyAssetManager(this.renderer);
    this.pathologyMutator = new PathologyMutator(this.scene);
    this.buildEnvironment();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) this.dirty = true;
      },
      { rootMargin: "120px" },
    );
    this.intersectionObserver.observe(container);

    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.controls.addEventListener("start", this.onControlStart);
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointerleave", this.onPointerLeave);
    canvas.addEventListener("keydown", this.onKeyDown);

    this.resize();
    this.animate();
  }

  // ---------------------------------------------------------------- scene

  private buildEnvironment() {
    // Balanced studio ambient light
    this.scene.add(new THREE.AmbientLight(0xfff5ea, 0.65));
    this.scene.add(new THREE.HemisphereLight(0xffeedd, 0x1e293b, 0.85));

    // Studio Key light (Warm sunlight angle)
    const key = new THREE.DirectionalLight(0xfffaf0, 4.2);
    key.position.set(5.5, 7.5, 7.0);
    this.scene.add(key);

    // Cool Medical Blue Fill light
    const fill = new THREE.DirectionalLight(0xdbeafe, 1.8);
    fill.position.set(-5.2, 2.0, 5.5);
    this.scene.add(fill);

    // Sharp Organic Rim light (Subsurface silhouette enhancement)
    const rim = new THREE.DirectionalLight(0xffc5b5, 2.6);
    rim.position.set(-4.5, 4.2, -6.0);
    this.scene.add(rim);

    // Warm Underside Bounce light
    const warm = new THREE.PointLight(0xff8d70, 1.2, 12, 2);
    warm.position.set(-3.5, -1.8, 4.0);
    this.scene.add(warm);

    // Dynamic Pathology / Organ focal light
    const glow = new THREE.PointLight(0xee7c6a, 0.9, 10, 2);
    glow.name = "organ-glow";
    glow.position.set(2.8, 0.6, 2.8);
    this.scene.add(glow);

    this.scene.environment = this.buildEnvironmentMap();

    // Studio clean shadow floor & subtle halo ring
    const plinthGroup = new THREE.Group();
    plinthGroup.name = "plinth-group";

    // Discreet flat base plate
    this.plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 2.9, 0.06, 64),
      new THREE.MeshStandardMaterial({
        color: 0x1e1b18,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
      }),
    );
    this.plinth.position.y = PLINTH_Y;
    plinthGroup.add(this.plinth);

    // Glowing Diagnostic Circular Axis Grid
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 2.48, 64),
      new THREE.MeshBasicMaterial({
        color: 0xee7c6a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      }),
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = PLINTH_TOP + 0.002;
    plinthGroup.add(ringMesh);

    // Soft Ambient radial contact shadow
    this.contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 5.6),
      new THREE.MeshBasicMaterial({
        map: contactShadowTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.55,
        toneMapped: false,
      }),
    );
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = PLINTH_TOP + 0.001;
    this.contactShadow.renderOrder = 1;
    plinthGroup.add(this.contactShadow);

    this.scene.add(plinthGroup);

    // Floating Bio-luminescent Diagnostic Data Particles
    const count = 72;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 11;
      positions[i + 1] = (Math.random() - 0.5) * 7.5;
      positions[i + 2] = (Math.random() - 0.5) * 6 - 1.5;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.scene.add(
      new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0xeb7c6b,
          size: 0.016,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
  }

  private buildEnvironmentMap() {
    const width = 32;
    const height = 64;
    const data = new Uint8Array(width * height * 4);
    const top = new THREE.Color(0xfef5ed);
    const bottom = new THREE.Color(0x1a1512);
    const mixed = new THREE.Color();
    for (let y = 0; y < height; y += 1) {
      mixed.copy(bottom).lerp(top, Math.pow(1 - y / (height - 1), 0.65));
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        data[i] = mixed.r * 255;
        data[i + 1] = mixed.g * 255;
        data[i + 2] = mixed.b * 255;
        data[i + 3] = 255;
      }
    }
    const source = new THREE.DataTexture(data, width, height);
    source.mapping = THREE.EquirectangularReflectionMapping;
    source.colorSpace = THREE.SRGBColorSpace;
    source.needsUpdate = true;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = pmrem.fromEquirectangular(source).texture;
    pmrem.dispose();
    source.dispose();
    return environment;
  }


  // ---------------------------------------------------------------- organs

  prefetch(url: string) {
    this.assets.prefetch(url);
  }

  async setOrgan(modelUrl: string, hotspots: Hotspot[], accent: string) {
    const request = ++this.loadRequest;
    this.select(null);
    this.callbacks.onLoading(true, 0);

    const outgoing = this.organ;
    if (outgoing) {
      this.fadeTween?.kill();
      this.fadeTween = null;
      this.setDepthPrepass(outgoing, false);
      this.hotspots.clear();
      this.busy(0.8);
      await gsap.to(outgoing.pivot.scale, {
        x: 0.72,
        y: 0.72,
        z: 0.72,
        duration: 0.34,
        ease: "power2.in",
        onUpdate: () => (this.dirty = true),
      });
      this.assets.release(outgoing);
      this.organ = null;
      this.dirty = true;
    }

    this.tween(this.camera.position, { z: 6.5, duration: 0.42, ease: "power2.inOut" });

    let organ: LoadedOrgan;
    try {
      organ = await this.assets.load(modelUrl, (progress) => {
        if (request === this.loadRequest) this.callbacks.onLoading(true, progress);
      });
    } catch (error) {
      if (request === this.loadRequest) this.callbacks.onLoading(false, 0);
      throw error;
    }
    if (request !== this.loadRequest || this.disposed) return;

    this.organ = organ;
    organ.pivot.scale.setScalar(1);
    organ.pivot.position.set(0, 0, 0);
    this.scene.add(organ.pivot);
    organ.pivot.updateWorldMatrix(true, true);

    this.hotspots.attach(organ.pivot, hotspots, organ.meshes);
    this.hotspots.setPixelSize(DOT_PIXELS, this.height, CAMERA_FOV);
    if (this.crossSection) this.applyClipping(true);

    // Apply active dynamic 3D pathology mutation (material tint, shaders, and 3D physical lesions)
    this.pathologyMutator.applyPathology(this.currentPathologyType, organ.meshes, organ.pivot);

    const glow = this.scene.getObjectByName("organ-glow") as THREE.PointLight | undefined;
    glow?.color.set(accent);

    organ.pivot.scale.setScalar(0.58);
    organ.pivot.position.z = -1.3;
    this.busy(1.4);
    this.fade(organ, 1, 0.72);
    this.callbacks.onLoading(false, 1);
    gsap
      .timeline({ onUpdate: () => (this.dirty = true) })
      .to(organ.pivot.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(1.25)" }, 0)
      .to(organ.pivot.position, { z: 0, duration: 0.85, ease: "power3.out" }, 0)
      .to(this.camera.position, { z: 4.8, duration: 0.9, ease: "power2.out" }, 0.08);
  }

  private materials(organ: LoadedOrgan) {
    const list: THREE.Material[] = [];
    organ.meshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => list.includes(material) || list.push(material));
    });
    return list;
  }

  private fade(organ: LoadedOrgan, to: number, duration: number) {
    const materials = this.materials(organ);
    const state = { value: to >= 1 ? 0 : 1 };
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = state.value;
      material.depthWrite = true;
    });
    this.setDepthPrepass(organ, true);
    this.busy(duration + 0.1);
    this.fadeTween = gsap.to(state, {
      value: to,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        materials.forEach((material) => (material.opacity = state.value));
        this.dirty = true;
      },
      onComplete: () => {
        if (to >= 1) {
          materials.forEach((material) => {
            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
          });
        }
        this.setDepthPrepass(organ, false);
        this.fadeTween = null;
        this.dirty = true;
      },
    });
  }

  private setDepthPrepass(organ: LoadedOrgan, enabled: boolean) {
    organ.meshes.forEach((mesh) => {
      const existing = mesh.children.find((child) => child.name === DEPTH_PREPASS);
      if (!enabled) {
        existing?.removeFromParent();
        return;
      }
      if (existing) return;
      const proxy = new THREE.Mesh(mesh.geometry, this.depthMaterial);
      proxy.name = DEPTH_PREPASS;
      proxy.frustumCulled = mesh.frustumCulled;
      mesh.add(proxy);
    });
  }

  // ---------------------------------------------------------------- loop

  private animate = () => {
    this.frame = requestAnimationFrame(this.animate);
    if (!this.isVisible || !this.isPageVisible) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const now = performance.now();
    const elapsedTime = this.clock.getElapsedTime();

    this.applyAutoRotate(now);
    if (this.controls.update(delta)) this.dirty = true;
    if (this.assets.hasAnimation) {
      this.assets.update(delta);
      this.dirty = true;
    }

    // Update active 3D physical pathology lesions (dripping blood particles, pulsing hematomas)
    this.pathologyMutator.update(delta);

    // Dynamic Biological Pulse Micro-Animation (Breathing & Cardiac Rhythm)
    if (this.organ && !this.crossSection) {
      // Natural systolic-diastolic double pulse for biological vitality
      const pulsePhase = elapsedTime * 2.8;
      const beat = Math.pow(Math.sin(pulsePhase), 18) * 0.024 + Math.sin(pulsePhase * 0.5) * 0.008;
      this.organ.pivot.scale.set(1 + beat, 1 + beat * 1.2, 1 + beat);
      this.dirty = true;
    }

    if (this.hoverProbe) this.resolveHover();
    if (!this.dirty && now >= this.busyUntil) return;

    if (!this.hotspots.update(this.camera, delta, this.selectedId, this.hoveredId)) this.dirty = true;
    else this.dirty = false;
    if (now < this.busyUntil) this.dirty = true;

    this.positionCallout();
    this.renderer.render(this.scene, this.camera);
  };

  /** Dynamically morphs 3D material shaders & spawns physical lesion geometry based on AI pathology findings */
  public applyPathology(pathologyType: PathologyType) {
    this.currentPathologyType = pathologyType;
    if (this.organ) {
      this.pathologyMutator.applyPathology(pathologyType, this.organ.meshes, this.organ.pivot);
      this.dirty = true;
      this.busy(1.5);
    }
  }

  public getPathology() {
    return this.pathologyMutator.pathology;
  }

  public getCurrentPathologyType(): PathologyType {
    return this.currentPathologyType;
  }

  /** Captures high-resolution diagnostic snapshot image for Medical Report PDF */
  public getSnapshotDataUrl(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL("image/png");
  }


  private busy(seconds: number) {
    this.busyUntil = Math.max(this.busyUntil, performance.now() + seconds * 1000);
    this.dirty = true;
  }

  private tween(target: object, vars: gsap.TweenVars) {
    this.busy((vars.duration as number) ?? 0.5);
    return gsap.to(target, { ...vars, onUpdate: () => (this.dirty = true) });
  }

  private applyAutoRotate(now: number) {
    this.controls.autoRotate = this.autoRotateWanted && !this.selectedId && now >= this.interactionUntil;
  }

  private onVisibilityChange = () => {
    this.isPageVisible = !document.hidden;
    if (this.isPageVisible) {
      this.clock.start();
      this.dirty = true;
    }
  };

  private resize() {
    this.width = Math.max(this.container.clientWidth, 1);
    this.height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.hotspots.setPixelSize(DOT_PIXELS, this.height, CAMERA_FOV);
    this.dirty = true;
  }

  // ---------------------------------------------------------------- input

  private onControlStart = () => {
    this.interactionUntil = performance.now() + 3000;
    this.dirty = true;
  };

  private onPointerDown = (event: PointerEvent) => {
    this.pointerId = event.pointerId;
    this.pointerStart = { x: event.clientX, y: event.clientY };
    this.dragged = false;
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.pointerId !== null) {
      if (Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y) > 5) this.dragged = true;
      return;
    }
    this.hoverProbe = { x: event.offsetX, y: event.offsetY };
    this.dirty = true;
  };

  private onPointerUp = (event: PointerEvent) => {
    const wasDragging = this.dragged;
    this.pointerId = null;
    this.dragged = false;
    if (wasDragging) return;
    const marker = this.hotspots.pick(event.offsetX, event.offsetY, this.camera, this.width, this.height);
    this.select(marker && marker.hotspot.id !== this.selectedId ? marker.hotspot.id : null);
  };

  private onPointerLeave = () => {
    this.pointerId = null;
    this.hoverProbe = null;
    if (this.hoveredId) {
      this.hoveredId = null;
      this.dirty = true;
    }
  };

  private resolveHover() {
    const probe = this.hoverProbe;
    this.hoverProbe = null;
    if (!probe) return;
    const marker = this.hotspots.pick(probe.x, probe.y, this.camera, this.width, this.height);
    const id = marker?.hotspot.id ?? null;
    if (id === this.hoveredId) return;
    this.hoveredId = id;
    this.renderer.domElement.style.cursor = id ? "pointer" : "";
    this.dirty = true;
  }

  public select(id: string | null) {
    if (this.selectedId === id) return;
    this.selectedId = id;
    this.busy(0.4);
    const marker = this.hotspots.list.find((item: Marker) => item.hotspot.id === id);
    this.callbacks.onSelect(marker?.hotspot ?? null);
  }

  public highlightHotspot(id: string | null) {
    this.select(id);
    if (id && this.organ) {
      const marker = this.hotspots.list.find((item: Marker) => item.hotspot.id === id);
      if (marker) {
        this.tween(this.controls.target, {
          x: marker.anchor.x * 0.6,
          y: marker.anchor.y * 0.6,
          z: marker.anchor.z * 0.6,
          duration: 0.75,
          ease: "power2.out",
        });
        const targetZ = Math.max(3.0, Math.min(6.2, marker.anchor.z + 4.2));
        this.tween(this.camera.position, {
          x: marker.anchor.x * 0.7,
          y: marker.anchor.y * 0.7 + 0.25,
          z: targetZ,
          duration: 0.85,
          ease: "power2.out",
        });
      }
    }
  }

  clearSelection() {
    this.select(null);
  }

  attachCallout(element: HTMLElement | null) {
    this.calloutEl = element;
    this.positionCallout();
    this.dirty = true;
  }

  private positionCallout() {
    if (!this.calloutEl || !this.selectedId) return;
    const point = this.hotspots.screenPosition(this.selectedId, this.camera, this.width, this.height);
    if (!point) return;
    this.calloutEl.style.transform = `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)`;
    this.calloutEl.dataset.side = point.x > this.width * 0.6 ? "left" : "right";
    this.calloutEl.dataset.behind = point.opacity < 0.3 ? "true" : "false";
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const pivot = this.organ?.pivot;
    if (event.key === "ArrowLeft" && pivot) pivot.rotation.y -= 0.08;
    if (event.key === "ArrowRight" && pivot) pivot.rotation.y += 0.08;
    if (event.key === "+") this.camera.position.z = Math.max(1.8, this.camera.position.z - 0.35);
    if (event.key === "-") this.camera.position.z = Math.min(8.5, this.camera.position.z + 0.35);
    if (event.key === "Escape") this.select(null);
    this.dirty = true;
  };

  // ---------------------------------------------------------------- tools

  setAutoRotate(enabled: boolean) {
    this.autoRotateWanted = enabled;
    if (enabled) this.interactionUntil = 0;
    this.dirty = true;
  }

  reset() {
    this.select(null);
    this.tween(this.camera.position, { ...HOME_CAMERA, duration: 0.8, ease: "power3.out" });
    this.tween(this.controls.target, { ...HOME_TARGET, duration: 0.8, ease: "power3.out" });
    if (this.organ) this.tween(this.organ.pivot.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power3.out" });
  }

  zoom(direction: 1 | -1) {
    this.tween(this.camera.position, {
      z: THREE.MathUtils.clamp(this.camera.position.z + direction * 1.0, 1.8, 8.5),
      duration: 0.5,
      ease: "power2.out",
    });
  }

  toggleIsolate() {
    this.isolated = !this.isolated;
    const plinth = this.plinth.material as THREE.MeshStandardMaterial;
    plinth.transparent = true;
    this.tween(plinth, { opacity: this.isolated ? 0.15 : 1, duration: 0.45 });
    this.tween(this.contactShadow.material, { opacity: this.isolated ? 0.08 : 0.55, duration: 0.45 });
    return this.isolated;
  }

  toggleCrossSection() {
    this.crossSection = !this.crossSection;
    this.applyClipping(this.crossSection);
    gsap.fromTo(
      this.clipPlane,
      { constant: -1.8 },
      {
        constant: this.crossSection ? 0 : -1.8,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: () => (this.dirty = true),
      },
    );
    this.busy(0.95);
    return this.crossSection;
  }

  private applyClipping(enabled: boolean) {
    if (!this.organ) return;
    const planes = enabled ? [this.clipPlane] : null;
    [...this.materials(this.organ), this.depthMaterial].forEach((material) => {
      material.clippingPlanes = planes;
      material.needsUpdate = true;
    });
    this.dirty = true;
  }

  toggleLayers() {
    if (!this.organ) return false;
    let enabled = false;
    this.materials(this.organ).forEach((material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.wireframe = !material.wireframe;
        enabled = material.wireframe;
      }
    });
    this.dirty = true;
    return enabled;
  }

  setSymptomMode(enabled: boolean, symptomHotspotIds: string[] = []) {
    if (!this.organ) return;
    const materials = this.materials(this.organ);
    if (enabled) {
      materials.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.22; // High-tech translucent ghostly anatomy
        m.depthWrite = false;
      });
      this.hotspots.setSymptomFocus(symptomHotspotIds);
      const glow = this.scene.getObjectByName("organ-glow") as THREE.PointLight | undefined;
      if (glow) {
        glow.color.set("#ef4444");
        glow.intensity = 1.8;
      }
    } else {
      materials.forEach((m) => {
        m.transparent = false;
        m.opacity = 1.0;
        m.depthWrite = true;
      });
      this.hotspots.clearSymptomFocus();
      const glow = this.scene.getObjectByName("organ-glow") as THREE.PointLight | undefined;
      if (glow) {
        glow.intensity = 0.5;
      }
    }
    this.dirty = true;
  }

  dispose() {
    this.disposed = true;
    this.loadRequest += 1;
    cancelAnimationFrame(this.frame);
    gsap.killTweensOf(this.camera.position);
    this.controls.removeEventListener("start", this.onControlStart);
    this.controls.dispose();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointerleave", this.onPointerLeave);
    canvas.removeEventListener("keydown", this.onKeyDown);

    this.hotspots.dispose();
    this.depthMaterial.dispose();
    this.pathologyMutator.dispose();
    this.assets.dispose();
    this.scene.environment?.dispose();
    (this.contactShadow.material as THREE.MeshBasicMaterial).map?.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}

function contactShadowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.04, size / 2, size / 2, size * 0.5);
  gradient.addColorStop(0, "rgba(15, 23, 42, 0.7)");
  gradient.addColorStop(0.45, "rgba(15, 23, 42, 0.3)");
  gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
