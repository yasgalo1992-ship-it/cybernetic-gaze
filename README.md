# Cybernetic Gaze

Crie uma página web em tela cheia com dois olhos de robô futuristas, feita de forma totalmente exportável e independente da Lovable.

IMPORTANTE SOBRE HOSPEDAGEM:

- O projeto precisa funcionar fora da Lovable.

- Não usar recursos proprietários da Lovable.

- Não depender de backend da Lovable.

- Não depender de autenticação, banco de dados ou APIs externas desnecessárias.

- Quero poder baixar/exportar todos os arquivos do projeto e hospedar depois em qualquer lugar, como GitHub Pages, Netlify, Vercel ou hospedagem comum.

- Preferencialmente criar como site estático.

- Se usar React/Vite, deixar o projeto pronto para executar com npm install e npm run build.

- O resultado final também deve gerar uma pasta de build estática que possa ser hospedada normalmente.

- Não exigir servidor especial para funcionar.

- Toda a animação deve funcionar localmente no navegador.

VISUAL:

- Fundo 100% preto, ocupando toda a tela.

- Não colocar rosto, cabeça, moldura, textos, botões ou menus.

- Mostrar apenas dois olhos grandes de robô no centro da tela.

- Visual tecnológico, futurista e elegante.

- Cor predominante azul/ciano neon.

- Pupila central escura.

- Anéis luminosos contínuos ao redor da pupila.

- Não usar vários pontinhos pequenos ou LEDs formando a íris.

- Quero um design limpo, com superfícies contínuas, brilho azul, profundidade e aparência de vidro/metal tecnológico.

- Os olhos devem parecer parte de um robô real.

MOVIMENTO:

Essa é a parte mais importante.

Não quero apenas uma pupila deslizando dentro de um círculo parado.

Quero que pareça que o OLHO INTEIRO está virando para olhar em diferentes direções, semelhante ao movimento de um globo ocular humano.

Os dois olhos devem olhar juntos para:

- esquerda

- direita

- cima

- baixo

- diagonais

- centro

Quando olharem para os lados, usar profundidade, perspectiva, deformação, sombras e reflexos para dar sensação real de rotação.

A parte frontal do olho deve acompanhar a curvatura do globo.

Não usar apenas rotate() em um círculo plano.

Se necessário, use Three.js/WebGL e modele cada olho como uma esfera 3D simples, pois prefiro um efeito de rotação convincente.

Os olhos devem:

- se mover suavemente

- fazer pequenas pausas

- mudar de direção em tempos aleatórios

- não seguir uma sequência obviamente repetitiva

- voltar ao centro ocasionalmente

PISCAR:

- Os dois olhos devem piscar juntos de vez em quando.

- A piscada deve ser rápida, suave e natural.

- Os intervalos devem ser aleatórios.

- A pálpebra pode ter aparência robótica, mas sem adicionar rosto ou moldura externa.

COMPORTAMENTO:

- Loop infinito.

- Precisa poder ficar aberto durante muitas horas.

- Sem travamentos.

- Sem scroll.

- Tela totalmente responsiva.

- Deve funcionar bem em monitores 16:9 e outras resoluções.

- Deve funcionar perfeitamente em tela cheia com F11.

- O cursor deve desaparecer após alguns segundos sem movimento.

DESEMPENHO:

- Priorizar baixo consumo de CPU/GPU.

- A animação ficará ligada durante muitas horas.

- Evitar efeitos pesados desnecessários.

- Usar requestAnimationFrame corretamente se houver animação contínua.

- Não causar vazamento de memória.

ESTRUTURA DO PROJETO:

Organize o código de maneira simples e fácil de editar.

Deixe claro quais arquivos controlam:

- aparência dos olhos

- tamanho

- cor

- velocidade de movimento

- frequência das piscadas

No final, verifique se o projeto pode ser exportado e hospedado como um site normal, sem nenhuma dependência da Lovable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fcb9fa8f-05a2-4f43-9807-b26476b80ce6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
