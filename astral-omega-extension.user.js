// ==UserScript==
// @name     astral-omega-extension
// @version  24
// @grant    none
// @run-at   document-start
// @match    https://monachat.xyz/*
// @match    https://monachat.tech/*
// @match    https://monachat-like-z1zn.onrender.com/*
// ==/UserScript==

const VERSION = 24;
addEventListener('load', () => {
  document.body.insertAdjacentHTML('afterbegin', `<p><a href="https://iwamizawa-software.github.io/astral-omega-extension/docs/uninstall.html" target="_blank">拡張は必要なくなったのでこちらから削除してください</a>`);
});
