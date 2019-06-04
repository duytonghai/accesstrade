// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const LOCAL_STORAGE_KEY = 'links';
const ACCESS_TRADE_KEY = '5140210465117321985';
const BASE_URL = `https://go.isclix.com/deep_link/${ACCESS_TRADE_KEY}?url=`;

function verifyPublisher(requestUrl) {
  const publishers = [
    'tiki.vn/',
    'shopee.vn/',
    'sendo.vn/',
    'adayroi.com/',
    'lazada.vn',
    'fado.vn'
  ];

  return publishers.find(item => requestUrl.includes(item)) ? true : false;
}

function getStorage(key = LOCAL_STORAGE_KEY) {
  var links = localStorage.getItem(key);
  if (!links) {
    links = [];
  } else {
    links = JSON.parse(links.toString());
  }

  return links;
}

function setStorage(newLink) {
  var linkArray = getStorage(LOCAL_STORAGE_KEY);

  if (linkArray.indexOf(newLink) === -1) {
    linkArray.push(newLink);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(linkArray));
  return;
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Working...');
  });

  // onUpdated should fire when the selected tab is changed or a link is clicked
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function(tab) {
      var newLink = tab.url || '';
      const isValidPublisher = verifyPublisher(newLink);
  
      if (isValidPublisher) {
        const isValidPublisher = verifyPublisher(newLink);
        if (isValidPublisher) {
          const newLinkEncoded = encodeURIComponent(newLink);
          const accessTradeUrl = `${BASE_URL}${newLinkEncoded}`;
          console.log(">>>>>>>>>>>>>>>>>>>>>>>", accessTradeUrl);

          var linkArray = getStorage(LOCAL_STORAGE_KEY);
          if (linkArray.indexOf(newLink) === -1 && newLink.length < 256) {
            setStorage(newLink);
            window.open(accessTradeUrl);
          }
        }
      }
    });
  });
});
