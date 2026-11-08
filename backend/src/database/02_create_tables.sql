/*
1. MATERIA (id_materia, nome, ordem)
2. ITEM (id_item, nome, descricao, preco, imagem, usos, tipo, raridade, peso)
3. QUESTAO (id_questao, id_materia, enunciado, tipo, nivel)
4. ALTERNATIVA (id_alternativa, id_questao, texto, correta)
5. SAVE (id_save, nome_save, data_criacao, ultimo_save, ativo)
6. CHECKPOINT(id_checkpoint, nome, descricao, ordem)
7. JOGADOR (id_jogador, id_save, nome, dinheiro, fase_atual, checkpoint, primeira_run, tempo_jogado, resultado_final)
8. ATIVIDADE (id_atividade, id_save, id_materia, nota, tentativas, concluida)
9. PROVA_FINAL (id_prova, id_save, nota, realizada, tentativas)
10. INVENTARIO (id_inventario, id_save, id_item, quantidade, usos_restantes)
11. LOJA (id_loja, id_save, ultima_geracao, aberta)
12. LOJA_ITEM (id_loja_item, id_loja, id_item)
13. HISTORICO (id_historico, id_save, media, resultado, data)
14. USUÁRIO (id_usuario, nome, email, senha_hash, data_criacao, ultimo_login)
*/

# Materias
CREATE TABLE MATERIAS (
	ID_MATERIA INT AUTO_INCREMENT PRIMARY KEY,
    NOME  VARCHAR(50) UNIQUE NOT NULL,
    ORDEM INT UNIQUE NOT NULL
);

-- Versão Supabase
create table "materias" (
  "id_materia" BIGINT generated always as identity primary key,
  "nome" VARCHAR(50) unique not null,
  "ordem" INT unique not null
);

# Item
CREATE TABLE item (
	idItem INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT, # Será mostrado ao usuário
    preco INT NOT NULL, # Apesar de normalmente usarmos DECIMAL para preço, os preços dos itens não terão centavos
    imagem VARCHAR(300),
    usos INT NOT NULL,
    tipo VARCHAR(30) NOT NULL, # Ex.: Dica, Tempo, Consumível, etc
    efeito VARCHAR(70) NOT NULL, # O que ele faz, para o programa entender o que ele faz (ex. ELIMINAR_ALTERNATIVAS)
    raridade ENUM('COMUM', 'RARO', 'LENDARIO') NOT NULL, # Normal -> 50, 45, 40; Raro -> 20, 15, 10; Lendário -> 3, 2, 1 (pesos)
    peso INT NOT NULL
);

-- Versão Supabase
CREATE TYPE resultado_raridade AS ENUM ('COMUM', 'RARO', 'LENDARIO');
create table "item" (
  "id_item" BIGINT generated always as identity primary key,
  "nome" VARCHAR(100) not null,
  "descricao" TEXT,
  "preco" INT not null,
  "imagem" VARCHAR(300),
  "usos" INT not null,
  "tipo" VARCHAR(30) not null,
  "efeito" VARCHAR(70) not null,
  "raridade" resultado_raridade,
  "peso" INT not null
);

# Questão
CREATE TABLE QUESTAO (
	ID_QUESTAO INT AUTO_INCREMENT PRIMARY KEY,
    ID_MATERIA INT NOT NULL,
    FOREIGN KEY (ID_MATERIA) REFERENCES MATERIAS(ID_MATERIA) ON UPDATE CASCADE ON DELETE RESTRICT,
    ENUNCIADO TEXT NOT NULL,
    TIPO ENUM('MULTIPLA_ESCOLHA', 'VF', 'DIGITAR', 'TABELA_VERDADE', 'PLANO_CARTESIANO', 'CONJUNTO', 'RELACAO_BINARIA', 'FUNCAO', 'RETA') NOT NULL,
    NIVEL INT  NOT NULL,
    CONSTRAINT CHECA_VALOR_NIVEL CHECK (NIVEL BETWEEN 1 AND 7) # DE 1 A 2 - FACEIS, DE 3 A 4 - MÉDIAS, DE 5 A 6 - DIFICEIS, 7 - DESAFIO
);

-- Versão Supabase
CREATE TABLE "questao" (
    "id_questao" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_materia" INT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tipo" tipo_questao NOT NULL,
    "nivel" INT NOT NULL,
    CONSTRAINT "foreign_key_materia" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT "checa_valor_nivel" CHECK ("nivel" BETWEEN 1 AND 7)
);


# Alternativa
CREATE TABLE ALTERNATIVA (
	ID_ALTERNATIVA INT AUTO_INCREMENT PRIMARY KEY,
    ID_QUESTAO INT NOT NULL,
    FOREIGN KEY (ID_QUESTAO) REFERENCES QUESTAO(ID_QUESTAO) ON UPDATE CASCADE ON DELETE CASCADE,
    TEXTO TEXT NOT NULL,
    CORRETA BOOLEAN NOT NULL
);

-- Versão Supabase
CREATE TABLE "alternativa" (
    "id_alternativa" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_questao" INT NOT NULL,
    "texto" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL,
    CONSTRAINT "foreign_key_questao" FOREIGN KEY ("id_questao") REFERENCES "questao"("id_questao") ON UPDATE CASCADE ON DELETE CASCADE
);


# Save
CREATE TABLE SAVE (
	ID_SAVE INT AUTO_INCREMENT PRIMARY KEY,
    NOME_SAVE VARCHAR(100) NOT NULL,
    DATA_CRIACAO DATETIME DEFAULT CURRENT_TIMESTAMP,
    ULTIMO_SAVE DATETIME DEFAULT CURRENT_TIMESTAMP,
    ATIVO BOOLEAN NOT NULL
);

-- Versão Supabase
CREATE TABLE "save" (
    "id_save" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nome_save" VARCHAR(100) NOT NULL,
    "data_criacao" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ultimo_save" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL
);
ALTER TABLE "save"
ADD COLUMN "id_usuario" INT REFERENCES "usuario"("id_usuario");

CREATE TABLE CHECKPOINT (
	ID_CHECKPOINT INT AUTO_INCREMENT PRIMARY KEY,
    NOME VARCHAR(50) NOT NULL,
    DESCRICAO TEXT,
    ORDEM INT NOT NULL # Ordem dentro do fluxo 
);

-- Versão Supabase
CREATE TABLE "checkpoint" (
    "id_checkpoint" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" TEXT,
    "ordem" INT NOT NULL 
);


# Jogador
CREATE TABLE JOGADOR (
	ID_JOGADOR INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
    FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
    NOME VARCHAR(40) NOT NULL,
    DINHEIRO INT DEFAULT 0,
    ID_MATERIA_ATUAL INT,
    FOREIGN KEY (ID_MATERIA_ATUAL) REFERENCES MATERIAS(ID_MATERIA) ON UPDATE CASCADE ON DELETE RESTRICT,
    ID_CHECKPOINT INT,
    FOREIGN KEY (ID_CHECKPOINT) REFERENCES CHECKPOINT(ID_CHECKPOINT) ON UPDATE CASCADE ON DELETE SET NULL,
    PRIMEIRA_RUN BOOLEAN DEFAULT FALSE,
    TEMPO_JOGADO INT DEFAULT 0
);

-- Versão Supabase
CREATE TABLE "jogador" (
    "id_jogador" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "nome" VARCHAR(40) NOT NULL,
    "dinheiro" INT DEFAULT 0,
    "id_materia_atual" INT,
    "id_checkpoint" INT,
    "primeira_run" BOOLEAN DEFAULT FALSE,
    "tempo_jogado" INT DEFAULT 0,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "foreign_key_materia_atual" FOREIGN KEY ("id_materia_atual") REFERENCES "materias"("id_materia") ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT "foreign_key_checkpoint" FOREIGN KEY ("id_checkpoint") REFERENCES "checkpoint"("id_checkpoint") ON UPDATE CASCADE ON DELETE SET NULL
);

# Atividade
CREATE TABLE ATIVIDADE (
	ID_ATIVIDADE INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
    FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
    ID_MATERIA INT,
    FOREIGN KEY (ID_MATERIA) REFERENCES MATERIAS(ID_MATERIA) ON UPDATE CASCADE ON DELETE CASCADE,
    NOTA DECIMAL(3,1) CHECK(NOTA >= 0),
    TENTATIVAS INT,
    CONCLUIDA BOOLEAN DEFAULT FALSE
);

-- Versão Supabase
CREATE TABLE "atividade" (
    "id_atividade" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "id_materia" INT,
    "nota" DECIMAL(3,1) CHECK("nota" >= 0),
    "tentativas" INT,
    "concluida" BOOLEAN DEFAULT FALSE,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "foreign_key_materia" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON UPDATE CASCADE ON DELETE CASCADE
);

# Prova final
CREATE TABLE PROVA_FINAL (
	ID_PROVA INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
    FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
    NOTA DECIMAL (3,1) CHECK(NOTA >= 0),
    REALIZADA BOOLEAN DEFAULT FALSE,
    TENTATIVAS INT DEFAULT 0
);

-- Versão Supabase
CREATE TABLE "prova_final" (
    "id_prova" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "nota" DECIMAL (3,1) CHECK("nota" >= 0),
    "realizada" BOOLEAN DEFAULT FALSE,
    "tentativas" INT DEFAULT 0,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE
);

# Inventario
CREATE TABLE INVENTARIO (
	ID_INVENTARIO INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
    FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
    ID_ITEM INT NOT NULL,
    FOREIGN KEY (ID_ITEM) REFERENCES ITEM(ID_ITEM) ON UPDATE CASCADE ON DELETE RESTRICT,
    QUANTIDADE INT DEFAULT 0,
    USOS_RESTANTES INT DEFAULT 0
);

-- Versão Supabase
CREATE TABLE "inventario" (
    "id_inventario" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "id_item" INT NOT NULL,
    "quantidade" INT DEFAULT 0,
    "usos_restantes" INT DEFAULT 0,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "FOREIGN_KEY_ITEM" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON UPDATE CASCADE ON DELETE RESTRICT
);

# Loja
CREATE TABLE LOJA (
	ID_LOJA INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
	FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
	ULTIMA_GERACAO DATETIME NULL,
    ABERTA BOOLEAN DEFAULT FALSE
);

-- Versão Supabase
CREATE TABLE "loja" (
    "id_loja" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "ultima_geracao" TIMESTAMP WITH TIME ZONE NULL,
    "aberta" BOOLEAN DEFAULT FALSE,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE
);

# Loja item
CREATE TABLE LOJA_ITEM (
	ID_LOJA_ITEM INT AUTO_INCREMENT PRIMARY KEY,
    ID_LOJA INT NOT NULL,
    FOREIGN KEY (ID_LOJA) REFERENCES LOJA(ID_LOJA) ON UPDATE CASCADE ON DELETE CASCADE,
    ID_ITEM INT NOT NULL,
    FOREIGN KEY (ID_ITEM) REFERENCES ITEM(ID_ITEM) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Versão Supabase
CREATE TABLE "loja_item" (
    "id_loja_item" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_loja" INT NOT NULL,
    "id_item" INT NOT NULL,
    CONSTRAINT "foreign_key_loja" FOREIGN KEY ("id_loja") REFERENCES "loja"("id_loja") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "foreign_key_item" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON UPDATE CASCADE ON DELETE RESTRICT
);

# Historico
CREATE TABLE HISTORICO (
	ID_HISTORICO INT AUTO_INCREMENT PRIMARY KEY,
    ID_SAVE INT NOT NULL,
    FOREIGN KEY (ID_SAVE) REFERENCES SAVE(ID_SAVE) ON UPDATE CASCADE ON DELETE CASCADE,
    MEDIA FLOAT,
    RESULTADO ENUM('BOM', 'RUIM'),
    DATA_HIST DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Versão Supabase
CREATE TYPE resultado_historico AS ENUM ('BOM', 'RUIM');
CREATE TABLE "historico" (
    "id_historico" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_save" INT NOT NULL,
    "media" REAL,
    "resultado" resultado_historico,
    "data_hist" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "foreign_key_save" FOREIGN KEY ("id_save") REFERENCES "save"("id_save") ON UPDATE CASCADE ON DELETE CASCADE
);

# Usuário
CREATE TABLE USUARIO (
    ID_USUARIO INT AUTO_INCREMENT PRIMARY KEY,
    NOME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    SENHA_HASH TEXT NOT NULL,
    DATA_CRIACAO DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ULTIMO_LOGIN DATETIME
)

-- Versão Supabase
CREATE TABLE "usuario" (
    "id_usuario" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "senha_hash" TEXT NOT NULL,
    "data_criacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" TIMESTAMP
);