var pedidos = []; //Documentos retornados da SCR
var filiais = [];
var ccusto = [];
var pendentes = 0;
var visiveis = [];
var user = parent.WCMAPI.getUserCode();

//Evento inicial da Pagina.
document.addEventListener("DOMContentLoaded", async function () {
    try {
        //Carrega os pedidos do usuário logado na variável 'pedidos' através da API do Protheus.
        document.getElementById('loadAprova').style.display = "none";
        const response = await apiDocumentos(user, '02,03,04,05,06,07');
        pedidos = response;

        // Ordena os pedidos carregados.
        ordenarPedidos();

        // Chama a função popularComboBoxFiliais para popular o ComboBox 'Filial'
        popularComboBoxFiliais();

        // Chama a função popularComboBoxCC para popular o ComboBox 'CC'
        popularComboBoxCC();

        // Chame a função preencherTabela para popular a tabela
        preencherTabela(pedidos);
        
        // Adiciona eventos aos botões da tabela
        adicionarEventosBotoes();
        document.getElementById('loadAPI').style.display = "none";

    } catch (error) {
        console.error("Erro ao carregar documentos:", error);
    }
});

function preencherTabela(conteudo) {

    var cardsContainer = document.getElementById('divCards');
    var i = 0;
    
    cardsContainer.innerHTML = ""; //Limpar a tabela de resultados

    conteudo.forEach((cardData) => {

        var cardElement = createCard(cardData);        
        
        var buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";

        // Adiciona os botões ao grupo
        var aprovarButton = criarBotao("btnAprovar" + i, '', i, false);

        var rejeitarButton = criarBotao("btnRejeitar" + i, "Rejeitar", i, false);
        rejeitarButton.className = "btn btn-danger btn-sm btn-rejeitar";

        var detalhesButton = criarBotao("btnDetalhes" + i, "Detalhes", i, true);
        detalhesButton.className = "btn btn-info btn-sm btn-detalhes";

        if (cardData.CR_STATUS === "02") {
            aprovarButton.className = "btn btn-success btn-sm btn-aprovar";
            aprovarButton.textContent = "Aprovar";

        } else if (cardData.CR_STATUS === "03" || cardData.CR_STATUS === "05") {
            aprovarButton.className = "btn btn-danger btn-sm btn-aprovar";
            aprovarButton.textContent = "Estornar";

            rejeitarButton.disabled = true;
        }
        else if (cardData.CR_STATUS === "06" || cardData.CR_STATUS === "07") {
            rejeitarButton.textContent = "Rejeitado";
            aprovarButton.className = "btn btn-success btn-sm btn-aprovar";
            aprovarButton.textContent = "Aprovar";
            aprovarButton.disabled = true;
            rejeitarButton.disabled = true;
        }

        buttonGroup.appendChild(aprovarButton);
        buttonGroup.appendChild(rejeitarButton);
        buttonGroup.appendChild(detalhesButton);
        
        cardElement.appendChild(buttonGroup);
        cardsContainer.appendChild(cardElement);

        i++
    });
}

//Cria os eventos dos Botões da tabela.
function adicionarEventosBotoes() {
    
    var cardsPedidos = document.getElementById("divCards");    

    // Agora é possível adicionar novos ouvintes de eventos ao elemento clonado.
    cardsPedidos.addEventListener("click", async function (event) {
        if (event.target.classList.contains("btn-aprovar")) {
            var button = event.target;
            var doc = pedidos[button.rowIndex];
            var btnRejeitar = document.getElementById("btnRejeitar" + button.rowIndex);
            btnRejeitar.disabled = true;

            if (button.textContent === "Aprovar") {
                button.disabled = true;
                button.textContent = "Aprovando..";

                //Chama a manipulação da Interface
                aprovando(true);

                if (await manipularDocumento('001', doc.CR_FILIAL, doc.CR_NUM, doc.CR_TIPO, doc.CR_APROV, doc.CR_USER, '')) {
                    button.textContent = "Estornar";
                    button.classList.remove("btn-success");
                    button.classList.add("btn-danger");
                    button.disabled = false;
                    btnRejeitar.disabled = true;

                    //Chama a manipulação da Interface
                    aprovando(false);
                    update(button.rowIndex, new Date().toISOString().slice(0, 10).replace(/-/g, ''));
                }
                else {
                    button.disabled = false;
                    button.textContent = "Aprovar"
                    btnRejeitar.disabled = false;

                    //Chama a manipulação da Interface
                    aprovando(false);
                }
            }
            else {
                button.disabled = true;
                button.textContent = "Estornando..";
                aprovando(true);
                if (await manipularDocumento('002', doc.CR_FILIAL, doc.CR_NUM, doc.CR_TIPO, doc.CR_APROV, doc.CR_USER, '')) {
                    button.textContent = "Aprovar";
                    button.classList.remove("btn-danger");
                    button.classList.add("btn-success");
                    button.disabled = false;
                    document.getElementById("btnRejeitar" + button.rowIndex).disabled = false;

                    aprovando(false);
                    update(button.rowIndex, '');
                }
                else {
                    button.disabled = false;
                    button.textContent = "Estornar";

                    aprovando(false);
                }
            }
        }

        else if (event.target.classList.contains("btn-rejeitar")) {
            var button = event.target;
            var doc = pedidos[button.rowIndex];

            if (await confirmarAcao('Deseja realmente rejeitar este documento?')) {
                button.disabled = true;
                button.textContent = "Rejeitando..";

                aprovando(true);

                if (await manipularDocumento('005', doc.CR_FILIAL, doc.CR_NUM, doc.CR_TIPO, doc.CR_APROV, doc.CR_USER, 'Rejeição realizada pelo Fluig.')) {
                    // Desabilite o botão "Rejeitar" e "Aprovar"                    
                    button.textContent = "Rejeitado";
                    document.getElementById("btnAprovar" + button.rowIndex).disabled = true;

                    aprovando(false);
                }
                else {
                    button.disabled = false;
                    button.textContent = "Rejeitar";

                    aprovando(false);
                }
            }
        }

        else if (event.target.classList.contains("btn-detalhes")) {
            var button = event.target;
            var doc = pedidos[button.rowIndex];

            abrirModal(doc)
        }
    });

    document.getElementById("btnAprovarTudo").addEventListener("click", async function () {
        if (await confirmarAcao('Confirma a aprovação dos documentos carregados?')) {
            aprovarTodos();
        }
    });
}

//Ordena os pedidos no obj 'pedidos' para refletir na tabela
function ordenarPedidos() {

    pedidos.sort((a, b) => {

        // Ordene primeiro pelos 'CR_STATUS' em ordem ascendente
        if (grupoStatus(a.CR_STATUS) < grupoStatus(b.CR_STATUS)) {
            return -1;
        }
        if (grupoStatus(a.CR_STATUS) > grupoStatus(b.CR_STATUS)) {
            return 1;
        }

        if (a.CR_FILIAL < b.CR_FILIAL) {
            return -1;
        }
        if (a.CR_FILIAL > b.CR_FILIAL) {
            return 1;
        }

        if (a.CR_NUM < b.CR_NUM) {
            return -1;
        }
        if (a.CR_NUM > b.CR_NUM) {
            return 1;
        }
        return 0;
    });
}

function grupoStatus(status) {

    //https://terminaldeinformacao.com/wp-content/tabelas/campo_cr_status.php
    switch (status) {
        case '02':
            return '02';
        case '03':
        case '05':
            return '03';
        case '06':
        case '07':
        case '04':
            return '04';
        default:
            return 'Outro'; // Trate outros valores de status aqui, se necessário
    }
}

//Alimenta variável 'CCusto' que é usada como conteúdo do ComboBox 'CC'
function popularComboBoxCC() {

    pedidos.forEach(doc => {
        doc.ITENS.forEach(produto => {
            const combo = [produto.C7_CC, produto.CTT_DESC01];
            const comboString = combo.join(' - ');

            if (!ccusto.includes(comboString)) {
                ccusto.push(comboString);
            }
        });
    });

    ccusto.sort();

    // Obtém uma referência ao elemento select pelo ID
    const selectElement = document.getElementById("comboCC");
    // Loop através das opções e adiciona cada uma ao select
    ccusto.forEach((cc) => {
        const optionElement = document.createElement("option");
        optionElement.value = cc;
        optionElement.textContent = cc;
        selectElement.appendChild(optionElement);
    });
}

//Alimenta variável 'filiais' que é usada como conteúdo do ComboBox 'Filial'
function popularComboBoxFiliais() {

    pedidos.forEach(filial => {
        const combo = [filial.CR_FILIAL, filial.M0_FILIAL];
        const comboString = combo.join(' - ');

        if (!filiais.includes(comboString)) {
            filiais.push(comboString);
        }
    });

    filiais.sort();

    // Obtém uma referência ao elemento select pelo ID
    const selectElement = document.getElementById("comboFiliais");
    // Loop através das opções e adiciona cada uma ao select
    filiais.forEach((filial) => {
        const optionElement = document.createElement("option");
        optionElement.value = filial;
        optionElement.textContent = filial;
        selectElement.appendChild(optionElement);
    });
}

//Exibe os itens na tabela de acordo com o filtro utilizado.
async function filtroTabela(inputElement) {

    // Seu código para obter a tabela e o corpo do grid
    var divCards = document.getElementById("divCards");    
    var status = []

    var filial = document.getElementById('comboFiliais').value;
    var cc = document.getElementById('comboCC').value;
    var pedido = document.getElementById('buscapedido').value;
    var fornecedor = document.getElementById('buscafornecedor').value;
    var dataIni = document.getElementById('DATA_INI').value;
    var dataFim = document.getElementById('DATA_FIM').value;

    //01=Aguardando nivel anterior; 02=Pendente; 03=Liberado; 04=Bloqueado; 05=Liberado outro aprov.; 06=Rejeitado; 07=Rej/Bloq outro aprov.
    var pendente = document.getElementById("checkbox-1").checked;
    var aprovados = document.getElementById("checkbox-2").checked;
    var rejeitados = document.getElementById("checkbox-3").checked;

    if (inputElement.type === "submit") {
        document.getElementById('loadAPI').style.display = "block";
        pedidos = [];
        divCards.innerHTML = ""; // Limpar a tabela de resultados
        //https://terminaldeinformacao.com/wp-content/tabelas/campo_cr_status.php
        console.log(filial.slice(0, 4), pedido, user, '02,03,04,05,06,07', fornecedor, formataData(dataIni) + formataData(dataFim));
        const response = await apiHistorico(filial.slice(0, 4), pedido, user, '02,03,04,05,06,07', fornecedor, formataData(dataIni) + formataData(dataFim));
        pedidos = response;
        preencherTabela(pedidos);
        document.getElementById('loadAPI').style.display = "none";
    }
    else {

        if (!(pendente && aprovados && rejeitados)) {
            if (pendente) {
                status.push('01', '02');
            }
            else if (aprovados) {
                status.push('03', '05');
            }
            else if (rejeitados) {
                status.push('04', '06', '07');
            }
        }

        visiveis = pedidos.map((item, index) => {
            var exibir = true;

            if (filial != '') {
                if (!(item.CR_FILIAL === filial.slice(0, 4))) {
                    exibir = false;
                }
            }

            if (cc != '') {
                if (!(item.ITENS.some(xCC => xCC.C7_CC === cc.split(' ')[0]))) {
                    exibir = false;
                }
            }

            if (pedido && exibir) {
                if (!item.CR_NUM.includes(pedido)) {
                    exibir = false;
                }
            }

            if (fornecedor && exibir) {
                if (!item.A2_NOME.includes(fornecedor.toUpperCase())) {
                    exibir = false;
                }
            }

            if (exibir && status.length > 0) {
                if (!status.includes(item.CR_STATUS)) {
                    exibir = false;
                }
            }

            if (exibir && dataIni != '' && dataFim != '') {
                if (!isBetween(moment(item.CR_EMISSAO, "YYYYMMDD").toDate(), moment(dataIni, "DD/MM/YYYY").toDate(), moment(dataFim, "DD/MM/YYYY").toDate())) {
                    exibir = false;
                }
            }

            if (exibir) {
                divCards.querySelectorAll(".cards")[index].style.display = "flex";
            } else {
                divCards.querySelectorAll(".cards")[index].style.display = "none";
            }
            return exibir ? index : -1;
        }).filter(index => index !== -1);

        document.getElementById("btnAprovarTudo").disabled = !visiveis.length > 0;
    }
}

//Função do Botão de 'Aprovar todos'
//Dispara o evento 'Click' em todos os pedidos passíveis de aprovação.
function aprovarTodos() {
    for (var i = 0; i < pedidos.length; i++) {
        (function (index) {
            var button = document.getElementById("btnAprovar" + index);
            
            //Precisa do objeto em que está contido para validar se está visível
            var cardStyle = button.closest(".cards").style.display;

            if (button && !button.disabled && button.textContent === "Aprovar") {

                //Aprova somente as linhas visíveis.
                if (cardStyle === "flex") {
                    setTimeout(function () {
                        button.click();
                    }, index * 50);
                }
            }
        })(i);
    }
}



//PopUP de confirmação de ação.
function confirmarAcao(message) {
    return new Promise(function (resolve, reject) {
        // Exiba um diálogo de confirmação para perguntar se o usuário deseja aprovar tudo
        FLUIGC.message.confirm({
            message: message,
            title: 'Confirmação',
            labelYes: 'Sim',
            labelNo: 'Não'
        }, function (result) {
            if (result) {
                // O usuário confirmou que deseja aprovar tudo
                // Resolva a Promise com true
                resolve(true);
            } else {
                // O usuário cancelou a operação
                // Rejeite a Promise com false
                reject(false);
            }
        });
    });
}

// Função utilitária para criar botões.
function criarBotao(id, texto, rowIndex, btnDetalhes) {
    var button = document.createElement("button");
    button.type = "button";
    button.id = id;
    button.textContent = texto;
    button.rowIndex = rowIndex;
    if (document.getElementById("Select_SC").value === "historico" && !btnDetalhes) {
        button.disabled = true;
    }
    return button;
}

//Manipula a Interface Durante Aprovação de Pedidos
function aprovando(novaAcao) {
    if (novaAcao) { pendentes++ } else {
        if (pendentes > 0) {
            pendentes--
        }
    }

    document.getElementById("lblAprovar").textContent = 'Ações Pendentes: ' + pendentes;

    if (pendentes > 0) {
        document.getElementById('loadAprova').style.display = "block";
        document.getElementById("lblAprovar").style.display = "block";

        //Desabilita o botão de 'aprovar' durante a aprovação.
        document.getElementById("btnAprovarTudo").disabled = true;
        document.getElementById("btnAprovarTudo").textContent = "Executanto..";
    } else {
        document.getElementById('loadAprova').style.display = "none";
        document.getElementById("lblAprovar").style.display = "none";

        document.getElementById("btnAprovarTudo").disabled = false;
        document.getElementById("btnAprovarTudo").textContent = "Aprovar Tudo";
    }
}

async function changeSelect(inputElement) {

    var divCards = document.getElementById("divCards");    
    divCards.innerHTML = ""; // Limpar a tabela de resultados
    pedidos = [];

    if (inputElement.value === 'pendentes') {
        // Mostra a div de mensagem

        $("#mensagem").show();
        $("#checkbox-1").show();
        $("#checkbox-2").show();
        $("#checkbox-3").show();
        $("#checkboxRow").show();
        $("#btnAprovarTudo").show();
        $("#colSummit").hide();
        $("#aprovacaopedido").show();
        $("#historicopedido").hide();
        $("#colComboCC").show();
        // Mostra os campos quando "Aprovação" é selecionado

        document.getElementById('loadAPI').style.display = "block";
        const response = await apiDocumentos(user, '02,03');
        pedidos = response;
        // Ordena os pedidos carregados.
        ordenarPedidos();
        // Chama a função popularComboBoxFiliais para popular o ComboBox 'Filial'
        popularComboBoxFiliais();
        // Chame a função preencherTabela para popular a tabela
        preencherTabela(pedidos);
        document.getElementById('loadAPI').style.display = "none";

        document.getElementById('btnSummit').disabled = true;

    } else if (inputElement.value === 'historico') {
        // Esconde a div de mensagem

        // Oculta os campos quando "Historico" é selecionado
        $("#checkbox-1").hide();
        $("#checkbox-2").hide();
        $("#checkbox-3").hide();
        $("#checkboxRow").hide();
        $("#btnAprovarTudo").hide();
        $("#colSummit").show();
        $("#aprovacaopedido").hide();
        $("#aprovacaopedido").hide();
        $("#colComboCC").hide();

        $("#historicopedido").show();

        document.getElementById('btnSummit').disabled = false;
    }

    document.getElementById('aprovacaopedido').value = '';
    document.getElementById('historicopedido').value = '';
    document.getElementById('comboFiliais').value = '';
    document.getElementById('buscapedido').value = '';
    document.getElementById('buscafornecedor').value = '';
    document.getElementById('DATA_INI').value = '';
    document.getElementById('DATA_FIM').value = '';
    document.getElementById('colSummit').value = '';
    document.getElementById('colComboCC').value = '';

}

function update(id, data) {

    //Grava a data da Liberação
    pedidos[id].CR_DATALIB = data;
}