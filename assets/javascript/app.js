//'Search by ingredient' API URL. Response contains drink name, drink id, and drink pic. Seach currently set to vodka.
let drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka";

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
            var drinkImg = response.drinks[0].strDrinkThumb
            $('#drinkImage' + i).attr('src', drinkImg)
           

       })
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


