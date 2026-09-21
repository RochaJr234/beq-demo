/**
 * ==========================================================
 * BEQ EMPREENDIMENTOS
 * CONTROLE DA EMPRESA ATIVA
 * ==========================================================
 *
 * Responsabilidade:
 * - Controlar a empresa atualmente selecionada
 * - Persistir somente o ID da empresa ativa
 * - Permitir trocar a empresa
 * - Disponibilizar a empresa ativa para os demais módulos
 *
 * Não controla:
 * - Cadastro de empresas
 * - Estoque
 * - Compras
 * - Obras
 * - Clientes
 * ==========================================================
 */

class ControleEmpresaAtiva {

    constructor() {

        // Chave que guarda SOMENTE o ID da empresa
        this.chaveStorage = "beq_empresa_ativa";

        // Cadastro geral das empresas
        this.empresasKey = "beq_empresas";

        // Empresa atualmente carregada em memória
        this.empresa = null;
    }


    /**
     * ==========================================================
     * INICIALIZAÇÃO
     * ==========================================================
     */

    init() {

        this.carregar();

        console.log(
            "BEQ: controle de empresa ativa inicializado.",
            this.empresa
        );

        return this.empresa;
    }


    /**
     * ==========================================================
     * CARREGAR EMPRESA ATIVA
     * ==========================================================
     *
     * O LocalStorage guarda somente:
     *
     * beq_empresa_ativa = "empresa-123"
     *
     * O objeto completo é localizado dentro de:
     *
     * beq_empresas
     * ==========================================================
     */

    carregar() {

        try {

            const empresaId = localStorage.getItem(
                this.chaveStorage
            );


            /*
             * Nenhuma empresa selecionada
             */

            if (!empresaId) {

                this.empresa = null;

                return null;
            }


            /*
             * Carrega o cadastro das empresas
             */

            const dadosEmpresas = localStorage.getItem(
                this.empresasKey
            );

            if (!dadosEmpresas) {

                this.empresa = null;

                return null;
            }


            const empresas = JSON.parse(
                dadosEmpresas
            );


            if (!Array.isArray(empresas)) {

                this.empresa = null;

                return null;
            }


            /*
             * Procura a empresa pelo ID salvo
             */

            const empresaEncontrada = empresas.find(
                empresa =>
                    String(empresa.id) === String(empresaId)
            );


            /*
             * Empresa não encontrada
             */

            if (!empresaEncontrada) {

                console.warn(
                    "BEQ: empresa ativa não encontrada no cadastro:",
                    empresaId
                );

                this.empresa = null;

                return null;
            }


            /*
             * Verifica se a empresa está ativa.
             *
             * Aceitamos os dois padrões utilizados
             * anteriormente pelo sistema:
             *
             * "ativo"
             * "ativa"
             */

            const status = String(
                empresaEncontrada.status || ""
            ).toLowerCase();


            const empresaAtiva =
                status === "ativo" ||
                status === "ativa";


            if (!empresaAtiva) {

                console.warn(
                    "BEQ: empresa selecionada está inativa:",
                    empresaEncontrada
                );

                this.empresa = null;

                localStorage.removeItem(
                    this.chaveStorage
                );

                return null;
            }


            /*
             * Mantém somente os dados necessários
             * da empresa em memória.
             */

            this.empresa = {

                id: empresaEncontrada.id,

                codigo:
                    empresaEncontrada.codigo || "",

                razaoSocial:
                    empresaEncontrada.razaoSocial || "",

                nomeFantasia:
                    empresaEncontrada.nomeFantasia || "",

                cnpj:
                    empresaEncontrada.cnpj || "",

                status:
                    empresaEncontrada.status || "ativa"
            };


            return this.empresa;

        } catch (erro) {

            console.error(
                "BEQ: erro ao carregar empresa ativa.",
                erro
            );

            this.empresa = null;

            return null;
        }
    }


    /**
     * ==========================================================
     * DEFINIR EMPRESA ATIVA
     * ==========================================================
     *
     * IMPORTANTE:
     * O LocalStorage recebe SOMENTE o ID.
     * ==========================================================
     */

    definir(empresa) {

        if (!empresa || !empresa.id) {

            console.warn(
                "BEQ: empresa inválida para seleção."
            );

            return false;
        }


        /*
         * Verifica status da empresa
         */

        const status = String(
            empresa.status || ""
        ).toLowerCase();


        if (
            status &&
            status !== "ativo" &&
            status !== "ativa"
        ) {

            console.warn(
                "BEQ: não é possível selecionar empresa inativa.",
                empresa
            );

            return false;
        }


        /*
         * Guarda a empresa em memória
         */

        this.empresa = {

            id: empresa.id,

            codigo:
                empresa.codigo || "",

            razaoSocial:
                empresa.razaoSocial || "",

            nomeFantasia:
                empresa.nomeFantasia || "",

            cnpj:
                empresa.cnpj || "",

            status:
                empresa.status || "ativa"
        };


        try {

            /*
             * ==================================================
             * PADRÃO OFICIAL DO SISTEMA
             * ==================================================
             *
             * Guarda somente:
             *
             * empresa.id
             *
             * e NÃO JSON.stringify(empresa)
             */

            localStorage.setItem(
                this.chaveStorage,
                String(this.empresa.id)
            );

        
/* ==========================================================
   AVISA O SISTEMA QUE A EMPRESA ATIVA MUDOU
========================================================== */

window.dispatchEvent(
    new CustomEvent(
        "empresaAtivaAlterada",
        {
            detail: empresa
        }
    )
);

            console.log(
                "BEQ: empresa ativa definida:",
                this.empresa
            );


            return true;

        } catch (erro) {

            console.error(
                "BEQ: erro ao salvar empresa ativa.",
                erro
            );

            return false;
        }
    }


    /**
     * ==========================================================
     * OBTER EMPRESA ATIVA
     * ==========================================================
     */

    obter() {

        return this.empresa;
    }


    /**
     * ==========================================================
     * OBTER ID DA EMPRESA ATIVA
     * ==========================================================
     */

    obterId() {

        return this.empresa
            ? this.empresa.id
            : null;
    }


    /**
     * ==========================================================
     * VERIFICAR SE EXISTE EMPRESA ATIVA
     * ==========================================================
     */

    existe() {

        return !!this.empresa;
    }


    /**
     * ==========================================================
     * LIMPAR EMPRESA ATIVA
     * ==========================================================
     */

    limpar() {

        this.empresa = null;

        localStorage.removeItem(
            this.chaveStorage
        );

        console.log(
            "BEQ: empresa ativa removida."
        );
    }


    /**
     * ==========================================================
     * NOME PARA EXIBIÇÃO
     * ==========================================================
     */

    nomeExibicao() {

        if (!this.empresa) {

            return "Nenhuma empresa selecionada";
        }


        return (
            this.empresa.nomeFantasia ||
            this.empresa.razaoSocial ||
            "Empresa sem identificação"
        );
    }
}


/**
 * ==========================================================
 * INSTÂNCIA GLOBAL
 * ==========================================================
 *
 * EmpresaAtiva será utilizada pelos demais módulos.
 * ==========================================================
 */

window.EmpresaAtiva =
    new ControleEmpresaAtiva();


console.log(
    "BEQ: empresaAtiva.js carregado."
);

/* ==========================================================
   INDICADOR DE EMPRESA ATIVA - TOPBAR
========================================================== */

function atualizarEmpresaAtivaHeader() {

    const elemento =
        document.getElementById(
            "nomeEmpresaAtivaHeader"
        );

    if (!elemento) {
        return;
    }


    try {

        const idEmpresa =
            localStorage.getItem(
                "beq_empresa_ativa"
            );


        const empresas =
            JSON.parse(
                localStorage.getItem(
                    "beq_empresas"
                )
            ) || [];


        if (!idEmpresa) {

            elemento.textContent =
                "Nenhuma empresa selecionada";

            return;
        }


        const empresa =
            empresas.find(
                item =>
                    String(item.id) ===
                    String(idEmpresa)
            );


        if (!empresa) {

            elemento.textContent =
                "Empresa não encontrada";

            return;
        }


        const nomeEmpresa =
            empresa.nomeFantasia ||
            empresa.razaoSocial ||
            empresa.razao ||
            empresa.nome ||
            "Empresa";


        elemento.textContent =
            nomeEmpresa;


    } catch (erro) {

        console.error(
            "Erro ao atualizar empresa ativa no cabeçalho:",
            erro
        );

        elemento.textContent =
            "Erro ao carregar empresa";

    }

}


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarEmpresaAtivaHeader();

    }
);


/* ==========================================================
   ATUALIZAÇÃO QUANDO A EMPRESA MUDAR
========================================================== */

window.addEventListener(
    "empresaAtivaAlterada",
    () => {

        atualizarEmpresaAtivaHeader();

    }
);