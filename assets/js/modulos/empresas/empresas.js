/* ==========================================================
   BEQ EMPREENDIMENTOS
   MÓDULO: EMPRESAS
   assets/js/modulos/empresas/empresas.js
   Rocha Digital
========================================================== */

class Empresas {

    constructor() {
        this.storageKey = "beq_empresas";
        this.empresaAtivaKey = "beq_empresa_ativa";

        this.empresas = [];
        this.empresaEditando = null;
        this.elementos = {};
        this.eventosRegistrados = false;
    }

    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

    init() {
        console.log("BEQ: Inicializando módulo Empresas...");

        this.mapearElementos();
        this.carregarDados();
        this.carregarEmpresaAtiva();
        this.prepararFormulario();
        this.renderizar();
        this.atualizarIndicadores();
        this.registrarEventos();

        console.log("BEQ: módulo Empresas inicializado.");
    }

    /* ======================================================
       ELEMENTOS
    ====================================================== */

    mapearElementos() {

        this.elementos = {

            btnNovaEmpresa:
                document.getElementById("btnNovaEmpresa"),

            btnNovaEmpresaVazio:
                document.getElementById("btnNovaEmpresaVazio"),

            totalEmpresas:
                document.getElementById("totalEmpresas"),

            empresasAtivas:
                document.getElementById("empresasAtivas"),

            empresasInativas:
                document.getElementById("empresasInativas"),

            empresasComEstoque:
                document.getElementById("empresasComEstoque"),

            pesquisarEmpresa:
                document.getElementById("pesquisarEmpresa"),

            btnMostrarEmpresas:
                document.getElementById("btnMostrarEmpresas"),

            cardTabelaEmpresas:
                document.getElementById("cardTabelaEmpresas"),

            listaEmpresas:
                document.getElementById("listaEmpresas"),

            estadoVazioEmpresas:
                document.getElementById("estadoVazioEmpresas"),

            modalEmpresa:
                document.getElementById("modalEmpresa"),

            tituloModalEmpresa:
                document.getElementById("tituloModalEmpresa"),

            fecharModalEmpresa:
                document.getElementById("fecharModalEmpresa"),

            formEmpresa:
                document.getElementById("formEmpresa"),

            cancelarEmpresa:
                document.getElementById("cancelarEmpresa"),

            empresaCodigo:
                document.getElementById("empresaCodigo"),

            empresaRazaoSocial:
                document.getElementById("empresaRazaoSocial"),

            empresaNomeFantasia:
                document.getElementById("empresaNomeFantasia"),

            empresaCnpj:
                document.getElementById("empresaCnpj"),

            empresaInscricaoEstadual:
                document.getElementById("empresaInscricaoEstadual"),

            empresaStatus:
                document.getElementById("empresaStatus"),

            empresaTelefone:
                document.getElementById("empresaTelefone"),

            empresaEmail:
                document.getElementById("empresaEmail"),

            empresaCep:
                document.getElementById("empresaCep"),

            empresaEndereco:
                document.getElementById("empresaEndereco"),

            empresaCidade:
                document.getElementById("empresaCidade"),

            empresaEstado:
                document.getElementById("empresaEstado"),

            empresaObservacoes:
                document.getElementById("empresaObservacoes")
        };
    }

    /* ======================================================
       LOCALSTORAGE
    ====================================================== */

    carregarDados() {

        try {

            const dados =
                localStorage.getItem(this.storageKey);

            if (!dados) {
                this.empresas = [];
                return;
            }

            const convertido = JSON.parse(dados);

            this.empresas =
                Array.isArray(convertido)
                    ? convertido
                    : [];

        } catch (erro) {

            console.error(
                "BEQ Empresas: erro ao carregar dados.",
                erro
            );

            this.empresas = [];
        }
    }

    salvarDados() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(this.empresas)
            );

            return true;

        } catch (erro) {

            console.error(
                "BEQ Empresas: erro ao salvar dados.",
                erro
            );

            alert(
                "Não foi possível salvar os dados da empresa."
            );

            return false;
        }
    }

    /* ======================================================
       EMPRESA ATIVA
    ====================================================== */

    carregarEmpresaAtiva() {

        try {

            const id =
                localStorage.getItem(
                    this.empresaAtivaKey
                );

            if (!id) return;

            const existe =
                this.empresas.some(
                    empresa =>
                        String(empresa.id) === String(id) &&
                        empresa.status === "Ativa"
                );

            if (!existe) {
                localStorage.removeItem(
                    this.empresaAtivaKey
                );
            }

        } catch (erro) {

            console.warn(
                "BEQ Empresas: não foi possível carregar a empresa ativa.",
                erro
            );
        }
    }

   definirEmpresaAtiva(id) {

    const empresa = this.empresas.find(
        item =>
            String(item.id) ===
            String(id)
    );


    if (!empresa) {

        alert(
            "Empresa não encontrada."
        );

        return false;
    }


    if (empresa.status !== "Ativa") {

        alert(
            "Esta empresa está inativa.\n\n" +
            "Ative a empresa antes de selecioná-la."
        );

        return false;
    }


    try {

        /* ======================================================
           SALVAR EMPRESA ATIVA
        ======================================================= */

        localStorage.setItem(
            this.empresaAtivaKey,
            String(empresa.id)
        );


        /* ======================================================
           ATUALIZAR EMPRESA NO CABEÇALHO
        ======================================================= */

        const nomeEmpresaHeader =
            document.getElementById(
                "nomeEmpresaAtivaHeader"
            );


        if (nomeEmpresaHeader) {

            nomeEmpresaHeader.textContent =
                empresa.nomeFantasia ||
                empresa.razaoSocial ||
                empresa.razao ||
                empresa.nome ||
                "Empresa";

        }


        /* ======================================================
           ATUALIZAR LISTA DE EMPRESAS
        ======================================================= */

        this.renderizar();


        return true;


    } catch (erro) {

        console.error(
            "BEQ Empresas: erro ao definir empresa ativa.",
            erro
        );


        alert(
            "Não foi possível selecionar a empresa."
        );


        return false;
    }
}

    obterEmpresaAtiva() {

        try {

            const id =
                localStorage.getItem(
                    this.empresaAtivaKey
                );

            if (!id) return null;

            return this.empresas.find(
                empresa =>
                    String(empresa.id) === String(id) &&
                    empresa.status === "Ativa"
            ) || null;

        } catch (erro) {

            console.warn(
                "BEQ Empresas: erro ao obter empresa ativa.",
                erro
            );

            return null;
        }
    }

    obterIdEmpresaAtiva() {

        const empresa =
            this.obterEmpresaAtiva();

        return empresa
            ? empresa.id
            : null;
    }

    limparEmpresaAtiva() {

        try {

            localStorage.removeItem(
                this.empresaAtivaKey
            );

            this.renderizar();

        } catch (erro) {

            console.warn(
                "BEQ Empresas: não foi possível limpar a empresa ativa.",
                erro
            );
        }
    }

    /* ======================================================
       FORMULÁRIO
    ====================================================== */

    prepararFormulario() {

        if (this.elementos.empresaStatus) {
            this.elementos.empresaStatus.value = "Ativa";
        }

        if (this.elementos.empresaCodigo) {
            this.elementos.empresaCodigo.value =
                this.gerarProximoCodigo();
        }
    }

    limparFormulario() {

        const campos = [
            "empresaRazaoSocial",
            "empresaNomeFantasia",
            "empresaCnpj",
            "empresaInscricaoEstadual",
            "empresaTelefone",
            "empresaEmail",
            "empresaCep",
            "empresaEndereco",
            "empresaCidade",
            "empresaObservacoes"
        ];

        campos.forEach(id => {

            const campo =
                document.getElementById(id);

            if (campo) {
                campo.value = "";
            }
        });

        if (this.elementos.empresaEstado) {
            this.elementos.empresaEstado.value = "";
        }

        if (this.elementos.empresaStatus) {
            this.elementos.empresaStatus.value = "Ativa";
        }

        if (this.elementos.empresaCodigo) {
            this.elementos.empresaCodigo.value =
                this.gerarProximoCodigo();
        }

        this.empresaEditando = null;
    }

    abrirModal() {

        if (!this.elementos.modalEmpresa) {
            return;
        }

        this.limparFormulario();

        if (this.elementos.tituloModalEmpresa) {
            this.elementos.tituloModalEmpresa.textContent =
                "Nova Empresa";
        }

        this.elementos.modalEmpresa.classList.remove(
            "hidden"
        );

        document.body.classList.add(
            "modal-open"
        );

        setTimeout(() => {

            if (this.elementos.empresaRazaoSocial) {
                this.elementos.empresaRazaoSocial.focus();
            }

        }, 100);
    }

    fecharModal() {

        if (!this.elementos.modalEmpresa) {
            return;
        }

        this.elementos.modalEmpresa.classList.add(
            "hidden"
        );

        document.body.classList.remove(
            "modal-open"
        );

        this.empresaEditando = null;
    }

    /* ======================================================
       CÓDIGO AUTOMÁTICO
    ====================================================== */

    gerarProximoCodigo() {

        if (!this.empresas.length) {
            return "EMP-00001";
        }

        let maior = 0;

        this.empresas.forEach(empresa => {

            const codigo =
                String(empresa.codigo || "");

            const encontrado =
                codigo.match(/(\d+)$/);

            if (encontrado) {

                const numero =
                    parseInt(
                        encontrado[1],
                        10
                    );

                if (
                    !isNaN(numero) &&
                    numero > maior
                ) {
                    maior = numero;
                }
            }
        });

        return (
            "EMP-" +
            String(maior + 1).padStart(5, "0")
        );
    }

    /* ======================================================
       TEXTO
    ====================================================== */

    normalizarTexto(valor) {

        return String(valor || "")
            .trim()
            .replace(/\s+/g, " ");
    }

    capitalizarNome(valor) {

        const texto =
            this.normalizarTexto(valor);

        if (!texto) {
            return "";
        }

        const particulas = [
            "da",
            "de",
            "do",
            "das",
            "dos",
            "e"
        ];

        return texto
            .toLowerCase()
            .split(" ")
            .map((palavra, indice) => {

                if (
                    indice > 0 &&
                    particulas.includes(palavra)
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

    formatarCnpj(valor) {

        let numero =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 14);

        if (numero.length <= 2) {
            return numero;
        }

        if (numero.length <= 5) {

            return (
                numero.slice(0, 2) +
                "." +
                numero.slice(2)
            );
        }

        if (numero.length <= 8) {

            return (
                numero.slice(0, 2) +
                "." +
                numero.slice(2, 5) +
                "." +
                numero.slice(5)
            );
        }

        if (numero.length <= 12) {

            return (
                numero.slice(0, 2) +
                "." +
                numero.slice(2, 5) +
                "." +
                numero.slice(5, 8) +
                "/" +
                numero.slice(8)
            );
        }

        return (
            numero.slice(0, 2) +
            "." +
            numero.slice(2, 5) +
            "." +
            numero.slice(5, 8) +
            "/" +
            numero.slice(8, 12) +
            "-" +
            numero.slice(12, 14)
        );
    }

    /* ======================================================
       MÁSCARA TELEFONE
    ====================================================== */

    formatarTelefone(valor) {

        let numero =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 11);

        if (numero.length <= 2) {
            return numero;
        }

        if (numero.length <= 6) {

            return (
                "(" +
                numero.slice(0, 2) +
                ") " +
                numero.slice(2)
            );
        }

        if (numero.length <= 10) {

            return (
                "(" +
                numero.slice(0, 2) +
                ") " +
                numero.slice(2, 6) +
                "-" +
                numero.slice(6)
            );
        }

        return (
            "(" +
            numero.slice(0, 2) +
            ") " +
            numero.slice(2, 7) +
            "-" +
            numero.slice(7, 11)
        );
    }

    /* ======================================================
       MÁSCARA CEP
    ====================================================== */

    formatarCep(valor) {

        let numero =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 8);

        if (numero.length <= 5) {
            return numero;
        }

        return (
            numero.slice(0, 5) +
            "-" +
            numero.slice(5)
        );
    }

    /* ======================================================
       EDITAR
    ====================================================== */

    editarEmpresa(id) {

        const empresa =
            this.empresas.find(
                item =>
                    String(item.id) === String(id)
            );

        if (!empresa) {

            alert("Empresa não encontrada.");
            return;
        }

        this.empresaEditando = empresa.id;

        const preencher =
            (elemento, valor) => {

                if (elemento) {
                    elemento.value =
                        valor ?? "";
                }
            };

        preencher(
            this.elementos.empresaCodigo,
            empresa.codigo
        );

        preencher(
            this.elementos.empresaRazaoSocial,
            empresa.razaoSocial
        );

        preencher(
            this.elementos.empresaNomeFantasia,
            empresa.nomeFantasia
        );

        preencher(
            this.elementos.empresaCnpj,
            empresa.cnpj
        );

        preencher(
            this.elementos.empresaInscricaoEstadual,
            empresa.inscricaoEstadual
        );

        preencher(
            this.elementos.empresaStatus,
            empresa.status || "Ativa"
        );

        preencher(
            this.elementos.empresaTelefone,
            empresa.telefone
        );

        preencher(
            this.elementos.empresaEmail,
            empresa.email
        );

        preencher(
            this.elementos.empresaCep,
            empresa.cep
        );

        preencher(
            this.elementos.empresaEndereco,
            empresa.endereco
        );

        preencher(
            this.elementos.empresaCidade,
            empresa.cidade
        );

        preencher(
            this.elementos.empresaEstado,
            empresa.estado
        );

        preencher(
            this.elementos.empresaObservacoes,
            empresa.observacoes
        );

        if (this.elementos.tituloModalEmpresa) {
            this.elementos.tituloModalEmpresa.textContent =
                "Editar Empresa";
        }

        this.elementos.modalEmpresa.classList.remove(
            "hidden"
        );

        document.body.classList.add(
            "modal-open"
        );

        setTimeout(() => {

            if (this.elementos.empresaRazaoSocial) {
                this.elementos.empresaRazaoSocial.focus();
            }

        }, 100);
    }

    /* ======================================================
       CNPJ
    ====================================================== */

    validarCnpj(cnpj) {

        const numero =
            String(cnpj || "")
                .replace(/\D/g, "");

        if (!numero) {
            return true;
        }

        if (numero.length !== 14) {
            return false;
        }

        if (/^(\d)\1{13}$/.test(numero)) {
            return false;
        }

        let soma = 0;
        let peso = 5;

        for (let i = 0; i < 12; i++) {

            soma +=
                parseInt(numero[i], 10) *
                peso;

            peso--;

            if (peso === 1) {
                peso = 9;
            }
        }

        let resto = soma % 11;

        let digito =
            resto < 2
                ? 0
                : 11 - resto;

        if (
            digito !==
            parseInt(numero[12], 10)
        ) {
            return false;
        }

        soma = 0;
        peso = 6;

        for (let i = 0; i < 13; i++) {

            soma +=
                parseInt(numero[i], 10) *
                peso;

            peso--;

            if (peso === 1) {
                peso = 9;
            }
        }

        resto = soma % 11;

        digito =
            resto < 2
                ? 0
                : 11 - resto;

        return (
            digito ===
            parseInt(numero[13], 10)
        );
    }

    /* ======================================================
       DUPLICIDADE
    ====================================================== */

    verificarDuplicidade(
        razaoSocial,
        cnpj,
        idAtual = null
    ) {

        const razao =
            this.normalizarTexto(
                razaoSocial
            ).toLowerCase();

        const numeroCnpj =
            String(cnpj || "")
                .replace(/\D/g, "");

        return this.empresas.find(empresa => {

            if (
                idAtual !== null &&
                String(empresa.id) ===
                String(idAtual)
            ) {
                return false;
            }

            const razaoExistente =
                this.normalizarTexto(
                    empresa.razaoSocial
                ).toLowerCase();

            const cnpjExistente =
                String(empresa.cnpj || "")
                    .replace(/\D/g, "");

            if (
                razao &&
                razaoExistente === razao
            ) {
                return true;
            }

            if (
                numeroCnpj &&
                cnpjExistente &&
                numeroCnpj === cnpjExistente
            ) {
                return true;
            }

            return false;
        });
    }

    /* ======================================================
       SALVAR EMPRESA
    ====================================================== */

    salvarEmpresa(evento) {

        if (evento) {
            evento.preventDefault();
        }

        const razaoSocial =
            this.normalizarTexto(
                this.elementos
                    .empresaRazaoSocial
                    ?.value
            );

        if (!razaoSocial) {

            alert(
                "Informe a Razão Social da empresa."
            );

            this.elementos
                .empresaRazaoSocial
                ?.focus();

            return;
        }

        const nomeFantasia =
            this.normalizarTexto(
                this.elementos
                    .empresaNomeFantasia
                    ?.value
            );

        const cnpj =
            this.elementos
                .empresaCnpj
                ?.value
                .trim() || "";

        if (
            cnpj &&
            !this.validarCnpj(cnpj)
        ) {

            alert(
                "O CNPJ informado é inválido."
            );

            this.elementos
                .empresaCnpj
                ?.focus();

            return;
        }

        const duplicada =
            this.verificarDuplicidade(
                razaoSocial,
                cnpj,
                this.empresaEditando
            );

        if (duplicada) {

            const mesmaRazao =
                this.normalizarTexto(
                    duplicada.razaoSocial
                ).toLowerCase() ===
                razaoSocial.toLowerCase();

            alert(
                mesmaRazao
                    ? "Já existe uma empresa cadastrada com esta Razão Social."
                    : "Já existe uma empresa cadastrada com este CNPJ."
            );

            return;
        }

        const empresa = {

            id:
                this.empresaEditando ||
                (
                    "empresa-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .slice(2, 8)
                ),

            codigo:
                this.elementos
                    .empresaCodigo
                    ?.value ||
                this.gerarProximoCodigo(),

            razaoSocial:
                this.capitalizarNome(
                    razaoSocial
                ),

            nomeFantasia:
                this.capitalizarNome(
                    nomeFantasia
                ),

            cnpj:
                this.formatarCnpj(
                    cnpj
                ),

            inscricaoEstadual:
                this.normalizarTexto(
                    this.elementos
                        .empresaInscricaoEstadual
                        ?.value
                ),

            status:
                this.elementos
                    .empresaStatus
                    ?.value ||
                "Ativa",

            telefone:
                this.formatarTelefone(
                    this.elementos
                        .empresaTelefone
                        ?.value
                ),

            email:
                this.normalizarTexto(
                    this.elementos
                        .empresaEmail
                        ?.value
                ).toLowerCase(),

            cep:
                this.formatarCep(
                    this.elementos
                        .empresaCep
                        ?.value
                ),

            endereco:
                this.normalizarTexto(
                    this.elementos
                        .empresaEndereco
                        ?.value
                ),

            cidade:
                this.capitalizarNome(
                    this.elementos
                        .empresaCidade
                        ?.value
                ),

            estado:
                this.elementos
                    .empresaEstado
                    ?.value ||
                "",

            observacoes:
                this.normalizarTexto(
                    this.elementos
                        .empresaObservacoes
                        ?.value
                ),

            atualizadoEm:
                new Date().toISOString()
        };

        if (this.empresaEditando) {

            const indice =
                this.empresas.findIndex(
                    item =>
                        String(item.id) ===
                        String(
                            this.empresaEditando
                        )
                );

            if (indice !== -1) {

                const anterior =
                    this.empresas[indice];

                this.empresas[indice] = {

                    ...anterior,
                    ...empresa,

                    criadoEm:
                        anterior.criadoEm ||
                        new Date().toISOString()
                };
            }

        } else {

            empresa.criadoEm =
                new Date().toISOString();

            this.empresas.push(
                empresa
            );

            if (
                empresa.status === "Ativa" &&
                !localStorage.getItem(
                    this.empresaAtivaKey
                )
            ) {

                localStorage.setItem(
                    this.empresaAtivaKey,
                    String(empresa.id)
                );
            }
        }

        if (!this.salvarDados()) {
            return;
        }

        alert(
            this.empresaEditando
                ? "Empresa atualizada com sucesso."
                : "Empresa cadastrada com sucesso."
        );

        this.fecharModal();
        this.renderizar();
        this.atualizarIndicadores();
    }

    /* ======================================================
       EXCLUIR
    ====================================================== */

    excluirEmpresa(id) {

        const empresa =
            this.empresas.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!empresa) {
            return;
        }

        const confirmar =
            confirm(
                "Deseja realmente excluir a empresa?\n\n" +
                (
                    empresa.razaoSocial ||
                    empresa.nomeFantasia ||
                    "Empresa"
                ) +
                "\n\n" +
                "Esta operação removerá o cadastro local."
            );

        if (!confirmar) {
            return;
        }

        this.empresas =
            this.empresas.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );

        if (
            String(
                localStorage.getItem(
                    this.empresaAtivaKey
                )
            ) === String(id)
        ) {

            localStorage.removeItem(
                this.empresaAtivaKey
            );
        }

        if (!this.salvarDados()) {
            return;
        }

        this.renderizar();
        this.atualizarIndicadores();

        alert(
            "Empresa excluída com sucesso."
        );
    }

    /* ======================================================
       ATIVAR / INATIVAR
    ====================================================== */

    alternarStatus(id) {

        const empresa =
            this.empresas.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!empresa) {
            return;
        }

        empresa.status =
            empresa.status === "Ativa"
                ? "Inativa"
                : "Ativa";

        if (
            empresa.status !== "Ativa" &&
            String(
                localStorage.getItem(
                    this.empresaAtivaKey
                )
            ) === String(id)
        ) {

            localStorage.removeItem(
                this.empresaAtivaKey
            );
        }

        empresa.atualizadoEm =
            new Date().toISOString();

        this.salvarDados();
        this.renderizar();
        this.atualizarIndicadores();
    }

    /* ======================================================
       PESQUISA
    ====================================================== */

    normalizarPesquisa(valor) {

        return String(valor || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }

    obterEmpresasFiltradas() {

        const termo =
            this.normalizarPesquisa(
                this.elementos
                    .pesquisarEmpresa
                    ?.value
            );

        if (!termo) {
            return [...this.empresas];
        }

        return this.empresas.filter(
            empresa => {

                const campos = [

                    empresa.codigo,
                    empresa.razaoSocial,
                    empresa.nomeFantasia,
                    empresa.cnpj,
                    empresa.inscricaoEstadual,
                    empresa.telefone,
                    empresa.email,
                    empresa.cidade,
                    empresa.estado
                ];

                return campos.some(
                    campo =>
                        this.normalizarPesquisa(
                            campo
                        ).includes(termo)
                );
            }
        );
    }

    /* ======================================================
       RENDERIZAÇÃO
    ====================================================== */

    renderizar() {

        const tbody =
            this.elementos.listaEmpresas;

        const vazio =
            this.elementos.estadoVazioEmpresas;

        const tabela =
            this.elementos.cardTabelaEmpresas;

        if (!tbody) {
            return;
        }

        const empresas =
            this.obterEmpresasFiltradas();

        tbody.innerHTML = "";

        if (!empresas.length) {

            if (tabela) {
                tabela.style.display = "block";
            }

            if (vazio) {
                vazio.style.display = "block";
            }

            return;
        }

        if (tabela) {
            tabela.style.display = "block";
        }

        if (vazio) {
            vazio.style.display = "none";
        }

        const empresaAtivaId =
            this.obterIdEmpresaAtiva();

        empresas.forEach(empresa => {

            const tr =
                document.createElement("tr");

            const statusAtiva =
                empresa.status === "Ativa";

            const empresaAtiva =
                String(empresaAtivaId || "") ===
                String(empresa.id);

            const razao =
                this.escapeHtml(
                    empresa.razaoSocial || "-"
                );

            const fantasia =
                this.escapeHtml(
                    empresa.nomeFantasia || "-"
                );

            const cnpj =
                this.escapeHtml(
                    empresa.cnpj || "-"
                );

            const cidade =
                this.escapeHtml(
                    empresa.cidade || "-"
                );

            const codigo =
                this.escapeHtml(
                    empresa.codigo || "-"
                );

            tr.innerHTML = `

                <td>
                    <strong>${codigo}</strong>
                </td>

                <td>
                    ${razao}
                </td>

                <td>
                    ${fantasia}
                </td>

                <td>
                    ${cnpj}
                </td>

                <td>
                    ${cidade}
                </td>

                <td>

                    <span class="status-badge ${
                        statusAtiva
                            ? "status-ativa"
                            : "status-inativa"
                    }">

                        ${
                            statusAtiva
                                ? "Ativa"
                                : "Inativa"
                        }

                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        ${
                            empresaAtiva

                                ? `

                                    <span
                                        class="empresa-ativa-indicador"
                                        title="Empresa atualmente selecionada">

                                        <i class="fa-solid fa-circle-check"></i>

                                        Empresa ativa

                                    </span>

                                  `

                                : statusAtiva

                                    ? `

                                        <button
                                            type="button"
                                            title="Selecionar empresa"
                                            data-acao="selecionar"
                                            data-id="${empresa.id}">

                                            <i class="fa-solid fa-building-circle-check"></i>

                                        </button>

                                      `

                                    : ""
                        }

                        <button
                            type="button"
                            title="Editar"
                            data-acao="editar"
                            data-id="${empresa.id}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            title="${
                                statusAtiva
                                    ? "Inativar"
                                    : "Ativar"
                            }"
                            data-acao="status"
                            data-id="${empresa.id}">

                            <i class="fa-solid ${
                                statusAtiva
                                    ? "fa-toggle-on"
                                    : "fa-toggle-off"
                            }"></i>

                        </button>

                        <button
                            type="button"
                            title="Excluir"
                            data-acao="excluir"
                            data-id="${empresa.id}">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    /* ======================================================
       INDICADORES
    ====================================================== */

    atualizarIndicadores() {

        const total =
            this.empresas.length;

        const ativas =
            this.empresas.filter(
                empresa =>
                    empresa.status === "Ativa"
            ).length;

        const inativas =
            this.empresas.filter(
                empresa =>
                    empresa.status !== "Ativa"
            ).length;

        const comEstoque =
            this.contarEmpresasComEstoque();

        if (this.elementos.totalEmpresas) {
            this.elementos.totalEmpresas.textContent =
                total;
        }

        if (this.elementos.empresasAtivas) {
            this.elementos.empresasAtivas.textContent =
                ativas;
        }

        if (this.elementos.empresasInativas) {
            this.elementos.empresasInativas.textContent =
                inativas;
        }

        if (this.elementos.empresasComEstoque) {
            this.elementos.empresasComEstoque.textContent =
                comEstoque;
        }
    }

    contarEmpresasComEstoque() {

        try {

            const dados =
                localStorage.getItem(
                    "beq_estoque"
                );

            if (!dados) {
                return 0;
            }

            const estoque =
                JSON.parse(dados);

            if (!Array.isArray(estoque)) {
                return 0;
            }

            const empresasComEstoque =
                new Set();

            estoque.forEach(item => {

                const quantidade =
                    Number(
                        item.quantidade || 0
                    );

                if (
                    item.empresaId &&
                    quantidade > 0
                ) {

                    empresasComEstoque.add(
                        String(item.empresaId)
                    );
                }
            });

            return empresasComEstoque.size;

        } catch (erro) {

            console.warn(
                "BEQ Empresas: não foi possível calcular empresas com estoque.",
                erro
            );

            return 0;
        }
    }

    /* ======================================================
       CONSULTA CEP
    ====================================================== */

    async consultarCep() {

        const campoCep =
            this.elementos.empresaCep;

        if (!campoCep) {
            return;
        }

        const cep =
            String(
                campoCep.value || ""
            ).replace(/\D/g, "");

        if (cep.length !== 8) {
            return;
        }

        if (this.elementos.empresaEndereco) {

            this.elementos
                .empresaEndereco
                .value =
                "Consultando CEP...";
        }

        try {

            const resposta =
                await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );

            if (!resposta.ok) {
                throw new Error(
                    "Falha na consulta do CEP."
                );
            }

            const dados =
                await resposta.json();

            if (dados.erro) {
                throw new Error(
                    "CEP não encontrado."
                );
            }

            if (this.elementos.empresaEndereco) {

                this.elementos
                    .empresaEndereco
                    .value =
                    dados.logradouro || "";
            }

            if (this.elementos.empresaCidade) {

                this.elementos
                    .empresaCidade
                    .value =
                    dados.localidade || "";
            }

            if (this.elementos.empresaEstado) {

                this.elementos
                    .empresaEstado
                    .value =
                    dados.uf || "";
            }

        } catch (erro) {

            console.warn(
                "BEQ Empresas: consulta de CEP indisponível.",
                erro
            );

            if (
                this.elementos.empresaEndereco &&
                this.elementos
                    .empresaEndereco
                    .value ===
                    "Consultando CEP..."
            ) {

                this.elementos
                    .empresaEndereco
                    .value = "";
            }
        }
    }

    /* ======================================================
       SEGURANÇA HTML
    ====================================================== */

    escapeHtml(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ======================================================
       EVENTOS
    ====================================================== */

    registrarEventos() {

        if (this.eventosRegistrados) {
            return;
        }

        this.eventosRegistrados = true;

        /* NOVA EMPRESA */

        if (this.elementos.btnNovaEmpresa) {

            this.elementos.btnNovaEmpresa
                .addEventListener(
                    "click",
                    () => {
                        this.abrirModal();
                    }
                );
        }

        if (this.elementos.btnNovaEmpresaVazio) {

            this.elementos.btnNovaEmpresaVazio
                .addEventListener(
                    "click",
                    () => {
                        this.abrirModal();
                    }
                );
        }

        /* FECHAR */

        if (this.elementos.fecharModalEmpresa) {

            this.elementos.fecharModalEmpresa
                .addEventListener(
                    "click",
                    () => {
                        this.fecharModal();
                    }
                );
        }

        if (this.elementos.cancelarEmpresa) {

            this.elementos.cancelarEmpresa
                .addEventListener(
                    "click",
                    () => {
                        this.fecharModal();
                    }
                );
        }

        /* FORMULÁRIO */

        if (this.elementos.formEmpresa) {

            this.elementos.formEmpresa
                .addEventListener(
                    "submit",
                    evento => {
                        this.salvarEmpresa(evento);
                    }
                );
        }

        /* CNPJ */

        if (this.elementos.empresaCnpj) {

            this.elementos.empresaCnpj
                .addEventListener(
                    "input",
                    evento => {

                        evento.target.value =
                            this.formatarCnpj(
                                evento.target.value
                            );
                    }
                );
        }

        /* TELEFONE */

        if (this.elementos.empresaTelefone) {

            this.elementos.empresaTelefone
                .addEventListener(
                    "input",
                    evento => {

                        evento.target.value =
                            this.formatarTelefone(
                                evento.target.value
                            );
                    }
                );
        }

        /* CEP */

        if (this.elementos.empresaCep) {

            this.elementos.empresaCep
                .addEventListener(
                    "input",
                    evento => {

                        evento.target.value =
                            this.formatarCep(
                                evento.target.value
                            );
                    }
                );

            this.elementos.empresaCep
                .addEventListener(
                    "blur",
                    () => {
                        this.consultarCep();
                    }
                );
        }

        /* PESQUISA */

        if (this.elementos.pesquisarEmpresa) {

            this.elementos.pesquisarEmpresa
                .addEventListener(
                    "input",
                    () => {
                        this.renderizar();
                    }
                );
        }

        if (this.elementos.btnMostrarEmpresas) {

            this.elementos.btnMostrarEmpresas
                .addEventListener(
                    "click",
                    () => {
                        this.renderizar();
                    }
                );
        }

        /* AÇÕES DA TABELA */

        if (this.elementos.listaEmpresas) {

            this.elementos.listaEmpresas
                .addEventListener(
                    "click",
                    evento => {

                        const botao =
                            evento.target.closest(
                                "button[data-acao]"
                            );

                        if (!botao) {
                            return;
                        }

                        const acao =
                            botao.dataset.acao;

                        const id =
                            botao.dataset.id;

                        if (
                            acao ===
                            "selecionar"
                        ) {

                            this.definirEmpresaAtiva(id);
                            return;
                        }

                        if (
                            acao ===
                            "editar"
                        ) {

                            this.editarEmpresa(id);
                            return;
                        }

                        if (
                            acao ===
                            "status"
                        ) {

                            this.alternarStatus(id);
                            return;
                        }

                        if (
                            acao ===
                            "excluir"
                        ) {

                            this.excluirEmpresa(id);
                        }
                    }
                );
        }

        /* CLIQUE FORA DO MODAL */

        if (this.elementos.modalEmpresa) {

            this.elementos.modalEmpresa
                .addEventListener(
                    "click",
                    evento => {

                        if (
                            evento.target ===
                            this.elementos.modalEmpresa
                        ) {

                            this.fecharModal();
                        }
                    }
                );
        }

        /* ESC */

        document.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Escape" &&
                    this.elementos.modalEmpresa &&
                    !this.elementos.modalEmpresa
                        .classList
                        .contains("hidden")
                ) {

                    this.fecharModal();
                }
            }
        );
    }
}

/* ==========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================== */

window.Empresas = Empresas;

console.log(
    "BEQ: empresas.js carregado."
);