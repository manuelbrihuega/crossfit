$(document).ready(function(){
    get_driver_info();
    $('#send_docu').click(function(){send_driver_documents();});
    show_uploaded_file();

});

function get_driver_info(){
    var token=$('#token').val();
    $.getJSON(api_url+'drivers/get_by_token',{token:token},function(data){
        if(data.status=='success'){
            if(data.data.validated!=1){
                $('#driver_name').text(data.data.name);
                $('#driver_validation').fadeIn();
            }
            else{
                launch_alert('Ya se encuentra validado','warning');
            }

        }
        else launch_alert('El token es incorrecto','warning');
    });

}




function send_driver_documents(){

    var check=$('#accept').is(':checked');
    var file=$('#file').val();


    if(check){
        var form=$('#driver_form');
        var token=$('#token').val();

        form.submit(function()
        {

            var formObj = $(this);
            var formURL = formObj.attr("action");
            var formData = new FormData(this);
            $.ajax({
                url: formURL,
                type: 'POST',
                data:  formData,
                mimeType:"multipart/form-data",
                contentType: false,
                cache: false,
                processData:false,
            success: function(data, textStatus, jqXHR)
            {
                if(file=="" || $.parseJSON(data).status=='success'){
                    $.getJSON(api_url+'drivers/validate',{token:token},function(data){
                        if (data.status=='success'){
                            launch_alert('Datos enviados correctamente');

                            $('#driver_validation').empty().html('<div class="notice full animated fadeInDown"><div class="icon"><i class="fa fa-smile-o"></i></div><div class="text">Documentación enviada con éxito, en breve activaremos tu cuenta, ¡te avisamos!</div></div>');
                        }
                        else launch_alert(data.response);
                    });
                }

                else{
                    launch_alert($.parseJSON(data).response,'warning');
                }


            },
             error: function(jqXHR, textStatus, errorThrown)
             {
             }
            });
            return false;
        });
        form.submit();
    }

    else{
        launch_alert('Debe aceptar las condiciones de uso','warning');
    }


}


function modal_condiciones_uso_drivers(){
    var mymodal=newModal('modal_condiciones_contratacion',true, false);
    modalAddTitle(mymodal,'');
    $.post(base_url+'/partials/condiciones_uso_drivers', function(template, textStatus, xhr) {
        var body=$('<div></div>');
        body.html(template);
        if (lang == 'es'){
           $.post(base_url+'/partials/condiciones_uso_drivers_es', function(template, textStatus, xhr) {
                body.append(template);
                modalAddBody(mymodal,body);
                mymodal.modal('show');

            });
        }

        else{
            modalAddBody(mymodal,body);
            mymodal.modal('show');
        }


    });
}


function show_uploaded_file() {

    var input = $('#file');
    input.change(function(){
        console.log(input.prop('files')[0]);
        if (input.prop('files') && input.prop('files')[0]) {
            input.siblings('p').find('span').text(input.prop('files')[0].name);
            input.siblings('p').find('i.fa-file-o').removeClass('fa-file-o').addClass('fa-file-text-o');

        }
    });
}