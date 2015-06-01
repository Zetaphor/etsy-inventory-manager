$(document).ready(function() {
    $('#shop_name').val($.etsyApp.settings.shopName);

    $('#btnSaveSettings').on('click', function() {
        $.etsyApp.settings.shopName = $('#shop_name').val();
        $.etsyApp.saveSettings();
        $('#modalSettings').closeModal();
        $.display.toastSuccess('Settings saved successfully');
    });

    $('#btnDeleteDatabase').on('click', function() {
        $('#modalDeleteDatabase').openModal();
    });

    $('#chkEnableAutoUpdate').change(function() {
        if($(this).is(":checked")) {
            $('.auto-update').prop('disabled', false);
        } else {
            $('.auto-update').prop('disabled', true);
        }
    });

    $('#chkEnableStartUpdate').change(function() {
        if($(this).is(":checked")) {
            $('.start-update').prop('disabled', false);
        } else {
            $('.start-update').prop('disabled', true);
        }
    });
});