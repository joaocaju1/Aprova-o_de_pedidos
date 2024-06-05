// Função utilitária para formatar valores monetários.
function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função utilitária para verificar se o botão de aprovação deve ser desabilitado com base no status do documento.
function isBotaoAprovarDesabilitado(status) {
    return status === "03" || status === "05" || status === "06" || status === "07";
}

// Função utilitária para verificar se o botão de rejeição deve ser desabilitado com base no status do documento.
function isBotaoRejeitarDesabilitado(status) {
    return status === "03" || status === "05" || status === "04" || status === "06" || status === "07";
}

// Função utilitária para vericar range de dados.
function isBetween(value, min, max) {
    return value >= min && value <= max;
}

// Função utilitária para formatar data.
function formataData(data) {
    // Verifique se 'data' é uma string no formato correto (dd/mm/yyyy)
    const dateParts = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dateParts) {
        const day = parseInt(dateParts[1], 10);
        const month = parseInt(dateParts[2], 10);
        const year = parseInt(dateParts[3], 10);

        // Verifique se as partes da data são válidas
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            // Crie uma nova data com as partes extraídas
            const formattedDate = new Date(year, month - 1, day); // Mês é zero indexado, subtrai 1
            // Verifique se a data criada é válida
            if (!isNaN(formattedDate)) {
                // Formate a data no formato "yyyymmdd"
                const formattedYear = formattedDate.getFullYear();
                const formattedMonth = String(formattedDate.getMonth() + 1).padStart(2, '0');
                const formattedDay = String(formattedDate.getDate()).padStart(2, '0');
                return `${formattedYear}${formattedMonth}${formattedDay}`;
            }
        }
    }

    // Se 'data' não estiver no formato correto ou for inválida, retorne uma string vazia
    return '';
}