let popup = require('./popup');
let objects = require('./objects');
let wrapper = document.querySelector('.popup__wrapper');

module.exports = {
    currentCoordinates: null,

    openPopup: data => {
        map.objects.geoCode(data.coordinates)
            .then(address => {
                data.address = address;
                popup.open();
            });
    },

    closePopup: () => {
        popup.close();
    },

    addPlacemark: function() {
        let data = popup.getData();
        if (data) {
            data.coordinates = this.currentCoordinates;
            objects.createPlacemark(data);
            popup.appendReview(data);
        }
    },

    mapClick: function(e) {
        ymaps.map.balloon.close();
        
        objects.geoCode(e.get('coords'))
            .then(address => {
                
                popup.open({
                    type: 'map',
                    position: e.get('position'),
                    address: address
                });
        });

        this.currentCoordinates = e.get('coords');
    },

    geoClick: function(e) {
        let target = e.get('target');

        if (!target.properties.get('geoObjects', null)) {
            ymaps.map.balloon.close();

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
        let objectReview = ymaps.objectReview;
        let currentCoordinates = e.target.dataset.coordinates;
        let currentReviews = [];

        objectReview.forEach(review => {
            let coordinates = review.coordinates.join();

            if (currentCoordinates === coordinates) {
                currentReviews.push(review);
            }
        });

        ymaps.map.balloon.close();

        popup.open({
            position: [e.clientX, e.clientY],
            address: currentCoordinates[0].address,
            reviews: currentReviews
        });
    },

    modalDnD: function() {
        let coordX;
        let coordY;

        const popupEl = document.querySelector('.popup__wrapper');
        popupEl.draggable = true;
        popupEl.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/html', 'dragstart');
            coordX = e.offsetX;
            coordY = e.offsetY;
        });

        popupEl.addEventListener('dragend', e => {
            popupEl.style.position = 'absolute';
            popupEl.style.top = (e.pageY - coordY) + 'px';
            popupEl.style.left = (e.pageX - coordX) + 'px';
        });
    },

    click: function() {
        
        ymaps.map.events.add('click', e => {
            this.mapClick(e);
        });

        ymaps.map.geoObjects.events.add('click', e => {
            this.geoClick(e); 
        });

        this.modalDnD();

        document.body.addEventListener('click', e => {
            e.preventDefault();

            if (e.target.closest('.header__close')) {
                this.closePopup();
            }

            if (e.target.closest('.footer__button')) {
                this.addPlacemark();
            }

            if (e.target.closest('.placelink')) {
                this.linkClick(e);
            }            
        });
        
    }

};