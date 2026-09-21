/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo Categorias
   Arquivo: categorias.js
========================================================== */

class Categorias {

    /* ======================================================
       Construtor
    ====================================================== */

    constructor() {

        this.storage = "beq_categorias";

        this.categorias = [];

        this.categoriaEditando = null;

        this.cacheElementos();

    }

    /* ======================================================
       Cache dos Elementos
    ====================================================== */

    cacheElementos() {

        /* Modal */

        this.modal = document.getElementById("modalCategoria");

        this.btnNovo = document.getElementById("btnNovaCategoria");

        this.btnSalvar = document.getElementById("salvarCategoria");

        this.btnCancelar = document.getElementById("cancelarCategoria");

        this.btnFechar = document.getElementById("fecharModalCategoria");

        /* Formulário */

        this.codigo = document.getElementById("categoriaCodigo");

        this.nome = document.getElementById("categoriaNome");

        this.descricao = document.getElementById("categoriaDescricao");

        /* Pesquisa */

        this.busca = document.getElementById("pesquisarCategoria");

        /* Tabela */

        this.tabela = document.getElementById("listaCategorias");

        this.cardTabela = document.getElementById("cardTabelaCategorias");

        this.btnMostrar = document.getElementById("btnMostrarCategorias");

        /* Dashboard */

        this.totalCategorias = document.getElementById("totalCategorias");

    }

    /* ======================================================
       Inicialização
    ====================================================== */

    init() {

        if (!this.tabela) return;

        this.carregar();

        this.renderizar();

        this.eventos();

    }

    /* ======================================================
       LocalStorage
    ====================================================== */

    carregar() {

        const dados = localStorage.getItem(this.storage);

        this.categorias = dados
            ? JSON.parse(dados)
            : [];

    }

    salvarStorage() {

        localStorage.setItem(

            this.storage,

            JSON.stringify(this.categorias)

        );

    }

    /* ======================================================
       Abrir Modal
    ====================================================== */

    abrirModal() {

        this.categoriaEditando = null;

        this.limparFormulario();

        this.codigo.value = this.gerarCodigo();

        this.modal.classList.remove("hidden");

    }

    /* ======================================================
       Fechar Modal
    ====================================================== */

    fecharModal() {

        this.modal.classList.add("hidden");

    }

    /* ======================================================
       Limpar Formulário
    ====================================================== */

    limparFormulario() {

        this.codigo.value = "";

        this.nome.value = "";

        this.descricao.value = "";

    }

    /* ======================================================
       Código Automático
    ====================================================== */

    gerarCodigo() {

        const numero = this.categorias.length + 1;

        return `CAT-${String(numero).padStart(5, "0")}`;

    }

    /* ======================================================
       Salvar Categoria
    ====================================================== */

    salvarCategoria() {

        const categoria = {

            codigo: this.categoriaEditando === null

                ? this.gerarCodigo()

                : this.codigo.value,

            nome: this.nome.value.trim(),

            descricao: this.descricao.value.trim()

        };

        if (

            !categoria.nome ||

            !categoria.descricao

        ) {

            alert("Preencha todos os campos.");

            return;

        }

        if (this.categoriaEditando === null) {

            this.categorias.push(categoria);

        }

        else {

            this.categorias[this.categoriaEditando] = categoria;

            this.categoriaEditando = null;

        }

        this.salvarStorage();

        this.renderizar();

        this.fecharModal();

        this.limparFormulario();

    }

    /* ======================================================
       Editar
    ====================================================== */

    editarCategoria(indice) {

        const categoria = this.categorias[indice];

        this.categoriaEditando = indice;

        this.codigo.value = categoria.codigo;

        this.nome.value = categoria.nome;

        this.descricao.value = categoria.descricao;

        this.modal.classList.remove("hidden");

    }

    /* ======================================================
       Excluir
    ====================================================== */

    excluirCategoria(indice) {

    const categoria = this.categorias[indice];

    const produtos = JSON.parse(

        localStorage.getItem("beq_produtos")

    ) || [];

    const categoriaEmUso = produtos.some(produto =>

        produto.categoria === categoria.nome

    );

    if (categoriaEmUso) {

        alert(

            `A categoria "${categoria.nome}" está sendo utilizada por um ou mais produtos.\n\n` +

            `Remova ou altere esses produtos antes de excluir a categoria.`

        );

        return;

    }

    if (!confirm("Deseja excluir esta categoria?")) {

        return;

    }

    this.categorias.splice(indice, 1);

    this.salvarStorage();

    this.renderizar();

}

        /* ======================================================
       Renderizar
    ====================================================== */

    renderizar() {

        if (this.categorias.length === 0) {

            this.tabela.innerHTML = `

                <tr>

                    <td colspan="4" class="empty-table">

                        Nenhuma categoria cadastrada.

                    </td>

                </tr>

            `;

            this.atualizarResumo();

            return;

        }

        this.tabela.innerHTML = "";

        this.categorias.forEach((categoria, index) => {

            this.tabela.innerHTML += `

                <tr>

                    <td>${categoria.codigo}</td>

                    <td>${categoria.nome}</td>

                    <td>${categoria.descricao}</td>

                    <td>

                        <button
                            class="btn-icon btn-editar"
                            data-id="${index}"
                            title="Editar">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            class="btn-icon btn-excluir"
                            data-id="${index}"
                            title="Excluir">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

        this.atualizarResumo();

    }

    /* ======================================================
       Dashboard
    ====================================================== */

    atualizarResumo() {

        if (this.totalCategorias) {

            this.totalCategorias.textContent = this.categorias.length;

        }

    }

    /* ======================================================
       Mostrar / Ocultar
    ====================================================== */

    toggleTabela() {

        this.cardTabela.classList.toggle("hidden");

        if (this.cardTabela.classList.contains("hidden")) {

            this.btnMostrar.innerHTML = `

                <i class="fa-solid fa-list"></i>

                Mostrar Categorias

            `;

        }

        else {

            this.btnMostrar.innerHTML = `

                <i class="fa-solid fa-eye-slash"></i>

                Ocultar Categorias

            `;

        }

    }

    /* ======================================================
       Eventos
    ====================================================== */

    eventos() {

        this.btnNovo?.addEventListener("click", () => {

            this.abrirModal();

        });

        this.btnSalvar?.addEventListener("click", () => {

            this.salvarCategoria();

        });

        this.btnCancelar?.addEventListener("click", () => {

            this.fecharModal();

        });

        this.btnFechar?.addEventListener("click", () => {

            this.fecharModal();

        });

        this.btnMostrar?.addEventListener("click", () => {

            this.toggleTabela();

        });

        this.tabela.addEventListener("click", (e) => {

            const indice = e.target.closest("button")?.dataset.id;

            if (indice === undefined) return;

            if (e.target.closest(".btn-editar")) {

                this.editarCategoria(indice);

            }

            if (e.target.closest(".btn-excluir")) {

                this.excluirCategoria(indice);

            }

        });

        if (this.busca) {

            this.busca.addEventListener("input", () => {

                const texto = this.busca.value.toLowerCase();

                const linhas = this.tabela.querySelectorAll("tr");

                linhas.forEach(linha => {

                    linha.style.display = linha.textContent
                        .toLowerCase()
                        .includes(texto)

                        ? ""

                        : "none";

                });

            });

        }

    }

}

