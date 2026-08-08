export type OrganId =
  | "heart"
  | "brain"
  | "lungs"
  | "liver"
  | "kidneys"
  | "eyeball"
  | "intestine"
  | "pancreas"
  | "skin";

export type Hotspot = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
  color: string;
  severity?: "NORMAL" | "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";
  clinicalNote?: string;
  finding?: string;
};

export type Organ = {
  id: OrganId;
  name: string;
  scientificName: string;
  system: string;
  model: string;
  icon: string;
  accent: string;
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  funFact: string;
  tissue: string;
  comparison: string;
  conditions: string[];
  hotspots: Hotspot[];
  illustrated: boolean;
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: "Heart",
    scientificName: "Cor",
    system: "Cardiovascular",
    model: "/models/heart.glb",
    icon: "♥",
    accent: "#ee7c6a",
    description: "A muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to every cell.",
    poetic: "The tireless pump",
    size: "About the size of your fist",
    weight: "250–350 g",
    location: "Behind the sternum, slightly left",
    function: "Circulates oxygenated blood",
    dailyFact: "Beats about 100,000 times a day",
    medical: "Its electrical conduction system coordinates atrial and ventricular contractions.",
    bloodSupply: "Left and right coronary arteries (LAD, LCx, RCA)",
    funFact: "It beats roughly 2.5 billion times in an average lifetime, starting before birth.",
    tissue: "Myocardium (cardiac muscle)",
    comparison: "Heart vs. brain",
    conditions: [
      "Coronary artery disease",
      "Arrhythmia",
      "Heart valve disorders",
      "Heart failure",
      "Cardiomyopathy",
      "Myocarditis",
      "Atrial fibrillation",
      "Congenital heart defects"
    ],
    illustrated: true,
    hotspots: [
      { id: "aorta", label: "Aorta", detail: "Main systemic arterial outflow", position: [-0.35, 1.65, 0.55], color: "#ee7c6a" },
      { id: "left-atrium", label: "Left Atrium", detail: "Receives oxygenated blood from pulmonary veins", position: [0.82, 0.65, 0.5], color: "#f2a33b" },
      { id: "right-atrium", label: "Right Atrium", detail: "Receives deoxygenated systemic venous blood", position: [-0.9, 0.35, 0.55], color: "#6393d8" },
      { id: "left-ventricle", label: "Left Ventricle", detail: "Primary systemic muscular pump", position: [0.7, -0.75, 0.65], color: "#f2a33b" },
      { id: "right-ventricle", label: "Right Ventricle", detail: "Pumps venous blood into pulmonary circulation", position: [-0.65, -0.68, 0.66], color: "#ee7c6a" },
      { id: "mitral", label: "Mitral Valve", detail: "Bicuspid valve preventing ventricular-atrial regurgitation", position: [0.18, -1.35, 0.48], color: "#d89bc4" },
    ],
  },
  {
    id: "brain",
    name: "Brain",
    scientificName: "Encephalon",
    system: "Nervous System",
    model: "/models/brain.glb",
    icon: "◉",
    accent: "#c58696",
    description: "The body’s central processing center, integrating sensation, cognitive function, and motor control.",
    poetic: "The command center",
    size: "Roughly two clenched fists",
    weight: "1.3–1.4 kg",
    location: "Cranial cavity (protected by skull and meninges)",
    function: "Cognition, motor coordination, neural integration",
    dailyFact: "Consumes ~20% of total basal oxygen and glucose",
    medical: "Composed of cerebral cortex, basal ganglia, brainstem, and cerebellum.",
    bloodSupply: "Circle of Willis (Internal carotid & vertebral arteries)",
    funFact: "Brain parenchyma has no nociceptors (pain receptors); headaches originate from meninges and vascular structures.",
    tissue: "Gray matter (neuronal somas) & white matter (axons)",
    comparison: "Brain vs. eye",
    conditions: [
      "Ischemic / Hemorrhagic Stroke",
      "Traumatic brain injury",
      "Epilepsy & seizures",
      "Meningitis / Encephalitis",
      "Alzheimer's & Parkinson's disease",
      "Intracranial neoplasm"
    ],
    illustrated: true,
    hotspots: [
      { id: "frontal", label: "Frontal Lobe", detail: "Executive function, motor control & speech (Broca)", position: [-0.7, 0.65, 0.8], color: "#ee7c6a" },
      { id: "parietal", label: "Parietal Lobe", detail: "Somatosensory processing & spatial awareness", position: [0.15, 1.1, 0.65], color: "#f2a33b" },
      { id: "temporal", label: "Temporal Lobe", detail: "Auditory processing, language comprehension (Wernicke) & memory (Hippocampus)", position: [0.75, -0.1, 0.82], color: "#6393d8" },
      { id: "cerebellum", label: "Cerebellum", detail: "Motor fine-tuning, balance, and procedural coordination", position: [0.72, -0.9, 0.55], color: "#d89bc4" },
    ],
  },
  {
    id: "lungs",
    name: "Lungs",
    scientificName: "Pulmones",
    system: "Respiratory System",
    model: "/models/lungs.glb",
    icon: "◍",
    accent: "#dd8f8b",
    description: "Paired respiratory organs enabling alveolar gas exchange between inspired air and bloodstream.",
    poetic: "The breath of life",
    size: "Each approx. 20–25 cm length",
    weight: "Combined approx. 1,000 g",
    location: "Thoracic cavity, pleural cavities bilaterally",
    function: "Oxygen uptake and carbon dioxide elimination",
    dailyFact: "Processes over 11,000 liters of air daily",
    medical: "Microscopic alveoli (~300-500 million) yield ~70-100 m² of surface area.",
    bloodSupply: "Pulmonary arteries (deox) & bronchial arteries (ox)",
    funFact: "Right lung has 3 lobes (superior, middle, inferior); left lung has 2 lobes with cardiac notch.",
    tissue: "Alveolar epithelial lining (Type I & II pneumocytes)",
    comparison: "Lungs vs. heart",
    conditions: [
      "Pneumonia / Bronchopneumonia",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Asthma / Bronchospasm",
      "Pulmonary Embolism",
      "Pleural Effusion",
      "Pulmonary Tuberculosis",
      "Acute Respiratory Distress Syndrome (ARDS)"
    ],
    illustrated: true,
    hotspots: [
      { id: "trachea", label: "Trachea", detail: "Cartilaginous central airway conduct", position: [0, 1.6, 0.2], color: "#6393d8" },
      { id: "right-lung", label: "Right Lung", detail: "Three distinct lobes (Upper, Middle, Lower)", position: [-1.2, 0.1, 0.7], color: "#ee7c6a" },
      { id: "left-lung", label: "Left Lung", detail: "Two lobes with cardiac notch accommodation", position: [1.2, 0.1, 0.7], color: "#f2a33b" },
      { id: "bronchus", label: "Bronchial Tree", detail: "Primary & secondary bronchial bifurcations", position: [-0.03, 0.3, 0.35], color: "#d89bc4" },
      { id: "base", label: "Basal Segments", detail: "Inferior diaphragmatic surface", position: [-1.14, -1.2, 1], color: "#7fa88a" },
    ],
  },
  {
    id: "liver",
    name: "Liver",
    scientificName: "Hepar",
    system: "Digestive / Metabolic System",
    model: "/models/liver.glb",
    icon: "≈",
    accent: "#b86858",
    description: "The primary metabolic powerhouse responsible for detoxification, bile synthesis, and protein production.",
    poetic: "The vital alchemist",
    size: "Approx. 21–22 cm transverse span",
    weight: "1.4–1.6 kg",
    location: "Right hypochondrium and epigastrium",
    function: "Bile secretion, drug metabolism, glycogen storage, albumin synthesis",
    dailyFact: "Performs over 500 essential physiological tasks",
    medical: "Exhibits unique regenerative capacity mediated by hepatocyte hyperplastic response.",
    bloodSupply: "Dual supply: 75% Portal Vein, 25% Hepatic Artery",
    funFact: "Can regenerate back to full physiological functional capacity from as little as 25% parenchyma.",
    tissue: "Hepatic lobules with sinusoids and Kupffer cells",
    comparison: "Liver vs. intestine",
    conditions: [
      "Nonalcoholic Fatty Liver Disease (NAFLD / MASLD)",
      "Viral Hepatitis (A, B, C)",
      "Hepatic Cirrhosis",
      "Hepatocellular Carcinoma",
      "Portal Hypertension",
      "Cholelithiasis / Biliary Stasis"
    ],
    illustrated: true,
    hotspots: [
      { id: "right-lobe", label: "Right Lobe", detail: "Major anatomical bulk of hepatic parenchyma", position: [-0.75, 0.35, 0.75], color: "#ee7c6a" },
      { id: "left-lobe", label: "Left Lobe", detail: "Extends across epigastric midline", position: [0.85, 0.25, 0.75], color: "#f2a33b" },
      { id: "portal", label: "Porta Hepatis", detail: "Triad entry (Portal vein, Hepatic artery, Common bile duct)", position: [0.1, -0.3, 0.82], color: "#6393d8" },
    ],
  },
  {
    id: "kidneys",
    name: "Kidneys",
    scientificName: "Renes",
    system: "Urinary / Renal System",
    model: "/models/kidneys.glb",
    icon: "∞",
    accent: "#c96963",
    description: "Retroperitoneal filtration organs maintaining fluid-electrolyte homeostasis, blood pressure, and acid-base balance.",
    poetic: "The master filters",
    size: "10–12 cm length each",
    weight: "130–150 g each",
    location: "Retroperitoneal space (T12–L3 vertebral levels)",
    function: "Glomerular ultrafiltration, renin secretion, erythropoietin production",
    dailyFact: "Filters approx. 180 liters of blood plasma daily",
    medical: "Nephrons (~1 million per kidney) maintain exact extracellular osmolarity.",
    bloodSupply: "Renal arteries receiving ~20-25% of cardiac output",
    funFact: "Filters 180 liters of glomerular filtrate daily but concentrates 99% back, excreting only 1.5–2L urine.",
    tissue: "Renal cortex (glomeruli) & renal medulla (tubules and collecting ducts)",
    comparison: "Kidneys vs. liver",
    conditions: [
      "Chronic Kidney Disease (CKD Stage 1-5)",
      "Acute Kidney Injury (AKI)",
      "Nephrolithiasis (Kidney Stones)",
      "Glomerulonephritis / Nephrotic Syndrome",
      "Renal Artery Stenosis",
      "Urinary Tract Infection (Pyelonephritis)"
    ],
    illustrated: true,
    hotspots: [
      { id: "cortex", label: "Renal Cortex", detail: "Ultrafiltration glomeruli & proximal convoluted tubules", position: [-0.9, 0.55, 0.7], color: "#ee7c6a" },
      { id: "medulla", label: "Renal Medulla", detail: "Renal pyramids and Henle loops for osmotic concentration", position: [0.85, 0.2, 0.7], color: "#f2a33b" },
      { id: "ureter", label: "Renal Pelvis / Ureter", detail: "Conduit draining urine toward bladder", position: [0.4, -1.1, 0.5], color: "#6393d8" },
    ],
  },
  {
    id: "eyeball",
    name: "Eye",
    scientificName: "Oculus",
    system: "Special Sensory System",
    model: "/models/eyeball.glb",
    icon: "⊙",
    accent: "#7294b9",
    description: "High-precision sensory apparatus transducing photons into neurological impulses for visual perception.",
    poetic: "The optic sphere",
    size: "Approx. 24 mm axial diameter",
    weight: "Approx. 7.5 g",
    location: "Orbital cavity of the cranium",
    function: "Light refraction, photoreception, visual pathway signaling",
    dailyFact: "Executes over 100,000 saccadic ocular movements each day",
    medical: "Retinal photoreceptors (rods & cones) transmit through CN II (Optic Nerve).",
    bloodSupply: "Ophthalmic artery & central retinal artery",
    funFact: "The cornea is avascular and receives its oxygen directly from atmospheric diffusion and aqueous humor.",
    tissue: "Corneal epithelium, crystalline lens, neural retina",
    comparison: "Eye vs. brain",
    conditions: [
      "Glaucoma (Elevated intraocular pressure)",
      "Diabetic Retinopathy",
      "Cataract / Lens opacification",
      "Macular Degeneration",
      "Retinal Detachment",
      "Myopia / Hyperopia / Astigmatism"
    ],
    illustrated: true,
    hotspots: [
      { id: "cornea", label: "Cornea & Anterior Chamber", detail: "Primary refractive optical element", position: [-0.94, 0.05, 1.47], color: "#6393d8" },
      { id: "iris", label: "Iris & Pupil", detail: "Aperture mechanism regulating incident lux", position: [-1.22, -0.53, 1.15], color: "#f2a33b" },
      { id: "optic", label: "Optic Nerve (CN II)", detail: "Transmits neural retinotopic signal to visual cortex", position: [1.61, -0.18, 0.54], color: "#d89bc4" },
    ],
  },
  {
    id: "intestine",
    name: "Intestines",
    scientificName: "Intestinum",
    system: "Gastrointestinal System",
    model: "/models/intestine.glb",
    icon: "§",
    accent: "#d78b77",
    description: "Extensive mucosal tract coordinating enzymatic digestion, macronutrient absorption, and microbiome balance.",
    poetic: "The digestive conduit",
    size: "6–7 meters extended total length",
    weight: "Approx. 2.0 kg",
    location: "Abdominopelvic cavity",
    function: "Nutrient breakdown, fluid reabsorption, barrier immunology",
    dailyFact: "Harbors over 38 trillion commensal microorganisms",
    medical: "Villi and microvilli expand absorption surface to ~30 m².",
    bloodSupply: "Superior & inferior mesenteric arteries",
    funFact: "Enteric nervous system has ~500 million neurons, often dubbed the 'second brain'.",
    tissue: "Enterocyte mucosal lining with microvilli brush border",
    comparison: "Intestine vs. liver",
    conditions: [
      "Inflammatory Bowel Disease (Crohn's / Ulcerative Colitis)",
      "Irritable Bowel Syndrome (IBS)",
      "Gastroenteritis / Infectious Colitis",
      "Intestinal Obstruction / Ileus",
      "Colorectal Neoplasm / Polyps",
      "Celiac Disease"
    ],
    illustrated: true,
    hotspots: [
      { id: "duodenum", label: "Duodenum", detail: "Initial proximal C-loop receiving chyme & bile", position: [0.6, 0.8, 0.75], color: "#f2a33b" },
      { id: "jejunum", label: "Jejunum & Ileum", detail: "Primary site of nutrient and vitamin absorption", position: [-0.45, 0.1, 0.82], color: "#ee7c6a" },
      { id: "colon", label: "Large Intestine / Colon", detail: "Water reabsorption, electrolyte balance & fecal transit", position: [0.75, -0.55, 0.72], color: "#6393d8" },
    ],
  },
  {
    id: "pancreas",
    name: "Pancreas",
    scientificName: "Pancreas",
    system: "Endocrine & Exocrine System",
    model: "/models/pancreas.glb",
    icon: "◈",
    accent: "#c69a5e",
    description: "Dual glandular organ secreting digestive enzymes and glycemic regulatory hormones (insulin, glucagon).",
    poetic: "The metabolic regulator",
    size: "Approx. 15 cm length",
    weight: "70–100 g",
    location: "Retroperitoneal, posterior to stomach bed",
    function: "Exocrine amylase/lipase secretion; Endocrine insulin/glucagon production",
    dailyFact: "Produces ~1.5 liters of enzyme-rich pancreatic fluid daily",
    medical: "Islets of Langerhans (beta/alpha cells) control global glucose equilibrium.",
    bloodSupply: "Splenic artery and pancreaticoduodenal vascular arcades",
    funFact: "98% of mass is exocrine acinar tissue; only 2% consists of endocrine islets.",
    tissue: "Pancreatic acini & Langerhans islet clusters",
    comparison: "Pancreas vs. liver",
    conditions: [
      "Acute / Chronic Pancreatitis",
      "Type 1 & Type 2 Diabetes Mellitus",
      "Pancreatic Adenocarcinoma",
      "Exocrine Pancreatic Insufficiency (EPI)",
      "Pancreatic Pseudocyst"
    ],
    illustrated: true,
    hotspots: [
      { id: "head", label: "Head of Pancreas", detail: "Nestled within duodenal curve, prone to biliary compression", position: [-1.32, -0.36, 0.55], color: "#ee7c6a" },
      { id: "body", label: "Body of Pancreas", detail: "Main parenchymal segment crossing lumbar spine", position: [0.05, 0.25, 0.45], color: "#f2a33b" },
      { id: "tail", label: "Tail of Pancreas", detail: "Distal projection reaching splenic hilum", position: [1.55, 0.3, 0.35], color: "#6393d8" },
      { id: "duct", label: "Main Pancreatic Duct (Wirsung)", detail: "Conveys digestive zymogens to ampulla of Vater", position: [-0.61, 0.39, 0.5], color: "#d89bc4" },
    ],
  },
  {
    id: "skin",
    name: "Integumentary System",
    scientificName: "Integumentum",
    system: "Integumentary System",
    model: "/models/skin.glb",
    icon: "▦",
    accent: "#c99277",
    description: "The body’s primary physical barrier, sensing environmental stimuli, preventing desiccation, and regulating body temperature.",
    poetic: "The vital shield",
    size: "Approx. 1.8–2.0 m² surface coverage",
    weight: "3.5–5.0 kg (~16% body mass)",
    location: "External body surface",
    function: "Thermoregulation, cutaneous sensation, barrier defense, Vitamin D synthesis",
    dailyFact: "Sheds approx. 500 million dead epidermal cells each 24 hours",
    medical: "Stratified architecture: Epidermis, Dermis, and Hypodermal subcutaneous adipose.",
    bloodSupply: "Subepidermal and dermal vascular plexuses",
    funFact: "Contains miles of capillary networks and millions of sensory nerve receptors.",
    tissue: "Stratified squamous keratinized epithelium & dense irregular connective tissue",
    comparison: "Skin vs. intestine",
    conditions: [
      "Atopic Dermatitis / Eczema",
      "Psoriasis Vulgaris",
      "Malignant Melanoma / Basal Cell Carcinoma",
      "Bacterial Cellulitis / Erysipelas",
      "Urticaria / Allergic Exanthem",
      "Burn Injuries (1st-3rd degree)"
    ],
    illustrated: true,
    hotspots: [
      { id: "epidermis", label: "Epidermis & Stratum Corneum", detail: "Avascular keratinized barrier against pathogens", position: [-0.05, 0.88, 1.4], color: "#ee7c6a" },
      { id: "dermis", label: "Dermis (Papillary & Reticular)", detail: "Houses collagen fibers, sensory nerve endings & capillaries", position: [0.29, 0.05, 1.4], color: "#f2a33b" },
      { id: "hypodermis", label: "Hypodermis / Subcutis", detail: "Adipose cushion providing thermal insulation and shock absorption", position: [-0.39, -1.15, 1.4], color: "#6393d8" },
      { id: "follicle", label: "Pilosebaceous Unit", detail: "Hair follicle with associated sebaceous gland", position: [0.89, -0.44, 1.4], color: "#d89bc4" },
    ],
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>;

/**
 * Utility to match clinical text / diagnosis finding to an Organ ID and Hotspot ID.
 */
export function resolveOrganFromText(text: string): OrganId | null {
  const lower = text.toLowerCase();
  if (lower.includes("jantung") || lower.includes("heart") || lower.includes("cor") || lower.includes("ventrikel") || lower.includes("atrium") || lower.includes("aorta") || lower.includes("cardio") || lower.includes("miokard")) {
    return "heart";
  }
  if (lower.includes("otak") || lower.includes("brain") || lower.includes("cerebr") || lower.includes("temporal") || lower.includes("frontal") || lower.includes("parietal") || lower.includes("stroke") || lower.includes("head")) {
    return "brain";
  }
  if (lower.includes("paru") || lower.includes("lung") || lower.includes("pulmo") || lower.includes("bronk") || lower.includes("trachea") || lower.includes("pneumon") || lower.includes("infiltrat") || lower.includes("efusi")) {
    return "lungs";
  }
  if (lower.includes("hati") || lower.includes("liver") || lower.includes("hepar") || lower.includes("hepat") || lower.includes("empedu") || lower.includes("sgot") || lower.includes("sgpt")) {
    return "liver";
  }
  if (lower.includes("ginjal") || lower.includes("kidney") || lower.includes("ren") || lower.includes("nefr") || lower.includes("ureter") || lower.includes("kreatinin") || lower.includes("ureum")) {
    return "kidneys";
  }
  if (lower.includes("mata") || lower.includes("eye") || lower.includes("ocul") || lower.includes("retina") || lower.includes("kornea") || lower.includes("visus") || lower.includes("glaucoma")) {
    return "eyeball";
  }
  if (lower.includes("usus") || lower.includes("intestine") || lower.includes("colon") || lower.includes("gastro") || lower.includes("duodenum") || lower.includes("ileum") || lower.includes("lambung")) {
    return "intestine";
  }
  if (lower.includes("pankreas") || lower.includes("pancreas") || lower.includes("insulin") || lower.includes("diabetes") || lower.includes("gula darah") || lower.includes("hba1c")) {
    return "pancreas";
  }
  if (lower.includes("kulit") || lower.includes("skin") || lower.includes("derma") || lower.includes("epiderm") || lower.includes("lesi") || lower.includes("ruam")) {
    return "skin";
  }
  return null;
}

/**
 * Returns color hex corresponding to medical severity level.
 */
export function getSeverityColor(severity?: string): string {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "#ef4444"; // Red 500
    case "SEVERE":
      return "#f97316"; // Orange 500
    case "MODERATE":
      return "#eab308"; // Yellow 500
    case "MILD":
      return "#38bdf8"; // Sky 400
    case "NORMAL":
    default:
      return "#22c55e"; // Emerald 500
  }
}
