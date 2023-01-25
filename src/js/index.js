
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
   clearGallery();
   loadMoreBtn.hide();
   searchImageService.resetPage();

   searchImageService.query = document.querySelector('[name="searchQuery"]').value.trim();

   if (searchImageService.query !== '') {
        searchImageService.fetchImages().then(data => {
        if (data.hits.length === 0) {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            clearGallery();

          } else if (data.hits.length < 40) {
            loadMoreBtn.hide();
            Notiflix.Notify.success(
                `Hooray! We found ${data.totalHits} images.`
              );
            appendHitsMarkup(data.hits);    
            Notiflix.Notify.success(
                `We're sorry, but you've reached the end of search results.`
              );    
            }
            else {
                appendHitsMarkup(data.hits);
                Notiflix.Notify.success(
                    `Hooray! We found ${data.totalHits} images.`
                  );   
                  loadMoreBtn.show();                
            };
            gallerySimpleLightbox.refresh();
            
       });
       
   
};
    
}


function fetchImages() {
    loadMoreBtn.disabled();
    searchImageService.incrementPage();
    searchImageService.fetchImages().then(data => {

        if (data.hits.length === 0) {
            loadMoreBtn.hide();
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            clearGallery();
          } 

          else if (data.hits.length < 40) {
            loadMoreBtn.hide();
            appendHitsMarkup(data.hits);
            Notiflix.Notify.success(
                `We're sorry, but you've reached the end of search results.`
              );   
            }

          else {
            appendHitsMarkup(data.hits);
            loadMoreBtn.show();
          };
    })
    .catch(error => {
        console.log(error);
    Notiflix.Notify.success(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMoreBtn.hide()});
    loadMoreBtn.enable();
};

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