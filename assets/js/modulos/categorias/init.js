/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo Categorias
   Arquivo: init.js
   Responsável por iniciar o módulo
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("listaCategorias")) {

        return;

    }

    window.categorias = new Categorias();

    categorias.init();

});