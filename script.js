const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    const lerpSpeed = 0.08;
    glowX += (mouseX - glowX) * lerpSpeed;
    glowY += (mouseY - glowY) * lerpSpeed;
    
    cursorGlow.style.transform = `translate(${glowX - 225}px, ${glowY - 225}px)`;
    
    requestAnimationFrame(animateGlow);
}

animateGlow();

const magnetics = document.querySelectorAll('.magnetic');

magnetics.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
    });
});

const movieGrid = document.getElementById('movieGrid');
const searchBar = document.querySelector('.search-bar');
const sectionTitle = document.querySelector('.section-title h2');

const API_KEY = '5538e29d1c8ecf2a44748c8eed5d9845';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const fallbackMoviesData = [
    { title: "Dune: Part Two", release_date: "2024", vote_average: 8.8, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop" },
    { title: "Oppenheimer", release_date: "2023", vote_average: 8.4, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=800&auto=format&fit=crop" },
    { title: "Interstellar", release_date: "2014", vote_average: 8.6, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800&auto=format&fit=crop" },
    { title: "Blade Runner 2049", release_date: "2017", vote_average: 8.0, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop" },
    { title: "The Dark Knight", release_date: "2008", vote_average: 9.0, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800&auto=format&fit=crop" },
    { title: "Inception", release_date: "2010", vote_average: 8.8, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop" },
    { title: "Avatar: The Way of Water", release_date: "2022", vote_average: 7.6, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop" },
    { title: "The Matrix", release_date: "1999", vote_average: 8.7, poster_path: null, fallback_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop" }
];

async function fetchMovies(url) {
    if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        renderMovies(fallbackMoviesData);
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            renderMovies(data.results);
        } else {
            renderMovies(fallbackMoviesData);
        }
    } catch (error) {
        console.error(error);
        renderMovies(fallbackMoviesData);
    }
}

function renderMovies(movies) {
    movieGrid.innerHTML = '';

    movies.slice(0, 12).forEach((movie, index) => {
        const title = movie.title || movie.name || "Unknown";
        const year = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";
        const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : "NR";
        
        let imageUrl = movie.fallback_image; 
        if (movie.poster_path) {
            imageUrl = `${IMAGE_BASE_URL}${movie.poster_path}`;
        } else if (!imageUrl) {
            imageUrl = `https://via.placeholder.com/500x750/050508/7c3aed?text=${encodeURIComponent(title)}`;
        }

        const delay = index * 0.1; 
        
        const cardHTML = `
            <div class="movie-card" style="animation-delay: ${delay}s">
                <div class="movie-poster-wrap">
                    <img src="${imageUrl}" alt="${title} poster" class="movie-poster">
                </div>
                <div class="movie-overlay">
                    <h3 class="movie-title">${title}</h3>
                    <div class="movie-meta">
                        <span class="year">${year}</span>
                        <span class="rating">★ ${rating}</span>
                    </div>
                </div>
            </div>
        `;
        movieGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    attachCardInteractions();
}

function attachCardInteractions() {
    const cards = document.querySelectorAll('.movie-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const maxTilt = 12;
            const rotateX = ((y - centerY) / centerY) * -maxTilt; 
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            sectionTitle.innerText = `Search Results: "${query}"`;
            fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        } else {
            sectionTitle.innerText = 'Trending Now';
            fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        }
    }
});

fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);