let popup = require('../templates/popup.pug');
let reviews = require('../templates/reviews.pug');
let wrapper = document.querySelector('.popup__wrapper');
let empty = true;

module.exports = {
    data: () => {        
        return {
            address: wrapper.querySelector('.header__title'),
            name: wrapper.querySelector('.review__author'),
            place: wrapper.querySelector('.review__place'),
            review: wrapper.querySelector('.review__message')
        };
    },


    getData: callback => {
        let { name, place, address } = this.data();

        if (name.value !== '' && place.value !== '' && review.value !== '') {
            return {
                type: 'data',
                name: name.value,
                place: place.value,
                review: review.value,
                address: address.textContent,
                time: new Date().toLocaleString('ru-RU')
            }
        }

        return false;
    },


    open: data => {
        let { position, address, reviews } = data;

        wrapper.style.position = 'absolute';
        wrapper.style.top = position[1] + 'px';
        wrapper.style.left = position[0] + 'px';
        wrapper.innerHTML = popup({ address: address });

        let reviewContainer = document.querySelector('.review-container');

        if (reviews) {
            reviewContainer.innerHTML = reviews({ reviews: reviews });
        } else {
            reviewContainer.innerHTML = reviews();
        }
    },

    close: () => {
        wrapper.innerHTML = '';
    },

    appendReview: data => {
        let reviewContainer = document.querySelector('.review-container');
        let toHtml = reviews({ reviews: [data] });

        if (!data || empty) {
            reviewContainer.innerHTML = toHtml;
            empty = false;
        } else {
            reviewContainer.innerHTML += toHtml;
        }
    }
};
