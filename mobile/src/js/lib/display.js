$(document).ready(function() {
    $.display = {
        pageSpeed: 300,
        loadingTime: 500,
        page: {}, // Container for all page function objects

        switchPage: function(page) {
            $('.page').not(page).css('Index', 0);
            $(page).css('Index', 10);

            $(page).show();
            var pageName = page.split('page')[1].toLowerCase();
            console.log(pageName);

            $.display.page[pageName].load();

            $('.page').not(page).css({
                left: '-200vw'
            }).hide();

            $(page).css({
                left: '0'
            }).show();
        },

        toggleLoadingScreen: function() {
            $('#loadingOverlay').show();
            setTimeout(function() {
                $('#loadingOverlay').fadeOut('slow', function() {
                    $(this).hide();
                });
            }, $.display.loadingTime);
        },

        toastSuccess: function(message) {
            Materialize.toast('<i class="mdi-action-thumb-up small left"></i> ' + message, 4000, 'success');
        },

        toastInfo: function(message) {
            Materialize.toast('<i class="mdi-action-info small left"></i> ' + message, 4000, 'info');
        },

        toastError: function(message) {
            Materialize.toast('<i class="mdi-alert-warning small left"></i> ' + message, 4000, 'error');
        }
    };
});