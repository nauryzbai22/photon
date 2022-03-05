const auth = "563492ad6f91700001000001641e284b91c146a7ab140b2feaffe0ab";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let inputValue;
let page = 1;
let fetchLink;
let currentValue;

searchInput.addEventListener('input', getInput);
more.addEventListener('click', loadMore);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentValue = inputValue;
    searchPhotos(inputValue);
});

function getInput(e) {
    inputValue = e.target.value;
}

async function fetchApi(url) {
    const server = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    })
    const data  = await server.json();
    return data;
}

function generatePhotos(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add("gallery-img");
        galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large}> 
        `;
        gallery.appendChild(galleryImg);
    })
}

async function getPhotos() {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

async function searchPhotos(query) {
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=16&page=${page}`
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

async function loadMore() {
    page++;
    if (currentValue) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentValue}&per_page=16&page=${page}`
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`;
    }
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

getPhotos();