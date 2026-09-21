/* ==========================================================
   BEQ EMPREENDIMENTOS
   ARQUIVO: assets/js/core/limpeza.js

   RESPONSABILIDADE:
   Limpeza dos dados locais do sistema.

   NÃO ALTERAR OUTROS MÓDULOS.
========================================================== */

class LimpezaSistema {

    constructor() {

        this.chaves = [
            "beq_produtos",
            "beq_categorias",
            "beq_clientes",
            "beq_fornecedores",
            "beq_obras",
            "beq_compras",
            "beq_movimentacoes_estoque"
        ];

    }


    /* ======================================================
       VERIFICAR DADOS EXISTENTES
    ====================================================== */

    verificarDados() {

        const dados = {};

        this.chaves.forEach(chave => {

            try {

                const valor = localStorage.getItem(chave);

                if (!valor) {

                    dados[chave] = 0;
                    return;

                }

                const convertido = JSON.parse(valor);

                dados[chave] = Array.isArray(convertido)
                    ? convertido.length
                    : 1;

            } catch (erro) {

                console.error(
                    "Erro ao verificar:",
                    chave,
                    erro
                );

                dados[chave] = 0;
            }

        });

        return dados;
    }


    /* ======================================================
       LIMPAR DADOS
    ====================================================== */

    limparDados() {

        const confirmar = confirm(

            "⚠️ ATENÇÃO\n\n" +

            "Esta operação irá apagar os dados locais " +
            "cadastrados no sistema.\n\n" +

            "Serão removidos:\n" +

            "• Produtos\n" +
            "• Categorias\n" +
            "• Clientes\n" +
            "• Fornecedores\n" +
            "• Obras\n" +
            "• Compras\n" +
            "• Movimentações de estoque\n\n" +

            "Esta ação não poderá ser desfeita.\n\n" +

            "Deseja realmente continuar?"

        );


        if (!confirmar) {

            return false;

        }


        this.chaves.forEach(chave => {

            localStorage.removeItem(chave);

        });


        console.log(
            "BEQ: dados locais removidos com sucesso."
        );


        alert(
            "Dados locais removidos com sucesso.\n\n" +
            "O sistema será atualizado."
        );


        window.location.reload();


        return true;
    }

}


/* ==========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================== */

window.LimpezaSistema = LimpezaSistema;