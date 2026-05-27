/**
 * ============================================================
 * BAILEY APLICATIVOS — Configuração Dinâmica do Ecossistema
 * ============================================================
 */

// 1. DATA ESTRUTURADA DOS RAMOS (Ângulos e distâncias configurados para 5 ramos harmônicos)
const branches = [
  {
    id: 'delivery',
    categoryName: "App Deliverys",
    angle: 190,      // Lado esquerdo (meio-baixo)
    distance: 290,
    apps: [
      { name: 'iFood', icon: 'images/icons/ifood.png', isImage: true, bg: '#EA1D2C', color: '#FFF' },
      { name: '99Food', icon: 'images/icons/99food.png', isImage: true, bg: '#FFC400', color: '#000' },
      { name: 'Keeta', icon: 'images/icons/keeta.png', isImage: true, bg: '#FF7A00', color: '#FFF' }
    ]
  },
  {
    id: 'automacoes',
    categoryName: "Automações",
    angle: 240,      // Lado esquerdo inferior (curva acentuada para baixo)
    distance: 270,
    apps: [
      { name: 'Python', icon: 'images/icons/python.png', isImage: true, bg: '#3776AB', color: '#FFF' },
      { name: 'Oracle VM', icon: 'images/icons/oracle-vm.png', isImage: true, bg: '#00758F', color: '#FFF' }
    ]
  },
  {
  id: 'inteligencia',
  categoryName: "Inteligência Artificial",
  angle: 140,
  distance: 270,
  apps: [
    { name: 'ChatGPT', icon: 'images/icons/chatgpt.png', isImage: true, bg: '#10A37F', color: '#FFF' },
    { name: 'Gemini', icon: 'images/icons/gemini.png', isImage: true, bg: '#00758F', color: '#FFF' }
  ]
},
  {
    id: 'comunicacao',
    categoryName: "Comunicação",
    angle: 30,       // Lado direito superior
    distance: 290,
    apps: [
      { name: 'WhatsApp', icon: 'fab fa-whatsapp', bg: '#25D366', color: '#FFF' },
      { name: 'Meta', icon: 'fab fa-meta', bg: '#0064E0', color: '#FFF' }
    ]
  },
  {
    id: 'sistemas',
    categoryName: "Sistemas Internos",
    angle: 330,      // Lado direito inferior
    distance: 280,
    apps: [
      { name: 'Bailey PDV', icon: 'fas fa-desktop', bg: '#7c3aed', color: '#FFF' },
      { name: 'Cardápio Dig.', icon: 'fas fa-utensils', bg: '#4ade80', color: '#000' }
    ]
  }
];

const container = document.getElementById('branches-container');
const svgElement = document.getElementById('network-svg');
const CYCLE_TIME = 4000; // Tempo de troca dos apps (4 segundos)

// 2. CONSTRUTOR DO ECOSSISTEMA DE REDE
function buildEcosystem() {
  if (!container || !svgElement) return;
  
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  branches.forEach((branch) => {
    const rad = (branch.angle * Math.PI) / 180;
    
    // Coordenadas da categoria fixa
    const catX = centerX + Math.cos(rad) * branch.distance;
    const catY = centerY + Math.sin(rad) * branch.distance;

    // Lado da tela (True se for direito, False se for esquerdo)
    const isRightSide = Math.cos(rad) > 0;
    
    // Coordenadas do aplicativo alternante
    const appOffsetX = isRightSide ? 145 : -145; 
    const appX = catX + appOffsetX;
    const appY = catY;

    // --- CRIAÇÃO DAS CURVAS SUAVES S-CURVE (Cubic Bezier) ---
    const controlX1 = centerX + (catX - centerX) / 2;
    const controlY1 = centerY;
    const controlX2 = centerX + (catX - centerX) / 2;
    const controlY2 = catY;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${centerX} ${centerY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${catX} ${catY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(74, 222, 128, 0.18)');
    path.setAttribute('stroke-width', '1.5');
    svgElement.appendChild(path);

    // Conector horizontal direto entre a Categoria e o App
    const shortLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    shortLine.setAttribute('x1', catX);
    shortLine.setAttribute('y1', catY);
    shortLine.setAttribute('x2', appX);
    shortLine.setAttribute('y2', appY);
    shortLine.setAttribute('stroke', 'rgba(74, 222, 128, 0.35)');
    shortLine.setAttribute('stroke-width', '1.2');
    svgElement.appendChild(shortLine);

    // Nó de junção brilhante
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', catX);
    dot.setAttribute('cy', catY);
    dot.setAttribute('r', '3');
    dot.setAttribute('fill', '#4ade80');
    dot.setAttribute('style', 'filter: drop-shadow(0 0 4px #4ade80)');
    svgElement.appendChild(dot);

    // --- ELEMENTOS HTML ---
    
    // Criando a Pílula de Categoria
    const catNode = document.createElement('div');
    catNode.className = 'branch-node category-pill';
    catNode.style.left = `${catX + (isRightSide ? -48 : 48)}px`;
    catNode.style.top = `${catY}px`;
    
    if (isRightSide) {
      catNode.innerHTML = `<span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80]"></span> ${branch.categoryName}`;
    } else {
      catNode.innerHTML = `${branch.categoryName} <span class="w-1.5 h-1.5 bg-bailey-green rounded-full shadow-[0_0_5px_#4ade80]"></span>`;
    }
    container.appendChild(catNode);

    // Criando a Pílula do App Alternante
    const appNode = document.createElement('div');
    appNode.className = `branch-node app-pill app-pill-${branch.id}`;
    appNode.style.left = `${appX}px`;
    appNode.style.top = `${appY}px`;
    container.appendChild(appNode);

    // Ativar ciclo de troca dos apps
    startAppCycle(appNode, branch.apps);

    // Animação orgânica de flutuação independente
    gsap.to([catNode, appNode], {
      y: '+=6',
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

// 3. CONTROLADOR DE ALTERNÂNCIA (FADE OUT -> TROCA -> FADE IN)
function startAppCycle(nodeElement, appsArray) {
  let currentIndex = 0;

  function renderApp() {
    const app = appsArray[currentIndex];
    
    gsap.to(nodeElement, { opacity: 0, duration: 0.35, onComplete: () => {
      nodeElement.style.backgroundColor = app.bg;
      nodeElement.style.color = app.color;
      nodeElement.style.boxShadow = `0 0 22px ${app.bg}50`;
      
      // Lógica que alterna entre ícone FontAwesome ou Imagem
      const content = app.isImage 
        ? `<div class="app-icon-box"><img src="${app.icon}" class="w-5 h-5 object-contain"></div>`
        : `<div class="app-icon-box" style="color: ${app.color};"><i class="${app.icon}"></i></div>`;
      
      nodeElement.innerHTML = `${content} ${app.name}`;

      gsap.to(nodeElement, { opacity: 1, duration: 0.35 });
      currentIndex = (currentIndex + 1) % appsArray.length;
    }});
  }

  renderApp();
  if (appsArray.length > 1) {
    setInterval(renderApp, CYCLE_TIME);
  }
}

// 4. LISTENERS DE INICIALIZAÇÃO E RESPONSIVIDADE
window.addEventListener('load', buildEcosystem);

window.addEventListener('resize', () => {
  svgElement.innerHTML = '';
  container.innerHTML = '';
  buildEcosystem();
});
