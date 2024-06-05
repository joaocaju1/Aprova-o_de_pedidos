
function HttpSend(requestOptions, callback) {
    const url = 'https://abainfraestrutura147637.protheus.cloudtotvs.com.br:3006/rest/pedidos';

    fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                PopUPErro('Erro de comunicação com a API Protheus!', 'Erro: ' + response.status);
                console.log(response.body);
                throw new Error('Erro na solicitação: ' + response.status);                
            }
        })
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error("Erro na solicitação:", error);
            callback(null);
        });
}

function MTA094(operacao, filial, pedido, tipo, aprov, user, obs) {
    return new Promise((resolve, reject) => {
        const body = {
            PEDIDOS: [
                {
                    OPERACAO: operacao,
                    FILIAL: filial,
                    PEDIDO: pedido,
                    TIPO: tipo,
                    APROV: aprov,
                    USER: user,
                    OBS: obs
                }
            ]

        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + apiCredenciais(),
                'Content-Type': 'application/json',
                'IdEmp': '01',
                'IdFilial': '0101',
            },
            body: JSON.stringify(body),
        };

        HttpSend(requestOptions, function (response) {
            if (response !== null) {
                // Se a resposta for bem-sucedida, verifique o código de status e o código no corpo
                const codigoNoCorpo = response.resultado[0].code; // Ajuste conforme a estrutura real do corpo da resposta
                if (codigoNoCorpo === '200') {
                    resolve(codigoNoCorpo);
                } else {
                    // Se o código no corpo for diferente de 200, retorne null
                    PopUPErro(response.resultado[0].mensagem + '\n' + response.resultado[0].solucao, 'Erro: ' + response.resultado[0].code)
                    resolve(null);
                }
            } else {
                // Se houver um erro na solicitação, rejeite a Promise com uma mensagem de erro
                reject("Erro na solicitação PUT");
            }
        });
    });
}

function apiDocumentos(user, status) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + apiCredenciais(),
                'Content-Type': 'application/json',
                'IdEmp': '01',
                'IdFilial': '0101',
                'user': '' + user + '',
                'status': '' + status + ''
            },
        };

        HttpSend(requestOptions, function (response) {
            if (response !== null) {
                resolve(response); // Resolva a promessa com a resposta
            } else {
                console.log(response.data)
                reject(response); // Rejeite a promessa com uma mensagem de erro
            }
        });
    });
}

function apiHistorico(FilPed, NumPed, User, Status, Fornec, Emissa) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + apiCredenciais(),
                'Content-Type': 'application/json',
                'IdEmp': '01',
                'IdFilial': '0101',
                'FilPed': '' + FilPed + '',
                'NumPed': '' + NumPed + '',
                'User': '' + User + '',
                'Status': '' + Status + '',
                'Fornec': '' + Fornec + '',
                'Emissa': '' + Emissa + ''
            },
        };

        HttpSend(requestOptions, function (response) {
            if (response !== null) {
                resolve(response); // Resolva a promessa com a resposta
            } else {
                console.log(response.data)
                reject(response); // Rejeite a promessa com uma mensagem de erro
            }
        });
    });
}

function apiCredenciais() {

    const usuario = 'admin';
    const senha = 'Totvs@2023**';

    // Codifique as credenciais em base64
    const base64Credentials = btoa(usuario + ':' + senha);

    return base64Credentials;
}

//PopUP de notificação de erro
function PopUPErro(message, title) {
    return new Promise(function (resolve, reject) {
        // Exiba uma mensagem de erro
        FLUIGC.message.error({
            message: message,
            title: title
        });

        // Rejeite a Promise com false
        reject(false);
    });
}
