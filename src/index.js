import './css/styles.css';
import {fetchCountries} from './fetchCountries.js';
import Notiflix from 'notiflix';
import _debounce  from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const LETTERS = /^[A-Za-z ]+$/;

const form = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

const renderCountryList = (countries) => { 
  if (countries.length > 10) {
    return  Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
  } 
  if (countries.length === 1) {
    const markup = countries
      .map((country) => { 
        return `<p><img class="flag" src="${country.flags.svg}"><span class="country-name">${country.name.common}</span></p>
                <p><b>Capital</b>: ${country.capital}</p>
                <p><b>Population</b>: ${country.population}</p>
                <p><b>Languages</b>: ${Object.values(country.languages).join(", ")}</p>`;    
      })
      .join("");
    countryInfo.innerHTML = markup;
  } else {
    const markup = countries
      .map((country) => { 
        return `<li>
                  <p class="item"><img class="flag" src="${country.flags.svg}"><span class="country-name">${country.name.common}</span></p>
                </li>`;    
      })
      .join("");
    countryList.innerHTML = markup;  
  }
}

form.addEventListener("input", _debounce((e) => {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
  if(e.target.value.length > 0 && !e.target.value.match(LETTERS)){
    return Notiflix.Notify.failure("Only letters are allowed!");
  }
  if (e.target.value.length > 0) {
    let name = e.target.value.toString();
    fetchCountries(name)
      .then((countries) => renderCountryList(countries))
      .catch(e=>Notiflix.Notify.failure("Oops, there is no country with that name"));
  }  
}, DEBOUNCE_DELAY))

