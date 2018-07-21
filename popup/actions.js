$( document ).ready(function() {
    
    $("#bookmarks-list").on("click", "a", function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            browser.tabs.update(tab.id, {url: href});
            window.close();
        });
    });
    
    function clearList() {
        var save = $("#bookmarks-list .template").detach();
        $('#bookmarks-list').empty().append(save);
    }

    function appendBookmark(title, unread_count, tid, pid) {
        var new_element = $("#bookmarks-list .template").clone().removeClass("template");
        var href = `http://forum.mods.de/bb/thread.php?TID=${tid}&PID=${pid}#reply_${pid}`
        new_element.find("a").attr("href", href);
        new_element.find(".unread-count").text(unread_count);
        new_element.find(".title").text(title);
        if(unread_count == 0) {
            new_element.find(".unread-count").hide();
        }
        $("#bookmarks-list").append(new_element);
    }

    var getting = browser.runtime.getBackgroundPage();
    getting.then(function(page) {
        clearList();

        if(page.bookmarks == null) {
            $("#bookmarks-list").hide();
            $("#not-logged-in").show();
            return;
        }

        var bm_unread = [];
        var bm_read = [];
        for (var i = 0; i < page.bookmarks.length; i++) {
            var bookmark = page.bookmarks[i];
            var unread_count = parseInt(bookmark.getAttribute("newposts"));
            if(unread_count > 0)
                bm_read.push(bookmark);
            else
                bm_unread.push(bookmark);
        }

        var bm = bm_read.concat(bm_unread)
        for (var i = 0; i < bm.length; i++) {
            var bookmark = bm[i];
            var title = bookmark.children[0].textContent;
            var unread_count = parseInt(bookmark.getAttribute("newposts"));
            var pid = parseInt(bookmark.getAttribute("PID"));
            var tid = parseInt(bookmark.children[0].getAttribute("TID"));
            appendBookmark(title, unread_count, tid, pid);
        }
    }, function(error) {
        console.log(`Error: ${error}`);
    });

});
