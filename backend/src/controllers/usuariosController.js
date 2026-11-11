const respostaApi = require("../utils/respostaApi");
const userService = require("../services/usuariosService");

class UsuarioController {
  async buscarPorId(req, res) {
      try {
          const usuario = await userService.buscarPorId(req.usuarioLogado.id_usuario);

          return res.status(200).json(respostaApi(true, "Usuário encontrado.", usuario));
      }
      catch(error) {
          return res.status(404).json(respostaApi(false, error.message));
      }
  }
  async buscarPorEmail(req, res) {
    try {
      const usuario = await userService.buscarPorEmail(req.params.email);

      return res.status(200).json(respostaApi(true, "Usuário encontrado.", usuario));
    }
    catch (error) {
      return res.status(404).json(respostaApi(false, error.message));
    }
  }
  async buscarTodos(req, res) {
    try {
      const usuarios = await userService.buscarTodos();

      return res.status(200).json(respostaApi(true, "Usuários carregados.", usuarios,
        { quantidade: usuarios.length }),
      );
    }
    catch (error) {
      return res.status(404).json(respostaApi(false, error.message));
    }
  }
  async atualizar(req,res){
      try{
          const usuario = await userService.atualizar(req.usuarioLogado.id_usuario, req.body);

          return res.status(200).json(respostaApi(true, "Usuário atualizado com sucesso.", usuario));
      }
      catch(error){
          return res.status(400).json(respostaApi(false,error.message));
      }
  }
  async deletar(req,res){
      try{
          await userService.deletar(req.usuarioLogado.id_usuario);

          return res.status(200).json(respostaApi(true, "Usuário removido com sucesso."));
      }
      catch(error){
          return res.status(400).json(respostaApi(false,error.message));
      }
  }
  async atualizarLogin(req, res) {
    try {
      const usuario = await userService.atualizarLogin(req.params.id);

      return res.status(200).json(respostaApi(true, "Último login atualizado.", usuario));
    }
    catch (error) {
      return res.status(400).json(respostaApi(false, error.message));
    }
  }
}

module.exports = new UsuarioController();
