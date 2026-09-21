/* ==========================================================
   BEQ EMPREENDIMENTOS
   Arquivo: constants.js
   Descrição: Constantes globais da aplicação
   Autor: Rocha Digital
   Versão: 2.0
========================================================== */

const BEQ_CONSTANTS = {

    /*=========================================================
      Sistema
    =========================================================*/

    APP_NAME: "BEQ Empreendimentos",

    APP_VERSION: "2.0.0",

    COMPANY: "Rocha Digital",

    STORAGE_PREFIX: "beq_",


    /*=========================================================
      Módulos
    =========================================================*/

    MODULES: {

        DASHBOARD: "dashboard",

        PRODUTOS: "produtos",

        FORNECEDORES: "fornecedores",

        CLIENTES: "clientes",

        COMPRAS: "compras",

        ESTOQUE: "estoque",

        OBRAS: "obras",

        ORCAMENTOS: "orcamentos",

        RELATORIOS: "relatorios",

        USUARIOS: "usuarios"

    },


    /*=========================================================
      Status
    =========================================================*/

    STATUS: {

        ATIVO: "Ativo",

        INATIVO: "Inativo",

        PENDENTE: "Pendente",

        CANCELADO: "Cancelado"

    },


    /*=========================================================
      Mensagens
    =========================================================*/

    MESSAGES: {

        SAVE_SUCCESS: "Registro salvo com sucesso.",

        DELETE_SUCCESS: "Registro removido com sucesso.",

        UPDATE_SUCCESS: "Registro atualizado com sucesso.",

        ERROR: "Ocorreu um erro inesperado."

    }

};

Object.freeze(BEQ_CONSTANTS);