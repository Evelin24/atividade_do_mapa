// Inicializa o mapa
const map = L.map('map').setView([-14.2794, -39.0007], 6.5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Cria o conteúdo HTML do popup com slider sem botões
function createPopup(id, title, images, description) {
  const imgsHtml = images.map((src, i) =>
    `<img src="${src}" id="img-${id}-${i}" alt="${title}" class="${i === 0 ? 'active' : ''}" style="width: 100%; margin-bottom: 10px; border-radius: 8px;">`
  ).join('');

  return `
    <div class="popup-content">
        <strong>${title}</strong>
        <div class="image-slider" id="slider-${id}" style="overflow-x: auto; overflow-y: hidden; white-space: nowrap;">
        ${imgsHtml}
        </div>
        <div class="description">${description}</div>
    </div>
    `;
}

// Dados dos locais
const locations = [
  {
    id: 'itacare',
    coords: [-14.2794, -38.9957],
    title: "Rua Pedro Longo - Itacaré",
    images: ['imagens/imagemitacare1.jpg', 'imagens/imagemitacare2.jpg', 'imagens/imagemitacare3.jpg'],
    desc: 'A Rua Pedro Longo, mais conhecida como Rua da Pituba, é um dos pontos mais vibrantes de Itacaré. Durante o dia, é ideal para passeios tranquilos, com lojas de artesanato, cafeterias e restaurantes aconchegantes. À noite, se transforma em um espaço animado, com música ao vivo, turistas e moradores curtindo a vibe local. O clima é acolhedor e cheio de vida, com muitas cores, natureza e uma energia que representa bem o espírito de Itacaré. É parada obrigatória para quem quer sentir o ritmo da cidade e aproveitar o melhor da cultura baiana.'
  },
  {
    id: 'itabuna',
    coords: [-14.7876, -39.2781],
    title: "Av. Cinquentenário - Itabuna",
    images: ['imagens/itabuna1.jpg', 'imagens/itabuna2.jpg', 'imagens/itabuna3.jpg'],
    desc: 'A Lavagem do Beco, festa tradicional em Itabuna realizada no Beco do Fuxico, na Avenida Cinquentenário, combina celebração cultural e religiosa, com influências do candomblé e samba. A festa inclui a lavagem simbólica das ruas com água de cheiro, acompanhada de tambores e cânticos afro-brasileiros, além de apresentações artísticas, rodas de samba e feiras de artesanato. Com o tempo, tornou-se um símbolo de revitalização urbana e resistência cultural, valorizando a memória e a identidade da comunidade local.'
  },
  {
    id: 'sp',
    coords: [-23.5343, -46.6337],
    title: "Pinacoteca de São Paulo",
    images: ['imagens/pinacoteca1.jpg', 'imagens/pinacoteca2.jpg', 'imagens/pinacoteca3.jpg', 'imagens/pinacoteca4.jpg'],
    desc: 'A Pinacoteca do Estado de São Paulo, fundada em 1905, é um dos museus de arte mais importantes do Brasil, localizada no centro da cidade. Seu acervo reúne mais de 10 mil obras, desde o período colonial até a arte contemporânea, com destaque para artistas brasileiros como Tarsila do Amaral e Anita Malfatti. Além das exposições permanentes, oferece mostras temporárias, cursos e atividades educativas. O museu, que combina arquitetura clássica e moderna, também possui um jardim de esculturas, sendo um importante centro cultural que valoriza a arte brasileira.'
  }
];

// Adiciona marcadores e popups ao mapa e armazena os marcadores no objeto
locations.forEach(loc => {
  const marker = L.marker(loc.coords).addTo(map)
    .bindPopup(createPopup(loc.id, loc.title, loc.images, loc.desc))
    .on('popupopen', () => enableSlider(loc.id, loc.images.length));

  loc.marker = marker; // ← armazena o marcador para uso nos botões
});

// Mostra a imagem no índice indicado, ativando e desativando classes
function showImage(id, index, total) {
  const imgs = [...document.querySelectorAll(`#slider-${id} img`)];
  imgs.forEach((img, i) => img.classList.toggle('active', i === index));
}

// Avança para a próxima imagem
window.nextImage = function(id, total) {
  const imgs = [...document.querySelectorAll(`#slider-${id} img`)];
  const current = imgs.findIndex(img => img.classList.contains('active'));
  const next = (current + 1) % total;
  showImage(id, next, total);
};

// Volta para a imagem anterior
window.prevImage = function(id, total) {
  const imgs = [...document.querySelectorAll(`#slider-${id} img`)];
  const current = imgs.findIndex(img => img.classList.contains('active'));
  const prev = (current - 1 + total) % total;
  showImage(id, prev, total);
};

// Habilita swipe e clique para modal dentro do popup
locations.forEach(loc => {
  L.marker(loc.coords).addTo(map)
    .bindPopup(createPopup(loc.id, loc.title, loc.images, loc.desc))
    .on('popupopen', () => {
      const slider = document.getElementById(`slider-${loc.id}`);
      if (!slider) return;

      slider.querySelectorAll('img').forEach(img => {
        img.onclick = () => {
          const modal = document.getElementById('modal');
          modal.querySelector('img').src = img.src;
          modal.style.display = 'flex';
        };
      });
    });
});

// Fechar modal ao clicar fora da imagem
const modal = document.getElementById('modal');
modal.onclick = e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modal.querySelector('img').src = '';
  }
};

// ✅ Função que leva o mapa até o local e abre o popup
function irParaLocal(id) {
  const local = locations.find(loc => loc.id === id);
  if (local) {
    map.setView(local.coords, 15); // centraliza e ajusta o zoom
    local.marker.openPopup(); // abre o popup do local
  }
}
