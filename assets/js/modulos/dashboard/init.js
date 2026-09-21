/* ==========================================================
   BEQ EMPREENDIMENTOS
   Dashboard
   Arquivo: init.js
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.querySelector(".dashboard")) {

        return;

    }

    window.dashboard = new Dashboard();

    dashboard.init();

});