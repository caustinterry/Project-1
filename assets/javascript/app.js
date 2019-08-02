let drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka";
let drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
let currentDrinkDetailsURL


//ajax call to brink in drink
$.ajax({
   url: drinkURL,
   method: 'GET'
}).then(function (response) {
   console.log(response);

   for (var i = 0; i <= 5; i++) {

       let randomDrink = getRandom(response.drinks.length);


       let currentDrink = response.drinks[randomDrink];
       console.log(currentDrink.idDrink)
       // currentDrink = currentDrink.idDrink
       currentDrinkDetailsURL = drinkDetailsURL + currentDrink.idDrink;
       $('#drinkName' + i).html(currentDrink.strDrink);
       $('#drinkName' + i).attr('data-id', currentDrink.idDrink)

   }
   drinkId()
})



function drinkId() {
   for (let i = 1; i < 6; i++) {
       var key = $('#drinkName' + i).attr('data-id')
       // var drinkNumber =
       console.log('key: ' + key)

       $.ajax({
           url: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + key,
           method: 'GET'
       }).then(function (response) {
           // for (var i = 1; i < 6; i++) {
               console.log(response.drinks[0].strDrinkThumb)
               var drinkImg = response.drinks[0].strDrinkThumb
               console.log(i);
               $('#drinkImage' + i).attr('src', drinkImg)
           // }

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


let getRandom = (function (maxNumber) {
   return Math.floor(Math.random() * maxNumber);
})