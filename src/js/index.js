import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30924937-b89bb4702c2359d017495e0f8';

let page = 1;
const perPage = 40;

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.input'),
  searchBtn: document.querySelector('.search-button'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryBox: document.querySelector('.gallery'),
};

refs.searchBtn.addEventListener('click', onSearchImages);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImages(event) {
  event.preventDefault();
  clearGallery();

  const searchImages = refs.input.value.trim();
  searchImagesEncoded = searchImages.replace(' ', '+');
  renderGallery(searchImagesEncoded, page);
  refs.galleryBox.addEventListener('click', onImgClick);
}

function onLoadMore(event) {
  page += 1;
  renderGallery(searchImagesEncoded, page);
}

function onImgClick(event) {
  event.preventDefault();
}

async function getImages(searchImagesEncoded, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${searchImagesEncoded}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    const imagesInfo = response.data;

    return imagesInfo;
  } catch (error) {
    console.log('Error:', error);
  }
}

async function renderGallery(searchImagesEncoded, page) {
  const imagesInfo = await getImages(searchImagesEncoded, page);
  addGalleryMarkup(imagesInfo);
  activeLoadMore();
  const lightBox = new SimpleLightbox('.photo-card a', { captionDelay: 250 });
}

function galleryMarkup({ hits: images }) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                    <a href="${largeImageURL}">
                        <img class="searchImage" src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </a>
                    <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                    </p>
                </div>
            </div>`;
      }
    )
    .join('');
}

function addGalleryMarkup(imagesInfo) {
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(imagesInfo));
}

function clearGallery() {
  refs.galleryBox.innerHTML = '';
}

function activeLoadMore() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
