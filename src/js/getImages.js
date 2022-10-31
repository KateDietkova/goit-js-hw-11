import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

export const BASE_URL = 'https://pixabay.com/api/';
export const KEY = '30924937-b89bb4702c2359d017495e0f8';
export const INFO_MESSAGE =
  "We're sorry, but you've reached the end of search results.";
export const FAILURE_MESSAGE =
  'Sorry, there are no images matching your search query. Please try again.';
export const perPage = 40;

export async function getImages(searchImagesEncoded, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${searchImagesEncoded}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    const imagesInfo = response.data;

    if (imagesInfo.hits.length === 0 && imagesInfo.totalHits > 0) {
      throw new Error();
    }
    if (imagesInfo.hits.length === 0) {
      Notiflix.Notify.failure(FAILURE_MESSAGE);
      return;
    }

    return imagesInfo;
  } catch (error) {
    Notiflix.Notify.info(INFO_MESSAGE);
  }
}
