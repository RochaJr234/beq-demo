/* ==========================================================
   BEQ EMPREENDIMENTOS
   Core: Router
   Arquivo: assets/js/core/router.js

   Responsabilidade:
   - Carregamento das páginas
   - Inicialização dos módulos
   - Navegação da aplicação
   - SPA
========================================================== */


class Router {


    constructor(containerId = "app-content") {

        this.container =
            document.getElementById(
                containerId
            );

        this.currentPage = null;

    }


    /* ======================================================
       CARREGAR PÁGINA
    ====================================================== */

    async load(page) {

        try {


            /* ----------------------------------------------
               Verificar container
            ---------------------------------------------- */

            if (!this.container) {

                throw new Error(
                    "Container principal da aplicação não foi encontrado."
                );

            }


            /* ----------------------------------------------
               Carregar HTML
            ---------------------------------------------- */

            const response =
                await fetch(
                    `pages/${page}.html`
                );


            if (!response.ok) {

                throw new Error(
                    `Página "${page}" não encontrada.`
                );

            }


            const html =
                await response.text();


            /* ----------------------------------------------
               Inserir página
            ---------------------------------------------- */

            this.container.innerHTML =
                html;


            this.currentPage =
                page;


            /* ==================================================
               INICIALIZAÇÃO DOS MÓDULOS
            ================================================== */

            switch (page) {


                /* ------------------------------------------
                   DASHBOARD
                ------------------------------------------ */

                case "dashboard":

                    if (
                        typeof Dashboard !==
                        "undefined"
                    ) {

                        new Dashboard().init();

                    }

                    break;


                /* ------------------------------------------
                   PRODUTOS
                ------------------------------------------ */

                case "produtos":

                    if (
                        typeof Produtos !==
                        "undefined"
                    ) {

                        new Produtos().init();

                    }

                    break;


                /* ------------------------------------------
                   CATEGORIAS
                ------------------------------------------ */

                case "categorias":

                    if (
                        typeof Categorias !==
                        "undefined"
                    ) {

                        new Categorias().init();

                    }

                    break;


                /* ------------------------------------------
                   CLIENTES
                ------------------------------------------ */

                case "clientes":

                    if (
                        typeof Clientes !==
                        "undefined"
                    ) {

                        new Clientes().init();

                    }

                    break;


                /* ------------------------------------------
                   FORNECEDORES
                ------------------------------------------ */

                case "fornecedores":

                    if (
                        typeof Fornecedores !==
                        "undefined"
                    ) {

                        window.moduloFornecedores =
                            new Fornecedores();


                        window.moduloFornecedores.init();

                    }

                    break;


                /* ------------------------------------------
                   OBRAS
                ------------------------------------------ */

                case "obras":

                    if (
                        typeof Obras !==
                        "undefined"
                    ) {

                        window.moduloObras =
                            new Obras();


                        window.moduloObras.init();

                    }

                    break;


                /* ------------------------------------------
                   ESTOQUE
                ------------------------------------------ */

                case "estoque":

                    if (
                        typeof Estoque !==
                        "undefined"
                    ) {

                        window.moduloEstoque =
                            new Estoque();


                        window.moduloEstoque.init();

                    }

                    break;


                /* ------------------------------------------
                   COMPRAS
                ------------------------------------------ */

                case "compras":

                    if (
                        typeof Compras !==
                        "undefined"
                    ) {

                        window.moduloCompras =
                            new Compras();


                        window.moduloCompras.init();

                    }

                    break;


                /* ------------------------------------------
                   COTAÇÕES
                ------------------------------------------ */

                case "cotacoes":

                    if (
                        typeof Cotacoes !==
                        "undefined"
                    ) {

                        window.moduloCotacoes =
                            new Cotacoes();


                        window.moduloCotacoes.init();


                        console.log(
                            "BEQ: módulo Cotações inicializado pelo Router."
                        );

                    }
                    else {

                        console.error(
                            "BEQ: classe Cotacoes não encontrada. Verifique cotacoes.js."
                        );

                    }

                    break;


                /* ------------------------------------------
                   RELATÓRIOS
                ------------------------------------------ */

                case "relatorios":

                    if (
                        typeof Relatorios !==
                        "undefined"
                    ) {

                        window.moduloRelatorios =
                            new Relatorios();


                        window.moduloRelatorios.init();

                    }

                    break;

                case "empresas":
                    if (typeof Empresas !== "undefined") {
                        window.moduloEmpresas = new Empresas();
                        window.moduloEmpresas.init();
                    }
                    break;
                    
                /* ------------------------------------------
                   CONFIGURAÇÕES
                ------------------------------------------ */

                case "configuracoes":

                    if (
                        typeof Configuracoes !==
                        "undefined"
                    ) {

                        window.moduloConfiguracoes =
                            new Configuracoes();


                        window.moduloConfiguracoes.init();

                    }

                    break;


                /* ------------------------------------------
                   PÁGINA NÃO CONFIGURADA
                ------------------------------------------ */

                default:

                    console.warn(
                        `BEQ: página "${page}" carregada, mas não possui módulo JS configurado.`
                    );

                    break;

            }


            console.log(
                `Página carregada: ${page}`
            );


        }
        catch (error) {


            console.error(
                "BEQ Router:",
                error
            );


            if (this.container) {

                this.container.innerHTML = `

                    <div class="page-error">

                        <h2>
                            Erro
                        </h2>

                        <p>
                            ${error.message}
                        </p>

                    </div>

                `;

            }

        }

    }


    /* ======================================================
       PÁGINA ATUAL
    ====================================================== */

    getCurrentPage() {

        return this.currentPage;

    }


    /* ======================================================
       PÁGINA INICIAL
    ====================================================== */

    loadInitialPage() {

        console.log(
            "Carregando página:",
            this.currentPage
        );

    }

}


/* ==========================================================
   DISPONIBILIZAR ROUTER
========================================================== */

window.Router = Router;


console.log(
    "BEQ: router.js foi carregado."
);