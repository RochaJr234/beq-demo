/* ==========================================================
   BEQ EMPREENDIMENTOS
   CONTROLE DO MODAL DE DISTRIBUIÇÃO
   Arquivo:
   assets/js/modulos/estoque/modal-distribuicao.js
========================================================== */

(function () {

    "use strict";

    console.log("BEQ: controle do modal de distribuição carregado.");

    /* ======================================================
       ABRIR MODAL
    ====================================================== */

    function abrirModal() {

        const modal =
            document.getElementById("modalDistribuicaoEstoque");

        if (!modal) {
            console.error(
                "BEQ: modalDistribuicaoEstoque não encontrado."
            );
            return;
        }

        modal.hidden = false;

        modal.classList.remove("hidden");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

        console.log(
            "BEQ: Modal de Distribuição aberto."
        );
    }


    /* ======================================================
       FECHAR MODAL
    ====================================================== */

    function fecharModal() {

        const modal =
            document.getElementById("modalDistribuicaoEstoque");

        if (!modal) {
            return;
        }

        modal.hidden = true;

        modal.classList.add("hidden");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );

        console.log(
            "BEQ: Modal de Distribuição fechado."
        );
    }


    /* ======================================================
       CLIQUES
       
       Usamos document para funcionar mesmo quando
       o Estoque é carregado pelo Router.
    ====================================================== */

    document.addEventListener(
        "click",
        function (event) {

            /* ----------------------------------------------
               BOTÃO PRINCIPAL
            ---------------------------------------------- */

            const abrir =
                event.target.closest(
                    "#btnAbrirDistribuicaoEstoque"
                );

            if (abrir) {

                event.preventDefault();

                abrirModal();

                return;
            }


            /* ----------------------------------------------
               BOTÃO FECHAR
            ---------------------------------------------- */

            const fechar =
                event.target.closest(
                    "#btnFecharDistribuicaoEstoque"
                );

            if (fechar) {

                event.preventDefault();

                fecharModal();

                return;
            }


            /* ----------------------------------------------
               BOTÃO CANCELAR
            ---------------------------------------------- */

            const cancelar =
                event.target.closest(
                    "#btnCancelarDistribuicaoEstoque"
                );

            if (cancelar) {

                event.preventDefault();

                fecharModal();

                return;
            }


            /* ----------------------------------------------
               BACKDROP
            ---------------------------------------------- */

            const backdrop =
                event.target.closest(
                    "[data-fechar-distribuicao]"
                );

            if (backdrop) {

                event.preventDefault();

                fecharModal();

                return;
            }

        }
    );


    /* ======================================================
       TECLA ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            const modal =
                document.getElementById(
                    "modalDistribuicaoEstoque"
                );

            if (!modal) {
                return;
            }

            if (
                !modal.hidden &&
                !modal.classList.contains("hidden")
            ) {

                fecharModal();

            }

        }
    );


    /* ======================================================
       DISPONIBILIZAR GLOBALMENTE
    ====================================================== */

    window.ModalDistribuicaoEstoque = {

        abrir: abrirModal,

        fechar: fecharModal

    };


})();