// Cesta k datům a výchozí pohled na ČR
const DATA_URL = 'body.geojson';
const VYCHOZI_STRED = [49.8, 15.5];
const VYCHOZI_ZOOM = 7;

const mapa = L.map('mapa').setView(VYCHOZI_STRED, VYCHOZI_ZOOM);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  subdomains: 'abcd',
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">přispěvatelé OpenStreetMap</a> ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(mapa);

// Ochrana proti vložení HTML z dat
function escapeHtml(text) {
  const el = document.createElement('div');
  el.textContent = text ?? '';
  return el.innerHTML;
}

const seznamEl = document.getElementById('seznam');
const chybaEl = document.getElementById('chyba');
const vrstvyPodleId = new Map();
let aktivniTlacitko = null;

function oznacTlacitko(tlacitko) {
  if (aktivniTlacitko) aktivniTlacitko.removeAttribute('aria-current');
  aktivniTlacitko = tlacitko;
  if (tlacitko) tlacitko.setAttribute('aria-current', 'true');
}

function vyberMesto(id, tlacitko) {
  const vrstva = vrstvyPodleId.get(id);
  if (!vrstva) return;
  mapa.flyTo(vrstva.getLatLng(), 12, { duration: 0.8 });
  vrstva.openPopup();
  oznacTlacitko(tlacitko);
}

function pridejDoSeznamu(props) {
  const li = document.createElement('li');
  const tlacitko = document.createElement('button');
  tlacitko.type = 'button';
  tlacitko.innerHTML = `<strong>${escapeHtml(props.nazev)}</strong><span>${escapeHtml(props.popisek)}</span>`;
  tlacitko.addEventListener('click', () => vyberMesto(props.id, tlacitko));
  li.appendChild(tlacitko);
  seznamEl.appendChild(li);
  return tlacitko;
}

function zobrazChybu(zprava) {
  chybaEl.textContent = zprava;
  chybaEl.hidden = false;
}

async function nactiMesta() {
  let geojson;
  try {
    const odpoved = await fetch(DATA_URL);
    if (!odpoved.ok) throw new Error(`HTTP ${odpoved.status}`);
    geojson = await odpoved.json();
  } catch (err) {
    console.error('Nepodařilo se načíst GeoJSON:', err);
    zobrazChybu(
      'Data se nepodařilo načíst. Pokud jste otevřeli index.html přímo ze souboru, ' +
      'spusťte lokální server (viz readme), prohlížeč totiž blokuje načítání souborů přes file://.'
    );
    return;
  }

  const vrstva = L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: 9,
      weight: 2,
      color: '#14504d',
      fillColor: '#1f6f6b',
      fillOpacity: 0.85
    }),
    onEachFeature: (feature, layer) => {
      const { id, nazev, popisek } = feature.properties;
      vrstvyPodleId.set(id, layer);

      layer.bindPopup(
        `<h2 class="popup-nazev">${escapeHtml(nazev)}</h2>` +
        `<p class="popup-popisek">${escapeHtml(popisek)}</p>`
      );
      layer.bindTooltip(escapeHtml(nazev), { direction: 'top', offset: [0, -8] });

      const tlacitko = pridejDoSeznamu(feature.properties);
      layer.on('click', () => oznacTlacitko(tlacitko));
    }
  }).addTo(mapa);

  if (vrstva.getLayers().length > 0) {
    mapa.fitBounds(vrstva.getBounds(), { padding: [60, 60] });
  }
}

nactiMesta();
