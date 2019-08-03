///////////////////////Global Variables//////////////////////////////////////////////
var ingredient


///////////////////////Weather and Location Code/////////////////////////////////////
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
    }).then(function (weatherResponse) {
      console.log(weatherResponse);
      var temp = weatherResponse.main.temp
      if (temp > 65) {
          ingredient = 'pineapple juice'
      } else {
          ingredient = 'coffee'
      }

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


//////////////////////////////////Cocktail Code///////////////////////////////////////////////////////


//'Search by ingredient' API URL. Response contains drink name, drink id, and drink pic. 
//Seach currently set to to global variable 'ingredient' determined by weather temperature.
let drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;

//'Search by id' API URL. Response contains name, pic, measurements, instructions, and ingredients
let drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";


//Generates a random number to select a random drink
let getRandom = (function (maxNumber) {
  return Math.floor(Math.random() * maxNumber);
})

//Ajax call to fetch a list of drinks based on ingredient
$.ajax({
  url: drinkURL,
  method: 'GET'
}).then(function (response) {


  for (var i = 0; i <= 5; i++) {
    //Generates a random number on each loop and chooses a drink
    let randomDrink = getRandom(response.drinks.length);
    let currentDrink = response.drinks[randomDrink];


    //Appends the current drink in to the corresponding span pre-set in HTML.
    //Assigns a data-attr 'id' to be used as a unique identifier for second Ajax call.
    $('#drinkName' + i).html(currentDrink.strDrink);
    $('#drinkName' + i).attr('data-id', currentDrink.idDrink)

  }
  //Calling this function after the above 'for loop' finishes to keep code synchronous
  drinkId()
})


//This function makes an Ajax call for each drink name added into the HTML
function drinkId() {

  for (let i = 1; i < 6; i++) {
    //Pulls the data attr 'id' value from #drinkName span to use as 'key' for URL
    var key = $('#drinkName' + i).attr('data-id')

    $.ajax({
      url: drinkDetailsURL + key,
      method: 'GET'
    }).then(function (response) {

      //sets the corresponding img attr to the drinks url
      var currentDrinkDetail = response.drinks[0]
      var drinkImg = response.drinks[0].strDrinkThumb
      $('#drinkImage' + i).attr('src', drinkImg)
      $('#drinkInstructions' + i).html(currentDrinkDetail.strInstructions);

      //function call to bring in drink ingredients
      parseIngredients(currentDrinkDetail, i);

    })
  }
}




//multiple ingredients function
let parseIngredients = (function (drink, drinkPosition) {


  for (let i = 1; i <= 15; i++) {

    if (drink['strMeasure' + i] != null && drink['strIngredient' + i] != null) {
      $('#drinkIngredients' + drinkPosition).append('<li>' + drink['strMeasure' + i] + ' ' + drink['strIngredient' + i] + '</li>');

    }

  }
})

// let getRandom = function (maxNumber) {
//   return Math.floor(Math.random() * maxNumber);
// };


