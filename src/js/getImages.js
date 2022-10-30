import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30924937-b89bb4702c2359d017495e0f8';
const INFO_MESSAGE =
  "We're sorry, but you've reached the end of search results.";
const perPage = 40;

export async function getImages(searchImagesEncoded, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${searchImagesEncoded}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
    );
      const imagesInfo = response.data;
      console.log(response);
      console.log(imagesInfo);
      
    if (imagesInfo.hits.length === 0) {
      throw new Error();
    }

    return imagesInfo;
  } catch (error) {
      Notiflix.Notify.info(INFO_MESSAGE);
  }
}
