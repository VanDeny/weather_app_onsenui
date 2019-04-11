function getNow(lattitude, longtitude)
{
    var url = "https://api.darksky.net/forecast/482e27318ded58f995089bfdccebd10c/" + lattitude + "," + longtitude + "?exclude=daily,hourly,alerts,flags,minutely";
    $.ajax({
        url:$("#url").val(),
        type: "GET",
        data:{"login": $("#login").val()},
        success:function(data)
        {
            alert("Success " + data);
        }
    }).fail(function(err){
        alert("Someting went wrong: " + err.responseTest);
    });
}