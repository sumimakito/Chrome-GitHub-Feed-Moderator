function log_(msg) {
    console.log(msg);
}

(function () {
    function restore() {
        chrome.storage.sync.get({
            enabled: true,
            hideAll: false,
            hideDetailedFeed: false,
            hideFork: false,
            hideStar: false,
            hideCreate: false,
            hideFollow: true,
            hideIssues: false
        }, function (items) {
            chrome.browserAction.setIcon({path: items.enabled ? "icon16.png" : "icon_d16.png"});
            $('#enabled').prop('checked', items.enabled);
            $('#hide_all').prop('checked', items.hideAll);
            $('#hide_feed_details').prop('checked', items.hideDetailedFeed);
            $('#hide_fork').prop('checked', items.hideFork);
            $('#hide_star').prop('checked', items.hideStar);
            $('#hide_create').prop('checked', items.hideCreate);
            $('#hide_follow').prop('checked', items.hideFollow);
            $('#hide_issues').prop('checked', items.hideIssues);
            if (items.enabled) {
                $('#detailed_settings').show(300);
                $('#hint').hide(300);
            } else {
                $('#detailed_settings').hide(300);
                $('#hint').show(300);
            }
            if (!items.hideAll) {
                $('#hide_feed_details_container').show(300);
                $('#more_detailed_settings').show(300);
            } else {
                $('#hide_feed_details_container').hide(300);
                $('#more_detailed_settings').hide(300);
            }
        });
    }

    function save() {
        chrome.storage.sync.set({
            enabled: $('#enabled').prop('checked'),
            hideAll: $('#hide_all').prop('checked'),
            hideDetailedFeed: $('#hide_feed_details').prop('checked'),
            hideFork: $('#hide_fork').prop('checked'),
            hideStar: $('#hide_star').prop('checked'),
            hideCreate: $('#hide_create').prop('checked'),
            hideFollow: $('#hide_follow').prop('checked'),
            hideIssues: $('#hide_issues').prop('checked')
        }, function () {
            $.notify("Settings has been saved.", {
                type: "success",
                allow_dismiss: false,
                delay: 2000
            });
            restore();
        });
    }

    $('input').change(function () {
        save();
    });

    restore();
})();