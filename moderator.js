var scheduled = false;
var MAX_INIT_RETRIES = 64;
var initRetries = 0;
var initDone = false;
var targetContainer;

function log_(msg) {
    //console.log(msg);
}
var OPTIONS = {};

function extractUsername(statusLine) {
    const regex = /[^\s]+/gy;
    var m = regex.exec(statusLine);
    if (m !== null) {
        return m[0];
    } else
        return undefined;
}

function moderate() {
    scheduled = false;
    log_(targetContainer.children.length);

    for (var i = 2; i < targetContainer.children.length; i++) {
        try {
            var child = targetContainer.children[i];
            if (child.tagName !== "DIV") break;
            if (child.className === "tooltip-toggle") break;
            var feedType = child.className;
            var innerBody = child.children[0];
            var innerChild = innerBody.children[0].children[1];
            var statusView = innerChild.children[0];
            var detailedView = innerChild.children[1];

            if (OPTIONS.hideAll) {
                innerBody.parentElement.removeChild(innerBody);
            } else {
                if (OPTIONS.hideDetailedFeed) {
                    detailedView.parentElement.removeChild(detailedView);
                }
                if ((OPTIONS.hideStar && feedType === "watch_started")
                    || (OPTIONS.hideFork && feedType === "fork")
                    || (OPTIONS.hideCreate && feedType === "create")
                    || (OPTIONS.hideFollow && feedType === "follow")
                    || (OPTIONS.hideIssues && (feedType === "issues_closed" || feedType === "issues_opened"))) {
                    innerBody.parentElement.removeChild(innerBody);
                }
                if (OPTIONS.hideUsersS) {
                    if (OPTIONS.hideUsers.indexOf(extractUsername(statusView.innerText)) >= 0) {
                        innerBody.parentElement.removeChild(innerBody);
                    }
                }
            }
        } catch (idontcare) {
            log_(idontcare);
        }
    }

}

function schedule() {
    log_("DOMNode changed, will schedule");
    if (scheduled) return;
    scheduled = true;
    setTimeout(moderate, 50);
}

function init() {
    if (!OPTIONS.enabled) {
        return;
    }
    var el_news = document.getElementsByClassName("news");
    if (el_news === undefined || el_news.length === 0) {
        // abort
        log_("no element w/.news found.");
    } else {
        log_("initialization done.");
        targetContainer = el_news[0];
        targetContainer.addEventListener("DOMNodeInserted", schedule, false);
        document.body.addEventListener("DOMNodeInserted", schedule, false);
        initDone = true;
    }
    if (!initDone) {
        if (initRetries++ < MAX_INIT_RETRIES) {
            setTimeout(init, 1000);
        }
    } else {
        moderate();
    }
}

chrome.storage.sync.get({
    enabled: true,
    hideAll: false,
    hideDetailedFeed: false,
    hideFork: false,
    hideStar: false,
    hideCreate: false,
    hideFollow: true,
    hideIssues: true,
    hideUsersS: false,
    hideUsers: []
}, function (items) {
    OPTIONS = {
        enabled: items.enabled,
        hideAll: items.hideAll,
        hideDetailedFeed: items.hideDetailedFeed,
        hideFork: items.hideFork,
        hideStar: items.hideStar,
        hideCreate: items.hideCreate,
        hideFollow: items.hideFollow,
        hideIssues: items.hideIssues,
        hideUsersS: items.hideUsersS,
        hideUsers: items.hideUsers
    };
    init();
});
