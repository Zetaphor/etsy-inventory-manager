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
            $.etsyApp.settings.autoUpdateEnabled = true;
            $.etsyApp.setAutoUpdateTimer();
        } else {
            $('.auto-update').prop('disabled', true);
            $.etsyApp.settings.autoUpdateEnabled = false;
            $.etsyApp.settings.removeAutoUpdateTimer();
        }
    });

    $('#chkEnableStartUpdate').change(function() {
        if($(this).is(":checked")) {
            $('.start-update').prop('disabled', false);
            $.etsyApp.settings.updateOnStartEnabled = true;
        } else {
            $('.start-update').prop('disabled', true);
            $.etsyApp.settings.updateOnStartEnabled = false;
        }
    });

    $('#autoUpdateInterval').keyup(function() {
        $.etsyApp.settings.autoUpdateInterval = parseInt($(this).val());
        $.etsyApp.setAutoUpdateTimer();
    });

    $("input[name=autoUpdateType]:radio").change(function () {
        $.etsyApp.settings.autoUpdateType = $(this).val();
        $.etsyApp.setAutoUpdateTimer();
    });

    $("input[name=startUpdateType]:radio").change(function () {
        $.etsyApp.settings.updateOnStartType = $(this).val();
    });
});