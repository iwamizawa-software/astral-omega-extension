// ==UserScript==
// @name     astral-omega-extension
// @version  1
// @grant    none
// @run-at   document-start
// @match    https://monachat.life/*
// ==/UserScript==

var inject = function () {

  window.extensionConfig = {
    darkMode: 0, // 1でダークモード
    hideTimestamp: 0, // 1でログの時刻を消す
    maxName: 20, // 名前の最大文字数
    maxStat: 20, // 状態の最大文字数
    maxComment: 1000, // 発言の最大文字数
    notify: 0, // 1でメンション通知有効
    notifySoundURL: 'https://raw.githubusercontent.com/iwamizawa-software/astral-omega-extension/main/notify.ogg', // 通知音URL
    notifySoundVolume: 0.5, // 通知音音量
    mentionPattern: /せん[ゔヴべ]|senn?[bv]|🍘/,
    replyMsg: 'ｎ',
    userCSS: '',
    userScript: `

`
  };

  window.Bot = function () {};
  Bot.normalize = s => ('' + s).replace(/([ァ-ン])|[！-～]/g, (s, katakana) => String.fromCharCode(s.charCodeAt() - (katakana ? 96 : 0xFF01 - 0x21))).toLowerCase();
  Bot.listeners = [];

  if (extensionConfig.darkMode)
    extensionConfig.userCSS += `
:not(.p-inputswitch-slider,.character-selection-box-colorpalette *) {
  background-color: #051404 !important;
  color: #fff !important;
}
.character, .character :not(.bubble-area div,.stat-text),.character-selection-box-image,.character-selection-box-image *{
  background-color: #0000 !important;
}
.room-img{
  filter: invert(1);
}
`;
  if (extensionConfig.hideTimestamp)
    extensionConfig.userCSS += `
.log-text{
  display: none;
}
`;
  if (extensionConfig.notifySoundURL) {
    var sound = new Audio(extensionConfig.notifySoundURL);
    sound.volume = extensionConfig.notifySoundVolume;
  }

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
    Bot.send = function (type, obj) {
      socket.send('42' + JSON.stringify([type, Object.assign({token: token}, obj)]));
    };
    socket.send = function (s) {
      if (typeof s === 'string' && !s.indexOf('42["ERROR'))
        return;
      return WebSocket.prototype.send.apply(socket, arguments);
    };
    socket.addEventListener('message', event => {
      try {
        var data = JSON.parse(event.data.replace(/^\d+/, ''));
      } catch (err) {
        var nonJSON = true;
      }
      var editEvent = data => {
        event = Object.assign({}, event);
        event.data = '42' + JSON.stringify(data);
      };
      if (!nonJSON) switch (data[0]) {
        case 'AUTH':
          token = data[1].token;
          myId = data[1].id;
          break;
        case 'USER':
          users = {};
          var modified;
          data[1].forEach(u => {
            if (u.name && u.name.length > extensionConfig.maxName) {
              u.name = u.name.slice(0, extensionConfig.maxName);
              modified = true;
            }
            if (u.stat && u.stat.length > extensionConfig.maxStat) {
              u.stat = u.stat.slice(0, extensionConfig.maxStat);
              modified = true;
            }
            users[u.id] = u;
          });
          if (modified)
            editEvent(data);
          break;
        case 'ENTER':
          users[data[1].id] = data[1];
          if (data[1].name && data[1].name.length > extensionConfig.maxName) {
            data[1].name = data[1].name.slice(0, extensionConfig.maxName);
            editEvent(data);
          }
          break;
        case 'EXIT':
          delete users[data[1].id];
          break;
        case 'COM':
          if (data[1].id === myId)
            break;
          if (extensionConfig.notify && !document.hasFocus() && extensionConfig.mentionPattern && extensionConfig.mentionPattern.test(Bot.normalize(data[1].cmt))) {
            mentionNotification(users[data[1].id], data[1].cmt, () => {
              if (extensionConfig.replyMsg)
                Bot.send('COM', {cmt: extensionConfig.replyMsg});
              // Chromeはクリック時既定の動作がない
              focus();
            });
            if (sound)
              sound.play();
          }
          if (data[1].cmt && data[1].cmt.length > extensionConfig.maxComment) {
            data[1].cmt = data[1].cmt.slice(0, extensionConfig.maxComment);
            editEvent(data);
          }
          break;
        case 'SET':
          if (data[1].stat && data[1].stat.length > extensionConfig.maxStat) {
            data[1].stat = data[1].stat.slice(0, extensionConfig.maxStat);
            editEvent(data);
          }
          break;
        case 'AWAKE':
          if (!users[data[1].id] && !data[1].name)
            editEvent(['ENTER', users[data[1].id] = {id: data[1].id, name: 'WAKER', type: 'unknown', stat: 'bug', x: 0, y: 350, scl: 100, r: 100, g: 100, b: 100}]);
          break;
      }
      Bot.listeners.concat([[0, Bot.onmessage]]).forEach(args => {
        try {
          if (args)
            args[1].call(socket, event);
        } catch (err) {
          console.log(err);
        }
      });
    });
    socket.addEventListener = function (type, f) {
      if (type === 'message') {
        if (!Bot.listeners.includes(args => args[1] === f))
          Bot.listeners.push(arguments);
      } else {
        WebSocket.prototype.addEventListener.apply(socket, arguments);
      }
    };
    Object.defineProperty(socket, 'onmessage', {
      get: () => function (){},
      set: f => Bot.onmessage = f
    });
    socket.removeEventListener = function (type, f) {
      WebSocket.prototype.removeEventListener.apply(socket, arguments);
      Bot.listeners = Bot.listeners.filter(args => args[1] !== f);
    };
    return socket;
  };
  window.WebSocket.prototype = WebSocket.prototype;
  window.WebSocket.__proto__ = WebSocket;
  
  addEventListener('load', () => {
    document.querySelector('head').appendChild(document.createElement('style')).textContent = extensionConfig.userCSS;
    if (extensionConfig.userScript.replace(/\s+/g, ''))
      eval(extensionConfig.userScript);
  });
};
window.eval('(' + inject + ')()');
