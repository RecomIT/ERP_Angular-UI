
// client side table filtering

function tableFilter(tableId, senderObj) {
    var value = $(senderObj).val().toLowerCase();
    $(tableId).filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
}

function clickEvent(first,last){
    if(first.value.length){
        document.getElementById(last).focus();
    }
}

jQuery(function(){
    console.log("jQuery is called")
    $(".select2Ctrl").select2({
        dropdownParent: $(this).parent(),
    });
    //var stepper = new Stepper($('.bs-stepper')[0])
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $(".clearSearch").on('click',function(){
        alert("Clear Search")
        $('.search-box').val('');
    })
})


