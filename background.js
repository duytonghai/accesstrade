// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

var BASE_URL = 'https://go.isclix.com/deep_link/5140210465117321985?url=';
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('Working...');
  });

  // onUpdated should fire when the selected tab is changed or a link is clicked
  var myUrl;
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function(tab) {
      myUrl = tab.url || '';

      var isValidPublisher = false;
      var publishers = ['tiki.vn/', 'shopee.vn/', 'sendo.vn/', 'adayroi.com/', 'fado.vn'];
      publishers.forEach(function(item) {
        if (myUrl.includes(item)) {
          isValidPublisher = true;
          return;
        }
      });

      if (isValidPublisher) {
        var accessTradeUrl = `${BASE_URL}${myUrl}&utm_source=accesstrade`;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>", accessTradeUrl);

        window.location.replace(accessTradeUrl);
      }
    });
  });
});
