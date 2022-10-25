
// Variables
const search_value = document.getElementById('search');
const search_btn = document.getElementById('search-btn');
const random_btn = document.getElementById('random-meal');

// show the random meal in the Dom
function showRandomMeal(data , ingredients){
    // empty the search result
    document.querySelector('.search-response').innerHTML='';
    // empty gallery
    document.querySelector('.gallery').innerHTML=''
    Show_showcase(data,ingredients);
}

// show the showcase
function Show_showcase(data,ingredients){
    // image container
    document.querySelector('.image-container').innerHTML=
    `<p id="search-response"></p>
    <h2 id="image-name">${data.strMeal}</h2>
    <img src="${data.strMealThumb}" alt="" class="big-image" id="big-image">`;
    // description container
    document.querySelector('.description-container').innerHTML=
    `<h4 id="title-description">
    <p id="category">${data.strCategory}</p>
    <p id="contry">${data.strArea}</p>
    </h4>
    <p id="text-description">${data.strInstructions}</p>`;
    // ingredients container
    let text = '';
    ingredients.forEach( item => {
        text +=`<li class="ingredient-box">${item}</li>`
    })
    document.querySelector('.ingredients-container').innerHTML=
    `<h3>Ingredients</h3>
    <ul class="ingredients-showcase" id="ingredients-showcase">${text}
    </ul>`;
    document.getElementById('ingredients-showcase').innerHTML=text;
}

// Fetch from api random meal
function GetrandomMeal(){
    let ingredients=[];
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then( res => res.json())
    .then(data => {
        const meal = data.meals[0]
        console.log(meal)
        // this loop job is to put ingredients and measures in the Ingredient Array
        for( let i = 1 ; i < 20 ; i++){
            if(meal[`strIngredient${i}`]){
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
            }
            else{
                break;
            }
        }
        // this loop job is to put in array ingredients and measure .
        showRandomMeal(meal , ingredients);
    }) 
}

// fetch from api the searched value

function GetSearchedValue(){
    const searchValue = search_value.value;
    // check if the user enter a input
    if(searchValue === ''){
        document.querySelector('.error-message').style.transform='translateY(20px)'
        setTimeout(() => {
            document.querySelector('.error-message').style.transform='translateY(-60px)'
        }, 2000);
    }
    else{
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
       .then(res => res.json())
       .then(data => {
        // check if search value exist
          if(data.meals ===null){
            document.querySelector('.search-response').innerHTML=`<h2>There are no search results. Try again! </h2>`
          }
          else{
            showSearchecValue(data.meals)
            document.querySelector('.search-response').innerHTML=`<h2>Search results for ''${searchValue}'' </h2>`
          }
       })
       
    }
}

// show the sreached value in the DOM
function showSearchecValue(data){
    let text = '';
    data.forEach(item => {
        text +=`
        <div class="meal">
            <img src=${item.strMealThumb} alt="">
            <div class="meal-title" data-mealId="${item.idMeal}">
                <h3 class="lol">${item.strMeal}</h3>
             </div>
        </div>`
    })
    document.querySelector('.gallery').innerHTML=text;
}

// function get selected meal (fetch data by id)
function getSelectedMeal(e){
        // when the user click on mini image
    let idValue;
    if(e.target.className.includes('meal')){
        idValue= e.target.getAttribute("data-mealId");
    }
    else if((e.target.className.includes('lol'))){
        idValue= e.target.parentElement.getAttribute("data-mealId")
    }
    // fetching data by id 
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idValue}`)
    .then(res => res.json())
    .then( data => {
        let meal = data.meals[0]
        let ingredient=[];
        for(let i = 1 ; i <= 20 ;i++){
            if(meal[`strIngredient${i}`]){
                ingredient.push(meal[`strIngredient${i}`])
            }
            else{
                break;
            }

       }
       Show_showcase(meal,ingredient)
    })

}




// event listners
search_btn.addEventListener('click',GetSearchedValue)
random_btn.addEventListener('click',GetrandomMeal)
document.querySelector('.gallery').addEventListener('click', getSelectedMeal)

