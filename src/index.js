import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { notifyStyle } from './js/notifyStyle';

const lightbox = new SimpleLightbox('.section-gallery a');

let page = 1;
let searchQuery = '';

const fetchImages = async () => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '22737684-faaa64a0ef24c6eb802e7e4c8',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    const { data } = response;
    const images = data.hits;

    if (!searchQuery) {
      Notify.info('Enter data to search!', notifyStyle);

      refs.searchInput.placeholder = 'What`re we looking for?';
      return;
    }

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        notifyStyle
      );
      return;
    }

    if (page === 1) {
      refs.gallery.innerHTML = '';
    }

    const markup = images
      .map(
        image => `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `
      )
      .join('');

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    if (page === 1) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`, notifyStyle);
    }

    if (data.totalHits <= page * 40) {
      refs.btnLoadMore.style.display = 'none';
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        notifyStyle
      );
    } else {
      refs.btnLoadMore.style.display = 'block';
    }

    lightbox.refresh();
    page += 1;

  } catch (error) {
    Notify.failure(
      'Oops! Something went wrong. Please try again later.',
      notifyStyle
    );
  }
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;
  fetchImages();
});

refs.btnLoadMore.addEventListener('click', fetchImages);
