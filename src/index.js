import _ from 'lodash';
import './stylesheets/style.css';
import './stylesheets/popup.css';
let map = require('./controllers/map');
let events = require('./controllers/events');

ymaps.ready(() => {
    map.mapInit().then(() => events.click());
});