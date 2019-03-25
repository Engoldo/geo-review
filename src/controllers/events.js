let popup = require('./popup');
let objects = require('./objects');

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

    modalDnD: function(target) {
        target.onmousedown = e => {
            let {left, top} = target.getBoundingClientRect();
            let offsetLeft = e.pageX - left;
            let offsetTop = e.pageY - top;
    
            function move(e) {
                target.style.left = `${e.pageX - offsetLeft}px`;
                target.style.top = `${e.pageY - offsetTop}px`;
            }
    
            wrapper.onmousemove = e => {
                move(e);
            };
    
            target.onmouseup = () => {
                target.onmouseup = null;
                wrapper.onmousemove = null;
            };
        };
    },

    click: function() {
        
        ymaps.map.events.add('click', e => {
            this.mapClick(e);
        });

        ymaps.map.geoObjects.events.add('click', e => {
            this.geoClick(e); 
        });
    
        document.body.addEventListener('click', e => {
            e.preventDefault();

            if(e.target.closest('.popup__header')) {
                this.modalDnD(e);
            }

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