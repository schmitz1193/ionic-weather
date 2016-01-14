// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('weatherCtrl', function ($http) {
  var weather = this;
  var apikey = '806bed28cf55c9a1';
  var url = '/api/' + apikey + '/conditions/q/';
  
  $http.get(url + 'autoip.json').then(parseWUData);



  navigator.geolocation.getCurrentPosition(function (geopos) {
    console.log(geopos)
    var lat = geopos.coords.latitude;
    var long = geopos.coords.longitude;
    console.log(lat, long)

    $http.get(url).then(parseWUData);
      $http
      .get(url + lat + ',' + long + '.json')
      .then(parseWUData);
    });

    weather.search = function () {
        $http
          .get(url + weather.searchQuery + '.json')
          .then(parseWUData)
          .then(function(res) {
            console.log("res", res);
            // add search to local storage of what you have recently searched for 
            var history = JSON.parse(localStorage.getItem('searchHistory')) || {};
            cityNam = res.data.current_observation.display_location.full;
            id = res.data.current_observation.station_id;
            history[cityNam] = id;
            localStorage.setItem("searchHistory", JSON.stringify(history));
          })
      }

    function parseWUData(res) {
      var data = res.data.current_observation;
      console.log("data ", data);
      weather.location = data.display_location.full;
      weather.temp = parseInt(data.temp_f);
      weather.image = data.icon_url;
      city = res.data.current_observation.display_location.city;
      state = res.data.current_observation.display_location.state;
      var furl = '/api/' + apikey + '/forecast/q/';  
        $http.get(furl + state + '/' + city + '.json').then(function(forecast) {
          console.log("forecast ", forecast);
          // for (date.weekday_short in forecast.data.forecast.simpleforecast.forecastday) {
          //   weather.forecastday.push(date.weekday_short);
          // }
          // console.log("forecastday ", weather.forecastday);
          weather.day1 = forecast.data.forecast.simpleforecast.forecastday[0].date.weekday_short;
          weather.forecast1 = forecast.data.forecast.txt_forecast.forecastday[0].fcttext;
          weather.high = forecast.data.forecast.simpleforecast.forecastday[0].high.fahrenheit;
          weather.low = forecast.data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
        })
      return res;
    }


});

// .config(function ($stateProvider, $urlRouterProvider) {
//   $stateProvider.state('root', {
//     url: '/',
//     template: '<h1>Hello World</h1>'
//   });
//   $urlRouterProvider.otherwise('/');
// })
