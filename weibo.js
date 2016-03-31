// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       chbdetta
// @include      http://weibo.com/*
// @grant        none
// ==/UserScript==

(function() {

  // user MutationObserver to detect dom changing
  // add "download" button to each weibo feed

  const button = document.createElement('li')
  const link = document.createElement('a')
  link.className = 'S_txt2 chb_download_btn'
  link.innerHTML = `
  <span class="pos">
  <span class="line S_line_1">
  <em>download</em>
  </span>
  </span>
  `
  button.appendChild(link)

  function addButton(feed) {
    const handle = feed.querySelector('.WB_row_line.WB_row_r4')
    if (handle) {
      handle.appendChild(button.cloneNode(true))
    }
  }
  function hasButton(feed) {
    return feed && feed.querySelector('.chb_download_btn')
  }
  function isButton(node) {
    return node && node.classList && node.classList.contains('chb_download_btn')
  }

  function parent(node, filter) {
    if (filter(node) || node === document.body) {
      return node
    }
    return parent(node.parentElement, filter)
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
    return [].map.call(picNodes, (node) => {
      return `http://ww4.sinaimg.cn/large/${node.src.split('/').reverse()[0]}`
    })
  }

  function getPicNodes(feed) {
    return feed.querySelectorAll('li.WB_pic img')
  }

  const container = document

  container.addEventListener('click', function (e) {
    if (parent(e.target, (node) => isButton(node)) !== document.body) {
      const feed = parent(e.target, (node) => node.classList.contains('WB_cardwrap'))
      const picNodes = getPicNodes(feed)
      const addresses = getLargePicAddress(picNodes)
      downloadAll(addresses)
    }
  });

  // use polling to add button
  const addButtonMoniter = setInterval(() => {
    const feedList = container.querySelector('.WB_feed');
    if (feedList) {
      [].forEach.call(feedList.childNodes, (node) => {
        if (node.nodeType === 1 && !hasButton(node)) {
          addButton(node)
        }
      })
    }
  }, 1000)

  // insert css
  const head = document.querySelector('head')
  const style = document.createElement('style')
  style.innerHTML = `
  .WB_row_r4 li {
    width: 20%; !important
  }
  `
  head.appendChild(style)

})()
