class Location {
    constructor(name, lat, long) {
        this.name = name;
        this.latitude = lat;
        this.longtitude = long;
        this.temperature = 0;
        this.icon = "";
        this.desctiption = "";
    }

    getTemp() {
        return this.temperature;
    }

    getIcon() {
        return this.icon;
    }

    getName() {
        return this.name;
    }

    set(temp, icon, desc) {
        this.temperature = temp;
        this.icon = icon;
        this.desctiption = desc;
        console.log(temp + " " + icon + " " + desc);
    }
}

var listOfLocations = [];
var API_key = '01c20d8b605d742011860dc9f8512ff7';


function getLatLong(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //TODO Add to the Location and Check if is already there
            if (!listOfLocations.includes(location)) {
                var newLocation = new Location(
                    location, results[0].geometry.location.lat(), results[0].geometry.location.lng()
                );
                listOfLocations.push(newLocation);
            }
            getWeatherNow(location, results[0].geometry.location.lat(), results[0].geometry.location.lng());
        } else {
            alert("Something got wrong with google api" + status);
        }
    });
}

function getWeatherNow(city, latitude, longtitude) {

    var urls = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longtitude + '&appid=' + API_key + '&units=metric';
    fetch(urls)
        .then(response => {
            console.log("success");
            return response.json();
        })
        .then(data => {
            var pos = 0;
            for (i = 0; i < listOfLocations.length; i++) {
                if (listOfLocations[i].getName() == city) {
                    pos = i;
                    break;
                }
            }
            listOfLocations[i].set(data.main.temp, data.weather[0].main, data.weather[0].description);

        })

}


function addCity() {
    document.getElementById('addCityDialog').show();
}

function hideAlertDialog() {
    document.getElementById('my-alert-dialog').hide();
};