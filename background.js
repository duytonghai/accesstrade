// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const ONE_WEEK_BY_SECONDS = 604800000;
const LOCAL_STORAGE_KEY = 'links';
const LOCAL_STORAGE_ACCESS_TRADE_KEY = 'accessTradeKey';
const ACCESS_TRADE_KEY = '5140210465117321985';
const BASE_URL = `https://go.isclix.com/deep_link/`;

const PUBLISHERS = [
  'tiki.vn',
  'shopee.vn',
  'sendo.vn',
  'adayroi.com',
  'lazada.vn',
  'fado.vn'
];

function verifyPublisher(requestUrl) {
  return PUBLISHERS.find(item => requestUrl.includes(item)) ? true : false;
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

function checkStoraged(link) {
  var storage = getStorage();
  var checkLink = PUBLISHERS.find(item => link.includes(item));
  var isStoraged = storage.find(item => item.includes(checkLink));
  return !!isStoraged;
}

function setStorage(newLink) {
  var linkArray = getStorage(LOCAL_STORAGE_KEY);

  if (linkArray.indexOf(newLink) === -1) {
    linkArray.push(newLink);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(linkArray));
  return;
}

// Clear all storage data every week to refresh access trade cookies
function cleanData() {
  setInterval(() => {
    console.log('Cleaning cookies every week...');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, ONE_WEEK_BY_SECONDS);
  return;
}

function initKey() {
  const accessPrivate = getStorage(LOCAL_STORAGE_ACCESS_TRADE_KEY);
  if (!accessPrivate || !accessPrivate.length) {
    let key = prompt('Please insert your access trade key');
    if (!key) {
      key = ACCESS_TRADE_KEY;
    }
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TRADE_KEY, key);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    alert(`Your access trade key ${key} has been setted`);
  }
  return;
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Working...');
    initKey();
    cleanData();
  });

  // onUpdated should fire when the selected tab is changed or a link is clicked
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function(tab) {
      var newLink = tab.url || '';

      const isValidPublisher = verifyPublisher(newLink);
      if (isValidPublisher) {
        const newLinkEncoded = encodeURIComponent(newLink);
        const accessPrivate = localStorage.getItem(LOCAL_STORAGE_ACCESS_TRADE_KEY);
        const accessTradeUrl = `${BASE_URL}${accessPrivate}?url=${newLinkEncoded}`;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>", accessTradeUrl);

        var linkArray = getStorage(LOCAL_STORAGE_KEY);
        if (linkArray.indexOf(newLink) === -1 && newLink.length < 256) {
          var isStoraged = checkStoraged(newLink);
          if (!isStoraged) {
            setStorage(newLink);
            window.open(accessTradeUrl);
          }
        }
      }
    });
  });
});
