import _ from 'lodash';
import './stylesheets/style.css';
import './stylesheets/popup.css';
let map = require('./javascripts/map');
let events = require('./javascripts/events');

ymaps.ready(() => {
    map.mapInit().then(() => events.click());
});