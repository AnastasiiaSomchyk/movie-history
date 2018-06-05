/* eslint camelcase: 0 */

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');
const dom = require('./dom');

const myLinks = () => {
  $(document).click((e) => {
    if (e.target.id === 'authenticate') {
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
    } else if (e.target.id === 'mine') {
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      getAllMovieEvent();
      // call the getMoviesEvent
    } else if (e.target.id === 'navSearch') {
      $('#myMovies').addClass('hide');
      $('#search').removeClass('hide');
      $('#authScreen').addClass('hide');
    }
  });
};

const pressEnter = () => {
  // big old keypress event
  $(document).keypress((e) => {
    if (e.key === 'Enter' && !$('#search').hasClass('hide')) {
      const searchWords = $('#searchBar').val().replace(' ', '%20');
      tmdb.showResults(searchWords);
    }
  });
};

const saveMovieToWishListEvent = () => {
  $(document).on('click', '.addMovieToWishList', (e) => {
    const movieToAddCard = $(e.target).closest('.movie');
    const movieToAdd = {
      title: movieToAddCard.find('.movie-title').text(),
      overview: movieToAddCard.find('.movie-overview').text(),
      'poster_path': movieToAddCard.find('img').data('poster'),
      rating: 0,
      isWatched: false,
    };
    firebaseApi.saveMovieToWishList(movieToAdd)
      .then(() => {
        movieToAddCard.remove();
      })
      .catch((error) => {
        console.error('error in saving movie', error);
      });
  });
};

const getAllMovieEvent = () => {
  firebaseApi.getAllMovies()
    .then((moviesArray) => {
      moviesArray.forEach((movie) => {
        dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
      });
    })
    .catch((error) => {
      console.error('error in get all movies', error);
    });
};

const getWishlistMovieEvent = () => {
  firebaseApi.getWishlistMovies()
    .then((moviesArray) => {
      moviesArray.forEach((movie) => {
        dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
      });
    })
    .catch((error) => {
      console.error('error in get all movies', error);
    });
};

const getWatchedMovie = () => {
  firebaseApi.getWatchedMovies()
    .then((moviesArray) => {
      moviesArray.forEach((movie) => {
        dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
      });
    })
    .catch((error) => {
      console.error('error in get all movies', error);
    });
};

const deleteMovieFromFirebase = () => {
  $(document).on('click', '.deleteMovieFromCollectionEvent', (e) => {
    const movieToDeleteId = $(e.target).closest('.movie').data('firebaseId');
    firebaseApi.deleteMovieFromDb(movieToDeleteId)
      .then(() => {
        getAllMovieEvent();
      })
      .catch((error) => {
        console.error('error from delete movie', error);
      });
  });
};

const updateMovieEvent = () => {
  $(document).on('click', '.updateMovieToWatched', (e) => {
    const movieToUpdateId = $(e.target).closest('.movie').data('firebaseId');

    const movieToUpdateCard = $(e.target).closest('.movie');
    const updatedMovie = {
      title: movieToUpdateCard.find('.movie-title').text(),
      overview: movieToUpdateCard.find('.movie-overview').text(),
      'poster_path': movieToUpdateCard.find('img').data('poster'),
      rating: 0,
      isWatched: true,
    };
    firebaseApi.updateMovieToWatchInDb(updatedMovie, movieToUpdateId)
      .then(() => {
        getAllMovieEvent();
      })
      .catch((error) => {
        console.error('error from delete movie', error);
      });
  });
};

const filterEvents = () => {
  $('#filterButtons').on('click', (e) => {
    const classList = e.target.classList;
    if (classList.contains('wishlist')) {
      // show only isWatched : false
      getWishlistMovieEvent();
    } else if (classList.contains('watched')) {
      // show only if isWatched: true
      getWatchedMovie();
    } else {
      getAllMovieEvent();
    };
  });
};

const authEvent = () => {
  $('#signin-btn').click((e) => {
    e.preventDefault();
    const email = $('#inputEmail').val();
    const pass = $('#inputPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then((user) => {
        $('#myMovies').removeClass('hide');
        $('#search').addClass('hide');
        $('#authScreen').addClass('hide');
        getAllMovieEvent();
        // call the getMoviesEvent
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
        // ...
      });
  });
  $('#register-btn').click(() => {
    const email = $('#registerEmail').val();
    const pass = $('#registerPassword').val();
    firebase.auth().createUserWithEmailAndPassword(email, pass)
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  });
  $('#register-link').click(() => {
    $('#login-form').addClass('hide');
    $('#registration-form').removeClass('hide');
  });
  $('#signin-link').click(() => {
    $('#login-form').addClass('hide');
    $('#registration-form').removeClass('hide');
  });
  $('#logout').click(() => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
      console.error(error);
    });
  });
};

const initializer = () => {
  myLinks();
  pressEnter();
  saveMovieToWishListEvent();
  deleteMovieFromFirebase();
  updateMovieEvent();
  filterEvents();
  authEvent();
};

module.exports = {
  initializer,
  getAllMovieEvent,
};
