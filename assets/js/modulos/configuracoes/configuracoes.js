/* ==========================================================
   BEQ EMPREENDIMENTOS
   MÓDULO: CONFIGURAÇÕES
   Arquivo: assets/js/modulos/configuracoes/configuracoes.js

   Responsabilidades:
   - Exibir informações do sistema
   - Contabilizar registros do LocalStorage
   - Atualizar indicadores
   - Acionar limpeza dos dados de teste
========================================================== */


class Configuracoes {

    constructor() {

        /* ==================================================
           CHAVES DO LOCALSTORAGE
        ================================================== */

        this.chaves = {

            produtos:
                "beq_produtos",

            categorias:
                "beq_categorias",

            clientes:
                "beq_clientes",

            fornecedores:
                "beq_fornecedores",

            obras:
                "beq_obras",

            compras:
                "beq_compras",

            movimentacoes:
                "beq_movimentacoes_estoque",

            cotacoes:
                "beq_cotacoes"

        };


        /* ==================================================
           ELEMENTOS
        ================================================== */

        this.elementos = {};

        this.btnLimparDados = null;

    }


    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

    init() {

        console.log(
            "BEQ: módulo Configurações inicializando..."
        );


        this.cacheElementos();

        this.atualizarDados();

        this.atualizarVersao();

        this.eventos();


        console.log(
            "BEQ: módulo Configurações inicializado."
        );

    }


    /* ======================================================
       CACHE DE ELEMENTOS
    ====================================================== */

    cacheElementos() {

        this.elementos = {

            totalProdutos:
                document.getElementById(
                    "configTotalProdutos"
                ),

            totalCategorias:
                document.getElementById(
                    "configTotalCategorias"
                ),

            totalClientes:
                document.getElementById(
                    "configTotalClientes"
                ),

            totalFornecedores:
                document.getElementById(
                    "configTotalFornecedores"
                ),

            totalObras:
                document.getElementById(
                    "configTotalObras"
                ),

            totalCompras:
                document.getElementById(
                    "configTotalCompras"
                ),

            totalMovimentacoes:
                document.getElementById(
                    "configTotalMovimentacoes"
                ),

            totalCotacoes:
                document.getElementById(
                    "configTotalCotacoes"
                ),

            versao:
                document.getElementById(
                    "configVersao"
                )

        };


        this.btnLimparDados =
            document.getElementById(
                "btnLimparDadosTeste"
            );


        if (!this.btnLimparDados) {

            console.warn(
                "BEQ Configurações: botão de limpeza não encontrado."
            );

        }

    }


    /* ======================================================
       EVENTOS
    ====================================================== */

    eventos() {

        if (
            !this.btnLimparDados
        ) {

            return;

        }


        /*
         * Evita adicionar o mesmo evento
         * caso o módulo seja inicializado
         * novamente.
         */

        if (
            this.btnLimparDados.dataset.listener === "true"
        ) {

            return;

        }


        this.btnLimparDados.dataset.listener =
            "true";


        this.btnLimparDados.addEventListener(
            "click",
            () => {

                this.executarLimpeza();

            }
        );

    }


    /* ======================================================
       ATUALIZAR DADOS
    ====================================================== */

    atualizarDados() {

        const totais = {};


        Object.keys(this.chaves).forEach(
            tipo => {

                totais[tipo] =
                    this.contarRegistros(
                        this.chaves[tipo]
                    );

            }
        );


        this.definirTexto(
            this.elementos.totalProdutos,
            totais.produtos
        );


        this.definirTexto(
            this.elementos.totalCategorias,
            totais.categorias
        );


        this.definirTexto(
            this.elementos.totalClientes,
            totais.clientes
        );


        this.definirTexto(
            this.elementos.totalFornecedores,
            totais.fornecedores
        );


        this.definirTexto(
            this.elementos.totalObras,
            totais.obras
        );


        this.definirTexto(
            this.elementos.totalCompras,
            totais.compras
        );


        this.definirTexto(
            this.elementos.totalMovimentacoes,
            totais.movimentacoes
        );


        this.definirTexto(
            this.elementos.totalCotacoes,
            totais.cotacoes
        );


        console.log(
            "BEQ Configurações: indicadores atualizados.",
            totais
        );

    }


    /* ======================================================
       CONTAR REGISTROS
    ====================================================== */

    contarRegistros(chave) {

        try {

            const valor =
                localStorage.getItem(
                    chave
                );


            if (!valor) {

                return 0;

            }


            const convertido =
                JSON.parse(valor);


            if (
                Array.isArray(convertido)
            ) {

                return convertido.length;

            }


            if (
                convertido &&
                typeof convertido === "object"
            ) {

                return 1;

            }


            return 0;

        }

        catch (erro) {

            console.error(
                "BEQ Configurações: erro ao contar",
                chave,
                erro
            );


            return 0;

        }

    }


    /* ======================================================
       DEFINIR TEXTO
    ====================================================== */

    definirTexto(elemento, valor) {

        if (!elemento) {

            return;

        }


        elemento.textContent =
            Number(valor) || 0;

    }


    /* ======================================================
       ATUALIZAR VERSÃO
    ====================================================== */

    atualizarVersao() {

        if (
            !this.elementos.versao
        ) {

            return;

        }


        /*
         * Primeiro tenta utilizar
         * a configuração global.
         */

        if (
            typeof BEQ_CONFIG !== "undefined" &&
            BEQ_CONFIG.version
        ) {

            this.elementos.versao.textContent =
                BEQ_CONFIG.version;

            return;

        }


        /*
         * Fallback para a versão
         * definida pela aplicação.
         */

        if (
            window.BEQ &&
            window.BEQ.version
        ) {

            this.elementos.versao.textContent =
                window.BEQ.version;

            return;

        }


        /*
         * Último fallback.
         */

        this.elementos.versao.textContent =
            "2.0.0";

    }


    /* ======================================================
       EXECUTAR LIMPEZA
    ====================================================== */

    executarLimpeza() {

        /*
         * A classe LimpezaSistema continua
         * sendo responsável pela limpeza.
         */

        if (
            typeof LimpezaSistema ===
            "undefined"
        ) {

            alert(
                "A função de limpeza do sistema não está disponível."
            );


            console.error(
                "BEQ Configurações: LimpezaSistema não foi carregado."
            );


            return;

        }


        const limpeza =
            new LimpezaSistema();


        limpeza.limparDados();

    }

}


/* ==========================================================
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Configuracoes =
    Configuracoes;


console.log(
    "BEQ: configuracoes.js foi carregado."
);