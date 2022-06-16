//DATA
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'languaje': navigator.language || "es",
    }

})

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    item ? movies = item : movies = {}

    return movies
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList()

    if (likedMovies[movie.id])
        likedMovies[movie.id] = undefined
    else
        likedMovies[movie.id] = movie

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
    if (location.hash == '') {
        homePage();
    }
}

//Utils

function createObserver() {
    return new IntersectionObserver((elements) => {
        elements.forEach(element => {
            if (element.isIntersecting)
                element.target.setAttribute(
                    'src',
                    element.target.dataset.img
                )
        })
    })
}

const observer = createObserver()

function createMovies(movies, container, { lazyLoad = false, clean = true } = {}) {
    if (clean) {
        container.innerHTML = ''
    }
    //console.log("lazyload: ", lazyLoad);

    movies.forEach(movie => {
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        /* movieContainer.addEventListener('click', () => {
            location.hash = "#movie=" + movie.id
        }) */
        //console.log("Pelicula: ", movie.title);
        const movieImg = document.createElement('img')
        movieImg.classList.add('movie-img')
        movieImg.setAttribute('alt', movie.title)
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        )

        movieImg.addEventListener('click', () => {
            location.hash = "#movie=" + movie.id
        })
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src',
                `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`)
        })

        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie)
            //getLikedMovies();

        })

        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(movieBtn)

        container.appendChild(movieContainer)
        if (lazyLoad) {
            observer.observe(movieImg)
        }
    });

}

function createCategories(categories, container) {
    container.innerHTML = ''
    categories.forEach(category => {

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })
        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    });
}

//llamados a la API
async function getTrendinMoviesPreview() {
    const { data } = await api('trending/movie/day')
    const movies = data.results

    /* console.log() */

    createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true, clean: true })
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list')
    const categories = data.genres

    createCategories(categories, categoriesPreviewList)
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api('discover/movie', {
                params: {
                    with_genders: id,
                    page,
                },
            })
            const movies = data.results
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })
        }
    }
}

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    })
    const movies = data.results
    maxPage = data.total_pages

    createMovies(movies, genericSection, { lazyLoad: true, clean: true })

}

async function getMoviesbySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        }
    })
    const movies = data.results
    maxPage = data.total_pages

    //console.log('Paginas Totales:', maxPage);

    //createMovies(movies, genericSection)

    createMovies(movies, genericSection, { lazyLoad: true, clean: true },)
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
        const pageIsNotMax = page < maxPage

        if (scrollIsBottom && pageIsNotMax) {
            page++
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            })
            const movies = data.results
            createMovies(movies, genericSection, { lazyLoad: true, clean: false })
        }
    }
}


async function getPaginatedTrendinMovies() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if (scrollIsBottom && pageIsNotMax) {
        page++
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        })
        const movies = data.results

        createMovies(movies, genericSection, { lazyLoad: true, clean: false })
    }

    /* const btnLoadMore = document.createElement('button')
    btnLoadMore.innerText = 'Cargar Más'
    btnLoadMore.addEventListener('click', getPaginatedTrendinMovies)
    genericSection.appendChild(btnLoadMore) */
}

async function getTrendinMovies() {
    const { data } = await api('trending/movie/day')
    const movies = data.results
    maxPage = data.total_pages

    createMovies(movies, genericSection, { lazyLoad: true, clean: true })

    /* const btnLoadMore = document.createElement('button')
    btnLoadMore.innerText = 'Cargar Más'
    btnLoadMore.addEventListener('click', getPaginatedTrendinMovies)
    genericSection.appendChild(btnLoadMore) */
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`)

    const relatedMovies = data.results

    createMovies(relatedMovies, relatedMoviesContainer)

}

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`)

    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%),
        url(${movieImgUrl})
    `
    headerSection

    movieDetailTitle.innerHTML = movie.title
    movieDetailDescription.innerHTML = movie.overview
    movieDetailScore.innerHTML = movie.vote_average

    createCategories(movie.genres, movieDetailCategoriesList)
    getRelatedMoviesId(id)
}

function getLikedMovies() {
    const likedMovies = likedMoviesList()
    const moviesArray = Object.values(likedMovies)

    createMovies(moviesArray, likedMoviesListArticle, { lazyload: true, clean: true })
}
