// ==UserScript==
// @name     astral-omega-extension
// @version  0
// @grant    none
// @run-at   document-start
// @match    https://monachat.life/*
// ==/UserScript==

var inject = function () {

  var notify = 0; // 1で有効
  var mentionPattern = /[セせ][ンん][ゔヴべ]|senn?[bv]|🍘/i;
  var replyMsg = 'ｎ';
  var userCSS = `
:not(.p-inputswitch-slider,.character-selection-box-colorpalette *) {
  background-color: #051404 !important;
  color: #fff !important;
}
.character, .character :not(.bubble-area div),.character-selection-box-image,.character-selection-box-image *{
  background-color: #0000 !important;
}
  `;

  var pngCache = {};
  var SVG2PNG = async function (url) {
    var callback;
    if (url.slice(-3) === 'png')
      return url;
    if (pngCache[url])
      return pngCache[url];
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = canvas.height;
        ctx.drawImage(img, 0, 0);
        callback(pngCache[url] = canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml,' + encodeURIComponent(await (await fetch(url)).text());
    } catch (err) {
      return url;
    }
    return {then:c=>callback=c};
  };
  var mention;
  var mentionNotification = async function (user, cmt, onclick) {
    mention = new Notification(user.name, {
      // ChromeはNotification.iconにSVGを指定できない
      icon: await SVG2PNG('https://monachat.life/img/svg/' + user.type + '.svg'),
      tag: 'mention',
      body: cmt,
      requireInteraction: true
    });
    mention.onclick = onclick;
  };
  addEventListener('focus', function () {
    if (mention)
      mention.close();
  });

  var WebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var socket = new WebSocket(url, protocols);
    var token, myId, users = {};
    socket.addEventListener('message', event => {
      var json = event.data.replace(/^\d+/, '');
      if (!json)
        return;
      try {
        var data = JSON.parse(json);
      } catch (err) {
        return;
      }
      switch (data[0]) {
        case 'AUTH':
          token = data[1].token;
          myId = data[1].id;
          break;
        case 'USER':
          users = {};
          data[1].forEach(u => users[u.id] = u);
          break;
        case 'ENTER':
          users[data[1].id] = data[1];
          break;
        case 'EXIT':
          delete users[data[1].id];
          break;
        case 'COM':
          if (data[1].id === myId)
            return;
          if (notify && !document.hasFocus() && mentionPattern && mentionPattern.test(data[1].cmt))
            mentionNotification(users[data[1].id], data[1].cmt, () => {
              if (replyMsg)
                socket.send('42' + JSON.stringify(['COM', {token: token, cmt: replyMsg}]));
              // Chromeはクリック時既定の動作がない
              focus();
            });
          break;
      }
    });
    return socket;
  };
  window.WebSocket.prototype = WebSocket.prototype;
  window.WebSocket.__proto__ = WebSocket;
  
  addEventListener('load', () => {
    document.querySelector('head').appendChild(document.createElement('style')).textContent = userCSS;
  });
};
window.eval('(' + inject + ')()');
