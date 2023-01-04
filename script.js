const apiKey = 'd40c765f-530f-4466-be4d-0d8c71f48b9c'
const apiUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1'
const apiUrlModal = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
const apiSearch = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const form = document.querySelector('.header__form')
const search = document.querySelector('.header__search')
const modal = document.querySelector('.modal')

getMovies(apiUrl)

function getClass(value) {
    if (value == null || value == undefined) {
        return ''
    }
    else if (value >= 7) {
        return 'green'
    } else if (value >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-type": "application/json",
            "X-API-KEY": apiKey,
        }
    });
    const respData = await resp.json()
    printCard(respData)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const apiSearchUrl = `${apiSearch}${search.value}`
    if (search.value) {
        getMovies(apiSearchUrl)
    }
    search.value = ''
})

function printCard(data) {
    const moviesEl = document.querySelector(".movies__inner")


    document.querySelector('.movies__inner').innerHTML = ''
    data.films.forEach(movie => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movies__item')
        movieEl.innerHTML = `
        <a href="#" class="movies__item-link"><img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movies__item-img"></a>
        <div class = "movies__info">
            <p class="movies__item-name">${movie.nameRu}</p>
            <p class="movies__item-descr">${movie.genres.map(genre => `${genre.genre}`)}</p>
        </div>
        <div class="movies__item-rating movies__item-rating--${getClass(movie.rating)}">${movie.rating}</div>
        `
        movieEl.addEventListener('click', () => {
            openModal(movie.filmId)
            console.log(movieEl);
        })
        moviesEl.appendChild(movieEl)
    })
}




async function openModal(id) {
    const resp = await fetch(apiUrlModal + id, {
        headers: {
            "Content-type": "application/json",
            "X-API-KEY": apiKey,
        }
    });
    const respData = await resp.json()


    modal.innerHTML = `
    <div class="modal__item">
        <img src="${respData.posterUrl}" alt="" class="modal__movie-img">
        <p class="modal__movie-title">Название: ${respData.nameRu}</p>
        <p class="modal__movie-year">Год выпуска: ${respData.year}</p>
        <ul class="modal__movie-info">
            <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
            <li class="modal__movie-site">Хронометраж: ${respData.filmLength} минут</li>
            <li class="modal__movie-descr">Описание - ${respData.description}</li>
        </ul>
        <button type="button" class="modal__close-btn">Закрыть</button>
    </div>
    `
    modal.classList.add('modal--show')
    document.body.classList.add('stop--scrolling')
    
    document.querySelector('.modal__close-btn').addEventListener('click', () => {
        closeModal()
    })
}

function closeModal() {
    modal.classList.remove('modal--show')
    document.body.classList.remove('stop--scrolling')
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal()
    }
})

window.addEventListener('keydown', (e) => {
    if (e.keyCode == 27) {
        closeModal()
    }
})