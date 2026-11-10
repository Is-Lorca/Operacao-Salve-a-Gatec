const supabase = require('../config/supabase');

class UsuarioModel {
    async criar(dados){
        const registroExistente = await this.buscarPorEmailCompleto(dados.email);
        const agora = new Date().toISOString();

        if(!registroExistente){
            const novoUser = {
                nome: dados.nome,
                email: dados.email,
                senha_hash: dados.senha_hash,
                ultimo_login: agora
            };
    
            const {data, error} = await supabase
                .from('usuario')
                .insert(novoUser)
                .select()
                .single();
            
            if(error){
                console.error('Erro ao inserir registro: ', error.message);
                throw error;
            }
    
            return data;
        }
        // reativando usuário que foi feito soft delete, mas com novos dados (possivelmente)
        else if(!registroExistente.ativo){
            const reativado = await this.reativar(registroExistente.id_usuario, dados);

            return reativado;
        }
        else{
            throw new Error('Usuário já cadastrado');
        }
    }
    async buscarPorId(idUser){        
        const {data, error} = await supabase
            .from('usuario')
            .select(`id_usuario, nome, email, data_criacao, ultimo_login`)
            .eq('ativo', true)
            .eq('id_usuario', idUser)
            .maybeSingle();
        
        if(error){
            console.log(`Erro ao buscar usuario de ID ${idUser}: `, error.message);
            throw error;
        }
        
        return data;
    }
    async buscarPorEmail(emailUser){
        const {data, error} = await supabase
            .from('usuario')
            .select(`id_usuario, nome, email, senha_hash, data_criacao, ultimo_login`)
            .eq('ativo', true)
            .eq('email', emailUser)
            .maybeSingle();

            if(error){
                console.log(`Erro ao buscar usuario de email ${emailUser}: `, error.message);
                throw error;
            }
            
            return data;
    }
    // sem rota pública
    async buscarTodos(){
        const {data, error} = await supabase
            .from('usuario')
            .select(`id_usuario, nome, email, data_criacao, ultimo_login`)
            .eq('ativo', true);
        
        if(error){
            console.log('Erro ao buscar usuários: ', error.message);
            throw error;
        }
        
        return data;
    }
    async atualizar(idUser, novosDados){
        const dadosAtualizar = {};

        if(novosDados.nome){
            dadosAtualizar.nome = novosDados.nome;
        }
        if(novosDados.email){
            dadosAtualizar.email = novosDados.email;
        }
        if(novosDados.senha_hash){
            dadosAtualizar.senha_hash = novosDados.senha_hash;
        }
        
        // Se não enviou nenhum campo válido no body, não faz nada
        if(Object.keys(dadosAtualizar).length === 0){
            return null;
        }

        const {data, error} = await supabase
            .from('usuario')
            .update(dadosAtualizar)
            .eq('id_usuario', idUser)
            .eq('ativo', true) // Só atualiza se o usuário estiver ativo
            .select('*')
            .maybeSingle();

        if(error){
            console.log(`Erro ao atualizar usuario de ID ${idUser}: `, error.message);
            throw error;
        }

        return data; // Se o ID não existir, o Supabase retorna 'null'
    }
    async deletar(idUser){
        const registroExistente = await this.buscarPorId(idUser);
        if(!registroExistente){
            return false;
        }

        const {data, error} = await supabase
            .from('usuario')
            .update({ativo:false}) // soft delete
            .eq('id_usuario', idUser)
            .select()
            .maybeSingle();

        if(error){
            console.log(`Erro ao deletar usuario de ID ${id}: `, error.message);
            throw error;
        }

        return true;
    }
    async buscarPorEmailCompleto(email){
        const {data, error} = await supabase
            .from('usuario')
            .select(`id_usuario, nome, email, senha_hash, data_criacao, ultimo_login, ativo`)
            .eq('email', email)
            .maybeSingle();

        if(error){
            console.log(`Erro ao buscar usuario de email ${email}: `, error.message);
            throw error;
        }
            
        return data;
    }
    async reativar(idUser, dados){
        const agora = new Date().toISOString();
        const novoUser = {
            nome: dados.nome,
            email: dados.email,
            senha_hash: dados.senha_hash,
            ultimo_login: agora,
            ativo: true
        };

        const {data, error} = await supabase
            .from('usuario')
            .update(novoUser)
            .eq('id_usuario', idUser)
            .select()
            .single();
        
        if(error){
            console.error('Erro ao reativar registro: ', error.message);
            throw error;
        }

        return data;
    }
    async atualizarUltimoLogin(idUser){
        const {data, error} = await supabase
            .from('usuario')
            .update({ultimo_login: new Date().toISOString()})
            .eq('id_usuario', idUser)
            .select()
            .maybeSingle()

        if(error){
            console.error('Erro ao atualizar ultimo login em registro: ', error.message);
            throw error;
        }

        return data;
    }
}

module.exports = new UsuarioModel();