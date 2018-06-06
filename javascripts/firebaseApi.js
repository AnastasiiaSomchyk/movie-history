let firebaseConfig = {};
let uid = '';

const setConfig = (fbConfig) => {
  firebaseConfig = fbConfig;
};

const setUID = (newUID) => {
  uid = newUID;
};

const saveMovieToWishList = (newMovie) => {
  newMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `${firebaseConfig.databaseURL}/movies.json`,
      data: JSON.stringify(newMovie),
    })
      .done((uniqueKey) => {
        resolve(uniqueKey);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getAllMovies = () => {
  console.log(uid);
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((getAllMoviesObj) => {
        if (getAllMoviesObj !== null) {
          Object.keys(getAllMoviesObj).forEach((fbKey) => {
            getAllMoviesObj[fbKey].id = fbKey;
            allMoviesArray.push(getAllMoviesObj[fbKey]);
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWatchedMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((getAllMoviesObj) => {
        if (getAllMoviesObj !== null) {
          Object.keys(getAllMoviesObj).forEach((fbKey) => {
            if (getAllMoviesObj[fbKey].isWatched) {
              getAllMoviesObj[fbKey].id = fbKey;
              allMoviesArray.push(getAllMoviesObj[fbKey]);
            };
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWishlistMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((getAllMoviesObj) => {
        if (getAllMoviesObj !== null) {
          Object.keys(getAllMoviesObj).forEach((fbKey) => {
            if (!getAllMoviesObj[fbKey].isWatched) {
              getAllMoviesObj[fbKey].id = fbKey;
              allMoviesArray.push(getAllMoviesObj[fbKey]);
            };
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const deleteMovieFromDb = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `${firebaseConfig.databaseURL}/movies/${movieId}.json`,
    })
      .done(() => {
        resolve();
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const updateMovieToWatchInDb = (updateMovie, movieId) => {
  updateMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `${firebaseConfig.databaseURL}/movies/${movieId}.json`,
      data: JSON.stringify(updateMovie),
    })
      .done((modifiedMovie) => {
        resolve(modifiedMovie);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

module.exports = {
  saveMovieToWishList,
  setUID,
  setConfig,
  getAllMovies,
  deleteMovieFromDb,
  updateMovieToWatchInDb,
  getWatchedMovies,
  getWishlistMovies,
};
