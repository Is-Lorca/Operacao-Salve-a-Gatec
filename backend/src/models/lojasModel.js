const supabase = require('../config/supabase');

class LojasModel{
    async criar(idSave){
        const novaLoja = {
            id_save: idSave,
            aberta: false,
            ultima_geracao: null,
            tentativas_fechada: 0
        };

        const {data, error} = await supabase
            .from('loja')
            .insert(novaLoja)
            .select()
            .single();

        if(error){
            console.error('Erro ao inserir registro da loja: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarPorId(idLoja){
        const {data, error} = await supabase
            .from('loja')
            .select(`id_save, ultima_geracao, tentativas_fechada, aberta`)
            .eq('id_loja', idLoja)
            .maybeSingle();
        
        if(error){
            console.error(`Erro ao buscar loja de ID ${idLoja}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorSave(idSave){
        const {data, error} = await supabase
            .from('loja')
            .select(`id_loja, ultima_geracao, tentativas_fechada, aberta`)
            .eq('id_save', idSave)
            .maybeSingle();
        
        if(error){
            console.error(`Erro ao buscar loja pelo save de ID ${idSave}: `, error.message);
            throw error;
        }
        return data;
    }
    async abrirLoja(idLoja){
        return await this.atualizar(idLoja, {
            aberta: true,
            tentativas_fechada: 0,
            ultima_geracao: new Date().toISOString()
        });
    }
    async fecharLoja(idLoja){
        return await this.atualizar(idLoja, {
            aberta: false
        });
    }
    async atualizarTentativa(idLoja){
        const loja = await this.buscarPorId(idLoja);

        if(!loja){
            throw new Error(`Loja de ID ${idLoja} é inexistente`)
        }

        return await this.atualizar(idLoja, { 
            tentativas_fechada: loja.tentativas_fechada + 1
        });
    }
    async atualizar(idLoja, novosDados){
        const dadosAtualizar = {};

        if(novosDados.aberta !== undefined){
            dadosAtualizar.aberta = novosDados.aberta;
        }

        if(novosDados.ultima_geracao !== undefined){
            dadosAtualizar.ultima_geracao = novosDados.ultima_geracao;
        }

        if(novosDados.tentativas_fechada !== undefined){
            dadosAtualizar.tentativas_fechada = novosDados.tentativas_fechada;
        }

        if(Object.keys(dadosAtualizar).length === 0){
            return null;
        }

        const { data, error } = await supabase
            .from("loja")
            .update(dadosAtualizar)
            .eq("id_loja", idLoja)
            .select()
            .maybeSingle();

        if(error){
            console.error(`Erro ao atualizar loja de ID ${idLoja}: `, error.message);
            throw error;
        }

        return data;
    }
    async adicionarItensLoja(idLoja, itens){
        // necessário o laço for, será mais de 1 item dentro de itens
        for(let i = 0; i < itens.length; i++){
            const inserindoItem = {
                id_loja: idLoja,
                id_item: itens[i].id_item,
                preco: itens[i].preco
            }

            const {data, error} = await supabase
                .from('loja_item')
                .insert(inserindoItem)
                .select()
            
            if(error){
                console.error(`Erro ao armazenar itens na loja de ID ${idLoja}: `, error.message);
                throw error;
            }
        }
        // o data só existe dentro do laço for
        return true;
    }
    async buscarItensLoja(idLoja){
        const {data, error} = await supabase
            .from('loja_item')
            .select(`preco, item(id_item, nome, descricao, imagem, raridade, efeito)`)
            .eq('id_loja', idLoja)
        
        if(error){
            console.error(`Erro ao encontrar itens da loja de ID ${idLoja}: `, error.message);
            throw error;
        }

        return data;
    }
    async limparItens(idLoja){
        const {data, error} = await supabase
            .from('loja_item')
            .delete()
            .eq('id_loja', idLoja)
            .select()

        if(error){
            console.error(`Erro ao apagar itens da loja de ID ${idLoja}: `, error.message);
            throw error;
        }

        return data;
    }
    async removerItem(idLoja, idItem){
        const {data, error} = await supabase
            .from("loja_item")
            .delete()
            .eq("id_loja", idLoja)
            .eq("id_item", idItem)
            .select()
            .maybeSingle();

        if(error){
            console.error(`Erro ao remover item ${idItem} da loja ${idLoja}: `, error.message);
            throw error;
        }

        return data;
    }
}

module.exports = new LojasModel();