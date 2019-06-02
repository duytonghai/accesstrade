// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

var BASE_URL = 'https://go.isclix.com/deep_link/5140210465117321985?url=';
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  // onUpdated should fire when the selected tab is changed or a link is clicked
  var myURL;
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.getSelected(null, function(tab) {
      var isValidPublisher;
      var publishers = ['www.tiki.com/', 'www.shopee.vn/', 'www.sendo.vn/', 'www.adayroi.com/'];
      myURL = tab.url || '';

      // Only support for publishers such as Tiki, Shopee, Sendo, Adayroi
      for (var i = 0; i< publishers.length; i++) {
        if (myURL.substring(publishers[i])) {
          isValidPublisher = true;
        }
      }

      if (isValidPublisher) {
        var accessTradeURL = BASE_URL + myURL + '&utm_source=accesstrade';
        console.log(">>>>>>>>>>>>>>>>>>>>>>>", accessTradeURL);

        window.location.replace(accessTradeURL, '_blank');
      }
    });
  });
});
