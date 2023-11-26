import axios from 'axios';
import notiflix from 'notiflix';

let currentPage = 1;
let currentQuery = '';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value;
  if (!searchQuery) {
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  refs.loadMoreBtn.style.display = 'none';
  refs.gallery.innerHTML = '';

  try {
    const data = await searchImages(searchQuery, currentPage);

    if (data.hits.length === 0) {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      refs.gallery.innerHTML = createMarkup(data.hits);
      refs.loadMoreBtn.style.display = 'block';
      refs.loadMoreBtn.addEventListener('click', handleLoadMore);
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
});

async function handleLoadMore() {
  if (currentPage < Math.floor(500 / 40)) {
    currentPage += 1;
    refs.loadMoreBtn.disabled = true;

    try {
      const data = await searchImages(currentQuery, currentPage);
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      refs.loadMoreBtn.disabled = false;
    } catch (error) {
      console.log(error);
    }
  } else {
    notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.style.display = 'none';
  }
}

async function searchImages(query, page) {
  const BASE_URL = 'https://pixabay.com/api';
  const API_KEY = '40879465-06aabe94cbc0a82e6b53565eb';
  let params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });

  try {
    const response = await axios.get(`${BASE_URL}/?${params}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
