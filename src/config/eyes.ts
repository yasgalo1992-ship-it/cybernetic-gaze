/**
 * ------------------------------------------------------------------
 * PAINEL DE CONTROLE DOS OLHOS
 * ------------------------------------------------------------------
 * Este é o ÚNICO arquivo que você precisa editar para mudar
 * aparência, tamanho, cor, velocidade de movimento e piscadas.
 * ------------------------------------------------------------------
 */
export const EYE_CONFIG = {
  /** TAMANHO / POSIÇÃO */
  eyeRadius: 1, // raio do globo ocular
  eyeSeparation: 1.35, // distância do centro da tela até cada olho
  cameraDistance: 6.2, // menor = olhos maiores na tela
  cameraFov: 32,

  /** CORES (hexadecimal) */
  colors: {
    background: "#000000",
    sclera: "#0a1420", // corpo metálico do globo
    irisOuter: "#00e5ff", // anel externo neon
    irisMid: "#0b8fd6", // anel intermediário
    irisInner: "#00b3ff", // anel interno
    irisDeep: "#062033", // fundo profundo da íris
    pupil: "#000308", // pupila central escura
    glow: "#00d5ff", // brilho / halo
    glass: "#39e6ff", // cúpula de vidro
  },

  /** MOVIMENTO DO OLHAR */
  motion: {
    maxYaw: 0.62, // rotação máxima horizontal (radianos)
    maxPitch: 0.42, // rotação máxima vertical (radianos)
    smoothing: 3.2, // quanto maior, mais rápido chega ao alvo
    minHold: 0.7, // pausa mínima entre movimentos (segundos)
    maxHold: 2.8, // pausa máxima entre movimentos (segundos)
    centerChance: 0.28, // chance de voltar ao centro
    microMovement: 0.02, // micro tremor natural
  },

  /** PISCADAS */
  blink: {
    minInterval: 2.6, // intervalo mínimo entre piscadas (s)
    maxInterval: 7.5, // intervalo máximo entre piscadas (s)
    duration: 0.17, // duração de cada piscada (s)
    doubleBlinkChance: 0.18,
  },

  /** DESEMPENHO */
  maxPixelRatio: 1.5, // limite de resolução (menos GPU)

  /** CURSOR */
  hideCursorAfterMs: 2500,
};

export type EyeConfig = typeof EYE_CONFIG;
