module.exports = {

    createPlacemark: data => {
        let { coordinates, address, place, name, review, time } = data;
        let placemark = new ymaps.Placemark(coordinates, 
            {
                coordinates: coordinates,
                place: place,
                name: name,
                review: review,
                time: time,
                address: address,
                balloonContentHeader: place,
                balloonContentBody: `<div class="balloon-content">
                                    <a href="#" class="placelink" data-coordinates="${coordinates.join()}">${place}</a>
                                    <br>${name}: ${review}</div>`,
                balloonContentFooter: `<div class="balloon-footer">${time}</div>` 

            },
            {
                preset: 'islands#redIcon',
                openBaloonOnclick: false
            }    
        );

        let objectReview = ymaps.objectReview || [];
            objectReview.push(data);

        ymaps.objectReview = objectReview;
        ymaps.clusterer.add(placemark);
    },
    
    geoCode: coordinates => {
        return ymaps.geocode(coordinates)
            .then(result => result.geoObjects.get(0).properties.get('name'));
    }
}