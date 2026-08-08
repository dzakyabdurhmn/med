import * as THREE from "three";
import type { OrganId } from "../anatomy-data";

export type PathologyType =
  | "normal"
  | "smoker_tar"
  | "stab_wound_bleeding"
  | "acute_infarction"
  | "cirrhosis_jaundice"
  | "kidney_stone"
  | "purulent_infection"
  | "cerebral_hemorrhage";

export type PathologyConfig = {
  id: PathologyType;
  title: string;
  badge: string;
  description: string;
  organTint: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  emissive?: string;
  emissiveIntensity?: number;
  hasBleeding: boolean;
  hasStabWound: boolean;
  hasTarDeposits: boolean;
  hasStones: boolean;
  hasHematoma: boolean;
  hasPusInfiltrate: boolean;
};

export const PATHOLOGY_PRESETS: Record<PathologyType, PathologyConfig> = {
  normal: {
    id: "normal",
    title: "Anatomi Normal Sehat",
    badge: "Kondisi Baseline",
    description: "Vaskularisasi utuh, perfusi jaringan optimal, tidak terdapat lesi struktural maupun deposit patologis.",
    organTint: "#ffffff",
    roughness: 0.45,
    metalness: 0.04,
    clearcoat: 0.35,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: false,
    hasPusInfiltrate: false,
  },
  smoker_tar: {
    id: "smoker_tar",
    title: "Antrakosis Paru Perokok Kronis (Black Tar & Carbon Lungs)",
    badge: "Perokok Aktif 20+ Pack-Years",
    description: "Akumulasi deposit karbon dan tar jelaga pada parenkim alveoli, nekrosis jaringan respirasi, dan fibrosis difus.",
    organTint: "#1c1917", // Charcoal black
    roughness: 0.85,
    metalness: 0.15,
    clearcoat: 0.05,
    emissive: "#09090b",
    emissiveIntensity: 0.2,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: true,
    hasStones: false,
    hasHematoma: false,
    hasPusInfiltrate: false,
  },
  stab_wound_bleeding: {
    id: "stab_wound_bleeding",
    title: "Trauma Penetrasi & Laserasi Pendarahan Aktif (Stab Wound Hemorrhage)",
    badge: "Trauma Fisik Akut",
    description: "Laserasi dinding organ akibat luka tusuk tajam dengan ekstravasasi darah aktif, hematoma perilesional, dan risiko syok hemoragik.",
    organTint: "#881337", // Crimson blood tone
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0, // Glistening wet blood
    emissive: "#4c0519",
    emissiveIntensity: 0.35,
    hasBleeding: true,
    hasStabWound: true,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: true,
    hasPusInfiltrate: false,
  },
  acute_infarction: {
    id: "acute_infarction",
    title: "Infark Miokard Akut & Iskemia Nekrotik (Ischemic Infarction)",
    badge: "Iskemia Jaringan Akut",
    description: "Oklusi vaskular akut mengakibatkan hipoksia parah, sianosis kebiruan/kehitaman, dan zona nekrosis koagulatif pada ventrikel.",
    organTint: "#3b0764", // Deep cyanotic ischemic purple-black
    roughness: 0.65,
    metalness: 0.08,
    clearcoat: 0.2,
    emissive: "#2e1065",
    emissiveIntensity: 0.3,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: false,
    hasPusInfiltrate: false,
  },
  cirrhosis_jaundice: {
    id: "cirrhosis_jaundice",
    title: "Sirosis Hepatobilier & Ikterus (Liver Cirrhosis & Jaundice)",
    badge: "Disfungsi Hepatobilier",
    description: "Fibrosis jaringan hati dengan pembentukan nodul regeneratif ireguler dan pewarnaan bilirubin kuning kecoklatan (ikterik).",
    organTint: "#854d0e", // Jaundiced ochre yellow-brown
    roughness: 0.9,
    metalness: 0.02,
    clearcoat: 0.1,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: false,
    hasPusInfiltrate: false,
  },
  kidney_stone: {
    id: "kidney_stone",
    title: "Nefrolitiasis & Obstruksi Kristal Kalsium (Kidney Stones)",
    badge: "Kalkulus Ginjal 3D",
    description: "Formasi kristal kalsium oksalat bergerigi tajam di dalam sistem pelvikalises yang menyebabkan hidronefrosis dan inflamasi parenkim.",
    organTint: "#b45309",
    roughness: 0.55,
    metalness: 0.2,
    clearcoat: 0.3,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: true,
    hasHematoma: false,
    hasPusInfiltrate: false,
  },
  purulent_infection: {
    id: "purulent_infection",
    title: "Konsolidasi Pneumonia & Eksudat Purulen (Infiltration & Pus)",
    badge: "Infeksi Bakterial Akut",
    description: "Infiltrat inflamasi alveolus masif dengan eksudat purulen kekuningan, hiperemia kapiler, dan hilangnya aerasi paru-paru.",
    organTint: "#a3e635", // Sickly pale yellow-greenish pus
    roughness: 0.75,
    metalness: 0.02,
    clearcoat: 0.25,
    emissive: "#3f6212",
    emissiveIntensity: 0.2,
    hasBleeding: false,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: false,
    hasPusInfiltrate: true,
  },
  cerebral_hemorrhage: {
    id: "cerebral_hemorrhage",
    title: "Pendarahan Intraserebral & Hematoma Akut (Cerebral Hemorrhage)",
    badge: "Stroke Hemoragik",
    description: "Ruptur aneurisma / vaskular serebral menyebabkan hematoma masif pada lobus korteks dan peningkatan tekanan intrakranial.",
    organTint: "#7f1d1d",
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.9,
    emissive: "#450a0a",
    emissiveIntensity: 0.4,
    hasBleeding: true,
    hasStabWound: false,
    hasTarDeposits: false,
    hasStones: false,
    hasHematoma: true,
    hasPusInfiltrate: false,
  },
};

/**
 * Pathology 3D Mutator Manager
 * Injects dynamic physical meshes (stab wounds, bleeding particles, tar deposits, stones, hematomas)
 * and mutates material shaders to reflect exact patient conditions in real time!
 */
export class PathologyMutator {
  private lesionGroup = new THREE.Group();
  private bleedingParticles: THREE.Points | null = null;
  private particleVelocities: THREE.Vector3[] = [];
  private currentPathology: PathologyConfig = PATHOLOGY_PRESETS.normal;
  private isAnimated = true;

  constructor(scene: THREE.Scene) {
    this.lesionGroup.name = "pathology-lesions-group";
    scene.add(this.lesionGroup);
  }

  public get pathology(): PathologyConfig {
    return this.currentPathology;
  }

  /**
   * Apply pathology mutation to the loaded organ meshes and spawn 3D physical lesions
   */
  public applyPathology(
    pathologyType: PathologyType,
    meshes: THREE.Mesh[],
    organPivot: THREE.Group,
  ) {
    const config = PATHOLOGY_PRESETS[pathologyType] || PATHOLOGY_PRESETS.normal;
    this.currentPathology = config;

    // 1. Clear any previous 3D lesion objects
    this.clearPhysicalLesions();

    // 2. Mutate Material Color, Roughness, Clearcoat, Emissive
    const tintColor = new THREE.Color(config.organTint);
    const emissiveColor = config.emissive ? new THREE.Color(config.emissive) : new THREE.Color(0x000000);

    meshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color.copy(tintColor);
          mat.roughness = config.roughness;
          mat.metalness = config.metalness;
          mat.emissive.copy(emissiveColor);
          mat.emissiveIntensity = config.emissiveIntensity || 0;

          if ("clearcoat" in mat) {
            const physical = mat as THREE.MeshPhysicalMaterial;
            physical.clearcoat = config.clearcoat ?? 0.35;
          }
          mat.needsUpdate = true;
        }
      });
    });

    // 3. Construct 3D Physical Lesion Geometry based on pathology config
    if (config.hasStabWound) {
      this.createStabWoundLesion(organPivot);
    }

    if (config.hasBleeding) {
      this.createActiveBleedingParticles(organPivot);
    }

    if (config.hasTarDeposits) {
      this.createTarCarbonDeposits(organPivot);
    }

    if (config.hasStones) {
      this.createKidneyStones(organPivot);
    }

    if (config.hasHematoma) {
      this.createHematomaMesh(organPivot);
    }

    if (config.hasPusInfiltrate) {
      this.createPusInfiltratePatches(organPivot);
    }
  }

  /**
   * Create a 3D physical stab wound entry & laceration slit
   */
  private createStabWoundLesion(_parent: THREE.Group) {
    const woundGroup = new THREE.Group();
    woundGroup.name = "stab-wound-lesion";

    // Puncture wound slit
    const slitGeo = new THREE.CylinderGeometry(0.08, 0.28, 1.2, 16);
    slitGeo.rotateZ(Math.PI / 3);
    const slitMat = new THREE.MeshStandardMaterial({
      color: 0x450a0a,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x2e0202,
      emissiveIntensity: 0.5,
    });
    const slitMesh = new THREE.Mesh(slitGeo, slitMat);
    slitMesh.position.set(0.4, 0.2, 1.25);
    woundGroup.add(slitMesh);

    // Surrounding torn flesh laceration ring
    const tornGeo = new THREE.TorusGeometry(0.32, 0.09, 12, 24);
    tornGeo.rotateX(Math.PI / 2);
    const tornMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.2,
      emissive: 0x4c0519,
      emissiveIntensity: 0.3,
    });
    const tornMesh = new THREE.Mesh(tornGeo, tornMat);
    tornMesh.position.set(0.4, 0.2, 1.28);
    woundGroup.add(tornMesh);

    // Add protruding piercing object / dagger tip illusion
    const bladeGeo = new THREE.ConeGeometry(0.12, 1.4, 8);
    bladeGeo.rotateX(Math.PI / 4);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.15,
    });
    const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
    bladeMesh.position.set(0.55, 0.45, 1.6);
    woundGroup.add(bladeMesh);

    this.lesionGroup.add(woundGroup);
  }

  /**
   * Create active 3D bleeding particles and blood oozing streams
   */
  private createActiveBleedingParticles(_parent: THREE.Group) {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    this.particleVelocities = [];

    const basePoint = new THREE.Vector3(0.4, 0.2, 1.25);

    for (let i = 0; i < particleCount; i++) {
      // Start near wound
      positions[i * 3] = basePoint.x + (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = basePoint.y + (Math.random() - 0.5) * 0.4 - Math.random() * 1.5;
      positions[i * 3 + 2] = basePoint.z + (Math.random() - 0.5) * 0.4;

      // Crimson to dark red gradient
      colors[i * 3] = 0.65 + Math.random() * 0.25; // R
      colors[i * 3 + 1] = 0.02 + Math.random() * 0.05; // G
      colors[i * 3 + 2] = 0.05 + Math.random() * 0.08; // B

      sizes[i] = 0.12 + Math.random() * 0.15;

      this.particleVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          -(0.025 + Math.random() * 0.04), // Gravity dripping down
          (Math.random() - 0.5) * 0.015,
        ),
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circle particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
    grad.addColorStop(0, "rgba(220, 38, 38, 1)");
    grad.addColorStop(0.6, "rgba(153, 27, 27, 0.85)");
    grad.addColorStop(1, "rgba(127, 29, 29, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.bleedingParticles = new THREE.Points(geometry, material);
    this.bleedingParticles.name = "active-bleeding-particles";
    this.lesionGroup.add(this.bleedingParticles);
  }

  /**
   * Create 3D physical tar & carbon deposits on lungs (Perokok)
   */
  private createTarCarbonDeposits(_parent: THREE.Group) {
    const tarGroup = new THREE.Group();
    tarGroup.name = "tar-carbon-deposits";

    const clusterCount = 38;
    const sphereGeo = new THREE.DodecahedronGeometry(0.16, 1);
    const tarMat = new THREE.MeshStandardMaterial({
      color: 0x09090b, // Pitch black soot
      roughness: 0.95,
      metalness: 0.1,
    });

    for (let i = 0; i < clusterCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, tarMat);
      const side = i % 2 === 0 ? 1 : -1;
      const angle = (i / clusterCount) * Math.PI * 2;
      const radius = 1.1 + Math.random() * 0.5;

      mesh.position.set(
        side * (0.6 + Math.random() * 0.9),
        -0.8 + Math.random() * 1.8,
        Math.sin(angle) * radius * 0.6 + 0.3,
      );
      const s = 0.5 + Math.random() * 1.4;
      mesh.scale.set(s * (1 + Math.random() * 0.5), s, s * (0.8 + Math.random() * 0.6));
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      tarGroup.add(mesh);
    }

    this.lesionGroup.add(tarGroup);
  }

  /**
   * Create 3D jagged crystalline kidney stones
   */
  private createKidneyStones(_parent: THREE.Group) {
    const stoneGroup = new THREE.Group();
    stoneGroup.name = "kidney-stones-3d";

    const stoneGeo = new THREE.IcosahedronGeometry(0.24, 0);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a, // Sharp yellowish calcium oxalate crystal
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x713f12,
      emissiveIntensity: 0.25,
    });

    for (let i = 0; i < 6; i++) {
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(
        -0.2 + (i % 2) * 0.4 + (Math.random() - 0.5) * 0.2,
        -0.4 + i * 0.25,
        0.5 + (Math.random() - 0.5) * 0.2,
      );
      const scale = 0.7 + Math.random() * 0.8;
      stone.scale.set(scale, scale * 1.3, scale);
      stone.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      stoneGroup.add(stone);
    }

    this.lesionGroup.add(stoneGroup);
  }

  /**
   * Create 3D bulging hematoma blood clot mass
   */
  private createHematomaMesh(_parent: THREE.Group) {
    const hematomaGeo = new THREE.SphereGeometry(0.65, 24, 24);
    hematomaGeo.scale(1.2, 0.8, 0.6);
    const hematomaMat = new THREE.MeshStandardMaterial({
      color: 0x3b0764, // Dark clotted hematoma purple-black
      roughness: 0.25,
      metalness: 0.1,
      emissive: 0x581c87,
      emissiveIntensity: 0.35,
    });
    const hematoma = new THREE.Mesh(hematomaGeo, hematomaMat);
    hematoma.name = "hematoma-clot-mesh";
    hematoma.position.set(0.65, 0.4, 0.85);
    this.lesionGroup.add(hematoma);
  }

  /**
   * Create purulent infiltrate / pus consolidation patches (Pneumonia)
   */
  private createPusInfiltratePatches(_parent: THREE.Group) {
    const pusGroup = new THREE.Group();
    pusGroup.name = "pus-infiltrate-patches";

    const pusGeo = new THREE.SphereGeometry(0.4, 16, 16);
    pusGeo.scale(1.5, 0.9, 0.5);
    const pusMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.8,
      transparent: true,
      opacity: 0.75,
      emissive: 0x854d0e,
      emissiveIntensity: 0.2,
    });

    for (let i = 0; i < 8; i++) {
      const patch = new THREE.Mesh(pusGeo, pusMat);
      patch.position.set(
        0.5 + (Math.random() - 0.5) * 0.6,
        -0.8 + (Math.random() - 0.5) * 0.6,
        0.65 + (Math.random() - 0.5) * 0.3,
      );
      const s = 0.6 + Math.random() * 0.8;
      patch.scale.set(s, s * 0.7, s * 0.4);
      pusGroup.add(patch);
    }

    this.lesionGroup.add(pusGroup);
  }

  /**
   * Update animation frame for bleeding particles & pulsing hematomas
   */
  public update(_delta: number) {
    if (!this.isAnimated) return;

    // Animate dripping bleeding particles
    if (this.bleedingParticles) {
      const positions = this.bleedingParticles.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      const origin = new THREE.Vector3(0.4, 0.2, 1.25);

      for (let i = 0; i < count; i++) {
        const vel = this.particleVelocities[i];
        if (!vel) continue;

        positions[i * 3] += vel.x;
        positions[i * 3 + 1] += vel.y;
        positions[i * 3 + 2] += vel.z;

        // Reset particle when it drips too far down
        if (positions[i * 3 + 1] < -2.2) {
          positions[i * 3] = origin.x + (Math.random() - 0.5) * 0.3;
          positions[i * 3 + 1] = origin.y + (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.3;
        }
      }

      this.bleedingParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * Clean up all 3D lesion objects
   */
  public clearPhysicalLesions() {
    while (this.lesionGroup.children.length > 0) {
      const child = this.lesionGroup.children[0];
      this.lesionGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    }
    this.bleedingParticles = null;
    this.particleVelocities = [];
  }

  public dispose() {
    this.clearPhysicalLesions();
    this.lesionGroup.removeFromParent();
  }
}

/**
 * AI Pathology Inference Engine
 * Matches clinical symptoms, smoking status, trauma history, or disease diagnosis to 3D pathology mutations.
 */
export function inferPathologyFromClinicalText(text: string, organId?: OrganId): PathologyType {
  const lower = text.toLowerCase();

  // 1. Smoker / Carbon / Tar / COPD
  if (
    lower.includes("rokok") ||
    lower.includes("perokok") ||
    lower.includes("smoker") ||
    lower.includes("tar") ||
    lower.includes("antrakosis") ||
    lower.includes("hitam") ||
    lower.includes("copd") ||
    lower.includes("ppok") ||
    lower.includes("emfisema")
  ) {
    return "smoker_tar";
  }

  // 2. Stab Wound / Bleeding / Trauma / Puncture / Laceration
  if (
    lower.includes("tusuk") ||
    lower.includes("tertusuk") ||
    lower.includes("pisau") ||
    lower.includes("luka") ||
    lower.includes("pendarahan") ||
    lower.includes("perdarahan") ||
    lower.includes("bleeding") ||
    lower.includes("hemorrhage") ||
    lower.includes("laserasi") ||
    lower.includes("trauma")
  ) {
    if (organId === "brain") return "cerebral_hemorrhage";
    return "stab_wound_bleeding";
  }

  // 3. Heart Infarction / STEMI / Ischemia
  if (
    lower.includes("infark") ||
    lower.includes("stemi") ||
    lower.includes("nstemi") ||
    lower.includes("iskemia") ||
    lower.includes("ischemia") ||
    lower.includes("coronary") ||
    lower.includes("serangan jantung")
  ) {
    return "acute_infarction";
  }

  // 4. Kidney Stone / Nephrolithiasis
  if (
    lower.includes("batu") ||
    lower.includes("kristal") ||
    lower.includes("nefrolitiasis") ||
    lower.includes("litiasis") ||
    lower.includes("kalkulus") ||
    lower.includes("hematuria")
  ) {
    return "kidney_stone";
  }

  // 5. Cirrhosis / Jaundice / Hepatitis
  if (
    lower.includes("sirosis") ||
    lower.includes("kuning") ||
    lower.includes("ikterus") ||
    lower.includes("jaundice") ||
    lower.includes("hepatitis") ||
    lower.includes("hepatobilier")
  ) {
    return "cirrhosis_jaundice";
  }

  // 6. Pneumonia / Infection / Pus / Infiltrate
  if (
    lower.includes("pneumonia") ||
    lower.includes("purulen") ||
    lower.includes("nanah") ||
    lower.includes("pus") ||
    lower.includes("infiltrat") ||
    lower.includes("konsolidasi") ||
    lower.includes("sputum")
  ) {
    return "purulent_infection";
  }

  // 7. Stroke / Cerebral Hemorrhage
  if (
    lower.includes("stroke") ||
    lower.includes("aneurisma") ||
    lower.includes("pelo") ||
    lower.includes("hematoma") ||
    lower.includes("otak")
  ) {
    return "cerebral_hemorrhage";
  }

  return "normal";
}
