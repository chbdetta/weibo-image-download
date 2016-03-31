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
  function hasButton(feed) {
    return feed && feed.querySelector('.chb_download_btn');
  }
  function isButton(node) {
    return node && node.classList && node.classList.contains('chb_download_btn');
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

  var container = document;

  container.addEventListener('click', function (e) {
    if (parent(e.target, function (node) {
      return isButton(node);
    }) !== document.body) {
      var feed = parent(e.target, function (node) {
        return node.classList.contains('WB_cardwrap');
      });
      var picNodes = getPicNodes(feed);
      var addresses = getLargePicAddress(picNodes);
      downloadAll(addresses);
    }
  });

  // use polling to add button
  var addButtonMoniter = setInterval(function () {
    var feedList = container.querySelector('.WB_feed');
    if (feedList) {
      [].forEach.call(feedList.childNodes, function (node) {
        if (node.nodeType === 1 && !hasButton(node)) {
          addButton(node);
        }
      });
    }
  }, 1000);

  // insert css
  var head = document.querySelector('head');
  var style = document.createElement('style');
  style.innerHTML = '\n  .WB_row_r4 li {\n    width: 20%; !important\n  }\n  ';
  head.appendChild(style);
})();
