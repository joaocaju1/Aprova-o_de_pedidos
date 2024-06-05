//Comunica com o Fonte API e trata o retorno das aprovações
function manipularDocumento(OPERACAO, FILIAL, PEDIDO, TIPO, APROV, USER, OBS) {
    return new Promise((resolve) => {
        MTA094(OPERACAO, FILIAL, PEDIDO, TIPO, APROV, USER, OBS)
            .then(statusCode => {
                if (statusCode === '200') {
                    resolve(true); // Resolva a Promise com true
                } else {
                    // statusCode é null ou diferente de 200, então resolve com false
                    resolve(false);
                }
            });
    });
}