
const BOOKMARKS_URL = "http://forum.mods.de/bb/xml/bookmarks.php";
const PM_PROBE_URL = "http://forum.mods.de/bb/search.php";

var CODE_NOT_RUN = 0;
var CODE_SUCCESS = 1;
var CODE_TIMEOUT = 2;
var CODE_NOT_LOGGED_IN = 3;

var bookmarks_code = CODE_NOT_RUN;
var pm_code = CODE_NOT_RUN;
var new_pms = 0;
var bookmarks = null;
var new_bookmarks = 0;

function reload() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.overrideMimeType('text/xml');
    xhr.onload = function(e) {
        if(xhr.responseXML.firstChild.nodeName === "not-logged-in") {
            bookmarks = null;
            bookmarks_code = CODE_NOT_LOGGED_IN;
        } else {
            bookmarks = xhr.responseXML.getElementsByTagName("bookmark");
            new_bookmarks = parseInt(xhr.responseXML.firstChild.getAttribute("newposts"));
            bookmarks_code = CODE_SUCCESS;
        }
        setTimeout(reload, 2000);
    };

    xhr.ontimeout = function (e) {
        bookmarks_code = CODE_TIMEOUT;
        setTimeout(reload, 2000);
    };

    xhr.onerror = xhr.ontimeout;

    xhr.open("GET", BOOKMARKS_URL);
    xhr.send();
}

function pmcheck() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.onload = function(e) {
        const parser = new DOMParser();
        var container = parser.parseFromString(xhr.responseText, "text/html");

        var pm = container.querySelectorAll("a[href='pm/']");
        
        if(pm.length === 0) {
            pm_code = CODE_NOT_LOGGED_IN;
        } else {
            var new_pm_element = pm[0].parentNode.querySelectorAll("span");
            
            if(new_pm_element.length === 0) {
                new_pms = 0;
            } else {
                new_pms = parseInt(new_pm_element[0].firstElementChild.textContent);
            }
            
            pm_code = CODE_SUCCESS;
        }
        setTimeout(pmcheck, 2000);
    };

    xhr.ontimeout = function (e) {
        pm_code = CODE_TIMEOUT;
        setTimeout(pmcheck, 2000);
    };

    xhr.onerror = xhr.ontimeout;

    xhr.open("GET", PM_PROBE_URL);
    xhr.send();
}

function setBadgeText() {
    var browser = browser || chrome;
    var badgetext = "";
    if(new_pms > 0) {
        badgetext = "PM";
    } else if(new_bookmarks > 0) {
        badgetext = new_bookmarks+"";
    }
    browser.browserAction.setBadgeText({text: badgetext});
    browser.browserAction.setBadgeBackgroundColor({color: "#870000"});
    setTimeout(setBadgeText, 2000);
}

reload();
pmcheck();
setBadgeText();