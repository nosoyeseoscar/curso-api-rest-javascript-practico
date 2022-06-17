let page = 1
let maxPage
let infiniteScroll

searchFormBtn.addEventListener('click', () => {
    console.log("Valor del input", searchFormInput.value);
    location.hash = "#search=" + searchFormInput.value
})

trendingBtn.addEventListener('click', () => {
    location.hash = "#trends"
})

arrowBtn.addEventListener('click', () => {
    history.back();
    //location.hash = "#home"
})

window.addEventListener('DOMContentLoaded', navigatorUrl, false)
window.addEventListener('hashchange', navigatorUrl, false)
window.addEventListener('scroll', infiniteScroll, false)

function homePage() {
    console.log('Home!!');
    console.log(navigation.languaje);

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.remove('inactive')
    likedMoviesSection.classList.remove('inactive')

    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    getTrendinMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}

function categoriesPage() {
    window.scrollTo(0, 0)
    console.log('categories!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=')
    const [categoryId, categoryName] = categoryData.split('-')

    getMoviesByCategory(categoryId);
    headerCategoryTitle.textContent = categoryName

    infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}

function movieDetailsPage() {
    console.log('Movie!!');

    headerSection.classList.add('header-container--long')
    //headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const [_, movieId] = location.hash.split('=')
    getMovieById(movieId)
}

function searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive')
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const [_, query] = location.hash.split('=')
    /* console.log("query: ", query);
    console.log(location.href); */

    getMoviesbySearch(query)

    infiniteScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long')
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive')
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    likedMoviesSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')
    //translate
    headerCategoryTitle.innerHTML = 'Tendencias'

    getTrendinMovies()

    infiniteScroll = getPaginatedTrendinMovies

}


function navigatorUrl() {
    /*     console.log({ location });
     */
    if (infiniteScroll) {
        //console.log("remuevo infiniteScroll: ", infiniteScroll);
        window.removeEventListener('scroll', infiniteScroll, { passive: false })
        infiniteScroll = undefined
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage()
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    }
    else {
        homePage();
        /*  target = document.querySelector("#trendingPreview-movieList")
         console.log("target: ", target) */

        //observer.observe(target)
        //console.log('Home')
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false })
    }
}
