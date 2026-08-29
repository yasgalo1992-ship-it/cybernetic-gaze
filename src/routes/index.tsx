import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import RobotEyes from "../components/RobotEyes";
import { EYE_CONFIG } from "../config/eyes";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Olhos de Robô — Animação Neon em 3D" },
      {
        name: "description",
        content:
          "Dois olhos de robô futuristas em 3D com brilho azul neon, movimento realista do globo ocular e piscadas naturais em tela cheia.",
      },
      { property: "og:title", content: "Olhos de Robô — Animação Neon em 3D" },
      {
        property: "og:description",
        content:
          "Animação em tela cheia de dois olhos robóticos ciano com rotação 3D real e piscadas aleatórias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [cursorHidden, setCursorHidden] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      setCursorHidden(false);
      clearTimeout(timer);
      timer = setTimeout(() => setCursorHidden(true), EYE_CONFIG.hideCursorAfterMs);
    };
    arm();
    window.addEventListener("mousemove", arm);
    window.addEventListener("touchstart", arm);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", arm);
      window.removeEventListener("touchstart", arm);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <main
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ cursor: cursorHidden ? "none" : "default" }}
    >
      <h1 className="sr-only">Olhos de robô futuristas animados</h1>
      <RobotEyes />
    </main>
  );
}
