$("#copy").on("click", () => {
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
$("#send").on("click", (e) => {
    if ($("#icon_send").hasClass("glyphicon-send")) {
        shortIt();
    }
    else {
        clearFields();
    }
})
clearFields = () => {
    $("#url").val("");
    $("#shorted_url").val("");
    $("#copy_icon").removeClass("glyphicon-ok");
    $("#copy_icon").addClass("glyphicon-copy");
    $("#icon_send").addClass("glyphicon-send");
    $("#icon_send").removeClass("glyphicon-trash");
};


shortIt = () => {
    let desiredUrl = $("#url").val();
    if (validateIt(desiredUrl)) {
        $("#input_url").removeClass("has-error");
        $.post({
            url: "https://short-it-2022.herokuapp.com/url",
            data: {
                url: desiredUrl
            },
            beforeSend: function () {
                // Show image container
                $("#icon_send").removeClass("glyphicon-send");
                $("#loader").show();
            },
            success: (response) => {
                $("#shorted_url").val(response.short_url);
            },
            fail: (falied) => {
                console.log("failed")
            },
            complete: function (data) {
                // Hide image container
                $("#loader").hide();
                $("#icon_send").addClass("glyphicon-trash");
            },
            dataType: "json"
        });
    }
    else {
        $("#input_url").addClass("has-error");
    }

}

validateIt = function (url) {
    let reg = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return reg.test(url);
}