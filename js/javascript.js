

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

function addToList(){
    var onsItem= document.createElement('ons-list-item');

    onsItem.setAttribute('onclick', "itemClick("+myKey+")");
    onsItem.innerHTML = "ukol " + i;
    onsItem.setAttribute('modifier', "tappable");
}

function downloadFromLocal(){
    var text, obj;
    listOfLocations = [];

    for (var i = 0; i < localStorage.length; i++)
    {

        var myKey = localStorage.key(i);


        text = localStorage.getItem(myKey);
        obj = JSON.parse(text);

        var location = new Location(obj.name, obj.lattitude, obj.longitude);
        var weather = getWeatherNow(location.name, location.latitude, location.longtitude);
        location.set(weather.temp, weather.icon, weather.desc);
        listOfLocations.push(location);
        addToList(listOfLocations[i]);
    }
}

function uploadToLocalStorage(name, lat, long){

    var key = new Date().getTime();

    var cities = {
        name: name,
        lattitude: lat,
        longtitude: long
    };

    var myJSON = JSON.stringify(cities);
    localStorage.setItem(key,myJSON);
}

function getLatLong(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var isIn = false;
            for(var i=0; i<listOfLocations.length; i++) {
                if (listOfLocations[i].getName() === location) {
                    isIn = true;
                }
            }
            if(!isIn) {
                var newLocation = new Location(
                    location, results[0].geometry.location.lat(), results[0].geometry.location.lng());
                var weather = getWeatherNow(newLocation.name, newLocation.latitude, newLocation.longtitude);
                newLocation.set(weather.temp, weather.icon, weather.desc);
                listOfLocations.push(newLocation);
                uploadToLocalStorage(newLocation.name, newLocation.latitude, newLocation.longtitude);
                addToList(newLocation);

            }

        } else {
            alert("Something got wrong with google api: " + status);
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
            return {temp: data.main.temp, icon: data.weather[0].main, desc: data.weather[0].description};

        })

}
function addCity() {
    document.getElementById('addCityDialog').show();
}

function hideDialog(dialog) {
    document.getElementById(dialog).hide();
}

window.fn = {};

window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
        .then(menu.close.bind(menu));
};