const supabase = require('../config/supabase');

class ItensModel{
    async buscarTodos(){
        const {data, error} = await supabase
            .from('item')
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                usos,
                tipo,
                efeito,
                raridade,
                peso,
                acumulativo
            `);

        if(error){
            console.error('Erro ao buscar itens: ', error.message);
            throw error;
        }

        return data;
    }
    async buscarPorId(idItem){
        const {data, error} = await supabase
            .from('item')
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                usos,
                tipo,
                efeito,
                raridade,
                peso,
                acumulativo
            `)
            .eq('id_item', idItem)
            .maybeSingle();

        if(error){
            console.error(`Erro ao buscar item de ID ${idItem}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorTipo(tipo){
        const {data, error} = await supabase
            .from('item')
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                usos,
                tipo,
                efeito,
                raridade,
                peso,
                acumulativo
            `)
            .eq('tipo', tipo);

        if(error){
            console.error(`Erro ao buscar itens de tipo ${tipo}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorRaridade(raridade){
        const {data, error} = await supabase
            .from('item')
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                usos,
                tipo,
                efeito,
                raridade,
                peso,
                acumulativo
            `)
            .eq('raridade', raridade);

        if(error){
            console.error(`Erro ao buscar itens de raridade ${raridade}: `, error.message);
            throw error;
        }

        return data;
    }
    async buscarPorEfeito(efeito){
        const {data, error} = await supabase
            .from('item')
            .select(`
                id_item,
                nome,
                descricao,
                preco,
                imagem,
                usos,
                tipo,
                efeito,
                raridade,
                peso,
                acumulativo
            `)
            .eq('efeito', efeito);


        if(error){
            console.error(`Erro ao buscar itens de efeito ${efeito}: `, error.message);
            throw error;
        }

        return data;
    }
}

module.exports = new ItensModel();