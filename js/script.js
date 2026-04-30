/* =========================
   SLIDER DO BANNER
========================= */
const slides = document.querySelectorAll(".slide");
let index = 0;

function trocarSlide(){
    if(slides.length === 0) return;

    slides[index].classList.remove("active");
    index++;

    if(index >= slides.length){
        index = 0;
    }

    slides[index].classList.add("active");
}

if(slides.length > 1){
    setInterval(trocarSlide, 6000);
}

/* =========================
   HEADER COM SOMBRA
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if(!header) return;

    if(window.scrollY > 20){
        header.classList.add("scroll");
    }else{
        header.classList.remove("scroll");
    }
});

/* =========================
   CONTROLE DE SCROLL DOS MODAIS
========================= */
function travarScroll(){
    document.documentElement.classList.add("modal-aberto");
    document.body.classList.add("modal-aberto");
}

function liberarScroll(){
    document.documentElement.classList.remove("modal-aberto");
    document.body.classList.remove("modal-aberto");
}

/* =========================
   PEDIDOS DE ORAÇÃO
========================= */
const formOracao = document.getElementById("form-oracao");
const nomeOracao = document.getElementById("nome-oracao");
const anonimoCheck = document.getElementById("anonimo");
const msgStatus = document.getElementById("msg-status");

if(anonimoCheck && nomeOracao){
    anonimoCheck.addEventListener("change", () => {
        if(anonimoCheck.checked){
            nomeOracao.value = "Anônimo";
            nomeOracao.readOnly = true;
        }else{
            nomeOracao.value = "";
            nomeOracao.readOnly = false;
        }
    });
}

if(formOracao){
    formOracao.addEventListener("submit", function(e){
        e.preventDefault();

        const data = new FormData(formOracao);

        fetch("https://formspree.io/f/xwvayyqq", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if(response.ok){
                msgStatus.innerText = "Pedido enviado com sucesso 🙏";
                msgStatus.style.color = "green";

                formOracao.reset();
                nomeOracao.readOnly = false;
            }else{
                msgStatus.innerText = "Erro ao enviar. Tente novamente.";
                msgStatus.style.color = "red";
            }
        })
        .catch(() => {
            msgStatus.innerText = "Erro de conexão.";
            msgStatus.style.color = "red";
        });
    });
}

/* =========================
   EVENTOS
========================= */
const eventos = [
    {
        titulo: "Semana Jovem",
        descricao: "Programação especial com louvor, mensagens e comunhão.",
        data: "2026-07-20",
        horario: "19:30",
        imagem: "view/img/img3.jpeg",
        tipo: "Jovens"
    },
    {
        titulo: "Ação Solidária",
        descricao: "Projeto social voltado para ajudar a comunidade local.",
        data: "2026-08-05",
        horario: "09:00",
        imagem: "view/img/img2.png",
        tipo: "Ação Social"
    },
    {
        titulo: "Culto Especial de Gratidão",
        descricao: "Momento especial de louvor, oração e agradecimento.",
        data: "2026-08-18",
        horario: "20:00",
        imagem: "view/img/img1.png",
        tipo: "Culto"
    }
];

const listaHome = document.getElementById("lista-eventos-home");
const agendaCompleta = document.getElementById("agenda-completa");
const modalAgenda = document.getElementById("modal-agenda");
const abrirAgenda = document.getElementById("abrir-agenda");
const fecharAgenda = document.getElementById("fechar-agenda");
const filtros = document.querySelectorAll(".filtro");

let filtroAtual = "Todos";

function formatarData(dataTexto){
    const data = new Date(dataTexto + "T00:00:00");

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = data
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "")
        .toUpperCase();

    return { dia, mes };
}

function pegarEventosFuturos(){
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return eventos
        .filter(evento => new Date(evento.data + "T00:00:00") >= hoje)
        .sort((a, b) => new Date(a.data) - new Date(b.data));
}

function carregarEventosHome(){
    if(!listaHome) return;

    const eventosFuturos = pegarEventosFuturos();
    listaHome.innerHTML = "";

    eventosFuturos.slice(0, 3).forEach((evento, index) => {
        const dataFormatada = formatarData(evento.data);

        listaHome.innerHTML += `
            <div class="evento">
                <div class="evento-img">
                    <img src="${evento.imagem}" alt="${evento.titulo}">
                    <span class="evento-data">${dataFormatada.dia} ${dataFormatada.mes}</span>
                </div>

                <div class="evento-texto">
                    ${index === 0 ? '<span class="tag-proximo">Próximo evento</span>' : ''}
                    <h3>${evento.titulo}</h3>
                    <p>${evento.descricao}</p>
                    <div class="evento-horario">${evento.horario}</div>
                </div>
            </div>
        `;
    });
}

function carregarAgenda(){
    if(!agendaCompleta) return;

    let eventosFiltrados = pegarEventosFuturos();

    if(filtroAtual !== "Todos"){
        eventosFiltrados = eventosFiltrados.filter(evento => evento.tipo === filtroAtual);
    }

    agendaCompleta.innerHTML = "";

    if(eventosFiltrados.length === 0){
        agendaCompleta.innerHTML = `
            <div class="sem-eventos">
                <div class="icone-calendario">
                    <i class="fa-regular fa-calendar-xmark"></i>
                </div>

                <h3>Nenhum evento encontrado</h3>
                <p>No momento não há eventos para essa categoria.</p>

                <button class="btn-ver-todos" id="btn-ver-todos">
                    Ver todos os eventos
                </button>
            </div>
        `;

        const btnVerTodos = document.getElementById("btn-ver-todos");

        if(btnVerTodos){
            btnVerTodos.addEventListener("click", () => {
                filtroAtual = "Todos";

                filtros.forEach(btn => btn.classList.remove("ativo"));

                const filtroTodos = document.querySelector('.filtro[data-filtro="Todos"]');

                if(filtroTodos){
                    filtroTodos.classList.add("ativo");
                }

                carregarAgenda();
            });
        }

        return;
    }

    eventosFiltrados.forEach((evento, index) => {
        const dataFormatada = formatarData(evento.data);

        agendaCompleta.innerHTML += `
            <div class="agenda-item">
                <div class="agenda-data">
                    <span>${dataFormatada.dia}</span>
                    ${dataFormatada.mes}
                </div>

                <div class="agenda-info">
                    ${index === 0 ? '<span class="tag-proximo">Próximo evento</span>' : ''}
                    <h3>${evento.titulo}</h3>
                    <p>${evento.descricao}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Categoria:</strong> ${evento.tipo}</p>
                </div>
            </div>
        `;
    });
}

if(abrirAgenda && modalAgenda){
    abrirAgenda.addEventListener("click", () => {
        filtroAtual = "Todos";

        filtros.forEach(btn => btn.classList.remove("ativo"));

        const filtroTodos = document.querySelector('.filtro[data-filtro="Todos"]');

        if(filtroTodos){
            filtroTodos.classList.add("ativo");
        }

        modalAgenda.classList.add("ativo");
        travarScroll();
        carregarAgenda();
    });
}

if(fecharAgenda && modalAgenda){
    fecharAgenda.addEventListener("click", () => {
        modalAgenda.classList.remove("ativo");
        liberarScroll();
    });
}

if(modalAgenda){
    modalAgenda.addEventListener("click", (e) => {
        if(e.target === modalAgenda){
            modalAgenda.classList.remove("ativo");
            liberarScroll();
        }
    });
}

filtros.forEach(btn => {
    btn.addEventListener("click", () => {
        filtros.forEach(item => item.classList.remove("ativo"));

        btn.classList.add("ativo");
        filtroAtual = btn.dataset.filtro;

        carregarAgenda();
    });
});

carregarEventosHome();

/* =========================
   MODAL AO VIVO
========================= */
const abrirLive = document.getElementById("abrir-live");
const fecharLive = document.getElementById("fechar-live");
const modalLive = document.getElementById("modal-live");
const iframeLive = document.getElementById("live-frame");
const fallbackLive = document.getElementById("live-fallback");

function ativarFallbackLive(){
    if(iframeLive){
        iframeLive.style.display = "none";
    }

    if(fallbackLive){
        fallbackLive.style.display = "block";
    }
}

if(abrirLive && modalLive){
    abrirLive.addEventListener("click", (e) => {
        e.preventDefault();

        modalLive.classList.add("ativo");
        travarScroll();

        setTimeout(() => {
            try{
                if(!iframeLive || !iframeLive.contentWindow || iframeLive.contentWindow.length === 0){
                    ativarFallbackLive();
                }
            }catch(e){
                ativarFallbackLive();
            }
        }, 3000);
    });
}

if(fecharLive && modalLive){
    fecharLive.addEventListener("click", () => {
        modalLive.classList.remove("ativo");
        liberarScroll();
    });
}

if(modalLive){
    modalLive.addEventListener("click", (e) => {
        if(e.target === modalLive){
            modalLive.classList.remove("ativo");
            liberarScroll();
        }
    });
}

/* =========================
   AULAS BÍBLICAS
========================= */
const aulas = [
    { titulo: "Aula 01", descricao: "Introdução à fé", categoria: "Fé", video: "dQw4w9WgXcQ" },
    { titulo: "Aula 02", descricao: "Vida com Deus", categoria: "Fé", video: "ysz5S6PUM-U" },
    { titulo: "Aula 03", descricao: "Oração diária", categoria: "Oração", video: "ScMzIvxBSi4" },
    { titulo: "Aula 04", descricao: "Família cristã", categoria: "Família", video: "hY7m5jjJ9mM" },
    { titulo: "Aula 05", descricao: "Esperança", categoria: "Fé", video: "e-ORhEE9VVg" },
    { titulo: "Aula 06", descricao: "Comunhão", categoria: "Oração", video: "kJQP7kiw5Fk" },
    { titulo: "Aula 07", descricao: "Profecias bíblicas", categoria: "Profecias", video: "fLexgOxsZu0" },
    { titulo: "Aula 08", descricao: "Salvação", categoria: "Fé", video: "2Vv-BfVoq4g" },
    { titulo: "Aula 09", descricao: "Amor de Deus", categoria: "Fé", video: "OPf0YbXqDm0" },
    { titulo: "Aula 10", descricao: "Vida espiritual", categoria: "Oração", video: "CevxZvSJLk8" },

    { titulo: "Aula 11", descricao: "Família e fé", categoria: "Família", video: "RgKAFK5djSk" },
    { titulo: "Aula 12", descricao: "Propósito de vida", categoria: "Fé", video: "JGwWNGJdvx8" },
    { titulo: "Aula 13", descricao: "Profecias finais", categoria: "Profecias", video: "09R8_2nJtjg" },
    { titulo: "Aula 14", descricao: "Esperança futura", categoria: "Fé", video: "YQHsXMglC9A" },
    { titulo: "Aula 15", descricao: "Confiança em Deus", categoria: "Fé", video: "pRpeEdMmmQ0" },
    { titulo: "Aula 16", descricao: "Oração e fé", categoria: "Oração", video: "kffacxfA7G4" },
    { titulo: "Aula 17", descricao: "Vida com Cristo", categoria: "Fé", video: "3JZ_D3ELwOQ" },
    { titulo: "Aula 18", descricao: "Família e valores", categoria: "Família", video: "uelHwf8o7_U" },
    { titulo: "Aula 19", descricao: "Salvação eterna", categoria: "Fé", video: "60ItHLz5WEA" },
    { titulo: "Aula 20", descricao: "Caminho da fé", categoria: "Fé", video: "nfWlot6h_JM" },

    { titulo: "Aula 21", descricao: "Deus é amor", categoria: "Fé", video: "34Na4j8AVgA" },
    { titulo: "Aula 22", descricao: "Confiança total", categoria: "Fé", video: "ktvTqknDobU" },
    { titulo: "Aula 23", descricao: "Família abençoada", categoria: "Família", video: "lp-EO5I60KA" },
    { titulo: "Aula 24", descricao: "Vida com propósito", categoria: "Fé", video: "SlPhMPnQ58k" },
    { titulo: "Aula 25", descricao: "Profecias atuais", categoria: "Profecias", video: "hLQl3WQQoQ0" },
    { titulo: "Aula 26", descricao: "Esperança viva", categoria: "Fé", video: "y6120QOlsfU" },
    { titulo: "Aula 27", descricao: "Comunhão com Deus", categoria: "Oração", video: "ktvTqknDobU" },
    { titulo: "Aula 28", descricao: "Vida espiritual", categoria: "Oração", video: "JGwWNGJdvx8" },
    { titulo: "Aula 29", descricao: "Família forte", categoria: "Família", video: "CevxZvSJLk8" },
    { titulo: "Aula 30", descricao: "Fé inabalável", categoria: "Fé", video: "2Vv-BfVoq4g" }
];

const abrirAulas = document.getElementById("abrir-aulas");
const fecharAulas = document.getElementById("fechar-aulas");
const modalAulas = document.getElementById("modal-aulas");

const aulasGrid = document.getElementById("aulas-grid");
const buscarAula = document.getElementById("buscar-aula");
const filtrosAula = document.querySelectorAll(".filtro-aula");
const filtroCategoriaSelect = document.getElementById("filtro-categoria");

const modalPlayer = document.getElementById("modal-player");
const fecharPlayer = document.getElementById("fechar-player");
const playerVideo = document.getElementById("player-video");
const tituloVideo = document.getElementById("titulo-video");

let categoriaAulaAtual = "Todos";
let paginaAtual = 1;
const aulasPorPagina = 6;

function pegarAulasFiltradas(){
    const busca = buscarAula ? buscarAula.value.toLowerCase().trim() : "";

    return aulas.filter(aula => {
        const textoBusca = `${aula.titulo} ${aula.descricao} ${aula.categoria}`.toLowerCase();

        return textoBusca.includes(busca) &&
        (categoriaAulaAtual === "Todos" || aula.categoria === categoriaAulaAtual);
    });
}

function criarCardAula(aula){
    return `
        <div class="aula-card" data-video="${aula.video}" data-titulo="${aula.titulo}">
            <div class="aula-thumb">
                <img src="https://img.youtube.com/vi/${aula.video}/hqdefault.jpg" alt="${aula.titulo}" loading="lazy">
                <div class="play-icon"><i class="fa-solid fa-play"></i></div>
            </div>

            <div class="aula-info">
                <span>${aula.categoria}</span>
                <h3>${aula.titulo}</h3>
                <p>${aula.descricao}</p>
            </div>
        </div>
    `;
}

function ativarCliqueDasAulas(){
    document.querySelectorAll(".aula-card").forEach(card => {
        card.onclick = () => {
            if(!modalPlayer || !playerVideo || !tituloVideo) return;

            tituloVideo.innerText = card.dataset.titulo;
            playerVideo.src = `https://www.youtube.com/embed/${card.dataset.video}`;
            modalPlayer.classList.add("ativo");
            travarScroll();
        };
    });
}

function carregarAulas(reset = true){
    if(!aulasGrid) return;

    if(reset){
        paginaAtual = 1;
        aulasGrid.innerHTML = "";
    }

    const aulasFiltradas = pegarAulasFiltradas();

    if(aulasFiltradas.length === 0){
        aulasGrid.innerHTML = `
            <div class="sem-eventos">
                <div class="icone-calendario">
                    <i class="fa-solid fa-video-slash"></i>
                </div>

                <h3>Nenhuma aula encontrada</h3>
                <p>Tente pesquisar outro nome ou mudar a categoria.</p>
            </div>
        `;
        return;
    }

    const inicio = (paginaAtual - 1) * aulasPorPagina;
    const fim = inicio + aulasPorPagina;
    const aulasPagina = aulasFiltradas.slice(inicio, fim);

    aulasPagina.forEach(aula => {
        aulasGrid.innerHTML += criarCardAula(aula);
    });

    const botaoAntigo = document.getElementById("ver-mais-aulas");

    if(botaoAntigo){
        botaoAntigo.remove();
    }

    if(fim < aulasFiltradas.length){
        aulasGrid.innerHTML += `
            <button id="ver-mais-aulas" class="btn-ver-mais">
                Ver mais aulas
            </button>
        `;

        const btnVerMais = document.getElementById("ver-mais-aulas");

        if(btnVerMais){
            btnVerMais.addEventListener("click", () => {
                paginaAtual++;
                btnVerMais.remove();
                carregarAulas(false);
            });
        }
    }

    ativarCliqueDasAulas();
}

if(abrirAulas && modalAulas){
    abrirAulas.addEventListener("click", (e) => {
        e.preventDefault();

        modalAulas.classList.add("ativo");
        travarScroll();
        carregarAulas(true);
    });
}

if(fecharAulas && modalAulas){
    fecharAulas.addEventListener("click", () => {
        modalAulas.classList.remove("ativo");
        liberarScroll();
    });
}

if(modalAulas){
    modalAulas.addEventListener("click", (e) => {
        if(e.target === modalAulas){
            modalAulas.classList.remove("ativo");
            liberarScroll();
        }
    });
}

if(buscarAula){
    buscarAula.addEventListener("input", () => carregarAulas(true));
}

/* Funciona com filtro em botões */
if(filtrosAula.length > 0){
    filtrosAula.forEach(btn => {
        btn.addEventListener("click", () => {
            filtrosAula.forEach(item => item.classList.remove("ativo"));
            btn.classList.add("ativo");

            categoriaAulaAtual = btn.dataset.categoria || "Todos";
            carregarAulas(true);
        });
    });
}

/* Funciona também se você voltar a usar select */
if(filtroCategoriaSelect && filtroCategoriaSelect.tagName === "SELECT"){
    filtroCategoriaSelect.addEventListener("change", () => {
        categoriaAulaAtual = filtroCategoriaSelect.value;
        carregarAulas(true);
    });
}

if(fecharPlayer && modalPlayer){
    fecharPlayer.addEventListener("click", () => {
        modalPlayer.classList.remove("ativo");

        if(playerVideo){
            playerVideo.src = "";
        }

        if(!modalAulas || !modalAulas.classList.contains("ativo")){
            liberarScroll();
        }
    });
}

if(modalPlayer){
    modalPlayer.addEventListener("click", (e) => {
        if(e.target === modalPlayer){
            modalPlayer.classList.remove("ativo");

            if(playerVideo){
                playerVideo.src = "";
            }

            if(!modalAulas || !modalAulas.classList.contains("ativo")){
                liberarScroll();
            }
        }
    });
}

/* =========================
   FECHAR MODAIS COM ESC
========================= */
document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        if(modalAgenda){
            modalAgenda.classList.remove("ativo");
        }

        if(modalLive){
            modalLive.classList.remove("ativo");
        }

        if(modalAulas){
            modalAulas.classList.remove("ativo");
        }

        if(modalPlayer){
            modalPlayer.classList.remove("ativo");
        }

        if(playerVideo){
            playerVideo.src = "";
        }

        liberarScroll();
    }
});

/* =========================
   SCROLL REVEAL PREMIUM
========================= */
function animarScroll(){
    const elementos = document.querySelectorAll(".animar");

    elementos.forEach((el, index) => {
        const topo = el.getBoundingClientRect().top;
        const alturaTela = window.innerHeight;

        if(topo < alturaTela - 80){
            el.style.transitionDelay = `${Math.min(index * 0.04, 0.28)}s`;
            el.classList.add("ativo");
        }
    });
}

window.addEventListener("scroll", animarScroll);
window.addEventListener("load", animarScroll);

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if(menuToggle && menu){
    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("ativo");

        const icone = menuToggle.querySelector("i");

        if(menu.classList.contains("ativo")){
            icone.classList.remove("fa-bars");
            icone.classList.add("fa-xmark");
        }else{
            icone.classList.remove("fa-xmark");
            icone.classList.add("fa-bars");
        }
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("ativo");

            const icone = menuToggle.querySelector("i");
            icone.classList.remove("fa-xmark");
            icone.classList.add("fa-bars");
        });
    });
}