import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from './load-more-btn';
import SearchImageService from './search-image';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
}

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,    
});
const searchImageService = new SearchImageService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
   e.preventDefault();
   fetchImages();

//    const { height: cardHeight } = document
//    .querySelector(".gallery")
//    .firstElementChild.getBoundingClientRect();

//    window.scrollBy({
//    top: cardHeight * 2,
//     behavior: "smooth",
// });   

   searchImageService.query = document.querySelector('[name="searchQuery"]').value.trim();
   searchImageService.resetPage();
   searchImageService.fetchHits().then(hits => {
    if (hits.length === 0) {
        
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.hide();
        clearGallery();
      } 

      else {
        clearGallery(); 
        appendHitsMarkup(hits);    
        gallerySimpleLightbox.refresh(); 
        };  
   });
   loadMoreBtn.show();
}


function fetchImages() {
    loadMoreBtn.disabled();
    searchImageService.fetchHits().then(hits => {
    appendHitsMarkup(hits);
    loadMoreBtn.enable();
    });
}

function appendHitsMarkup(images) {
    const murkup = images.map(image => {
        return `<div class="photo-card">
        <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${image.downloads}</b>
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