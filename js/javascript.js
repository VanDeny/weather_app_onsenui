
var Location = {
    name : String,
    latitude : String,
    longitude : String,
    temperature : String,
    feelTemp : String,
    icon : String
}

var listOfLocations = [];
var res;

function getWeatherNow(latitude, longtitude)
{
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    var urls = '${proxy}https://api.darksky.net/forecast/482e27318ded58f995089bfdccebd10c/${latitude},${longtitude}?exclude=daily,hourly,alerts,flags,minutely';
    fetch(urls)
        .then(response=> {
            return response.json();
        })
        .then(data =>{
            console.log(data);
        })

}




function getLatLong(location)
{
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': location }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //TODO Add to the Location and Check if is already there
            getWeatherNow(results[0].geometry.location.lat(), results[0].geometry.location.lng());
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