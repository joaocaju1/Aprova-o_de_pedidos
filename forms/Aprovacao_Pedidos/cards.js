
function createCard(pedido) {
  var card = document.createElement('div');
  card.className = "cards"

  card.innerHTML = `
    <div class="card-content col-md-10">
      <div class="section">
        <div class="section-header">
          <span class="icons fluigicon fluigicon-home icon-md" aria-hidden="true""></span>
              <span class=" labels">Empresa:</span>
          <span class="spans">${pedido.CR_FILIAL + ' - ' + pedido.M0_FILIAL}</span>
        </div>

        <div class="section-header">
          <span class="icons fluigicon fluigicon-enrollment-verified icon-md" aria-hidden="true""></span>
              <span class=" labels">Pedido:</span>
          <span class="spansPedido">${pedido.CR_NUM}</span>
        </div>

        <div class="section-header">
          <span class="icons fluigicon fluigicon-user-search icon-md" aria-hidden="true""></span>
              <span class=" labels">Fornecedor:</span>
          <span class="spans">${pedido.A2_NOME}</span>
        </div>

      </div>

      <div class="section">
        <div class="section-header">
          <span class="icons fluigicon fluigicon-fileedit icon-md" aria-hidden="true"></span>
          <span class="labels">Descrição:</span>
          <span class="spans2">${pedido.OBSM}</span>
        </div>
      </div>

      <div class="section">

        <div class="section-header">
          <span class="icons fluigicon fluigicon-user-transfer icon-md" aria-hidden="true""></span>
              <span class=" labels">Tipo Aprov.:</span>
          <span class="spans">${pedido.AL_LIBAPR}</span>
        </div>

        <div class="section-header">
          <span class="icons fluigicon fluigicon-role-lists icon-md" aria-hidden="true""></span>
            <span class=" labels">Nível:</span>
          <span class="spans">${pedido.CR_NIVEL}</span>
        </div>

        <div class="section-header">
          <span class="icons fluigicon fluigicon-group icon-md" aria-hidden="true""></span>
            <span class=" labels">Grupo:</span>
          <span class="spans">${pedido.AL_DESC}</span>
        </div>

        <div class="value-section">
          <span class="icons fluigicon fluigicon-money-circle icon-md" aria-hidden="true""></span>
              <span class=" labels">Valor:</span>
          <span class="value">${formatarValor(pedido.CR_TOTAL)}</span>
        </div>

      </div>
    </div>
    `;

  return card;
}