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

  searchImages(searchQuery, currentPage)
    .then(data => {
      if (data.data.hits.length === 0) {
        notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else {
        refs.gallery.innerHTML = createMarkup(data.data.hits);
        refs.loadMoreBtn.style.display = 'block';
        refs.loadMoreBtn.addEventListener('click', handleLoadMore);
        console.log(data);
      }
    })
    .catch(error => {
      console.log(error);
    });
});

function handleLoadMore() {
  if (currentPage < Math.floor(500 / 40)) {
    // if (500 - currentPage * 40 > 40) {
    currentPage += 1;
    refs.loadMoreBtn.disabled = true;
    searchImages(currentQuery, currentPage)
      .then(data => {
        refs.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkup(data.data.hits)
        );
        refs.loadMoreBtn.disabled = false;
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.style.display = 'none';
  }
}

// function handleLoadMore() {
//   currentPage += 1;
//   refs.loadMoreBtn.disabled = true;
//   searchImages(currentQuery, currentPage)
//     .then(data => {
//       refs.gallery.insertAdjacentHTML(
//         'beforeend',
//         createMarkup(data.data.hits)
//       );
//       refs.loadMoreBtn.disabled = false;
//       if (currentPage >= 500) {
//         notiflix.Notify.warning(
//           "We're sorry, but you've reached the end of search results."
//         );
//         refs.loadMoreBtn.style.display = 'none';
//         return;
//       }
//     })

//     .catch(error => {
//       console.log(error);
//     });
// }

function searchImages(query, page) {
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

  return axios.get(`${BASE_URL}/?${params}`);
}

// function searchImages(query, page) {
//   const BASE_URL = 'https://pixabay.com/api';
//   const API_KEY = '40879465-06aabe94cbc0a82e6b53565eb';
//   let perPage = 4;
//   if (10 - page * 4 < 4) {
//     perPage = 10 - page * 4;
//   }

//   let params = new URLSearchParams({
//     key: API_KEY,
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page,
//     per_page: perPage,
//   });

//   return axios.get(`${BASE_URL}/?${params}`);
// }

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

// async function searchImages(query, page) {
//   const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

// try {
//   const response = await fetch(url);
//   const data = await response.json();

//   if (data.hits.length === 0) {
//     notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     return;
//   }

//     data.hits.forEach(image => {
//       const card = createImageCard(image);
//       gallery.appendChild(card);
//     });

// if (page < Math.ceil(data.totalHits / 40)) {
//   loadMoreBtn.style.display = 'block';
// } else {
//   notiflix.Notify.warning(
//     "We're sorry, but you've reached the end of search results."
//   );
//   loadMoreBtn.style.display = 'none';
// }
//   } catch (error) {
//     console.error('Error fetching images:', error);
//     notiflix.Notify.failure(
//       'An error occurred while fetching images. Please try again.'
//     );
//   }
// }

// function createImageCard(image) {
//   const card = document.createElement('div');
//   card.classList.add('photo-card');

//   const img = document.createElement('img');
//   img.src = image.webformatURL;
//   img.alt = image.tags;
//   img.loading = 'lazy';

//   const info = document.createElement('div');
//   info.classList.add('info');

//   const likes = createInfoItem('Likes', image.likes);
//   const views = createInfoItem('Views', image.views);
//   const comments = createInfoItem('Comments', image.comments);
//   const downloads = createInfoItem('Downloads', image.downloads);

//   info.appendChild(likes);
//   info.appendChild(views);
//   info.appendChild(comments);
//   info.appendChild(downloads);

//   card.appendChild(img);
//   card.appendChild(info);

//   return card;
// }

// function createInfoItem(label, value) {
//   const item = document.createElement('p');
//   item.classList.add('info-item');
//   item.innerHTML = `<b>${label}:</b> ${value}`;
//   return item;
// }
