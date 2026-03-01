// skrypty/gra.js

// Pobranie elementów HTML
const plotno = document.getElementById('plotno-gry');
const kontekst = plotno.getContext('2d');
const ekranStartowy = document.getElementById('ekran-startowy');
const ekranKoncowy = document.getElementById('ekran-koncowy');
const interfejsGry = document.getElementById('interfejs-gry');
const przyciskStart = document.getElementById('przycisk-start');
const przyciskRestart = document.getElementById('przycisk-restart');
const wyswietlaczWyniku = document.getElementById('obecny-wynik');
const wyswietlaczWykonyKoncowy = document.getElementById('koncowy-wynik');
const kontenerGry = document.getElementById('kontener-gry');

// Ustawienia początkowe płótna
function dopasujRozmiarPlotna() {
    plotno.width = kontenerGry.clientWidth;
    plotno.height = kontenerGry.clientHeight;
}
globalThis.addEventListener('resize', dopasujRozmiarPlotna);
dopasujRozmiarPlotna();

// Zmienne gry
let idGry;
let czyGraTrwa = false;
let wynik = 0;
let klatki = 0;
let predkoscGry = 3;

// Obiekt gracza (Statek)
const gracz = {
    szerokosc: 40,
    wysokosc: 40,
    x: plotno.width / 2 - 20,
    y: plotno.height - 70,
    predkosc: 7,
    poruszanieWLewo: false,
    poruszanieWPrawo: false,
    kolor: '#00d2ff'
};

// Tablica na spadające przeszkody (Asteroidy)
let przeszkody = [];

// Nasłuchiwanie klawiatury
document.addEventListener('keydown', function(zdarzenie) {
    if (zdarzenie.key === 'ArrowLeft') gracz.poruszanieWLewo = true;
    if (zdarzenie.key === 'ArrowRight') gracz.poruszanieWPrawo = true;
});

document.addEventListener('keyup', function(zdarzenie) {
    if (zdarzenie.key === 'ArrowLeft') gracz.poruszanieWLewo = false;
    if (zdarzenie.key === 'ArrowRight') gracz.poruszanieWPrawo = false;
});

// Nasłuchiwanie dotyku/kliknięcia (dla telefonów i wygody)
kontenerGry.addEventListener('mousedown', obsluzDotyk);
kontenerGry.addEventListener('touchstart', obsluzDotyk, {passive: false});

function obsluzDotyk(zdarzenie) {
    if (!czyGraTrwa) return;
    
    // Pobierz pozycję kliknięcia względem kontenera
    let pozycjaX;
    if (zdarzenie.type === 'touchstart') {
        pozycjaX = zdarzenie.touches[0].clientX - kontenerGry.getBoundingClientRect().left;
    } else {
        pozycjaX = zdarzenie.clientX - kontenerGry.getBoundingClientRect().left;
    }

    // Przesuń gracza w stronę kliknięcia
    if (pozycjaX < plotno.width / 2) {
        gracz.poruszanieWLewo = true;
        setTimeout(() => gracz.poruszanieWLewo = false, 150);
    } else {
        gracz.poruszanieWPrawo = true;
        setTimeout(() => gracz.poruszanieWPrawo = false, 150);
    }
}

// Funkcja rysująca gracza
function rysujGracza() {
    kontekst.fillStyle = gracz.kolor;
    kontekst.beginPath();
    // Prosty kształt trójkąta jako statek
    kontekst.moveTo(gracz.x + gracz.szerokosc / 2, gracz.y);
    kontekst.lineTo(gracz.x + gracz.szerokosc, gracz.y + gracz.wysokosc);
    kontekst.lineTo(gracz.x, gracz.y + gracz.wysokosc);
    kontekst.closePath();
    kontekst.fill();
}

// Funkcja tworząca nowe przeszkody
function stworzPrzeszkode() {
    const wielkosc = Math.random() * 30 + 20; // Losowa wielkość od 20 do 50
    const pozycjaX = Math.random() * (plotno.width - wielkosc);
    
    przeszkody.push({
        x: pozycjaX,
        y: -wielkosc,
        szerokosc: wielkosc,
        wysokosc: wielkosc,
        kolor: '#ff4b4b'
    });
}

// Funkcja rysująca i aktualizująca przeszkody
function obslugaPrzeszkod() {
    for (let i = 0; i < przeszkody.length; i++) {
        const p = przeszkody[i];
        p.y += predkoscGry;

        kontekst.fillStyle = p.kolor;
        kontekst.fillRect(p.x, p.y, p.szerokosc, p.wysokosc);

        // Wykrywanie kolizji
        if (
            gracz.x < p.x + p.szerokosc &&
            gracz.x + gracz.szerokosc > p.x &&
            gracz.y < p.y + p.wysokosc &&
            gracz.y + gracz.wysokosc > p.y
        ) {
            zakonczGre();
        }

        // Usuwanie przeszkód, które wyleciały poza ekran i dodawanie punktów
        if (p.y > plotno.height) {
            przeszkody.splice(i, 1);
            wynik += 10;
            aktualizujWyswietlaczWyniku();
            i--;
        }
    }

    // Częstotliwość pojawiania się przeszkód rośnie z czasem
    const czestotliwosc = Math.max(20, 60 - Math.floor(klatki / 100));
    if (klatki % czestotliwosc === 0) {
        stworzPrzeszkode();
    }
}

function aktualizujWyswietlaczWyniku() {
    wyswietlaczWyniku.innerText = wynik;
    // Ponownie upewniamy się, że element DOM jest poprawnie zaktualizowany
    document.getElementById('obecny-wynik').innerText = wynik;
}

// Główna pętla gry
function petlaGry() {
    if (!czyGraTrwa) return;

    // Czyszczenie płótna
    kontekst.clearRect(0, 0, plotno.width, plotno.height);

    // Ruch gracza z blokadą wyjścia poza ekran
    if (gracz.poruszanieWLewo && gracz.x > 0) {
        gracz.x -= gracz.predkosc;
    }
    if (gracz.poruszanieWPrawo && gracz.x + gracz.szerokosc < plotno.width) {
        gracz.x += gracz.predkosc;
    }

    rysujGracza();
    obslugaPrzeszkod();

    // Zwiększanie poziomu trudności (prędkości spadania) co jakiś czas
    if (klatki % 300 === 0) {
        predkoscGry += 0.5;
    }

    klatki++;
    idGry = requestAnimationFrame(petlaGry);
}

// Zarządzanie stanami gry
function rozpocznijGre() {
    dopasujRozmiarPlotna();
    gracz.x = plotno.width / 2 - gracz.szerokosc / 2;
    gracz.y = plotno.height - 70;
    przeszkody = [];
    wynik = 0;
    klatki = 0;
    predkoscGry = 3;
    czyGraTrwa = true;
    aktualizujWyswietlaczWyniku();

    ekranStartowy.classList.remove('widoczny');
    ekranStartowy.classList.add('ukryty');
    ekranKoncowy.classList.remove('widoczny');
    ekranKoncowy.classList.add('ukryty');
    interfejsGry.classList.remove('ukryty');

    petlaGry();
}

function zakonczGre() {
    czyGraTrwa = false;
    cancelAnimationFrame(idGry);
    
    interfejsGry.classList.add('ukryty');
    ekranKoncowy.classList.remove('ukryty');
    ekranKoncowy.classList.add('widoczny');
    wyswietlaczWykonyKoncowy.innerText = wynik;
}

// Podpięcie przycisków
przyciskStart.addEventListener('click', rozpocznijGre);
przyciskRestart.addEventListener('click', rozpocznijGre);
