import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EYE_CONFIG as C } from "../config/eyes";

/**
 * Aparência dos olhos (geometria/materiais) mora neste arquivo.
 * Valores ajustáveis (cor, tamanho, velocidade, piscada) ficam em src/config/eyes.ts
 */

/** Calota esférica: anéis contínuos que acompanham a curvatura do globo. */
function IrisCap({
  radius,
  theta,
  color,
  emissive,
  emissiveIntensity = 1,
  roughness = 0.25,
  metalness = 0.6,
}: {
  radius: number;
  theta: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <sphereGeometry args={[radius, 64, 32, 0, Math.PI * 2, 0, theta]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

/**
 * Íris feita de centenas de pontinhos (LEDs) distribuídos em anéis radiais,
 * exatamente sobre a curvatura do globo. Usa InstancedMesh (1 draw call).
 */
function DottedIris({ radius }: { radius: number }) {
  const mesh = useMemo(() => {
    const cfg = C.iris;
    const cInner = new THREE.Color(C.colors.irisInner);
    const cOuter = new THREE.Color(C.colors.irisOuter);

    type Dot = { p: THREE.Vector3; s: number; c: THREE.Color };
    const dots: Dot[] = [];

    for (let i = 0; i < cfg.rings; i++) {
      const t = cfg.rings === 1 ? 0 : i / (cfg.rings - 1);
      const theta = cfg.thetaInner + (cfg.thetaOuter - cfg.thetaInner) * t;
      const ringRadius = Math.sin(theta) * radius;
      const size = cfg.dotSize * (1 + (cfg.dotSizeOuterBoost - 1) * t);
      const count = Math.max(6, Math.round((2 * Math.PI * ringRadius * cfg.density) / (size * 3.3)));
      const offset = (i % 2) * (Math.PI / count);
      const color = cInner.clone().lerp(cOuter, t);
      const brightness = cfg.brightnessInner + (cfg.brightnessOuter - cfg.brightnessInner) * t;

      for (let j = 0; j < count; j++) {
        const phi = offset + (j / count) * Math.PI * 2;
        const jt = theta + (Math.random() - 0.5) * cfg.jitter * 0.06;
        const jp = phi + (Math.random() - 0.5) * cfg.jitter * (Math.PI / count);
        dots.push({
          p: new THREE.Vector3(
            radius * Math.sin(jt) * Math.cos(jp),
            radius * Math.sin(jt) * Math.sin(jp),
            radius * Math.cos(jt),
          ),
          s: size * (1 + (Math.random() - 0.5) * cfg.jitter),
          c: color.clone().multiplyScalar(brightness * (0.85 + Math.random() * 0.3)),
        });
      }
    }

    const geo = new THREE.SphereGeometry(1, 8, 6);
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
    const im = new THREE.InstancedMesh(geo, mat, dots.length);
    const m4 = new THREE.Matrix4();
    dots.forEach((d, idx) => {
      m4.makeScale(d.s, d.s, d.s * 0.8);
      m4.setPosition(d.p);
      im.setMatrixAt(idx, m4);
      im.setColorAt(idx, d.c);
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    return im;
  }, [radius]);

  return <primitive object={mesh} />;
}

/** Pálpebra robótica: calota escura que desce/sobe sobre o globo. */
function Lid({
  lower,
  radius,
  lidRef,
}: {
  lower: boolean;
  radius: number;
  lidRef: React.RefObject<THREE.Mesh | null>;
}) {
  // Calota esférica (meia esfera). Ela NÃO é escalada — apenas gira sobre o eixo X,
  // então a borda da pálpebra sempre acompanha a curvatura do globo (sem retângulos).
  const geo = useMemo(
    () =>
      new THREE.SphereGeometry(
        radius,
        64,
        32,
        0,
        Math.PI * 2,
        lower ? Math.PI / 2 : 0,
        Math.PI / 2,
      ),
    [radius, lower],
  );
  return (
    <mesh ref={lidRef} geometry={geo}>
      <meshStandardMaterial color="#04080d" roughness={0.4} metalness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Ângulos: pálpebra escondida atrás do globo (aberto) -> cobrindo a frente (fechado). */
const LID_OPEN = Math.PI / 2 + 0.18;

function Eye({ x }: { x: number }) {
  const globe = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Mesh>(null);
  const lower = useRef<THREE.Mesh>(null);
  const r = C.eyeRadius;

  // estado do olhar (compartilhado via módulo abaixo)
  useFrame(() => {
    if (globe.current) {
      globe.current.rotation.y = gaze.yaw;
      globe.current.rotation.x = gaze.pitch;
    }
    const close = gaze.blink; // 0 aberto -> 1 fechado
    // pálpebra superior desce em arco; a inferior sobe um pouco menos
    if (upper.current) upper.current.rotation.x = -LID_OPEN + close * (LID_OPEN + 0.06);
    if (lower.current) lower.current.rotation.x = LID_OPEN - close * (LID_OPEN + 0.02) * 0.92;
  });


  return (
    <group position={[x, 0, 0]}>
      {/* globo que gira de verdade */}
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[r, 48, 32]} />
          <meshStandardMaterial color={C.colors.sclera} roughness={0.35} metalness={0.85} />
        </mesh>
        {/* íris: campo de LEDs em anéis radiais (referência) */}
        <group position={[0, 0, 0]}>
          {/* anel externo fino (limbo) */}
          <IrisCap radius={r * 1.0} theta={C.iris.thetaOuter + 0.05} color={C.colors.irisOuter} emissive={C.colors.irisOuter} emissiveIntensity={0.5} metalness={0.4} roughness={0.25} />
          {/* fundo profundo da íris */}
          <IrisCap radius={r * 1.004} theta={C.iris.thetaOuter + 0.02} color={C.colors.irisDeep} emissive={C.colors.glow} emissiveIntensity={0.12} />
          {/* pontinhos */}
          <DottedIris radius={r * 1.012} />
          {/* pupila */}
          <IrisCap radius={r * 1.02} theta={C.iris.thetaInner - 0.02} color={C.colors.pupil} roughness={0.1} metalness={0.2} />
        </group>

        {/* cúpula de vidro com reflexo */}
        <mesh>
          <sphereGeometry args={[r * 1.045, 48, 32]} />
          <meshStandardMaterial
            color={C.colors.glass}
            transparent
            opacity={0.1}
            roughness={0.05}
            metalness={0.2}
            envMapIntensity={1}
          />
        </mesh>
      </group>

      {/* pálpebras (não giram com o globo) */}
      <Lid lower={false} radius={r * 1.07} lidRef={upper} />
      <Lid lower radius={r * 1.062} lidRef={lower} />

    </group>
  );
}

/** Estado global do olhar — atualizado uma vez por frame. */
const gaze = { yaw: 0, pitch: 0, blink: 0 };

function GazeDriver() {
  const s = useRef({
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    hold: 1,
    blinkIn: 2,
    blinkT: -1,
    queued: 0,
  });

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const st = s.current;
    const m = C.motion;

    // novo alvo em tempos aleatórios
    st.hold -= dt;
    if (st.hold <= 0) {
      st.hold = m.minHold + Math.random() * (m.maxHold - m.minHold);
      if (Math.random() < m.centerChance) {
        st.targetYaw = 0;
        st.targetPitch = 0;
      } else {
        st.targetYaw = (Math.random() * 2 - 1) * m.maxYaw;
        st.targetPitch = (Math.random() * 2 - 1) * m.maxPitch;
      }
    }

    const k = 1 - Math.exp(-m.smoothing * dt);
    st.yaw += (st.targetYaw - st.yaw) * k;
    st.pitch += (st.targetPitch - st.pitch) * k;

    const t = state.clock.elapsedTime;
    gaze.yaw = st.yaw + Math.sin(t * 1.7) * m.microMovement;
    gaze.pitch = -st.pitch + Math.cos(t * 2.3) * m.microMovement;

    // piscar
    const b = C.blink;
    if (st.blinkT >= 0) {
      st.blinkT += dt;
      const p = st.blinkT / b.duration;
      if (p >= 1) {
        st.blinkT = -1;
        gaze.blink = 0;
        if (st.queued > 0) {
          st.queued--;
          st.blinkT = 0;
        } else {
          st.blinkIn = b.minInterval + Math.random() * (b.maxInterval - b.minInterval);
        }
      } else {
        gaze.blink = Math.sin(p * Math.PI);
      }
    } else {
      st.blinkIn -= dt;
      if (st.blinkIn <= 0) {
        st.blinkT = 0;
        st.queued = Math.random() < b.doubleBlinkChance ? 1 : 0;
      }
    }
  });

  return null;
}

export default function RobotEyes() {
  return (
    <Canvas
      dpr={[1, C.maxPixelRatio]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, C.cameraDistance], fov: C.cameraFov }}
    >
      <color attach="background" args={[C.colors.background]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={1.1} color="#bfefff" />
      <pointLight position={[-4, -2, 3]} intensity={12} distance={16} color={C.colors.glow} />
      <GazeDriver />
      <Eye x={-C.eyeSeparation} />
      <Eye x={C.eyeSeparation} />
    </Canvas>
  );
}
