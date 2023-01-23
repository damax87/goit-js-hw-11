import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import SearchImageService from './search-image';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

const searchImageService = new SearchImageService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();

   searchImageService.query = document.querySelector('[name="searchQuery"]').value.trim();
   searchImageService.resetPage();
   searchImageService.fetchHits().then(hits => {
    if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        clearGallery();
        appendHitsMarkup(hits);
        
        Notiflix.Notify.success(
          `Hooray! We found ${hits.length} images.`
        )};
   
    
   
   });
}

function onLoadMore() {
    searchImageService.fetchHits().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
    const murkup = hits.map(hit => {
        return `<div class="photo-card">
        <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${hit.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${hit.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${hit.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${hit.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join('');
    refs.gallery.innerHTML += murkup;
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}