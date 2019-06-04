// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const ACCESS_TRADE_KEY = '5140210465117321985';
const  BASE_URL = `https://go.isclix.com/deep_link/${ACCESS_TRADE_KEY}?url=`;

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

function resetOldUrl() {
  
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Working...');
  });
  var oldMyUrl = '';

  // onUpdated should fire when the selected tab is changed or a link is clicked
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function(tab) {
      var myUrl = tab.url || '';
      const isValidPublisher = verifyPublisher(myUrl);
  
      if (isValidPublisher) {
        if (oldMyUrl !== myUrl) {
          console.log("myURL>>>>>>>>>>>>>>>>>>>>>>>>>>>>", myUrl);
          const isValidPublisher = verifyPublisher(myUrl);
          if (isValidPublisher) {
            const myUrlEncoded = encodeURIComponent(myUrl);
            const accessTradeUrl = `${BASE_URL}${myUrlEncoded}`;
            console.log(">>>>>>>>>>>>>>>>>>>>>>>", accessTradeUrl);
            oldMyUrl = myUrl;
            window.open(accessTradeUrl);
          }
        }
      }
    });
  });
});
