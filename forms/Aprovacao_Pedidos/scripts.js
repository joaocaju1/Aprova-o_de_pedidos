$(document).ready(function(){

    $('#div_escolhas').children('div').hide();

    $('#Select_SC').on('change',function(){

        var selectValor = '#' + $(this).val();

        $('#div_escolhas').children('div').hide();
        $('#div_escolhas').children(selectValor).show();

    });

});

$(document).ready(function(){

    $('#div_pdt_svc').children('div').hide();

    $('#Select_SC').on('change',function(){

        var selectValor = '#' + $(this).val();

        $('#div_pdt_svc').children('div').hide();
        $('#div_pdt_svc').children(selectValor).show();
    });

}); 



