$("#copy").on("click" , ()=>{
    var copyText = document.getElementById("shorted_url");
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
    $("#copy_icon").removeClass("glyphicon-copy");
    $("#copy_icon").addClass("glyphicon-ok");
});
$('#url').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
       shortIt();
    }
});
$("#clear").on("click" , (e) => {
    $("#url").val("")
    $("#shorted_url").val("");
    $("#copy_icon").removeClass("glyphicon-ok");
    $("#copy_icon").addClass("glyphicon-copy");
    $("#icon_send").removeClass("glyphicon-trash");
    $("#icon_send").addClass("glyphicon-send");
})


shortIt = ()=>{
    let desiredUrl = $("#url").val();
    if(validateIt(desiredUrl)){
        $("#input_url").removeClass("has-error");
        $.post({
            url: "http://localhost:3001/url",
            data: {
                url: desiredUrl
            },
            success: (response) => {
                $("#shorted_url").val(response.short_url);
                $("#icon_send").removeClass("glyphicon-send");
                $("#icon_send").addClass("glyphicon-trash");
            },
            fail: (falied) => {
                console.log("failed")
            },
            dataType: "json"
        });
    }
    else{
        $("#input_url").addClass("has-error");
    }

}

validateIt = function(url){
    let reg = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return reg.test(url);
}