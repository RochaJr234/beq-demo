/* ==========================================================
   BEQ EMPREENDIMENTOS
   Arquivo: app.js

   Responsabilidade:
   - Inicialização geral do sistema
   - Inicialização do Router
   - Controle da Sidebar
   - Controle do botão Menu
   - Não inicializa módulos individuais
========================================================== */

class BEQApp {


    /* ======================================================
       CONSTRUTOR
    ====================================================== */

    constructor() {

        this.version = "2.0";

        this.name = "BEQ Empreendimentos";

        this.router = null;

    }


    /* ======================================================
       INICIALIZAÇÃO DO SISTEMA
    ====================================================== */

    init() {

        console.clear();

        if (typeof EmpresaAtiva !== "undefined") {
         EmpresaAtiva.init();
       }

        console.log("==========================================");
        console.log("BEQ EMPREENDIMENTOS");
        console.log("Sistema iniciado - versão " + this.version);
        console.log( "==========================================");


        /* ----------------------------------------------
           Criar Router
        ---------------------------------------------- */

        this.router = new Router();


        /* ----------------------------------------------
           Inicializar botão do menu
        ---------------------------------------------- */

        this.initializeMenu();


        /* ----------------------------------------------
           Carregar página inicial
        ---------------------------------------------- */

        this.router
            .load("dashboard")
            .then(() => {

                this.initializeSidebar();

            })
            .catch((erro) => {

                console.error(
                    "Erro ao carregar o Dashboard:",
                    erro
                );

            });

    }


    /* ======================================================
       BOTÃO MENU
    ====================================================== */

    initializeMenu() {

        const btnMenu = document.getElementById(
            "btnMenu"
        );


        if (!btnMenu) {

            console.warn(
                "BEQ: botão Menu não encontrado."
            );

            return;

        }


        /*
         * Evita registrar o evento mais de uma vez
         */

        if (
            btnMenu.dataset.listener === "true"
        ) {

            return;

        }


        btnMenu.dataset.listener = "true";


        /* ----------------------------------------------
           Evento do botão
        ---------------------------------------------- */

        btnMenu.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "sidebar-collapsed"
                );


                console.log(
                    "BEQ: Sidebar alternada."
                );

            }
        );

    }


    /* ======================================================
       SIDEBAR
    ====================================================== */

    initializeSidebar() {

        const itens = document.querySelectorAll(
            ".sidebar-item"
        );


        itens.forEach((item) => {


            /*
             * Evita registrar o mesmo evento duas vezes
             */

            if (
                item.dataset.listener === "true"
            ) {

                return;

            }


            item.dataset.listener = "true";


            /* ------------------------------------------
               Evento do menu
            ------------------------------------------ */

            item.addEventListener(
                "click",
                async (e) => {

                    e.preventDefault();


                    /* ------------------------------
                       Remover ativo
                    ------------------------------ */

                    itens.forEach((i) => {

                        i.classList.remove(
                            "active"
                        );

                    });


                    /* ------------------------------
                       Ativar item clicado
                    ------------------------------ */

                    item.classList.add(
                        "active"
                    );


                    /* ------------------------------
                       Identificar página
                    ------------------------------ */

                    const pagina =
                        item.dataset.page;


                    if (!pagina) {

                        return;

                    }


                    /* ------------------------------
                       Carregar página pelo Router
                    ------------------------------ */

                    try {

                        await this.router.load(
                            pagina
                        );


                        /*
                         * IMPORTANTE:
                         *
                         * O Router é quem inicializa
                         * o módulo correspondente.
                         *
                         * Não criar Produtos,
                         * Clientes, Fornecedores etc.
                         * aqui.
                         */

                        this.initializeSidebar();

                    }
                    catch (erro) {

                        console.error(
                            "Erro ao carregar a página:",
                            pagina,
                            erro
                        );

                    }

                }
            );

        });

    }

}


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.BEQ = new BEQApp();

        window.BEQ.init();

    }
);