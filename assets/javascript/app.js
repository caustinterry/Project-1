let drinkURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka";
let drinkDetailsURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";



$(document).ready(function () {


    let i = 1


    //ajax call to brink in drink 
    $.ajax({
        url: drinkURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);





        // Need a for loop here  1-5
        // for (i = 1, i <= 5, i++) {

        let randomDrink = getRandom(response.drinks.length);





        console.log(randomDrink);
        let currentDrink = response.drinks[randomDrink];
        let currentDrinkDetailsURL = drinkDetailsURL + currentDrink.idDrink;
        $('#drinkName' + i).html(currentDrink.strDrink);

        //ajax call to bring in drink image
        $.ajax({
            url: currentDrinkDetailsURL,
            method: 'GET'
        }).then(function (response) {
            let currentDrinkDetail = response.drinks[0];
            $('#drinkImage' + i).attr('src', currentDrinkDetail.strDrinkThumb);

            //bring in instructions
            $('#drinkInstructions' + i).html(currentDrinkDetail.strInstructions);

            //bring in ingredients
            parseIngredients(currentDrinkDetail, i);




        })


        // }
    });
});
//multiple ingredients function
let parseIngredients = (function (drink, drinkPosition) {
    for (i = 1; i <= 15; i++) {
        if (drink['strMeasure' + i] != null && drink['strIngredient' + i] != null) {
            $('#drinkIngredients1').append('<li>' + drink['strMeasure' + i] + ' ' + drink['strIngredient' + i] + '</li>');
        }


    }
})


let getRandom = (function (maxNumber) {
    return Math.floor(Math.random() * maxNumber);
})