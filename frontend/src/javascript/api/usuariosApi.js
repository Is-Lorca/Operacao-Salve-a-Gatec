import { fetchComAuth } from "./helper/fetchComAuth";

import API_URL from "./api.js";

export const usuarioApi = {
  async buscarUsuario(idUser){
      const resposta = await fetchComAuth(`${API_URL}/usuarios/${idUser}`);

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }

      return json.data;
  },
  async buscarTodos(){
      const resposta = await fetchComAuth(`${API_URL}/usuarios`);

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }

      return json.data;
  },
  async buscarPorEmail(email){
      const resposta = await fetchComAuth(`${API_URL}/usuarios/email/${email}`);

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }

      return json.data;
  },
  async atualizarUsuario(idUser,dados){
      const resposta = await fetchComAuth(`${API_URL}/usuarios/${idUser}`,{
          method:"PUT",

          body:JSON.stringify(dados)
      });

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }

      return json.data;
  },
  async deletarUsuario(idUser){
      const resposta = await fetchComAuth(`${API_URL}/usuarios/${idUser}`,{
          method:"DELETE"
      });

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }

      return json.data;
  },
  async atualizarLogin(idUser){
      const resposta = await fetchComAuth(`${API_URL}/usuarios/${idUser}/login`,{
          method:"PUT"
      });

      const json = await resposta.json();

      if(!resposta.ok){
          throw new Error(json.mensagem);
      }
      return json.data;
  }
};