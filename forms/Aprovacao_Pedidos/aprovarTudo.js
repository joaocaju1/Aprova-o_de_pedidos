function aprovarTudo() {
    var tabelaResultados = document.getElementById("tabelaResultados");
    var checkboxes = tabelaResultados.querySelectorAll(".checkbox-aprovar");

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

