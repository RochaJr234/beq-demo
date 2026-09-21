/* ==========================================================
   ROCHA DIGITAL
   Arquivo: abertura.js

   Responsabilidade:
   - Criar a tela de abertura
   - Exibir a imagem da Rocha Digital
   - Controlar o tempo de abertura
   - Liberar o sistema após a abertura

   NÃO ALTERAR OUTROS MÓDULOS.
========================================================== */

class AberturaSistema {

    constructor() {

        this.tela = null;

        // Tempo que a abertura ficará visível
        this.tempoAbertura = 3500;

    }


    init() {

        this.criarTela();

        setTimeout(() => {

            this.encerrar();

        }, this.tempoAbertura);

    }


    criarTela() {

        // Evita criar a abertura duas vezes
        if (document.getElementById("tela-abertura")) {
            return;
        }


        this.tela = document.createElement("div");

        this.tela.id = "tela-abertura";


        this.tela.innerHTML = `

            <img
                src="assets/images/abertura-rocha-digital.png"
                alt="Rocha Digital"
            >

        `;


        // Coloca a abertura no início do BODY
        document.body.prepend(this.tela);

    }


    encerrar() {

        if (!this.tela) {
            return;
        }


        this.tela.classList.add("encerrando");


        // Remove a tela depois da animação
        setTimeout(() => {

            if (this.tela) {

                this.tela.remove();

                this.tela = null;

            }

        }, 800);

    }

}


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.Abertura = new AberturaSistema();

        window.Abertura.init();

    }
);