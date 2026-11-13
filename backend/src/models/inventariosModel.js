const supabase = require('../config/supabase');

class InventariosModel{
    async criar(dados){
        const novoInventario = {
            id_jogador: dados.id_jogador,
            id_item: dados.id_item,
            quantidade: dados.quantidade,
            usos_restantes: dados.usos_restantes
        }

        const {data, error} = await supabase
            .from('inventario')
            .insert(novoInventario)
            .select()
            .single()

        if(error){
            console.error('Erro ao criar inventário: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarPorId(idInventario){
        const {data, error} = await supabase
            .from('inventario')
            .select(`*, item(nome, descricao, imagem, efeito, raridade)`)
            .eq('id_inventario', idInventario)
            .maybeSingle();

        if(error){
            console.error(`Erro ao buscar inventário de ID ${idInventario}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorJogador(idJogador){
        const {data, error} = await supabase
            .from('inventario')
            .select(`*, item(nome, descricao, imagem, efeito, raridade)`)
            .eq('id_jogador', idJogador)

        if(error){
            console.error(`Erro ao buscar inventário do jogador de ID ${idJogador}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarItem(idJogador, idItem){
        const {data, error} = await supabase
            .from('inventario')
            .select(`*, item(nome, descricao, imagem, tipo, efeito, raridade, acumulativo)`)
            .eq('id_jogador', idJogador)
            .eq('id_item', idItem)
            .maybeSingle();

        if(error){
            console.error(`Erro ao buscar item de ID ${idItem} no inventário do 
                jogador de ID ${idJogador}: `, error.message);
            throw error;
        }

        return data;    
    }
    async buscarQuantidadeItens(idJogador){
        const {count,error} = await supabase
            .from('inventario')
            .select('*',{count:'exact', head:true})
            .eq('id_jogador', idJogador);

        if(error){
            throw error;
        }

        return count;
    }
    async atualizar(idInventario, dados){
        const dadosAtualizados = {};
        
        if(dados.usos_restantes !== undefined){
            dadosAtualizados.usos_restantes = dados.usos_restantes;
        }
        if(dados.quantidade !== undefined){
            dadosAtualizados.quantidade = dados.quantidade;
        }

        if(Object.keys(dadosAtualizados).length === 0){
            return null;
        }

        const {data, error} = await supabase
            .from('inventario')
            .update(dadosAtualizados)
            .eq('id_inventario', idInventario)
            .select()
            .maybeSingle();
        
        if(error){
            console.error(`Erro ao atualizar inventário de ID ${idInventario}: `, error.message);
            throw error;
        }

        return data; 
    }
    async excluir(idInventario){
        const existeInvent = await this.buscarPorId(idInventario);

        if(!existeInvent){
            throw new Error(`Inventário de ID ${idInventario} não existe`);
        }

        const {data, error} = await supabase
            .from('inventario')
            .delete()
            .eq('id_inventario', idInventario)
            .select()
            .maybeSingle();
        
        if(error){
            console.error(`Erro ao deletar inventário de ID ${idInventario}: `, error.message);
            throw error;
        }

        return true;
    }
}

module.exports = new InventariosModel();