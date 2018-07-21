
const BOOKMARKS_URL = "http://forum.mods.de/bb/xml/bookmarks.php";

var bookmarks = null;

function reload() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('text/xml');
    xhr.onload = function(e) {
        if(xhr.responseXML.firstChild.nodeName === "not-logged-in") {
            bookmarks = null;
        } else {
            bookmarks = xhr.responseXML.getElementsByTagName("bookmark");
            var newposts = parseInt(xhr.responseXML.firstChild.getAttribute("newposts"));
            var browser = browser || chrome;
            var badgetext = ""+newposts;
            if(newposts == 0)
                badgetext = "";
            browser.browserAction.setBadgeText({text: badgetext});
        }
        setTimeout(reload, 2000);
    }
    xhr.open("GET", BOOKMARKS_URL);
    xhr.send();
}

reload();
