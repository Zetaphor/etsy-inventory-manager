$(document).ready(function() {
    // Init Materialize components
    $('.button-collapse').sideNav({
            //menuWidth: 300, // Default is 240
            //edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );

    // Hide all pages but the dashboard
    $('.page').not('#pageDashboard').hide().css({left: '-200vw'});

    // Switch pages on nav-link clicks
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        $('.nav-link').not($(this)).parent().removeClass('active');
        $(this).parent().addClass('active');
        var page = $(this).attr('href');
        $.display.toggleLoadingScreen();
        $.display.switchPage(page);
    });
});