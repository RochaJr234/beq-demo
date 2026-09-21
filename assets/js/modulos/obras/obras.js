/* =========================================================
   BEQ EMPREENDIMENTOS
   MÓDULO: OBRAS
   ARQUIVO: assets/js/modulos/obras/obras.js

   ETAPA 8.5
   - Integração com Empresa Ativa
   - Obras vinculadas à empresa
   - Filtro por empresa ativa
   - Preserva cadastro, edição, exclusão,
     pesquisa, status e código automático

   Rocha Digital
   ========================================================= */


class Obras {

    constructor() {

        this.storageKey = "beq_obras";

        this.empresaAtivaKey =
            "beq_empresa_ativa";

        this.empresasKey =
            "beq_empresas";

        this.obras = [];

        this.obraEditando = null;

        this.tabelaVisivel = true;

        this.elementos = {};

        this.eventosRegistrados = false;
    }


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    init() {

        console.log(
            "BEQ: Inicializando módulo Obras..."
        );

        this.cacheElementos();

        this.carregarObras();

        this.eventos();

        this.renderizar();

        console.log(
            "BEQ: módulo Obras inicializado."
        );
    }


    /* =====================================================
       CACHE DOS ELEMENTOS
       ===================================================== */

    cacheElementos() {

        this.elementos = {

            form:
                document.getElementById(
                    "formObra"
                ),

            cardForm:
                document.getElementById(
                    "cardFormObra"
                ),

            tituloForm:
                document.getElementById(
                    "tituloFormObra"
                ),

            id:
                document.getElementById(
                    "idObra"
                ),

            codigo:
                document.getElementById(
                    "codigoObra"
                ),

            nome:
                document.getElementById(
                    "nomeObra"
                ),

            cliente:
                document.getElementById(
                    "clienteObra"
                ),

            responsavel:
                document.getElementById(
                    "responsavelObra"
                ),

            endereco:
                document.getElementById(
                    "enderecoObra"
                ),

            dataInicio:
                document.getElementById(
                    "dataInicioObra"
                ),

            dataFim:
                document.getElementById(
                    "dataFimObra"
                ),

            status:
                document.getElementById(
                    "statusObra"
                ),

            observacoes:
                document.getElementById(
                    "observacoesObra"
                ),

            btnNova:
                document.getElementById(
                    "btnNovaObra"
                ),

            btnCancelar:
                document.getElementById(
                    "btnCancelarObra"
                ),

            btnMostrar:
                document.getElementById(
                    "btnMostrarObras"
                ),

            pesquisar:
                document.getElementById(
                    "pesquisarObra"
                ),

            cardTabela:
                document.getElementById(
                    "cardTabelaObras"
                ),

            lista:
                document.getElementById(
                    "listaObras"
                ),

            estadoVazio:
                document.getElementById(
                    "estadoVazioObras"
                )
        };
    }


    /* =====================================================
       EMPRESA ATIVA
       ===================================================== */

    obterIdEmpresaAtiva() {

        try {

            const id =
                localStorage.getItem(
                    this.empresaAtivaKey
                );

            return id || null;

        } catch (erro) {

            console.error(
                "BEQ Obras: erro ao obter empresa ativa.",
                erro
            );

            return null;
        }
    }


    obterEmpresaAtiva() {

        const id =
            this.obterIdEmpresaAtiva();

        if (!id) {
            return null;
        }

        try {

            const dados =
                localStorage.getItem(
                    this.empresasKey
                );

            if (!dados) {
                return null;
            }

            const empresas =
                JSON.parse(dados);

            if (!Array.isArray(empresas)) {
                return null;
            }

            return empresas.find(
                empresa =>
                    String(empresa.id) ===
                    String(id) &&
                    empresa.status === "Ativa"
            ) || null;

        } catch (erro) {

            console.error(
                "BEQ Obras: erro ao obter empresa ativa.",
                erro
            );

            return null;
        }
    }


    verificarEmpresaAtiva() {

        const empresa =
            this.obterEmpresaAtiva();

        if (!empresa) {

            alert(
                "Nenhuma empresa ativa foi selecionada.\n\n" +
                "Acesse o módulo Empresas e selecione " +
                "a empresa que será responsável pela obra."
            );

            return false;
        }

        return true;
    }


    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    carregarObras() {

        try {

            const dados =
                localStorage.getItem(
                    this.storageKey
                );

            this.obras =
                dados
                    ? JSON.parse(dados)
                    : [];

            if (!Array.isArray(this.obras)) {

                this.obras = [];
            }

        } catch (erro) {

            console.error(
                "BEQ Obras: erro ao carregar obras:",
                erro
            );

            this.obras = [];
        }
    }


    salvarStorage() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(
                    this.obras
                )
            );

            return true;

        } catch (erro) {

            console.error(
                "BEQ Obras: erro ao salvar obras:",
                erro
            );

            alert(
                "Não foi possível salvar as obras."
            );

            return false;
        }
    }


    /* =====================================================
       EVENTOS
       ===================================================== */

    eventos() {

        if (this.eventosRegistrados) {
            return;
        }

        this.eventosRegistrados = true;


        /* NOVA OBRA */

        if (this.elementos.btnNova) {

            this.elementos.btnNova
                .addEventListener(
                    "click",
                    () =>
                        this.abrirFormulario()
                );
        }


        /* CANCELAR */

        if (this.elementos.btnCancelar) {

            this.elementos.btnCancelar
                .addEventListener(
                    "click",
                    () =>
                        this.fecharFormulario()
                );
        }


        /* FORMULÁRIO */

        if (this.elementos.form) {

            this.elementos.form
                .addEventListener(
                    "submit",
                    evento => {

                        evento.preventDefault();

                        this.salvarObra();
                    }
                );
        }


        /* MOSTRAR / OCULTAR */

        if (this.elementos.btnMostrar) {

            this.elementos.btnMostrar
                .addEventListener(
                    "click",
                    () =>
                        this.toggleTabela()
                );
        }


        /* PESQUISA */

        if (this.elementos.pesquisar) {

            this.elementos.pesquisar
                .addEventListener(
                    "input",
                    () =>
                        this.renderizar()
                );
        }


        /* AÇÕES DA TABELA */

        if (this.elementos.lista) {

            this.elementos.lista
                .addEventListener(
                    "click",
                    evento => {

                        const botao =
                            evento.target.closest(
                                "[data-acao]"
                            );

                        if (!botao) {
                            return;
                        }

                        const id =
                            botao.dataset.id;

                        const acao =
                            botao.dataset.acao;


                        if (
                            acao ===
                            "editar"
                        ) {

                            this.editarObra(id);

                            return;
                        }


                        if (
                            acao ===
                            "excluir"
                        ) {

                            this.excluirObra(id);

                            return;
                        }
                    }
                );
        }
    }


    /* =====================================================
       ABRIR FORMULÁRIO
       ===================================================== */

    abrirFormulario() {

        if (!this.verificarEmpresaAtiva()) {
            return;
        }

        this.obraEditando = null;

        this.limparFormulario();

        if (this.elementos.tituloForm) {

            this.elementos.tituloForm.textContent =
                "Nova Obra";
        }

        if (this.elementos.cardForm) {

            this.elementos.cardForm
                .classList
                .remove("hidden");
        }

        if (this.elementos.nome) {

            this.elementos.nome.focus();
        }
    }


    /* =====================================================
       FECHAR FORMULÁRIO
       ===================================================== */

    fecharFormulario() {

        this.limparFormulario();

        this.obraEditando = null;

        if (this.elementos.cardForm) {

            this.elementos.cardForm
                .classList
                .add("hidden");
        }

        if (this.elementos.tituloForm) {

            this.elementos.tituloForm.textContent =
                "Nova Obra";
        }
    }


    /* =====================================================
       LIMPAR FORMULÁRIO
       ===================================================== */

    limparFormulario() {

        if (this.elementos.form) {

            this.elementos.form.reset();
        }

        if (this.elementos.id) {

            this.elementos.id.value = "";
        }

        if (this.elementos.codigo) {

            this.elementos.codigo.value = "";
        }

        if (this.elementos.status) {

            this.elementos.status.value =
                "planejamento";
        }
    }


    /* =====================================================
       GERAR CÓDIGO DA OBRA
       ===================================================== */

    gerarCodigo() {

        let maiorNumero = 0;


        this.obras.forEach(
            obra => {

                if (!obra.codigo) {
                    return;
                }

                const numero =
                    parseInt(
                        String(
                            obra.codigo
                        ).replace(
                            "OBR-",
                            ""
                        ),
                        10
                    );

                if (
                    !isNaN(numero) &&
                    numero > maiorNumero
                ) {

                    maiorNumero =
                        numero;
                }
            }
        );


        const proximoNumero =
            maiorNumero + 1;


        return (
            "OBR-" +
            String(
                proximoNumero
            ).padStart(
                5,
                "0"
            )
        );
    }


    /* =====================================================
       GERAR ID ÚNICO
       ===================================================== */

    gerarId() {

        return (

            Date.now()
                .toString(36) +

            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }


    /* =====================================================
       NORMALIZAR TEXTO
       ===================================================== */

    normalizarTexto(valor) {

        return String(
            valor ?? ""
        )
            .trim()
            .replace(
                /\s+/g,
                " "
            );
    }


    /* =====================================================
       CAPITALIZAR NOME
       ===================================================== */

    capitalizarNome(valor) {

        const texto =
            this.normalizarTexto(
                valor
            );

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
            .map(
                (palavra, indice) => {

                    if (
                        indice > 0 &&
                        particulas.includes(
                            palavra
                        )
                    ) {

                        return palavra;
                    }

                    return (
                        palavra
                            .charAt(0)
                            .toUpperCase() +

                        palavra.slice(1)
                    );
                }
            )
            .join(" ");
    }


    /* =====================================================
       SALVAR OBRA
       ===================================================== */

    salvarObra() {

        const empresa =
            this.obterEmpresaAtiva();


        /* EMPRESA OBRIGATÓRIA */

        if (!empresa) {

            alert(
                "Nenhuma empresa ativa foi selecionada.\n\n" +
                "Selecione uma empresa antes de cadastrar a obra."
            );

            return;
        }


        const nome =
            this.capitalizarNome(
                this.elementos.nome?.value
            );


        const cliente =
            this.capitalizarNome(
                this.elementos.cliente?.value
            );


        if (!nome) {

            alert(
                "Informe o nome da obra."
            );

            this.elementos.nome?.focus();

            return;
        }


        if (!cliente) {

            alert(
                "Informe o cliente da obra."
            );

            this.elementos.cliente?.focus();

            return;
        }


        const responsavel =
            this.capitalizarNome(
                this.elementos
                    .responsavel
                    ?.value
            );


        const endereco =
            this.normalizarTexto(
                this.elementos
                    .endereco
                    ?.value
            );


        const dataInicio =
            this.elementos
                .dataInicio
                ?.value || "";


        const dataFim =
            this.elementos
                .dataFim
                ?.value || "";


        const status =
            this.elementos
                .status
                ?.value ||
            "planejamento";


        const observacoes =
            this.normalizarTexto(
                this.elementos
                    .observacoes
                    ?.value
            );


        /* =================================================
           EDIÇÃO
           ================================================= */

        if (this.obraEditando) {

            const indice =
                this.obras.findIndex(
                    obra =>
                        String(
                            obra.id
                        ) ===
                        String(
                            this.obraEditando
                        )
                );


            if (indice === -1) {

                alert(
                    "Obra não encontrada."
                );

                return;
            }


            const obraAtual =
                this.obras[indice];


            /*
               A empresa da obra permanece
               a mesma durante a edição.

               Caso seja uma obra antiga,
               sem empresaId, vinculamos
               à empresa atualmente ativa.
            */

            const empresaId =
                obraAtual.empresaId ||
                empresa.id;


            this.obras[indice] = {

                ...obraAtual,

                empresaId:

                    empresaId,

                empresaNome:

                    obraAtual.empresaNome ||
                    empresa.nomeFantasia ||
                    empresa.razaoSocial ||
                    "",

                nome:

                    nome,

                cliente:

                    cliente,

                responsavel:

                    responsavel,

                endereco:

                    endereco,

                dataInicio:

                    dataInicio,

                dataFim:

                    dataFim,

                status:

                    status,

                observacoes:

                    observacoes,

                atualizadoEm:

                    new Date()
                        .toISOString()
            };
        }


        /* =================================================
           NOVO CADASTRO
           ================================================= */

        else {

            const agora =
                new Date()
                    .toISOString();


            const novaObra = {

                id:

                    this.gerarId(),

                codigo:

                    this.gerarCodigo(),

                empresaId:

                    empresa.id,

                empresaNome:

                    empresa.nomeFantasia ||
                    empresa.razaoSocial ||
                    "",

                nome:

                    nome,

                cliente:

                    cliente,

                responsavel:

                    responsavel,

                endereco:

                    endereco,

                dataInicio:

                    dataInicio,

                dataFim:

                    dataFim,

                status:

                    status,

                observacoes:

                    observacoes,

                criadoEm:

                    agora,

                atualizadoEm:

                    agora
            };


            this.obras.push(
                novaObra
            );
        }


        /* SALVAR */

        if (!this.salvarStorage()) {
            return;
        }


        this.renderizar();

        this.fecharFormulario();


        console.log(
            "BEQ Obras: obra salva.",
            {
                empresaId:
                    empresa.id,

                empresa:
                    empresa.nomeFantasia ||
                    empresa.razaoSocial
            }
        );
    }


    /* =====================================================
       EDITAR OBRA
       ===================================================== */

    editarObra(id) {

        const obra =
            this.obras.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!obra) {

            alert(
                "Obra não encontrada."
            );

            return;
        }


        const empresaAtivaId =
            this.obterIdEmpresaAtiva();


        /*
           Não permite editar uma obra
           pertencente a outra empresa.
        */

        if (
            obra.empresaId &&
            String(
                obra.empresaId
            ) !==
            String(
                empresaAtivaId
            )
        ) {

            alert(
                "Esta obra pertence a outra empresa.\n\n" +
                "Selecione a empresa correspondente " +
                "para editar esta obra."
            );

            return;
        }


        /*
           Obras antigas sem empresaId
           podem ser vinculadas à empresa
           atualmente ativa durante a edição.
        */

        if (!obra.empresaId) {

            if (!empresaAtivaId) {

                alert(
                    "Nenhuma empresa ativa foi selecionada."
                );

                return;
            }
        }


        this.obraEditando =
            obra.id;


        if (this.elementos.id) {

            this.elementos.id.value =
                obra.id;
        }


        if (this.elementos.codigo) {

            this.elementos.codigo.value =
                obra.codigo || "";
        }


        if (this.elementos.nome) {

            this.elementos.nome.value =
                obra.nome || "";
        }


        if (this.elementos.cliente) {

            this.elementos.cliente.value =
                obra.cliente || "";
        }


        if (this.elementos.responsavel) {

            this.elementos.responsavel.value =
                obra.responsavel || "";
        }


        if (this.elementos.endereco) {

            this.elementos.endereco.value =
                obra.endereco || "";
        }


        if (this.elementos.dataInicio) {

            this.elementos.dataInicio.value =
                obra.dataInicio || "";
        }


        if (this.elementos.dataFim) {

            this.elementos.dataFim.value =
                obra.dataFim || "";
        }


        if (this.elementos.status) {

            this.elementos.status.value =
                obra.status ||
                "planejamento";
        }


        if (this.elementos.observacoes) {

            this.elementos.observacoes.value =
                obra.observacoes || "";
        }


        if (this.elementos.tituloForm) {

            this.elementos.tituloForm.textContent =
                "Editar Obra";
        }


        if (this.elementos.cardForm) {

            this.elementos.cardForm
                .classList
                .remove("hidden");
        }


        if (this.elementos.nome) {

            this.elementos.nome.focus();
        }
    }


    /* =====================================================
       EXCLUIR OBRA
       ===================================================== */

    excluirObra(id) {

        const obra =
            this.obras.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!obra) {
            return;
        }


        const empresaAtivaId =
            this.obterIdEmpresaAtiva();


        /*
           Impede excluir obra
           de outra empresa.
        */

        if (
            obra.empresaId &&
            String(
                obra.empresaId
            ) !==
            String(
                empresaAtivaId
            )
        ) {

            alert(
                "Esta obra pertence a outra empresa."
            );

            return;
        }


        const confirmar =
            confirm(
                `Deseja realmente excluir a obra "${obra.nome}"?`
            );


        if (!confirmar) {
            return;
        }


        this.obras =
            this.obras.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );


        if (!this.salvarStorage()) {
            return;
        }


        this.renderizar();


        console.log(
            "BEQ Obras: obra excluída:",
            obra.codigo
        );
    }


    /* =====================================================
       MOSTRAR / OCULTAR TABELA
       ===================================================== */

    toggleTabela() {

        if (!this.elementos.cardTabela) {
            return;
        }


        this.elementos.cardTabela
            .classList
            .toggle("hidden");


        this.tabelaVisivel =
            !this.elementos.cardTabela
                .classList
                .contains("hidden");


        if (
            this.elementos.btnMostrar
        ) {

            if (
                this.tabelaVisivel
            ) {

                this.elementos
                    .btnMostrar
                    .innerHTML = `

                        <i class="fa-solid fa-eye-slash"></i>
                        Ocultar Obras

                    `;

            } else {

                this.elementos
                    .btnMostrar
                    .innerHTML = `

                        <i class="fa-solid fa-eye"></i>
                        Mostrar Obras

                    `;
            }
        }
    }


    /* =====================================================
       OBRAS DA EMPRESA ATIVA
       ===================================================== */

    obterObrasDaEmpresaAtiva() {

        const empresaAtivaId =
            this.obterIdEmpresaAtiva();


        /*
           Sem empresa ativa:
           nenhuma obra é exibida.
        */

        if (!empresaAtivaId) {

            return [];
        }


        return this.obras.filter(
            obra =>

                String(
                    obra.empresaId
                ) ===
                String(
                    empresaAtivaId
                )
        );
    }


    /* =====================================================
       RENDERIZAR TABELA
       ===================================================== */

    renderizar() {

        if (!this.elementos.lista) {
            return;
        }


        const empresaAtiva =
            this.obterEmpresaAtiva();


        /*
           Se não houver empresa ativa,
           mostra estado vazio.
        */

        if (!empresaAtiva) {

            this.elementos.lista.innerHTML =
                "";

            this.mostrarEstadoVazio();

            return;
        }


        const obrasEmpresa =
            this.obterObrasDaEmpresaAtiva();


        const termo =
            this.elementos.pesquisar

                ? this.normalizarPesquisa(
                    this.elementos
                        .pesquisar
                        .value
                )

                : "";


        let obrasFiltradas =
            obrasEmpresa;


        if (termo) {

            obrasFiltradas =
                obrasEmpresa.filter(
                    obra => {

                        return (

                            this.normalizarPesquisa(
                                obra.codigo
                            ).includes(
                                termo
                            )

                            ||

                            this.normalizarPesquisa(
                                obra.nome
                            ).includes(
                                termo
                            )

                            ||

                            this.normalizarPesquisa(
                                obra.cliente
                            ).includes(
                                termo
                            )

                            ||

                            this.normalizarPesquisa(
                                obra.responsavel
                            ).includes(
                                termo
                            )

                            ||

                            this.normalizarPesquisa(
                                obra.status
                            ).includes(
                                termo
                            )
                        );
                    }
                );
        }


        this.elementos.lista.innerHTML =
            "";


        if (
            obrasFiltradas.length === 0
        ) {

            this.mostrarEstadoVazio();

            return;
        }


        this.ocultarEstadoVazio();


        obrasFiltradas.forEach(
            obra => {

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>
                        ${this.escaparHTML(
                            obra.codigo
                        )}
                    </td>

                    <td>
                        <strong>
                            ${this.escaparHTML(
                                obra.nome
                            )}
                        </strong>
                    </td>

                    <td>
                        ${this.escaparHTML(
                            obra.cliente
                        )}
                    </td>

                    <td>
                        ${this.escaparHTML(
                            obra.responsavel ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${this.formatarData(
                            obra.dataInicio
                        )}
                    </td>

                    <td>
                        ${this.formatarData(
                            obra.dataFim
                        )}
                    </td>

                    <td>
                        ${this.criarStatus(
                            obra.status
                        )}
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                type="button"
                                class="btn btn-sm btn-secondary"
                                data-acao="editar"
                                data-id="${this.escaparHTML(
                                    obra.id
                                )}"
                                title="Editar obra"
                            >

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <button
                                type="button"
                                class="btn btn-sm btn-danger"
                                data-acao="excluir"
                                data-id="${this.escaparHTML(
                                    obra.id
                                )}"
                                title="Excluir obra"
                            >

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </td>
                `;


                this.elementos.lista
                    .appendChild(
                        linha
                    );
            }
        );
    }


    /* =====================================================
       PESQUISA NORMALIZADA
       ===================================================== */

    normalizarPesquisa(valor) {

        return String(
            valor ?? ""
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }


    /* =====================================================
       STATUS
       ===================================================== */

    criarStatus(status) {

        const nomes = {

            planejamento:
                "Planejamento",

            andamento:
                "Em andamento",

            pausada:
                "Pausada",

            concluida:
                "Concluída",

            cancelada:
                "Cancelada"
        };


        const nome =
            nomes[status] ||
            "Planejamento";


        return `

            <span
                class="status status-${this.escaparHTML(
                    status
                )}"
            >

                ${nome}

            </span>

        `;
    }


    /* =====================================================
       ESTADO VAZIO
       ===================================================== */

    mostrarEstadoVazio() {

        if (
            this.elementos.estadoVazio
        ) {

            this.elementos.estadoVazio
                .classList
                .remove("hidden");
        }
    }


    ocultarEstadoVazio() {

        if (
            this.elementos.estadoVazio
        ) {

            this.elementos.estadoVazio
                .classList
                .add("hidden");
        }
    }


    /* =====================================================
       FORMATAR DATA
       ===================================================== */

    formatarData(data) {

        if (!data) {
            return "-";
        }


        const partes =
            String(data).split("-");


        if (
            partes.length !== 3
        ) {

            return this.escaparHTML(
                data
            );
        }


        return (

            `${partes[2]}/` +
            `${partes[1]}/` +
            `${partes[0]}`
        );
    }


    /* =====================================================
       PROTEÇÃO CONTRA HTML
       ===================================================== */

    escaparHTML(valor) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            valor ?? "";


        return div.innerHTML;
    }
}


/* =========================================================
   DISPONIBILIZAR MÓDULO
   ========================================================= */

window.Obras =
    Obras;


console.log(
    "BEQ: obras.js carregado - ETAPA 8.5."
);