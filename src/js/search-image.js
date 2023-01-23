export default class SearchImageService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchHits() {
        const url = `https://pixabay.com/api/?key=33041546-26ac1afd8f063f5e8fcd45f42&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

       return await fetch(url)
        .then(async responce => {
            if(!responce.ok) {
                if(responce.status === 404) {
                    return [];
                }
                throw new Error(responce.status);
            }
            return await responce.json();    
            })
            .then(data => {
       
                this.incrementPage();
    
                return data.hits;
            })
            .catch(error => {
                console.error(error);
            });
        }
            

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

