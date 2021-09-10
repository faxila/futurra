$(function(){
    
    $('.navbar__burger').on('click', function(){
       $('.navbar__inner').toggleClass('navbar__inner--active');
    });

    Tu.tScroll({
      't-element': '.t-default',
      't-animate': 'zoomOut'
    })

    $('.slideshow__inner').slick({
        arrows: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [
            {
              breakpoint: 1201,
              settings: {
                variableWidth: true,
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },
          ]
    });

})