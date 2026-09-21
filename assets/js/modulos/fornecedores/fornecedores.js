/* ==========================================================
   BEQ EMPREENDIMENTOS
   Módulo: Fornecedores
   Arquivo: fornecedores.js
========================================================== */

class Fornecedores {

    constructor() {

        this.storage = "beq_fornecedores";

        this.fornecedores = [];

        this.fornecedorEditando = null;

        this.cacheElementos();
    }


    /* ======================================================
       ELEMENTOS DA INTERFACE
    ====================================================== */

    cacheElementos() {

        /* Modal */

        this.modal =
            document.getElementById("modalFornecedor");

        this.btnNovo =
            document.getElementById("btnNovoFornecedor");

        this.btnSalvar =
            document.getElementById("salvarFornecedor");

        this.btnCancelar =
            document.getElementById("cancelarFornecedor");

        this.btnFechar =
            document.getElementById("fecharModalFornecedor");


        /* Formulário */

        this.razao =
            document.getElementById("fornecedorRazao");

        this.fantasia =
            document.getElementById("fornecedorFantasia");

        this.cnpj =
            document.getElementById("fornecedorCnpj");

        this.ie =
            document.getElementById("fornecedorIe");

        this.responsavel =
            document.getElementById("fornecedorResponsavel");

        this.telefone =
            document.getElementById("fornecedorTelefone");

        this.whatsapp =
            document.getElementById("fornecedorWhatsapp");

        this.email =
            document.getElementById("fornecedorEmail");

        this.cidade =
            document.getElementById("fornecedorCidade");

        this.status =
            document.getElementById("fornecedorStatus");

        this.observacoes =
            document.getElementById("fornecedorObservacoes");


        /* Pesquisa */

        this.busca =
            document.getElementById("pesquisarFornecedor");


        /* Tabela */

        this.tabela =
            document.getElementById("listaFornecedores");

        this.cardTabela =
            document.getElementById("cardTabelaFornecedores");

        this.btnMostrar =
            document.getElementById("btnMostrarFornecedores");


        /* Indicadores */

        this.total =
            document.getElementById("totalFornecedores");

        this.ativos =
            document.getElementById("fornecedoresAtivos");

        this.cidades =
            document.getElementById("totalCidades");
    }


    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

    init() {

        if (!this.tabela) {
            return;
        }

        this.carregar();

        this.atualizarIndicadores();

        this.renderizar();

        this.eventos();

        console.log(
            "BEQ: módulo Fornecedores inicializado."
        );
    }


    /* ======================================================
       PADRONIZAÇÃO DE NOMES
    ====================================================== */

    padronizarNome(texto) {

        if (!texto) {
            return "";
        }

        const minusculas = [
            "da",
            "de",
            "do",
            "das",
            "dos",
            "e"
        ];

        return String(texto)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ")
            .split(" ")
            .map((palavra, indice) => {

                if (
                    indice > 0 &&
                    minusculas.includes(palavra)
                ) {
                    return palavra;
                }

                return (
                    palavra.charAt(0).toUpperCase() +
                    palavra.slice(1)
                );

            })
            .join(" ");
    }


    /* ======================================================
       MÁSCARA CNPJ
    ====================================================== */

    formatarCNPJ(valor) {

        let v = String(valor || "")
            .replace(/\D/g, "")
            .slice(0, 14);

        v = v.replace(
            /(\d{2})(\d)/,
            "$1.$2"
        );

        v = v.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );

        v = v.replace(
            /(\d{3})(\d)/,
            "$1/$2"
        );

        v = v.replace(
            /(\d{4})(\d{1,2})$/,
            "$1-$2"
        );

        return v;
    }


    /* ======================================================
       MÁSCARA TELEFONE
    ====================================================== */

    formatarTelefone(valor) {

        let v = String(valor || "")
            .replace(/\D/g, "")
            .slice(0, 11);

        if (v.length <= 10) {

            v = v.replace(
                /(\d{2})(\d)/,
                "($1) $2"
            );

            v = v.replace(
                /(\d{4})(\d)/,
                "$1-$2"
            );

        } else {

            v = v.replace(
                /(\d{2})(\d)/,
                "($1) $2"
            );

            v = v.replace(
                /(\d{5})(\d)/,
                "$1-$2"
            );
        }

        return v;
    }


    /* ======================================================
       MÁSCARA CEP
       Caso futuramente exista campo de CEP.
    ====================================================== */

    formatarCEP(valor) {

        let v = String(valor || "")
            .replace(/\D/g, "")
            .slice(0, 8);

        if (v.length > 5) {

            v =
                v.slice(0, 5) +
                "-" +
                v.slice(5);
        }

        return v;
    }


    /* ======================================================
       GERAR ID ÚNICO
    ====================================================== */

    gerarId() {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {

            return crypto.randomUUID();
        }

        return (
            Date.now().toString() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }


    /* ======================================================
       LOCAL STORAGE
    ====================================================== */

    carregar() {

        const dados =
            localStorage.getItem(this.storage);

        let registros = [];

        try {

            registros =
                dados
                    ? JSON.parse(dados)
                    : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar fornecedores:",
                erro
            );

            registros = [];
        }


        /*
           Corrige registros antigos que estejam:

           - sem ID
           - com ID duplicado
        */

        const idsUsados = new Set();

        let houveAlteracao = false;


        this.fornecedores =
            Array.isArray(registros)
                ? registros.map(fornecedor => {

                    let id =
                        fornecedor.id;

                    if (
                        !id ||
                        idsUsados.has(
                            String(id)
                        )
                    ) {

                        id =
                            this.gerarId();

                        houveAlteracao = true;
                    }


                    idsUsados.add(
                        String(id)
                    );


                    return {
                        ...fornecedor,
                        id: id
                    };

                })
                : [];


        /*
           Salva automaticamente a correção
           dos IDs.
        */

        if (houveAlteracao) {

            this.salvarLocalStorage();
        }
    }


    salvarLocalStorage() {

        localStorage.setItem(
            this.storage,
            JSON.stringify(
                this.fornecedores
            )
        );
    }


    /* ======================================================
       FORMULÁRIO
    ====================================================== */

    limparFormulario() {

        if (this.razao) {
            this.razao.value = "";
        }

        if (this.fantasia) {
            this.fantasia.value = "";
        }

        if (this.cnpj) {
            this.cnpj.value = "";
        }

        if (this.ie) {
            this.ie.value = "";
        }

        if (this.responsavel) {
            this.responsavel.value = "";
        }

        if (this.telefone) {
            this.telefone.value = "";
        }

        if (this.whatsapp) {
            this.whatsapp.value = "";
        }

        if (this.email) {
            this.email.value = "";
        }

        if (this.cidade) {
            this.cidade.value = "";
        }

        if (this.status) {
            this.status.value = "Ativo";
        }

        if (this.observacoes) {
            this.observacoes.value = "";
        }

        this.fornecedorEditando = null;
    }


    /* ======================================================
       ABRIR MODAL
    ====================================================== */

    abrirModal() {

        if (!this.modal) {
            return;
        }

        this.modal.classList.remove(
            "hidden"
        );

        this.modal.classList.add(
            "active"
        );


        if (this.razao) {

            setTimeout(() => {

                this.razao.focus();

            }, 50);
        }
    }


    /* ======================================================
       FECHAR MODAL
    ====================================================== */

    fecharModal() {

        if (!this.modal) {
            return;
        }

        this.modal.classList.add(
            "hidden"
        );

        this.modal.classList.remove(
            "active"
        );

        this.limparFormulario();
    }


    /* ======================================================
       INDICADORES
    ====================================================== */

    atualizarIndicadores() {

        const total =
            this.fornecedores.length;


        const ativos =
            this.fornecedores.filter(
                fornecedor =>
                    String(
                        fornecedor.status
                    ).toLowerCase() === "ativo"
            ).length;


        const cidades =
            new Set(

                this.fornecedores
                    .map(fornecedor =>
                        String(
                            fornecedor.cidade || ""
                        )
                            .trim()
                            .toLowerCase()
                    )
                    .filter(
                        cidade =>
                            cidade !== ""
                    )

            ).size;


        if (this.total) {
            this.total.textContent =
                total;
        }

        if (this.ativos) {
            this.ativos.textContent =
                ativos;
        }

        if (this.cidades) {
            this.cidades.textContent =
                cidades;
        }
    }


    /* ======================================================
       SALVAR FORNECEDOR
    ====================================================== */

    salvarFornecedor() {

        const razaoOriginal =
            this.razao?.value.trim() || "";


        if (!razaoOriginal) {

            alert(
                "Informe a Razão Social do fornecedor."
            );

            this.razao?.focus();

            return;
        }


        /*
           Padronização dos dados
        */

        const razao =
            this.padronizarNome(
                razaoOriginal
            );


        const fantasia =
            this.padronizarNome(
                this.fantasia?.value || ""
            );


        const cnpj =
            this.formatarCNPJ(
                this.cnpj?.value || ""
            );


        const telefone =
            this.formatarTelefone(
                this.telefone?.value || ""
            );


        const whatsapp =
            this.formatarTelefone(
                this.whatsapp?.value || ""
            );


        const dadosFornecedor = {

            id:
                this.fornecedorEditando
                    ? this.fornecedorEditando
                    : this.gerarId(),

            razao:

                razao,

            fantasia:

                fantasia,

            cnpj:

                cnpj,

            ie:

                this.ie?.value.trim() || "",

            responsavel:

                this.responsavel?.value.trim() || "",

            telefone:

                telefone,

            whatsapp:

                whatsapp,

            email:

                this.email?.value.trim() || "",

            cidade:

                this.cidade?.value.trim() || "",

            status:

                this.status?.value || "Ativo",

            observacoes:

                this.observacoes?.value.trim() || ""
        };


        /* ==================================================
           EDIÇÃO
        ================================================== */

        if (this.fornecedorEditando) {

            const indice =
                this.fornecedores.findIndex(
                    fornecedor =>
                        String(
                            fornecedor.id
                        ) ===
                        String(
                            this.fornecedorEditando
                        )
                );


            if (indice !== -1) {

                this.fornecedores[indice] =
                    dadosFornecedor;
            }

        }


        /* ==================================================
           NOVO CADASTRO
        ================================================== */

        else {

            this.fornecedores.push(
                dadosFornecedor
            );
        }


        this.salvarLocalStorage();

        this.atualizarIndicadores();

        this.renderizar();

        this.fecharModal();
    }


    /* ======================================================
       EDITAR FORNECEDOR
    ====================================================== */

    editarFornecedor(id) {

        const fornecedor =
            this.fornecedores.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!fornecedor) {

            console.error(
                "Fornecedor não encontrado:",
                id
            );

            return;
        }


        this.fornecedorEditando =
            fornecedor.id;


        if (this.razao) {

            this.razao.value =
                fornecedor.razao || "";
        }


        if (this.fantasia) {

            this.fantasia.value =
                fornecedor.fantasia || "";
        }


        if (this.cnpj) {

            this.cnpj.value =
                this.formatarCNPJ(
                    fornecedor.cnpj || ""
                );
        }


        if (this.ie) {

            this.ie.value =
                fornecedor.ie || "";
        }


        if (this.responsavel) {

            this.responsavel.value =
                fornecedor.responsavel || "";
        }


        if (this.telefone) {

            this.telefone.value =
                this.formatarTelefone(
                    fornecedor.telefone || ""
                );
        }


        if (this.whatsapp) {

            this.whatsapp.value =
                this.formatarTelefone(
                    fornecedor.whatsapp || ""
                );
        }


        if (this.email) {

            this.email.value =
                fornecedor.email || "";
        }


        if (this.cidade) {

            this.cidade.value =
                fornecedor.cidade || "";
        }


        if (this.status) {

            this.status.value =
                fornecedor.status ||
                "Ativo";
        }


        if (this.observacoes) {

            this.observacoes.value =
                fornecedor.observacoes || "";
        }


        this.abrirModal();
    }


    /* ======================================================
       EXCLUIR FORNECEDOR
    ====================================================== */

    excluirFornecedor(id) {

        const fornecedor =
            this.fornecedores.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!fornecedor) {

            console.error(
                "Fornecedor não encontrado para exclusão:",
                id
            );

            return;
        }


        const nome =
            fornecedor.fantasia ||
            fornecedor.razao ||
            "este fornecedor";


        const confirmou =
            confirm(
                `Deseja realmente excluir o fornecedor "${nome}"?`
            );


        if (!confirmou) {
            return;
        }


        /*
           IMPORTANTE:

           Remove somente o ID selecionado.
        */

        this.fornecedores =
            this.fornecedores.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );


        this.salvarLocalStorage();

        this.atualizarIndicadores();

        this.renderizar();
    }


    /* ======================================================
       PESQUISA
    ====================================================== */

    pesquisarFornecedor() {

        const texto =
            String(
                this.busca?.value || ""
            )
                .trim()
                .toLowerCase();


        if (!texto) {

            this.renderizar(
                this.fornecedores
            );

            return;
        }


        const resultado =
            this.fornecedores.filter(
                fornecedor => {

                    return (

                        String(
                            fornecedor.razao || ""
                        )
                            .toLowerCase()
                            .includes(texto)


                        ||


                        String(
                            fornecedor.fantasia || ""
                        )
                            .toLowerCase()
                            .includes(texto)


                        ||


                        String(
                            fornecedor.cnpj || ""
                        )
                            .toLowerCase()
                            .includes(texto)


                        ||


                        String(
                            fornecedor.cidade || ""
                        )
                            .toLowerCase()
                            .includes(texto)


                        ||


                        String(
                            fornecedor.responsavel || ""
                        )
                            .toLowerCase()
                            .includes(texto)

                    );
                }
            );


        this.renderizar(resultado);
    }


    /* ======================================================
       MOSTRAR / OCULTAR
    ====================================================== */

    toggleTabela() {

        if (!this.cardTabela) {
            return;
        }


        const estaOculta =
            this.cardTabela.classList.contains(
                "hidden"
            );


        if (estaOculta) {

            this.cardTabela.classList.remove(
                "hidden"
            );


            if (this.btnMostrar) {

                this.btnMostrar.innerHTML = `
                    <i class="fa-solid fa-eye-slash"></i>
                    Ocultar Fornecedores
                `;
            }

        }

        else {

            this.cardTabela.classList.add(
                "hidden"
            );


            if (this.btnMostrar) {

                this.btnMostrar.innerHTML = `
                    <i class="fa-solid fa-table"></i>
                    Mostrar Fornecedores
                `;
            }
        }
    }


    /* ======================================================
       RENDERIZAR TABELA
    ====================================================== */

    renderizar(
        lista = this.fornecedores
    ) {

        if (!this.tabela) {
            return;
        }


        if (!lista.length) {

            this.tabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="empty-table"
                    >
                        Nenhum fornecedor encontrado.
                    </td>
                </tr>
            `;

            return;
        }


        this.tabela.innerHTML =
            lista.map(
                fornecedor => {

                    const id =
                        String(
                            fornecedor.id
                        )
                            .replace(
                                /"/g,
                                "&quot;"
                            );


                    const statusAtivo =
                        String(
                            fornecedor.status
                        )
                            .toLowerCase() ===
                        "ativo";


                    return `

                        <tr>

                            <td>

                                <strong>
                                    ${
                                        fornecedor.fantasia ||
                                        "-"
                                    }
                                </strong>

                                <small>
                                    ${
                                        fornecedor.razao ||
                                        ""
                                    }
                                </small>

                            </td>


                            <td>
                                ${
                                    fornecedor.cnpj ||
                                    "-"
                                }
                            </td>


                            <td>
                                ${
                                    fornecedor.telefone ||
                                    "-"
                                }
                            </td>


                            <td>
                                ${
                                    fornecedor.cidade ||
                                    "-"
                                }
                            </td>


                            <td>

                                <span
                                    class="${
                                        statusAtivo
                                            ? "status-ativo"
                                            : "status-inativo"
                                    }"
                                >

                                    ${
                                        fornecedor.status ||
                                        "Inativo"
                                    }

                                </span>

                            </td>


                            <td class="acoes-tabela">

                                <button
                                    type="button"
                                    class="btn-icon btn-editar-fornecedor"
                                    data-id="${id}"
                                    title="Editar"
                                >

                                    <i
                                        class="fa-solid fa-pen"
                                    ></i>

                                </button>


                                <button
                                    type="button"
                                    class="btn-icon btn-excluir-fornecedor"
                                    data-id="${id}"
                                    title="Excluir"
                                >

                                    <i
                                        class="fa-solid fa-trash"
                                    ></i>

                                </button>

                            </td>

                        </tr>

                    `;
                }
            ).join("");
    }


    /* ======================================================
       EVENTOS
    ====================================================== */

    eventos() {

        /* ==================================================
           NOVO
        ================================================== */

        if (
            this.btnNovo &&
            !this.btnNovo.dataset.listener
        ) {

            this.btnNovo.dataset.listener =
                "true";


            this.btnNovo.addEventListener(
                "click",
                () => {

                    this.limparFormulario();

                    this.abrirModal();
                }
            );
        }


        /* ==================================================
           SALVAR
        ================================================== */

        if (
            this.btnSalvar &&
            !this.btnSalvar.dataset.listener
        ) {

            this.btnSalvar.dataset.listener =
                "true";


            this.btnSalvar.addEventListener(
                "click",
                () => {

                    this.salvarFornecedor();
                }
            );
        }


        /* ==================================================
           CANCELAR
        ================================================== */

        if (
            this.btnCancelar &&
            !this.btnCancelar.dataset.listener
        ) {

            this.btnCancelar.dataset.listener =
                "true";


            this.btnCancelar.addEventListener(
                "click",
                () => {

                    this.fecharModal();
                }
            );
        }


        /* ==================================================
           FECHAR
        ================================================== */

        if (
            this.btnFechar &&
            !this.btnFechar.dataset.listener
        ) {

            this.btnFechar.dataset.listener =
                "true";


            this.btnFechar.addEventListener(
                "click",
                () => {

                    this.fecharModal();
                }
            );
        }


        /* ==================================================
           PESQUISA
        ================================================== */

        if (
            this.busca &&
            !this.busca.dataset.listener
        ) {

            this.busca.dataset.listener =
                "true";


            this.busca.addEventListener(
                "input",
                () => {

                    this.pesquisarFornecedor();
                }
            );
        }


        /* ==================================================
           MOSTRAR / OCULTAR
        ================================================== */

        if (
            this.btnMostrar &&
            !this.btnMostrar.dataset.listener
        ) {

            this.btnMostrar.dataset.listener =
                "true";


            this.btnMostrar.addEventListener(
                "click",
                () => {

                    this.toggleTabela();
                }
            );
        }


        /* ==================================================
           PADRONIZAÇÃO DA RAZÃO SOCIAL
        ================================================== */

        if (
            this.razao &&
            !this.razao.dataset.listener
        ) {

            this.razao.dataset.listener =
                "true";


            this.razao.addEventListener(
                "blur",
                () => {

                    this.razao.value =
                        this.padronizarNome(
                            this.razao.value
                        );
                }
            );
        }


        /* ==================================================
           PADRONIZAÇÃO DO NOME FANTASIA
        ================================================== */

        if (
            this.fantasia &&
            !this.fantasia.dataset.listener
        ) {

            this.fantasia.dataset.listener =
                "true";


            this.fantasia.addEventListener(
                "blur",
                () => {

                    this.fantasia.value =
                        this.padronizarNome(
                            this.fantasia.value
                        );
                }
            );
        }


        /* ==================================================
           MÁSCARA CNPJ
        ================================================== */

        if (
            this.cnpj &&
            !this.cnpj.dataset.listener
        ) {

            this.cnpj.dataset.listener =
                "true";


            this.cnpj.addEventListener(
                "input",
                () => {

                    this.cnpj.value =
                        this.formatarCNPJ(
                            this.cnpj.value
                        );
                }
            );
        }


        /* ==================================================
           MÁSCARA TELEFONE
        ================================================== */

        if (
            this.telefone &&
            !this.telefone.dataset.listener
        ) {

            this.telefone.dataset.listener =
                "true";


            this.telefone.addEventListener(
                "input",
                () => {

                    this.telefone.value =
                        this.formatarTelefone(
                            this.telefone.value
                        );
                }
            );
        }


        /* ==================================================
           MÁSCARA WHATSAPP
        ================================================== */

        if (
            this.whatsapp &&
            !this.whatsapp.dataset.listener
        ) {

            this.whatsapp.dataset.listener =
                "true";


            this.whatsapp.addEventListener(
                "input",
                () => {

                    this.whatsapp.value =
                        this.formatarTelefone(
                            this.whatsapp.value
                        );
                }
            );
        }


        /* ==================================================
           AÇÕES DA TABELA
        ================================================== */

        if (
            this.tabela &&
            !this.tabela.dataset.listener
        ) {

            this.tabela.dataset.listener =
                "true";


            this.tabela.addEventListener(
                "click",
                evento => {

                    const botao =
                        evento.target.closest(
                            "button[data-id]"
                        );


                    if (!botao) {
                        return;
                    }


                    const id =
                        botao.dataset.id;


                    /* EDITAR */

                    if (
                        botao.classList.contains(
                            "btn-editar-fornecedor"
                        )
                    ) {

                        this.editarFornecedor(id);

                        return;
                    }


                    /* EXCLUIR */

                    if (
                        botao.classList.contains(
                            "btn-excluir-fornecedor"
                        )
                    ) {

                        this.excluirFornecedor(id);
                    }
                }
            );
        }


        /* ==================================================
           FECHAR CLICANDO FORA DO MODAL
        ================================================== */

        if (
            this.modal &&
            !this.modal.dataset.listener
        ) {

            this.modal.dataset.listener =
                "true";


            this.modal.addEventListener(
                "click",
                evento => {

                    if (
                        evento.target ===
                        this.modal
                    ) {

                        this.fecharModal();
                    }
                }
            );
        }
    }
}


/* ==========================================================
   DISPONIBILIZAR MÓDULO
========================================================== */

window.Fornecedores =
    Fornecedores;

window.moduloFornecedores =
    null;


console.log(
    "BEQ: fornecedores.js foi carregado."
);