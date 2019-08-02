let drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka";
let drinkDetailsURL =
  "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
let currentDrinkDetailsURL;

//ajax call to brink in drink
$.ajax({
  url: drinkURL,
  method: "GET"
}).then(function(response) {
  console.log(response);

  for (var i = 0; i <= 5; i++) {
    let randomDrink = getRandom(response.drinks.length);

    let currentDrink = response.drinks[randomDrink];
    console.log(currentDrink.idDrink);
    // currentDrink = currentDrink.idDrink
    currentDrinkDetailsURL = drinkDetailsURL + currentDrink.idDrink;
    $("#drinkName" + i).html(currentDrink.strDrink);
    $("#drinkName" + i).attr("data-id", currentDrink.idDrink);
  }
  drinkId();
});

function drinkId() {
  for (let i = 1; i < 6; i++) {
    var key = $("#drinkName" + i).attr("data-id");
    // var drinkNumber =
    console.log("key: " + key);

    $.ajax({
      url: "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + key,
      method: "GET"
    }).then(function(response) {
      // for (var i = 1; i < 6; i++) {
      console.log(response.drinks[0].strDrinkThumb);
      var drinkImg = response.drinks[0].strDrinkThumb;
      console.log(i);
      $("#drinkImage" + i).attr("src", drinkImg);
      // }
    });
  }
}

//bring in ingredients
// parseIngredients(currentDrinkDetail, i);

//multiple ingredients function
// let parseIngredients = (function (drink, drinkPosition) {
//     for (i = 1; i <= 15; i++) {
//         if (drink['strMeasure' + i] != null && drink['strIngredient' + i] != null) {
//             $('#drinkIngredients1').append('<li>' + drink['strMeasure' + i] + ' ' + drink['strIngredient' + i] + '</li>');
//         }

//     }
// })

let getRandom = function(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
};

var lat;
var lng;

//Function to test if browser has location feature
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert = "Geolocation is not supported by this browser.";
  }
}

//function running the location feature in broswer
function showPosition(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;

  //Weather ajax call based upon coordinates pulled
  function weather() {
    var weatherAPI = "4b5ee7805cd7b4c7d16b45e019860920";
    var weatherURL =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lng +
      "&APPID=" +
      weatherAPI +
      "&units=imperial";

    $.ajax({
      url: weatherURL,
      method: "GET"
    }).then(function(weatherResponse) {
      console.log(weatherResponse);
      // if(weatherResponse.)

      $("#weatherDisplay").empty(); //emptying the weather display

      var weatherCard = $("<div>"); //creates a horizontal card to display weather
      weatherCard.attr("class", "card horizontal");

      var weatherImgCard = $("<div>");
      weatherImgCard.attr("class", "card-image");

      var weatherImg = $("<img>"); //pulls weather image from ajax call
      weatherImg.attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          weatherResponse.weather[0].icon +
          "@2x.png"
      );

      var cardStack = $("<div>");
      cardStack.attr("class", "card-stacked");

      var cardContent = $("<div>");
      cardContent.attr("class", "card-content");

      $("#weatherDisplay").html(weatherCard); //adds the first card to HTML
      weatherCard.append(weatherImgCard); //adds image card to weather card
      weatherImgCard.append(weatherImg); //adds image to image card
      weatherCard.append(cardStack); //adds stack for the card
      cardStack.append(cardContent); //adds content location for card
      $(".card-content").append("<p>" + weatherResponse.name + "</p>");
      $(".card-content").append(
        "<p>Current Temp: " + weatherResponse.main.temp + "</p>"
      );
    });
  }
  weather();
  test();
}

getLocation();

function test() {
  //test to make sure the variables were being pulled globally
  console.log(lat, lng);
}
