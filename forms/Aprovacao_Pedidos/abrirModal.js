var currentModal; // Declarar a variável no escopo global

function abrirModal(doc) {
    var formattedDate = "__/__/____";
    if (currentModal) {
        currentModal.remove(); // Remover o modal anterior se existir
    }
    if (moment(doc.CR_DATALIB).isValid()) {
        // Se a data for válida, formatá-la
        formattedDate = moment(doc.CR_DATALIB).format("DD/MM/yyyy");
    }

    var contentHTML =
'<style>' +
    '.custom-modal-content { width: 1800px; margin-left:-600px }' +
    '.item-container { display: block; max-height: 400px; overflow-y: auto; }' +
    '.item-row { border: 1px solid #ddd; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); background-color: #fff; margin-bottom: 10px; font-size: 16px; }' +
    '.custom-text { margin-bottom: 10px; }' +
'</style>' +
'<div class="modal fade custom-modal" id="modalDetalhes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-xl custom-modal-dialog" role="document">' +
        '<div class="modal-content custom-modal-content">' +
            '<div class="panel-heading align-items-center" style="background-color: rgb(172, 0, 0); margin-bottom: 10px;">' +
                '<img src="LOGOABAINFRA.png" alt="Descrição da imagem" class="imgaba">' +
                '<div class="panel panel-danger" style="background-color: rgb(172, 0, 0); border: 0px">' +
                    '<h5 style="color: white; font-size: 20px;">Detalhes do Pedido</h5>' +
                '</div>' +
            '</div>' +
            '<div class="modal-body">' +
                '<div class="modal-content-wrapper">' +
                    '<div class="row">' +
                        '<div class="col-md-6">' +
                            '<p class="custom-text"><strong>Filial:</strong> ' + doc.CR_FILIAL + ' - ' + doc.M0_FILIAL + '</p>' +
                            '<p class="custom-text"><strong>Pedido:</strong> ' + doc.CR_NUM + '</p>' +
                            '<p class="custom-text"><strong>Comprador:</strong> ' + doc.USR_CODIGO.toUpperCase() + '</p>' +
                            '<p class="custom-text"><strong>Data:</strong> ' + moment(doc.CR_EMISSAO).format("DD/MM/yyyy") + '</p>' +
                        '</div>' +
                        '<div class="col-md-6 text-right">' +
                            '<p class="custom-text"><strong>Data Aprovação: </strong>' + formattedDate + '</p>' +
                            '<p class="custom-text"><strong>Prazo: </strong>' + moment(doc.CR_PRAZO).format("DD/MM/yyyy") + '</p>' +
                            '<p class="custom-text"><strong>Condição Pagamento: </strong>' + doc.ITENS[0].C7_COND + ' - ' + doc.ITENS[0].E4_DESCRI + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<h3>Itens do Pedido:</h3>' +
                    '<div class="item-container">';

if (doc.ITENS.length > 0) {
    doc.ITENS.forEach(function (item) {
        contentHTML += '<div class="item-row">' +
                            '<p><strong>Produto:</strong> ' + item.C7_PRODUTO + '</p>' +
                            '<p><strong>Descrição:</strong> ' + item.C7_DESCRI + '</p>' +
                            '<p><strong>Centro de Custo:</strong> ' + item.C7_CC + ' - ' + item.CTT_DESC01 + '</p>' +
                            '<p><strong>Observação:</strong> ' + item.C7_OBS + '</p>' +
                            '<p><strong>Preço:</strong> ' + toLocale(item.C7_PRECO) + '</p>' +
                            '<p><strong>Quantidade:</strong> ' + item.C7_QUANT + '</p>' +
                            '<p><strong>Total:</strong> ' + toLocale(item.C7_TOTAL) + '</p>' +
                        '</div>';
    });
} else {
    contentHTML += '<p>Nenhum item encontrado.</p>';
}

contentHTML += '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>' +
            '</div>' +
        '</div>' +
    '</div>' +
'</div>';

$(document.body).append(contentHTML);
currentModal = $('#modalDetalhes').modal('show');
}
function fecharModal() {
    if (currentModal) {
        currentModal.modal('hide');
    }
}

function toLocale(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
