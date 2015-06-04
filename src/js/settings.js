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
            if ($.etsyApp.settings.autoUpdateInterval >= $.etsyApp.settings.autoUpdateMinInterval) {
                $.etsyApp.setAutoUpdateTimer();
            } else {
                $.display.toastError('Auto-update interval must be at least ' + $.etsyApp.settings.autoUpdateMinInterval +' minutes!');
                $.etsyApp.removeAutoUpdateTimer();
            }
        } else {
            $('.auto-update').prop('disabled', true);
            $.etsyApp.settings.autoUpdateEnabled = false;
            $.etsyApp.removeAutoUpdateTimer();
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

    $('#autoUpdateInterval').change(function() {
        $.etsyApp.settings.autoUpdateInterval = $(this).val();
        if ($(this).val() >= $.etsyApp.settings.autoUpdateMinInterval) {
            $.etsyApp.settings.autoUpdateInterval = $(this).val();
            if ($.etsyApp.settings.autoUpdateEnabled) $.etsyApp.setAutoUpdateTimer();
        } else {
            $.display.toastError('Auto-update interval must be at least ' + $.etsyApp.settings.autoUpdateMinInterval +' minutes!');
            $.etsyApp.removeAutoUpdateTimer();
        }
    });

    $("input[name=autoUpdateType]:radio").change(function () {
        $.etsyApp.settings.autoUpdateType = $(this).val();
        if ($.etsyApp.settings.autoUpdateEnabled) $.etsyApp.setAutoUpdateTimer();
    });

    $("input[name=startUpdateType]:radio").change(function () {
        $.etsyApp.settings.updateOnStartType = $(this).val();
    });

    $('#btnExportData').on('click', function() {
        $.etsyDB.export().then(function (dbObj) {
            var json = JSON.stringify(dbObj);
            alert (json);
        });
    });
});