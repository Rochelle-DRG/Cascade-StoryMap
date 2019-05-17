$(document)
    .ready(function () {
        // initialize paroller.js and set attributes for selected elements
        //initialize paroller.js
        $('[data-paroller-factor]').paroller();
        //initialize paroller.js and set options for elements with .paroller class
        $('.paroller-example').paroller({
            factorXs: 0.1,
            factorSm: 0.1,
            factorMd: -0.4,
            factorLg: -0.5,
            factorXl: -0.6,
            factor: -0.4,
            type: 'foreground',
            direction: 'horizontal',
            transition: 'transform .3s ease-out'
        });
    });

