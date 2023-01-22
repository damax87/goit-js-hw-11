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

   searchImageService.query = e.currentTarget.elements.query.value;
   searchImageService.fetchArticles();
}

function onLoadMore() {
    searchImageService.fetchArticles();
}