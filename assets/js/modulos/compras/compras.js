/* ==========================================================
   BEQ EMPREENDIMENTOS
   MÓDULO: COMPRAS
   Arquivo: compras.js

   ETAPA 8.6 — INTEGRAÇÃO MULTIEMPRESA

   Responsabilidades:
   - Registrar compras
   - Vincular compra à empresa ativa
   - Selecionar fornecedor
   - Selecionar produtos
   - Adicionar vários itens
   - Calcular subtotais e total
   - Salvar compras
   - Atualizar estoque
   - Registrar movimentações
   - Consultar histórico
   - Pesquisar e filtrar compras

   LocalStorage:
   - beq_compras
   - beq_produtos
   - beq_fornecedores
   - beq_movimentacoes_estoque
   - beq_estoques
   - beq_empresas
   - beq_empresa_ativa

   IMPORTANTE:
   Produtos e fornecedores continuam sendo cadastros
   compartilhados.

   O estoque passa a possuir identificação da empresa.
========================================================== */


class Compras {

    constructor() {

        /* ======================================================
           CHAVES DO LOCALSTORAGE
        ====================================================== */

        this.chaveCompras = "beq_compras";

        this.chaveProdutos = "beq_produtos";

        this.chaveFornecedores = "beq_fornecedores";

        this.chaveMovimentacoes =
            "beq_movimentacoes_estoque";

        this.chaveEstoques =
            "beq_estoques";

        this.chaveEmpresas =
            "beq_empresas";

        this.chaveEmpresaAtiva =
            "beq_empresa_ativa";


        /* ======================================================
           DADOS
        ====================================================== */

        this.compras = [];

        this.produtos = [];

        this.fornecedores = [];

        this.empresas = [];

        this.estoques = [];

        this.itensCompra = [];

        this.empresaAtiva = null;

        this.elementos = {};
    }


    /* ==========================================================
       INICIALIZAÇÃO
    ========================================================== */

    init() {

        this.mapearElementos();

        this.carregarEmpresaAtiva();

        this.carregarDados();

        this.prepararData();

        this.carregarFornecedores();

        this.carregarProdutos();

        this.renderizarItens();

        this.renderizarCompras();

        this.atualizarIndicadores();

        this.eventos();

        this.mostrarAreaNovaCompra(false);

        console.log(
            "Módulo Compras inicializado."
        );

        if (this.empresaAtiva) {

            console.log(
                "Empresa ativa:",
                this.empresaAtiva.nomeFantasia ||
                this.empresaAtiva.razaoSocial ||
                this.empresaAtiva.razao ||
                this.empresaAtiva.nome
            );

        } else {

            console.warn(
                "BEQ COMPRAS: nenhuma empresa ativa."
            );
        }
    }


    /* ==========================================================
       MAPEAR ELEMENTOS
    ========================================================== */

    mapearElementos() {

        this.elementos = {

            btnNovaCompra:
                document.getElementById(
                    "btnNovaCompra"
                ),

            btnNovaCompraVazio:
                document.getElementById(
                    "btnNovaCompraVazio"
                ),

            btnAdicionarProduto:
                document.getElementById(
                    "btnAdicionarProdutoCompra"
                ),

            btnCancelarCompra:
                document.getElementById(
                    "btnCancelarCompra"
                ),

            btnFinalizarCompra:
                document.getElementById(
                    "btnFinalizarCompra"
                ),


            areaNovaCompra:
                document.getElementById(
                    "areaNovaCompra"
                ),


            fornecedor:
                document.getElementById(
                    "compraFornecedor"
                ),

            data:
                document.getElementById(
                    "compraData"
                ),

            nota:
                document.getElementById(
                    "compraNota"
                ),

            observacao:
                document.getElementById(
                    "compraObservacao"
                ),


            produto:
                document.getElementById(
                    "compraProduto"
                ),

            quantidade:
                document.getElementById(
                    "compraQuantidade"
                ),

            precoUnitario:
                document.getElementById(
                    "compraPrecoUnitario"
                ),

            subtotal:
                document.getElementById(
                    "compraSubtotal"
                ),


            listaItens:
                document.getElementById(
                    "listaItensCompra"
                ),

            cardTabelaItens:
                document.getElementById(
                    "cardTabelaItensCompra"
                ),

            estadoVazioItens:
                document.getElementById(
                    "estadoVazioItensCompra"
                ),


            totalItens:
                document.getElementById(
                    "totalItensCompra"
                ),

            totalCompra:
                document.getElementById(
                    "totalCompra"
                ),


            pesquisar:
                document.getElementById(
                    "pesquisarCompra"
                ),

            filtroFornecedor:
                document.getElementById(
                    "filtroFornecedorCompra"
                ),

            filtroData:
                document.getElementById(
                    "filtroDataCompra"
                ),

            listaCompras:
                document.getElementById(
                    "listaCompras"
                ),

            cardTabelaCompras:
                document.getElementById(
                    "cardTabelaCompras"
                ),

            estadoVazioCompras:
                document.getElementById(
                    "estadoVazioCompras"
                ),


            totalCompras:
                document.getElementById(
                    "totalCompras"
                ),

            valorTotalCompras:
                document.getElementById(
                    "valorTotalCompras"
                ),

            comprasMes:
                document.getElementById(
                    "comprasMes"
                ),

            ultimaCompra:
                document.getElementById(
                    "ultimaCompra"
                )
        };
    }


    /* ==========================================================
       EMPRESA ATIVA
    ========================================================== */

    carregarEmpresaAtiva() {

        this.empresas =
            this.lerStorage(
                this.chaveEmpresas
            );

        const idAtivo =
            localStorage.getItem(
                this.chaveEmpresaAtiva
            );

        if (!idAtivo) {

            this.empresaAtiva = null;

            return;
        }

        this.empresaAtiva =
            this.empresas.find(
                empresa =>
                    String(
                        empresa.id
                    ) === String(idAtivo)
            ) || null;


        if (!this.empresaAtiva) {

            console.warn(
                "BEQ COMPRAS: empresa ativa não encontrada."
            );

            localStorage.removeItem(
                this.chaveEmpresaAtiva
            );
        }
    }


    obterIdEmpresaAtiva() {

        if (!this.empresaAtiva) {
            return "";
        }

        return String(
            this.empresaAtiva.id || ""
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
            this.empresaAtiva.nome ||
            ""
        );
    }


    verificarEmpresaAtiva() {

        this.carregarEmpresaAtiva();

        if (!this.empresaAtiva) {

            alert(
                "Nenhuma empresa está ativa.\n\n" +
                "Selecione ou cadastre uma empresa antes " +
                "de registrar uma compra."
            );

            return false;
        }

        return true;
    }


    /* ==========================================================
       CARREGAR DADOS
    ========================================================== */

    carregarDados() {

        this.compras =
            this.lerStorage(
                this.chaveCompras
            );

        this.produtos =
            this.lerStorage(
                this.chaveProdutos
            );

        this.fornecedores =
            this.lerStorage(
                this.chaveFornecedores
            );

        this.estoques =
            this.lerStorage(
                this.chaveEstoques
            );
    }


    /* ==========================================================
       LEITURA SEGURA
    ========================================================== */

    lerStorage(chave) {

        try {

            const dados =
                localStorage.getItem(chave);

            if (!dados) {
                return [];
            }

            const convertido =
                JSON.parse(dados);

            return Array.isArray(convertido)
                ? convertido
                : [];

        } catch (erro) {

            console.error(
                "Erro ao ler LocalStorage:",
                chave,
                erro
            );

            return [];
        }
    }


    /* ==========================================================
       SALVAR
    ========================================================== */

    salvarCompras() {

        localStorage.setItem(
            this.chaveCompras,
            JSON.stringify(
                this.compras
            )
        );
    }


    salvarProdutos() {

        localStorage.setItem(
            this.chaveProdutos,
            JSON.stringify(
                this.produtos
            )
        );
    }


    salvarEstoques() {

        localStorage.setItem(
            this.chaveEstoques,
            JSON.stringify(
                this.estoques
            )
        );
    }


    salvarMovimentacoes(
        movimentacoes
    ) {

        localStorage.setItem(
            this.chaveMovimentacoes,
            JSON.stringify(
                movimentacoes
            )
        );
    }


    /* ==========================================================
       PREPARAR DATA
    ========================================================== */

    prepararData() {

        if (!this.elementos.data) {
            return;
        }

        this.elementos.data.value =
            this.dataAtual();
    }


    /* ==========================================================
       CARREGAR FORNECEDORES
    ========================================================== */

    carregarFornecedores() {

        const selects = [

            this.elementos.fornecedor,

            this.elementos.filtroFornecedor
        ];


        selects.forEach(select => {

            if (!select) {
                return;
            }

            const valorAtual =
                select.value;

            const primeiraOpcao =
                select ===
                this.elementos.fornecedor

                    ? "Selecione o fornecedor"

                    : "Todos os fornecedores";


            select.innerHTML =
                `<option value="">
                    ${primeiraOpcao}
                </option>`;


            this.fornecedores.forEach(
                fornecedor => {

                    if (!fornecedor) {
                        return;
                    }


                    const id =
                        fornecedor.id ||
                        fornecedor.codigo ||
                        fornecedor.nome ||
                        "";


                    const nome =
                        fornecedor.nome ||
                        fornecedor.razaoSocial ||
                        fornecedor.nomeFantasia ||
                        fornecedor.razao ||
                        "Fornecedor sem nome";


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value = id;

                    option.textContent = nome;


                    select.appendChild(
                        option
                    );
                }
            );


            if (
                valorAtual &&
                [...select.options].some(
                    option =>
                        option.value ===
                        valorAtual
                )
            ) {

                select.value =
                    valorAtual;
            }

        });
    }


    /* ==========================================================
       OBTER ESTOQUE DO PRODUTO NA EMPRESA
    ========================================================== */

    obterEstoqueEmpresa(
        produtoId
    ) {

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {
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


    /* ==========================================================
       GARANTIR REGISTRO DE ESTOQUE
    ========================================================== */

    obterOuCriarEstoqueEmpresa(
        produto
    ) {

        const empresaId =
            this.obterIdEmpresaAtiva();

        if (!empresaId) {
            return null;
        }


        const produtoId =
            String(
                produto.id ||
                produto.codigo ||
                produto.nome ||
                ""
            );


        let registro =
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
                        produtoId
                    );
                }
            );


        if (!registro) {

            registro = {

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

                unidade:
                    produto.unidade || "UN",

                quantidade:
                    0,

                estoqueMinimo:
                    Number(
                        produto.estoqueMinimo
                    ) || 0
            };


            this.estoques.push(
                registro
            );
        }


        return registro;
    }


    /* ==========================================================
       CARREGAR PRODUTOS
    ========================================================== */

    carregarProdutos() {

        const select =
            this.elementos.produto;

        if (!select) {
            return;
        }


        select.innerHTML =
            `<option value="">
                Selecione o produto
            </option>`;


        this.produtos.forEach(
            produto => {

                if (!produto) {
                    return;
                }


                const id =
                    produto.id ||
                    produto.codigo ||
                    produto.nome ||
                    "";


                const estoqueEmpresa =
                    this.obterEstoqueEmpresa(
                        id
                    );


                const option =
                    document.createElement(
                        "option"
                    );


                option.value = id;


                option.textContent =
                    `${produto.nome || "Produto"} — estoque: ${
                        this.formatarNumero(
                            estoqueEmpresa
                        )
                    }`;


                select.appendChild(
                    option
                );
            }
        );
    }


    /* ==========================================================
       PRODUTO SELECIONADO
    ========================================================== */

    obterProdutoSelecionado() {

        const valor =
            this.elementos.produto?.value;

        if (!valor) {
            return null;
        }


        return this.produtos.find(
            produto => {

                return String(
                    produto.id ||
                    produto.codigo ||
                    produto.nome ||
                    ""
                ) ===
                String(valor);
            }
        ) || null;
    }


    /* ==========================================================
       ATUALIZAR PREÇO
    ========================================================== */

    atualizarPrecoProduto() {

        const produto =
            this.obterProdutoSelecionado();


        if (!produto) {

            if (this.elementos.precoUnitario) {
                this.elementos.precoUnitario.value =
                    "";
            }

            if (this.elementos.subtotal) {
                this.elementos.subtotal.value =
                    "";
            }

            return;
        }


        const preco =
            Number(
                produto.preco
            ) || 0;


        this.elementos.precoUnitario.value =
            preco.toFixed(2);


        this.calcularSubtotal();
    }


    /* ==========================================================
       CALCULAR SUBTOTAL
    ========================================================== */

    calcularSubtotal() {

        const quantidade =
            Number(
                this.elementos.quantidade?.value
            ) || 0;


        const preco =
            Number(
                this.elementos.precoUnitario?.value
            ) || 0;


        const subtotal =
            quantidade * preco;


        if (this.elementos.subtotal) {

            this.elementos.subtotal.value =
                this.formatarMoeda(
                    subtotal
                );
        }


        return subtotal;
    }


    /* ==========================================================
       ADICIONAR PRODUTO
    ========================================================== */

    adicionarProduto() {

        const produto =
            this.obterProdutoSelecionado();


        const quantidade =
            Number(
                this.elementos.quantidade?.value
            );


        const preco =
            Number(
                this.elementos.precoUnitario?.value
            );


        if (!produto) {

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


        if (
            !Number.isFinite(
                preco
            ) ||
            preco <= 0
        ) {

            alert(
                "Informe um preço unitário válido."
            );

            return;
        }


        const subtotal =
            quantidade * preco;


        const produtoId =
            produto.id ||
            produto.codigo ||
            produto.nome;


        const itemExistente =
            this.itensCompra.find(
                item =>
                    String(
                        item.produtoId
                    ) ===
                    String(
                        produtoId
                    )
            );


        if (itemExistente) {

            itemExistente.quantidade +=
                quantidade;

            itemExistente.subtotal =
                itemExistente.quantidade *
                itemExistente.precoUnitario;

        } else {

            this.itensCompra.push({

                produtoId:
                    produtoId,

                codigo:
                    produto.codigo || "",

                produto:
                    produto.nome || "",

                unidade:
                    produto.unidade || "UN",

                quantidade:
                    quantidade,

                precoUnitario:
                    preco,

                subtotal:
                    subtotal
            });
        }


        this.renderizarItens();

        this.limparItem();

        this.elementos.produto?.focus();
    }


    /* ==========================================================
       RENDERIZAR ITENS
    ========================================================== */

    renderizarItens() {

        const tbody =
            this.elementos.listaItens;

        if (!tbody) {
            return;
        }


        tbody.innerHTML = "";


        if (
            this.itensCompra.length === 0
        ) {

            if (
                this.elementos.cardTabelaItens
            ) {

                this.elementos.cardTabelaItens.hidden =
                    true;
            }


            if (
                this.elementos.estadoVazioItens
            ) {

                this.elementos.estadoVazioItens.hidden =
                    false;
            }


            this.atualizarResumo();

            return;
        }


        if (
            this.elementos.cardTabelaItens
        ) {

            this.elementos.cardTabelaItens.hidden =
                false;
        }


        if (
            this.elementos.estadoVazioItens
        ) {

            this.elementos.estadoVazioItens.hidden =
                true;
        }


        this.itensCompra.forEach(
            (item, indice) => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        <strong>
                            ${this.escape(
                                item.codigo || "—"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${this.escape(
                            item.produto || "—"
                        )}
                    </td>

                    <td>
                        ${this.formatarNumero(
                            item.quantidade
                        )}
                    </td>

                    <td>
                        ${this.formatarMoeda(
                            item.precoUnitario
                        )}
                    </td>

                    <td>
                        <strong>
                            ${this.formatarMoeda(
                                item.subtotal
                            )}
                        </strong>
                    </td>

                    <td>

                        <div class="compras-tabela-acoes">

                            <button
                                type="button"
                                class="btn-remover-item"
                                data-indice="${indice}"
                                title="Remover item"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>

                    </td>
                `;


                tbody.appendChild(
                    tr
                );
            }
        );


        this.atualizarResumo();
    }


    /* ==========================================================
       REMOVER ITEM
    ========================================================== */

    removerItem(indice) {

        if (
            indice < 0 ||
            indice >= this.itensCompra.length
        ) {
            return;
        }


        this.itensCompra.splice(
            indice,
            1
        );


        this.renderizarItens();
    }


    /* ==========================================================
       LIMPAR ITEM
    ========================================================== */

    limparItem() {

        if (this.elementos.produto) {
            this.elementos.produto.value =
                "";
        }

        if (this.elementos.quantidade) {
            this.elementos.quantidade.value =
                "";
        }

        if (this.elementos.precoUnitario) {
            this.elementos.precoUnitario.value =
                "";
        }

        if (this.elementos.subtotal) {
            this.elementos.subtotal.value =
                "";
        }
    }


    /* ==========================================================
       RESUMO
    ========================================================== */

    atualizarResumo() {

        const quantidadeTotal =
            this.itensCompra.reduce(
                (total, item) => {

                    return total +
                        (
                            Number(
                                item.quantidade
                            ) || 0
                        );

                },
                0
            );


        const valorTotal =
            this.itensCompra.reduce(
                (total, item) => {

                    return total +
                        (
                            Number(
                                item.subtotal
                            ) || 0
                        );

                },
                0
            );


        if (this.elementos.totalItens) {

            this.elementos.totalItens.textContent =
                this.formatarNumero(
                    quantidadeTotal
                );
        }


        if (this.elementos.totalCompra) {

            this.elementos.totalCompra.textContent =
                this.formatarMoeda(
                    valorTotal
                );
        }
    }


    /* ==========================================================
       NOVA COMPRA
    ========================================================== */

    novaCompra() {

        if (
            !this.verificarEmpresaAtiva()
        ) {
            return;
        }


        this.itensCompra = [];


        this.limparFormularioCompra();


        this.prepararData();


        this.renderizarItens();


        this.mostrarAreaNovaCompra(
            true
        );
    }


    /* ==========================================================
       CANCELAR
    ========================================================== */

    cancelarCompra() {

        if (
            this.itensCompra.length > 0
        ) {

            const confirmar =
                confirm(
                    "Deseja cancelar esta compra?\n\n" +
                    "Os itens adicionados serão perdidos."
                );


            if (!confirmar) {
                return;
            }
        }


        this.itensCompra = [];


        this.limparFormularioCompra();


        this.renderizarItens();


        this.mostrarAreaNovaCompra(
            false
        );
    }


    /* ==========================================================
       MOSTRAR / OCULTAR ÁREA
    ========================================================== */

    mostrarAreaNovaCompra(
        mostrar
    ) {

        if (
            !this.elementos.areaNovaCompra
        ) {
            return;
        }


        this.elementos.areaNovaCompra.hidden =
            !mostrar;
    }


    /* ==========================================================
       LIMPAR FORMULÁRIO
    ========================================================== */

    limparFormularioCompra() {

        if (this.elementos.fornecedor) {
            this.elementos.fornecedor.value =
                "";
        }


        if (this.elementos.nota) {
            this.elementos.nota.value =
                "";
        }


        if (this.elementos.observacao) {
            this.elementos.observacao.value =
                "";
        }


        this.limparItem();
    }


    /* ==========================================================
       FINALIZAR COMPRA
    ========================================================== */

    finalizarCompra() {

        /* ------------------------------------------------------
           EMPRESA ATIVA
        ------------------------------------------------------ */

        if (
            !this.verificarEmpresaAtiva()
        ) {
            return;
        }


        const empresaId =
            this.obterIdEmpresaAtiva();


        const empresaNome =
            this.obterNomeEmpresaAtiva();


        const fornecedorId =
            this.elementos.fornecedor?.value;


        const data =
            this.elementos.data?.value ||
            this.dataAtual();


        const nota =
            this.elementos.nota?.value
                ?.trim() || "";


        const observacao =
            this.elementos.observacao?.value
                ?.trim() || "";


        /* ------------------------------------------------------
           VALIDAÇÕES
        ------------------------------------------------------ */

        if (!fornecedorId) {

            alert(
                "Selecione o fornecedor."
            );

            return;
        }


        if (
            this.itensCompra.length === 0
        ) {

            alert(
                "Adicione pelo menos um produto à compra."
            );

            return;
        }


        const fornecedor =
            this.fornecedores.find(
                item => {

                    return String(
                        item.id ||
                        item.codigo ||
                        item.nome ||
                        ""
                    ) ===
                    String(
                        fornecedorId
                    );
                }
            );


        if (!fornecedor) {

            alert(
                "Fornecedor não encontrado."
            );

            return;
        }


        const nomeFornecedor =
            fornecedor.nome ||
            fornecedor.razaoSocial ||
            fornecedor.nomeFantasia ||
            fornecedor.razao ||
            "Fornecedor";


        const total =
            this.itensCompra.reduce(
                (soma, item) => {

                    return soma +
                        (
                            Number(
                                item.subtotal
                            ) || 0
                        );

                },
                0
            );


        /* ------------------------------------------------------
           CONFIRMAÇÃO
        ------------------------------------------------------ */

        const confirmar =
            confirm(

                `Confirmar compra?\n\n` +

                `Empresa: ${empresaNome}\n` +

                `Fornecedor: ${nomeFornecedor}\n` +

                `Itens: ${this.itensCompra.length}\n` +

                `Total: ${this.formatarMoeda(total)}\n\n` +

                `O estoque da empresa será atualizado automaticamente.`
            );


        if (!confirmar) {
            return;
        }


        /* ------------------------------------------------------
           ID DA COMPRA
        ------------------------------------------------------ */

        const compraId =
            this.gerarId();


        /* ------------------------------------------------------
           CRIAR COMPRA
        ------------------------------------------------------ */

        const compra = {

            id:
                compraId,

            data:
                data,

            empresaId:
                empresaId,

            empresaNome:
                empresaNome,

            fornecedorId:
                fornecedorId,

            fornecedor:
                nomeFornecedor,

            nota:
                nota,

            observacao:
                observacao,

            itens:
                JSON.parse(
                    JSON.stringify(
                        this.itensCompra
                    )
                ),

            quantidadeItens:
                this.itensCompra.reduce(
                    (totalQuantidade, item) => {

                        return totalQuantidade +
                            (
                                Number(
                                    item.quantidade
                                ) || 0
                            );

                    },
                    0
                ),

            total:
                total
        };


        /* ------------------------------------------------------
           MOVIMENTAÇÕES
        ------------------------------------------------------ */

        const movimentacoes =
            this.lerStorage(
                this.chaveMovimentacoes
            );


        /* ------------------------------------------------------
           PROCESSAR CADA ITEM
        ------------------------------------------------------ */

        this.itensCompra.forEach(
            itemCompra => {

                const produto =
                    this.localizarProduto(
                        itemCompra.produtoId
                    );


                if (!produto) {

                    console.error(
                        "BEQ COMPRAS: produto não encontrado.",
                        itemCompra
                    );

                    return;
                }


                const quantidadeEntrada =
                    Number(
                        itemCompra.quantidade
                    ) || 0;


                if (
                    quantidadeEntrada <= 0
                ) {

                    console.warn(
                        "BEQ COMPRAS: quantidade inválida.",
                        itemCompra
                    );

                    return;
                }


                /* ==============================================
                   ESTOQUE POR EMPRESA
                ============================================== */

                const estoqueEmpresa =
                    this.obterOuCriarEstoqueEmpresa(
                        produto
                    );


                if (estoqueEmpresa) {

                    const estoqueAnterior =
                        Number(
                            estoqueEmpresa.quantidade
                        ) || 0;


                    estoqueEmpresa.quantidade =
                        estoqueAnterior +
                        quantidadeEntrada;


                    estoqueEmpresa.produto =
                        produto.nome || "";


                    estoqueEmpresa.codigo =
                        produto.codigo || "";


                    estoqueEmpresa.empresaId =
                        empresaId;


                    estoqueEmpresa.empresaNome =
                        empresaNome;
                }



                /* ==============================================
                   MOVIMENTAÇÃO
                ============================================== */

                movimentacoes.unshift({

                    id:
                        this.gerarId(),

                    data:
                        data,

                    empresaId:
                        empresaId,

                    empresaNome:
                        empresaNome,

                    produtoId:
                        produto.id ||
                        produto.codigo ||
                        produto.nome,

                    produto:
                        produto.nome ||
                        itemCompra.produto ||
                        "",

                    tipo:
                        "entrada",

                    quantidade:
                        quantidadeEntrada,

                    obraId:
                        "",

                    obra:
                        "Estoque Geral",

                    observacao:
                        `Compra ${
                            nota
                                ? "NF " + nota
                                : ""
                        }`.trim(),

                    compraId:
                        compraId,

                    fornecedorId:
                        fornecedorId,

                    fornecedor:
                        nomeFornecedor,

                    precoUnitario:
                        Number(
                            itemCompra.precoUnitario
                        ) || 0,

                    valor:
                        Number(
                            itemCompra.subtotal
                        ) || 0
                });
            }
        );


        /* ------------------------------------------------------
           SALVAR COMPRA
        ------------------------------------------------------ */

        this.compras.unshift(
            compra
        );


        this.salvarCompras();


        this.salvarProdutos();


        this.salvarEstoques();


        this.salvarMovimentacoes(
            movimentacoes
        );


        /* ------------------------------------------------------
           ATUALIZAR INTERFACE
        ------------------------------------------------------ */

        this.itensCompra = [];


        this.limparFormularioCompra();


        this.renderizarItens();


        this.renderizarCompras();


        this.atualizarIndicadores();


        this.carregarProdutos();


        this.mostrarAreaNovaCompra(
            false
        );


        alert(

            `Compra registrada com sucesso!\n\n` +

            `Empresa: ${empresaNome}\n` +

            `Fornecedor: ${nomeFornecedor}\n` +

            `Total: ${this.formatarMoeda(total)}\n\n` +

            `O estoque da empresa foi atualizado.`
        );
    }


    /* ==========================================================
       LOCALIZAR PRODUTO
    ========================================================== */

    localizarProduto(
        produtoId
    ) {

        const valor =
            String(
                produtoId ?? ""
            );


        return this.produtos.find(
            produto => {

                if (!produto) {
                    return false;
                }


                const id =
                    String(
                        produto.id ?? ""
                    );


                const codigo =
                    String(
                        produto.codigo ?? ""
                    );


                const nome =
                    String(
                        produto.nome ?? ""
                    );


                return (

                    id === valor

                    ||

                    (
                        !id &&
                        codigo === valor
                    )

                    ||

                    (
                        !id &&
                        !codigo &&
                        nome === valor
                    )
                );
            }
        ) || null;
    }


    /* ==========================================================
       RENDERIZAR HISTÓRICO
    ========================================================== */

    renderizarCompras() {

        const tbody =
            this.elementos.listaCompras;


        if (!tbody) {
            return;
        }


        const empresaId =
            this.obterIdEmpresaAtiva();


        const pesquisa =
            (
                this.elementos.pesquisar?.value ||
                ""
            )
            .toLowerCase()
            .trim();


        const fornecedorSelecionado =
            this.elementos.filtroFornecedor?.value ||
            "";


        const dataSelecionada =
            this.elementos.filtroData?.value ||
            "";


        /* ------------------------------------------------------
           FILTRAR PELA EMPRESA ATIVA
        ------------------------------------------------------ */

        const comprasEmpresa =
            empresaId

                ? this.compras.filter(
                    compra =>
                        String(
                            compra.empresaId || ""
                        ) ===
                        String(
                            empresaId
                        )
                )

                : [];


        const comprasFiltradas =
            comprasEmpresa.filter(
                compra => {

                    const fornecedor =
                        String(
                            compra.fornecedor ||
                            ""
                        )
                        .toLowerCase();


                    const nota =
                        String(
                            compra.nota ||
                            ""
                        )
                        .toLowerCase();


                    const correspondePesquisa =

                        !pesquisa

                        ||

                        fornecedor.includes(
                            pesquisa
                        )

                        ||

                        nota.includes(
                            pesquisa
                        )

                        ||

                        String(
                            compra.id || ""
                        )
                        .toLowerCase()
                        .includes(
                            pesquisa
                        );


                    const correspondeFornecedor =

                        !fornecedorSelecionado

                        ||

                        String(
                            compra.fornecedorId ||
                            ""
                        ) ===
                        String(
                            fornecedorSelecionado
                        );


                    const correspondeData =

                        !dataSelecionada

                        ||

                        String(
                            compra.data ||
                            ""
                        ) ===
                        String(
                            dataSelecionada
                        );


                    return (

                        correspondePesquisa &&

                        correspondeFornecedor &&

                        correspondeData
                    );
                }
            );


        tbody.innerHTML = "";


        if (
            comprasFiltradas.length === 0
        ) {

            if (
                this.elementos.cardTabelaCompras
            ) {

                this.elementos.cardTabelaCompras.hidden =
                    true;
            }


            if (
                this.elementos.estadoVazioCompras
            ) {

                this.elementos.estadoVazioCompras.hidden =
                    false;
            }


            return;
        }


        if (
            this.elementos.cardTabelaCompras
        ) {

            this.elementos.cardTabelaCompras.hidden =
                false;
        }


        if (
            this.elementos.estadoVazioCompras
        ) {

            this.elementos.estadoVazioCompras.hidden =
                true;
        }


        comprasFiltradas.forEach(
            compra => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                const quantidadeItens =
                    Number(
                        compra.quantidadeItens
                    ) ||

                    (
                        Array.isArray(
                            compra.itens
                        )

                            ? compra.itens.reduce(
                                (total, item) => {

                                    return total +
                                        (
                                            Number(
                                                item.quantidade
                                            ) || 0
                                        );

                                },
                                0
                            )

                            : 0
                    );


                tr.innerHTML = `

                    <td>
                        <strong>
                            ${this.escape(
                                this.formatarData(
                                    compra.data
                                )
                            )}
                        </strong>
                    </td>

                    <td>
                        ${this.escape(
                            compra.fornecedor ||
                            "—"
                        )}
                    </td>

                    <td>
                        ${this.escape(
                            compra.nota ||
                            "—"
                        )}
                    </td>

                    <td>
                        ${this.formatarNumero(
                            quantidadeItens
                        )}
                    </td>

                    <td>
                        <strong class="compras-valor">
                            ${this.formatarMoeda(
                                compra.total
                            )}
                        </strong>
                    </td>

                    <td>
                        <span class="compras-status">
                            Concluída
                        </span>
                    </td>

                    <td>

                        <div class="compras-tabela-acoes">

                            <button
                                type="button"
                                class="btn-ver-compra"
                                data-id="${this.escape(
                                    compra.id
                                )}"
                                title="Ver compra"
                            >
                                <i class="fa-solid fa-eye"></i>
                            </button>


                            <button
                                type="button"
                                class="btn-excluir-compra"
                                data-id="${this.escape(
                                    compra.id
                                )}"
                                title="Excluir compra"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>

                    </td>
                `;


                tbody.appendChild(
                    tr
                );
            }
        );
    }


    /* ==========================================================
       VER COMPRA
    ========================================================== */

    verCompra(id) {

        const compra =
            this.compras.find(
                item =>
                    String(
                        item.id
                    ) ===
                    String(id)
            );


        if (!compra) {

            alert(
                "Compra não encontrada."
            );

            return;
        }


        /* ------------------------------------------------------
           GARANTIR EMPRESA ATIVA
        ------------------------------------------------------ */

        const empresaId =
            this.obterIdEmpresaAtiva();


        if (
            empresaId &&
            compra.empresaId &&
            String(
                compra.empresaId
            ) !==
            String(
                empresaId
            )
        ) {

            alert(
                "Esta compra pertence a outra empresa."
            );

            return;
        }


        let mensagem =

            `COMPRA\n\n` +

            `Empresa: ${
                compra.empresaNome ||
                "Não informada"
            }\n` +

            `Data: ${
                this.formatarData(
                    compra.data
                )
            }\n` +

            `Fornecedor: ${
                compra.fornecedor ||
                "—"
            }\n` +

            `Nota: ${
                compra.nota ||
                "—"
            }\n\n` +

            `ITENS:\n`;


        (
            compra.itens || []
        )
        .forEach(
            item => {

                mensagem +=

                    `• ${
                        item.produto
                    } — ` +

                    `${
                        this.formatarNumero(
                            item.quantidade
                        )
                    } x ` +

                    `${
                        this.formatarMoeda(
                            item.precoUnitario
                        )
                    } = ` +

                    `${
                        this.formatarMoeda(
                            item.subtotal
                        )
                    }\n`;
            }
        );


        mensagem +=

            `\nTOTAL: ${
                this.formatarMoeda(
                    compra.total
                )
            }`;


        if (
            compra.observacao
        ) {

            mensagem +=

                `\n\nObservação: ${
                    compra.observacao
                }`;
        }


        alert(
            mensagem
        );
    }


    /* ==========================================================
       EXCLUIR COMPRA
       
       IMPORTANTE:
       A exclusão NÃO desfaz o estoque.
    ========================================================== */

    excluirCompra(id) {

        const indice =
            this.compras.findIndex(
                compra =>
                    String(
                        compra.id
                    ) ===
                    String(id)
            );


        if (indice === -1) {

            alert(
                "Compra não encontrada."
            );

            return;
        }


        const compra =
            this.compras[indice];


        const empresaId =
            this.obterIdEmpresaAtiva();


        if (
            empresaId &&
            compra.empresaId &&
            String(
                compra.empresaId
            ) !==
            String(
                empresaId
            )
        ) {

            alert(
                "Esta compra pertence a outra empresa."
            );

            return;
        }


        const confirmar =
            confirm(

                `Excluir esta compra?\n\n` +

                `Empresa: ${
                    compra.empresaNome ||
                    "—"
                }\n` +

                `Fornecedor: ${
                    compra.fornecedor ||
                    "—"
                }\n` +

                `Total: ${
                    this.formatarMoeda(
                        compra.total
                    )
                }\n\n` +

                `A exclusão do registro não alterará o estoque.`
            );


        if (!confirmar) {
            return;
        }


        this.compras.splice(
            indice,
            1
        );


        this.salvarCompras();


        this.renderizarCompras();


        this.atualizarIndicadores();


        alert(
            "Registro da compra excluído."
        );
    }


    /* ==========================================================
       INDICADORES
    ========================================================== */

    atualizarIndicadores() {

        const empresaId =
            this.obterIdEmpresaAtiva();


        const comprasEmpresa =
            empresaId

                ? this.compras.filter(
                    compra =>
                        String(
                            compra.empresaId || ""
                        ) ===
                        String(
                            empresaId
                        )
                )

                : [];


        const total =
            comprasEmpresa.length;


        const valorTotal =
            comprasEmpresa.reduce(
                (soma, compra) => {

                    return soma +
                        (
                            Number(
                                compra.total
                            ) || 0
                        );

                },
                0
            );


        const hoje =
            new Date();


        const anoAtual =
            hoje.getFullYear();


        const mesAtual =
            hoje.getMonth();


        const comprasDoMes =
            comprasEmpresa.filter(
                compra => {

                    const data =
                        this.converterData(
                            compra.data
                        );


                    if (!data) {
                        return false;
                    }


                    return (

                        data.getFullYear() ===
                        anoAtual

                        &&

                        data.getMonth() ===
                        mesAtual
                    );
                }
            );


        const ultima =
            comprasEmpresa.length > 0
                ? comprasEmpresa[0]
                : null;


        if (
            this.elementos.totalCompras
        ) {

            this.elementos.totalCompras.textContent =
                this.formatarNumero(
                    total
                );
        }


        if (
            this.elementos.valorTotalCompras
        ) {

            this.elementos.valorTotalCompras.textContent =
                this.formatarMoeda(
                    valorTotal
                );
        }


        if (
            this.elementos.comprasMes
        ) {

            this.elementos.comprasMes.textContent =
                this.formatarNumero(
                    comprasDoMes.length
                );
        }


        if (
            this.elementos.ultimaCompra
        ) {

            this.elementos.ultimaCompra.textContent =

                ultima

                    ? this.formatarData(
                        ultima.data
                    )

                    : "—";
        }
    }


    /* ==========================================================
       EVENTOS
    ========================================================== */

    eventos() {

        /* ------------------------------------------------------
           NOVA COMPRA
        ------------------------------------------------------ */

        this.elementos.btnNovaCompra
            ?.addEventListener(
                "click",
                () => {
                    this.novaCompra();
                }
            );


        this.elementos.btnNovaCompraVazio
            ?.addEventListener(
                "click",
                () => {
                    this.novaCompra();
                }
            );


        /* ------------------------------------------------------
           ADICIONAR PRODUTO
        ------------------------------------------------------ */

        this.elementos.btnAdicionarProduto
            ?.addEventListener(
                "click",
                () => {
                    this.adicionarProduto();
                }
            );


        /* ------------------------------------------------------
           PRODUTO ALTERADO
        ------------------------------------------------------ */

        this.elementos.produto
            ?.addEventListener(
                "change",
                () => {
                    this.atualizarPrecoProduto();
                }
            );


        /* ------------------------------------------------------
           QUANTIDADE
        ------------------------------------------------------ */

        this.elementos.quantidade
            ?.addEventListener(
                "input",
                () => {
                    this.calcularSubtotal();
                }
            );


        /* ------------------------------------------------------
           PREÇO
        ------------------------------------------------------ */

        this.elementos.precoUnitario
            ?.addEventListener(
                "input",
                () => {
                    this.calcularSubtotal();
                }
            );


        /* ------------------------------------------------------
           CANCELAR
        ------------------------------------------------------ */

        this.elementos.btnCancelarCompra
            ?.addEventListener(
                "click",
                () => {
                    this.cancelarCompra();
                }
            );


        /* ------------------------------------------------------
           FINALIZAR
        ------------------------------------------------------ */

        this.elementos.btnFinalizarCompra
            ?.addEventListener(
                "click",
                () => {
                    this.finalizarCompra();
                }
            );


        /* ------------------------------------------------------
           TABELA DE ITENS
        ------------------------------------------------------ */

        this.elementos.listaItens
            ?.addEventListener(
                "click",
                evento => {

                    const botao =
                        evento.target.closest(
                            ".btn-remover-item"
                        );


                    if (!botao) {
                        return;
                    }


                    const indice =
                        Number(
                            botao.dataset.indice
                        );


                    this.removerItem(
                        indice
                    );
                }
            );


        /* ------------------------------------------------------
           TABELA DE COMPRAS
        ------------------------------------------------------ */

        this.elementos.listaCompras
            ?.addEventListener(
                "click",
                evento => {

                    const botao =
                        evento.target.closest(
                            "button"
                        );


                    if (!botao) {
                        return;
                    }


                    const id =
                        botao.dataset.id;


                    if (
                        botao.classList.contains(
                            "btn-ver-compra"
                        )
                    ) {

                        this.verCompra(
                            id
                        );

                        return;
                    }


                    if (
                        botao.classList.contains(
                            "btn-excluir-compra"
                        )
                    ) {

                        this.excluirCompra(
                            id
                        );
                    }
                }
            );


        /* ------------------------------------------------------
           PESQUISA
        ------------------------------------------------------ */

        this.elementos.pesquisar
            ?.addEventListener(
                "input",
                () => {
                    this.renderizarCompras();
                }
            );


        /* ------------------------------------------------------
           FILTRO FORNECEDOR
        ------------------------------------------------------ */

        this.elementos.filtroFornecedor
            ?.addEventListener(
                "change",
                () => {
                    this.renderizarCompras();
                }
            );


        /* ------------------------------------------------------
           FILTRO DATA
        ------------------------------------------------------ */

        this.elementos.filtroData
            ?.addEventListener(
                "change",
                () => {
                    this.renderizarCompras();
                }
            );
    }


    /* ==========================================================
       FORMATAR MOEDA
    ========================================================== */

    formatarMoeda(valor) {

        return Number(
            valor || 0
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    /* ==========================================================
       FORMATAR NÚMERO
    ========================================================== */

    formatarNumero(valor) {

        return Number(
            valor || 0
        ).toLocaleString(
            "pt-BR"
        );
    }


    /* ==========================================================
       FORMATAR DATA
    ========================================================== */

    formatarData(data) {

        if (!data) {
            return "—";
        }


        const partes =
            String(data).split("-");


        if (
            partes.length === 3 &&
            partes[0].length === 4
        ) {

            return (

                `${partes[2]}/` +
                `${partes[1]}/` +
                `${partes[0]}`
            );
        }


        const convertido =
            new Date(data);


        if (
            Number.isNaN(
                convertido.getTime()
            )
        ) {

            return String(data);
        }


        return convertido.toLocaleDateString(
            "pt-BR"
        );
    }


    /* ==========================================================
       CONVERTER DATA
    ========================================================== */

    converterData(data) {

        if (!data) {
            return null;
        }


        const partes =
            String(data).split("-");


        if (
            partes.length === 3 &&
            partes[0].length === 4
        ) {

            const ano =
                Number(
                    partes[0]
                );


            const mes =
                Number(
                    partes[1]
                ) - 1;


            const dia =
                Number(
                    partes[2]
                );


            const resultado =
                new Date(
                    ano,
                    mes,
                    dia
                );


            return Number.isNaN(
                resultado.getTime()
            )
                ? null
                : resultado;
        }


        const resultado =
            new Date(data);


        return Number.isNaN(
            resultado.getTime()
        )
            ? null
            : resultado;
    }


    /* ==========================================================
       DATA ATUAL
    ========================================================== */

    dataAtual() {

        const hoje =
            new Date();


        const ano =
            hoje.getFullYear();


        const mes =
            String(
                hoje.getMonth() + 1
            )
            .padStart(
                2,
                "0"
            );


        const dia =
            String(
                hoje.getDate()
            )
            .padStart(
                2,
                "0"
            );


        return (
            `${ano}-${mes}-${dia}`
        );
    }


    /* ==========================================================
       GERAR ID
    ========================================================== */

    gerarId() {

        return (

            Date.now().toString(36) +

            Math.random()
                .toString(36)
                .substring(2, 8)
        );
    }


    /* ==========================================================
       ESCAPAR HTML
    ========================================================== */

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
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Compras =
    Compras;