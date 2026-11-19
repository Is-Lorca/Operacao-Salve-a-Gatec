import { jogadorApi } from "./api/jogadoresApi.js";
import { inventarioApi } from "./api/inventariosApi.js";

export async function atualizarHudInventario() {
    try {
        const [jogador, itens] = await Promise.all([
            jogadorApi.buscarPorSave(), 
            inventarioApi.buscarPorJogador(), 
        ]);

        const capacidade = jogador?.capacidade_inventario ?? 3;
        const listaItens = itens || [];

        renderizarSlotsMochila(capacidade, listaItens);
    } catch (erro) {
        console.error("Erro ao atualizar HUD do inventário:", erro.message);
    }
}

function renderizarSlotsMochila(capacidade, itens) {
    const containerSlots = document.getElementById("mochilaSlots");
    const labelCapacidade = document.getElementById("mochilaCapacidade");
    const tooltip = document.getElementById("mochilaTooltip");

    if (!containerSlots) return;

    containerSlots.innerHTML = "";
    labelCapacidade.textContent = `${itens.length}/${capacidade}`;

    for (let i = 0; i < capacidade; i++) {
        const registroInv = itens[i];
        const slot = document.createElement("div");

        if (registroInv && registroInv.item) {
            const infoItem = registroInv.item;
            slot.className = `slot-item ocupado ${infoItem.raridade || "COMUM"}`;

            const visualItem = infoItem.imagem ? `<img src="${infoItem.imagem}" alt="${infoItem.nome}">` : 
            `<span style="font-size: 24px;">📦</span>`;

            const badgeUsos = registroInv.usos_restantes > 0 ? 
            `<span class="slot-usos">⚡${registroInv.usos_restantes}</span>` : "";

            const badgeQtd = registroInv.quantidade > 1 ? 
            `<span class="slot-qtd">x${registroInv.quantidade}</span>` : "";

            slot.innerHTML = `${visualItem}${badgeUsos}${badgeQtd}`;

            // tooltip ao passar o mouse no item
            slot.addEventListener("mouseenter", () => {
                document.getElementById("tooltipNome").textContent = infoItem.nome;
                document.getElementById("tooltipDesc").textContent =
                    infoItem.descricao || "";
                document.getElementById("tooltipMeta").textContent =
                    `Raridade: ${infoItem.raridade} | Usos: ${registroInv.usos_restantes === -1 ? "∞" : registroInv.usos_restantes}`;
                tooltip.hidden = false;
            });

            slot.addEventListener("mouseleave", () => {
                tooltip.hidden = true;
            });

            // clique para usar o item usando
            slot.addEventListener("click", () => usarItemPelaMochila(registroInv.id_item),);
        } 
        else {
            // espaço vazio garantido até completar capacidade_inventario
            slot.className = "slot-item";
            slot.title = "Espaço vazio";
        }

        containerSlots.appendChild(slot);
    }
}

// usa o item via inventarioApi.usarItem e atualiza a mochila
async function usarItemPelaMochila(idItem) {
    try {
        const dadosContexto = window.obterContextoAtual? window.obterContextoAtual() : {};

        const resultado = await inventarioApi.usarItem(idItem, dadosContexto);

        // atualiza a mochila imediatamente na tela
        await atualizarHudInventario();

        window.dispatchEvent(new CustomEvent("itemUsado", { detail: resultado }));
    } catch (erro) {
        console.error("Erro ao usar item:", erro.message);
        alert("Não foi possível usar este item agora.");
    }
}

// inicializa automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarHudInventario);