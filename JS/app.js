let map;
let markers = [];

initMap();

function initMap() {
    map = L.map('map').setView([36.7213, -4.4215], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const examInfo = document.createElement('div');
    examInfo.id = 'examInfo';
    examInfo.textContent = 'Examen DIW - MARZO-24 Iker Roca';
    document.body.appendChild(examInfo);

    let lastClickedItem = null; // Mantener un registro de la última parada clicada

    fetch('./datos/paradas.json')
        .then(response => response.json())
        .then(taxiStops => {
            taxiStops.features.forEach(stop => {
                const coordinates = stop.geometry.coordinates;
                const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
                markers.push(marker);

                const listItem = document.createElement('li');
                listItem.textContent = `${stop.properties.NOMBRE} - ${stop.properties.DIRECCION}`;
                document.getElementById('taxiList').appendChild(listItem);

                listItem.addEventListener('click', () => {
                    map.setView(marker.getLatLng(), 18);

                    // Verificar si ya se hizo clic en esta parada
                    if (lastClickedItem !== listItem) {
                        // Mostrar botones solo si es la primera vez
                        const buttonContainer = document.createElement('div');
                        buttonContainer.classList.add('button-container');

                        const accessibleButton = document.createElement('button');
                        accessibleButton.classList.add('button');
                        accessibleButton.textContent = 'Accesible';
                        buttonContainer.appendChild(accessibleButton);

                        const infoButton = document.createElement('button');
                        infoButton.classList.add('button');
                        infoButton.textContent = 'Más información';
                        buttonContainer.appendChild(infoButton);

                        listItem.appendChild(buttonContainer);

                        // Ocultar botones en otras paradas
                        if (lastClickedItem) {
                            lastClickedItem.querySelector('.button-container').style.display = 'none';
                        }

                        // Actualizar el registro de la última parada clicada
                        lastClickedItem = listItem;
                    } else {
                        // Si ya se hizo clic en esta parada, ocultar los botones
                        listItem.querySelector('.button-container').style.display = 'none';
                        lastClickedItem = null;
                    }

                    // Mostrar el popup en el marcador
                    marker.bindPopup(`<b>${stop.properties.NOMBRE}</b><br>${stop.properties.DIRECCION}`).openPopup();
                });
            });
        })
        .catch(error => console.error('Error loading data:', error));
}
