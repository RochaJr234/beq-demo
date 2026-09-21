/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo: Estoque
   Arquivo: assets/js/modulos/estoque/estoque.js

   ETAPA 8.7
   - Estoque por empresa
   - Empresa ativa
   - Controle de estoque
   - Estoque baixo
   - Distribuição para obras
   - Romaneio
   - Movimentações
   - Impressão
   - Compatibilidade com estoque legado

   Design / Implementação: Rocha Digital
========================================================== */

class Estoque {

    constructor() {

        /* ======================================================
           LOCALSTORAGE
        ====================================================== */

        this.chaveProdutos = "beq_produtos";
        this.chaveObras = "beq_obras";
        this.chaveCategorias = "beq_categorias";
        this.chaveMovimentacoes = "beq_movimentacoes_estoque";
        this.chaveRomaneios = "beq_romaneios";

        /* NOVA ESTRUTURA MULTIEMPRESA */
        this.chaveEstoques = "beq_estoques";
        this.chaveEmpresas = "beq_empresas";
        this.chaveEmpresaAtiva = "beq_empresa_ativa";


        /* ======================================================
           DADOS
        ====================================================== */

        this.produtos = [];
        this.obras = [];
        this.categorias = [];
        this.movimentacoes = [];
        this.romaneios = [];
        this.estoques = [];
        this.empresas = [];

        this.empresaAtiva = null;

        this.materiaisDistribuicao = [];

        this.elementos = {};

        this.eventosRegistrados = false;
    }


    /* ==========================================================
       INICIALIZAÇÃO
    ========================================================== */

    init() {

        this.mapearElementos();

        this.carregarDados();

        this.carregarEmpresaAtiva();

        this.migrarEstoqueLegadoSeNecessario();

        this.prepararData();

        this.carregarCategorias();

        this.carregarObras();

        this.carregarProdutos();

        this.renderizarEstoque();

        this.renderizarMovimentacoes();

        this.atualizarIndicadores();

        this.eventos();

        console.log(
            "BEQ: módulo Estoque inicializado."
        );
    }


    /* ==========================================================
       MAPEAR ELEMENTOS
    ========================================================== */

    mapearElementos() {

        this.elementos = {

            /* ESTOQUE */

            pesquisar:
                document.getElementById(
                    "pesquisarEstoque"
                ),

            filtroCategoria:
                document.getElementById(
                    "filtroCategoriaEstoque"
                ),

            btnMostrarEstoque:
                document.getElementById(
                    "btnMostrarEstoque"
                ),

            btnAbrirDistribuicao:
                document.getElementById(
                    "btnAbrirDistribuicaoEstoque"
                ),

            cardTabelaEstoque:
                document.getElementById(
                    "cardTabelaEstoque"
                ),

            listaEstoque:
                document.getElementById(
                    "listaEstoque"
                ),

            estadoVazioEstoque:
                document.getElementById(
                    "estadoVazioEstoque"
                ),


            /* MODAL */

            modalDistribuicao:
                document.getElementById(
                    "modalDistribuicaoEstoque"
                ),

            btnFecharDistribuicao:
                document.getElementById(
                    "btnFecharDistribuicaoEstoque"
                ),

            formDistribuicao:
                document.getElementById(
                    "formDistribuicaoEstoque"
                ),

            obraDestino:
                document.getElementById(
                    "obraDestinoEstoque"
                ),

            dataDistribuicao:
                document.getElementById(
                    "dataDistribuicaoEstoque"
                ),

            motorista:
                document.getElementById(
                    "motoristaDistribuicaoEstoque"
                ),

            veiculo:
                document.getElementById(
                    "veiculoDistribuicaoEstoque"
                ),

            placa:
                document.getElementById(
                    "placaDistribuicaoEstoque"
                ),

            produtoDistribuicao:
                document.getElementById(
                    "produtoDistribuicaoEstoque"
                ),

            quantidadeDistribuicao:
                document.getElementById(
                    "quantidadeDistribuicaoEstoque"
                ),

            unidadeDistribuicao:
                document.getElementById(
                    "unidadeDistribuicaoEstoque"
                ),

            btnAdicionarMaterial:
                document.getElementById(
                    "btnAdicionarMaterialDistribuicao"
                ),

            estoqueDisponivel:
                document.getElementById(
                    "estoqueDisponivelDistribuicao"
                ),

            cardMateriais:
                document.getElementById(
                    "cardMateriaisDistribuicao"
                ),

            listaMateriais:
                document.getElementById(
                    "listaMateriaisDistribuicao"
                ),

            totalMateriais:
                document.getElementById(
                    "totalMateriaisDistribuicao"
                ),

            estadoVazioMateriais:
                document.getElementById(
                    "estadoVazioMateriaisDistribuicao"
                ),

            observacaoDistribuicao:
                document.getElementById(
                    "observacaoDistribuicaoEstoque"
                ),

            btnLimparDistribuicao:
                document.getElementById(
                    "btnLimparDistribuicaoEstoque"
                ),

            btnDistribuir:
                document.getElementById(
                    "btnDistribuirMaterialEstoque"
                ),


            /* MOVIMENTAÇÕES */

            pesquisarMovimentacao:
                document.getElementById(
                    "pesquisarMovimentacaoEstoque"
                ),

            listaMovimentacoes:
                document.getElementById(
                    "listaMovimentacoesEstoque"
                ),

            estadoVazioMovimentacoes:
                document.getElementById(
                    "estadoVazioMovimentacoesEstoque"
                ),


            /* INDICADORES */

            totalItens:
                document.getElementById(
                    "estoqueTotalItens"
                ),

            totalProdutos:
                document.getElementById(
                    "estoqueTotalProdutos"
                ),

            totalDistribuido:
                document.getElementById(
                    "estoqueTotalDistribuido"
                ),

            totalBaixo:
                document.getElementById(
                    "estoqueTotalBaixo"
                )
        };
    }


    /* ==========================================================
       STORAGE
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

        } catch (erro) {

            console.error(
                "BEQ: erro ao ler",
                chave,
                erro
            );

            return [];
        }
    }


    salvarStorage(chave, dados) {

        localStorage.setItem(
            chave,
            JSON.stringify(dados)
        );
    }


    carregarDados() {

        this.produtos =
            this.lerStorage(
                this.chaveProdutos
            );

        this.obras =
            this.lerStorage(
                this.chaveObras
            );

        this.categorias =
            this.lerStorage(
                this.chaveCategorias
            );

        this.movimentacoes =
            this.lerStorage(
                this.chaveMovimentacoes
            );

        this.romaneios =
            this.lerStorage(
                this.chaveRomaneios
            );

        this.estoques =
            this.lerStorage(
                this.chaveEstoques
            );

        this.empresas =
            this.lerStorage(
                this.chaveEmpresas
            );
    }


    salvarProdutos() {

        this.salvarStorage(
            this.chaveProdutos,
            this.produtos
        );
    }


    salvarEstoques() {

        this.salvarStorage(
            this.chaveEstoques,
            this.estoques
        );
    }


    salvarMovimentacoes() {

        this.salvarStorage(
            this.chaveMovimentacoes,
            this.movimentacoes
        );
    }


    salvarRomaneios() {

        this.salvarStorage(
            this.chaveRomaneios,
            this.romaneios
        );
    }


    /* ==========================================================
       EMPRESA ATIVA
    ========================================================== */

    carregarEmpresaAtiva() {

        /*
         * Carrega novamente as empresas do LocalStorage.
         * Assim o Estoque sempre trabalha com os dados atuais.
         */

        this.empresas =
            this.lerStorage(
                this.chaveEmpresas
            );


        /*
         * Recupera a empresa atualmente selecionada.
         */

        const idSalvo =
            localStorage.getItem(
                this.chaveEmpresaAtiva
            );


        /*
         * Se existe uma empresa selecionada,
         * tenta localizá-la na lista.
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

        } else {

            this.empresaAtiva = null;
        }


        /*
         * Verifica se a empresa encontrada
         * realmente está ativa.
         *
         * Aceitamos:
         * "ativo"
         * "ativa"
         * "ATIVO"
         * "ATIVA"
         */

        if (this.empresaAtiva) {

            const status =
                String(
                    this.empresaAtiva.status ||
                    "ativo"
                )
                    .trim()
                    .toLowerCase();


            const empresaAtivaValida =
                status === "ativo" ||
                status === "ativa";


            if (!empresaAtivaValida) {

                this.empresaAtiva =
                    null;

                localStorage.removeItem(
                    this.chaveEmpresaAtiva
                );
            }
        }


        /*
         * Se não existe uma empresa selecionada,
         * procura automaticamente a primeira
         * empresa que esteja ativa.
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
         * Encontrou uma empresa ativa.
         * Persiste sua seleção.
         */

        if (this.empresaAtiva) {

            localStorage.setItem(
                this.chaveEmpresaAtiva,
                String(
                    this.empresaAtiva.id
                )
            );

            console.log(
                "BEQ Estoque: empresa ativa selecionada:",
                this.obterNomeEmpresaAtiva()
            );

            return;
        }


        /*
         * Nenhuma empresa ativa disponível.
         */

        this.empresaAtiva =
            null;

        localStorage.removeItem(
            this.chaveEmpresaAtiva
        );

        console.warn(
            "BEQ Estoque: nenhuma empresa ativa encontrada."
        );
    }


    obterIdEmpresaAtiva() {

        return this.empresaAtiva?.id || "";
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

        if (this.empresaAtiva) {
            return true;
        }

        alert(
            "Nenhuma empresa ativa foi selecionada.\n\n" +
            "Acesse o módulo Empresas e selecione uma empresa ativa antes de utilizar o estoque."
        );

        return false;
    }


    /* ==========================================================
       MIGRAÇÃO DO ESTOQUE ANTIGO
    ========================================================== */

    migrarEstoqueLegadoSeNecessario() {

        /*
         * Se já existe estoque por empresa,
         * não fazemos nenhuma migração.
         */

        if (this.estoques.length > 0) {
            return;
        }


        /*
         * Sem empresa ativa não é possível
         * definir a empresa proprietária.
         */

        if (!this.empresaAtiva) {
            return;
        }


        /*
         * Estoque antigo:
         *
         * produto.estoque
         *
         * passa a pertencer à empresa ativa.
         */

        const novosEstoques = [];

        this.produtos.forEach(
            produto => {

                if (!produto) {
                    return;
                }

                const quantidade =
                    Number(
                        produto.estoque
                    ) || 0;

                const minimo =
                    Number(
                        produto.estoqueMinimo
                    ) || 0;

                if (
                    quantidade === 0 &&
                    minimo === 0
                ) {
                    return;
                }

                novosEstoques.push({

                    id:
                        this.gerarId(),

                    empresaId:
                        this.obterIdEmpresaAtiva(),

                    empresaNome:
                        this.obterNomeEmpresaAtiva(),

                    produtoId:
                        produto.id ||
                        produto.codigo ||
                        produto.nome,

                    produto:
                        produto.nome || "",

                    codigo:
                        produto.codigo || "",

                    quantidade:
                        quantidade,

                    estoqueMinimo:
                        minimo,

                    unidade:
                        produto.unidade ||
                        "UN",

                    updatedAt:
                        new Date().toISOString()
                });
            }
        );


        if (!novosEstoques.length) {
            return;
        }


        this.estoques =
            novosEstoques;

        this.salvarEstoques();

        console.log(
            "BEQ: estoque legado migrado para a empresa ativa."
        );
    }


    /* ==========================================================
       ESTOQUE POR EMPRESA
    ========================================================== */

    obterEstoqueEmpresa(
        produtoId
    ) {

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {
            return null;
        }

        return this.estoques.find(
            estoque =>
                String(
                    estoque.empresaId
                ) === String(empresaId) &&
                String(
                    estoque.produtoId
                ) === String(produtoId)
        ) || null;
    }


    obterOuCriarEstoqueEmpresa(
        produto
    ) {

        if (!produto) {
            return null;
        }

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {
            return null;
        }

        const produtoId =
            produto.id ||
            produto.codigo ||
            produto.nome;

        let estoque =
            this.obterEstoqueEmpresa(
                produtoId
            );

        if (estoque) {
            return estoque;
        }

        estoque = {

            id:
                this.gerarId(),

            empresaId:
                empresaId,

            empresaNome:
                this.obterNomeEmpresaAtiva(),

            produtoId:
                produtoId,

            produto:
                produto.nome || "",

            codigo:
                produto.codigo || "",

            quantidade:
                0,

            estoqueMinimo:
                Number(
                    produto.estoqueMinimo
                ) || 0,

            unidade:
                produto.unidade ||
                "UN",

            updatedAt:
                new Date().toISOString()
        };

        this.estoques.push(
            estoque
        );

        return estoque;
    }


    obterQuantidadeEstoque(
        produto
    ) {

        if (!produto) {
            return 0;
        }

        const produtoId =
            produto.id ||
            produto.codigo ||
            produto.nome;

        const estoque =
            this.obterEstoqueEmpresa(
                produtoId
            );

        if (estoque) {

            return Number(
                estoque.quantidade
            ) || 0;
        }


        /*
         * Compatibilidade:
         * se ainda não existe registro por empresa,
         * mostramos o estoque legado apenas quando
         * ainda não existe nenhuma estrutura multiempresa.
         */

        if (
            !this.estoques.length &&
            this.empresaAtiva
        ) {

            return Number(
                produto.estoque
            ) || 0;
        }

        return 0;
    }


    obterMinimoEstoque(
        produto
    ) {

        if (!produto) {
            return 0;
        }

        const produtoId =
            produto.id ||
            produto.codigo ||
            produto.nome;

        const estoque =
            this.obterEstoqueEmpresa(
                produtoId
            );

        if (estoque) {

            return Number(
                estoque.estoqueMinimo
            ) || 0;
        }

        return Number(
            produto.estoqueMinimo
        ) || 0;
    }


alterarQuantidadeEstoque(
    produto,
    variacao
) {

    if (!produto) {
        return null;
    }

    const estoque =
        this.obterOuCriarEstoqueEmpresa(
            produto
        );

    if (!estoque) {
        return null;
    }

    const atual =
        Number(
            estoque.quantidade
        ) || 0;

    const novaQuantidade =
        atual +
        Number(
            variacao
        );

    estoque.quantidade =
        Math.max(
            0,
            novaQuantidade
        );

    estoque.produto =
        produto.nome ||
        estoque.produto;

    estoque.codigo =
        produto.codigo ||
        estoque.codigo;

    estoque.unidade =
        produto.unidade ||
        estoque.unidade ||
        "UN";

    estoque.estoqueMinimo =
        Number(
            estoque.estoqueMinimo ??
            produto.estoqueMinimo
        ) || 0;

    estoque.updatedAt =
        new Date().toISOString();

    return estoque;
}

    /* ==========================================================
       DATA
    ========================================================== */

    dataAtual() {

        const hoje =
            new Date();

        const ano =
            hoje.getFullYear();

        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoje.getDate()
            ).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }


    prepararData() {

        if (
            this.elementos.dataDistribuicao
        ) {

            this.elementos.dataDistribuicao.value =
                this.dataAtual();
        }
    }


    formatarData(data) {

        if (!data) {
            return "—";
        }

        const partes =
            String(data).split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    formatarNumero(numero) {

        return Number(
            numero || 0
        ).toLocaleString(
            "pt-BR",
            {
                maximumFractionDigits: 2
            }
        );
    }


    /* ==========================================================
       CATEGORIAS
    ========================================================== */

    carregarCategorias() {

        const select =
            this.elementos.filtroCategoria;

        if (!select) {
            return;
        }

        select.innerHTML =
            `<option value="">Todas as categorias</option>`;

        const nomes =
            new Set();

        this.categorias.forEach(
            categoria => {

                if (
                    categoria &&
                    categoria.nome
                ) {

                    nomes.add(
                        String(
                            categoria.nome
                        )
                    );
                }
            }
        );

        this.produtos.forEach(
            produto => {

                if (
                    produto &&
                    produto.categoria
                ) {

                    nomes.add(
                        String(
                            produto.categoria
                        )
                    );
                }
            }
        );

        [...nomes]
            .sort(
                (a, b) =>
                    a.localeCompare(b)
            )
            .forEach(
                nome => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        nome;

                    option.textContent =
                        nome;

                    select.appendChild(
                        option
                    );
                }
            );
    }


    /* ==========================================================
       OBRAS
    ========================================================== */

    carregarObras() {

        const select =
            this.elementos.obraDestino;

        if (!select) {
            return;
        }

        select.innerHTML =
            `<option value="">Selecione a obra</option>`;

        const empresaId =
            this.obterIdEmpresaAtiva();

        const obrasDaEmpresa =
            this.obras.filter(
                obra => {

                    /*
                     * Obras novas possuem empresaId.
                     */

                    if (obra.empresaId) {

                        return String(
                            obra.empresaId
                        ) === String(
                            empresaId
                        );
                    }

                    /*
                     * Obras antigas sem empresaId
                     * não devem ser misturadas
                     * automaticamente entre empresas.
                     */

                    return false;
                }
            );

        obrasDaEmpresa.forEach(
            obra => {

                if (!obra) {
                    return;
                }

                const id =
                    obra.id ||
                    obra.codigo ||
                    "";

                const nome =
                    obra.nomeObra ||
                    obra.nome ||
                    obra.codigo ||
                    "Obra sem nome";

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    id;

                option.textContent =
                    nome;

                select.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================================
       PRODUTOS
    ========================================================== */

    carregarProdutos() {

        const select =
            this.elementos.produtoDistribuicao;

        if (!select) {
            return;
        }

        select.innerHTML =
            `<option value="">Selecione o produto</option>`;

        this.produtos.forEach(
            produto => {

                if (!produto) {
                    return;
                }

                const estoque =
                    this.obterQuantidadeEstoque(
                        produto
                    );

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    produto.id ||
                    produto.codigo ||
                    produto.nome ||
                    "";

                option.textContent =
                    `${produto.nome || "Produto"} — disponível: ${this.formatarNumero(estoque)} ${produto.unidade || "UN"}`;

                select.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================================
       ESTOQUE GERAL
    ========================================================== */

    renderizarEstoque() {

        const tbody =
            this.elementos.listaEstoque;

        if (!tbody) {
            return;
        }

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {

            tbody.innerHTML = "";

            if (
                this.elementos.estadoVazioEstoque
            ) {

                this.elementos.estadoVazioEstoque.hidden =
                    false;
            }

            return;
        }

        const pesquisa =
            String(
                this.elementos.pesquisar?.value ||
                ""
            )
                .toLowerCase()
                .trim();

        const categoria =
            this.elementos.filtroCategoria?.value ||
            "";

        const filtrados =
            this.produtos.filter(
                produto => {

                    const texto =
                        [
                            produto.nome,
                            produto.codigo,
                            produto.categoria,
                            produto.marca
                        ]
                            .join(" ")
                            .toLowerCase();

                    const buscaOk =
                        !pesquisa ||
                        texto.includes(
                            pesquisa
                        );

                    const categoriaOk =
                        !categoria ||
                        String(
                            produto.categoria ||
                            ""
                        ) === categoria;

                    const quantidade =
                        this.obterQuantidadeEstoque(
                            produto
                        );

                    /*
                     * Mostra produtos que possuem
                     * registro/estoque na empresa.
                     */

                    const possuiEstoqueEmpresa =
                        quantidade > 0 ||
                        !!this.obterEstoqueEmpresa(
                            produto.id ||
                            produto.codigo ||
                            produto.nome
                        );

                    return (
                        buscaOk &&
                        categoriaOk &&
                        possuiEstoqueEmpresa
                    );
                }
            );

        tbody.innerHTML = "";

        if (!filtrados.length) {

            if (
                this.elementos.estadoVazioEstoque
            ) {

                this.elementos.estadoVazioEstoque.hidden =
                    false;
            }

            return;
        }

        if (
            this.elementos.estadoVazioEstoque
        ) {

            this.elementos.estadoVazioEstoque.hidden =
                true;
        }

        filtrados.forEach(
            produto => {

                const quantidade =
                    this.obterQuantidadeEstoque(
                        produto
                    );

                const minimo =
                    this.obterMinimoEstoque(
                        produto
                    );

                const situacao =
                    this.statusEstoque(
                        quantidade,
                        minimo
                    );

                const id =
                    produto.id ||
                    produto.codigo ||
                    produto.nome ||
                    "";

                const tr =
                    document.createElement(
                        "tr"
                    );

                tr.innerHTML = `

                    <td>
                        <strong>
                            ${this.escape(
                                produto.nome || "—"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${this.escape(
                            produto.categoria || "—"
                        )}
                    </td>

                    <td>
                        ${this.escape(
                            produto.unidade || "UN"
                        )}
                    </td>

                    <td>
                        <strong>
                            ${this.formatarNumero(
                                quantidade
                            )}
                        </strong>
                    </td>

                    <td>
                        ${situacao}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-primary btn-sm"
                            data-distribuir-produto="${this.escape(id)}">

                            <i class="fa-solid fa-truck-ramp-box"></i>

                            Distribuir

                        </button>

                    </td>
                `;

                tbody.appendChild(
                    tr
                );
            }
        );
    }


    statusEstoque(
        quantidade,
        minimo
    ) {

        if (quantidade <= 0) {

            return `
                <span class="status-estoque status-danger">
                    Sem estoque
                </span>
            `;
        }

        if (
            minimo > 0 &&
            quantidade <= minimo
        ) {

            return `
                <span class="status-estoque status-warning">
                    Estoque baixo
                </span>
            `;
        }

        return `
            <span class="status-estoque status-success">
                Disponível
            </span>
        `;
    }


    /* ==========================================================
       INDICADORES
    ========================================================== */

    atualizarIndicadores() {

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {

            this.definirIndicador(
                this.elementos.totalItens,
                0
            );

            this.definirIndicador(
                this.elementos.totalProdutos,
                0
            );

            this.definirIndicador(
                this.elementos.totalDistribuido,
                0
            );

            this.definirIndicador(
                this.elementos.totalBaixo,
                0
            );

            return;
        }

        const estoquesEmpresa =
            this.produtos.map(
                produto => {

                    const quantidade =
                        this.obterQuantidadeEstoque(
                            produto
                        );

                    const minimo =
                        this.obterMinimoEstoque(
                            produto
                        );

                    return {
                        produto,
                        quantidade,
                        minimo
                    };
                }
            );

        const totalItens =
            estoquesEmpresa.reduce(
                (total, item) =>
                    total +
                    item.quantidade,
                0
            );

        const produtosComEstoque =
            estoquesEmpresa.filter(
                item =>
                    item.quantidade > 0
            ).length;

        const totalDistribuido =
            this.movimentacoes
                .filter(
                    movimento =>
                        String(
                            movimento.empresaId || ""
                        ) === String(
                            empresaId
                        ) &&
                        movimento.tipo ===
                        "saida"
                )
                .reduce(
                    (total, movimento) =>
                        total +
                        (
                            Number(
                                movimento.quantidade
                            ) || 0
                        ),
                    0
                );

        const totalBaixo =
            estoquesEmpresa.filter(
                item =>
                    item.minimo > 0 &&
                    item.quantidade <=
                    item.minimo
            ).length;

        this.definirIndicador(
            this.elementos.totalItens,
            this.formatarNumero(
                totalItens
            )
        );

        this.definirIndicador(
            this.elementos.totalProdutos,
            produtosComEstoque
        );

        this.definirIndicador(
            this.elementos.totalDistribuido,
            this.formatarNumero(
                totalDistribuido
            )
        );

        this.definirIndicador(
            this.elementos.totalBaixo,
            totalBaixo
        );
    }


    definirIndicador(
        elemento,
        valor
    ) {

        if (!elemento) {
            return;
        }

        elemento.textContent =
            valor;
    }


    /* ==========================================================
       MODAL
    ========================================================== */

    abrirModalDistribuicao(
        produtoId = ""
    ) {

        if (!this.verificarEmpresaAtiva()) {
            return;
        }

        const modal =
            this.elementos.modalDistribuicao;

        if (!modal) {
            return;
        }

        this.carregarObras();

        this.carregarProdutos();

        if (produtoId) {

            this.elementos.produtoDistribuicao.value =
                String(
                    produtoId
                );

            this.atualizarEstoqueDisponivel();
        }

        modal.hidden =
            false;

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-aberto"
        );

        setTimeout(
            () => {

                if (
                    !produtoId &&
                    this.elementos.obraDestino
                ) {

                    this.elementos.obraDestino.focus();
                }

            },
            50
        );
    }


    fecharModalDistribuicao() {

        const modal =
            this.elementos.modalDistribuicao;

        if (!modal) {
            return;
        }

        modal.hidden =
            true;

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-aberto"
        );
    }


    /* ==========================================================
       PRODUTO
    ========================================================== */

    encontrarProduto(
        id
    ) {

        return this.produtos.find(
            produto =>
                String(
                    produto.id ||
                    produto.codigo ||
                    produto.nome ||
                    ""
                ) ===
                String(id)
        );
    }


    /* ==========================================================
       ESTOQUE DISPONÍVEL
    ========================================================== */

    atualizarEstoqueDisponivel() {

        const id =
            this.elementos.produtoDistribuicao?.value;

        const campo =
            this.elementos.estoqueDisponivel;

        if (!campo) {
            return;
        }

        if (!id) {

            campo.textContent =
                "Selecione um produto para consultar o estoque disponível.";

            return;
        }

        const produto =
            this.encontrarProduto(
                id
            );

        if (!produto) {

            campo.textContent =
                "Produto não encontrado.";

            return;
        }

        const estoque =
            this.obterQuantidadeEstoque(
                produto
            );

        const minimo =
            this.obterMinimoEstoque(
                produto
            );

        let mensagem =
            `Estoque disponível: ${this.formatarNumero(estoque)} ${produto.unidade || "UN"}`;

        if (
            minimo > 0 &&
            estoque <= minimo
        ) {

            mensagem +=
                ` • Estoque baixo (mínimo: ${this.formatarNumero(minimo)})`;
        }

        campo.textContent =
            mensagem;
    }


    /* ==========================================================
       ADICIONAR MATERIAL
    ========================================================== */

    adicionarMaterialDistribuicao() {

        if (!this.verificarEmpresaAtiva()) {
            return;
        }

        const produtoId =
            this.elementos.produtoDistribuicao?.value;

        const quantidade =
            Number(
                this.elementos.quantidadeDistribuicao?.value
            );

        const unidade =
            this.elementos.unidadeDistribuicao?.value ||
            "UN";

        if (!produtoId) {

            alert(
                "Selecione um produto."
            );

            return;
        }

        if (
            !Number.isFinite(
                quantidade
            ) ||
            quantidade <= 0
        ) {

            alert(
                "Informe uma quantidade válida."
            );

            return;
        }

        const produto =
            this.encontrarProduto(
                produtoId
            );

        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;
        }

        const estoque =
            this.obterQuantidadeEstoque(
                produto
            );

        const existente =
            this.materiaisDistribuicao.find(
                item =>
                    String(
                        item.produtoId
                    ) ===
                    String(
                        produtoId
                    )
            );

        const quantidadeJaAdicionada =
            existente
                ? Number(
                    existente.quantidade
                ) || 0
                : 0;

        const novaQuantidade =
            quantidadeJaAdicionada +
            quantidade;

        if (
            novaQuantidade >
            estoque
        ) {

            alert(
                `Estoque insuficiente.\n\n` +
                `Produto: ${produto.nome}\n` +
                `Disponível: ${this.formatarNumero(estoque)} ${produto.unidade || "UN"}\n` +
                `Já no romaneio: ${this.formatarNumero(quantidadeJaAdicionada)}\n` +
                `Solicitado agora: ${this.formatarNumero(quantidade)}`
            );

            return;
        }

        if (existente) {

            existente.quantidade =
                novaQuantidade;

            existente.unidade =
                unidade ||
                existente.unidade;

        } else {

            this.materiaisDistribuicao.push({

                produtoId:
                    produto.id ||
                    produto.codigo ||
                    produto.nome,

                produto:
                    produto.nome || "",

                codigo:
                    produto.codigo || "",

                quantidade:
                    quantidade,

                unidade:
                    unidade ||
                    produto.unidade ||
                    "UN"
            });
        }

        this.renderizarMateriaisDistribuicao();

        if (
            this.elementos.quantidadeDistribuicao
        ) {

            this.elementos.quantidadeDistribuicao.value =
                "1";
        }

        this.atualizarEstoqueDisponivel();
    }


    /* ==========================================================
       RENDERIZAR MATERIAIS
    ========================================================== */

    renderizarMateriaisDistribuicao() {

        const tbody =
            this.elementos.listaMateriais;

        if (!tbody) {
            return;
        }

        tbody.innerHTML = "";

        if (
            !this.materiaisDistribuicao.length
        ) {

            if (
                this.elementos.cardMateriais
            ) {

                this.elementos.cardMateriais.hidden =
                    true;
            }

            if (
                this.elementos.estadoVazioMateriais
            ) {

                this.elementos.estadoVazioMateriais.hidden =
                    false;
            }

            if (
                this.elementos.totalMateriais
            ) {

                this.elementos.totalMateriais.textContent =
                    "0";
            }

            return;
        }

        if (
            this.elementos.cardMateriais
        ) {

            this.elementos.cardMateriais.hidden =
                false;
        }

        if (
            this.elementos.estadoVazioMateriais
        ) {

            this.elementos.estadoVazioMateriais.hidden =
                true;
        }

        this.materiaisDistribuicao.forEach(
            (item, indice) => {

                const tr =
                    document.createElement(
                        "tr"
                    );

                tr.innerHTML = `

                    <td>
                        <strong>
                            ${this.escape(
                                item.produto
                            )}
                        </strong>
                    </td>

                    <td>
                        ${this.formatarNumero(
                            item.quantidade
                        )}
                    </td>

                    <td>
                        ${this.escape(
                            item.unidade
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn btn-danger btn-sm"
                            data-remover-material="${indice}"
                            title="Remover material">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>
                `;

                tbody.appendChild(
                    tr
                );
            }
        );

        const totalQuantidade =
            this.materiaisDistribuicao.reduce(
                (total, item) =>
                    total +
                    (
                        Number(
                            item.quantidade
                        ) || 0
                    ),
                0
            );

        if (
            this.elementos.totalMateriais
        ) {

            this.elementos.totalMateriais.textContent =
                this.formatarNumero(
                    totalQuantidade
                );
        }
    }


    removerMaterialDistribuicao(
        indice
    ) {

        if (
            indice < 0 ||
            indice >=
            this.materiaisDistribuicao.length
        ) {

            return;
        }

        this.materiaisDistribuicao.splice(
            indice,
            1
        );

        this.renderizarMateriaisDistribuicao();

        this.atualizarEstoqueDisponivel();
    }


    /* ==========================================================
       LIMPAR DISTRIBUIÇÃO
    ========================================================== */

    limparDistribuicao() {

        this.materiaisDistribuicao =
            [];

        if (
            this.elementos.formDistribuicao
        ) {

            this.elementos.formDistribuicao.reset();
        }

        this.prepararData();

        this.renderizarMateriaisDistribuicao();

        if (
            this.elementos.estoqueDisponivel
        ) {

            this.elementos.estoqueDisponivel.textContent =
                "Selecione um produto para consultar o estoque disponível.";
        }
    }


    /* ==========================================================
       ROMANEIO
    ========================================================== */

    gerarNumeroRomaneio() {

        let maior =
            0;

        this.romaneios.forEach(
            romaneio => {

                const numero =
                    String(
                        romaneio.numero ||
                        ""
                    );

                const encontrado =
                    numero.match(
                        /ROM-(\d+)/
                    );

                if (encontrado) {

                    maior =
                        Math.max(
                            maior,
                            Number(
                                encontrado[1]
                            ) || 0
                        );
                }
            }
        );

        return (
            "ROM-" +
            String(
                maior + 1
            ).padStart(
                5,
                "0"
            )
        );
    }


    distribuirMaterial(
        evento
    ) {

        evento.preventDefault();

        if (!this.verificarEmpresaAtiva()) {
            return;
        }

        const empresaId =
            this.obterIdEmpresaAtiva();

        const empresaNome =
            this.obterNomeEmpresaAtiva();

        const obraId =
            this.elementos.obraDestino?.value;

        const data =
            this.elementos.dataDistribuicao?.value ||
            this.dataAtual();

        const motorista =
            this.elementos.motorista?.value
                ?.trim() ||
            "";

        const veiculo =
            this.elementos.veiculo?.value
                ?.trim() ||
            "";

        const placa =
            this.elementos.placa?.value
                ?.trim()
                .toUpperCase() ||
            "";

        const observacao =
            this.elementos.observacaoDistribuicao?.value
                ?.trim() ||
            "";


        /* ======================================================
           VALIDAÇÃO DA OBRA
        ====================================================== */

        if (!obraId) {

            alert(
                "Selecione a obra."
            );

            return;
        }

        if (
            !this.materiaisDistribuicao.length
        ) {

            alert(
                "Adicione pelo menos um material ao romaneio."
            );

            return;
        }

        const obra =
            this.obras.find(
                item =>
                    String(
                        item.id ||
                        item.codigo ||
                        ""
                    ) ===
                    String(
                        obraId
                    ) &&
                    String(
                        item.empresaId ||
                        ""
                    ) ===
                    String(
                        empresaId
                    )
            );

        if (!obra) {

            alert(
                "A obra selecionada não pertence à empresa ativa."
            );

            return;
        }


        const nomeObra =
            obra.nomeObra ||
            obra.nome ||
            obra.codigo ||
            "Obra";


        /* ======================================================
           VALIDAR ESTOQUE
        ====================================================== */

        for (
            const item
            of this.materiaisDistribuicao
        ) {

            const produto =
                this.encontrarProduto(
                    item.produtoId
                );

            if (!produto) {

                alert(
                    `Produto não encontrado: ${item.produto}`
                );

                return;
            }

            const estoque =
                this.obterQuantidadeEstoque(
                    produto
                );

            const quantidade =
                Number(
                    item.quantidade
                ) || 0;

            if (
                quantidade <= 0
            ) {

                alert(
                    `Quantidade inválida para ${produto.nome}.`
                );

                return;
            }

            if (
                quantidade >
                estoque
            ) {

                alert(
                    `Estoque insuficiente.\n\n` +
                    `Empresa: ${empresaNome}\n` +
                    `Produto: ${produto.nome}\n` +
                    `Disponível: ${this.formatarNumero(estoque)} ${produto.unidade || "UN"}\n` +
                    `Solicitado: ${this.formatarNumero(quantidade)}`
                );

                return;
            }
        }


        /* ======================================================
           CONFIRMAÇÃO
        ====================================================== */

        const totalItens =
            this.materiaisDistribuicao.reduce(
                (total, item) =>
                    total +
                    (
                        Number(
                            item.quantidade
                        ) || 0
                    ),
                0
            );

        const confirmar =
            confirm(
                `Confirmar distribuição?\n\n` +
                `Empresa: ${empresaNome}\n` +
                `Obra: ${nomeObra}\n` +
                `Materiais: ${this.materiaisDistribuicao.length}\n` +
                `Quantidade total: ${this.formatarNumero(totalItens)}\n\n` +
                `O estoque da empresa será baixado e o romaneio será gerado.`
            );

        if (!confirmar) {
            return;
        }


        /* ======================================================
           NÚMERO DO ROMANEIO
        ====================================================== */

        const numeroRomaneio =
            this.gerarNumeroRomaneio();

        const materiaisRomaneio =
            [];


        /* ======================================================
           BAIXA
        ====================================================== */

        for (
            const item
            of this.materiaisDistribuicao
        ) {

            const produto =
                this.encontrarProduto(
                    item.produtoId
                );

            const quantidade =
                Number(
                    item.quantidade
                ) || 0;


            /*
             * Baixa somente no estoque
             * da empresa ativa.
             */

            const estoqueEmpresa =
                this.obterEstoqueEmpresa(
                    produto.id ||
                    produto.codigo ||
                    produto.nome
                );

            if (!estoqueEmpresa) {

                alert(
                    `Não foi encontrado estoque da empresa para o produto ${produto.nome}.`
                );

                return;
            }

            if (
                Number(
                    estoqueEmpresa.quantidade
                ) < quantidade
            ) {

                alert(
                    `O estoque foi alterado antes da conclusão do romaneio.\n\n` +
                    `Produto: ${produto.nome}`
                );

                return;
            }

            estoqueEmpresa.quantidade =
                Number(
                    estoqueEmpresa.quantidade
                ) -
                quantidade;

            estoqueEmpresa.updatedAt =
                new Date().toISOString();



            const material = {

                produtoId:
                    produto.id ||
                    produto.codigo ||
                    produto.nome,

                codigo:
                    produto.codigo ||
                    "",

                produto:
                    produto.nome ||
                    "",

                quantidade:
                    quantidade,

                unidade:
                    item.unidade ||
                    produto.unidade ||
                    "UN"
            };

            materiaisRomaneio.push(
                material
            );


            /* ==================================================
               MOVIMENTAÇÃO
            ================================================== */

            this.movimentacoes.unshift({

                id:
                    this.gerarId(),

                data:
                    data,

                empresaId:
                    empresaId,

                empresaNome:
                    empresaNome,

                produtoId:
                    material.produtoId,

                produto:
                    material.produto,

                tipo:
                    "saida",

                quantidade:
                    quantidade,

                obraId:
                    obra.id ||
                    obra.codigo ||
                    "",

                obra:
                    nomeObra,

                observacao:
                    observacao ||
                    `Romaneio ${numeroRomaneio}`,

                romaneio:
                    numeroRomaneio,

                motorista:
                    motorista,

                veiculo:
                    veiculo,

                placa:
                    placa,

                createdAt:
                    new Date().toISOString()
            });
        }


        /* ======================================================
           ROMANEIO
        ====================================================== */

        const romaneio = {

            id:
                this.gerarId(),

            numero:
                numeroRomaneio,

            data:
                data,

            empresaId:
                empresaId,

            empresaNome:
                empresaNome,

            obraId:
                obra.id ||
                obra.codigo ||
                "",

            obra:
                nomeObra,

            motorista:
                motorista,

            veiculo:
                veiculo,

            placa:
                placa,

            observacao:
                observacao,

            status:
                "concluido",

            totalItens:
                materiaisRomaneio.length,

            totalQuantidade:
                totalItens,

            materiais:
                materiaisRomaneio,

            createdAt:
                new Date().toISOString()
        };


        this.romaneios.unshift(
            romaneio
        );


        /* ======================================================
           SALVAR
        ====================================================== */

        this.salvarProdutos();

        this.salvarEstoques();

        this.salvarMovimentacoes();

        this.salvarRomaneios();


        /* ======================================================
           ATUALIZAR INTERFACE
        ====================================================== */

        this.carregarDados();

        this.carregarEmpresaAtiva();

        this.carregarProdutos();

        this.renderizarEstoque();

        this.renderizarMovimentacoes();

        this.atualizarIndicadores();


        /* ======================================================
           FINALIZAÇÃO
        ====================================================== */

        this.limparDistribuicao();

        this.fecharModalDistribuicao();


        alert(
            `Romaneio ${numeroRomaneio} criado com sucesso!\n\n` +
            `Empresa: ${empresaNome}\n` +
            `Obra: ${nomeObra}\n` +
            `Materiais: ${materiaisRomaneio.length}\n` +
            `Quantidade total: ${this.formatarNumero(totalItens)}`
        );


        /* ======================================================
           IMPRESSÃO
        ====================================================== */

        this.imprimirRomaneio(
            romaneio
        );
    }


    /* ==========================================================
       IMPRESSÃO
    ========================================================== */

    imprimirRomaneio(
        romaneio
    ) {

        const janela =
            window.open(
                "",
                "_blank",
                "width=900,height=700"
            );

        if (!janela) {

            alert(
                "O navegador bloqueou a janela de impressão. Permita pop-ups para gerar o romaneio."
            );

            return;
        }

        const materiais =
            romaneio.materiais || [];

        const linhas =
            materiais
                .map(
                    (item, indice) => `

                        <tr>

                            <td>
                                ${indice + 1}
                            </td>

                            <td>
                                ${this.escape(
                                    item.codigo ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${this.escape(
                                    item.produto ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${this.escape(
                                    item.unidade ||
                                    "UN"
                                )}
                            </td>

                            <td class="quantidade">
                                ${this.formatarNumero(
                                    item.quantidade
                                )}
                            </td>

                        </tr>
                    `
                )
                .join("");


        janela.document.write(`

            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>

                <meta charset="UTF-8">

                <title>
                    ${this.escape(
                        romaneio.numero
                    )} - Romaneio
                </title>

                <style>

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 30px;
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                        color: #111827;
                        background: #ffffff;
                    }

                    .documento {
                        width: 100%;
                        max-width: 794px;
                        margin: 0 auto;
                    }

                    .cabecalho {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 20px;
                        padding-bottom: 18px;
                        border-bottom: 2px solid #1d4ed8;
                    }

                    .empresa h1 {
                        margin: 0;
                        font-size: 23px;
                        color: #0f172a;
                    }

                    .empresa p {
                        margin: 5px 0 0;
                        font-size: 11px;
                        color: #64748b;
                    }

                    .titulo-documento {
                        text-align: right;
                    }

                    .titulo-documento h2 {
                        margin: 0;
                        font-size: 20px;
                        color: #1d4ed8;
                    }

                    .titulo-documento strong {
                        display: block;
                        margin-top: 5px;
                        font-size: 13px;
                    }

                    .dados {
                        display: grid;
                        grid-template-columns:
                            repeat(2, 1fr);
                        gap: 10px;
                        margin: 20px 0;
                    }

                    .campo {
                        padding: 10px 12px;
                        border: 1px solid #dbe3ee;
                        border-radius: 7px;
                    }

                    .campo .label {
                        display: block;
                        margin-bottom: 4px;
                        font-size: 9px;
                        font-weight: bold;
                        color: #64748b;
                        text-transform: uppercase;
                    }

                    .campo .valor {
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .campo.empresa {
                        grid-column: 1 / -1;
                    }

                    .campo.obra {
                        grid-column: 1 / -1;
                    }

                    h3 {
                        margin: 22px 0 10px;
                        font-size: 14px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th {
                        padding: 9px;
                        background: #eff6ff;
                        border: 1px solid #dbe3ee;
                        font-size: 9px;
                        text-align: left;
                        text-transform: uppercase;
                    }

                    td {
                        padding: 9px;
                        border: 1px solid #dbe3ee;
                        font-size: 11px;
                    }

                    .quantidade {
                        text-align: right;
                        font-weight: bold;
                    }

                    .total {
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        margin-top: 10px;
                        font-size: 12px;
                        font-weight: bold;
                    }

                    .observacao {
                        margin-top: 18px;
                        padding: 12px;
                        min-height: 65px;
                        border: 1px solid #dbe3ee;
                        border-radius: 7px;
                    }

                    .observacao strong {
                        display: block;
                        margin-bottom: 7px;
                        font-size: 10px;
                        text-transform: uppercase;
                        color: #64748b;
                    }

                    .assinaturas {
                        display: grid;
                        grid-template-columns:
                            1fr 1fr;
                        gap: 50px;
                        margin-top: 70px;
                    }

                    .assinatura {
                        padding-top: 8px;
                        border-top: 1px solid #111827;
                        text-align: center;
                        font-size: 10px;
                    }

                    .rodape {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 9px;
                        color: #64748b;
                    }

                    @media print {

                        body {
                            padding: 0;
                        }

                        .documento {
                            max-width: none;
                        }

                    }

                </style>

            </head>

            <body>

                <div class="documento">

                    <div class="cabecalho">

                        <div class="empresa">

                            <h1>
                                ${this.escape(
                                    romaneio.empresaNome ||
                                    "BEQ Empreendimentos"
                                )}
                            </h1>

                            <p>
                                Controle de materiais
                            </p>

                        </div>

                        <div class="titulo-documento">

                            <h2>
                                ROMANEIO DE DISTRIBUIÇÃO
                            </h2>

                            <strong>
                                ${this.escape(
                                    romaneio.numero
                                )}
                            </strong>

                        </div>

                    </div>


                    <div class="dados">

                        <div class="campo empresa">

                            <span class="label">
                                Empresa
                            </span>

                            <div class="valor">
                                ${this.escape(
                                    romaneio.empresaNome ||
                                    "—"
                                )}
                            </div>

                        </div>


                        <div class="campo obra">

                            <span class="label">
                                Obra
                            </span>

                            <div class="valor">
                                ${this.escape(
                                    romaneio.obra ||
                                    "—"
                                )}
                            </div>

                        </div>


                        <div class="campo">

                            <span class="label">
                                Data
                            </span>

                            <div class="valor">
                                ${this.formatarData(
                                    romaneio.data
                                )}
                            </div>

                        </div>


                        <div class="campo">

                            <span class="label">
                                Motorista
                            </span>

                            <div class="valor">
                                ${this.escape(
                                    romaneio.motorista ||
                                    "Não informado"
                                )}
                            </div>

                        </div>


                        <div class="campo">

                            <span class="label">
                                Veículo
                            </span>

                            <div class="valor">
                                ${this.escape(
                                    romaneio.veiculo ||
                                    "Não informado"
                                )}
                            </div>

                        </div>


                        <div class="campo">

                            <span class="label">
                                Placa
                            </span>

                            <div class="valor">
                                ${this.escape(
                                    romaneio.placa ||
                                    "Não informada"
                                )}
                            </div>

                        </div>

                    </div>


                    <h3>
                        Materiais Distribuídos
                    </h3>


                    <table>

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Código</th>

                                <th>Produto</th>

                                <th>Unidade</th>

                                <th>Quantidade</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${linhas}

                        </tbody>

                    </table>


                    <div class="total">

                        <span>
                            Total de materiais:
                        </span>

                        <strong>
                            ${this.formatarNumero(
                                romaneio.totalItens
                            )}
                        </strong>

                        <span>
                            |
                        </span>

                        <span>
                            Quantidade total:
                        </span>

                        <strong>
                            ${this.formatarNumero(
                                romaneio.totalQuantidade
                            )}
                        </strong>

                    </div>


                    <div class="observacao">

                        <strong>
                            Observação
                        </strong>

                        ${this.escape(
                            romaneio.observacao ||
                            "Nenhuma observação registrada."
                        )}

                    </div>


                    <div class="assinaturas">

                        <div class="assinatura">
                            Responsável pela distribuição
                        </div>

                        <div class="assinatura">
                            Motorista / Recebedor
                        </div>

                    </div>


                    <div class="rodape">

                        ${this.escape(
                            romaneio.empresaNome ||
                            "BEQ Empreendimentos"
                        )}

                        • Romaneio gerado pelo sistema

                    </div>

                </div>


                <script>

                    window.onload = function () {

                        setTimeout(
                            function () {

                                window.print();

                            },
                            350
                        );

                    };

                <\/script>

            </body>

            </html>

        `);

        janela.document.close();
    }


    /* ==========================================================
       MOVIMENTAÇÕES
    ========================================================== */

    renderizarMovimentacoes() {

        const tbody =
            this.elementos.listaMovimentacoes;

        if (!tbody) {
            return;
        }

        const empresaId =
            this.obterIdEmpresaAtiva();

        const pesquisa =
            String(
                this.elementos.pesquisarMovimentacao?.value ||
                ""
            )
                .toLowerCase()
                .trim();

        const lista =
            this.movimentacoes.filter(
                movimento => {

                    /*
                     * Depois da implantação
                     * multiempresa, só mostramos
                     * movimentações da empresa ativa.
                     */

                    if (
                        String(
                            movimento.empresaId || ""
                        ) !== String(
                            empresaId
                        )
                    ) {

                        return false;
                    }

                    if (!pesquisa) {
                        return true;
                    }

                    const texto =
                        [
                            movimento.data,
                            movimento.produto,
                            movimento.tipo,
                            movimento.obra,
                            movimento.observacao,
                            movimento.romaneio,
                            movimento.motorista
                        ]
                            .join(" ")
                            .toLowerCase();

                    return texto.includes(
                        pesquisa
                    );
                }
            );

        tbody.innerHTML = "";

        if (!lista.length) {

            if (
                this.elementos.estadoVazioMovimentacoes
            ) {

                this.elementos.estadoVazioMovimentacoes.hidden =
                    false;
            }

            return;
        }

        if (
            this.elementos.estadoVazioMovimentacoes
        ) {

            this.elementos.estadoVazioMovimentacoes.hidden =
                true;
        }

        lista.forEach(
            movimento => {

                const tr =
                    document.createElement(
                        "tr"
                    );

                const tipo =
                    movimento.tipo ===
                    "entrada"

                        ? `
                            <span class="status-estoque status-success">
                                Entrada
                            </span>
                          `

                        : `
                            <span class="status-estoque status-warning">
                                Distribuição
                            </span>
                          `;

                const observacao =
                    movimento.romaneio
                        ? `${movimento.romaneio}${movimento.observacao ? " • " + movimento.observacao : ""}`
                        : (
                            movimento.observacao ||
                            "—"
                        );

                tr.innerHTML = `

                    <td>
                        ${this.formatarData(
                            movimento.data
                        )}
                    </td>

                    <td>
                        <strong>
                            ${this.escape(
                                movimento.produto ||
                                "—"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${tipo}
                    </td>

                    <td>
                        ${this.formatarNumero(
                            movimento.quantidade
                        )}
                    </td>

                    <td>
                        ${this.escape(
                            movimento.obra ||
                            "Estoque Geral"
                        )}
                    </td>

                    <td>
                        ${this.escape(
                            observacao
                        )}
                    </td>

                `;

                tbody.appendChild(
                    tr
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


        /* ======================================================
           PESQUISA
        ====================================================== */

        this.elementos.pesquisar?.addEventListener(
            "input",
            () => {

                this.renderizarEstoque();
            }
        );


        /* ======================================================
           CATEGORIA
        ====================================================== */

        this.elementos.filtroCategoria?.addEventListener(
            "change",
            () => {

                this.renderizarEstoque();
            }
        );


        /* ======================================================
           MOSTRAR / OCULTAR
        ====================================================== */

        this.elementos.btnMostrarEstoque?.addEventListener(
            "click",
            () => {

                const card =
                    this.elementos.cardTabelaEstoque;

                if (!card) {
                    return;
                }

                card.classList.toggle(
                    "hidden"
                );

                const oculto =
                    card.classList.contains(
                        "hidden"
                    );

                this.elementos.btnMostrarEstoque.innerHTML =
                    oculto

                        ? `
                            <i class="fa-solid fa-eye"></i>
                            Mostrar Estoque
                          `

                        : `
                            <i class="fa-solid fa-eye-slash"></i>
                            Ocultar Estoque
                          `;
            }
        );


        /* ======================================================
           ABRIR DISTRIBUIÇÃO
        ====================================================== */

        this.elementos.btnAbrirDistribuicao?.addEventListener(
            "click",
            () => {

                if (
                    !this.verificarEmpresaAtiva()
                ) {
                    return;
                }

                this.limparDistribuicao();

                this.abrirModalDistribuicao();
            }
        );


        /* ======================================================
           FECHAR
        ====================================================== */

        this.elementos.btnFecharDistribuicao?.addEventListener(
            "click",
            () => {

                this.fecharModalDistribuicao();
            }
        );


        /* ======================================================
           CLICAR NO FUNDO
        ====================================================== */

        this.elementos.modalDistribuicao?.addEventListener(
            "click",
            evento => {

                if (
                    evento.target.matches(
                        "[data-fechar-distribuicao]"
                    )
                ) {

                    this.fecharModalDistribuicao();
                }
            }
        );


        /* ======================================================
           ESC
        ====================================================== */

        document.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key ===
                    "Escape" &&
                    this.elementos.modalDistribuicao &&
                    !this.elementos.modalDistribuicao.hidden
                ) {

                    this.fecharModalDistribuicao();
                }
            }
        );


        /* ======================================================
           ADICIONAR MATERIAL
        ====================================================== */

        this.elementos.btnAdicionarMaterial?.addEventListener(
            "click",
            () => {

                this.adicionarMaterialDistribuicao();
            }
        );


        /* ======================================================
           PRODUTO
        ====================================================== */

        this.elementos.produtoDistribuicao?.addEventListener(
            "change",
            () => {

                this.atualizarEstoqueDisponivel();
            }
        );


        /* ======================================================
           FORMULÁRIO
        ====================================================== */

        this.elementos.formDistribuicao?.addEventListener(
            "submit",
            evento => {

                this.distribuirMaterial(
                    evento
                );
            }
        );


        /* ======================================================
           CANCELAR
        ====================================================== */

        this.elementos.btnLimparDistribuicao?.addEventListener(
            "click",
            () => {

                this.limparDistribuicao();

                this.fecharModalDistribuicao();
            }
        );


        /* ======================================================
           REMOVER MATERIAL
        ====================================================== */

        this.elementos.listaMateriais?.addEventListener(
            "click",
            evento => {

                const botao =
                    evento.target.closest(
                        "[data-remover-material]"
                    );

                if (!botao) {
                    return;
                }

                const indice =
                    Number(
                        botao.dataset.removerMaterial
                    );

                this.removerMaterialDistribuicao(
                    indice
                );
            }
        );


        /* ======================================================
           DISTRIBUIR PELO ESTOQUE
        ====================================================== */

        this.elementos.listaEstoque?.addEventListener(
            "click",
            evento => {

                const botao =
                    evento.target.closest(
                        "[data-distribuir-produto]"
                    );

                if (!botao) {
                    return;
                }

                if (
                    !this.verificarEmpresaAtiva()
                ) {
                    return;
                }

                const id =
                    botao.dataset.distribuirProduto;

                this.limparDistribuicao();

                this.abrirModalDistribuicao(
                    id
                );
            }
        );


        /* ======================================================
           PESQUISA DE MOVIMENTAÇÕES
        ====================================================== */

        this.elementos.pesquisarMovimentacao?.addEventListener(
            "input",
            () => {

                this.renderizarMovimentacoes();
            }
        );
    }


    /* ==========================================================
       UTILITÁRIOS
    ========================================================== */

    gerarId() {

        if (
            window.crypto &&
            typeof window.crypto.randomUUID ===
            "function"
        ) {

            return window.crypto.randomUUID();
        }

        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }


    escape(valor) {

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
   ROUTER
========================================================== */

window.Estoque =
    Estoque;

console.log(
    "BEQ: estoque.js carregado — ETAPA 8.7."
);