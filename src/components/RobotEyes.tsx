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

/** Pálpebra robótica: calota escura que desce/sobe sobre o globo. */
function Lid({
  flip,
  radius,
  lidRef,
}: {
  flip: boolean;
  radius: number;
  lidRef: React.RefObject<THREE.Mesh | null>;
}) {
  const geo = useMemo(
    () => new THREE.SphereGeometry(radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    [radius],
  );
  return (
    <mesh ref={lidRef} geometry={geo} rotation-x={flip ? Math.PI : 0} scale={[1, 0.001, 1]}>
      <meshStandardMaterial color="#04080d" roughness={0.35} metalness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

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
    if (upper.current) upper.current.scale.y = Math.max(0.001, close * 1.02);
    if (lower.current) lower.current.scale.y = Math.max(0.001, close * 0.55);
  });

  return (
    <group position={[x, 0, 0]}>
      {/* globo que gira de verdade */}
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[r, 48, 32]} />
          <meshStandardMaterial color={C.colors.sclera} roughness={0.35} metalness={0.85} />
        </mesh>
        {/* íris: anéis contínuos concêntricos sobre a curvatura */}
        <group position={[0, 0, 0]}>
          <IrisCap radius={r * 1.002} theta={0.72} color={C.colors.irisOuter} emissive={C.colors.irisOuter} emissiveIntensity={1.4} metalness={0.4} roughness={0.2} />
          <IrisCap radius={r * 1.006} theta={0.63} color={C.colors.irisDeep} emissive={C.colors.glow} emissiveIntensity={0.15} />
          <IrisCap radius={r * 1.01} theta={0.54} color={C.colors.irisMid} emissive={C.colors.irisMid} emissiveIntensity={1.1} />
          <IrisCap radius={r * 1.014} theta={0.45} color={C.colors.irisDeep} emissive={C.colors.glow} emissiveIntensity={0.2} />
          <IrisCap radius={r * 1.018} theta={0.34} color={C.colors.irisInner} emissive={C.colors.irisInner} emissiveIntensity={1.6} />
          <IrisCap radius={r * 1.022} theta={0.26} color={C.colors.irisDeep} emissive={C.colors.glow} emissiveIntensity={0.3} />
          {/* pupila */}
          <IrisCap radius={r * 1.026} theta={0.17} color={C.colors.pupil} roughness={0.1} metalness={0.2} />
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
      <Lid flip={false} radius={r * 1.06} lidRef={upper} />
      <Lid flip radius={r * 1.06} lidRef={lower} />
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
