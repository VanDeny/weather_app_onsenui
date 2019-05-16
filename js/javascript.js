

var API_key = '01c20d8b605d742011860dc9f8512ff7';

class Location {
    constructor(name, lat, long) {
        this.name = name;
        this.latitude = lat;
        this.longtitude = long;
    }
}
var listOfLocations = [];



function downloadFromLocal(){
    var text, obj;
    listOfLocations = [];

    for (var i = 0; i < localStorage.length; i++)
    {

        var myKey = localStorage.key(i);


        text = localStorage.getItem(myKey);
        obj = JSON.parse(text);

        var location = new Location(obj.name, obj.latitude, obj.longtitude);
        listOfLocations.push(location);
        showList();
    }
}

function uploadToLocalStorage(name, lat, long){

    var key = new Date().getTime();

    var cities = {
        name: name,
        latitude: lat,
        longtitude: long
    };

    var myJSON = JSON.stringify(cities);
    localStorage.setItem(key,myJSON);
    showList();
}

function getLatLong(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': location}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var isIn = false;
            for(var i=0; i<listOfLocations.length; i++) {
                if (listOfLocations[i].name === location) {
                    isIn = true;
                }
            }
            if(!isIn) {
                var newLocation = {
                    name: location, latitude: results[0].geometry.location.lat(), longtitude: results[0].geometry.location.lng()};
                listOfLocations.push(newLocation);
                uploadToLocalStorage(newLocation.name, newLocation.latitude, newLocation.longtitude);

            }
            showList();
        } else {
            alert("Something got wrong with google api: " + status);
        }
    });
}

function getWeather(latitude, longtitude) {

    var urls = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longtitude + '&appid=' + API_key + '&units=metric';
    fetch(urls)
        .then(response => {
            console.log("success");
            return response.json();
        })
        .then(data => {
            renderNow(data);
        })
}

function getWeatherForecast(latitude, longtitude) {

    urls = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longtitude + '&appid=' + API_key + '&units=metric';
    fetch(urls)
        .then(response => {
            console.log("success");
            return response.json();
        })
        .then(data => {
            renderForecast(data);
        })
}


function hideDialog(dialog) {
    document.getElementById(dialog).hide();
}

function start() {
    downloadFromLocal();
    getGeolocation();

}

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setMyLocation);
    } else {
        alert("Geolocation Unavaible!");
    }
}

function setMyLocation(position)
{
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    getWeather(lat,lon);
    getWeatherForecast(lat,lon);
}

function renderNow(data) {
    document.getElementById("mesto").innerHTML = data.name.toUpperCase();
    document.getElementById("stav").innerHTML = data.weather[0].description.toUpperCase();
    document.getElementById("teplota").innerHTML = Math.round(data.main.temp)+" °C";
    if(data.weather[0].main == "Clear")
        document.getElementById("obrazek").setAttribute("src","https://img.icons8.com/material/24/000000/sun.png");
    else if(data.weather[0].main == "Mist")
        document.getElementById("obrazek").setAttribute("src", "https://img.icons8.com/material/24/000000/dust.png");
    else
        document.getElementById("obrazek").setAttribute("src","https://img.icons8.com/material/24/000000/"+ data.weather[0].main +".png");
}


function renderForecast(data)  {
    var now = new Date();
    var j = 0;
    var max = 0;
    var min = 100;
    var icon = "";
    for(var i = 0; i < data.list.length; i++)
    {
        var tmpdate = new Date(data.list[i].dt*1000);
        if(!(now.getDay() + j == tmpdate.getDay()))
        {
            j++;
            max = 0;
            min = 100;
        }
        icon = (data.list[i].main.temp > max ? data.list[i].weather[0].main : icon);
        if (icon == "Clear")
            icon = "sun";
        max = (data.list[i].main.temp > max ? data.list[i].main.temp : max);
        min = (data.list[i].main.temp < min ? data.list[i].main.temp : min);


        if(j>0)
            document.getElementById("den"+j).innerHTML = tmpdate.toString().split(' ')[0].toUpperCase()+"<br><img src=\"https://img.icons8.com/material/24/000000/"+ icon +".png\"><br>"+Math.round(max)+" °C<br>"+Math.round(min)+" °C";
    }
}

var datavalue;

function showList() {
    $("#listLoc").empty();

    for (var i = 0; i < listOfLocations.length; i++) {
        var onsItem = document.createElement('ons-list-item');
        var location = listOfLocations[i];
        onsItem.setAttribute('tappable');
        onsItem.setAttribute('onclick',"showLocation("+location.latitude+","+location.longtitude+")");

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                datavalue = JSON.parse(this.responseText);
            }
        };

        xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=" + location.latitude + "&lon=" + location.longtitude + "&APPID=" + API_key + "&units=metric", false);
        xhr.send();

        var divicon = document.createElement('div');
        divicon.setAttribute('class','left');
        var img = document.createElement('img');
        {
            if (datavalue.weather[0].main == "Clear")
                img.setAttribute("src", "https://img.icons8.com/material/24/000000/sun.png");
            else if(datavalue.weather[0].main =="Mist")
                img.setAttribute("src", "https://img.icons8.com/material/24/000000/dust.png");
            else
                img.setAttribute('src', 'https://img.icons8.com/material/24/000000/' + datavalue.weather[0].main + '.png');
        }
        img.setAttribute('list-item__thumbnail');
        divicon.appendChild(img);
        onsItem.appendChild(divicon);
        var divinfo = document.createElement('div');
        divinfo.setAttribute('class','center');
        var spancity = document.createElement('span');
        spancity.setAttribute('class','list-item__title');
        spancity.innerHTML = location.name;
        var spantemp = document.createElement('span');
        spantemp.setAttribute('class','list-item__subtitle');
        spantemp.innerHTML = Math.round(datavalue.main.temp)+" °C";
        divinfo.appendChild(spancity);
        divinfo.appendChild(spantemp);
        onsItem.appendChild(divinfo);
        onsItem.setAttribute('id',location.latitude+location.longtitude);
        onsItem.addEventListener('swipeleft', function() {
            localStorage.removeItem(myKey);
            showList();
        });

        document.getElementById("listLoc").appendChild(onsItem);
        console.log("added");
    }
}

var showPrompt = function() {
    ons.notification.prompt({message: 'Zadejte město', title:'Přidat',cancelable: true,
        callback: answer=>{
            if (answer.length) {
                getLatLong(answer);
            }}
    });
};

function showLocation(lat,lon)
{
    getWeather(lat,lon);
    getWeatherForecast(lat,lon);
    document.querySelector('ons-tabbar').setActiveTab(0);
}