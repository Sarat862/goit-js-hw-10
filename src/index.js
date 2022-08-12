import './css/styles.css';
import { fetchCountries } from "./fetchCountries"
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
const body = document.querySelector("body").style.backgroundColor = "#B7C1FF";
const DEBOUNCE_DELAY = 300;


searchBox.addEventListener("input", debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(event) {
    let countryName = event.target.value.trim();
    if (!countryName) {
        return clearMarkup();
    }

    fetchCountries(countryName)
        .then(countries => {
            clearMarkup();
            if (countries.length === 1) {
                return createCountryInfo(countries);
            }
            if (countries.length  <= 10) {
                createCountryList(countries);
            }
            if (countries.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            }          
        })
        .catch(error => {
            Notiflix.Notify.failure("Oops, there is no country with that name")
        }
        )       
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

function markupCountryInfo({flags, name, capital, population, languages}) {
    return `<img src="${flags.svg}" alt="flags" width ="200px">
    <h2>${name.official}</h2>
    <p><b>Capital</b>: ${capital}</p>
    <p><b>Population</b>: ${population}</p>
    <p><b>Languages:</b> ${Object.values(languages).join(" , ")}</p>`
    
}

function reduceCountryInfo(array) {
    return array.reduce((acc, item) => acc + markupCountryInfo(item), "");
}

function createCountryInfo(array) {
    countryInfo.insertAdjacentHTML("beforeend", reduceCountryInfo(array));
}

function markupCountryList({flags, name}) {
    return `<li class="contry-list__item" style="display:flex;align-items:center" > 
    <img class="contry-list__img" src="${flags.svg}" alt="flags" width="50px" height="30px" >
    <h2 class="contry-list__title" style="margin-left:10px">${name.official}</h2>
    </li>`
}

function reduceCountryList(array) {
    return array.reduce((acc, item) => acc + markupCountryList(item), "");
}

function createCountryList(array) {
    countryList.insertAdjacentHTML("beforeend", reduceCountryList(array));
}



