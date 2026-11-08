const supabase = require("../config/supabase");

class MateriaModel {
    async buscarMaterias(){
        const {data, error} = await supabase
            .from('materias')
            .select(`id_materia, nome, ordem`)

        if(error){
            console.error('Erro ao consultar no Supabase: ', error.message);
            throw error;
        }

        return data;
    }
}

module.exports = new MateriaModel();