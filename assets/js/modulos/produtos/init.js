/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo Produtos
   Arquivo: init.js
   Responsável por iniciar o módulo
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("listaProdutos")) {

        return;

    }

    window.produtos = new Produtos();

    produtos.init();

});