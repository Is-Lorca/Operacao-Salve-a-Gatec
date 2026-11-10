const BASE_URL = "http://localhost:3000/api";

export const usuarioApi = {
  async criarUsuario(dados) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao criar usuário: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API criarUsuario:", error);

      throw error;
    }
  },

  async buscarUsuario(idUser) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/${idUser}`);

      if (!resposta.ok) {
        throw new Error(`Erro ao buscar usuário: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API buscarUsuario:", error);

      throw error;
    }
  },

  async buscarPorEmail(email) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/email/${email}`);

      if (!resposta.ok) {
        throw new Error(`Erro ao buscar email: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API buscarPorEmail:", error);

      throw error;
    }
  },

  async atualizarUsuario(idUser, dados) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/${idUser}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao atualizar usuário: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API atualizarUsuario:", error);

      throw error;
    }
  },

  async deletarUsuario(idUser) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/${idUser}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao deletar usuário: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API deletarUsuario:", error);

      throw error;
    }
  },

  async atualizarLogin(idUser) {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/${idUser}/login`, {
        method: "PUT",
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao atualizar login: ${resposta.status}`);
      }

      const json = await resposta.json();

      return json.data;
    } 
    catch (error) {
      console.error("Erro na API atualizarLogin:", error);

      throw error;
    }
  },
};
