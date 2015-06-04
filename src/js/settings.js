$(document).ready(function() {
    var import_data = '';

    function openFile(file) {
        var extension = file.name.match(/\.[0-9a-z]+$/i);

        if (extension[0] !== '.json') {
            $.display.toastError("Import file must be a '.json' file extension!");
            import_data = '';
            $('#importPath').val('');
            if (!$('btnImport').hasClass('disabled')) $('#btnImport').addClass('disabled');
            return;
        }

        $('#btnImport').removeClass('disabled');

        var reader = new FileReader();

        reader.onload = function(event) {
            import_data = event.target.result;
        };

        reader.readAsText(file);
    }

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
            download(json, "Etsy_Inventory_Data.json", "application/json");
        });
    });

    $('#btnImport').on('click', function() {
        console.log(import_data);
    });

    $("#importFile").change(function() {
        openFile(this.files[0]);
    });
});