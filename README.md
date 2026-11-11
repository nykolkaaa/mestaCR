# Mapa měst ČR (Leaflet)

Jednoduchá webová mapa měst České republiky postavená na knihovně [Leaflet](https://leafletjs.com/). Data o městech jsou uložena v souboru GeoJSON.

## Struktura projektu

| Soubor          | Účel                                                        |
|-----------------|-------------------------------------------------------------|
| `index.html`    | Stránka, načítá Leaflet a ostatní soubory                   |
| `map.js`        | Inicializace mapy, načtení GeoJSONu, popupy a seznam měst   |
| `styl.css`      | Vzhled stránky a bočního panelu                             |
| `body.geojson`  | Data měst (body s atributy `id`, `nazev`, `popisek`)        |
| `README.md`     | Tento návod                                                 |

## Spuštění

Prohlížeče blokují načítání souborů přes `file://`, proto nelze `index.html` jen dvojklikem otevřít – GeoJSON by se nenačetl. Spusťte lokální server ve složce projektu:

```bash
# Python 3
python -m http.server 8000

# nebo Node.js
npx serve
```

Poté otevřete <http://localhost:8000>.

Leaflet se načítá z CDN (unpkg), takže je potřeba připojení k internetu. Podkladové dlaždice pocházejí z OpenStreetMap.

## Jak přidat další město

Do pole `features` v souboru `body.geojson` přidejte nový objekt:

```json
{
  "type": "Feature",
  "properties": {
    "id": 3,
    "nazev": "Brno",
    "popisek": "Druhé největší město ČR, centrum Jihomoravského kraje."
  },
  "geometry": {
    "type": "Point",
    "coordinates": [16.6068, 49.1951]
  }
}
```

Důležité:

- **Pořadí souřadnic v GeoJSONu je `[délka, šířka]`** (longitude, latitude) – tedy opačně, než se obvykle píše v Leafletu (`[lat, lng]`).
- Hodnota `id` musí být unikátní.
- Po uložení stačí stránku obnovit, mapa se přizpůsobí všem bodům automaticky.

## Atributy

| Atribut   | Typ    | Popis                       |
|-----------|--------|-----------------------------|
| `id`      | číslo  | Unikátní identifikátor      |
| `nazev`   | text   | Název města                 |
| `popisek` | text   | Krátký popis zobrazený v popupu a v seznamu |

## Licence a atribuce

- Leaflet: BSD 2-Clause
- Mapové podklady: © přispěvatelé OpenStreetMap (ODbL)
