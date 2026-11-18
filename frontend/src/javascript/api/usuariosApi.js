import { fetchComAuth } from "./helper/fetchComAuth.js";

import API_URL from "./api.js";

export const usuarioApi = {
  async buscarUsuario(idUser){
      const json = await fetchComAuth(`${API_URL}/usuarios/${idUser}`);

      return json.data;
  },
  async buscarTodos(){
      const json = await fetchComAuth(`${API_URL}/usuarios`);

      return json.data;
  },
  async buscarPorEmail(email){
      const json = await fetchComAuth(`${API_URL}/usuarios/email/${email}`);

      return json.data;
  },
  async atualizarUsuario(idUser,dados){
      const json = await fetchComAuth(`${API_URL}/usuarios/${idUser}`,{
          method:"PUT",

          body:JSON.stringify(dados)
      });

      return json.data;
  },
  async deletarUsuario(idUser){
      const json = await fetchComAuth(`${API_URL}/usuarios/${idUser}`,{
          method:"DELETE"
      });

      return json.data;
  },
  async atualizarLogin(idUser){
      const json = await fetchComAuth(`${API_URL}/usuarios/${idUser}/login`,{
          method:"PUT"
      });
      
      return json.data;
  }
};