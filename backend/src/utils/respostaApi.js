// Aqui padronizaremos o formato da resposta da API
// sucesso -> booleano -> Indica se operação foi bem sucedida
// mensagem -> string/null -> Mensagem explicativa (opcional)
// data -> any (varias/qualquer) -> Dados a serem retornadas pela API (array, objeto ou null)
// extras -> objeto -> Campos adicionais, só aparecem quando faz sentido

const respostaApi = (sucesso, mensagem = "", data = null, extras = {}) => {
    return {
        sucesso,
        mensagem,
        data,
        // a elipse é um operador spread = ele "espalha" os elementos de um objeto iterável 
        // em novos locais (ele "abre" a estrutura e coloca cada item de forma individual)
        // pode copiar arrays/objetos,
        // concatenar arrays,
        // adicionar elementos a um array,
        // manipular elementos,
        // passar argumentos para funções
        // nesse caso, ele esta dizendo "adicione campo mensagem SE ele não estiver vazio"
        // mensagem !== null é uma condição, caso for true, ele adiciona a mensagem na array 
        // que estamos criando
        ...extras
    };
};

module.exports = respostaApi;