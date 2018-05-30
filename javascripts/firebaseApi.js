let firebaseConfig = {};
const setConfig = (fbConfig) => {
  firebaseConfig = fbConfig;
};

const saveMovieToWishList = (newMovie) => {
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
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json`,
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

module.exports = {
  saveMovieToWishList,
  setConfig,
  getAllMovies,
};
