/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo: Cotações
   Arquivo: assets/js/modulos/cotacoes/cotacoes.js

   ETAPA 8.8
   - Cotações vinculadas à empresa ativa
   - Histórico separado por empresa
   - Obras filtradas por empresa
   - Fornecedores compartilhados
   - Produtos compartilhados
   - Sem alteração de estoque
   - Rascunho
   - Geração de cotação
   - Edição
   - Exclusão
   - Filtros
   - Compatibilidade com dados existentes

   Design / Implementação: Rocha Digital
========================================================== */

class Cotacoes {

    constructor() {

        /* ======================================================
           LOCALSTORAGE
        ======================================================= */

        this.storageKey =
            "beq_cotacoes";

        this.empresasKey =
            "beq_empresas";

        this.empresaAtivaKey =
            "beq_empresa_ativa";


        /* ======================================================
           DADOS
        ======================================================= */

        this.cotacoes = [];

        this.produtos = [];

        this.fornecedores = [];

        this.obras = [];

        this.empresas = [];

        this.empresaAtiva = null;

        this.itens = [];

        this.cotacaoEditando = null;

        this.elementos = {};

        this.eventosRegistrados = false;
    }


    /* ==========================================================
       INICIALIZAÇÃO
    ========================================================== */

    init() {

        console.log(
            "BEQ: Inicializando módulo Cotações..."
        );

        this.cacheElementos();

        this.carregarDados();

        this.carregarEmpresaAtiva();

        this.eventos();

        this.atualizarIndicadores();

        this.renderizarHistorico();

        console.log(
            "BEQ: módulo Cotações inicializado."
        );
    }


    /* ==========================================================
       ELEMENTOS
    ========================================================== */

    cacheElementos() {

        this.elementos = {

            /* ==================================================
               NOVA COTAÇÃO
            ================================================== */

            btnNovaCotacao:
                document.getElementById(
                    "btnNovaCotacao"
                ),

            btnNovaCotacaoVazio:
                document.getElementById(
                    "btnNovaCotacaoVazio"
                ),

            areaNovaCotacao:
                document.getElementById(
                    "areaNovaCotacao"
                ),

            cotacaoNumero:
                document.getElementById(
                    "cotacaoNumero"
                ),

            cotacaoData:
                document.getElementById(
                    "cotacaoData"
                ),

            cotacaoValidade:
                document.getElementById(
                    "cotacaoValidade"
                ),

            cotacaoFornecedor:
                document.getElementById(
                    "cotacaoFornecedor"
                ),

            cotacaoObra:
                document.getElementById(
                    "cotacaoObra"
                ),

            cotacaoObservacao:
                document.getElementById(
                    "cotacaoObservacao"
                ),


            /* ==================================================
               PRODUTOS / ITENS
            ================================================== */

            cotacaoProduto:
                document.getElementById(
                    "cotacaoProduto"
                ),

            cotacaoQuantidade:
                document.getElementById(
                    "cotacaoQuantidade"
                ),

            cotacaoUnidade:
                document.getElementById(
                    "cotacaoUnidade"
                ),

            btnAdicionarItemCotacao:
                document.getElementById(
                    "btnAdicionarItemCotacao"
                ),

            listaItensCotacao:
                document.getElementById(
                    "listaItensCotacao"
                ),

            cardTabelaItensCotacao:
                document.getElementById(
                    "cardTabelaItensCotacao"
                ),

            estadoVazioItensCotacao:
                document.getElementById(
                    "estadoVazioItensCotacao"
                ),

            totalItensCotacao:
                document.getElementById(
                    "totalItensCotacao"
                ),

            totalQuantidadeCotacao:
                document.getElementById(
                    "totalQuantidadeCotacao"
                ),


            /* ==================================================
               FORNECEDOR SELECIONADO
            ================================================== */

            fornecedorSelecionadoCotacao:
                document.getElementById(
                    "fornecedorSelecionadoCotacao"
                ),


            /* ==================================================
               AÇÕES
            ================================================== */

            btnCancelarCotacao:
                document.getElementById(
                    "btnCancelarCotacao"
                ),

            btnSalvarRascunhoCotacao:
                document.getElementById(
                    "btnSalvarRascunhoCotacao"
                ),

            btnFinalizarCotacao:
                document.getElementById(
                    "btnFinalizarCotacao"
                ),


            /* ==================================================
               FILTROS
            ================================================== */

            pesquisarCotacao:
                document.getElementById(
                    "pesquisarCotacao"
                ),

            filtroStatusCotacao:
                document.getElementById(
                    "filtroStatusCotacao"
                ),

            filtroFornecedorCotacao:
                document.getElementById(
                    "filtroFornecedorCotacao"
                ),

            filtroObraCotacao:
                document.getElementById(
                    "filtroObraCotacao"
                ),

            filtroDataCotacao:
                document.getElementById(
                    "filtroDataCotacao"
                ),


            /* ==================================================
               HISTÓRICO
            ================================================== */

            listaCotacoes:
                document.getElementById(
                    "listaCotacoes"
                ),

            cardTabelaCotacoes:
                document.getElementById(
                    "cardTabelaCotacoes"
                ),

            estadoVazioCotacoes:
                document.getElementById(
                    "estadoVazioCotacoes"
                ),


            /* ==================================================
               INDICADORES
            ================================================== */

            totalCotacoes:
                document.getElementById(
                    "totalCotacoes"
                ),

            cotacoesAbertas:
                document.getElementById(
                    "cotacoesAbertas"
                ),

            cotacoesEnviadas:
                document.getElementById(
                    "cotacoesEnviadas"
                ),

            cotacoesRespondidas:
                document.getElementById(
                    "cotacoesRespondidas"
                )
        };
    }


    /* ==========================================================
       CARREGAMENTO DOS DADOS
    ========================================================== */

    carregarDados() {

        this.cotacoes =
            this.lerStorage(
                this.storageKey,
                []
            );

        this.produtos =
            this.lerStorage(
                "beq_produtos",
                []
            );

        this.fornecedores =
            this.lerStorage(
                "beq_fornecedores",
                []
            );

        this.obras =
            this.lerStorage(
                "beq_obras",
                []
            );

        this.empresas =
            this.lerStorage(
                this.empresasKey,
                []
            );

        this.carregarFornecedores();

        this.carregarObras();

        this.carregarProdutos();
    }


    /* ==========================================================
       LOCALSTORAGE
    ========================================================== */

    lerStorage(
        chave,
        padrao
    ) {

        try {

            const dados =
                localStorage.getItem(
                    chave
                );

            if (!dados) {

                return padrao;
            }

            const convertido =
                JSON.parse(
                    dados
                );

            return Array.isArray(
                convertido
            )
                ? convertido
                : padrao;

        } catch (erro) {

            console.error(
                "BEQ: erro ao ler LocalStorage:",
                chave,
                erro
            );

            return padrao;
        }
    }


    salvarStorage() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(
                    this.cotacoes
                )
            );

            return true;

        } catch (erro) {

            console.error(
                "BEQ: erro ao salvar cotações:",
                erro
            );

            alert(
                "Não foi possível salvar a cotação."
            );

            return false;
        }
    }


    /* ==========================================================
       EMPRESA ATIVA
    ========================================================== */

    carregarEmpresaAtiva() {

        /*
         * Recarrega as empresas diretamente
         * do LocalStorage.
         */

        this.empresas =
            this.lerStorage(
                this.empresasKey,
                []
            );


        /*
         * Recupera a empresa selecionada.
         */

        const idSalvo =
            localStorage.getItem(
                this.empresaAtivaKey
            );


        this.empresaAtiva =
            null;


        /*
         * Tenta encontrar a empresa
         * atualmente selecionada.
         */

        if (idSalvo) {

            this.empresaAtiva =
                this.empresas.find(
                    empresa =>
                        String(
                            empresa.id
                        ) ===
                        String(
                            idSalvo
                        )
                ) || null;
        }


        /*
         * Confirma se a empresa
         * está realmente ativa.
         */

        if (this.empresaAtiva) {

            const status =
                String(
                    this.empresaAtiva.status ||
                    "ativo"
                )
                    .trim()
                    .toLowerCase();

            const empresaValida =
                status === "ativo" ||
                status === "ativa";

            if (!empresaValida) {

                this.empresaAtiva =
                    null;

                localStorage.removeItem(
                    this.empresaAtivaKey
                );
            }
        }


        /*
         * Se não houver seleção válida,
         * seleciona automaticamente a
         * primeira empresa ativa.
         */

        if (!this.empresaAtiva) {

            this.empresaAtiva =
                this.empresas.find(
                    empresa => {

                        const status =
                            String(
                                empresa.status ||
                                "ativo"
                            )
                                .trim()
                                .toLowerCase();

                        return (
                            status === "ativo" ||
                            status === "ativa"
                        );
                    }
                ) || null;
        }


        /*
         * Persiste a empresa selecionada.
         */

        if (this.empresaAtiva) {

            localStorage.setItem(
                this.empresaAtivaKey,
                String(
                    this.empresaAtiva.id
                )
            );

            console.log(
                "BEQ Cotações: empresa ativa:",
                this.obterNomeEmpresaAtiva()
            );

            return;
        }


        console.warn(
            "BEQ Cotações: nenhuma empresa ativa encontrada."
        );
    }


    obterIdEmpresaAtiva() {

        return (
            this.empresaAtiva?.id ||
            ""
        );
    }


    obterNomeEmpresaAtiva() {

        if (!this.empresaAtiva) {

            return "";
        }

        return (
            this.empresaAtiva.nomeFantasia ||
            this.empresaAtiva.razaoSocial ||
            this.empresaAtiva.razao ||
            "Empresa"
        );
    }


    verificarEmpresaAtiva() {

        /*
         * Atualiza a empresa antes
         * de qualquer operação.
         */

        this.carregarEmpresaAtiva();

        if (this.empresaAtiva) {

            return true;
        }

        alert(
            "Nenhuma empresa ativa foi selecionada.\n\n" +
            "Acesse o módulo Empresas e selecione uma empresa ativa antes de utilizar Cotações."
        );

        return false;
    }


    /* ==========================================================
       FORNECEDORES
    ========================================================== */

    carregarFornecedores() {

        const select =
            this.elementos.cotacaoFornecedor;

        const filtro =
            this.elementos.filtroFornecedorCotacao;


        /* ======================================================
           SELECT DA COTAÇÃO
        ====================================================== */

        if (select) {

            select.innerHTML =
                `<option value="">Selecione o fornecedor</option>`;

            this.fornecedores
                .filter(
                    fornecedor => {

                        const status =
                            String(
                                fornecedor.status ||
                                "ativo"
                            )
                                .trim()
                                .toLowerCase();

                        return (
                            status !== "inativo" &&
                            status !== "inativa"
                        );
                    }
                )
                .forEach(
                    fornecedor => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            fornecedor.id;

                        option.textContent =
                            fornecedor.fantasia ||
                            fornecedor.razao ||
                            "Fornecedor sem nome";

                        select.appendChild(
                            option
                        );
                    }
                );
        }


        /* ======================================================
           FILTRO
        ====================================================== */

        if (filtro) {

            filtro.innerHTML =
                `<option value="">Todos os fornecedores</option>`;

            this.fornecedores
                .filter(
                    fornecedor => {

                        const status =
                            String(
                                fornecedor.status ||
                                "ativo"
                            )
                                .trim()
                                .toLowerCase();

                        return (
                            status !== "inativo" &&
                            status !== "inativa"
                        );
                    }
                )
                .forEach(
                    fornecedor => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            fornecedor.id;

                        option.textContent =
                            fornecedor.fantasia ||
                            fornecedor.razao ||
                            "Fornecedor sem nome";

                        filtro.appendChild(
                            option
                        );
                    }
                );
        }
    }


    /* ==========================================================
       OBRAS
    ========================================================== */

    carregarObras() {

        const select =
            this.elementos.cotacaoObra;

        const filtro =
            this.elementos.filtroObraCotacao;

        const empresaId =
            this.obterIdEmpresaAtiva();


        /*
         * Somente obras pertencentes
         * à empresa ativa.
         */

        const obrasEmpresa =
            this.obras.filter(
                obra => {

                    if (!obra.empresaId) {

                        return false;
                    }

                    return (
                        String(
                            obra.empresaId
                        ) ===
                        String(
                            empresaId
                        )
                    );
                }
            );


        /* ======================================================
           SELECT DA COTAÇÃO
        ====================================================== */

        if (select) {

            select.innerHTML =
                `<option value="">Selecione a obra</option>`;

            obrasEmpresa.forEach(
                obra => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        obra.id;

                    const codigo =
                        obra.codigo ||
                        "";

                    const nome =
                        obra.nomeObra ||
                        obra.nome ||
                        "";

                    option.textContent =
                        `${codigo} - ${nome}`
                            .replace(
                                /^ - /,
                                ""
                            );

                    select.appendChild(
                        option
                    );
                }
            );
        }


        /* ======================================================
           FILTRO
        ====================================================== */

        if (filtro) {

            filtro.innerHTML =
                `<option value="">Todas as obras</option>`;

            obrasEmpresa.forEach(
                obra => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        obra.id;

                    const codigo =
                        obra.codigo ||
                        "";

                    const nome =
                        obra.nomeObra ||
                        obra.nome ||
                        "";

                    option.textContent =
                        `${codigo} - ${nome}`
                            .replace(
                                /^ - /,
                                ""
                            );

                    filtro.appendChild(
                        option
                    );
                }
            );
        }
    }


    /* ==========================================================
       PRODUTOS
    ========================================================== */

    carregarProdutos() {

        const select =
            this.elementos.cotacaoProduto;

        if (!select) {

            return;
        }

        select.innerHTML =
            `<option value="">Selecione o produto</option>`;

        this.produtos.forEach(
            produto => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    produto.id;

                option.textContent =
                    produto.nome ||
                    produto.descricao ||
                    "Produto sem nome";

                select.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================================
       EVENTOS
    ========================================================== */

    eventos() {

        if (
            this.eventosRegistrados
        ) {

            return;
        }

        this.eventosRegistrados =
            true;

        const e =
            this.elementos;


        /* ======================================================
           NOVA COTAÇÃO
        ====================================================== */

        if (e.btnNovaCotacao) {

            e.btnNovaCotacao.addEventListener(
                "click",
                () =>
                    this.abrirNovaCotacao()
            );
        }


        if (
            e.btnNovaCotacaoVazio
        ) {

            e.btnNovaCotacaoVazio.addEventListener(
                "click",
                () =>
                    this.abrirNovaCotacao()
            );
        }


        /* ======================================================
           ADICIONAR ITEM
        ====================================================== */

        if (
            e.btnAdicionarItemCotacao
        ) {

            e.btnAdicionarItemCotacao.addEventListener(
                "click",
                () =>
                    this.adicionarItem()
            );
        }


        /* ======================================================
           CANCELAR
        ====================================================== */

        if (
            e.btnCancelarCotacao
        ) {

            e.btnCancelarCotacao.addEventListener(
                "click",
                () =>
                    this.cancelarCotacao()
            );
        }


        /* ======================================================
           RASCUNHO
        ====================================================== */

        if (
            e.btnSalvarRascunhoCotacao
        ) {

            e.btnSalvarRascunhoCotacao.addEventListener(
                "click",
                () =>
                    this.salvarCotacao(
                        "rascunho"
                    )
            );
        }


        /* ======================================================
           GERAR
        ====================================================== */

        if (
            e.btnFinalizarCotacao
        ) {

            e.btnFinalizarCotacao.addEventListener(
                "click",
                () =>
                    this.salvarCotacao(
                        "enviada"
                    )
            );
        }


        /* ======================================================
           PRODUTO
        ====================================================== */

        if (e.cotacaoProduto) {

            e.cotacaoProduto.addEventListener(
                "change",
                () =>
                    this.atualizarUnidade()
            );
        }


        /* ======================================================
           FORNECEDOR
        ====================================================== */

        if (
            e.cotacaoFornecedor
        ) {

            e.cotacaoFornecedor.addEventListener(
                "change",
                () =>
                    this.atualizarFornecedorSelecionado()
            );
        }


        /* ======================================================
           PESQUISA
        ====================================================== */

        if (
            e.pesquisarCotacao
        ) {

            e.pesquisarCotacao.addEventListener(
                "input",
                () =>
                    this.renderizarHistorico()
            );
        }


        /* ======================================================
           FILTRO STATUS
        ====================================================== */

        if (
            e.filtroStatusCotacao
        ) {

            e.filtroStatusCotacao.addEventListener(
                "change",
                () =>
                    this.renderizarHistorico()
            );
        }


        /* ======================================================
           FILTRO FORNECEDOR
        ====================================================== */

        if (
            e.filtroFornecedorCotacao
        ) {

            e.filtroFornecedorCotacao.addEventListener(
                "change",
                () =>
                    this.renderizarHistorico()
            );
        }


        /* ======================================================
           FILTRO OBRA
        ====================================================== */

        if (
            e.filtroObraCotacao
        ) {

            e.filtroObraCotacao.addEventListener(
                "change",
                () =>
                    this.renderizarHistorico()
            );
        }


        /* ======================================================
           FILTRO DATA
        ====================================================== */

        if (
            e.filtroDataCotacao
        ) {

            e.filtroDataCotacao.addEventListener(
                "change",
                () =>
                    this.renderizarHistorico()
            );
        }
    }


    /* ==========================================================
       ABRIR NOVA COTAÇÃO
    ========================================================== */

    abrirNovaCotacao() {

        if (
            !this.verificarEmpresaAtiva()
        ) {

            return;
        }

        /*
         * Recarrega as obras para garantir
         * que somente as obras da empresa
         * ativa apareçam.
         */

        this.carregarObras();

        this.carregarProdutos();

        this.carregarFornecedores();

        this.cotacaoEditando =
            null;

        this.itens =
            [];

        const e =
            this.elementos;


        if (
            e.areaNovaCotacao
        ) {

            e.areaNovaCotacao.style.display =
                "block";
        }


        this.limparFormulario();


        if (
            e.cotacaoNumero
        ) {

            e.cotacaoNumero.value =
                this.gerarNumero();
        }


        if (
            e.cotacaoData
        ) {

            e.cotacaoData.value =
                this.formatarDataInput(
                    new Date()
                );
        }


        if (
            e.cotacaoValidade
        ) {

            const validade =
                new Date();

            validade.setDate(
                validade.getDate() + 7
            );

            e.cotacaoValidade.value =
                this.formatarDataInput(
                    validade
                );
        }


        this.renderizarItens();

        this.atualizarResumo();


        if (
            e.areaNovaCotacao
        ) {

            e.areaNovaCotacao.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }


        console.log(
            "BEQ: Nova Cotação aberta para:",
            this.obterNomeEmpresaAtiva()
        );
    }


    /* ==========================================================
       LIMPAR FORMULÁRIO
    ========================================================== */

    limparFormulario() {

        const e =
            this.elementos;


        if (
            e.cotacaoNumero
        ) {

            e.cotacaoNumero.value =
                "";
        }


        if (
            e.cotacaoData
        ) {

            e.cotacaoData.value =
                "";
        }


        if (
            e.cotacaoValidade
        ) {

            e.cotacaoValidade.value =
                "";
        }


        if (
            e.cotacaoFornecedor
        ) {

            e.cotacaoFornecedor.value =
                "";
        }


        if (
            e.cotacaoObra
        ) {

            e.cotacaoObra.value =
                "";
        }


        if (
            e.cotacaoObservacao
        ) {

            e.cotacaoObservacao.value =
                "";
        }


        if (
            e.cotacaoProduto
        ) {

            e.cotacaoProduto.value =
                "";
        }


        if (
            e.cotacaoQuantidade
        ) {

            e.cotacaoQuantidade.value =
                "1";
        }


        if (
            e.cotacaoUnidade
        ) {

            e.cotacaoUnidade.value =
                "";
        }


        this.itens =
            [];

        this.atualizarFornecedorSelecionado();
    }


    /* ==========================================================
       NÚMERO DA COTAÇÃO
    ========================================================== */

    gerarNumero() {

        let maior =
            0;

        this.cotacoes.forEach(
            cotacao => {

                const numero =
                    String(
                        cotacao.numero ||
                        ""
                    );

                const encontrado =
                    numero.match(
                        /\d+/
                    );

                if (encontrado) {

                    const valor =
                        parseInt(
                            encontrado[0],
                            10
                        );

                    if (
                        valor > maior
                    ) {

                        maior =
                            valor;
                    }
                }
            }
        );


        return (
            `COT-${String(
                maior + 1
            ).padStart(
                5,
                "0"
            )}`
        );
    }


    /* ==========================================================
       DATA PARA INPUT
    ========================================================== */

    formatarDataInput(
        data
    ) {

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const dia =
            String(
                data.getDate()
            ).padStart(
                2,
                "0"
            );

        return (
            `${ano}-${mes}-${dia}`
        );
    }


    /* ==========================================================
       UNIDADE DO PRODUTO
    ========================================================== */

    atualizarUnidade() {

        const id =
            this.elementos.cotacaoProduto.value;

        const produto =
            this.produtos.find(
                p =>
                    String(
                        p.id
                    ) ===
                    String(
                        id
                    )
            );


        if (!produto) {

            this.elementos.cotacaoUnidade.value =
                "";

            return;
        }


        this.elementos.cotacaoUnidade.value =
            produto.unidade ||
            produto.unidadeMedida ||
            produto.medida ||
            "UN";
    }


    /* ==========================================================
       FORNECEDOR SELECIONADO
    ========================================================== */

    atualizarFornecedorSelecionado() {

        const id =
            this.elementos.cotacaoFornecedor.value;

        const fornecedor =
            this.fornecedores.find(
                f =>
                    String(
                        f.id
                    ) ===
                    String(
                        id
                    )
            );


        if (!fornecedor) {

            if (
                this.elementos
                    .fornecedorSelecionadoCotacao
            ) {

                this.elementos
                    .fornecedorSelecionadoCotacao
                    .textContent =
                    "Não selecionado";
            }

            return;
        }


        if (
            this.elementos
                .fornecedorSelecionadoCotacao
        ) {

            this.elementos
                .fornecedorSelecionadoCotacao
                .textContent =
                fornecedor.fantasia ||
                fornecedor.razao ||
                "Fornecedor";
        }
    }


    /* ==========================================================
       ADICIONAR MATERIAL
    ========================================================== */

    adicionarItem() {

        const e =
            this.elementos;

        const produtoId =
            e.cotacaoProduto.value;

        const quantidade =
            parseFloat(
                e.cotacaoQuantidade.value
            );


        if (!produtoId) {

            alert(
                "Selecione um produto."
            );

            return;
        }


        if (
            !quantidade ||
            quantidade <= 0
        ) {

            alert(
                "Informe uma quantidade válida."
            );

            return;
        }


        const produto =
            this.produtos.find(
                p =>
                    String(
                        p.id
                    ) ===
                    String(
                        produtoId
                    )
            );


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;
        }


        const unidade =
            e.cotacaoUnidade.value ||
            produto.unidade ||
            produto.unidadeMedida ||
            "UN";


        const existente =
            this.itens.find(
                item =>
                    String(
                        item.produtoId
                    ) ===
                    String(
                        produtoId
                    )
            );


        if (existente) {

            existente.quantidade +=
                quantidade;

        } else {

            this.itens.push({

                id:
                    this.gerarId(),

                produtoId:
                    produto.id,

                produto:
                    produto.nome ||
                    produto.descricao ||
                    "",

                quantidade:
                    quantidade,

                unidade:
                    unidade
            });
        }


        e.cotacaoProduto.value =
            "";

        e.cotacaoQuantidade.value =
            "1";

        e.cotacaoUnidade.value =
            "";


        this.renderizarItens();

        this.atualizarResumo();
    }


    /* ==========================================================
       RENDERIZAR ITENS
    ========================================================== */

    renderizarItens() {

        const e =
            this.elementos;

        if (
            !e.listaItensCotacao
        ) {

            return;
        }


        e.listaItensCotacao.innerHTML =
            "";


        if (
            !this.itens.length
        ) {

            if (
                e.cardTabelaItensCotacao
            ) {

                e.cardTabelaItensCotacao.style.display =
                    "none";
            }


            if (
                e.estadoVazioItensCotacao
            ) {

                e.estadoVazioItensCotacao.style.display =
                    "block";
            }

            return;
        }


        if (
            e.cardTabelaItensCotacao
        ) {

            e.cardTabelaItensCotacao.style.display =
                "block";
        }


        if (
            e.estadoVazioItensCotacao
        ) {

            e.estadoVazioItensCotacao.style.display =
                "none";
        }


        this.itens.forEach(
            (
                item,
                index
            ) => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${this.escapeHtml(
                            item.produto
                        )}
                    </td>

                    <td>
                        ${this.formatarNumero(
                            item.quantidade
                        )}
                    </td>

                    <td>
                        ${this.escapeHtml(
                            item.unidade
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-danger btn-sm"
                            data-remover-item="${item.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>
                `;


                const botao =
                    tr.querySelector(
                        "[data-remover-item]"
                    );


                if (botao) {

                    botao.addEventListener(
                        "click",
                        () => {

                            this.removerItem(
                                item.id
                            );
                        }
                    );
                }


                e.listaItensCotacao.appendChild(
                    tr
                );
            }
        );
    }


    /* ==========================================================
       REMOVER ITEM
    ========================================================== */

    removerItem(
        id
    ) {

        this.itens =
            this.itens.filter(
                item =>
                    String(
                        item.id
                    ) !==
                    String(
                        id
                    )
            );


        this.renderizarItens();

        this.atualizarResumo();
    }


    /* ==========================================================
       RESUMO
    ========================================================== */

    atualizarResumo() {

        const totalMateriais =
            this.itens.length;

        const totalQuantidade =
            this.itens.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.quantidade ||
                        0
                    ),
                0
            );


        if (
            this.elementos.totalItensCotacao
        ) {

            this.elementos.totalItensCotacao.textContent =
                totalMateriais;
        }


        if (
            this.elementos.totalQuantidadeCotacao
        ) {

            this.elementos.totalQuantidadeCotacao.textContent =
                this.formatarNumero(
                    totalQuantidade
                );
        }


        this.atualizarFornecedorSelecionado();
    }


    /* ==========================================================
       VALIDAR OBRA DA EMPRESA
    ========================================================== */

    obraPertenceEmpresa(
        obra
    ) {

        if (!obra) {

            return false;
        }

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {

            return false;
        }

        return (
            String(
                obra.empresaId ||
                ""
            ) ===
            String(
                empresaId
            )
        );
    }


    /* ==========================================================
       SALVAR COTAÇÃO
    ========================================================== */

    salvarCotacao(
        status
    ) {

        if (
            !this.verificarEmpresaAtiva()
        ) {

            return;
        }


        const e =
            this.elementos;


        /* ======================================================
           FORNECEDOR
        ====================================================== */

        if (
            !e.cotacaoFornecedor.value
        ) {

            alert(
                "Selecione um fornecedor."
            );

            return;
        }


        /* ======================================================
           OBRA
        ====================================================== */

        if (
            !e.cotacaoObra.value
        ) {

            alert(
                "Selecione uma obra."
            );

            return;
        }


        /* ======================================================
           ITENS
        ====================================================== */

        if (
            !this.itens.length
        ) {

            alert(
                "Adicione pelo menos um material à cotação."
            );

            return;
        }


        /* ======================================================
           FORNECEDOR
        ====================================================== */

        const fornecedor =
            this.fornecedores.find(
                f =>
                    String(
                        f.id
                    ) ===
                    String(
                        e.cotacaoFornecedor.value
                    )
            );


        if (!fornecedor) {

            alert(
                "Fornecedor não encontrado."
            );

            return;
        }


        /* ======================================================
           OBRA
        ====================================================== */

        const obra =
            this.obras.find(
                o =>
                    String(
                        o.id
                    ) ===
                    String(
                        e.cotacaoObra.value
                    )
            );


        if (!obra) {

            alert(
                "Obra não encontrada."
            );

            return;
        }


        /*
         * Impede vincular uma cotação
         * à obra de outra empresa.
         */

        if (
            !this.obraPertenceEmpresa(
                obra
            )
        ) {

            alert(
                "A obra selecionada não pertence à empresa ativa."
            );

            return;
        }


        const agora =
            new Date().toISOString();


        const empresaId =
            this.obterIdEmpresaAtiva();

        const empresaNome =
            this.obterNomeEmpresaAtiva();


        /* ======================================================
           DADOS DA COTAÇÃO
        ====================================================== */

        const dados = {

            id:
                this.cotacaoEditando?.id ||
                this.gerarId(),

            numero:
                e.cotacaoNumero.value ||
                this.gerarNumero(),

            data:
                e.cotacaoData.value,

            validade:
                e.cotacaoValidade.value,


            /* ==================================================
               EMPRESA
            ================================================== */

            empresaId:
                empresaId,

            empresaNome:
                empresaNome,


            /* ==================================================
               FORNECEDOR
            ================================================== */

            fornecedorId:
                fornecedor.id,

            fornecedor:
                fornecedor.fantasia ||
                fornecedor.razao ||
                "",


            /* ==================================================
               OBRA
            ================================================== */

            obraId:
                obra.id,

            obra:
                obra.nomeObra ||
                obra.nome ||
                "",


            /* ==================================================
               OBSERVAÇÃO
            ================================================== */

            observacao:
                e.cotacaoObservacao.value
                    .trim(),


            /* ==================================================
               ITENS
            ================================================== */

            itens:
                JSON.parse(
                    JSON.stringify(
                        this.itens
                    )
                ),


            /* ==================================================
               STATUS
            ================================================== */

            status:
                status,


            /* ==================================================
               DATAS
            ================================================== */

            criadoEm:
                this.cotacaoEditando?.criadoEm ||
                agora,

            atualizadoEm:
                agora
        };


        /* ======================================================
           EDITAR
        ====================================================== */

        if (
            this.cotacaoEditando
        ) {

            const indice =
                this.cotacoes.findIndex(
                    c =>
                        String(
                            c.id
                        ) ===
                        String(
                            this.cotacaoEditando.id
                        )
                );


            if (
                indice !== -1
            ) {

                this.cotacoes[indice] =
                    dados;
            }

        } else {

            this.cotacoes.push(
                dados
            );
        }


        /* ======================================================
           SALVAR
        ====================================================== */

        if (
            !this.salvarStorage()
        ) {

            return;
        }


        alert(
            status === "rascunho"
                ? "Cotação salva como rascunho."
                : "Cotação gerada com sucesso."
        );


        this.fecharFormulario();

        this.atualizarIndicadores();

        this.renderizarHistorico();
    }


    /* ==========================================================
       CANCELAR
    ========================================================== */

    cancelarCotacao() {

        const confirmar =
            confirm(
                "Deseja cancelar esta cotação?"
            );


        if (!confirmar) {

            return;
        }


        this.fecharFormulario();
    }


    /* ==========================================================
       FECHAR FORMULÁRIO
    ========================================================== */

    fecharFormulario() {

        if (
            this.elementos.areaNovaCotacao
        ) {

            this.elementos.areaNovaCotacao.style.display =
                "none";
        }


        this.cotacaoEditando =
            null;

        this.itens =
            [];
    }


    /* ==========================================================
       INDICADORES
    ========================================================== */

    atualizarIndicadores() {

        const empresaId =
            this.obterIdEmpresaAtiva();


        /*
         * Somente cotações da empresa ativa.
         */

        const cotacoesEmpresa =
            this.cotacoes.filter(
                cotacao =>
                    String(
                        cotacao.empresaId ||
                        ""
                    ) ===
                    String(
                        empresaId
                    )
            );


        const total =
            cotacoesEmpresa.length;


        const abertas =
            cotacoesEmpresa.filter(
                cotacao =>
                    cotacao.status ===
                    "rascunho"
            ).length;


        const enviadas =
            cotacoesEmpresa.filter(
                cotacao =>
                    cotacao.status ===
                    "enviada"
            ).length;


        const respondidas =
            cotacoesEmpresa.filter(
                cotacao =>
                    cotacao.status ===
                    "respondida"
            ).length;


        if (
            this.elementos.totalCotacoes
        ) {

            this.elementos.totalCotacoes.textContent =
                total;
        }


        if (
            this.elementos.cotacoesAbertas
        ) {

            this.elementos.cotacoesAbertas.textContent =
                abertas;
        }


        if (
            this.elementos.cotacoesEnviadas
        ) {

            this.elementos.cotacoesEnviadas.textContent =
                enviadas;
        }


        if (
            this.elementos.cotacoesRespondidas
        ) {

            this.elementos.cotacoesRespondidas.textContent =
                respondidas;
        }
    }


    /* ==========================================================
       HISTÓRICO
    ========================================================== */

    renderizarHistorico() {

        const e =
            this.elementos;


        if (
            !e.listaCotacoes
        ) {

            return;
        }


        const empresaId =
            this.obterIdEmpresaAtiva();


        /*
         * IMPORTANTE:
         * o histórico agora pertence
         * somente à empresa ativa.
         */

        let lista =
            this.cotacoes.filter(
                cotacao =>
                    String(
                        cotacao.empresaId ||
                        ""
                    ) ===
                    String(
                        empresaId
                    )
            );


        /* ======================================================
           PESQUISA
        ====================================================== */

        const pesquisa =
            (
                e.pesquisarCotacao?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        const status =
            e.filtroStatusCotacao?.value ||
            "";


        const fornecedorId =
            e.filtroFornecedorCotacao?.value ||
            "";


        const obraId =
            e.filtroObraCotacao?.value ||
            "";


        const data =
            e.filtroDataCotacao?.value ||
            "";


        /* ======================================================
           PESQUISA
        ====================================================== */

        if (pesquisa) {

            lista =
                lista.filter(
                    cotacao => {

                        const texto = [

                            cotacao.numero,

                            cotacao.fornecedor,

                            cotacao.obra,

                            cotacao.empresaNome

                        ]
                            .join(" ")
                            .toLowerCase();


                        return texto.includes(
                            pesquisa
                        );
                    }
                );
        }


        /* ======================================================
           STATUS
        ====================================================== */

        if (status) {

            lista =
                lista.filter(
                    cotacao =>
                        cotacao.status ===
                        status
                );
        }


        /* ======================================================
           FORNECEDOR
        ====================================================== */

        if (fornecedorId) {

            lista =
                lista.filter(
                    cotacao =>
                        String(
                            cotacao.fornecedorId
                        ) ===
                        String(
                            fornecedorId
                        )
                );
        }


        /* ======================================================
           OBRA
        ====================================================== */

        if (obraId) {

            lista =
                lista.filter(
                    cotacao =>
                        String(
                            cotacao.obraId
                        ) ===
                        String(
                            obraId
                        )
                );
        }


        /* ======================================================
           DATA
        ====================================================== */

        if (data) {

            lista =
                lista.filter(
                    cotacao =>
                        cotacao.data ===
                        data
                );
        }


        /* ======================================================
           ORDENAR
        ====================================================== */

        lista.sort(
            (
                a,
                b
            ) =>
                new Date(
                    b.data ||
                    b.criadoEm
                ) -
                new Date(
                    a.data ||
                    a.criadoEm
                )
        );


        e.listaCotacoes.innerHTML =
            "";


        /* ======================================================
           VAZIO
        ====================================================== */

        if (
            !lista.length
        ) {

            if (
                e.cardTabelaCotacoes
            ) {

                e.cardTabelaCotacoes.style.display =
                    "none";
            }


            if (
                e.estadoVazioCotacoes
            ) {

                e.estadoVazioCotacoes.style.display =
                    "block";
            }

            return;
        }


        /* ======================================================
           COM DADOS
        ====================================================== */

        if (
            e.cardTabelaCotacoes
        ) {

            e.cardTabelaCotacoes.style.display =
                "block";
        }


        if (
            e.estadoVazioCotacoes
        ) {

            e.estadoVazioCotacoes.style.display =
                "none";
        }


        /* ======================================================
           LINHAS
        ====================================================== */

        lista.forEach(
            cotacao => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${this.escapeHtml(
                            cotacao.numero ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${this.formatarData(
                            cotacao.data
                        )}
                    </td>

                    <td>
                        ${this.escapeHtml(
                            cotacao.fornecedor ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${this.escapeHtml(
                            cotacao.obra ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${cotacao.itens?.length || 0}
                    </td>

                    <td>
                        ${this.criarStatus(
                            cotacao.status
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            data-editar-cotacao="${cotacao.id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            class="btn btn-danger btn-sm"
                            data-excluir-cotacao="${cotacao.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>
                `;


                const editar =
                    tr.querySelector(
                        "[data-editar-cotacao]"
                    );


                const excluir =
                    tr.querySelector(
                        "[data-excluir-cotacao]"
                    );


                if (editar) {

                    editar.addEventListener(
                        "click",
                        () =>
                            this.editarCotacao(
                                cotacao.id
                            )
                    );
                }


                if (excluir) {

                    excluir.addEventListener(
                        "click",
                        () =>
                            this.excluirCotacao(
                                cotacao.id
                            )
                    );
                }


                e.listaCotacoes.appendChild(
                    tr
                );
            }
        );
    }


    /* ==========================================================
       STATUS
    ========================================================== */

    criarStatus(
        status
    ) {

        const nomes = {

            rascunho:
                "Rascunho",

            enviada:
                "Enviada",

            respondida:
                "Respondida",

            selecionada:
                "Selecionada",

            cancelada:
                "Cancelada"
        };


        return `

            <span class="status status-${status || "rascunho"}">

                ${nomes[status] || "Rascunho"}

            </span>
        `;
    }


    /* ==========================================================
       EDITAR
    ========================================================== */

    editarCotacao(
        id
    ) {

        if (
            !this.verificarEmpresaAtiva()
        ) {

            return;
        }


        const cotacao =
            this.cotacoes.find(
                c =>
                    String(
                        c.id
                    ) ===
                    String(
                        id
                    )
            );


        if (!cotacao) {

            return;
        }


        /*
         * Segurança:
         * não permite editar cotação
         * de outra empresa.
         */

        if (
            String(
                cotacao.empresaId ||
                ""
            ) !==
            String(
                this.obterIdEmpresaAtiva()
            )
        ) {

            alert(
                "Esta cotação pertence a outra empresa e não pode ser editada."
            );

            return;
        }


        /*
         * Recarrega dados atuais.
         */

        this.carregarDados();

        this.carregarEmpresaAtiva();

        this.carregarFornecedores();

        this.carregarObras();

        this.carregarProdutos();


        this.cotacaoEditando =
            cotacao;


        const e =
            this.elementos;


        if (
            e.areaNovaCotacao
        ) {

            e.areaNovaCotacao.style.display =
                "block";
        }


        e.cotacaoNumero.value =
            cotacao.numero ||
            "";


        e.cotacaoData.value =
            cotacao.data ||
            "";


        e.cotacaoValidade.value =
            cotacao.validade ||
            "";


        e.cotacaoFornecedor.value =
            cotacao.fornecedorId ||
            "";


        e.cotacaoObra.value =
            cotacao.obraId ||
            "";


        e.cotacaoObservacao.value =
            cotacao.observacao ||
            "";


        this.itens =
            JSON.parse(
                JSON.stringify(
                    cotacao.itens ||
                    []
                )
            );


        this.atualizarFornecedorSelecionado();

        this.renderizarItens();

        this.atualizarResumo();


        e.areaNovaCotacao.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* ==========================================================
       EXCLUIR
    ========================================================== */

    excluirCotacao(
        id
    ) {

        if (
            !this.verificarEmpresaAtiva()
        ) {

            return;
        }


        const cotacao =
            this.cotacoes.find(
                c =>
                    String(
                        c.id
                    ) ===
                    String(
                        id
                    )
            );


        if (!cotacao) {

            return;
        }


        /*
         * Segurança:
         * não permite excluir cotação
         * de outra empresa.
         */

        if (
            String(
                cotacao.empresaId ||
                ""
            ) !==
            String(
                this.obterIdEmpresaAtiva()
            )
        ) {

            alert(
                "Esta cotação pertence a outra empresa e não pode ser excluída."
            );

            return;
        }


        const confirmar =
            confirm(
                `Deseja excluir a cotação ${cotacao.numero}?`
            );


        if (!confirmar) {

            return;
        }


        this.cotacoes =
            this.cotacoes.filter(
                c =>
                    String(
                        c.id
                    ) !==
                    String(
                        id
                    )
            );


        this.salvarStorage();

        this.atualizarIndicadores();

        this.renderizarHistorico();
    }


    /* ==========================================================
       UTILITÁRIOS
    ========================================================== */

    gerarId() {

        if (
            window.crypto &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();
        }


        return (

            Date.now() +

            "-" +

            Math.random()
                .toString(36)
                .substring(
                    2,
                    9
                )
        );
    }


    formatarNumero(
        valor
    ) {

        return Number(
            valor || 0
        )
            .toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }
            );
    }


    formatarData(
        data
    ) {

        if (!data) {

            return "-";
        }


        const partes =
            String(
                data
            ).split(
                "-"
            );


        if (
            partes.length !== 3
        ) {

            return data;
        }


        return (

            `${partes[2]}/` +
            `${partes[1]}/` +
            `${partes[0]}`
        );
    }


    escapeHtml(
        valor
    ) {

        return String(
            valor ?? ""
        )

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );
    }
}


/* ==========================================================
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Cotacoes =
    Cotacoes;


console.log(
    "BEQ: cotacoes.js foi carregado — ETAPA 8.8."
);