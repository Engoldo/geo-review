let popup = require('./popup');
let map = require('./map');

module.exports = {

    currentCoordinates: null,

    openPopup: data => {
        map.geoCode(data.coordinates)
            .then(address => {
                data.address = address;
                popup.open();
            });
    },

    closePopup: () => {
        popup.close();
    },

    addPlacemark: () => {
        let data = popup.getData();

        if (data) {
            data.coordinates = this.currentCoordinates;
            map.createPlacemark(data);
            popup.appendReview(data);
        }
    },

    mapClick: e => {

        map.makeMap.balloon.close();

        map.geoCode(e.get('coordinates'))
            .then(address => {
                popup.open({
                    type: 'map',
                    position: e.get('position'),
                    address: address
                });    
            });

        this.currentCoordinates = e.get('coordinates');
    },

    geoClick: e => {

        let target = e.get('target');

        if (!target.properties.get('geoObjects', null)) {
            map.makeMap.balloon.close();

            popup.open({
                type: 'placemark',
                target: target,
                position: e.get('position'),
                coordinates: target.geometry.getCoordinates(),
                reviews: [target.properties.get(0)],
                address: target.properties.get(0).address
            });
        } else {
            popup.close();
        }
    },

    linkClick: e => {
        let objectReview = map.objectReview;
        let currentCoordinates = e.target.dataset.coordinates;
        let currentReviews = [];
        let coordinates;

        objectReview.forEach(review => {
            coordinates = review.coordinates.join();

            if (currentCoordinates === coordinates) {
                currentReviews.push(review);
            }
        });

        map.makeMap.balloon.close();

        popup.open({
            position: [e.clientX, e.clientY],
            address: currentCoordinates[0].address,
            reviews: currentReviews
        });
    },

    click: () => {
        map.makeMap.events.add('click', e => {
            this.mapClick(e);
        });

        map.makeMap.geoObjects.events.add('click', e => {
            this.geoClick(e);
        });

        document.body.addEventListener('click', e => {
            console.log('click')
            e.preventDefault();

            if (e.target.closest('.header__close')) {

                this.closePopup();
            } else if (e.target.closest('.footer__button')) {

                this.addPlacemark();
            } else if (e.target.closest('.placelink')) {

                this.linkClick(e);
            }
        });
    }

};