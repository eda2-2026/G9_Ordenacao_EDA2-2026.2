// Fases
const fases = [
    { id: 1, elementos: [5, 2, 8, 1] },
    { id: 2, elementos: [9, 3, 6, 1, 4] },
    { id: 3, elementos: [7, 2, 5, 8, 3, 1] },
    { id: 4, elementos: [12, 4, 8, 1, 15, 6] },
    { id: 5, elementos: [20, 11, 5, 18, 2, 14, 7] }
];

let faseAtualIndex = 0;
let arrayAtual = [];
let arrayRobo = [];
let indiceSelecionado = null;
let contadorTrocasUsuario = 0;
let minimoIdeal = 0;
let emExecucaoRobo = false;
let faseConcluidaExibida = false;

const modalInstrucoes = document.getElementById('modal-instrucoes');
const btnIniciar = document.getElementById('btn-iniciar');
const esteiraDiv = document.getElementById('esteira');
const esteiraRoboDiv = document.getElementById('esteira-robo');
const faseTexto = document.getElementById('fase-texto');
const trocasTexto = document.getElementById('trocas-texto');
const idealTexto = document.getElementById('ideal-texto');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnRodarRobo = document.getElementById('btn-rodar-robo');
const logContainer = document.getElementById('log-container');
const modalVitoria = document.getElementById('modal-vitoria');
const estatisticasFim = document.getElementById('estatisticas-fim');
const btnProxima = document.getElementById('btn-proxima');
const btnProximaPrincipal = document.getElementById('btn-proxima-principal');
const containerProximaPrincipal = document.getElementById('container-proxima-principal');
const btnFecharModal = document.getElementById('btn-fechar-modal');

// BUBBLE SORT
function calcularMinimoIdeal(arr) {
    let copia = [...arr];
    let trocas = 0;
    let n = copia.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (copia[j] > copia[j + 1]) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
                trocas++;
            }
        }
    }
    return trocas;
}

// Inicializa
btnIniciar.addEventListener('click', () => {
    modalInstrucoes.classList.add('hidden');
    carregarFase(faseAtualIndex);
});

function carregarFase(index) {
    faseAtualIndex = index;
    arrayAtual = [...fases[index].elementos];
    arrayRobo = [...fases[index].elementos];
    contadorTrocasUsuario = 0;
    indiceSelecionado = null;
    emExecucaoRobo = false;
    faseConcluidaExibida = false;
    minimoIdeal = calcularMinimoIdeal(arrayAtual);

    faseTexto.innerText = `Fase: ${index + 1} / ${fases.length}`;
    trocasTexto.innerText = `Trocas: ${contadorTrocasUsuario}`;
    idealTexto.innerText = `Mínimo Ideal: ${minimoIdeal}`;
    
    containerProximaPrincipal.classList.add('hidden');

    limparLogInicial();
    adicionarLog(`Iniciada a Fase ${index + 1}. Lista embaralhada: [${arrayAtual.join(', ')}]`);
    renderizarEsteira();
    renderizarEsteiraRobo(arrayRobo, -1, -1, false);
}

function renderizarEsteira() {
    esteiraDiv.innerHTML = '';
    arrayAtual.forEach((valor, index) => {
        const caixa = document.createElement('div');
        caixa.classList.add('caixa');
        caixa.innerText = valor;

        if (indiceSelecionado === index) {
            caixa.classList.add('selecionada');
        }

        if (estaOrdenado(arrayAtual)) {
            caixa.classList.add('ordenada');
        }

        caixa.addEventListener('click', () => lidarComCliqueCaixa(index));
        esteiraDiv.appendChild(caixa);
    });

    // VITÓRIA
    if (estaOrdenado(arrayAtual) && !faseConcluidaExibida) {
        faseConcluidaExibida = true;
        adicionarLog(`🎉 [Usuário] Fase ${faseAtualIndex + 1} concluída com sucesso!`);
        
        containerProximaPrincipal.classList.remove('hidden');

        //erros
        let totalErros = Math.max(0, contadorTrocasUsuario - minimoIdeal);

        estatisticasFim.innerHTML = `
            <p><span>Total de Acertos (Trocas Certas):</span> <span style="color: var(--success-green);">${contadorTrocasUsuario}</span></p>
            <p><span>Total de Erros (Trocas Desnecessárias):</span> <span style="color: var(--error-red);">${totalErros}</span></p>
            <p><span>Mínimo Ideal do Algoritmo:</span> <span style="color: var(--dark-pink);">${minimoIdeal}</span></p>
        `;

        setTimeout(() => {
            modalVitoria.classList.remove('hidden');
        }, 300);
    }
}

function renderizarEsteiraRobo(arr, idx1, idx2, trocando) {
    esteiraRoboDiv.innerHTML = '';
    arr.forEach((valor, index) => {
        const caixa = document.createElement('div');
        caixa.classList.add('caixa');
        caixa.innerText = valor;

        if (estaOrdenado(arr)) {
            caixa.classList.add('ordenada');
        } else if (index === idx1 || index === idx2) {
            if (trocando) {
                caixa.classList.add('trocando');
            } else {
                caixa.classList.add('comparando');
            }
        }

        esteiraRoboDiv.appendChild(caixa);
    });
}

function lidarComCliqueCaixa(index) {
    if (estaOrdenado(arrayAtual)) return;

    if (indiceSelecionado === null) {
        indiceSelecionado = index;
        adicionarLog(`[Usuário] Selecionou a caixa ${arrayAtual[index]} (pos ${index + 1}).`);
        renderizarEsteira();
    } else {
        if (indiceSelecionado === index) {
            indiceSelecionado = null;
            adicionarLog(`[Usuário] Cancelou a seleção.`);
            renderizarEsteira();
            return;
        }

        
        if (Math.abs(indiceSelecionado - index) === 1) {
            let temp = arrayAtual[indiceSelecionado];
            arrayAtual[indiceSelecionado] = arrayAtual[index];
            arrayAtual[index] = temp;

            contadorTrocasUsuario++;
            trocasTexto.innerText = `Trocas: ${contadorTrocasUsuario}`;

            adicionarLog(`[Usuário] Trocou ${temp} com ${arrayAtual[indiceSelecionado]}.`);
            indiceSelecionado = null;
            renderizarEsteira();
        } else {
            adicionarLog(`⚠️ [Usuário] Movimento inválido! O Bubble Sort só permite trocar caixas vizinhas.`);
            alert("No Bubble Sort você só pode trocar caixas que estão lado a lado!");
            indiceSelecionado = null;
            renderizarEsteira();
        }
    }
}

function estaOrdenado(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}

// ANIMAÇÃO 
btnRodarRobo.addEventListener('click', async () => {
    if (emExecucaoRobo) return;
    emExecucaoRobo = true;
    btnRodarRobo.disabled = true;

    arrayRobo = [...fases[faseAtualIndex].elementos];
    renderizarEsteiraRobo(arrayRobo, -1, -1, false);
    adicionarLog(`🤖 [Robô] Iniciando execução automática do Bubble Sort...`);

    let n = arrayRobo.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            renderizarEsteiraRobo(arrayRobo, j, j + 1, false);
            adicionarLog(`🤖 [Robô] Compara ${arrayRobo[j]} e ${arrayRobo[j + 1]}`);
            await new Promise(r => setTimeout(r, 600));

            if (arrayRobo[j] > arrayRobo[j + 1]) {
                renderizarEsteiraRobo(arrayRobo, j, j + 1, true);
                let temp = arrayRobo[j];
                arrayRobo[j] = arrayRobo[j + 1];
                arrayRobo[j + 1] = temp;
                adicionarLog(`🤖 [Robô] Troca ${temp} por ${arrayRobo[j]}`);
                await new Promise(r => setTimeout(r, 600));
            }
        }
    }

    renderizarEsteiraRobo(arrayRobo, -1, -1, false);
    adicionarLog(`🤖 [Robô] Ordenação concluída com sucesso!`);
    emExecucaoRobo = false;
    btnRodarRobo.disabled = false;
});

btnFecharModal.addEventListener('click', () => {
    modalVitoria.classList.add('hidden');
});

function avancarFase() {
    modalVitoria.classList.add('hidden');
    faseAtualIndex++;
    if (faseAtualIndex < fases.length) {
        carregarFase(faseAtualIndex);
    } else {
        alert("🏆 Incrível! Você completou todas as fases do Desafio da Esteira!");
        faseAtualIndex = 0;
        carregarFase(faseAtualIndex);
    }
}

btnProxima.addEventListener('click', avancarFase);
btnProximaPrincipal.addEventListener('click', avancarFase);

btnReiniciar.addEventListener('click', () => {
    carregarFase(faseAtualIndex);
    adicionarLog(`Reiniciou a fase ${faseAtualIndex + 1}.`);
});

function adicionarLog(texto) {
    const placeholder = logContainer.querySelector('.log-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    const entrada = document.createElement('div');
    entrada.classList.add('log-entry');
    const hora = new Date().toLocaleTimeString();
    entrada.innerText = `[${hora}] ${texto}`;
    logContainer.prepend(entrada);
}

function limparLogInicial() {
    logContainer.innerHTML = '<p class="log-placeholder">As ações do jogo aparecerão aqui...</p>';
}