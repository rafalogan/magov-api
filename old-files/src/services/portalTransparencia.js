const axios = require('axios')

async function budgetAmendments() {
    let res = null
    try {
        await axios.get('https://www.portaldatransparencia.gov.br/despesas/documento/documentos-relacionados/resultado?paginacaoSimples=true&tamanhoPagina=15&offset=0&direcaoOrdenacao=asc&colunaOrdenacao=fase&colunasSelecionadas=data%2Cfase%2CdocumentoResumido%2Cespecie&fase=Empenho&codigo=183023182052018NE000694&_=1648847762745').then(r => {
            res = r.data
        })
        return res
    } catch (error) {
        console.log(error)
    }
};

export default budgetAmendments;
