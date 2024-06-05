<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
	<div class="fluig-style-guide">
        <div class="container mt-4 col-md-12">
            <form id="meuFormulario" name="form" role="form">
                <div class="panel panel-primary" id="painell">
                    <!-- <h1 class="panel-title"><strong>FILTRO DE PEDIDOS</strong></h1> -->
                    <div class="panel-heading align-items-center" style="background-color: rgb(172, 0, 0);">
                        <img src="LOGOABAINFRA.png" alt="Descrição da imagem" class="imgaba">
                        <!-- <button class="minimizar" onclick="minimizarPainel(this)">-</button> -->
                        <div class="col-md-2" style="justify-content: end;">
                            <label for="Select_SC" style="color: white;">Tipo de Busca:</label>
                            <select name="Select_SC" id="Select_SC" class="form-control" onchange="changeSelect(this)">
                                <option value="pendentes" id="select_pendentes">Aprovação</option>
                                <option value="historico" id="select_historico">Histórico</option>
                            </select>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="row">

                            <div id="mensagem">

                                <div class="form group col-md-12">

                                    <!-- <h1 class="panel-title"><strong>FILTRO DE PEDIDOS</strong></h1> -->

                                    <div class="" id="historicopedido" style="display: none">
                                        <h2>Historico de pedidos</h2>
                                    </div>

                                    <div class="panel-body">
                                        <div class="row">

                                            <div class="col-md-2">
                                                <div class="form-group" style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-home icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Filial</label>
                                                    <select class="form-control" id="comboFiliais" name="comboFiliais"  placeholder="Empresa Filial"
                                                        onchange="filtroTabela(this)">
                                                        <option value=""></option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="col-md-2" id="colComboCC" >
                                                <div class="form-group " style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-user-cost icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Centro de Custo</label>
                                                    <select class="form-control a" id="comboCC" name="comboCC"
                                                        onchange="filtroTabela(this)">
                                                        <option value=""></option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="col-md-1">
                                                <div class="form-group" style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-search-test icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Pedido</label>
                                                    <input type="text" class="form-control a" name="buscapedido"
                                                        id="buscapedido" placeholder="Pedido"
                                                        oninput="limparFornecedor(this);filtroTabela(this)" />
                                                </div>
                                            </div>

                                            <div class="col-md-2">
                                                <div class="form-group" style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-role-lists icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Fornecedor</label>
                                                    <input type="text" class="form-control a" name="buscafornecedor"
                                                        id="buscafornecedor" placeholder="Nome do fornecedor"
                                                        oninput="limparPedido(this);filtroTabela(this)" />
                                                </div>
                                            </div>


                                            <div class="col-md-2">
                                                <div class="form-group" style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-arrow-up icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Inicial</label>
                                                    <input type="text" class="form-control a" id="DATA_INI"
                                                        name="DATA_SELECTOR1"  placeholder="Data Inicial"
                                                        onchange="presetDate(this); filtroTabela(this)" />
                                                </div>
                                            </div>

                                            <div class="col-md-2">
                                                <div class="form-group" style="font-size: 17px;">
                                                    <label><i class="fluigicon fluigicon-arrow-down icon-sm" aria-hidden="true"
                                                            aria-hidden="true"></i> Final</label>
                                                    <input type="text" class="form-control a" id="DATA_FIM"
                                                        name="DATA_SELECTOR2"  placeholder="Data Final"
                                                        onchange="presetDate(this); filtroTabela(this)" />
                                                </div>
                                            </div>

                                            <div class="col-md-1" id="colSummit" style="display: none;">
                                                <div class="form-group">
                                                    <br>
                                                    <button class="btn btn-success" id="btnSummit"
                                                        onclick="filtroTabela(this)" disabled>Buscar</button>
                                                </div>
                                            </div>

                                            <div class="col-md-1">

                                                <br>
                                                <i class="gg-spinner-two" id="loadAPI"></i>

                                            </div>

                                            <script>
                                                function limparFornecedor(inputElement) {
                                                    if (inputElement.value != '') {
                                                        document.getElementById('buscafornecedor').value = '';
                                                        document.getElementById('checkbox-1').checked = false;
                                                        document.getElementById('checkbox-2').checked = false;
                                                        document.getElementById('checkbox-3').checked = false;
                                                        document.getElementById('DATA_INI').value = '';
                                                        document.getElementById('DATA_FIM').value = '';
                                                        document.getElementById('comboCC').value = '';
                                                    }
                                                }

                                                function limparPedido(inputElement) {
                                                    if (inputElement.value != '') {
                                                        document.getElementById('buscapedido').value = '';
                                                    }
                                                }

                                            </script>



                                        </div>

                                        <script>
                                            var Calendar = FLUIGC.calendar('#DATA_INI');
                                            var Calendar2 = FLUIGC.calendar('#DATA_FIM');

                                            function presetDate(inputElement) {
                                                var dataIniElement = document.getElementById('DATA_INI');
                                                var dataFimElement = document.getElementById('DATA_FIM');

                                                var dataIniValue = dataIniElement.value;
                                                var dataFimValue = dataFimElement.value;

                                                if (inputElement === dataIniElement && dataIniValue === '') {
                                                    return; // Não faça nada se a data inicial for apagada
                                                }

                                                if (inputElement === dataFimElement && dataFimValue === '') {
                                                    return; // Não faça nada se a data final for apagada
                                                }

                                                if (dataIniValue === '') {
                                                    dataIniElement.value = dataFimElement.value;
                                                } else if (dataFimValue === '') {
                                                    dataFimElement.value = dataIniElement.value;
                                                }

                                                if (dataIniValue && dataFimValue) {
                                                    var dataIni = new Date(dataIniValue);
                                                    var dataFim = new Date(dataFimValue);

                                                    var diffInDays = (dataFim - dataIni) / (1000 * 60 * 60 * 24); // Diferença em dias

                                                    if (diffInDays > 30) {
                                                        if (inputElement === dataFimElement) {
                                                            dataIni = new Date(dataFim);
                                                            dataIni.setDate(dataIni.getDate() - 30);
                                                            dataIniElement.valueAsDate = dataIni;
                                                        } else {
                                                            dataFim = new Date(dataIni);
                                                            dataFim.setDate(dataFim.getDate() + 30);
                                                            dataFimElement.valueAsDate = dataFim;
                                                        }
                                                    }
                                                }
                                            }
                                        </script>

                                        <div class="row" id="checkboxRow" style="font-size: 20px;">
                                            <div class=" col-md-2 custom-checkbox custom-checkbox-primary">
                                                <input type="checkbox" name="Pedidospendentes" value="primary"
                                                    id="checkbox-1" onclick="uncheckOthers(1,this);filtroTabela(this)">
                                                <label for="checkbox-1"><i class="fluigicon fluigicon-time icon-xs"
                                                        aria-hidden="true"></i><strong> Pedidos pendentes</strong></label>
                                            </div>
                                            <div class=" col-md-2 mt-4 custom-checkbox custom-checkbox-primary">
                                                <input type="checkbox" name="Pedidosaprovados" value="success"
                                                    id="checkbox-2" onclick="uncheckOthers(2,this);filtroTabela(this)">
                                                <label for="checkbox-2"><i class="fluigicon fluigicon-thumbs-up icon-xs"
                                                        aria-hidden="true"></i><strong>Pedidos aprovados</strong> </label>
                                            </div>
                                            <div class=" col-md-2 mt-4 custom-checkbox custom-checkbox-primary">
                                                <input type="checkbox" name="Pedidosrejeitados" value="info"
                                                    id="checkbox-3" onclick="uncheckOthers(3,this);filtroTabela(this)">
                                                <label for="checkbox-3"><i
                                                        class="fluigicon fluigicon-remove-circle icon-xs"
                                                        aria-hidden="true"></i><strong>Pedidos rejeitados</strong> </label>
                                            </div>

                                            <script>
                                                function uncheckOthers(checkboxNumber, inputElement) {
                                                    for (let i = 1; i <= 3; i++) {
                                                        if (i !== checkboxNumber) {
                                                            document.getElementById(`checkbox-${i}`).checked = false;
                                                        }
                                                    }
                                                    if (inputElement.checked) {
                                                        document.getElementById('buscapedido').value = '';
                                                    }
                                                }
                                            </script>
                                        </div>
                                    </div>
                                    <div class="container-fluid mt-12">
                                        <div class="row justify-content-center mt-12">
                                            <div class="col-md-12" id="divCards" >
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container-fluid d-flex flex-column" style="height: 100%;">
                                        <div class="row mt-auto"> <!-- This row will be pushed to the bottom -->
                                            <div class="col-md-2">
                                                <button class="btn btn-success btn-block" type="button"
                                                    id="btnAprovarTudo">Aprovar todos</button>
                                            </div>
                                            <div class="col-md-1">
                                                <i class="gg-spinner-two" id="loadAprova"></i>
                                            </div>
                                            <div class="col-md-2">
                                                <label id="lblAprovar" name="lblAprovar"></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

