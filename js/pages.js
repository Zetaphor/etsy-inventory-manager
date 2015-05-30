$(document).ready(function() {
    // Init Materialize components
    $(".dropdown-button").dropdown();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal-trigger').leanModal();

    $('#shop_name').val($.etsyAPI.storeName);

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

    $('#refreshRecent').on('click', function() {
        $.display.toastInfo('Refreshing recent listings...');
        $('#syncIcon').show();
        $('#lastUpdatedText').html('Refreshing Recent Listings');
        $.etsyAPIHelper.getRecentListings();
    });

    $('#refreshAll').on('click', function() {
        $.display.toastInfo('Refreshing all listings...');
        $('#syncIcon').show();
        $('#lastUpdatedText').html('Refreshing All Listings');
        $.etsyAPIHelper.getAllListings();
    });

    $('#btnSaveSettings').on('click', function() {
        $.etsyAPI.storeName = $('#shop_name').val();
        $.etsyApp.saveSettings();
        $('#modalSettings').closeModal();
        $.display.toastSuccess('Settings saved successfully');
    });

    $('#btnDeleteDatabase').on('click', function() {
        $('#modalDeleteDatabase').openModal();
    });
});