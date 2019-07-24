import axios from 'axios'
const API_TOKEN = "47149800889939de483a788dd8b108fc"

export function getFilm(text, page){
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN +
     '&language=fr&query=' + text + "&page=" + page

    return fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error))
}

export function getImageFromApi(name){
    return 'https://image.tmdb.org/t/p/w300' + name
}

// Récupération du détail d'un film
export function voir_film (id) {
    return fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + API_TOKEN + '&language=fr')
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  // Récupération des meilleurs films 
export function getBestFilmsFromApi (page) {
    return fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + API_TOKEN + '&vote_count.gte=1000&sort_by=release_date.desc&language=fr&page=' + page)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }

  export function login(){
    return fetch('http://127.0.0.1:8000/api/login?email=boris@gmail.com&password=password')
    //.then((response) => response.json())
    .catch((error) => console.log(error))
  }