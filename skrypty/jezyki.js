// skrypty/jezyki.js

const slownik = {
    'pl': {
        tytulGry: "Kosmiczny Unik",
        instrukcja: "Użyj strzałek Lewo/Prawo lub klikaj po bokach ekranu, aby unikać przeszkód!",
        przyciskStart: "Graj",
        napisKoniec: "Koniec Gry!",
        etykietaWynikKoncowy: "Twój wynik:",
        przyciskRestart: "Zagraj ponownie",
        etykietaWynikGry: "Wynik: "
    },
    'gb': {
        tytulGry: "Space Dodge",
        instrukcja: "Use Left/Right arrows or tap the sides of the screen to dodge obstacles!",
        przyciskStart: "Play",
        napisKoniec: "Game Over!",
        etykietaWynikKoncowy: "Your score:",
        przyciskRestart: "Play Again",
        etykietaWynikGry: "Score: "
    }
};

let aktualnyJezyk = 'pl';

function zmienJezyk() {
    aktualnyJezyk = aktualnyJezyk === 'pl' ? 'gb' : 'pl';
    aktualizujTekstyNaEkranie();
    
    // Aktualizacja przycisku zmiany języka
    const przyciskJezyka = document.getElementById('przycisk-jezyka');
    przyciskJezyka.innerText = aktualnyJezyk === 'pl' ? '🇬🇧 EN' : '🇵🇱 PL';
}

function aktualizujTekstyNaEkranie() {
    const teksty = slownik[aktualnyJezyk];
    
    document.getElementById('tytul-gry').innerText = teksty.tytulGry;
    document.getElementById('instrukcja').innerText = teksty.instrukcja;
    document.getElementById('przycisk-start').innerText = teksty.przyciskStart;
    document.getElementById('napis-koniec').innerText = teksty.napisKoniec;
    document.getElementById('etykieta-wynik-koncowy').innerText = teksty.etykietaWynikKoncowy;
    document.getElementById('przycisk-restart').innerText = teksty.przyciskRestart;
    
    // Specjalna obsługa etykiety wyniku podczas gry, by nie usunąć samego numeru
    const elementWyniku = document.getElementById('etykieta-wynik');
    const obecnyWynik = document.getElementById('obecny-wynik').innerText;
    elementWyniku.innerHTML = `${teksty.etykietaWynikGry} <span id="obecny-wynik">${obecnyWynik}</span>`;
}

// Podpięcie zdarzenia do przycisku
document.getElementById('przycisk-jezyka').addEventListener('click', zmienJezyk);
