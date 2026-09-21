/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo Produtos
   Arquivo: produtos.js
========================================================== */

class Produtos {

    /* ======================================================
       CONSTRUTOR
    ====================================================== */

    constructor() {

        /* LocalStorage */
        this.storage = "beq_produtos";

        /* Multiempresa */
        this.storageEstoques = "beq_estoques";
        this.storageEmpresas = "beq_empresas";
        this.storageEmpresaAtiva = "beq_empresa_ativa";

        /* Dados */
        this.produtos = [];
        this.estoques = [];
        this.empresas = [];
        this.empresaAtiva = null;

        /* Controle de edição */
        this.produtoEditando = null;

        /* Elementos da interface */
        this.cacheElementos();
    }


    /* ======================================================
       CACHE DOS ELEMENTOS
    ====================================================== */

    cacheElementos() {

        /* --------------------------------------------------
           Modal Produto
        -------------------------------------------------- */

        this.modal = document.getElementById("modalProduto");

        this.btnNovo = document.getElementById("btnNovoProduto");

        this.btnSalvar = document.getElementById("salvarProduto");

        this.btnCancelar = document.getElementById("cancelarProduto");

        this.btnFechar = document.getElementById("fecharModalProduto");


        /* --------------------------------------------------
           Campos do Produto
        -------------------------------------------------- */

        this.codigo = document.getElementById("produtoCodigo");

        this.nome = document.getElementById("produtoNome");

        this.categoria = document.getElementById("produtoCategoria");

        this.preco = document.getElementById("produtoPreco");

        this.marca = document.getElementById("produtoMarca");

        this.estoqueMinimo =
            document.getElementById("produtoEstoqueMinimo");


        /* --------------------------------------------------
           Pesquisa
        -------------------------------------------------- */

        this.busca =
            document.getElementById("pesquisarProduto");


        /* --------------------------------------------------
           Tabela
        -------------------------------------------------- */

        this.tabela =
            document.getElementById("listaProdutos");

        this.cardTabela =
            document.getElementById("cardTabelaProdutos");

        this.btnMostrarProdutos =
            document.getElementById("btnMostrarProdutos");
    }


    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

    init() {

        if (!this.tabela) return;

        this.carregar();

        this.carregarEmpresaAtiva();

        this.carregarEstoques();

        this.carregarCategorias();

        this.renderizar();

        this.eventos();
    }


    /* ======================================================
       LOCALSTORAGE
    ====================================================== */

    carregar() {

        try {

            const dados =
                localStorage.getItem(this.storage);

            this.produtos =
                dados ? JSON.parse(dados) : [];

            if (!Array.isArray(this.produtos)) {

                this.produtos = [];

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

            this.produtos = [];
        }
    }


    /* ======================================================
       CARREGAR EMPRESAS
    ====================================================== */

    carregarEmpresaAtiva() {

        try {

            const dadosEmpresas =
                localStorage.getItem(
                    this.storageEmpresas
                );

            this.empresas =
                dadosEmpresas
                    ? JSON.parse(dadosEmpresas)
                    : [];

            if (!Array.isArray(this.empresas)) {

                this.empresas = [];

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar empresas:",
                erro
            );

            this.empresas = [];
        }


        const idEmpresaAtiva =
            localStorage.getItem(
                this.storageEmpresaAtiva
            );


        if (!idEmpresaAtiva) {

            this.empresaAtiva = null;

            return;
        }


        this.empresaAtiva =
            this.empresas.find(
                empresa =>
                    String(empresa.id) ===
                    String(idEmpresaAtiva)
            ) || null;
    }


    /* ======================================================
       CARREGAR ESTOQUES
    ====================================================== */

    carregarEstoques() {

        try {

            const dados =
                localStorage.getItem(
                    this.storageEstoques
                );

            this.estoques =
                dados
                    ? JSON.parse(dados)
                    : [];

            if (!Array.isArray(this.estoques)) {

                this.estoques = [];

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar estoques:",
                erro
            );

            this.estoques = [];
        }
    }


    /* ======================================================
       ID DO PRODUTO
       
       Mantemos a mesma lógica usada pelos módulos
       de Estoque e Compras.
    ====================================================== */

    obterIdProduto(produto) {

        if (!produto) return "";

        return String(
            produto.id ||
            produto.codigo ||
            produto.nome ||
            ""
        );
    }


    /* ======================================================
       ID DA EMPRESA ATIVA
    ====================================================== */

    obterIdEmpresaAtiva() {

        if (!this.empresaAtiva) {

            return "";
        }

        return String(
            this.empresaAtiva.id || ""
        );
    }


    /* ======================================================
       NOME DA EMPRESA ATIVA
    ====================================================== */

    obterNomeEmpresaAtiva() {

        if (!this.empresaAtiva) {

            return "";
        }

        return (
            this.empresaAtiva.nome ||
            this.empresaAtiva.razaoSocial ||
            ""
        );
    }


    /* ======================================================
       OBTER ESTOQUE DA EMPRESA ATIVA
       
       IMPORTANTE:
       Não utiliza mais produto.estoque como fonte
       principal.
    ====================================================== */

    obterEstoqueEmpresa(produto) {

        const empresaId =
            this.obterIdEmpresaAtiva();

        const produtoId =
            this.obterIdProduto(produto);


        if (!empresaId || !produtoId) {

            return 0;
        }


        const registro =
            this.estoques.find(
                estoque =>

                    String(estoque.empresaId) ===
                        String(empresaId)

                    &&

                    String(estoque.produtoId) ===
                        String(produtoId)
            );


        if (!registro) {

            /*
             * Se ainda não existe registro de estoque
             * para esta empresa/produto, consideramos
             * estoque ZERO.
             *
             * Não usamos produto.estoque aqui para
             * evitar misturar estoques entre empresas.
             */

            return 0;
        }


        return Number(
            registro.quantidade
        ) || 0;
    }


    /* ======================================================
       SALVAR NO LOCALSTORAGE
    ====================================================== */

    salvarStorage() {

        localStorage.setItem(
            this.storage,
            JSON.stringify(this.produtos)
        );
    }


    /* ======================================================
       ABRIR MODAL NOVO PRODUTO
    ====================================================== */

    abrirModal() {

        this.produtoEditando = null;

        this.limparFormulario();

        this.carregarCategorias();

        this.codigo.value =
            this.gerarCodigo();

        this.modal.classList.remove("hidden");
    }


    /* ======================================================
       FECHAR MODAL PRODUTO
    ====================================================== */

    fecharModal() {

        if (!this.modal) return;

        this.modal.classList.add("hidden");
    }


    /* ======================================================
       MOSTRAR / OCULTAR PRODUTOS
    ====================================================== */

    toggleTabela() {

        if (!this.cardTabela) return;

        this.cardTabela.classList.toggle("hidden");

        if (
            this.cardTabela.classList.contains("hidden")
        ) {

            this.btnMostrarProdutos.innerHTML = `
                <i class="fa-solid fa-box-open"></i>
                Mostrar Produtos
            `;

        } else {

            this.btnMostrarProdutos.innerHTML = `
                <i class="fa-solid fa-box"></i>
                Ocultar Produtos
            `;
        }
    }


    /* ======================================================
       LIMPAR FORMULÁRIO
    ====================================================== */

    limparFormulario() {

        if (this.codigo)
            this.codigo.value = "";

        if (this.nome)
            this.nome.value = "";

        if (this.categoria)
            this.categoria.value = "";

        if (this.preco)
            this.preco.value = "";

        if (this.marca)
            this.marca.value = "";

        if (this.estoqueMinimo)
            this.estoqueMinimo.value = "";
    }


    /* ======================================================
       CARREGAR CATEGORIAS
    ====================================================== */

    carregarCategorias() {

        if (!this.categoria) return;

        let categorias = [];

        try {

            categorias =
                JSON.parse(
                    localStorage.getItem("beq_categorias")
                ) || [];

        } catch (erro) {

            console.error(
                "Erro ao carregar categorias:",
                erro
            );

            categorias = [];
        }


        this.categoria.innerHTML = "";


        const opcao =
            document.createElement("option");

        opcao.value = "";

        opcao.textContent = "Selecione...";

        this.categoria.appendChild(opcao);


        categorias.forEach(cat => {

            const option =
                document.createElement("option");

            option.value = cat.nome;

            option.textContent = cat.nome;

            this.categoria.appendChild(option);

        });
    }


    /* ======================================================
       GERAR CÓDIGO
    ====================================================== */

    gerarCodigo() {

        let maiorNumero = 0;

        this.produtos.forEach(produto => {

            const codigo =
                String(produto.codigo || "");

            const match =
                codigo.match(/PRD-(\d+)/i);

            if (match) {

                const numero =
                    Number(match[1]);

                if (numero > maiorNumero) {

                    maiorNumero = numero;
                }
            }
        });


        return `PRD-${String(
            maiorNumero + 1
        ).padStart(5, "0")}`;
    }


    /* ======================================================
       SALVAR PRODUTO
    ====================================================== */

    salvarProduto() {

        /* ==================================================
           ESTOQUE MÍNIMO
        ================================================== */

        const estoqueMinimoInformado =
            this.estoqueMinimo
                ? Number(this.estoqueMinimo.value)
                : 0;

        const estoqueMinimo =
            Number.isFinite(estoqueMinimoInformado) &&
            estoqueMinimoInformado >= 0
                ? estoqueMinimoInformado
                : 0;


        /* ==================================================
           NOVO PRODUTO
           Produto novo sempre começa com estoque zero.
        ================================================== */

        if (this.produtoEditando === null) {

            const produto = {

                codigo:
                    this.gerarCodigo(),

                nome:
                    this.nome.value.trim(),

                categoria:
                    this.categoria.value.trim(),

                preco:
                    Number(this.preco.value),

                estoque:
                    0,

                estoqueMinimo:
                    estoqueMinimo,

                marca:
                    this.marca
                        ? this.marca.value.trim()
                        : ""
            };


            /* --------------------------------------------------
               Validação
            -------------------------------------------------- */

            if (

                !produto.codigo ||

                !produto.nome ||

                !produto.categoria ||

                produto.preco <= 0

            ) {

                alert(
                    "Preencha todos os campos corretamente."
                );

                return;
            }


            /* --------------------------------------------------
               Adicionar novo produto
            -------------------------------------------------- */

            this.produtos.push(produto);

        }


        /* ==================================================
           EDITAR PRODUTO
        ================================================== */

        else {

            const produtoAtual =
                this.produtos[this.produtoEditando];

            if (!produtoAtual) return;


            const produto = {

                /*
                 * Preserva o ID caso exista.
                 * Isso evita perder a identidade do produto.
                 */

                ...(produtoAtual.id
                    ? { id: produtoAtual.id }
                    : {}),

                codigo:
                    produtoAtual.codigo,

                nome:
                    this.nome.value.trim(),

                categoria:
                    this.categoria.value.trim(),

                preco:
                    Number(this.preco.value),

                /*
                 * Campo legado preservado.
                 * Não é utilizado para mostrar o estoque
                 * por empresa.
                 */

                estoque:
                    Number(produtoAtual.estoque) || 0,

                estoqueMinimo:
                    estoqueMinimo,

                marca:
                    this.marca
                        ? this.marca.value.trim()
                        : ""
            };


            /* --------------------------------------------------
               Validação
            -------------------------------------------------- */

            if (

                !produto.codigo ||

                !produto.nome ||

                !produto.categoria ||

                produto.preco <= 0

            ) {

                alert(
                    "Preencha todos os campos corretamente."
                );

                return;
            }


            /* --------------------------------------------------
               Atualizar produto
               Sem alterar estoque.
            -------------------------------------------------- */

            this.produtos[
                this.produtoEditando
            ] = produto;


            this.produtoEditando = null;
        }


        /* ==================================================
           SALVAR
        ================================================== */

        this.salvarStorage();

        this.carregarEstoques();

        this.renderizar();

        this.fecharModal();

        this.limparFormulario();
    }


    /* ======================================================
       EDITAR PRODUTO
    ====================================================== */

    editarProduto(indice) {

        const produto =
            this.produtos[indice];

        if (!produto) return;


        this.produtoEditando =
            Number(indice);


        this.codigo.value =
            produto.codigo || "";


        this.nome.value =
            produto.nome || "";


        this.carregarCategorias();


        this.categoria.value =
            produto.categoria || "";


        this.preco.value =
            produto.preco ?? "";


        /* ESTOQUE MÍNIMO */

        if (this.estoqueMinimo) {

            this.estoqueMinimo.value =
                Number(produto.estoqueMinimo) || 0;
        }


        /* MARCA */

        if (this.marca) {

            this.marca.value =
                produto.marca || "";
        }


        this.modal.classList.remove("hidden");
    }


    /* ======================================================
       EXCLUIR PRODUTO
    ====================================================== */

    excluirProduto(indice) {

        const produto =
            this.produtos[indice];

        if (!produto) return;


        if (

            !confirm(
                `Deseja realmente excluir o produto "${produto.nome}"?`
            )

        ) {

            return;
        }


        this.produtos.splice(
            indice,
            1
        );


        this.salvarStorage();

        this.renderizar();
    }


    /* ======================================================
       RENDERIZAR
    ====================================================== */

    renderizar() {

        const cardTabela =
            document.getElementById(
                "cardTabelaProdutos"
            );


        if (!cardTabela || !this.tabela) {

            return;
        }


        /*
         * Atualiza os dados da empresa e estoque
         * antes de desenhar a tabela.
         */

        this.carregarEmpresaAtiva();

        this.carregarEstoques();


        /* --------------------------------------------------
           Nenhum produto
        -------------------------------------------------- */

        if (this.produtos.length === 0) {

            cardTabela.classList.add("hidden");


            this.tabela.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty-table">

                        Nenhum produto cadastrado.

                    </td>

                </tr>

            `;


            this.atualizarResumo();

            return;
        }


        /* --------------------------------------------------
           Mostrar tabela
        -------------------------------------------------- */

        cardTabela.classList.remove("hidden");


        this.tabela.innerHTML = "";


        /* --------------------------------------------------
           Produtos
        -------------------------------------------------- */

        this.produtos.forEach(
            (produto, index) => {

                const preco =
                    Number(produto.preco) || 0;


                /*
                 * ESTOQUE POR EMPRESA
                 *
                 * Não usamos mais:
                 * Number(produto.estoque)
                 */

                const estoque =
                    this.obterEstoqueEmpresa(
                        produto
                    );


                this.tabela.innerHTML += `

                    <tr>

                        <td>
                            ${this.escaparHTML(
                                produto.codigo
                            )}
                        </td>


                        <td>
                            ${this.escaparHTML(
                                produto.nome
                            )}
                        </td>


                        <td>
                            ${this.escaparHTML(
                                produto.categoria
                            )}
                        </td>


                        <td>

                            ${preco.toLocaleString(
                                "pt-BR",
                                {
                                    style: "currency",
                                    currency: "BRL"
                                }
                            )}

                        </td>


                        <td>
                            ${estoque}
                        </td>


                        <td>

                            <!-- EDITAR -->

                            <button
                                type="button"
                                class="btn-icon btn-editar"
                                data-id="${index}"
                                title="Editar">

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <!-- EXCLUIR -->

                            <button
                                type="button"
                                class="btn-icon btn-excluir"
                                data-id="${index}"
                                title="Excluir">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </td>

                    </tr>

                `;
            }
        );


        /* --------------------------------------------------
           Atualizar resumo
        -------------------------------------------------- */

        this.atualizarResumo();
    }


    /* ======================================================
       ESCAPAR HTML
    ====================================================== */

    escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ======================================================
       RESUMO
    ====================================================== */

    atualizarResumo() {

        /*
         * Atualizar empresa e estoque antes do cálculo.
         */

        this.carregarEmpresaAtiva();

        this.carregarEstoques();


        const totalProdutos =
            this.produtos.length;


        /* --------------------------------------------------
           TOTAL DE ESTOQUE DA EMPRESA ATIVA
        -------------------------------------------------- */

        const totalEstoque =
            this.produtos.reduce(

                (total, produto) => {

                    const estoque =
                        this.obterEstoqueEmpresa(
                            produto
                        );

                    return total + estoque;

                },

                0
            );


        /* --------------------------------------------------
           VALOR DO ESTOQUE DA EMPRESA ATIVA
        -------------------------------------------------- */

        const valorEstoque =
            this.produtos.reduce(

                (total, produto) => {

                    const preco =
                        Number(produto.preco) || 0;

                    const estoque =
                        this.obterEstoqueEmpresa(
                            produto
                        );


                    return total +
                        (preco * estoque);

                },

                0
            );


        const elementoTotalProdutos =
            document.getElementById(
                "totalProdutos"
            );


        const elementoTotalEstoque =
            document.getElementById(
                "totalEstoque"
            );


        const elementoValorEstoque =
            document.getElementById(
                "valorEstoque"
            );


        if (elementoTotalProdutos) {

            elementoTotalProdutos.textContent =
                totalProdutos;
        }


        if (elementoTotalEstoque) {

            elementoTotalEstoque.textContent =
                totalEstoque;
        }


        if (elementoValorEstoque) {

            elementoValorEstoque.textContent =
                valorEstoque.toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );
        }
    }


    /* ======================================================
       EVENTOS
    ====================================================== */

    eventos() {

        /* --------------------------------------------------
           Novo Produto
        -------------------------------------------------- */

        this.btnNovo
            ?.addEventListener(
                "click",
                () => {

                    this.abrirModal();

                }
            );


        /* --------------------------------------------------
           Fechar Produto
        -------------------------------------------------- */

        this.btnFechar
            ?.addEventListener(
                "click",
                () => {

                    this.fecharModal();

                }
            );


        /* --------------------------------------------------
           Cancelar Produto
        -------------------------------------------------- */

        this.btnCancelar
            ?.addEventListener(
                "click",
                () => {

                    this.fecharModal();

                }
            );


        /* --------------------------------------------------
           Salvar Produto
        -------------------------------------------------- */

        this.btnSalvar
            ?.addEventListener(
                "click",
                () => {

                    this.salvarProduto();

                }
            );


        /* --------------------------------------------------
           TABELA
        -------------------------------------------------- */

        this.tabela.addEventListener(
            "click",
            (e) => {

                const botao =
                    e.target.closest("button");


                if (!botao) return;


                const indice =
                    Number(botao.dataset.id);


                if (

                    !Number.isInteger(indice) ||
                    indice < 0

                ) {

                    return;
                }


                /* Editar */

                if (

                    botao.classList.contains(
                        "btn-editar"
                    )

                ) {

                    this.editarProduto(
                        indice
                    );

                    return;
                }


                /* Excluir */

                if (

                    botao.classList.contains(
                        "btn-excluir"
                    )

                ) {

                    this.excluirProduto(
                        indice
                    );

                }

            }
        );


        /* --------------------------------------------------
           PESQUISA
        -------------------------------------------------- */

        if (this.busca) {

            this.busca.addEventListener(
                "input",
                () => {

                    const texto =
                        this.busca.value
                            .toLowerCase()
                            .trim();


                    const linhas =
                        this.tabela
                            .querySelectorAll("tr");


                    linhas.forEach(
                        linha => {

                            linha.style.display =
                                linha.textContent
                                    .toLowerCase()
                                    .includes(texto)
                                    ? ""
                                    : "none";

                        }
                    );

                }
            );
        }


        /* --------------------------------------------------
           MOSTRAR / OCULTAR PRODUTOS
        -------------------------------------------------- */

        this.btnMostrarProdutos
            ?.addEventListener(
                "click",
                () => {

                    this.toggleTabela();

                }
            );
    }
}


/* ==========================================================
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Produtos = Produtos;