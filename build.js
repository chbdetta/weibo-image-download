'use strict';

// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       chbdetta
// @include      http://weibo.com/*
// @grant        none
// ==/UserScript==

(function () {

  // user MutationObserver to detect dom changing
  // add "download" button to each weibo feed

  // callback function when mutation is observed
  function cb(mutations) {
    mutations.forEach(function (record) {
      var addedFeeds = record.addedNodes;
      console.log(addedFeeds);
      addedFeeds.forEach(addButton);
    });
  }

  var button = document.createElement('li');
  var link = document.createElement('a');
  link.className = 'S_txt2 chb_download_btn';
  link.innerHTML = '\n  <span class="pos">\n  <span class="line S_line_1">\n  <em>download</em>\n  </span>\n  </span>\n  ';
  button.appendChild(link);

  function addButton(feed) {
    var handle = feed.querySelector('.WB_row_line.WB_row_r4');
    if (handle) {
      handle.appendChild(button.cloneNode(true));
    }
  }

  function parent(node, filter) {
    if (filter(node) || node === document.body) {
      return node;
    }
    return parent(node.parentElement, filter);
  }

  function downloadAll(urls) {
    var link = document.createElement('a');

    link.setAttribute('download', null);
    link.style.display = 'none';

    document.body.appendChild(link);

    for (var i = 0; i < urls.length; i++) {
      link.setAttribute('href', urls[i]);
      link.click();
    }

    document.body.removeChild(link);
  }

  function getLargePicAddress(picNodes) {
    return [].map.call(picNodes, function (node) {
      return 'http://ww4.sinaimg.cn/large/' + node.src.split('/').reverse()[0];
    });
  }

  function getPicNodes(feed) {
    return feed.querySelectorAll('li.WB_pic img');
  }

  var timer = setInterval(function () {
    if (document.querySelector('.WB_feed') === null) {
      return;
    }
    clearInterval(timer);
    var feedList = document.querySelector('.WB_feed');

    feedList.addEventListener('click', function (e) {
      if (parent(e.target, function (node) {
        return node.classList.contains('chb_download_btn');
      }) !== document.body) {
        var feed = parent(e.target, function (node) {
          return node.classList.contains('WB_cardwrap');
        });
        var picNodes = getPicNodes(feed);
        var addresses = getLargePicAddress(picNodes);
        downloadAll(addresses);
      }
    });

    // add button to existed feed
    [].forEach.call(feedList.children, function (feed) {
      addButton(feed);
    });

    var observer = new MutationObserver(cb);
    // observer child list change since we care about feed dynamic adding
    observer.observe(feedList, { childList: true });
  }, 100);

  // insert css
  var head = document.querySelector('head');
  var style = document.createElement('style');
  style.innerHTML = '\n  .WB_row_r4 li {\n    width: 20%; !important\n  }\n  ';
  head.appendChild(style);
})();
