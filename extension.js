// ==UserScript==
// @name     astral-omega-extension
// @grant    none
// @run-at   document-start
// @match    https://monachat.tech/*
// ==/UserScript==

var inject = function () {

  if (localStorage.getItem('/monachatchat/extension') !== 'true')
    return;

  var configInfo = [
    {
      name: '見た目とか動作の設定',
      type: 'separator'
    },
    {
      key: 'smartMode',
      name: 'スマホモード',
      description: 'ONにすると移動したいところを長押しで移動出来るようになります。また接続維持用チェックボックスとスマホ入力用メッセージボックスが表示されます。',
      type: 'onoff',
      value: 0
    },
    {
      key: 'invisibleMode',
      name: 'キャラ画面を隠す（外出先用）',
      type: 'onoff',
      value: 0
    },
    {
      key: 'hideTimestamp',
      name: 'ログの時刻を消す',
      type: 'onoff',
      value: 0
    },
    {
      key: 'onbeforeunload',
      name: 'チャットを閉じるときに確認する',
      type: 'onoff',
      value: 0
    },
    {
      key: 'forcedShiro',
      name: '強制白トリップ',
      type: 'onoff',
      value: 0
    },
    {
      name: '読み上げ',
      type: 'separator'
    },
    {
      key: 'yomiageAll',
      name: '全員の発言を読み上げ',
      type: 'onoff',
      value: 0
    },
    {
      key: 'yomiageList',
      name: '読み上げる人を指定',
      description: '指定した名前を読み上げます。両端を半角スラッシュ(/)にすると正規表現として扱われます。',
      type: 'list',
      value: []
    },
    {
      key: 'yomiageSpeed',
      name: '読み上げる速度',
      description: '0.1から10の間で指定します。標準は1です。',
      type: 'input',
      value: '1'
    },
    {
      name: '自動無視',
      description: '両端を半角スラッシュ(/)にすると正規表現として扱われます。',
      type: 'separator'
    },
    {
      key: 'allowList',
      name: '許可リスト',
      description: '指定した名前が含まれる場合、拒否リスト対象でも無視しません。',
      type: 'list',
      value: []
    },
    {
      key: 'denyList',
      name: '拒否リスト',
      description: '指定した名前が含まれる場合無視します。',
      type: 'list',
      value: []
    },
    {
      key: 'ignoreWord',
      name: 'NGワード',
      description: '指定した言葉が含まれた場合無視します。',
      type: 'list',
      value: []
    },
    {
      name: '通知',
      type: 'separator'
    },
    {
      key: 'mentionList',
      name: '通知リスト',
      description: '指定した言葉が含まれた場合通知します。',
      type: 'list',
      value: []
    },
    {
      key: 'replyMsg',
      name: '通知をクリックしたときに自動で発言する言葉',
      type: 'input',
      value: ''
    },
    {
      key: 'notifySoundURL',
      name: '通知が来たときに再生する音声ファイルのURL',
      type: 'input',
      value: 'https://raw.githubusercontent.com/iwamizawa-software/astral-omega-extension/main/notify.ogg'
    },
    {
      key: 'notifySoundVolume',
      name: '通知が来たときに再生する音の大きさ',
      description: '0～1の実数で指定',
      type: 'input',
      value: '0.5'
    },
    {
      name: '数値の制限',
      type: 'separator'
    },
    {
      key: 'maxName',
      name: '名前の最大文字数',
      type: 'input',
      value: '20'
    },
    {
      key: 'maxStat',
      name: '状態の最大文字数',
      type: 'input',
      value: '20'
    },
    {
      key: 'maxX',
      name: '最大のX',
      type: 'input',
      value: '1200'
    },
    {
      key: 'maxY',
      name: '最大のY',
      type: 'input',
      value: '400'
    },
    {
      key: 'maxComment',
      name: '発言の最大文字数',
      type: 'input',
      value: '1000'
    },
    {
      name: 'BOT',
      type: 'separator'
    },
    {
      key: 'bot',
      name: '実行するJavaScript',
      type: 'textarea',
      value: ''
    },
    {
      name: 'その他（基本いじらなくていい）',
      type: 'separator'
    },
    {
      key: 'monitorScore',
      name: 'monitorScore',
      type: 'onoff',
      value: 0
    },
    {
      key: 'killScore',
      name: 'killScore',
      type: 'input',
      value: '10'
    },
  ];

  window.extensionConfig = Object.assign(Object.fromEntries(configInfo.filter(info => info.key).map(info => [info.key, info.value])), JSON.parse(localStorage.getItem('extensionConfig')));

  var createElement = function (tagName, attr) {
    var element = document.createElement(tagName);
    Object.assign(element, attr);
    return element;
  };
  const yomiageReplacer = s => s.replace(/https?:\S+/g, 'URL').replace(/[wｗ]{2,}$/, 'わらわら').replace(/([\s\S])\1{2,}/g, '$1$1$1');
  const removeSpace = str => str.replace(/[\u{0009}-\u{000D}\u{0020}\u{0085}\u{00A0}\u{00AD}\u{034F}\u{061C}\u{070F}\u{115F}\u{1160}\u{1680}\u{17B4}\u{17B5}\u{180E}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}-\u{206F}\u{2800}\u{3000}\u{3164}\u{FEFF}\u{FFA0}\u{110B1}\u{1BCA0}-\u{1BCA3}\u{1D159}\u{1D173}-\u{1D17A}\u{E0000}-\u{E0FFF}]/gu, '');
  const match = (str, cond) => {
    if (!cond || cond.constructor !== Array || typeof str !== 'string')
      return false;
    var nospace = removeSpace(str || '');
    return cond.some(c => {
      if (!c)
        return false;
      if (/^\/.+\/([dgimsuy]*)$/i.test(c)) {
        var regex = new RegExp(c.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
        return regex.test(nospace) || regex.test(str);
      } else {
        return nospace.indexOf(c) !== -1 || str.indexOf(c) !== -1;
      }
    });
  };

  var timerIds = [];
  window.Bot = function (bot) {
    var setTimeout = function () {
      var id = window.setTimeout.apply(window, arguments);
      timerIds.push(id);
      return id;
    };
    var setInterval = function () {
      var id = window.setInterval.apply(window, arguments);
      timerIds.push(id);
      return id;
    };
    var on = function (type, listener, timeout) {
      var cancel = () => {
        listener.resolve();
        listener.resolved = true;
      };
      var p = new Promise(resolve => {
        if (typeof timeout === 'number' || timeout?.timeout)
          timeout.timerId = setTimeout(cancel, timeout.timeout || timeout);
        if (timeout)
          timeout.cancel = cancel;
        listener.resolve = resolve;
        queueMicrotask(()=>(Bot.listeners[type] || (Bot.listeners[type] = [])).push(listener));
      });
      p.cancel = cancel;
      return p;
    };
    var listenTo = async function (word, name = '', timeout, normalize) {
      if (!word.test) {
        var w = word;
        word = {test: s => s.indexOf(w) !== -1};
      }
      var cmt;
      return await on('COM', user => user.id !== Bot.myId && user.fullName.indexOf(name) !== -1 && word.test(cmt = normalize ? Bot.normalize(user.cmt): user.cmt), timeout) && cmt;
    };
    var sleep = t => ({then: r => setTimeout(r, t)});
    timerIds.forEach(clearTimeout.bind(window));
    timerIds = [];
    Bot.listeners = {};
    Bot.commands = {};
    try {
      Function('setTimeout', 'setInterval', 'on', 'sleep', 'listenTo', bot + '')(setTimeout, setInterval, on, sleep, listenTo);
    } catch (err) {
      console.log(err);
    }
  };
  Bot.normalize = s => ('' + s).replace(/([ァ-ン])|[！-～]/g, (s, katakana) => String.fromCharCode(s.charCodeAt() - (katakana ? 96 : 0xFF01 - 0x21))).toLowerCase();
  Bot.listeners = {};
  Bot.users = {};
  Bot.commands = {};
  Bot.commentQueue = [];
  Bot.dequeue = function () {
    var cmt = Bot.commentQueue[0];
    Bot.send('COM', {cmt});
    setTimeout(() => {
      Bot.commentQueue.shift();
      if (Bot.commentQueue.length)
        Bot.dequeue();
    }, 1000);
  };
  Bot.comment = function (cmt) {
    var run = Bot.commentQueue.length;
    Bot.commentQueue.push(cmt);
    if (!run)
      Bot.dequeue();
  };
  Bot.set = function (attr) {
    var {x, y, scl, stat} = Bot.users[Bot.myId];
    if ('x' in attr)
      attr.x = Math.max(0, Math.min(+extensionConfig.maxX, attr.x));
    if ('y' in attr)
      attr.y = Math.max(0, Math.min(+extensionConfig.maxY, attr.y));
    Bot.send('SET', Object.assign({x, y, scl, stat}, attr));
    Object.assign(Bot.users[Bot.myId], attr);
  };
  Bot.ignore = function (ihash, ignore, fullName) {
    if (!ihash || Bot.users[Bot.myId]?.ihash === ihash)
      return;
    Bot.send('IG', {ihash, stat: ignore ? 'on' : 'off'});
    showMessage((fullName || ('◇' + ihash.slice(0, 6))) + 'を自動無視しました');
  };
  Bot.stat = function (stat) {
    Bot.set({stat});
  };
  var tmp;
  Bot.stop = function () {
    if (tmp)
      return;
    tmp = Bot.listeners;
    Bot.listeners = {};
  };
  Bot.start = function () {
    if (!tmp)
      return;
    Bot.listeners = tmp;
    tmp = null;
  };
  Bot.save = (key, value) => localStorage.setItem('extension-' + key, JSON.stringify(value));
  Bot.load = (key) => JSON.parse(localStorage.getItem('extension-' + key));
  Bot.kuji = function () {
    if (arguments.length & 1)
      throw new Error('引数の数がおかしい');
    var sum = 0, points = [];
    for (var i = 1; i < arguments.length; i+=2)
      if (typeof arguments[i] === 'number')
        points.push(sum += arguments[i]);
      else
        throw new Error((i + 1) + '番目の引数が数字じゃない');
    for (var i = 0, n = Math.random() * sum; i < points.length; i++)
      if (n < points[i])
        return arguments[i << 1];
    throw new Error('くじがなんかおかしい');
  };
  var dispatch = data => {
    var type = data[0];
    var listeners = Bot.listeners[type] || Bot.listeners[type = '*'];
    if (listeners)
      Bot.listeners[type] = listeners.filter(listener => {
        if (listener.resolved)
          return false;
        if (!listener.run) {
          try {
            var value = listener.apply(this, type === '*' ? data : [Bot.users[data[1].id]]);
          } catch (err) {
            console.log(err);
            return true;
          }
          if (value) {
            if (value.constructor === Promise) {
              listener.run = true;
              value.finally(() => listener.run = false);
            } else {
              listener.resolve.apply(this, type === '*' ? data : [Bot.users[data[1].id]]);
              return false;
            }
          }
        }
        return true;
      });
  };

  var logWindow, openLog = function () {
    if (logWindow && !logWindow.closed) {
      logWindow.focus();
      return;
    }
    logWindow = open('about:blank', 'log' + (new Date()).getTime(), 'width=300,height=500,menubar=no,toolbar=no,location=no');
    if (!logWindow) {
      alert('ポップアップを許可して');
      return;
    }
    logWindow.document.write(`<!doctype html>
<title>☆ωログ</title>
<style>
*{margin:0;padding:0}
html,body,textarea{width:100%;height:100%;box-sizing:border-box}
body{overflow:hidden}
textarea{padding:5px;resize:none;height:calc(100% - 10px)}
</style>
<input type="text" style="box-sizing:border-box;width:100%"><textarea readonly></textarea>`);
    logWindow.document.close();
    logWindow.document.body.firstElementChild.onkeypress = function (e) {
      if (this.value && event.key === 'Enter') {
        Bot.comment(this.value);
        this.value = '';
      }
    };
    logWindow.onfocus = () => {
      logWindow.document.body.firstElementChild.focus();
    };
  };
  var writeLog = function (s) {
    if (!logWindow || logWindow.closed)
      return;
    var textarea = logWindow.document.body.lastElementChild;
    textarea.value = s + '\n' + textarea.value;
  };

  addEventListener('storage', event => {
    if (event.key !== 'extensionConfig')
      return;
    extensionConfig = JSON.parse(event.newValue);
    applyConfig();
  });
  var extCSS = document.createElement('style');
  var metaViewport = createElement('meta', {name:'viewport'});
  var sound;
  var applyConfig = function () {
    var cssText = '#extensionMessage{color:red;font-weight:bold;padding-left:1em}';
    if (extensionConfig.invisibleMode) {
      cssText += '.panel-container:first-child{height:50px!important;overflow:hidden}.room>:not(:last-child){display:none!important}';
      document.title = '☆';
      Object.defineProperty(document, 'title', { get: ()=>'☆', set: s => document.querySelector('title').text = s, configurable: true});
    }
    if (extensionConfig.hideTimestamp)
      cssText += '.log-row span:last-child{display: none}';
    cssText += extensionConfig.smartMode ? '.setting-bar-center{display:none}' : '[id=silence],[for=silence],[id=smartInput]{display:none}';
    extCSS.textContent = cssText;
    metaViewport.setAttribute('content', extensionConfig.smartMode ? 'width=1000px' : 'width=device-width');
    if (extensionConfig.notifySoundURL) {
      sound = new Audio(extensionConfig.notifySoundURL);
      sound.volume = extensionConfig.notifySoundVolume;
    } else {
      sound = null;
    }
    onbeforeunload = extensionConfig.onbeforeunload ? () => 1 : null;
    if (extensionConfig.bot)
      Bot(extensionConfig.bot);
  };
  applyConfig();

  var pngCache = {};
  var lastActive;
  var isActive = () => document.hasFocus() && (new Date()).getTime() - lastActive < 30000;
  addEventListener('keypress', () => lastActive = (new Date()).getTime());
  addEventListener('mousemove', () => lastActive = (new Date()).getTime());
  var mention;
  var mentionNotification = async function (user, cmt, onclick) {
    mention = new Notification(user.name, {
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

  const RS = '\x1e';
  var ignoreInfo = {};
  var addUser = u => {
    if (u.name && u.name.length > +extensionConfig.maxName)
      u.name = u.name?.slice(0, +extensionConfig.maxName);
    if (u.stat && u.stat.length > +extensionConfig.maxStat)
      u.stat = u.stat.slice(0, +extensionConfig.maxStat);
    u.x = Math.min(+extensionConfig.maxX, u.x);
    u.y = Math.min(+extensionConfig.maxY, u.y);
    u.shiro = '◇' + u.ihash.slice(0, 6);
    u.kuro = u.trip ? '◆' + u.trip : '';
    u.fullName = (u.name || '') + u.shiro + u.kuro;
    if (u.trip && extensionConfig.forcedShiro)
      u.name += u.shiro;
    Bot.users[u.id] = u;
    if (!match(u.fullName, extensionConfig.allowList) && match(u.fullName, extensionConfig.denyList))
      ignoreInfo[u.ihash] = true;
  };
  try {
    var segmenter = new Intl.Segmenter('ja', {granularity: 'word'});
  } catch (err) {}
  var calcRedundancy = function (msg) {
    msg = msg?.replace(/[wWｗＷ]+/g, 'ｗ').replace(/[！!]+/g, '!').replace(/[ー～]+/g, 'ー') || '';
    if (segmenter) {
      var words = new Set();
      var list = [...segmenter.segment(msg)];
      list.forEach(value => words.add(value.segment));
      return list.length / words.size;
    } else {
      var tmp = msg, compressedMsg;
      while ((compressedMsg = tmp.replace(/([\s\S]+)\1+/g, '')).length !== tmp.length)
        tmp = compressedMsg;
      return msg.length / compressedMsg.length;
    }
  };
  const MAX_LOGSIZE = 4;
  window.scoreLog = [];
  var calcScore = (id, msg) => {
    var user = Bot.users[id];
    if (!user)
      return;
    var messageLog = user.messageLog = user.messageLog || [];
    messageLog.unshift(msg);
    if (messageLog.length > MAX_LOGSIZE)
      messageLog.length = MAX_LOGSIZE;
    var timeLog = user.timeLog = user.timeLog || [];
    timeLog.unshift((new Date()).getTime());
    if (timeLog.length > MAX_LOGSIZE)
      timeLog.length = MAX_LOGSIZE;
    user.score = user.redundancy = 0;
    var msgs = '';
    if (messageLog.length > 1) {
      var duration = timeLog[0] - timeLog[timeLog.length - 1];
      msgs = messageLog.slice(0, -1).join('\n');
      user.redundancy = calcRedundancy(msgs);
      user.score = 1000 * user.redundancy * msgs.length / duration || 0;
    }
    if (extensionConfig.monitorScore)
      scoreLog.push([user.score, user.redundancy, msgs.length, user.fullName, msg]);
  };
  var disableUpdate;
  var token;
  var astralParser = eventData => {
    if (!/^42/.test(eventData))
      return eventData;
    try {
      var data = JSON.parse(eventData.slice(2));
    } catch (err) {
      return eventData;
    }
    switch (data[0]) {
      case 'AUTH':
        token = data[1].token;
        Bot.myId = data[1].id;
        break;
      case 'USER':
        var oldUsers = Bot.users;
        Bot.users = {};
        data[1].forEach(u => {
          addUser(u);
          if (oldUsers[u.id])
            Bot.users[u.id] = Object.assign(oldUsers[u.id], Bot.users[u.id]);
        });
        var hashTable = {};
        data[1].forEach(u => {
          if (ignoreInfo[u.ihash])
            hashTable[u.ihash] = true;
        });
        Object.keys(hashTable).forEach(ihash => Bot.ignore(ihash, true));
        break;
      case 'ENTER':
        addUser(data[1]);
        if (ignoreInfo[data[1].ihash])
          Bot.ignore(data[1].ihash, true);
        writeLog(data[1].fullName + `が入室(${data[1].type}) x=${data[1].x} y=${data[1].y} r=${data[1].r} g=${data[1].g} b=${data[1].b}`);
        if (data[1].id === Bot.myId)
          setTimeout(() => writeLog('==========\nメンバー一覧\n' + Object.values(Bot.users).map(u=>u.fullName).join('\n') + '\n=========='), 0);
        calcScore(data[1].id, '');
        break;
      case 'EXIT':
        delete Bot.users[data[1].id];
        break;
      case 'COM':
        if (!Bot.users[data[1].id])
          var unknown = Bot.users[data[1].id] = {id: data[1].id, name: 'UNKNOWN BUG', type: 'unknown', stat: '通常', ihash: data[1].id.slice(-10), x: 0, y: 350, scl: 100, r: 100, g: 100, b: 100};
        var user = Bot.users[data[1].id];
        user.cmt = data[1].cmt;
        if (user.ignored || user.hidden)
          break;
        
        calcScore(user.id, user.cmt);
        if (match(user.cmt, extensionConfig.ignoreWord) || (mikeyCheckbox?.checked && (match(user.cmt, ['/[マﾏま][イｲい][キｷき].+https://discord\\.gg/']) || user.score > +extensionConfig.killScore))) {
          Bot.ignore(user.ihash, true, user.fullName);
          break;
        }
        if (data[1].id !== Bot.myId && !isActive() && !pauseNotification && match(data[1].cmt, extensionConfig.mentionList)) {
          mentionNotification(user, data[1].cmt, function () {
            if (extensionConfig.replyMsg)
              Bot.send('COM', {cmt: extensionConfig.replyMsg});
            // Chromeはクリック時既定の動作がない
            focus();
            this.close();
          });
          if (sound)
            sound.play();
        }
        if (data[1].cmt && data[1].cmt.length > +extensionConfig.maxComment)
          data[1].cmt = data[1].cmt.slice(0, +extensionConfig.maxComment);
        if (extensionConfig.yomiageList?.length || extensionConfig.yomiageAll) {
          var comment = yomiageReplacer(data[1].cmt || '');
          if (!pauseYomiage && comment && user.lastComment !== comment && (extensionConfig.yomiageAll || match(user.fullName, extensionConfig.yomiageList))) {
            const utterThis = new SpeechSynthesisUtterance(comment);
            utterThis.rate = extensionConfig.yomiageSpeed;
            speechSynthesis.speak(utterThis);
          }
          user.lastComment = comment;
        }
        writeLog(user.fullName + '： ' + data[1].cmt);
        break;
      case 'SET':
        if (data[1].stat && data[1].stat.length > +extensionConfig.maxStat)
          data[1].stat = data[1].stat.slice(0, +extensionConfig.maxStat);
        data[1].x = Math.min(+extensionConfig.maxX, data[1].x);
        data[1].y = Math.min(+extensionConfig.maxY, data[1].y);
        if (Bot.users[data[1].id] && (data[1].id !== Bot.myId || !disableUpdate))
          Object.assign(Bot.users[data[1].id], data[1]);
        break;
      case 'IG':
        if (Bot.myId === data[1].id) {
          Object.values(Bot.users).forEach(user => {
            if (user.ihash === data[1].ihash)
              ignoreInfo[user.ihash] = user.ignored = data[1].stat === 'on';
          });
        } else if (Bot.users[Bot.myId]?.ihash === data[1].ihash) {
          Bot.users[data[1].id].hidden = data[1].stat === 'on';
        }
        break;
    }
    dispatch(data);
    return (unknown ? '42' + JSON.stringify(['ENTER', unknown]) + RS : '') + '42' + JSON.stringify(data);
  };
  var WebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var socket = new WebSocket(url, protocols);
    var listeners = [];
    var readyState = false;
    var buffer = [];
    Bot.send = function (type, obj) {
      var msg = '42' + JSON.stringify([type, Object.assign({token}, obj)]);
      if (readyState)
        socket.send(msg);
      else
        buffer.push(msg);
    };
    socket.send = function (s) {
      if (typeof s === 'string') {
        if (!readyState && s === '5') {
          readyState = true;
          queueMicrotask(() => {
            buffer.forEach(m => socket.send(m));
            buffer = null;
          });
        } else if (!s.indexOf('42["ERROR'))
          return;
        try {
          if (!s.indexOf('42["COM')) {
            var args = JSON.parse(s.slice(2));
            if (args[1]?.cmt?.[0] === '/') {
              var commandArgs = args[1].cmt.slice(1).split(' ');
              if (Bot.commands[commandArgs[0]]) {
                Bot.commands[commandArgs[0]](...commandArgs.slice(1));
                return;
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      return WebSocket.prototype.send.apply(socket, arguments);
    };
    socket.addEventListener('message', event => {
      try {
        if (/^42/.test(event.data))
          Object.defineProperty(event, 'data', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: astralParser(event.data)
          });
      } catch (err) {
        console.log(err);
      }
      listeners.forEach(listener => {
        try {
          if (listener)
            event.data.split(RS).forEach(data => {
              event.data = data;
              try {
                listener.call(event.target, event);
              } catch (err) {
                console.log(err);
              }
            });
        } catch (err) {
          console.log(err);
        }
      });
    });
    socket.addEventListener = function (type, f) {
      if (type === 'message') {
        if (!listeners.includes(listener => listener === f))
          listeners.push(f);
      } else {
        WebSocket.prototype.addEventListener.apply(socket, arguments);
      }
    };
    Object.defineProperty(socket, 'onmessage', {
      get: () => function (){},
      set: f => socket.addEventListener('message', f)
    });
    socket.removeEventListener = function (type, f) {
      WebSocket.prototype.removeEventListener.apply(socket, arguments);
      listeners = listeners.filter(listener => listener !== f);
    };
    return socket;
  };
  window.WebSocket.prototype = WebSocket.prototype;
  window.WebSocket.__proto__ = WebSocket;
  var XMLHttpRequest_open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url.indexOf('monachatchat') !== -1)
      this.addEventListener('load', () => this.responseText.split(RS).forEach(astralParser));
    return XMLHttpRequest_open.apply(this, arguments);
  };

  var configWindow, openConfig = function () {
    if (configWindow && !configWindow.closed) {
      try {
        configWindow.location.href;
        configWindow.focus();
        return;
      } catch (err) {}
    }
    configWindow = open('about:blank');
    if (!configWindow) {
      alert('ポップアップを許可してください');
      return;
    }
    configWindow.document.open();
    var configScript = function () {
      var currentValue = {};
      window.load = function (obj) {
        try {
          if (typeof obj === 'string')
            obj = JSON.parse(obj);
        } catch (err) {
          alert(err);
        }
        configInfo.forEach(item => {
          if (item.type === 'separator' || !obj.hasOwnProperty(item.key))
            return;
          var element = document.getElementById(item.key), value = obj[item.key];
          switch (item.type) {
            case 'textarea':
            case 'input':
              element.value = value;
              break;
            case 'list':
              element.innerHTML = '';
              value?.forEach?.(option => element.appendChild(document.createElement('option')).text = option);
              break;
            default:
              if (item.type?.constructor === Array)
                element.selectedIndex = value;
          }
        });
        Object.assign(currentValue, obj);
      };
      var update = function (key, value) {
        if (key)
          currentValue[key] = value;
        localStorage.setItem('extensionConfig', JSON.stringify(currentValue));
      };
      var downloadLink = document.createElement('a'), file = document.createElement('input'), reader = new FileReader();
      file.type = 'file';
      file.accept = '.json';
      file.onchange = function () {
        reader.readAsText(file.files[0]);
        file.value = '';
      };
      reader.onload = function () {
        load(reader.result);
        update();
      };
      var append = function (tagName, attr) {
        var element = document.body.appendChild(document.createElement(tagName));
        Object.assign(element, attr);
        return element;
      };
      var fileMenu = append('select');
      fileMenu.appendChild(document.createElement('option')).text = '設定ファイル';
      fileMenu.appendChild(document.createElement('option')).text = '開く...';
      fileMenu.appendChild(document.createElement('option')).text = '保存...';
      fileMenu.selectedIndex = 0;
      fileMenu.onchange = function () {
        switch (fileMenu.selectedIndex) {
          case 1:
            file.click();
            break;
          case 2:
            URL.revokeObjectURL(downloadLink.href);
            downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(currentValue, null, 2) + '\n'], {type: 'application/octet-stream'}));
            downloadLink.download = 'astral-omega-extension-config.json';
            downloadLink.click();
            break;
        }
        fileMenu.selectedIndex = 0;
      };
      append('input', {
        type: 'button',
        value: '設定ページを閉じる',
        onclick: function () {
          close();
        }
      }).style.marginLeft = '5em';
      configInfo.forEach(item => {
        switch (item.type) {
          case 'separator':
            append('hr');
            append('h1').textContent = item.name;
            if (item.description)
              append('p').textContent = item.description;
            return;
          case 'textarea':
          case 'input':
            append('h2').textContent = item.name;
            if (item.description)
              append('p').textContent = item.description;
            var input = append(item.type, {id: item.key, spellcheck: false});
            if (item.type === 'input') {
              input.type = 'text';
              input.setAttribute('style', 'width:20em;max-width:50vw');
            } else {
              input.setAttribute('style', 'width:80em;max-width:80vw;height:8em');
            }
            append('input', {
              type: 'button',
              value: 'Apply',
              onclick: function () {
                update(item.key, input.value);
              }
            });
            break;
          case 'list':
            append('h2').textContent = item.name;
            if (item.description)
              append('p').textContent = item.description;
            var addText = append('input', {
              type: 'text',
              onkeypress: function (event) {
                if (event.key === 'Enter')
                  addButton.click();
              }
            });
            addText.setAttribute('style', 'width:20em;max-width:50vw;box-sizing:border-box');
            var addButton = append('input', {
              type: 'button',
              value: 'Add',
              onclick: function () {
                if (!addText.value)
                  return;
                if (/^\/.+\/([dgimsuy]*)$/i.test(addText.value)) {
                  try {
                    new RegExp(addText.value.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
                  } catch (err) {
                    alert('正規表現の書き方が違う:' + err);
                    return;
                  }
                }
                select.appendChild(document.createElement('option')).text = addText.value;
                addText.value = '';
                update(item.key, Array.from(select.options).map(option => option.value));
              }
            });
            append('br');
            var select = append('select', {
              id: item.key,
              size: 4
            });
            select.setAttribute('style', 'width:20em;max-width:50vw;box-sizing:border-box');
            append('input', {
              type: 'button',
              value: 'Delete',
              onclick: function () {
                var i = select.selectedIndex;
                select.remove(i);
                select.selectedIndex = Math.min(i, select.options.length - 1);
                update(item.key, Array.from(select.options).map(option => option.value));
              }
            });
            break;
          case 'onoff':
            item.type = ['OFF', 'ON'];
          default:
            if (item.type?.constructor !== Array)
              break;
            append('h2').textContent = item.name;
            if (item.description)
              append('p').textContent = item.description;
            var select = append('select', {
              id: item.key,
              onchange: function () {
                update(item.key, select.selectedIndex);
              }
            });
            item.type?.forEach?.(option => select.appendChild(document.createElement('option')).text = option);
            break;
        }
      });
    };
    configWindow.document.write(`<!doctype html>\n<head><title>☆ω拡張設定</title><meta name="viewport" content="width=device-width"></head><body><script>var configInfo = ${JSON.stringify(configInfo)};(${configScript})();load(${JSON.stringify(extensionConfig)})</script></body>`);
    configWindow.document.close();
  };
  var createMenu = function (list) {
    var select = document.createElement('select');
    list = list.filter(opt => {
      if (opt.oninit?.() === false)
        return false;
      opt.element = document.createElement('option');
      if (opt.type === 'toggle') {
        opt.toggle = () => {
          opt.checked = !opt.checked;
          opt.element.text = (opt.checked ? '☑ ' : '☐ ') + opt.name;
        };
        opt.toggle();
        opt.toggle();
      } else {
        opt.element.text = opt.name;
      }
      select.append(opt.element);
      return true;
    });
    select.onchange = () => {
      var opt = list[select.selectedIndex];
      if (opt.type === 'toggle')
        opt.toggle();
      opt.onclick?.(opt.checked);
      select.selectedIndex = 0;
    };
    return select;
  };
  var silence = new Audio();
  silence.src = 'data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  silence.loop = true;
  var pauseNotification, pauseYomiage;
  var menu = createMenu([
    {
      name: '拡張メニュー',
    },
    {
      name: '音声入力',
      type: 'toggle',
      oninit: function () {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition)
          return false;
        var r = this.recognition = new SpeechRecognition();
        r.lang = 'ja-JP';
        r.continuous = true;
        r.onresult = function (event) {
          var result = [];
          for (var i = event.resultIndex; i < event.results.length; i++)
                if (event.results[i].isFinal)
              result.push(event.results[i][0].transcript);
          var r = result.join(' ');
          if (r)
            Bot.send('COM', {cmt: r});
        };
        r.onend = () => {
          if (this.checked)
            r.start();
        };
      },
      onclick: function (checked) {
        if (checked)
          navigator.permissions.query({name:'microphone'}).then(result => {
            if (result.state === 'denied') {
              alert('マイクへのアクセスを許可していないので使えません。許可したい場合は自分でサイト設定をいじってください。');
              this.toggle();
            }
          });
        this.recognition[checked ? 'start' : 'stop']();
      }
    },
    {
      name: '通知一時停止',
      type: 'toggle',
      oninit: () => !!window.Notification,
      onclick: checked => {
        pauseNotification = checked;
      }
    },
    {
      name: '読み上げ一時停止',
      type: 'toggle',
      oninit: () => !!window.speechSynthesis,
      onclick: checked => {
        if (pauseYomiage = checked)
          speechSynthesis.cancel();
      }
    },
    {
      name: '読み上げ再起動',
      oninit: () => !!window.speechSynthesis,
      onclick: () => speechSynthesis.cancel()
    },
    {
      name: '通知を許可',
      oninit: () => !!window.Notification && Notification.permission !== 'granted',
      onclick: () => Notification.requestPermission().then(
        permission => alert(permission === 'granted' ? '許可されました。' : '通知拒否に設定されているので、許可したい場合は自分でサイト設定をいじってください。')
      )
    }
  ]);
  var showMessage = function (s) {
    var m = document.getElementById('extensionMessage');
    if (m)
      m.textContent = s;
  };
  var alertOnce = (msg, id) => {
    if (localStorage.getItem('extensionAlert/' + id))
      return;
    localStorage.setItem('extensionAlert/' + id, 'a');
    alert(msg);
  };
  var observedSelectors = [];
  var observer = new MutationObserver(() => {
    observedSelectors = observedSelectors.filter(obj => {
      var element = document.querySelector(obj.selector);
      if (element)
        obj.resolve(element);
      else
        return true;
    });
    if (!observedSelectors.length)
      observer.disconnect();
  });
  var querySelectorAsync = async selector => document.querySelector(selector) || new Promise(resolve => {
    if (!observedSelectors.length)
      observer.observe(document.body, {subtree: true, childList: true});
    observedSelectors.push({selector, resolve});
  });
  var createController = function (settings) {
    var element = document.createElement('div');
    element.innerHTML = `
<div class="up" style="width:100%;height:100%;position:absolute;top:0;left:0;clip-path: polygon(2% 0, 98% 0, 50% 48%)"></div>
<div class="right" style="width:100%;height:100%;position:absolute;top:0;left:0;clip-path: polygon(52% 50%, 100% 2%, 100% 98%)"></div>
<div class="down" style="width:100%;height:100%;position:absolute;top:0;left:0;clip-path: polygon(50% 52%, 98% 100%, 2% 100%)"></div>
<div class="left" style="width:100%;height:100%;position:absolute;top:0;left:0;clip-path: polygon(0 2%, 48% 50%, 0 98%)"></div>
`;
    element.setAttribute('style', 'clip-path:circle(50%);position:relative');
    element.style.width = element.style.height = settings.size + 'px';
    var getDirection = ({top, left, width, height, x, y}) => {
      x -= left + width / 2;
      y -= top + height / 2;
      return ['left', 'up', 'down', 'right'][(x > y) + (x > -y) * 2];
    };
    var currentDirection, touchTimer;
    var paint = () => Array.from(element.children).forEach(e => e.style.backgroundColor = e.className === currentDirection ? '#6366f1' : 'white');
    paint();
    var updateDirection = e => {
      if (e) {
        var {top, left, width, height} = e.target.getBoundingClientRect();
        currentDirection = getDirection(Object.assign({top, left, width, height}, {x: e.clientX, y: e.clientY}));
      } else {
        currentDirection = null;
      }
      paint();
    };
    element.addEventListener('pointerdown', e => {
      e.target.setPointerCapture(e.pointerId);
      updateDirection(e);
      var count = 0;
      settings.onstart();
      settings.onpress(currentDirection, ++count);
      clearInterval(touchTimer);
      touchTimer = setInterval(() => settings.onpress(currentDirection, ++count), settings.interval);
      e.preventDefault();
    });
    element.addEventListener('pointermove', e => {
      if (!currentDirection)
        return;
      updateDirection(e);
    });
    element.addEventListener('pointerup', e => {
      clearInterval(touchTimer);
      updateDirection();
      settings.onend();
      e.target.releasePointerCapture(e.pointerId);
    });
    element.addEventListener('touchstart', e => e.preventDefault());
    return element;
  };
  var mikeyCheckbox;
  addEventListener('load', () => {
    var defaultWidth = document.documentElement.clientWidth;
    document.querySelector('head').appendChild(extCSS);
    document.querySelector('meta[name=viewport]')?.remove();
    document.querySelector('head').appendChild(metaViewport);
    var div = document.createElement('div');
    div.append(menu);
    div.append(createElement('button', {
      textContent: 'ログ窓',
      onclick: openLog
    }));
    div.append(createElement('button', {
      textContent: '拡張設定',
      onclick: openConfig
    }));
    div.append(mikeyCheckbox = createElement('input', {
      type: 'checkbox',
      id: 'mikey',
      onclick: () => {
        alertOnce('荒らし対策は誤検出されやすいため、荒らしが来た時だけ有効にしてください。', 'mikey');
      }
    }));
    div.append(createElement('label', {
      htmlFor: 'mikey',
      textContent: '荒らし対策'
    }));
    div.append(createElement('input', {
      type: 'checkbox',
      id: 'silence',
      onclick: function () {
        silence[this.checked ? 'play' : 'pause']();
      }
    }));
    div.append(createElement('label', {
      htmlFor: 'silence',
      textContent: 'スマホ接続維持'
    }));
    div.append(createElement('span', {id:'extensionMessage'}));
    document.body.firstElementChild.before(div);
    querySelectorAsync('.panel-container').then(element => {
      var input = createElement('input', {
        type: 'text',
        id: 'smartInput',
        placeholder: 'スマホ入力用',
        onkeydown: e => {
          if (e.target.value && e.key === 'Enter') {
            Bot.comment(e.target.value);
            e.target.value = '';
            e.stopImmediatePropagation();
          }
        }
      });
      input.setAttribute('style', 'width:1000px;font-size:' + Math.ceil(16000 / defaultWidth) + 'px');
      element.after(input);
      var controller = createController({
        onstart: () => disableUpdate = true,
        onend: () => disableUpdate = false,
        onpress: (direction, count) => {
          var myself = Bot.users[Bot.myId];
          if (!myself)
            return;
          var attr = {up: {y: -2}, down: {y: 2}, right: {x: 5}, left: {x: -5}}[direction];
          Object.keys(attr).forEach(key => {
            attr[key] *= count < 2 ? 5 : count < 4 ? 20 : 40;
            attr[key] += myself[key];
          });
          Bot.set(attr);
        },
        size: 64000 / defaultWidth,
        interval: 250
      });
      controller.style.marginLeft = 'auto';
      input.after(controller);
    });
  });
  document.addEventListener('click', e => speechSynthesis.speak(new SpeechSynthesisUtterance('')), {once:true});
};
try {
  window.eval('(' + inject + ')()');
} catch (err) {
  alert('拡張機能でエラーが出ました。以下のエラーを報告してください。\n' + err);
}
