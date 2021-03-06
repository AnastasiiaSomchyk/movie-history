const { getAllMovieEvent, } = require('./events');
const { setUID, } = require('./firebaseApi');

const checkLoginStatus = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUID(user.uid);
      // user is signed in.
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      $('#mine, #navSearch, #logout').removeClass('hide');
      $('#authenticate').addClass('hide');
      getAllMovieEvent();
    } else {
      // No user is signed in.
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
      $('#logout, #mine, #navSearch').addClass('hide');
      $('#authenticate').removeClass('hide');
    }
  });
};

module.exports = {
  checkLoginStatus,
};
