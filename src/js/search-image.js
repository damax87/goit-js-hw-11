export default class SearchImageService {
    constructor() {
        this.searchQuery = '';
    }

    fetchArticles() {
        console.log(this);
        const url = `https://pixabay.com/api/?key=33041546-26ac1afd8f063f5e8fcd45f42&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`;

        fetch(url)
        .then(r => r.json())
        .then(console.log);
    }

    get query() {
        return this.searchQuery;
    }
    
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

