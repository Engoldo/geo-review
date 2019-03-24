import './stylesheets/style.css';
import './stylesheets/popup.css';
let map = require('./controllers/map');
let events = require('./controllers/events');

ymaps.ready(() => {
    map.mapInit().then(() => {
        let hideWaitingForMap = document.getElementById("map-id__text");
        hideWaitingForMap.style.display = 'none';
        events.click();
    });
});