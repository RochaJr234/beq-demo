/* ==========================================================
   BEQ EMPREENDIMENTOS
   MÓDULO: RELATÓRIOS
   Arquivo:
   assets/js/modulos/relatorios/relatorios.js

   ETAPA 8.9

   Responsabilidades:
   - Gerenciar relatórios
   - Trabalhar com a estrutura atual do HTML
   - Empresa ativa
   - Produtos
   - Estoque
   - Movimentações
   - Compras
   - Cotações
   - Clientes
   - Fornecedores
   - Obras
   - Pesquisa
   - Filtros por data
   - Filtro adicional
   - Impressão
   - Exportação CSV

   IMPORTANTE:
   - beq_empresa_ativa guarda somente o ID da empresa
   - NÃO utilizar JSON.parse() nessa chave
   - Não utiliza mais a antiga estrutura de abas
========================================================== */


class Relatorios {

    constructor() {

        /* ======================================================
           LOCALSTORAGE
        ====================================================== */

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
                "beq_cotacoes",

            estoques:
                "beq_estoques",

            empresas:
                "beq_empresas",

            empresaAtiva:
                "beq_empresa_ativa"
        };


        /* ======================================================
           DADOS
        ====================================================== */

        this.dados = {

            produtos: [],
            categorias: [],
            clientes: [],
            fornecedores: [],
            obras: [],
            compras: [],
            movimentacoes: [],
            cotacoes: [],
            estoques: [],
            empresas: []
        };


        /* ======================================================
           EMPRESA ATIVA
        ====================================================== */

        this.empresaAtiva = null;


        /* ======================================================
           RELATÓRIO ATUAL
        ====================================================== */

        this.relatorioAtual = null;

        this.linhasAtuais = [];

        this.colunasAtuais = [];


        /* ======================================================
           ELEMENTOS
        ====================================================== */

        this.elementos = {};
    }


    /* ==========================================================
       INICIALIZAÇÃO
    ========================================================== */

    init() {

        console.log(
            "BEQ: módulo Relatórios inicializando..."
        );


        this.mapearElementos();

        this.carregarDados();

        this.carregarEmpresaAtiva();

        this.atualizarIndicadores();

        this.registrarEventos();


        console.log(
            "BEQ: módulo Relatórios inicializado."
        );
    }


    /* ==========================================================
       MAPEAR ELEMENTOS
    ========================================================== */

    mapearElementos() {

        this.elementos = {

            /* ----------------------------------------------
               OPÇÕES
            ---------------------------------------------- */

            opcoes:
                document.querySelectorAll(
                    ".relatorio-opcao"
                ),


            /* ----------------------------------------------
               ÁREA DO RESULTADO
            ---------------------------------------------- */

            resultado:
                document.getElementById(
                    "relatorioResultado"
                ),


            titulo:
                document.getElementById(
                    "tituloRelatorio"
                ),


            descricao:
                document.getElementById(
                    "descricaoRelatorio"
                ),


            /* ----------------------------------------------
               AÇÕES
            ---------------------------------------------- */

            btnImprimir:
                document.getElementById(
                    "btnImprimirRelatorio"
                ),


            btnExportar:
                document.getElementById(
                    "btnExportarRelatorio"
                ),


            /* ----------------------------------------------
               FILTROS
            ---------------------------------------------- */

            pesquisar:
                document.getElementById(
                    "pesquisarRelatorio"
                ),


            dataInicial:
                document.getElementById(
                    "dataInicialRelatorio"
                ),


            dataFinal:
                document.getElementById(
                    "dataFinalRelatorio"
                ),


            filtro:
                document.getElementById(
                    "filtroRelatorio"
                ),


            /* ----------------------------------------------
               TABELA
            ---------------------------------------------- */

            cabecalho:
                document.getElementById(
                    "cabecalhoRelatorio"
                ),


            lista:
                document.getElementById(
                    "listaRelatorio"
                ),


            /* ----------------------------------------------
               INDICADORES
            ---------------------------------------------- */

            totalProdutos:
                document.getElementById(
                    "relatorioTotalProdutos"
                ),


            totalClientes:
                document.getElementById(
                    "relatorioTotalClientes"
                ),


            totalObras:
                document.getElementById(
                    "relatorioTotalObras"
                ),


            totalCompras:
                document.getElementById(
                    "relatorioTotalCompras"
                )
        };
    }


    /* ==========================================================
       LEITURA SEGURA DO LOCALSTORAGE
    ========================================================== */

    lerStorage(chave) {

        try {

            const valor =
                localStorage.getItem(chave);


            if (!valor) {

                return [];
            }


            const dados =
                JSON.parse(valor);


            return Array.isArray(dados)
                ? dados
                : [];

        }
        catch (erro) {

            console.error(
                "BEQ Relatórios: erro ao ler",
                chave,
                erro
            );

            return [];
        }
    }


    /* ==========================================================
       CARREGAR DADOS
    ========================================================== */

    carregarDados() {

        this.dados.produtos =
            this.lerStorage(
                this.chaves.produtos
            );


        this.dados.categorias =
            this.lerStorage(
                this.chaves.categorias
            );


        this.dados.clientes =
            this.lerStorage(
                this.chaves.clientes
            );


        this.dados.fornecedores =
            this.lerStorage(
                this.chaves.fornecedores
            );


        this.dados.obras =
            this.lerStorage(
                this.chaves.obras
            );


        this.dados.compras =
            this.lerStorage(
                this.chaves.compras
            );


        this.dados.movimentacoes =
            this.lerStorage(
                this.chaves.movimentacoes
            );


        this.dados.cotacoes =
            this.lerStorage(
                this.chaves.cotacoes
            );


        this.dados.estoques =
            this.lerStorage(
                this.chaves.estoques
            );


        this.dados.empresas =
            this.lerStorage(
                this.chaves.empresas
            );
    }


    /* ==========================================================
       EMPRESA ATIVA

       IMPORTANTE:
       beq_empresa_ativa contém apenas o ID.
       NÃO usar JSON.parse().
    ========================================================== */

    carregarEmpresaAtiva() {

        const id =
            localStorage.getItem(
                this.chaves.empresaAtiva
            );


        if (!id) {

            this.empresaAtiva = null;

            return;
        }


        this.empresaAtiva =
            this.dados.empresas.find(
                empresa =>
                    String(
                        empresa.id
                    ) === String(id)
            ) || null;


        if (
            this.empresaAtiva
        ) {

            const status =
                String(
                    this.empresaAtiva.status ||
                    "Ativa"
                )
                .trim()
                .toLowerCase();


            const ativa =
                status === "ativa" ||
                status === "ativo";


            if (!ativa) {

                this.empresaAtiva = null;

                localStorage.removeItem(
                    this.chaves.empresaAtiva
                );
            }
        }


        console.log(
            "BEQ Relatórios: empresa ativa:",
            this.empresaAtiva
                ? (
                    this.empresaAtiva.nomeFantasia ||
                    this.empresaAtiva.razaoSocial
                )
                : "nenhuma"
        );
    }


    /* ==========================================================
       ID DA EMPRESA ATIVA
    ========================================================== */

    obterIdEmpresaAtiva() {

        return (
            this.empresaAtiva?.id ||
            ""
        );
    }


    /* ==========================================================
       NOME DA EMPRESA ATIVA
    ========================================================== */

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


    /* ==========================================================
       VERIFICAR EMPRESA
    ========================================================== */

    empresaAtivaExiste() {

        return !!this.empresaAtiva;
    }


    /* ==========================================================
       INDICADORES
    ========================================================== */

    atualizarIndicadores() {

        if (this.elementos.totalProdutos) {

            this.elementos.totalProdutos.textContent =
                this.dados.produtos.length;
        }


        if (this.elementos.totalClientes) {

            this.elementos.totalClientes.textContent =
                this.dados.clientes.length;
        }


        if (this.elementos.totalObras) {

            this.elementos.totalObras.textContent =
                this.obterObrasDaEmpresaAtiva()
                    .length;
        }


        if (this.elementos.totalCompras) {

            this.elementos.totalCompras.textContent =
                this.dados.compras.length;
        }
    }


    /* ==========================================================
       EVENTOS
    ========================================================== */

    registrarEventos() {

        /* ------------------------------------------------------
           BOTÕES DE RELATÓRIO
        ------------------------------------------------------ */

        this.elementos.opcoes.forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    evento => {

                        evento.preventDefault();

                        const tipo =
                            botao.dataset.relatorio;


                        if (!tipo) {

                            console.warn(
                                "BEQ Relatórios: botão sem data-relatorio."
                            );

                            return;
                        }


                        this.abrirRelatorio(
                            tipo
                        );
                    }
                );
            }
        );


        /* ------------------------------------------------------
           PESQUISA
        ------------------------------------------------------ */

        this.elementos.pesquisar
            ?.addEventListener(
                "input",
                () => {

                    this.aplicarFiltros();
                }
            );


        /* ------------------------------------------------------
           DATA INICIAL
        ------------------------------------------------------ */

        this.elementos.dataInicial
            ?.addEventListener(
                "change",
                () => {

                    this.aplicarFiltros();
                }
            );


        /* ------------------------------------------------------
           DATA FINAL
        ------------------------------------------------------ */

        this.elementos.dataFinal
            ?.addEventListener(
                "change",
                () => {

                    this.aplicarFiltros();
                }
            );


        /* ------------------------------------------------------
           FILTRO
        ------------------------------------------------------ */

        this.elementos.filtro
            ?.addEventListener(
                "change",
                () => {

                    this.aplicarFiltros();
                }
            );


        /* ------------------------------------------------------
           IMPRIMIR
        ------------------------------------------------------ */

        this.elementos.btnImprimir
            ?.addEventListener(
                "click",
                () => {

                    this.imprimirRelatorio();
                }
            );


        /* ------------------------------------------------------
           EXPORTAR
        ------------------------------------------------------ */

        this.elementos.btnExportar
            ?.addEventListener(
                "click",
                () => {

                    this.exportarRelatorio();
                }
            );
    }


    /* ==========================================================
       CONFIGURAÇÕES DOS RELATÓRIOS
    ========================================================== */

    obterConfiguracao(tipo) {

        const configuracoes = {

            produtos: {

                titulo:
                    "Relatório de Produtos",

                descricao:
                    "Produtos cadastrados no sistema.",

                icone:
                    "fa-solid fa-boxes-stacked"
            },


            estoque: {

                titulo:
                    "Relatório de Estoque",

                descricao:
                    "Posição atual do estoque da empresa ativa.",

                icone:
                    "fa-solid fa-warehouse"
            },


            movimentacoes: {

                titulo:
                    "Relatório de Movimentações",

                descricao:
                    "Histórico de entradas e saídas de materiais.",

                icone:
                    "fa-solid fa-right-left"
            },


            compras: {

                titulo:
                    "Relatório de Compras",

                descricao:
                    "Compras registradas no sistema.",

                icone:
                    "fa-solid fa-cart-shopping"
            },


            cotacoes: {

                titulo:
                    "Relatório de Cotações",

                descricao:
                    "Cotações registradas para fornecedores.",

                icone:
                    "fa-solid fa-file-invoice"
            },


            clientes: {

                titulo:
                    "Relatório de Clientes",

                descricao:
                    "Clientes cadastrados no sistema.",

                icone:
                    "fa-solid fa-users"
            },


            fornecedores: {

                titulo:
                    "Relatório de Fornecedores",

                descricao:
                    "Fornecedores cadastrados no sistema.",

                icone:
                    "fa-solid fa-truck-field"
            },


            obras: {

                titulo:
                    "Relatório de Obras",

                descricao:
                    "Obras vinculadas à empresa ativa.",

                icone:
                    "fa-solid fa-building"
            }
        };


        return (
            configuracoes[tipo] ||
            configuracoes.produtos
        );
    }


    /* ==========================================================
       ABRIR RELATÓRIO
    ========================================================== */

    abrirRelatorio(tipo) {

        const config =
            this.obterConfiguracao(
                tipo
            );


        console.log(
            "BEQ Relatórios: relatório aberto:",
            tipo
        );


        this.relatorioAtual =
            tipo;


        if (this.elementos.titulo) {

            this.elementos.titulo.innerHTML =
                `
                <i class="${config.icone}"></i>
                ${this.escapar(config.titulo)}
                `;
        }


        if (this.elementos.descricao) {

            this.elementos.descricao.textContent =
                config.descricao;
        }


        if (this.elementos.resultado) {

            this.elementos.resultado.hidden =
                false;
        }


        this.limparFiltros();

        this.prepararFiltro(tipo);

        this.gerarRelatorio(tipo);

        this.elementos.resultado?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* ==========================================================
       LIMPAR FILTROS
    ========================================================== */

    limparFiltros() {

        if (this.elementos.pesquisar) {

            this.elementos.pesquisar.value =
                "";
        }


        if (this.elementos.dataInicial) {

            this.elementos.dataInicial.value =
                "";
        }


        if (this.elementos.dataFinal) {

            this.elementos.dataFinal.value =
                "";
        }


        if (this.elementos.filtro) {

            this.elementos.filtro.innerHTML =
                `
                <option value="">
                    Todos
                </option>
                `;
        }
    }


    /* ==========================================================
       PREPARAR FILTRO
    ========================================================== */

    prepararFiltro(tipo) {

        const select =
            this.elementos.filtro;


        if (!select) {

            return;
        }


        let opcoes = [];


        switch (tipo) {

            case "produtos":

                opcoes =
                    [
                        ...new Set(
                            this.dados.produtos
                                .map(
                                    item =>
                                        item.categoria
                                )
                                .filter(Boolean)
                        )
                    ];

                break;


            case "estoque":

                opcoes =
                    [
                        "Com estoque",
                        "Estoque baixo",
                        "Sem estoque"
                    ];

                break;


            case "movimentacoes":

                opcoes =
                    [
                        "Entrada",
                        "Saída"
                    ];

                break;


            case "compras":

                opcoes =
                    [
                        ...new Set(
                            this.dados.compras
                                .map(
                                    item =>
                                        item.fornecedor ||
                                        item.fornecedorNome
                                )
                                .filter(Boolean)
                        )
                    ];

                break;


            case "cotacoes":

                opcoes =
                    [
                        "Pendente",
                        "Finalizada",
                        "Cancelada"
                    ];

                break;


            case "obras":

                opcoes =
                    [
                        ...new Set(
                            this.obterObrasDaEmpresaAtiva()
                                .map(
                                    item =>
                                        item.status
                                )
                                .filter(Boolean)
                        )
                    ];

                break;


            default:

                opcoes = [];

                break;
        }


        opcoes.forEach(
            opcao => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(opcao);

                option.textContent =
                    String(opcao);

                select.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================================
       GERAR RELATÓRIO
    ========================================================== */

    gerarRelatorio(tipo) {

        let configuracao =
            this.obterLinhasRelatorio(
                tipo
            );


        this.colunasAtuais =
            configuracao.colunas;


        this.linhasAtuais =
            configuracao.linhas;


        this.renderizarTabela(
            configuracao.colunas,
            configuracao.linhas
        );


        this.aplicarFiltros();
    }


    /* ==========================================================
       OBTER DADOS DO RELATÓRIO
    ========================================================== */

    obterLinhasRelatorio(tipo) {

        switch (tipo) {

            case "produtos":

                return this.relatorioProdutos();


            case "estoque":

                return this.relatorioEstoque();


            case "movimentacoes":

                return this.relatorioMovimentacoes();


            case "compras":

                return this.relatorioCompras();


            case "cotacoes":

                return this.relatorioCotacoes();


            case "clientes":

                return this.relatorioClientes();


            case "fornecedores":

                return this.relatorioFornecedores();


            case "obras":

                return this.relatorioObras();


            default:

                return {

                    colunas: [
                        "Informação"
                    ],

                    linhas: []
                };
        }
    }


    /* ==========================================================
       PRODUTOS
    ========================================================== */

    relatorioProdutos() {

        const linhas =
            this.dados.produtos.map(
                produto => {

                    return {

                        codigo:
                            produto.codigo ||
                            produto.id ||
                            "-",

                        produto:
                            produto.nome ||
                            "-",

                        categoria:
                            produto.categoria ||
                            "-",

                        marca:
                            produto.marca ||
                            "-",

                        preco:
                            this.formatarMoeda(
                                produto.preco
                            ),

                        estoque:
                            Number(
                                produto.estoque
                            ) || 0,

                        _textoFiltro:
                            [
                                produto.codigo,
                                produto.nome,
                                produto.categoria,
                                produto.marca
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _data:
                            produto.criadoEm ||
                            produto.data ||
                            ""
                    };
                }
            );


        return {

            colunas: [
                "Código",
                "Produto",
                "Categoria",
                "Marca",
                "Preço",
                "Estoque"
            ],

            linhas
        };
    }


    /* ==========================================================
       ESTOQUE
    ========================================================== */

    relatorioEstoque() {

        let registros = [];


        const empresaId =
            this.obterIdEmpresaAtiva();


        /*
         * Se existir estrutura multiempresa,
         * utiliza beq_estoques.
         */

        if (
            this.dados.estoques.length &&
            empresaId
        ) {

            registros =
                this.dados.estoques.filter(
                    item =>
                        String(
                            item.empresaId
                        ) === String(
                            empresaId
                        )
                );
        }


        /*
         * Compatibilidade com estoque antigo.
         */

        if (!registros.length) {

            registros =
                this.dados.produtos.map(
                    produto => {

                        return {

                            produtoId:
                                produto.id ||
                                produto.codigo ||
                                produto.nome,

                            produto:
                                produto.nome ||
                                "-",

                            codigo:
                                produto.codigo ||
                                "-",

                            quantidade:
                                Number(
                                    produto.estoque
                                ) || 0,

                            estoqueMinimo:
                                Number(
                                    produto.estoqueMinimo
                                ) || 0,

                            unidade:
                                produto.unidade ||
                                "UN",

                            categoria:
                                produto.categoria ||
                                "-",

                            marca:
                                produto.marca ||
                                "-"
                        };
                    }
                );
        }


        const linhas =
            registros.map(
                item => {

                    const quantidade =
                        Number(
                            item.quantidade
                        ) || 0;


                    const minimo =
                        Number(
                            item.estoqueMinimo
                        ) || 0;


                    let status =
                        "Com estoque";


                    if (
                        quantidade <= 0
                    ) {

                        status =
                            "Sem estoque";
                    }
                    else if (
                        minimo > 0 &&
                        quantidade <= minimo
                    ) {

                        status =
                            "Estoque baixo";
                    }


                    return {

                        codigo:
                            item.codigo ||
                            "-",

                        produto:
                            item.produto ||
                            "-",

                        categoria:
                            item.categoria ||
                            "-",

                        quantidade,

                        unidade:
                            item.unidade ||
                            "UN",

                        minimo,

                        status,

                        _textoFiltro:
                            [
                                item.codigo,
                                item.produto,
                                item.categoria,
                                status
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _filtro:
                            status
                    };
                }
            );


        return {

            colunas: [
                "Código",
                "Produto",
                "Categoria",
                "Quantidade",
                "Unidade",
                "Mínimo",
                "Status"
            ],

            linhas
        };
    }


    /* ==========================================================
       MOVIMENTAÇÕES
    ========================================================== */

    relatorioMovimentacoes() {

        const empresaId =
            this.obterIdEmpresaAtiva();


        let dados =
            this.dados.movimentacoes;


        if (empresaId) {

            const possuemEmpresa =
                dados.some(
                    item =>
                        item.empresaId
                );


            if (possuemEmpresa) {

                dados =
                    dados.filter(
                        item =>
                            String(
                                item.empresaId
                            ) === String(
                                empresaId
                            )
                    );
            }
        }


        const linhas =
            dados.map(
                movimento => {

                    const tipo =
                        String(
                            movimento.tipo ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    const tipoTexto =
                        tipo === "entrada"
                            ? "Entrada"
                            : "Saída";


                    return {

                        data:
                            this.formatarData(
                                movimento.data ||
                                movimento.createdAt
                            ),

                        produto:
                            movimento.produto ||
                            "-",

                        tipo:
                            tipoTexto,

                        quantidade:
                            Number(
                                movimento.quantidade
                            ) || 0,

                        destino:
                            movimento.obra ||
                            movimento.destino ||
                            "Estoque Geral",

                        observacao:
                            movimento.observacao ||
                            "-",

                        _textoFiltro:
                            [
                                movimento.produto,
                                tipoTexto,
                                movimento.obra,
                                movimento.destino,
                                movimento.observacao
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _filtro:
                            tipoTexto,

                        _data:
                            movimento.data ||
                            movimento.createdAt ||
                            ""
                    };
                }
            );


        return {

            colunas: [
                "Data",
                "Produto",
                "Tipo",
                "Quantidade",
                "Destino",
                "Observação"
            ],

            linhas
        };
    }


    /* ==========================================================
       COMPRAS
    ========================================================== */

    relatorioCompras() {

        const linhas =
            this.dados.compras.map(
                compra => {

                    const itens =
                        Array.isArray(
                            compra.itens
                        )
                            ? compra.itens.length
                            : Number(
                                compra.quantidadeItens
                            ) || 0;


                    const fornecedor =
                        compra.fornecedor ||
                        compra.fornecedorNome ||
                        "-";


                    return {

                        numero:
                            compra.numero ||
                            compra.codigo ||
                            compra.id ||
                            "-",

                        data:
                            this.formatarData(
                                compra.data ||
                                compra.createdAt
                            ),

                        fornecedor,

                        itens,

                        total:
                            this.formatarMoeda(
                                compra.total
                            ),

                        _textoFiltro:
                            [
                                compra.numero,
                                compra.codigo,
                                fornecedor,
                                compra.nota,
                                compra.observacao
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _filtro:
                            fornecedor,

                        _data:
                            compra.data ||
                            compra.createdAt ||
                            ""
                    };
                }
            );


        return {

            colunas: [
                "Número",
                "Data",
                "Fornecedor",
                "Itens",
                "Total"
            ],

            linhas
        };
    }


    /* ==========================================================
       COTAÇÕES
    ========================================================== */

    relatorioCotacoes() {

        const empresaId =
            this.obterIdEmpresaAtiva();


        let dados =
            this.dados.cotacoes;


        if (empresaId) {

            const possuemEmpresa =
                dados.some(
                    item =>
                        item.empresaId
                );


            if (possuemEmpresa) {

                dados =
                    dados.filter(
                        item =>
                            String(
                                item.empresaId
                            ) === String(
                                empresaId
                            )
                    );
            }
        }


        const linhas =
            dados.map(
                cotacao => {

                    const status =
                        cotacao.status ||
                        "Pendente";


                    return {

                        numero:
                            cotacao.numero ||
                            cotacao.codigo ||
                            cotacao.id ||
                            "-",

                        data:
                            this.formatarData(
                                cotacao.data ||
                                cotacao.createdAt
                            ),

                        fornecedor:
                            cotacao.fornecedor ||
                            cotacao.fornecedorNome ||
                            "-",

                        obra:
                            cotacao.obra ||
                            cotacao.obraNome ||
                            "-",

                        status,

                        _textoFiltro:
                            [
                                cotacao.numero,
                                cotacao.codigo,
                                cotacao.fornecedor,
                                cotacao.fornecedorNome,
                                cotacao.obra,
                                cotacao.obraNome,
                                status
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _filtro:
                            status,

                        _data:
                            cotacao.data ||
                            cotacao.createdAt ||
                            ""
                    };
                }
            );


        return {

            colunas: [
                "Número",
                "Data",
                "Fornecedor",
                "Obra",
                "Status"
            ],

            linhas
        };
    }


    /* ==========================================================
       CLIENTES
    ========================================================== */

    relatorioClientes() {

        const linhas =
            this.dados.clientes.map(
                cliente => {

                    const nome =
                        cliente.nome ||
                        cliente.razao ||
                        cliente.razaoSocial ||
                        "-";


                    return {

                        nome,

                        documento:
                            cliente.cpf ||
                            cliente.cnpj ||
                            "-",

                        telefone:
                            cliente.telefone ||
                            cliente.whatsapp ||
                            "-",

                        cidade:
                            cliente.cidade ||
                            "-",

                        status:
                            cliente.status ||
                            "Ativo",

                        _textoFiltro:
                            [
                                nome,
                                cliente.cpf,
                                cliente.cnpj,
                                cliente.telefone,
                                cliente.cidade
                            ]
                            .join(" ")
                            .toLowerCase()
                    };
                }
            );


        return {

            colunas: [
                "Nome",
                "CPF/CNPJ",
                "Telefone",
                "Cidade",
                "Status"
            ],

            linhas
        };
    }


    /* ==========================================================
       FORNECEDORES
    ========================================================== */

    relatorioFornecedores() {

        const linhas =
            this.dados.fornecedores.map(
                fornecedor => {

                    const razao =
                        fornecedor.razaoSocial ||
                        fornecedor.razao ||
                        fornecedor.nome ||
                        "-";


                    const fantasia =
                        fornecedor.nomeFantasia ||
                        fornecedor.fantasia ||
                        "-";


                    return {

                        razao,

                        fantasia,

                        cnpj:
                            fornecedor.cnpj ||
                            "-",

                        telefone:
                            fornecedor.telefone ||
                            fornecedor.whatsapp ||
                            "-",

                        cidade:
                            fornecedor.cidade ||
                            "-",

                        status:
                            fornecedor.status ||
                            "Ativo",

                        _textoFiltro:
                            [
                                razao,
                                fantasia,
                                fornecedor.cnpj,
                                fornecedor.telefone,
                                fornecedor.cidade
                            ]
                            .join(" ")
                            .toLowerCase()
                    };
                }
            );


        return {

            colunas: [
                "Razão Social",
                "Fantasia",
                "CNPJ",
                "Telefone",
                "Cidade",
                "Status"
            ],

            linhas
        };
    }


    /* ==========================================================
       OBRAS DA EMPRESA ATIVA
    ========================================================== */

    obterObrasDaEmpresaAtiva() {

        const empresaId =
            this.obterIdEmpresaAtiva();


        if (!empresaId) {

            return [];
        }


        const obras =
            this.dados.obras;


        const possuemEmpresa =
            obras.some(
                obra =>
                    obra.empresaId
            );


        if (!possuemEmpresa) {

            return obras;
        }


        return obras.filter(
            obra =>
                String(
                    obra.empresaId
                ) === String(
                    empresaId
                )
        );
    }


    /* ==========================================================
       OBRAS
    ========================================================== */

    relatorioObras() {

        const dados =
            this.obterObrasDaEmpresaAtiva();


        const linhas =
            dados.map(
                obra => {

                    const nome =
                        obra.nome ||
                        obra.obra ||
                        "-";


                    return {

                        codigo:
                            obra.codigo ||
                            obra.id ||
                            "-",

                        obra:
                            nome,

                        cliente:
                            obra.cliente ||
                            obra.clienteNome ||
                            "-",

                        responsavel:
                            obra.responsavel ||
                            "-",

                        inicio:
                            this.formatarData(
                                obra.dataInicio ||
                                obra.inicio
                            ),

                        status:
                            obra.status ||
                            "Ativa",

                        _textoFiltro:
                            [
                                obra.codigo,
                                nome,
                                obra.cliente,
                                obra.clienteNome,
                                obra.responsavel,
                                obra.status
                            ]
                            .join(" ")
                            .toLowerCase(),

                        _filtro:
                            obra.status,

                        _data:
                            obra.dataInicio ||
                            obra.inicio ||
                            ""
                    };
                }
            );


        return {

            colunas: [
                "Código",
                "Obra",
                "Cliente",
                "Responsável",
                "Início",
                "Status"
            ],

            linhas
        };
    }


    /* ==========================================================
       RENDERIZAR TABELA
    ========================================================== */

    renderizarTabela(
        colunas,
        linhas
    ) {

        if (
            !this.elementos.cabecalho ||
            !this.elementos.lista
        ) {

            console.error(
                "BEQ Relatórios: elementos da tabela não encontrados."
            );

            return;
        }


        /* ------------------------------------------------------
           CABEÇALHO
        ------------------------------------------------------ */

        this.elementos.cabecalho.innerHTML =
            `
            <tr>
                ${colunas
                    .map(
                        coluna =>
                            `
                            <th>
                                ${this.escapar(
                                    coluna
                                )}
                            </th>
                            `
                    )
                    .join("")
                }
            </tr>
            `;


        /* ------------------------------------------------------
           CORPO
        ------------------------------------------------------ */

        if (!linhas.length) {

            this.elementos.lista.innerHTML =
                `
                <tr>
                    <td
                        colspan="${colunas.length}"
                        class="relatorio-sem-dados"
                    >
                        <div class="relatorio-estado-vazio">
                            <i class="fa-solid fa-chart-column"></i>

                            <h3>
                                Nenhum dado encontrado
                            </h3>

                            <p>
                                Não existem registros disponíveis para este relatório.
                            </p>
                        </div>
                    </td>
                </tr>
                `;

            return;
        }


        this.elementos.lista.innerHTML =
            linhas
                .map(
                    linha => {

                        return `
                        <tr
                            data-texto="${this.escapar(
                                linha._textoFiltro ||
                                ""
                            )}"
                            data-filtro="${this.escapar(
                                linha._filtro ||
                                ""
                            )}"
                            data-data="${this.escapar(
                                linha._data ||
                                ""
                            )}"
                        >

                            ${colunas
                                .map(
                                    coluna => {

                                        const chave =
                                            this.converterColunaParaChave(
                                                coluna
                                            );


                                        return `
                                        <td>
                                            ${this.escapar(
                                                linha[chave] ??
                                                "-"
                                            )}
                                        </td>
                                        `;
                                    }
                                )
                                .join("")
                            }

                        </tr>
                        `;
                    }
                )
                .join("");
    }


    /* ==========================================================
       CONVERTER COLUNA PARA CHAVE
    ========================================================== */

    converterColunaParaChave(
        coluna
    ) {

        const mapa = {

            "Código":
                "codigo",

            "Produto":
                "produto",

            "Categoria":
                "categoria",

            "Marca":
                "marca",

            "Preço":
                "preco",

            "Estoque":
                "estoque",

            "Quantidade":
                "quantidade",

            "Unidade":
                "unidade",

            "Mínimo":
                "minimo",

            "Status":
                "status",

            "Data":
                "data",

            "Destino":
                "destino",

            "Observação":
                "observacao",

            "Número":
                "numero",

            "Fornecedor":
                "fornecedor",

            "Itens":
                "itens",

            "Total":
                "total",

            "Obra":
                "obra",

            "Nome":
                "nome",

            "CPF/CNPJ":
                "documento",

            "Telefone":
                "telefone",

            "Cidade":
                "cidade",

            "Razão Social":
                "razao",

            "Fantasia":
                "fantasia",

            "CNPJ":
                "cnpj",

            "Responsável":
                "responsavel",

            "Início":
                "inicio"
        };


        return (
            mapa[coluna] ||
            coluna
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+(.)/g,
                    (
                        _,
                        letra
                    ) =>
                        letra
                            .toUpperCase()
                )
        );
    }


    /* ==========================================================
       APLICAR FILTROS
    ========================================================== */

    aplicarFiltros() {

        if (
            !this.elementos.lista
        ) {

            return;
        }


        const termo =
            (
                this.elementos.pesquisar
                    ?.value ||
                ""
            )
            .trim()
            .toLowerCase();


        const dataInicial =
            this.elementos.dataInicial
                ?.value ||
            "";


        const dataFinal =
            this.elementos.dataFinal
                ?.value ||
            "";


        const filtro =
            this.elementos.filtro
                ?.value ||
            "";


        const linhas =
            this.elementos.lista
                .querySelectorAll(
                    "tr"
                );


        linhas.forEach(
            linha => {

                const texto =
                    String(
                        linha.dataset.texto ||
                        linha.textContent ||
                        ""
                    )
                    .toLowerCase();


                const filtroLinha =
                    String(
                        linha.dataset.filtro ||
                        ""
                    );


                const dataLinha =
                    String(
                        linha.dataset.data ||
                        ""
                    );


                let mostrar =
                    true;


                /* ------------------------------------------------
                   PESQUISA
                ------------------------------------------------ */

                if (
                    termo &&
                    !texto.includes(
                        termo
                    )
                ) {

                    mostrar = false;
                }


                /* ------------------------------------------------
                   FILTRO
                ------------------------------------------------ */

                if (
                    mostrar &&
                    filtro &&
                    filtroLinha !== filtro
                ) {

                    mostrar = false;
                }


                /* ------------------------------------------------
                   DATA INICIAL / FINAL
                ------------------------------------------------ */

                if (
                    mostrar &&
                    (
                        dataInicial ||
                        dataFinal
                    ) &&
                    dataLinha
                ) {

                    const dataNormalizada =
                        this.normalizarDataParaFiltro(
                            dataLinha
                        );


                    if (
                        dataInicial &&
                        dataNormalizada <
                        dataInicial
                    ) {

                        mostrar = false;
                    }


                    if (
                        dataFinal &&
                        dataNormalizada >
                        dataFinal
                    ) {

                        mostrar = false;
                    }
                }


                linha.style.display =
                    mostrar
                        ? ""
                        : "none";
            }
        );
    }


    /* ==========================================================
       NORMALIZAR DATA PARA FILTRO
    ========================================================== */

    normalizarDataParaFiltro(
        valor
    ) {

        if (!valor) {

            return "";
        }


        const texto =
            String(valor);


        /*
         * ISO
         * 2026-09-15
         */

        if (
            /^\d{4}-\d{2}-\d{2}/
                .test(texto)
        ) {

            return texto.substring(
                0,
                10
            );
        }


        /*
         * DD/MM/YYYY
         */

        const partes =
            texto.split("/");


        if (
            partes.length === 3 &&
            partes[2].length === 4
        ) {

            return (
                partes[2] +
                "-" +
                partes[1].padStart(
                    2,
                    "0"
                ) +
                "-" +
                partes[0].padStart(
                    2,
                    "0"
                )
            );
        }


        return "";
    }


    /* ==========================================================
       IMPRIMIR
    ========================================================== */

    imprimirRelatorio() {

        if (
            !this.relatorioAtual
        ) {

            alert(
                "Selecione um relatório antes de imprimir."
            );

            return;
        }


        const config =
            this.obterConfiguracao(
                this.relatorioAtual
            );


        const tabela =
            document.querySelector(
                ".relatorio-tabela"
            );


        if (!tabela) {

            alert(
                "Não existem dados para imprimir."
            );

            return;
        }


        const empresa =
            this.obterNomeEmpresaAtiva();


        const janela =
            window.open(
                "",
                "_blank"
            );


        if (!janela) {

            alert(
                "O navegador bloqueou a janela de impressão."
            );

            return;
        }


        janela.document.write(
            `
            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>

                <meta charset="UTF-8">

                <title>
                    ${this.escapar(
                        config.titulo
                    )}
                </title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        margin: 30px;

                        color: #111827;
                    }

                    .cabecalho {
                        border-bottom:
                            2px solid #111827;

                        padding-bottom:
                            15px;

                        margin-bottom:
                            20px;
                    }

                    h1 {
                        margin:
                            0 0 8px 0;

                        font-size:
                            24px;
                    }

                    p {
                        margin:
                            4px 0;

                        color:
                            #4b5563;
                    }

                    table {
                        width: 100%;

                        border-collapse:
                            collapse;

                        margin-top:
                            20px;
                    }

                    th,
                    td {
                        border:
                            1px solid #d1d5db;

                        padding:
                            8px;

                        font-size:
                            12px;

                        text-align:
                            left;
                    }

                    th {
                        background:
                            #f3f4f6;

                        font-weight:
                            700;
                    }

                    @media print {

                        body {
                            margin:
                                10mm;
                        }

                        table {
                            page-break-inside:
                                auto;
                        }

                        tr {
                            page-break-inside:
                                avoid;
                        }

                    }

                </style>

            </head>

            <body>

                <div class="cabecalho">

                    <h1>
                        ${this.escapar(
                            config.titulo
                        )}
                    </h1>

                    <p>
                        BEQ Empreendimentos
                    </p>

                    ${
                        empresa
                            ? `
                            <p>
                                Empresa:
                                ${this.escapar(
                                    empresa
                                )}
                            </p>
                            `
                            : ""
                    }

                    <p>
                        Emitido em:
                        ${new Date()
                            .toLocaleString(
                                "pt-BR"
                            )}
                    </p>

                </div>

                ${tabela.outerHTML}

            </body>

            </html>
            `
        );


        janela.document.close();

        janela.focus();


        setTimeout(
            () => {

                janela.print();

            },
            300
        );
    }


    /* ==========================================================
       EXPORTAR CSV
    ========================================================== */

    exportarRelatorio() {

        if (
            !this.relatorioAtual
        ) {

            alert(
                "Selecione um relatório antes de exportar."
            );

            return;
        }


        if (
            !this.linhasAtuais.length
        ) {

            alert(
                "Não existem dados para exportar."
            );

            return;
        }


        const linhasVisiveis =
            [];


        const linhasDOM =
            this.elementos.lista
                ?.querySelectorAll(
                    "tr"
                ) || [];


        linhasDOM.forEach(
            (
                linha,
                indice
            ) => {

                if (
                    linha.style.display ===
                    "none"
                ) {

                    return;
                }


                if (
                    this.linhasAtuais[indice]
                ) {

                    linhasVisiveis.push(
                        this.linhasAtuais[
                            indice
                        ]
                    );
                }
            }
        );


        const dadosExportacao =
            linhasVisiveis.length
                ? linhasVisiveis
                : this.linhasAtuais;


        const linhasCSV = [];


        linhasCSV.push(
            this.colunasAtuais
                .map(
                    coluna =>
                        this.csvValor(
                            coluna
                        )
                )
                .join(";")
        );


        dadosExportacao.forEach(
            linha => {

                linhasCSV.push(

                    this.colunasAtuais
                        .map(
                            coluna => {

                                const chave =
                                    this.converterColunaParaChave(
                                        coluna
                                    );


                                return this.csvValor(
                                    linha[chave] ??
                                    ""
                                );
                            }
                        )
                        .join(";")
                );
            }
        );


        const csv =
            "\uFEFF" +
            linhasCSV.join(
                "\n"
            );


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            this.gerarNomeArquivo();


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );
    }


    /* ==========================================================
       VALOR CSV
    ========================================================== */

    csvValor(valor) {

        const texto =
            String(
                valor ?? ""
            )
            .replace(
                /"/g,
                '""'
            );


        return `"${texto}"`;
    }


    /* ==========================================================
       NOME DO ARQUIVO
    ========================================================== */

    gerarNomeArquivo() {

        const config =
            this.obterConfiguracao(
                this.relatorioAtual
            );


        const nome =
            config.titulo
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .replace(
                    /[^a-zA-Z0-9]+/g,
                    "_"
                )
                .replace(
                    /^_+|_+$/g,
                    ""
                )
                .toLowerCase();


        const data =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        return (
            `${nome}_${data}.csv`
        );
    }


    /* ==========================================================
       FORMATAR MOEDA
    ========================================================== */

    formatarMoeda(
        valor
    ) {

        return Number(
            valor || 0
        ).toLocaleString(
            "pt-BR",
            {
                style:
                    "currency",

                currency:
                    "BRL"
            }
        );
    }


    /* ==========================================================
       FORMATAR DATA
    ========================================================== */

    formatarData(
        valor
    ) {

        if (!valor) {

            return "-";
        }


        const texto =
            String(valor);


        /*
         * YYYY-MM-DD
         */

        if (
            /^\d{4}-\d{2}-\d{2}$/
                .test(texto)
        ) {

            const partes =
                texto.split("-");


            return (
                partes[2] +
                "/" +
                partes[1] +
                "/" +
                partes[0]
            );
        }


        const data =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return texto;
        }


        return data.toLocaleDateString(
            "pt-BR"
        );
    }


    /* ==========================================================
       ESCAPAR HTML
    ========================================================== */

    escapar(
        valor
    ) {

        return String(
            valor ?? ""
        )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
    }
}


/* ==========================================================
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Relatorios =
    Relatorios;


console.log(
    "BEQ: relatorios.js foi carregado."
);