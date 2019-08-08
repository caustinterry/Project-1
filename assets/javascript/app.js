///////////////////////Global Variables//////////////////////////////////////////////
let randomDrink;
let uniqueDrink = [];



///////////////////////Weather and Location Code/////////////////////////////////////
var lat;
var lng;
var zip;
var zipTemp;
var localTemp;

//Function to test if browser has location feature
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert = "Geolocation is not supported by this browser.";
  }
}

//function running the location feature in browser
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

      localTemp = weatherResponse.main.temp;

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
      $(".card-content").append("<p>Current Temp: " + localTemp + "</p>");

      loadDrinks(localTemp); //drinks will load initially by the local weather if user allows it.
    });
  }
  weather();
}

getLocation();

function zipWeather() {
  var zip = $("#icon_prefix")
    .val()
    .trim();
  event.preventDefault();

  console.log(zip);

  var zipWeatherAPI = "4b5ee7805cd7b4c7d16b45e019860920";
  var zipWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    zip +
    ",us&APPID=" +
    zipWeatherAPI +
    "&units=imperial";

  $.ajax({
    url: zipWeatherURL,
    method: "GET"
  }).done(function (zipWeatherResponse) {
    console.log(zipWeatherResponse);
    zipTemp = zipWeatherResponse.main.temp;
    console.log(zipTemp);

    $("#weatherDisplay").empty(); //emptying the weather display

    var weatherCard = $("<div>"); //creates a horizontal card to display weather
    weatherCard.attr("class", "card horizontal");

    var weatherImgCard = $("<div>");
    weatherImgCard.attr("class", "card-image");

    var weatherImg = $("<img>"); //pulls weather image from ajax call
    weatherImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" +
      zipWeatherResponse.weather[0].icon +
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
    $(".card-content").append("<p>" + zipWeatherResponse.name + "</p>");
    $(".card-content").append("<p>Current Temp: " + zipTemp + "</p>");

    loadDrinks(zipTemp); //if user puts in zipcode the drinks will change to zipcode
  });
}
$(document).on("click", "#SubmitButton", zipWeather);

//////////////////////////////////Cocktail Code///////////////////////////////////////////////////////

//Generates a random number to select a random drink
let getRandom = function (maxNumber) {
  return Math.floor(Math.random() * maxNumber);
};

///////////////function that loads the drinks based on the weather ///////////////////


let loadDrinks = function (currentTemp) {
  let randomIngredient = weatherBasedIngredient(currentTemp);

  //empty the array each time the function is called
  uniqueDrink = [];

  //Search currently set to to global variable 'ingredient' determined by temperature.
  let drinkURL =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" +
    randomIngredient;

  //Ajax call to fetch a list of drinks based on ingredient
  $.ajax({
    url: drinkURL,
    method: "GET"
  }).then(function (response) {
    //while loop to go through the uniqueDrink array
    while (uniqueDrink.length < 5) {
      //pull a random drink from the drink API
      let currentRandom = newRandomValue(response.drinks)
      //if the drink does not exist in the uniqueDrink array
      if (!existsInArray(currentRandom, uniqueDrink)) {
        //then we will push the drink the uniqueDrink array
        uniqueDrink.push(currentRandom);
      } //else it will keep going through the drinks in the database until the array is full (5 drinks)
    }

    //now we need to loop through the array to get the information below:
    for (var i = 1; i < 6; i++) {

      //Appends the current drink in to the corresponding span pre-set in HTML.
      //Assigns a data-attr 'id' to be used as a unique identifier for second Ajax call.
      $("#drinkName" + i).html(uniqueDrink[i - 1].strDrink);
      $("#drinkName" + i).attr("data-id", uniqueDrink[i - 1].idDrink);
    }
    //Calling this function after the above 'for loop' finishes to keep code synchronous

    drinkId()

  })


};

function newRandomValue(arr) {
  let currentValue = Math.floor(Math.random() * arr.length);
  return arr[currentValue];
}

function existsInArray(val, arr) {
  return arr.indexOf(val) > -1
}




//'Search by id' API URL. Response contains name, pic, measurements, instructions, and ingredients
var drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

//This function makes an Ajax call for each drink name added into the HTML
function drinkId() {
  for (let i = 1; i < 6; i++) {
    //Pulls the data attr 'id' value from #drinkName span to use as 'key' for URL
    var key = $("#drinkName" + i).attr("data-id");

    $.ajax({
      url: drinkDetailsURL + key,
      method: "GET"
    }).then(function (response) {
      //sets the corresponding img attr to the drinks url
      var currentDrinkDetail = response.drinks[0];

      var drinkImg = response.drinks[0].strDrinkThumb;
      var instructions = currentDrinkDetail.strInstructions;
      $("#drinkImage" + i).attr("src", drinkImg);
      $("#drinkInstructions" + i).html(instructions);

      //function call to bring in drink ingredients
      parseIngredients(currentDrinkDetail, i);
    });
  }
  addFavOption();
}

/////////////////////////Function to parse the multiple ingredients////////////////////
let parseIngredients = function (drink, drinkPosition) {
  $("#drinkIngredients" + drinkPosition).empty();
  $("#drinkIngredients" + drinkPosition).append(
    "<li><strong>Ingredients:</strong></li>"
  );

  for (let i = 1; i <= 15; i++) {


    if (drink['strMeasure' + i].length !== 0 && drink['strIngredient' + i].length !== 0) {
      $('#drinkIngredients' + drinkPosition).append('<li>' + drink['strMeasure' + i] + ' ' + drink['strIngredient' + i] + '</li>');


    }
  }
};

////////////////////////conditional based on the weather//////////////////////////
let weatherBasedIngredient = function (currentTemp) {
  let chosenIngredient;
  //variable to hold the array of warm weather drinks: Champagne  / Grapefruit juice / Pineapple juice / Strawberries / Mango / Kiwi / Lemonade / Pisco
  let warmWeatherIngredients = [
    "Champagne",
    "Grapefruit%20juice",
    "Pineapple%20juice",
    "Cranberry%20juice",
    "Lemon",
    "Orange%20juice",
    "Lemonade",
    "Ice"
  ];

  //variable to hold the array of cold weather drinks: Coffee / Coffee liqueur / Hot Chocolate / Peppermint schnapps / Bailey's irish cream / Heavy cream / Egg / Egg Yolk
  let coldWeatherIngredients = [
    "Coffee",
    "Chambord%20raspberry%20liqueur",
    "Jägermeister",
    "Bailey%27s%20irish%20cream",
    "Creme%20de%20Cacao",
    "Kahlua"
  ];

  //if the temperature is above 65 degrees Farenheit then we will only pull drinks with the warmWeatherIngredients
  if (currentTemp >= 65) {
    let var1 = getRandom(warmWeatherIngredients.length);
    chosenIngredient = warmWeatherIngredients[var1];
  }
  //else (it must be less than 65 degrees Farenheit outside) only show cocktails with the coldWeatherIngredients:
  else {
    let var1 = getRandom(coldWeatherIngredients.length);
    chosenIngredient = coldWeatherIngredients[var1];
  }

  //return the chosen ingredient
  return chosenIngredient;
};

// loadDrinks(95);

////////////////////////////////Favorites and JSON///////////////////////////////////////////////

var favorites = getFavorites()

displayFavorites()


//Get favorites from localStorage. If favorites parse, if not
function getFavorites() {
  favorites = JSON.parse(localStorage.getItem('favorites'))

  if (favorites !== null && favorites.length !== 0) {
    return favorites
  } else {
    $('.fav-message').html('<h4 class="read">Click &quot;<i class="material-icons">favorite_border</i>&quot; to add your favorite recipes here!</h4>')
    return favorites = []

  }
}

function saveFavorites(a, b, c, d) {
  console.log('running saveFavorites');

  var checkval = { name: a, img: b, instructions: c, ingredients: d };
  // if (!containsObject(checkval, favorites)) {
  var found = favorites.some(el => el.name === a);
  if (!found) {
    favorites.push({
      name: a,
      img: b,
      instructions: c,
      ingredients: d
    })
  }
  //console.log('favorites-after' + JSON.stringify(favorites));
  localStorage.removeItem('favorites')
  localStorage.setItem('favorites', JSON.stringify(favorites))
  //console.log('localstorage fav:' + JSON.stringify(localStorage.getItem('favorites')));



}

function addFavOption() {


  $('.material-icons').on("click", function () {

    $(this).css('background-color', 'red')
    $(this).css('border-radius', '5px')
    $('.read').css('display', 'none')

    var heartNum = $(this).attr('data-heart')
    var name = $('#drinkName' + [heartNum]).text()
    var img = $('#drinkImage' + [heartNum]).attr('src')
    var instructions = $('#drinkInstructions' + [heartNum]).text()

    var newIngredients = []
    var children = $('#drinkIngredients' + [heartNum]).children().length

    for (var i = 0; i < children; i++) {
      var ingredients2 = $('#drinkIngredients' + [heartNum]).children().eq(i).text()
      newIngredients.push(ingredients2)
    }

    saveFavorites(name, img, instructions, newIngredients)
    displayFavorites()

  })

}

function displayFavorites() {

  $('.drinkBox').remove();

  if (favorites === null || favorites.length === 0) {
    $('.fav-message').html('<h4 class="read">Click &quot<i class="material-icons">favorite_border</i>&quot to add your favorite recipes here!</h4>')
  }

  $('.favorite-drinks').empty()

  for (var i = 0; i < favorites.length; i++) {

    var drinkBox = $('<div>').addClass('drinkBox')
    var h5 = $('<h5>')
    var icon = $('<i>').addClass('material-icons left rmv-fav')
    icon.attr('data-heart', i)
    icon.css('background-color', 'red')
    icon.css('border-radius', '5px')
    icon.text('favorite_border')
    var drinkName = $('<span>')
    drinkName.text(favorites[i].name)

    h5.append(icon)
    h5.append(drinkName)
    drinkBox.append(h5)

    var img = $('<img>')
    img.attr('src', favorites[i].img)
    drinkBox.append(img)

    var instructionsBox = $('<div>').addClass('instructions')
    var ingredients = $('<ul>')

    var sup = favorites[i].ingredients
    for (var j = 0; j < sup.length; j++) {
      var li = $('<li>')
      var item = sup[j]
      li.text(item)
      ingredients.append(li)

    }

    var instructions = $('<div>')
    instructions.text(favorites[i].instructions)
    instructionsBox.append(ingredients)
    instructionsBox.append(instructions)
    drinkBox.append(instructionsBox)

    $('.favorite-drinks').prepend(drinkBox)
  }

  delFav()

}

function delFav() {


  $('.rmv-fav').on('click', function (e) {

    var num = $(this).attr('data-heart')
    favorites.splice(num, 1)

    localStorage.removeItem('favorites')
    localStorage.setItem('favorites', JSON.stringify(favorites))

    displayFavorites()
  })

}



