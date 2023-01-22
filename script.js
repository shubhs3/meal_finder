var country = "Indian"; //find country using location

getMealByCountry(); // onload shows meals for country

var svg = `<svg height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/></svg>`;
var redsvg = `<svg fill=red height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/></svg>`;
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-box");
const randomBtn = document.getElementById("random-btn");
const favBtn = document.getElementById("fav-btn");
const mealContainer = document.getElementById("meal-container");
const searchheading = document.getElementById("heading");
const myModal = new bootstrap.Modal("#exampleModal");
const myModalDialog = document.getElementById("modal-dialog");

var currentMeals = []; //meals shown in meal container stored here

function getMealByCountry() {
	fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
		.then((res) => res.json())
		.then((data) => setMeals(data.meals, `Popular ${country} Meals`));
}

//function for auto suggestions
async function showResults(e) {
	console.log(e);
	e.preventDefault();
	res = document.getElementById("result");
	res.innerHTML = "";
	let list = "";
	let val = e.target.value;
	let meals = await fetch(
		`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
	)
		.then((res) => res.json())
		.then((data) => data.meals);

	for (i = 0; i < meals.length; i++) {
		list += `<li  onclick="(getMealById(${meals[i].idMeal}))">  ${meals[i].strMeal}  </li>`;
	}
	res.innerHTML = "<ul class='searchUl'>" + list + "</ul>";
}

// this function when current meals are unpdated
function setMeals(meals, heading) {
	searchheading.innerText = heading;
	mealContainer.innerHTML = "";
	currentMeals = meals;

	let favMeals = localStorage.getItem("favMeals");
	if (favMeals == null || favMeals == "") {
		favMeals = [];
	}

	currentMeals.map((item, index) => {
		//used bootstrap card
		mealContainer.innerHTML += `
    <div class="col-lg-4">
    <div class="card" style="" data-idMeal=${item.idMeal}>
                    <img
						onclick="(showModal(${item.idMeal}))"
                        src=${item.strMealThumb}
                        class="card-img-top"
                        alt="..."
                    />
                    <div class="card-body">
                        <h5 class="card-title">${item.strMeal}</h5>
                        ${
													isFav(index) == true
														? `<button id=${item.idMeal}  onClick="removeFromFav(${index} , ${item.idMeal})">${redsvg}</button>`
														: `<button id=${item.idMeal}  onClick="addToFav(${index} , ${item.idMeal})">${svg}</button>`
												}
                    </div>
                </div>
                </div>
    `;
	});
}

function isFav(id) {
	var favItems = [];
	var local = localStorage.getItem("favMeals");
	if (local != null) {
		favItems = JSON.parse(local);
	}

	for (var i = 0; i < favItems.length; i++) {
		if (favItems[i].idMeal == currentMeals[id].idMeal) {
			return true;
		}
	}
	return false;
}

// Add new item to favourites
function addToFav(index, mid) {
	console.log("add");
	var favBtn = document.getElementById(mid);
	favBtn.innerHTML = redsvg;
	favBtn.removeEventListener("click", () => addToFav(index, mid));
	favBtn.addEventListener("click", () => removeFromFav(index, mid));
	var favItems;
	var local = localStorage.getItem("favMeals");
	if (local == null) {
		favItems = [];
	} else {
		favItems = JSON.parse(local);
	}
	favItems = [...favItems, currentMeals[index]];
	favItems = JSON.stringify(favItems);
	localStorage.setItem("favMeals", favItems);
}

// Remove a meal from favourites
function removeFromFav(index, mid) {
	console.log("remove");

	var notFavBtn = document.getElementById(mid);
	notFavBtn.innerHTML = svg;
	notFavBtn.removeEventListener("click", () => removeFromFav(index, mid));
	notFavBtn.addEventListener("click", () => addToFav(index, mid));

	var favItems;
	var local = localStorage.getItem("favMeals");
	if (local == null || local == "") {
		favItems = [];
	} else {
		favItems = JSON.parse(local);
	}
	var ix = currentMeals[index].idMeal; //get meal id for current index
	for (var i = 0; i < favItems.length; i++) {
		if (favItems[i].idMeal == ix) {
			favItems.splice(i, 1);
			break;
		}
	}
	favItems = JSON.stringify(favItems);
	localStorage.setItem("favMeals", favItems);
}

function showFav() {
	var favItems;
	var local = localStorage.getItem("favMeals");
	if (local == null) {
		favItems = [];
	} else {
		favItems = JSON.parse(local);
	}
	setMeals(favItems, "Favourites");
}

//function called when random button clicked
function getRandomMeal() {
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then((res) => res.json())
		.then((data) => {
			setMeals(data.meals, "Random");
		});
}

//on submit of search form
function searchMeal(e) {
	e.preventDefault(); // prevent from page reload

	searchheading.innerText = "";

	const term = searchInput.value;

	if (term.trim()) {
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);

				searchheading.innerText = `Search results for '${term}'`;

				if (data.meals === null) {
					searchheading.innerText = `No result, try again !`;
				} else {
					setMeals(data.meals, `Search results for ${term}`);
				}
			});
		searchInput.value = "";
		document.getElementById("result").innerHTML = "";
	} else alert("Meal can't be blank");
}

// called when click on meal image
async function showModal(id) {
	const meal = await fetch(
		`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
	)
		.then((res) => res.json())
		.then((data) => data.meals[0]);

	console.log(meal);
	var strIngredient = "strIngredient";
	var strMeasure = "strMeasure";
	var Ingredients = "";
	for (let i = 1; ; i++) {
		let st = strIngredient + i;
		let st1 = strMeasure + i;
		if (meal[st] == "") break;

		Ingredients += `<li> ${meal[st]} - ${meal[st1]} </li>`;
	}

	myModalDialog.innerHTML = `				
	<div class="modal-content">
	<div class="modal-header">
		<h1 class="modal-title fs-5" id="exampleModalLabel">${meal.strMeal}</h1>
		<button
			type="button"
			class="btn-close"
			data-bs-dismiss="modal"
			aria-label="Close"
		>
			Close
		</button>
	</div>
	<div class="modal-body">
		<div>
			<img width="100%" height="100%" src="${meal.strMealThumb}" />
		</div>
		<div class="meal-details">
			<div>
				<h3>Ingredients</h3>
				<ul>
					${Ingredients}
				</ul>
			</div>

			<div>
				<h3>Instructions</h3>
				<p>${meal.strInstructions}</p>
			</div>

			<div style="text-align: center">
				<a
					href="${meal.strYoutube}"
					class="btn btn-danger mx-auto"
					style="width: 200px; margin: auto"
					role="button"
					>Youtube</a
				>
			</div>
		</div>
	</div>
</div>
	`;

	myModal.show();
}

function getMealById(id) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
		.then((res) => res.json())
		.then((data) => setMeals(data.meals, ` ${data.meals[0].strMeal}`));

	document.getElementById("result").innerHTML = "";
	searchInput.value = "";
}

searchForm.addEventListener("submit", (e) => searchMeal(e));
searchInput.addEventListener("input", (e) => showResults(e));
randomBtn.addEventListener("click", getRandomMeal);
favBtn.addEventListener("click", showFav);
