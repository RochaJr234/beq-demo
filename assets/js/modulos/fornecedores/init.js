/* ======================================================
   BEQ EMPREENDIMENTOS
   Módulo: Fornecedores
   Inicialização
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("listaFornecedores")) return;

    window.moduloFornecedores = new Fornecedores();

    window.moduloFornecedores.init();

});