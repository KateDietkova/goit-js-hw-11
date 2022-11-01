import { galleryMarkup } from './galleryMarkup';
import { getImages, FAILURE_MESSAGE } from './getImages';
import { smoothScroll } from './smoothScrolling';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

let page = 1;
let totalHits = 0;
let lightBox;
let searchImagesEncoded;

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
  hideLoadMore();

  totalHits = 0;
  page = 1;
  searchImagesEncoded = '';
  const searchImages = refs.input.value.trim();
  if (searchImages === '') {
    Notiflix.Notify.failure(FAILURE_MESSAGE);
    return;
  }
  searchImagesEncoded = searchImages.replace(' ', '+');
  newSearchImages(searchImagesEncoded, page);
}

async function onLoadMore() {
  page += 1;
  hideLoadMore();
  await renderGallery(searchImagesEncoded, page);
  smoothScroll();
  activeLoadMore();
}

async function renderGallery(searchImagesEncoded, page) {
  try {
    const imagesInfo = await getImages(searchImagesEncoded, page);
    totalHits = imagesInfo.totalHits;
    if (totalHits === 0) {
      Notiflix.Notify.failure(FAILURE_MESSAGE);
      return;
    }
    addGalleryMarkup(imagesInfo);
    activeLoadMore();
    lightBox = new SimpleLightbox('.photo-card a', { captionDelay: 250 });
    lightBox.refresh();
  } catch (error) {
    hideLoadMore();
  }
}

async function newSearchImages(searchImagesEncoded, page) {
  const searchImages = await renderGallery(searchImagesEncoded, page);
  if (totalHits === 0) {
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
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

function hideLoadMore() {
  if (!refs.loadMoreBtn.classList.contains('is-hidden')) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  return;
}
