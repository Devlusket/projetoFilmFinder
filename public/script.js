const tmdbKey = 'ae77281f01aacc4cd29728083657555d';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');

const getGenres = async () => {

  const genreRequestEndPoint = '/genre/movie/list';
  const requestParams =  `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndPoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch); 
    if (response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch(error) {
    console.log(error);
  }
};

const getMovies = async () => {

  const selectedGenre = getSelectedGenre();
  const discoverMovieEndPoint = '/discover/movie';

  const randomPage = Math.floor(Math.random() * 500) + 1;

  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${randomPage}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndPoint}${requestParams}`;
  
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse =  await response.json();
      const movies = jsonResponse.results;
      return movies;
    }
  } catch(error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndPoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndPoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movieInfo = jsonResponse;
      return movieInfo;
    }
  } catch(error) {
    console.log(error);
  }
};

const getMovieCast = async (movieId) => {
    const movieCastEndPoint = `/movie/${movieId}/credits`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieCastEndPoint}${requestParams}`;

    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const cast = jsonResponse.cast;
            return cast;
        }
    } catch(error) {
        console.log(error);
    }
}

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {

    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // Show loading message

  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
 const movies = await getMovies();
 const randomMovie = getRandomMovie(movies);
 const info =  await getMovieInfo(randomMovie);
 displayMovie(info);

 // Fetch cast information
 const cast = await getMovieCast(randomMovie.id);
 info.cast = cast; // Attach cast to movie info

 displayMovie(info); // Now displayMovie() has access to cast
 loadingMessage.style.display = 'none'; // Hide loading message after movie loads
};

//getGenres().then(populateGenreDropdown);

getGenres()
    .then(genres => {
        if (genres) {
            populateGenreDropdown(genres);
        } else {
            console.error("No genres received from API");
        }
    })
    .catch(error => console.error("Failed to fetch genres:", error));


playBtn.onclick = showRandomMovie;