/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo: Painel Central
   Arquivo: dashboard.js

   V2 - DASHBOARD GERENCIAL

   Regras:
   - Produtos são compartilhados entre empresas.
   - Categorias são compartilhadas entre empresas.
   - Estoque pertence à empresa.
   - Movimentações pertencem à empresa.
   - NÃO utilizar produto.estoque.
   - Não calcular valor financeiro do estoque.
========================================================== */


class Dashboard {

    /* ======================================================
       CONSTRUTOR
    ====================================================== */

    constructor() {

        /* --------------------------------------------------
           LOCALSTORAGE
        -------------------------------------------------- */

        this.storageProdutos =
            "beq_produtos";

        this.storageCategorias =
            "beq_categorias";

        this.storageClientes =
            "beq_clientes";

        this.storageFornecedores =
            "beq_fornecedores";

        this.storageObras =
            "beq_obras";

        this.storageEstoques =
            "beq_estoques";

        this.storageEmpresas =
            "beq_empresas";

        this.storageEmpresaAtiva =
            "beq_empresa_ativa";

        this.storageMovimentacoes =
            "beq_movimentacoes_estoque";


        /* --------------------------------------------------
           DADOS
        -------------------------------------------------- */

        this.produtos = [];

        this.categorias = [];

        this.clientes = [];

        this.fornecedores = [];

        this.obras = [];

        this.estoques = [];

        this.empresas = [];

        this.movimentacoes = [];

        this.empresaAtiva = null;

        this.empresaIdAtiva = "";
    }


    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

 init() {

    console.log(
        "Inicializando Painel Central V2..."
    );

    this.carregarDados();

    this.atualizarData();

    this.atualizarIndicadores();

    this.atualizarEstoqueBaixo();

    this.atualizarMovimentacoes();

    this.atualizarGraficoMovimentacoes();

    this.configurarAcoesRapidas();

    console.log(
        "Painel Central V2 atualizado."
    );
}


    /* ======================================================
       CARREGAR DADOS
    ====================================================== */

    carregarDados() {

        this.produtos =
            this.lerStorage(
                this.storageProdutos
            );


        this.categorias =
            this.lerStorage(
                this.storageCategorias
            );


        this.clientes =
            this.lerStorage(
                this.storageClientes
            );


        this.fornecedores =
            this.lerStorage(
                this.storageFornecedores
            );


        this.obras =
            this.lerStorage(
                this.storageObras
            );


        this.estoques =
            this.lerStorage(
                this.storageEstoques
            );


        this.empresas =
            this.lerStorage(
                this.storageEmpresas
            );


        this.movimentacoes =
            this.lerStorage(
                this.storageMovimentacoes
            );


        /* --------------------------------------------------
           EMPRESA ATIVA
        -------------------------------------------------- */

        this.empresaIdAtiva =
            this.obterEmpresaIdAtiva();


        if (
            this.empresaIdAtiva
        ) {

            this.empresaAtiva =
                this.empresas.find(
                    empresa =>
                        String(
                            empresa.id
                        ) ===
                        String(
                            this.empresaIdAtiva
                        )
                ) || null;

        } else {

            this.empresaAtiva = null;
        }


        console.log(
            "Dados carregados:",
            {
                produtos:
                    this.produtos.length,

                categorias:
                    this.categorias.length,

                clientes:
                    this.clientes.length,

                fornecedores:
                    this.fornecedores.length,

                obras:
                    this.obras.length,

                estoques:
                    this.estoques.length,

                movimentacoes:
                    this.movimentacoes.length,

                empresa:
                    this.obterNomeEmpresaAtiva()
            }
        );
    }


    /* ======================================================
       LEITURA SEGURA DO LOCALSTORAGE
    ====================================================== */

    lerStorage(chave) {

        try {

            const dados =
                localStorage.getItem(
                    chave
                );


            if (!dados) {

                return [];
            }


            const convertido =
                JSON.parse(
                    dados
                );


            if (
                Array.isArray(
                    convertido
                )
            ) {

                return convertido;
            }


            return [];

        } catch (erro) {

            console.error(
                "Erro ao ler LocalStorage:",
                chave,
                erro
            );

            return [];
        }
    }


    /* ======================================================
       EMPRESA ATIVA
    ====================================================== */

    obterEmpresaIdAtiva() {

        const id =
            localStorage.getItem(
                this.storageEmpresaAtiva
            );


        if (!id) {

            return "";
        }


        return String(id);
    }


    obterNomeEmpresaAtiva() {

        const empresaId =
            this.obterEmpresaIdAtiva();


        if (!empresaId) {

            return "";
        }


        const empresa =
            this.empresas.find(
                item =>
                    String(
                        item.id
                    ) ===
                    String(
                        empresaId
                    )
            );


        if (!empresa) {

            return "";
        }


        return (

            empresa.nomeFantasia ||

            empresa.razaoSocial ||

            empresa.razao ||

            empresa.nome ||

            ""
        );
    }


    /* ======================================================
       ID DO PRODUTO
    ====================================================== */

    obterIdProduto(produto) {

        if (!produto) {

            return "";
        }


        return String(

            produto.id ||

            produto.codigo ||

            produto.nome ||

            ""
        );
    }


    /* ======================================================
       ESTOQUE DO PRODUTO
       
       FONTE OFICIAL:
       beq_estoques

       Nunca usa produto.estoque.
    ====================================================== */

    obterEstoqueProduto(produto) {

        const empresaId =
            this.obterEmpresaIdAtiva();


        const produtoId =
            this.obterIdProduto(
                produto
            );


        if (
            !empresaId ||
            !produtoId
        ) {

            return 0;
        }


        const registro =
            this.estoques.find(
                estoque => {

                    return (

                        String(
                            estoque.empresaId
                        ) ===
                        String(
                            empresaId
                        )

                        &&

                        String(
                            estoque.produtoId
                        ) ===
                        String(
                            produtoId
                        )

                    );
                }
            );


        if (!registro) {

            return 0;
        }


        return Number(
            registro.quantidade
        ) || 0;
    }


    /* ======================================================
       ESTOQUE MÍNIMO
    ====================================================== */

    obterEstoqueMinimo(produto) {

        const empresaId =
            this.obterEmpresaIdAtiva();


        const produtoId =
            this.obterIdProduto(
                produto
            );


        /* --------------------------------------------------
           PRIMEIRO:
           configuração específica da empresa
        -------------------------------------------------- */

        if (
            empresaId &&
            produtoId
        ) {

            const registro =
                this.estoques.find(
                    estoque => {

                        return (

                            String(
                                estoque.empresaId
                            ) ===
                            String(
                                empresaId
                            )

                            &&

                            String(
                                estoque.produtoId
                            ) ===
                            String(
                                produtoId
                            )

                        );
                    }
                );


            if (
                registro &&
                registro.estoqueMinimo !==
                undefined
            ) {

                const minimoEmpresa =
                    Number(
                        registro.estoqueMinimo
                    );


                if (
                    Number.isFinite(
                        minimoEmpresa
                    )
                ) {

                    return minimoEmpresa;
                }
            }
        }


        /* --------------------------------------------------
           SEGUNDO:
           mínimo cadastrado no produto
        -------------------------------------------------- */

        const minimoProduto =
            Number(
                produto &&
                produto.estoqueMinimo
            );


        if (
            Number.isFinite(
                minimoProduto
            )
        ) {

            return minimoProduto;
        }


        return 0;
    }


    /* ======================================================
       INDICADORES
    ====================================================== */

    atualizarIndicadores() {

        this.definirValor(
            [
                "total-produtos",
                "totalProdutos"
            ],
            this.produtos.length
        );


        this.definirValor(
            [
                "total-categorias",
                "totalCategorias"
            ],
            this.categorias.length
        );


        this.definirValor(
            [
                "total-fornecedores",
                "totalFornecedores"
            ],
            this.fornecedores.length
        );


        /* --------------------------------------------------
           OBRAS DA EMPRESA ATIVA
        -------------------------------------------------- */

        const empresaId =
            this.obterEmpresaIdAtiva();


        let obrasEmpresa =
            this.obras;


        if (empresaId) {

            obrasEmpresa =
                this.obras.filter(
                    obra => {

                        if (
                            obra.empresaId ===
                            undefined
                        ) {

                            return true;
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
        }


        this.definirValor(
            [
                "total-obras",
                "totalObras"
            ],
            obrasEmpresa.length
        );
    }


    /* ======================================================
       DATA ATUAL
    ====================================================== */

    atualizarData() {

        const elemento =
            document.getElementById(
                "dashboardData"
            );


        if (!elemento) {

            return;
        }


        const hoje =
            new Date();


        const data =
            hoje.toLocaleDateString(
                "pt-BR"
            );


        elemento.textContent =
            data;
    }


    /* ======================================================
       PRODUTOS COM ESTOQUE BAIXO
    ====================================================== */

    atualizarEstoqueBaixo() {

        const container =
            document.getElementById(
                "dashboardEstoqueBaixo"
            );


        if (!container) {

            return;
        }


        const produtosBaixos = [];


        this.produtos.forEach(
            produto => {

                const estoque =
                    this.obterEstoqueProduto(
                        produto
                    );


                const minimo =
                    this.obterEstoqueMinimo(
                        produto
                    );


                /*
                 * Só considera estoque baixo
                 * quando existe um estoque mínimo
                 * configurado.
                 */

                if (
                    minimo > 0 &&
                    estoque <= minimo
                ) {

                    produtosBaixos.push({

                        produto:
                            produto,

                        estoque:
                            estoque,

                        minimo:
                            minimo
                    });
                }
            }
        );


        /* --------------------------------------------------
           ORDENAR:
           menor estoque primeiro
        -------------------------------------------------- */

        produtosBaixos.sort(
            (
                a,
                b
            ) => {

                return (
                    a.estoque -
                    b.estoque
                );
            }
        );


        /* --------------------------------------------------
           MOSTRAR SOMENTE OS 5 PRIMEIROS
        -------------------------------------------------- */

        const lista =
            produtosBaixos.slice(
                0,
                5
            );


        if (
            lista.length === 0
        ) {

            container.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="empty-table"
                    >
                        Nenhum produto com estoque baixo.
                    </td>

                </tr>

            `;

            return;
        }


        container.innerHTML =
            lista
                .map(
                    item => {

                        const produto =
                            item.produto;


                        return `

                            <tr>

                                <td>
                                    ${this.escaparHTML(
                                        produto.nome ||
                                        "Produto"
                                    )}
                                </td>

                                <td>
                                    ${this.formatarQuantidade(
                                        item.estoque
                                    )}
                                </td>

                                <td>
                                    ${this.formatarQuantidade(
                                        item.minimo
                                    )}
                                </td>

                            </tr>

                        `;
                    }
                )
                .join("");
    }


    /* ======================================================
       ÚLTIMAS MOVIMENTAÇÕES
    ====================================================== */

    atualizarMovimentacoes() {

        const container =
            document.getElementById(
                "dashboardMovimentos"
            );


        if (!container) {

            return;
        }


        const empresaId =
            this.obterEmpresaIdAtiva();


        let movimentos =
            [...this.movimentacoes];


        /* --------------------------------------------------
           FILTRAR EMPRESA ATIVA
        -------------------------------------------------- */

        if (empresaId) {

            movimentos =
                movimentos.filter(
                    movimento => {

                        return (
                            String(
                                movimento.empresaId
                            ) ===
                            String(
                                empresaId
                            )
                        );
                    }
                );
        }


        /* --------------------------------------------------
           ORDENAR DO MAIS RECENTE
        -------------------------------------------------- */

        movimentos.sort(
            (
                a,
                b
            ) => {

                return (
                    this.obterTimestamp(
                        b
                    ) -
                    this.obterTimestamp(
                        a
                    )
                );
            }
        );


        /* --------------------------------------------------
           PEGAR 5 ÚLTIMAS
        -------------------------------------------------- */

        const lista =
            movimentos.slice(
                0,
                5
            );


        if (
            lista.length === 0
        ) {

            container.innerHTML = `

                <tr>

                    <td
                        colspan="3"
                        class="empty-table"
                    >
                        Nenhuma movimentação registrada.
                    </td>

                </tr>

            `;

            return;
        }


        container.innerHTML =
            lista
                .map(
                    movimento => {

                        const data =
                            this.formatarDataMovimento(
                                movimento
                            );


                        const modulo =
                            this.obterTipoMovimento(
                                movimento
                            );


                        const descricao =
                            this.obterDescricaoMovimento(
                                movimento
                            );


                        return `

                            <tr>

                                <td>
                                    ${data}
                                </td>

                                <td>
                                    ${this.escaparHTML(
                                        modulo
                                    )}
                                </td>

                                <td>
                                    ${this.escaparHTML(
                                        descricao
                                    )}
                                </td>

                            </tr>

                        `;
                    }
                )
                .join("");
    }


    /* ======================================================
       GRÁFICO - ÚLTIMOS 7 DIAS
    ====================================================== */

    atualizarGraficoMovimentacoes() {

        const container =
            document.getElementById(
                "dashboardGraficoMovimentos"
            );


        if (!container) {

            return;
        }


        const empresaId =
            this.obterEmpresaIdAtiva();


        let movimentos =
            [...this.movimentacoes];


        if (empresaId) {

            movimentos =
                movimentos.filter(
                    movimento => {

                        return (
                            String(
                                movimento.empresaId
                            ) ===
                            String(
                                empresaId
                            )
                        );
                    }
                );
        }


        /* --------------------------------------------------
           CRIAR OS ÚLTIMOS 7 DIAS
        -------------------------------------------------- */

        const dias = [];


        for (
            let i = 6;
            i >= 0;
            i--
        ) {

            const data =
                new Date();


            data.setHours(
                0,
                0,
                0,
                0
            );


            data.setDate(
                data.getDate() - i
            );


            dias.push({
                data: data,
                entradas: 0,
                saidas: 0
            });
        }


        /* --------------------------------------------------
           SOMAR MOVIMENTAÇÕES
        -------------------------------------------------- */

        movimentos.forEach(
            movimento => {

                const dataMovimento =
                    this.obterDataMovimento(
                        movimento
                    );


                if (!dataMovimento) {

                    return;
                }


                dataMovimento.setHours(
                    0,
                    0,
                    0,
                    0
                );


                const quantidade =
                    Number(
                        movimento.quantidade
                    ) || 0;


                dias.forEach(
                    dia => {

                        if (
                            dia.data
                                .getTime() ===
                            dataMovimento
                                .getTime()
                        ) {

                            const tipo =
                                String(
                                    movimento.tipo ||
                                    ""
                                ).toLowerCase();


                            if (
                                tipo ===
                                "entrada"
                            ) {

                                dia.entradas +=
                                    quantidade;

                            } else {

                                dia.saidas +=
                                    quantidade;
                            }
                        }
                    }
                );
            }
        );


        /* --------------------------------------------------
           MAIOR VALOR DO GRÁFICO
        -------------------------------------------------- */

        let maiorValor = 1;


        dias.forEach(
            dia => {

                maiorValor =
                    Math.max(
                        maiorValor,
                        dia.entradas,
                        dia.saidas
                    );
            }
        );


        /* --------------------------------------------------
           VERIFICAR SE EXISTEM DADOS
        -------------------------------------------------- */

        const possuiDados =
            dias.some(
                dia =>
                    dia.entradas > 0 ||
                    dia.saidas > 0
            );


        if (!possuiDados) {

            container.innerHTML = `

                <div class="dashboard-grafico-empty">

                    <i class="fa-solid fa-chart-column"></i>

                    <p>
                        Nenhuma movimentação nos últimos 7 dias.
                    </p>

                </div>

            `;

            return;
        }


        /* --------------------------------------------------
           HTML DO GRÁFICO
        -------------------------------------------------- */

        let html = `

            <div class="dashboard-grafico-legenda">

                <span>
                    <i class="fa-solid fa-arrow-down"></i>
                    Entradas
                </span>

                <span>
                    <i class="fa-solid fa-arrow-up"></i>
                    Saídas
                </span>

            </div>


            <div class="dashboard-grafico">

        `;


        dias.forEach(
            dia => {

                const alturaEntrada =
                    Math.max(
                        4,
                        (
                            dia.entradas /
                            maiorValor
                        ) * 100
                    );


                const alturaSaida =
                    Math.max(
                        4,
                        (
                            dia.saidas /
                            maiorValor
                        ) * 100
                    );


                const nomeDia =
                    dia.data.toLocaleDateString(
                        "pt-BR",
                        {
                            weekday:
                                "short"
                        }
                    )
                    .replace(
                        ".",
                        ""
                    );


                const numeroDia =
                    String(
                        dia.data.getDate()
                    )
                    .padStart(
                        2,
                        "0"
                    );


                html += `

                    <div class="dashboard-grafico-dia">

                        <div class="dashboard-grafico-barras">

                            <div
                                class="dashboard-barra entrada"
                                style="
                                    height:${alturaEntrada}%;
                                "
                                title="Entrada: ${this.formatarQuantidade(
                                    dia.entradas
                                )}"
                            ></div>


                            <div
                                class="dashboard-barra saida"
                                style="
                                    height:${alturaSaida}%;
                                "
                                title="Saída: ${this.formatarQuantidade(
                                    dia.saidas
                                )}"
                            ></div>

                        </div>


                        <span class="dashboard-grafico-dia-nome">
                            ${this.escaparHTML(
                                nomeDia
                            )}
                        </span>

                        <small>
                            ${numeroDia}
                        </small>

                    </div>

                `;
            }
        );


        html += `

            </div>

        `;


        container.innerHTML =
            html;
    }


    /* ======================================================
       DATA DA MOVIMENTAÇÃO
    ====================================================== */

    obterDataMovimento(movimento) {

        if (!movimento) {

            return null;
        }


        const valor =
            movimento.data ||
            movimento.createdAt ||
            movimento.dataMovimento;


        if (!valor) {

            return null;
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

            return null;
        }


        return data;
    }


    /* ======================================================
       TIMESTAMP
    ====================================================== */

    obterTimestamp(movimento) {

        const data =
            this.obterDataMovimento(
                movimento
            );


        if (!data) {

            return 0;
        }


        return data.getTime();
    }


    /* ======================================================
       FORMATAR DATA
    ====================================================== */

    formatarDataMovimento(movimento) {

        const data =
            this.obterDataMovimento(
                movimento
            );


        if (!data) {

            return "--/--/----";
        }


        return data.toLocaleDateString(
            "pt-BR"
        );
    }


    /* ======================================================
       TIPO DA MOVIMENTAÇÃO
    ====================================================== */

    obterTipoMovimento(movimento) {

        const tipo =
            String(
                movimento.tipo ||
                ""
            ).toLowerCase();


        if (
            tipo ===
            "entrada"
        ) {

            return "Entrada";
        }


        if (
            tipo ===
            "saida"
        ) {

            return "Distribuição";
        }


        if (
            tipo ===
            "distribuicao"
        ) {

            return "Distribuição";
        }


        return (
            movimento.modulo ||
            movimento.tipo ||
            "Movimentação"
        );
    }


    /* ======================================================
       DESCRIÇÃO DA MOVIMENTAÇÃO
    ====================================================== */

    obterDescricaoMovimento(
        movimento
    ) {

        if (
            movimento.produto
        ) {

            return String(
                movimento.produto
            );
        }


        if (
            movimento.descricao
        ) {

            return String(
                movimento.descricao
            );
        }


        if (
            movimento.obra
        ) {

            return String(
                movimento.obra
            );
        }


        if (
            movimento.observacao
        ) {

            return String(
                movimento.observacao
            );
        }


        return "Movimentação de estoque";
    }

/* ======================================================
   AÇÕES RÁPIDAS DO DASHBOARD
====================================================== */

configurarAcoesRapidas() {

    const botoes =
        document.querySelectorAll(
            ".dashboard-action-btn[data-page]"
        );


    if (!botoes.length) {

        console.warn(
            "BEQ: Nenhum botão de ação rápida encontrado."
        );

        return;
    }


    botoes.forEach(
        botao => {

            /* Evita registrar o evento duas vezes */
            if (
                botao.dataset.dashboardEvento ===
                "true"
            ) {
                return;
            }


            botao.dataset.dashboardEvento =
                "true";


            botao.addEventListener(
                "click",
                evento => {

                    evento.preventDefault();

                    evento.stopPropagation();


                    const pagina =
                        botao.dataset.page || "";


                    const acao =
                        botao.dataset.action || "";


                    console.log(
                        "Dashboard:",
                        {
                            pagina,
                            acao
                        }
                    );


                    /* ------------------------------------------
                       1. LOCALIZAR O SISTEMA PRINCIPAL
                    ------------------------------------------ */

                    if (
                        typeof window.navegarParaPagina ===
                        "function"
                    ) {

                        window.navegarParaPagina(
                            pagina
                        );

                        return;
                    }


                    if (
                        typeof window.carregarPagina ===
                        "function"
                    ) {

                        window.carregarPagina(
                            pagina
                        );

                        return;
                    }


                    if (
                        typeof window.navegar ===
                        "function"
                    ) {

                        window.navegar(
                            pagina
                        );

                        return;
                    }


                    /* ------------------------------------------
                       2. TENTAR PELO MENU PRINCIPAL
                    ------------------------------------------ */

                    const menu =
                        document.querySelector(
                            `[data-page="${pagina}"]`
                        );


                    if (
                        menu &&
                        menu !== botao
                    ) {

                        menu.click();

                        return;
                    }


                    /* ------------------------------------------
                       3. AVISO
                    ------------------------------------------ */

                    console.warn(
                        "BEQ: Não foi encontrada uma função de navegação para:",
                        pagina
                    );

                }
            );
        }
    );


    console.log(
        "BEQ: Ações rápidas configuradas:",
        botoes.length
    );
}

    /* ======================================================
       DEFINIR VALOR NO HTML
    ====================================================== */

    definirValor(
        ids,
        valor
    ) {

        ids.forEach(
            id => {

                const elemento =
                    document.getElementById(
                        id
                    );


                if (
                    elemento
                ) {

                    elemento.textContent =
                        valor;
                }
            }
        );
    }


    /* ======================================================
       FORMATAR QUANTIDADE
    ====================================================== */

    formatarQuantidade(
        valor
    ) {

        const numero =
            Number(
                valor
            ) || 0;


        return numero.toLocaleString(
            "pt-BR",
            {
                maximumFractionDigits:
                    3
            }
        );
    }


    /* ======================================================
       ESCAPAR HTML
    ====================================================== */

    escaparHTML(
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
   DISPONIBILIZAR GLOBALMENTE
========================================================== */

window.Dashboard =
    Dashboard;