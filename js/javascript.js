
var Location = {
    name : String,
    latitude : String,
    longitude : String,
    temperature : String,
    feelTemp : String,
    icon : String
}

/*
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
*/



function getLatLong(location)
{
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': location }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //TODO Add to the Location and Check if is already there
        } else {
            alert("Something got wrong with google api" + status);
        }
    });
}


function addCity()
{
    document.getElementById('addCityDialog').show();
}

function hideAlertDialog(){
    document.getElementById('my-alert-dialog').hide();
};