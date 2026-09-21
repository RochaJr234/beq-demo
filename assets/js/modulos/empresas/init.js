/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo Empresas
   Arquivo: init.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("listaEmpresas")) {

        return;

    }

    window.empresas = new Empresas();

    empresas.init();

});