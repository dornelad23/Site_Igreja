import {
    db,
    ref,
    push,
    set,
    get,
    remove,
    update
} from "./firebase.js";

const igrejaId = "iasd-belem";
const eventosRef = ref(db, `igrejas/${igrejaId}/eventos`);
const uploadArea = document.getElementById("upload-area");
const inputImagem = document.getElementById("imagem");
const previewImagem = document.getElementById("preview-imagem");
const uploadContent = document.getElementById("upload-content");

let imagemBase64 = "";

function carregarImagem(arquivo){
    if(!arquivo || !arquivo.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
        imagemBase64 = reader.result;

        previewImagem.src = imagemBase64;
        previewImagem.style.display = "block";
        uploadContent.style.display = "none";
    };

    reader.readAsDataURL(arquivo);
}

if(uploadArea){
    uploadArea.addEventListener("click", () => {
        inputImagem.click();
    });

    inputImagem.addEventListener("change", () => {
        carregarImagem(inputImagem.files[0]);
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("arrastando");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("arrastando");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("arrastando");

        carregarImagem(e.dataTransfer.files[0]);
    });
}

const logado = localStorage.getItem("adminLogado");

if(logado !== "true"){
    window.location.href = "index.html";
}

const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
    localStorage.removeItem("adminLogado");
    window.location.href = "index.html";
});

const formEvento = document.getElementById("form-evento");
const listaEventosAdmin = document.getElementById("lista-eventos-admin");

function limparFormulario(){
    document.getElementById("evento-id").value = "";
    formEvento.reset();

    imagemBase64 = "";
    previewImagem.src = "";
    previewImagem.style.display = "none";
    uploadContent.style.display = "block";
}

async function renderizarEventos(){
    listaEventosAdmin.innerHTML = "";

    const snapshot = await get(eventosRef);

    if(!snapshot.exists()){
        listaEventosAdmin.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
        return;
    }

    const dados = snapshot.val();

    Object.entries(dados).forEach(([id, evento]) => {
        listaEventosAdmin.innerHTML += `
            <div class="card-admin">
                <h3>${evento.titulo}</h3>
                <p>${evento.descricao}</p>
                <p><strong>Data:</strong> ${evento.data}</p>
                <p><strong>Horário:</strong> ${evento.horario}</p>
                <p><strong>Categoria:</strong> ${evento.tipo}</p>

                <div class="card-admin-acoes">
                    <button class="btn-editar" onclick="editarEvento('${id}')">Editar</button>
                    <button class="btn-excluir" onclick="excluirEvento('${id}')">Excluir</button>
                </div>
            </div>
        `;
    });
}

formEvento.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("evento-id").value;

    const evento = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        tipo: document.getElementById("tipo").value,
        imagem: imagemBase64
    };

    if(id === ""){
        const novoEventoRef = push(eventosRef);
        await set(novoEventoRef, evento);
    }else{
        await update(ref(db, `igrejas/${igrejaId}/eventos/${id}`), evento);
    }

    limparFormulario();
    renderizarEventos();
});

window.editarEvento = async function(id){
    const snapshot = await get(ref(db, `igrejas/${igrejaId}/eventos/${id}`));

    if(!snapshot.exists()) return;

    const evento = snapshot.val();

    document.getElementById("evento-id").value = id;
    document.getElementById("titulo").value = evento.titulo;
    document.getElementById("descricao").value = evento.descricao;
    document.getElementById("data").value = evento.data;
    document.getElementById("horario").value = evento.horario;
    document.getElementById("tipo").value = evento.tipo;

    imagemBase64 = evento.imagem || "";

    if(imagemBase64){
        previewImagem.src = imagemBase64;
        previewImagem.style.display = "block";
        uploadContent.style.display = "none";
    }
};

window.excluirEvento = async function(id){
    const confirmar = confirm("Deseja excluir este evento?");

    if(confirmar){
        await remove(ref(db, `igrejas/${igrejaId}/eventos/${id}`));
        renderizarEventos();
    }
};