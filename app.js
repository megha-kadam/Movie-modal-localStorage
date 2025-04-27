const cl = console.log;

const addMovie = document.getElementById('addMovie');
const backDrop = document.getElementById('backDrop');
const movieModal = document.getElementById('movieModal');
const movieForm = document.getElementById('movieForm');
const movieTitle = document.getElementById('movieTitle');
const movieImgUrl = document.getElementById('movieImgUrl');
const movieDescription = document.getElementById('movieDescription');
const movieRating = document.getElementById('movieRating');
const movieList = document.getElementById('movieList');
const addMovieBtn = document.getElementById('addMovieBtn');
const updateMovieBtn = document.getElementById('updateMovieBtn');
const modalClose = [...document.querySelectorAll('.modalClose')];

let movieArr = [];

if(localStorage.getItem('movieArr')){
    movieArr= JSON.parse(localStorage.getItem('movieArr'))
}

const generateUuid = ()=> {
    return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
});
};

const setRating = (rating) =>{
    if(rating > 4){
        return 'bg-success'
    }else if(rating > 3 && rating <= 4){
        return 'bg-warning'
    }else{
        return 'bg-danger'
    }
};

const onEditMovie = (ele) => {
   let editId = ele.closest('div.col-md-3').id;
    cl(editId);
    localStorage.setItem('editId' , editId);

    let editObj = movieArr.find(movie => movie.movieId === editId);
    cl(editObj);

    localStorage.setItem('movieArr', JSON.stringify(movieArr));
    
    movieTitle.value = editObj.title;
    movieImgUrl.value = editObj.movieImgUrl;
    movieDescription.value = editObj.description;
    movieRating.value = editObj.rating;

    addMovieBtn.classList.add('d-none');
    updateMovieBtn.classList.remove('d-none');
}

const onRemoveMovie =(ele) => {
    let getConfirm = confirm(`Are you sure to remove this movie`);
    cl(getConfirm);

    if(getConfirm){
        let removeId = ele.closest('div.col-md-3').id;
        cl(removeId);

        let getIndex= movieArr.findIndex(movie => movie.movieId === removeId);
        movieArr.splice(getIndex, 1);

        localStorage.setItem('movieArr', JSON.stringify(movieArr));

        ele.closest('div.col-md-3').remove();
    }
}

const createMovieCard = (arr) => {
    let result = '';
    arr.forEach(movie => {
        result += ` <div class="col-md-3" id='${movie.movieId}'>
                <figure class="movieCard">
                    <img src="${movie.imgURL}" alt="${movie.title}" title="${movie.title}">
                    <figcaption>
                        <div class="ratingTitle">
                            <div class="row">
                                <div class="col-10">
                                    <h3>${movie.title}</h3>
                                </div>
                                <div class="col-2">
                                    <small class="p-2 ${setRating(movie.movieRating)}">${movie.rating}</small>
                                </div>
                            </div>
                        </div>
                        <div class="movieInfo">
                            <h3>${movie.title}</h3>
                            <p>${movie.description}</p>
                        </div>
                        <div class="action">
                            <button class="btn btn-sm btn-outline-info" onclick='onEditMovie(this)'>Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick='onRemoveMovie(this)'>Remove</button>
                        </div>
                    </figcaption>
                </figure>
            </div>`
            movieList.innerHTML = result;
     });
}
createMovieCard(movieArr);

// const onAddMovie = () => {
//    backDrop.classList.add('show');
//     movieModal.classList.add('show');
// }

const onToggleMovie = () => {
    backDrop.classList.toggle('show');
    movieModal.classList.toggle('show');
}

const onMovieSubmit = (eve) => {
    eve.preventDefault();
    let movieObj = {
        title : movieTitle.value,
        imgURL : movieImgUrl.value,
        description : movieDescription.value,
        rating : movieRating.value,
        movieId : generateUuid(),
    }
    cl(movieObj);
    movieArr.unshift(movieObj);

    localStorage.setItem('movieArr', JSON.stringify(movieArr));

    let card = document.createElement('div');
    card.className = 'col-md-3';
    card.id = movieObj.movieId;
    card.innerHTML = ` <figure class="movieCard">
                    <img src="${movieObj.imgURL}" alt="${movieObj.title}" title="${movieObj.title}">
                    <figcaption>
                        <div class="ratingTitle">
                            <div class="row">
                                <div class="col-10">
                                    <h3>${movieObj.title}</h3>
                                </div>
                                <div class="col-2">
                                    <small class="p-2 ${setRating(movieObj.movieRating)}">${movieObj.rating}</small>
                                </div>
                            </div>
                        </div>
                        <div class="movieInfo">
                            <h3>${movieObj.title}</h3>
                            <p>${movieObj.description}</p>
                        </div>
                        <div class="action">
                            <button class="btn btn-sm btn-outline-info" onclick='onEditMovie(this)'>Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick='onRemoveMovie(this)'>Remove</button>
                        </div>
                    </figcaption>
                </figure>`;
    movieList.prepend(card);
    movieForm.reset();
    onToggleMovie();
}

const onUpdateMovie = () => {
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        title : movieTitle.value,
        imgURL : movieImgUrl.value,
        description : movieDescription.value,
        rating : movieRating.value,
        movieId : updateId,
    }
    cl(updateObj);

    let getIndex = movieArr.findIndex(movie => movie.movieId === updateId);
    movieArr[getIndex] = updateObj;

    localStorage.setItem('movieArr', JSON.stringify(movieArr));
    movieForm.reset();
    addMovieBtn.classList.remove('d-none');
    updateMovieBtn.classList.add('d-none');

    let card = [...document.getElementById(updateId).children];
    cl(card);
    card[1].value = updateObj.title;
    card[2].value = updateObj.imgURL;
    card[3].valueL = updateObj.description;
    card[4].value = updateObj.rating;
    onUpdateMovie();
}

// addMovie.addEventListener('click', onAddMovie);
addMovie.addEventListener('click', onToggleMovie);
movieForm.addEventListener('submit', onMovieSubmit);
updateMovieBtn.addEventListener('click', onUpdateMovie);
modalClose.forEach(ele => ele.addEventListener('click', onToggleMovie));