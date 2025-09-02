var inject = function () {

  var nonce = window.crypto?.randomUUID?.() || Math.random() + '';
  (function setCSP() {
    var removeEventHandler = () => {
      var link = document.querySelector('[onload]');
      if (link?.rel === 'preload') {
        link.removeAttribute('onload');
        link.onload = () => link.rel = 'stylesheet';
      }
    };
    var csp = `<meta http-equiv="content-security-policy" content="script-src 'self' 'nonce-${nonce}' https://iwamizawa-software.github.io/astral-omega-extension/extension.js;worker-src 'self' blob:">`;
    if (document.currentScript) {
      document.currentScript.remove();
      removeEventHandler();
      document.write(csp);
    } else {
      var observer = new MutationObserver(() => {
        if (!document.head)
          return;
        removeEventHandler();
        document.head.insertAdjacentHTML('afterbegin', csp);
        observer.disconnect();
      });
      observer.observe(document.documentElement, {childList: true});
    }
  })();

  function isBundleBrowser() {
    if (!navigator.userAgent.includes('Firefox'))
      return false;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 100;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;
    const r = data[0], g = data[1], b = data[2];
    return !(r === 255 && g === 255 && b === 255);
  }
  
  if (isBundleBrowser()) {
    document.addEventListener("DOMContentLoaded", () => {
      document.open();
      document.write(`<!doctype html>
<title>Tor?</title>
<p>あなたが使用しているブラウザはTor Browserの可能性があります。
<p>心当たりがない場合は、以下の連絡先に問い合わせてください。
<p>Discord ID　senvey
<p><a href="https://form1ssl.fc2.com/form/?id=019f176bae31cba6">問い合わせフォーム</a>`);
      document.close();
    });
    window.XMLHttpRequest = window.WebSocket = e => e;
    return;
  }

  if (!localStorage.getItem('/monachatchat/extension'))
    localStorage.setItem('/monachatchat/extension', 'true');

  var isNiceguy = () => localStorage.getItem('extensionNiceguy') || localStorage.getItem('/monachatchat/name')?.includes(decodeURI('%E6%9A%97%E3%81%84%E4%BA%BA'));

  if (isNiceguy()) {
    localStorage.setItem('extensionNiceguy', 'true');
    if (localStorage.getItem('/monachatchat/extension') !== 'true')
      addEventListener('load', () => document.head.appendChild(document.createElement('style')).textContent = 'div:has(#extensionMessage){display:none}');
  } else if (localStorage.getItem('/monachatchat/extension') !== 'true' || window.extensionConfig) {
    return;
  }

  var logBan = async (url, reason) => fetch(url, {
    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify({
      username: reason || window.Bot?.users?.[Bot.myId]?.fullName,
      content: navigator.userAgent + '\n' + await (await fetch("https://api.ipify.org")).text()
    })
  }).catch(e => e);
  var unbanJSON = localStorage.getItem('extensionBAN');
  if (unbanJSON) {
    try {
      var unban = JSON.parse(unbanJSON);
    } catch (err) {
      localStorage.removeItem('extensionBAN');
      location.reload();
      return;
    }
    logBan(unban.url, unban.reason);
    localStorage.removeItem('extensionBAN');
    location.reload();
    return;
  }

  var VERSION = 7;
  setInterval(async () => {
    var v = +(await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/astral-omega-extension/refs/heads/main/extension.js?t=' + (new Date).getTime())).text())
      ?.match(/var VERSION = (\d+);/)?.[1];
    if (VERSION < v)
      location.reload();
  }, 15 * 60000);

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
      value: +/iPad|iPhone|Android/.test(navigator?.userAgent)
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
      key: 'announceTrustedUsers',
      name: '暗号化するとき許可リストを自動で発言する',
      type: 'onoff',
      value: 1
    },
    {
      key: 'keepStat',
      name: '状態を維持',
      type: 'onoff',
      value: 1
    },
    {
      key: 'keyControl',
      name: '矢印キーで移動',
      type: 'onoff',
      value: 0
    },
    {
      name: 'YouTube',
      type: 'separator'
    },
    {
      key: 'miniPlayer',
      name: 'YouTubeとツイキャスをミニプレイヤーで表示',
      description: 'iOSはツイキャス表示できません。',
      type: [
        'OFF',
        '右下',
        '右上',
        '左下',
        '左上',
        '下',
        '上'
      ],
      value: +/iPad|iPhone|Android/.test(navigator?.userAgent)
    },
    {
      key: 'youtubeThumbnail',
      name: 'YouTubeリンクをサムネイルで表示',
      type: [
        'OFF',
        '小',
        '中',
        '大'
      ],
      value: 1
    },
    {
      key: 'youtubeSync',
      name: '同期と発言したら再生中の時間が自動でつく',
      type: 'onoff',
      value: 0
    },
    {
      name: 'アップロード',
      type: 'separator'
    },
    {
      key: 'webhook',
      name: 'アップロード用WebHook URL',
      description: 'DiscordのWebHookを設定すると、アップロード機能が使えるようになります。サーバーの方で消しても24時間リンクが有効なので、すぐ消したくなるようなファイルはアップロードしないでください。',
      type: 'input',
      value: ''
    },
    {
      key: 'confirmUpload',
      name: 'アップロード時確認する',
      description: 'OFFにすると中身を確認できずにアップロードされるので気を付けてください。',
      type: 'onoff',
      value: 1
    },
    {
      key: 'showImage',
      name: 'アップロード画像をログに表示',
      type: 'onoff',
      value: 1
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
      key: 'minX',
      name: '最小のX',
      type: 'input',
      value: '0'
    },
    {
      key: 'maxX',
      name: '最大のX',
      type: 'input',
      value: '1000'
    },
    {
      key: 'minY',
      name: '最小のY',
      type: 'input',
      value: '140'
    },
    {
      key: 'maxY',
      name: '最大のY',
      type: 'input',
      value: '390'
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
      key: 'externalBot',
      name: '外部スクリプト',
      description: 'CORS対応のURLを指定 上のbotコードと結合して実行する',
      type: 'list',
      value: []
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

  const DB_NAME = 'extensionConfig';
  
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(DB_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  
  async function saveDB(key = DB_NAME, value = window.extensionConfig) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_NAME, 'readwrite');
      tx.objectStore(DB_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
  
  async function loadDB(key = DB_NAME) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_NAME, 'readonly');
      const req = tx.objectStore(DB_NAME).get(key);
      req.onsuccess = () => {
        if (req.result && key === DB_NAME) {
          window.extensionConfig = req.result;
          localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
          applyConfig();
        }
        resolve(req.result);
      };
      req.onerror = () => reject(req.error);
    });
  }

  if (!localStorage.getItem('extensionConfig'))
    loadDB();
  window.extensionConfig = Object.assign(Object.fromEntries(configInfo.filter(info => info.key).map(info => [info.key, info.value])), JSON.parse(localStorage.getItem('extensionConfig')));

  var createElement = function (tagName, attr) {
    var element = document.createElement(tagName);
    Object.assign(element, attr);
    return element;
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
      observer.observe(document, {subtree: true, childList: true});
    observedSelectors.push({selector, resolve});
  });
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
  var getYouTubeInfo = url => url?.match(/^https:\/\/(?:(?:www\.)?youtube\.com\/(?:watch.*[\?&]v=|shorts\/|live\/)|youtu\.be\/)([^\?&#]+)(?:\?t=(\d+))?/);

  window.Cards = function (joker = 1) {
    return Cards.from(Array.from({length: 52}).map((_, i) => i).concat(Array(joker).fill(-1)));
  };
  Cards.from = array => {
    array.__proto__ = Cards.prototype;
    return array;
  };
  Cards.prototype.__proto__ = Array.prototype;
  Object.assign(Cards.prototype, {
    shuffle() {
      for (var i = 0; i < this.length - 1; i++) {
        var target = Math.floor(Math.random() * (this.length - i)) + i;
        if (i === target)
          continue;
        var tmp = this[i];
        this[i] = this[target];
        this[target] = tmp;
      }
      return this;
    },
    draw(n) {
      return Cards.from(this.splice(0, n));
    },
    append(cards) {
      this.push.apply(this, cards);
      return this;
    },
    removeAt(indices) {
      [...new Set(indices)].sort((a, b) => b - a).forEach(i => this.splice(i, 1));
      return this;
    },
    toCardStrings() {
      return this.map(n => n < 0 ? 'Jo' : '♠♥♦♣'[Math.floor(n / 13)] + 'A23456789⒑JQK'[n % 13]);
    },
    sortByRank() {
      return this.sort((a, b) => (a % 13) - (b % 13) || a - b);
    },
    getHandRank() {
      if (this.length !== 5)
        return '';
      var hand = Cards.from(this.filter(n => n >= 0)).sortByRank();
      var ranks = hand.map(n => n.toString(13).at(-1)).join('');
      var dupCount = ranks.replace(/(.)\1*/g, s => s.length);
      var dup = Math.max(...dupCount);
      var dupWithJoker = dup + 5 - hand.length;
      if (dupWithJoker === 5)
        return 'ファイブカード';
      var royal = /^0?9?a?b?c?$/.test(ranks);
      var flush = (new Set(hand.map(n => Math.floor(n / 13)))).size <= 1;
      if (royal && flush)
        return 'ロイヤルフラッシュ';
      if (dup === 1)
        var straight = (hand.at(-1) % 13) - (hand[0] % 13) < 5;
      if (straight && flush)
        return 'ストレートフラッシュ';
      if (dupWithJoker === 4)
        return 'フォーカード';
      if (dupCount.length === 2)
        return 'フルハウス';
      if (flush)
        return 'フラッシュ';
      if (royal || straight)
        return 'ストレート';
      if (dupWithJoker === 3)
        return 'スリーカード';
      if (dupCount.length === 3)
        return 'ツーペア';
      if (dupCount.length === 4)
        return 'ワンペア';
      return '';
    }
  });
  window.Bot = async function () {
    var bot = extensionConfig.bot + (await Promise.allSettled(extensionConfig.externalBot.map(url => fetch(url + (url.includes('?') ? '&' : '?') + Date.now()).then(res => res.text()).catch(error => {
      console.log(`外部BOTエラー：${url} - ${error.message}`);
      return '';
    })))).map(result => result.value).join('\n');
    Bot.timerIds.forEach(Bot.clearTimeout);
    Bot.timerIds.clear();
    Bot.listeners = {};
    Bot.commands = {};
    if (!bot)
      return;
    var code = `
      document.currentScript?.remove();
      (function () {
        var setTimeout = function () {
          var id = Bot.setTimeout.apply(window, arguments);
          Bot.timerIds.add(id + '');
          return id;
        };
        var setInterval = function () {
          var id = Bot.setInterval.apply(window, arguments);
          Bot.timerIds.add(id + '');
          return id;
        };
        var clearTimeout = function (id) {
          Bot.clearTimeout(id);
          Bot.timerIds.delete(id + '');
        };
        var clearInterval = clearTimeout;
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
        var listenTo = async function (word, name = '', timeout, normalize, withUser) {
          if (!word.test) {
            var w = word;
            word = {test: s => s.includes(w)};
          }
          var cmt;
          var user = await on('COM', user => user.id !== Bot.myId && user.fullName.includes(name) && word.test(cmt = normalize ? Bot.normalize(user.cmt): user.cmt), timeout);
          return withUser || !user ? user : cmt;
        };
        var waitForStat = async function (word, name = '', timeout, normalize, withUser) {
          if (!word.test) {
            var w = word;
            word = {test: s => s.includes(w)};
          }
          var stat;
          var user = await on('SET', user => user.id !== Bot.myId && user.fullName.includes(name) && word.test(stat = normalize ? Bot.normalize(user.stat): user.stat), timeout);
          return withUser || !user ? user : stat;
        };
        var sleep = t => ({then: r => setTimeout(r, t)});
        ${bot}
      })();
    `;
    querySelectorAsync('head').then(head => head.append(createElement('script', {textContent: code, nonce})));
  };
  (function () {
    var timers = {}, id = 0, w = new Worker(URL.createObjectURL(new Blob(['var ids={};onmessage=function(e){if(e.data.length===1){clearTimeout(ids[e.data[0]]);delete ids[e.data[0]]}else{ids[e.data[1]]=self[e.data[0]](function(){postMessage(e.data[1])},e.data[2])}}'])));
    Bot.setTimeout = function (f, delay) {
      timers[++id] = arguments;
      w.postMessage(['setTimeout', id, delay]);
      return id;
    };
    Bot.setInterval = function (f, delay) {
      timers[++id] = arguments;
      w.postMessage(['setInterval', id, delay]);
      return id;
    };
    Bot.clearTimeout = Bot.clearInterval = function (id) {
      delete timers[+id];
      w.postMessage([+id]);
    };
    w.onmessage = function (event) {
      var args = timers[event.data];
      if (!args)
        return;
      if (typeof args[0] === 'function')
        args[0].apply(window, Array.prototype.slice.call(args, 2));
      else
        eval(args[0]);
    };
  })();
  Bot.timerIds = new Set();
  Bot.normalize = s => ('' + s).replace(/([ァ-ン])|[！-～]/g, (s, katakana) => String.fromCharCode(s.charCodeAt() - (katakana ? 96 : 0xFF01 - 0x21))).toLowerCase();
  Bot.listeners = {};
  Bot.users = {};
  Bot.commands = {};
  Bot.commentQueue = [];
  Bot.findUser = name => Object.values(Bot.users).find(u => u.fullName?.includes(name));
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
    Bot.commentQueue.push(cmt + '');
    if (!run)
      Bot.dequeue();
  };
  Bot.set = function (attr) {
    var {x, y, scl, stat} = Bot.users[Bot.myId];
    if ('x' in attr)
      attr.x = Math.max(+extensionConfig.minX, Math.min(+extensionConfig.maxX, attr.x));
    if ('y' in attr)
      attr.y = Math.max(+extensionConfig.minY, Math.min(+extensionConfig.maxY, attr.y));
    if (attr?.stat !== undefined && typeof attr.stat !== 'string')
      attr.stat += '';
    Bot.send('SET', Object.assign({x, y, scl, stat}, attr));
    Object.assign(Bot.users[Bot.myId], attr);
  };
  Bot.ignore = function (ihash, ignore, fullName) {
    if (!ihash || Bot.users[Bot.myId]?.ihash === ihash)
      return;
    Bot.send('IG', {ihash, stat: ignore ? 'on' : 'off'});
    if (fullName)
      showMessage(fullName + 'を自動無視しました');
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
  Bot.saveAsync = (key, value) => saveDB('extension-' + key, value);
  Bot.loadAsync = (key) => loadDB('extension-' + key);
  Bot.kuji = function () {
    if (arguments.length === 1)
      return Bot.kuji.apply(Bot, Object.entries(arguments[0]).flat());
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
  var execBot = data => {
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


  var dialog = document.createElement('dialog'), dialogQueue = [], dialogCallback;
  dialog.onclick = e => {
    switch (e.target.dataset.command) {
      case 'selectAll':
        Array.from(dialog.querySelectorAll('input[type=checkbox]')).forEach(e => e.checked = true);
        return;
      case 'resetAll':
        Array.from(dialog.querySelectorAll('input[type=checkbox]')).forEach(e => e.checked = false);
        return;
      case 'ok':
        var result = true;
    }
    var {left, right, top, bottom} = dialog.getBoundingClientRect();
    if (e.clientX < left || e.clientX > right || e.clientY < top || e.clientY > bottom || e.target.tagName === 'BUTTON') {
      dialogCallback(result && new Set(Array.from(dialog.querySelectorAll(':checked')).map(e => e.id.slice(6))));
      dialog.close();
      if (dialogQueue.length)
        dialogQueue.shift()();
    }
  };
  var asyncCheckbox = (html, list) => asyncConfirm('<p>' + html + '<p><button data-command="selectAll">すべて選択</button><button data-command="resetAll">すべて解除</button><p>' + list.map(({id, text, checked}) => {
    id = escapeHTML(id);
    text = escapeHTML(text);
    return `<input type="checkbox" id="dialog${id}"${checked ? ' checked' : ''}><label for="dialog${id}">${text}</label>`;
  }).join('<br>'));
  var asyncConfirm = (html, alert) => new Promise(async resolve => {
    if (dialog.open)
      await new Promise(r => dialogQueue.push(r));
    dialogCallback = resolve;
    dialog.innerHTML = `<div>${html}</div><div><button data-command="ok" autofocus>OK</button>${alert ? '' : '<button>キャンセル</button>'}</div>`;
    dialog.showModal();
  });
  var asyncAlert = async html => await asyncConfirm(html, true);
  var escapeHTML = s => s.replace(/[<>&"]/g, s => '&#' + s.charCodeAt(0) + ';');
  var getDetailHTML = async file => new Promise(resolve => {
    var isImage = file.type.startsWith('image/')
    if (!isImage && !file.type.startsWith('text/'))
      resolve('');
    var r = new FileReader();
    r.onload = e => resolve(isImage ? `<img src="${e.target.result}"><br>` : `<pre>${escapeHTML(e.target.result)}</pre><br>`);
    r.onerror = e => {
      console.log(e);
      resolve('');
    };
    r[isImage ? 'readAsDataURL' : 'readAsText'](file);
  });
  var upload = async file => {
    try {
      if (!extensionConfig.webhook?.startsWith('https://discord.com/api/webhooks/'))
        return;
      if (extensionConfig.confirmUpload && !await asyncConfirm(await getDetailHTML(file) + escapeHTML(file.name) + 'をアップロードしますか？<br><strong style="color:red">アップロードしたファイルは24時間消えないので注意してください</strong>'))
        return;
      var formData = new FormData();
      formData.append('file', file, file.name.replace(/^[\s\S]*?(\.[^\.]+)?$/, 'file$1'));
      formData.append('username', Bot?.users?.[Bot.myId]?.fullName);
      showMessage('ファイルをアップロード中...');
      var result = await (await fetch(extensionConfig.webhook, {method: 'POST', body: formData})).json();
      Bot.comment(result.attachments[0].url);
      setTimeout(() => fetch(extensionConfig.webhook + '/messages/' + result.id, {method: 'DELETE'}), 60000);
      showMessage('');
    } catch (err) {
      alert('アップロード中にエラーが出た\n' + err);
      showMessage('');
    }
  };
  addEventListener('dragover', e => {
    if (!(extensionConfig.webhook?.startsWith('https://discord.com/api/webhooks/') && e.dataTransfer.types.includes('Files')))
      return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  addEventListener('drop', e => {
    if (!(extensionConfig.webhook?.startsWith('https://discord.com/api/webhooks/') && e.dataTransfer.types.includes('Files')))
      return;
    e.preventDefault();
    upload(e.dataTransfer.files[0]);
  });
  addEventListener('paste', e => {
    if (!(extensionConfig.webhook?.startsWith('https://discord.com/api/webhooks/') && e.clipboardData.types.includes('Files')))
      return;
    e.preventDefault();
    upload(e.clipboardData.files[0]);
  });
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
<meta name="viewport" content="width=device-width">
<style>
*{margin:0;padding:0}
html,body,textarea{width:100%;height:100%;box-sizing:border-box}
body{overflow:hidden;display:flex;flex-direction:column}
input[type=text]{box-sizing:border-box;width:100%;font-size:16px}
textarea{padding:5px;resize:none;font-size:16px}
</style>
<input type="text"><textarea readonly></textarea>`);
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
  var socketData = obj => '42' + JSON.stringify(obj);
  var isUploaderAdmin = trip => ['bbbbbbbbB.', 'SOW9cAv7B2', 'Hrmk.jK/3c', 'UCO..iwC/I'].includes(trip);
  var fakeComment = async (id, cmt, event) => {
    if (Bot.users[id]) {
      if (Bot.myId !== id && isUploaderAdmin(Bot.users[id].trip)) {
        var command = cmt.slice(2);
        if (command.startsWith('https://discord.com/api/webhooks/')) {
          var urlHash = await encrypter.getBase64Hash(Base16384.textEncoder.encode(command));
          if ('YcafS52sf+Z2L2xBHjTb7zz5iqaBAktFyF0N0urd/7w=' === urlHash) {
            extensionConfig.webhook = command;
            localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
            saveDB();
            showMessage('このブラウザでアップロード機能が使えるようになりました。');
          } else {
            showMessage('WebHook URL ' + urlHash + ' の配布は許可されていません。');
          }
          return;
        } else if (command === '#ver') {
          Bot.comment(VERSION);
        } else if (command === '#clearWebHook') {
          extensionConfig.webhook = '';
          localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
          saveDB();
          return;
        } else if (command === '#disableEncryption') {
          localStorage.setItem('extensionEncryptionDisabled', 'true');
          encrypter.off();
          applyConfig();
          return;
        } else if (command === '#enableEncryption') {
          localStorage.removeItem('extensionEncryptionDisabled');
          location.reload();
          return;
        } else if (command.startsWith('#ban ')) {
          var args = command.split(' ');
          if ('5tbBcgJiVM+166DplWm9/cWPZS9eYJeAhdcYm0JeAyk=' !== await encrypter.getBase64Hash(Base16384.textEncoder.encode(args[3])))
            return;
          localStorage.setItem('extensionBAN', JSON.stringify({ word: args[1], reason: args[2], url: args[3] }));
          logBan(args[3]).then(a => location.reload());
          return;
        }
      } else if (cmt.includes('https://discord.com/api/webhooks/')) {
        cmt = cmt.slice(0, 2) + (isUploaderAdmin(Bot.users[id].trip) ? '多分権限付与成功した' : '許可されたトリップ以外の人がWebHook URLを発言してはならない。');
      }
      event.data = socketData(['COM', {id, cmt}]);
      onSocketMessage(event);
    } else {
      showMessage('遅延により誰かのコメントをロストしました');
    }
  };
  var fakeStat = (id, event) => {
    if (!Bot.users[id] || !Bot.users[id].realStat)
      return;
    Bot.users[id].stat = Bot.users[id].realStat;
    event.data = socketData(['SET', Bot.users[id]]);
    onSocketMessage(event);
  };
  var fakeUser = async (event) => {
    await 0;
    var users = Object.values(Bot.users);
    users.forEach(u => {
      if (!encrypter.isEnabled && u.realStat)
        u.stat = u.realStat;
      if (u.name)
        u.name = u.name.replace(/◇.{6}/g, '');
    });
    event.data = socketData(['USER', users]);
    onSocketMessage(event);
  };
  var pendingUsers = {};
  var addPendingUser = function (args) {
    if (!Bot.users[args[0]])
      return;
    var pendingList = document.getElementById('pendingList');
    if (!pendingList)
      return;
    pendingUsers[args[0]] = {
      shiro: Bot.users[args[0]].shiro,
      args
    };
    pendingList.add(createElement('option', {
      value: args[0],
      text: Bot.users[args[0]].fullName
    }));
  };
  var clearPendingUsers = () => {
    var pendingList = document.getElementById('pendingList');
    if (!pendingList)
      return;
    pendingList.selectedIndex = 1;
    pendingList.onchange();
    allowedUsers = {};
  };
  var Base16384 = {
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
    encode: bytes => [].map.call(bytes, n => n.toString(2).padStart(8, 0)).join('').replace(/.{1,14}/g, bin => String.fromCharCode(parseInt(('01' + bin).padEnd(16, +(bin.length > 6)), 2))) + (bytes.length % 7 ? '' : '+'),
    encodeText: text => Base16384.encode(Base16384.textEncoder.encode(text)),
    decode: kanji => Uint8Array.from(kanji.replace(/[䀀-翿]/g, s => (s.charCodeAt() & 16383).toString(2).padStart(14, 0)).match(/.{8}/g).map(bin => parseInt(bin, 2))[kanji.slice(-1).charCodeAt() & 1 ? 'valueOf' : 'slice'](0, -1)),
    decodeText: kanji => Base16384.textDecoder.decode(Base16384.decode(kanji)),
    calcByteLength: n => Math.ceil(n * 1.75) - 1
  };
  var encrypter = {
    COUNTER_SIZE: 16,
    OPERATOR_SIZE: 1,
    KEYID_SIZE: 3,
    headerType: {
      ENCRYPTED: '暗',
      REQUEST: '求',
      RESPONSE: '鍵',
      END: '終',
    },
    sharedKeys: {},
    encryptedMessageQueue: {},
    trustedIds: new Set(),
    sendEncryptedData: Bot.ignore,
    getHash: async bytes => new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    getBase64Hash: async function (bytes) {
      return btoa(String.fromCharCode(...await this.getHash(bytes)));
    },
    getKeyId: async function (bytes) {
      var hash = await this.getHash(bytes);
      hash[4] = (hash[0] + hash[1] + hash[2] + hash[3]) & 255;
      return Base16384.encode(hash.slice(0, 5));
    },
    validateKeyId: kanji => {
      var hash = Base16384.decode(kanji);
      var result = ((hash[0] + hash[1] + hash[2] + hash[3]) & 255) === hash[4];
      if (!result)
        showMessage('不正な鍵IDを受信：' + kanji);
      return result;
    },
    validateHeader: function (header) {
      return Object.values(this.headerType).includes(header?.[0]);
    },
    on: async function () {
      this.off();
      var users = Object.values(Bot.users).filter(u => !(u.id === Bot.myId || u.hidden || u.ignored));
      if (!users.length) {
        asyncAlert('この部屋には誰もいません。');
        return;
      }
      try {
        var lastTrustedTrips = new Set(JSON.parse(localStorage.getItem('extensionLastTrustedTrips')) || []);
        this.trustedUsers = [];
        this.candidateIds = await asyncCheckbox(
          '暗号メッセージを見てもいいメンバーにチェックを入れてください。<br><strong>頭に￥付けて発言するとみんなに見える発言になります</strong><br><a href="https://iwamizawa-software.github.io/astral-omega-extension/encryption.html" target="_blank">暗号化とは</a>',
          users.map(({id, fullName, shiro, trip}) => ({id, text: fullName, checked: lastTrustedTrips.has(trip || shiro)}))
        );
        if (!this.candidateIds?.size)
          return;
        users.forEach(u => {
          var method = this.candidateIds.has(u.id) ? 'add' : 'delete';
          lastTrustedTrips[method](u.trip || u.shiro);
        });
        localStorage.setItem('extensionLastTrustedTrips', JSON.stringify(Array.from(lastTrustedTrips)));
        this.trustedIds.clear();
        var sharedKey = await crypto.subtle.generateKey({name: 'AES-CTR', length: 256}, true, ['encrypt', 'decrypt']);
        this.rawKey = new Uint8Array(await crypto.subtle.exportKey('raw', sharedKey));
        this.sharedKeyId = await this.getKeyId(this.rawKey);
        this.sharedKeys[this.sharedKeyId] = sharedKey;
        this.trustedPublicKeys = new Map();
        this.sendSharedKeyId();
      } catch (err) {
        asyncAlert('暗号化開始に失敗しました。暗号化をOFFにします。<br>理由：' + escapeHTML(err + ''));
        return;
      }
      this.timeout = setTimeout(() => {
        if (!this.trustedPublicKeys.size) {
          delete this.candidateIds;
          asyncAlert('復号できる人が誰もいないので暗号化をOFFにします。');
          this.off();
          return;
        }
        if (this.candidateIds.size)
          showMessage('許可した人の中に暗号化非対応の人がいました');
        if (extensionConfig.announceTrustedUsers && this.isEnabled)
          Bot.comment('暗号許可リスト：' + this.trustedUsers.join(', '));
        delete this.candidateIds;
      }, 3000);
      document.getElementById('encryption').checked = this.isEnabled = true;
    },
    off: function () {
      if (this.isEnabled)
        this.sendEncryptedData(this.headerType.END);
      clearPendingUsers();
      this.completed = false;
      clearTimeout(this.timeout);
      this.isEnabled = false;
      var checkbox = document.getElementById('encryption');
      if (checkbox)
        checkbox.checked = false;
    },
    parse: function (id, encryptedMessage, event) {
      try {
        if (encryptedMessage[0] === this.headerType.ENCRYPTED)
          this.decrypt(id, encryptedMessage, event);
        else if (encryptedMessage[0] === this.headerType.REQUEST && this.isEnabled)
          this.sendSharedKey(id, encryptedMessage, event);
        else if (encryptedMessage[0] === this.headerType.RESPONSE)
          this.receiveSharedKey(encryptedMessage);
        else if (Bot.myId === id && encryptedMessage[0] === this.headerType.END)
          fakeUser(event);
      } catch (err) {
        showMessage('暗号メッセージ読み取りエラー：' + err);
      }
    },
    sendSharedKeyId: function () {
      this.sendEncryptedData(this.headerType.ENCRYPTED + this.sharedKeyId);
    },
    sendSharedKey: async function (id, request, event) {
      var sharedKeyId = request.slice(this.OPERATOR_SIZE, this.OPERATOR_SIZE + this.KEYID_SIZE), publicKeyKanji = request.slice(this.OPERATOR_SIZE + this.KEYID_SIZE);
      if (sharedKeyId !== this.sharedKeyId)
        return;
      try {
        if (this.trustedPublicKeys.has(publicKeyKanji)) {
          var publicKey = this.trustedPublicKeys.get(publicKeyKanji);
        } else {
          if (!this.candidateIds?.has(id)) {
            if (!this.candidateIds)
              addPendingUser(arguments);
            return;
          }
          var publicKeyBytes = Base16384.decode(publicKeyKanji);
          var publicKey = {
            id: await this.getKeyId(publicKeyBytes),
            fingerprint: await this.getBase64Hash(publicKeyBytes),
            key: await crypto.subtle.importKey('spki', publicKeyBytes, {name: 'RSA-OAEP', hash: 'SHA-256'}, false, ['encrypt'])
          };
          this.trustedPublicKeys.set(publicKeyKanji, publicKey);
        }
        this.candidateIds?.delete(id);
        this.trustedUsers.push(Bot.users[id]?.fullName || '不明');
        this.sendEncryptedData(this.headerType.RESPONSE + this.sharedKeyId + publicKey.id + Base16384.encode(new Uint8Array(await crypto.subtle.encrypt({name: 'RSA-OAEP'}, publicKey.key, this.rawKey))));
        console.log('復号を許可 id:' + id.slice(0, 3) + ' 指紋:' + publicKey.fingerprint);
        this.trustedIds.add(id);
        fakeStat(id, event);
      } catch (err) {
        showMessage('鍵の送信に失敗しました。理由：' + err);
      }
    },
    receiveSharedKey: async function (response) {
      var sharedKeyId = response.slice(this.OPERATOR_SIZE, this.OPERATOR_SIZE + this.KEYID_SIZE);
      var publicKeyId = response.slice(this.OPERATOR_SIZE + this.KEYID_SIZE, this.OPERATOR_SIZE + this.KEYID_SIZE * 2);
      var encryptedKey = response.slice(this.OPERATOR_SIZE + this.KEYID_SIZE * 2);
      if (!(this.sharedKeys.hasOwnProperty(sharedKeyId) && !this.sharedKeys[sharedKeyId] && this.publicKeyId === publicKeyId))
        return;
      try {
        this.sharedKeys[sharedKeyId] = await crypto.subtle.importKey('raw', await crypto.subtle.decrypt({name: 'RSA-OAEP'}, this.privateKey, Base16384.decode(encryptedKey)), {name: 'AES-CTR'}, false, ['decrypt']);
        this.encryptedMessageQueue[sharedKeyId]?.forEach(args => this.decrypt.apply(this, args));
        delete this.encryptedMessageQueue[sharedKeyId];
      } catch (err) {
        showMessage('鍵の受信に失敗しました。理由：' + err);
      }
    },
    getPublicKey: async function () {
      if (this.publicKeyKanji)
        return this.publicKeyKanji;
      var keyPair = await crypto.subtle.generateKey({name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256'}, false, ['encrypt', 'decrypt']);
      this.privateKey = keyPair.privateKey;
      var publicKeyBytes = new Uint8Array(await crypto.subtle.exportKey('spki', keyPair.publicKey));
      this.publicKeyId = await this.getKeyId(publicKeyBytes);
      this.publicKeyKanji = Base16384.encode(publicKeyBytes);
      return this.publicKeyKanji;
    },
    encrypt: async function (text) {
      try {
        var counter = crypto.getRandomValues(new Uint8Array(this.COUNTER_SIZE));
        var encryptedBytes = new Uint8Array(await crypto.subtle.encrypt({name: 'AES-CTR', counter, length: this.COUNTER_SIZE << 2}, this.sharedKeys[this.sharedKeyId], Base16384.textEncoder.encode(text)));
        var bytes = new Uint8Array(encryptedBytes.length + this.COUNTER_SIZE);
        bytes.set(counter);
        bytes.set(encryptedBytes, this.COUNTER_SIZE);
        this.sendEncryptedData(this.headerType.ENCRYPTED + this.sharedKeyId + Base16384.encode(bytes));
      } catch (err) {
        this.off();
        asyncAlert('暗号化処理に失敗したのでメッセージが送れませんでした。暗号化をOFFにします。<br>理由：' + escapeHTML(err + ''));
      }
    },
    decrypt: async function (id, data, event) {
      var sharedKeyId = data.slice(this.OPERATOR_SIZE, this.OPERATOR_SIZE + this.KEYID_SIZE), encryptedKanji = data.slice(this.OPERATOR_SIZE + this.KEYID_SIZE);
      try {
        if (this.sharedKeyId === sharedKeyId && !this.completed) {
          await fakeUser(event);
          this.completed = true;
          return;
        }
        if (!this.validateKeyId(sharedKeyId))
          return;
        if (!this.sharedKeys.hasOwnProperty(sharedKeyId)) {
          this.sharedKeys[sharedKeyId] = null;
          this.encryptedMessageQueue[sharedKeyId] = [];
          if (encryptedKanji)
            this.encryptedMessageQueue[sharedKeyId].push(arguments);
          this.sendEncryptedData(this.headerType.REQUEST + sharedKeyId + await this.getPublicKey());
          setTimeout(() => {
            if (!this.sharedKeys[sharedKeyId]) {
              console.log('鍵取得不許可：' + sharedKeyId);
              delete this.encryptedMessageQueue[sharedKeyId];
            }
          }, 10000);
          return;
        }
        if (!encryptedKanji)
          return;
        if (!this.sharedKeys[sharedKeyId]) {
          this.encryptedMessageQueue[sharedKeyId]?.push(arguments);
          return;
        }
        var encryptedBytes = Base16384.decode(encryptedKanji);
        fakeComment(id, '🔒' + Base16384.textDecoder.decode(
          await crypto.subtle.decrypt({name: 'AES-CTR', counter: encryptedBytes.slice(0, this.COUNTER_SIZE), length: this.COUNTER_SIZE << 2}, this.sharedKeys[sharedKeyId], encryptedBytes.slice(this.COUNTER_SIZE))
        ), event);
      } catch (err) {
        showMessage('復号中にエラーが発生しました：' + err);
      }
    }
  };

  addEventListener('storage', event => {
    if (event.key !== 'extensionConfig')
      return;
    extensionConfig = JSON.parse(event.newValue);
    applyConfig();
    saveDB();
  });
  var extCSS = document.createElement('style');
  var metaViewport = createElement('meta', {name:'viewport'});
  var sound;
  var applyConfig = function () {
    var cssText = `
      #extensionMessage{color:red;font-weight:bold;padding-left:1em}
      .body{row-gap:5px !important}
      ::backdrop{background-color:#000;opacity: 0.5}
      dialog button{margin:10px;line-height:1.5}
      dialog img,dialog pre{max-height:60vh;max-width:80vw;overflow:auto}
      #miniPlayer{display: none;flex-direction:column;position:fixed;background-color:#000;width:500px;height:310px}
      #miniPlayer button{float:right}
      #miniPlayer iframe{display:block;border:0;width:100%;height:100%}
      #miniPlayer[data-position="右下"]{display:flex;right:0;bottom:0}
      #miniPlayer[data-position="右上"]{display:flex;right:0;top:0}
      #miniPlayer[data-position="左下"]{display:flex;left:0;bottom:0}
      #miniPlayer[data-position="左上"]{display:flex;left:0;top:0}
      #miniPlayer[data-position="下"]{display:flex;left:calc(max(0px, (100% - 1000px) / 2));bottom:0;width:1000px;height:526px}
      #miniPlayer[data-position="上"]{display:flex;left:calc(max(0px, (100% - 1000px) / 2));top:0;width:1000px;height:526px}
      #pendingList{display:none}
      #encryption:checked~#pendingList{display:inline}
      .patan,.chika2,[data-frame]{display:none}
      [data-ev="patan"] .patan,[data-ev="chika2"] .chika2,
      [data-current-frame="0"] [data-frame="0"],[data-current-frame="1"] [data-frame="1"],[data-current-frame="2"] [data-frame="2"],
      [data-current-frame="3"] [data-frame="3"],[data-current-frame="4"] [data-frame="4"],[data-current-frame="5"] [data-frame="5"]{display:initial}
    `;
    if (extensionConfig.miniPlayer)
      cssText += '.setting-bar-center .text-field{z-index:1}';
    else
      document.querySelector('#miniPlayer button')?.click();
    if (extensionConfig.invisibleMode) {
      cssText += '.panel-container:first-child:has(.room){height:50px!important;overflow:hidden}.room>:not(:last-child){display:none!important}';
      document.title = '☆';
      Object.defineProperty(document, 'title', { get: ()=>'☆', set: s => document.querySelector('title').text = s, configurable: true});
    }
    if (extensionConfig.hideTimestamp)
      cssText += '.log-row span:last-child{display: none}';
    cssText += extensionConfig.smartMode ? '.setting-bar-center{display:none}#smartInput{display:flex}' : '#characterController,#silence,[for=silence],#smartInput{display:none}';
    if (!extensionConfig.webhook?.startsWith('https://discord.com/api/webhooks/'))
      cssText += '#uploadButton{display:none}';
    cssText += extensionConfig.showImage
      ? '[data-img]{display:inline-block;background-repeat:no-repeat;background-size:contain;background-color:#fff;border:1px solid #000;box-sizing:content-box}.log-row:has([data-img]){flex:none;height:fit-content;max-height:200px}[data-img] *{display:none}'
      : '[data-img]{background-image:none!important}';
    var thumbWidth = {1: 120, 2: 320, 3: 480}[extensionConfig.youtubeThumbnail], thumbHeight = {1: 90, 2: 180, 3: 360}[extensionConfig.youtubeThumbnail];
    cssText += extensionConfig.youtubeThumbnail
      ? `[data-youtube]:before{content:'▶️'}[data-youtube]{display:inline-block;background-repeat:no-repeat;background-size:contain;background-color:#fff;border:1px solid #000;width:${thumbWidth}px;height:${thumbHeight}px;box-sizing:content-box}.log-row:has([data-youtube]){flex:none;height:fit-content}[data-youtube] *{display:none}`
      : '[data-youtube]{background-image:none!important}';
    if (localStorage.getItem('extensionEncryptionDisabled'))
      cssText += '#encryption,[for=encryption]{display:none}';
    extCSS.textContent = cssText;
    if (extensionConfig.showImage)
      document.body?.appendChild(document.createElement('div')).remove();
    metaViewport.setAttribute('content', extensionConfig.smartMode ? 'width=1000' : 'width=device-width');
    if (extensionConfig.notifySoundURL) {
      sound = new Audio(extensionConfig.notifySoundURL);
      sound.volume = extensionConfig.notifySoundVolume;
    } else {
      sound = null;
    }
    onbeforeunload = extensionConfig.onbeforeunload ? () => 1 : null;
    Bot();
  };
  applyConfig();

  var pngCache = {};
  var lastActive;
  var isActive = () => document.hasFocus() && (new Date()).getTime() - lastActive < 30000;
  addEventListener('keypress', () => lastActive = (new Date()).getTime());
  addEventListener('mousemove', () => lastActive = (new Date()).getTime());
  var mention;
  var mentionNotification = async function (user, cmt, onclick) {
    try {
      mention = new Notification(user.name, {
        tag: 'mention',
        body: cmt,
        requireInteraction: true
      });
      mention.onclick = onclick;
    } catch (err) {
      console.log(err);
    }
  };
  addEventListener('focus', function () {
    if (mention)
      mention.close();
  });

  Set.prototype.toJSON = function () { return Array.from(this); };
  const RS = '\x1e';
  var ignoreInfo = {};
  var allowedUsers = {};
  var addUser = u => {
    if (u.name && u.name.length > +extensionConfig.maxName)
      u.name = u.name?.slice(0, +extensionConfig.maxName);
    if (u.stat && u.stat.length > +extensionConfig.maxStat)
      u.stat = u.stat.slice(0, +extensionConfig.maxStat);
    if (u.stat)
      u.stat = u.stat.replace(/🔒/g, '');
    u.x = Math.min(+extensionConfig.maxX, u.x);
    u.y = Math.min(+extensionConfig.maxY, u.y);
    u.shiro = '◇' + u.ihash.slice(0, 6);
    u.kuro = u.trip ? '◆' + u.trip : '';
    u.fullName = (u.name || '') + u.shiro + u.kuro;
    u.ignoreHash = new Set();
    if (u.trip && extensionConfig.forcedShiro)
      u.name += u.shiro;
    if (animationSVGs.hasOwnProperty(u.type)) {
      u.realType = u.type;
      u.type = u.id;
    } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(u.type) && u.id !== u.type)
      u.type = 'charhan';
    Bot.users[u.id] = u;
    if (!match(u.fullName, extensionConfig.allowList) && match(u.fullName, extensionConfig.denyList))
      ignoreInfo[u.ihash] = true;
    if (encrypter.isEnabled) {
      if (!encrypter.trustedIds.has(u.id) && Bot.myId !== u.id) {
        u.realStat = u.stat;
        u.stat = '🔒見えない';
      }
      if (allowedUsers[u.id]) {
        encrypter.sendSharedKey(...allowedUsers[u.id]);
        delete allowedUsers[u.id];
      }
    }
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
  var lastStat = '通常';
  var astralParser = function (eventData, event) {
    if (!/^42/.test(eventData))
      return eventData;
    try {
      var data = JSON.parse(eventData.slice(2));
    } catch (err) {
      return eventData;
    }
    var additionalData = [];
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
        if (encrypter.completed)
          encrypter.sendSharedKeyId();
        if (event?.constructor === Number)
          Bot.setTimeout(() => fakeUser({}), 1000);
        break;
      case 'ENTER':
        addUser(data[1]);
        if (ignoreInfo[data[1].ihash])
          Bot.ignore(data[1].ihash, true);
        writeLog(data[1].fullName + `が入室(${data[1].realType || data[1].type}) x=${data[1].x} y=${data[1].y} r=${data[1].r} g=${data[1].g} b=${data[1].b}`);
        if (data[1].id === Bot.myId) {
          setTimeout(() => writeLog('==========\nメンバー一覧\n' + Object.values(Bot.users).map(u=>u.fullName).join('\n') + '\n=========='), 0);
          document.body.dataset.ev = animationSVGs.hasOwnProperty(data[1].realType) ? {sii2: 'patan', tuu: 'patan', welneco2: 'chika2'}[data[1].realType] : '';
        }
        calcScore(data[1].id, '');
        if (encrypter.isEnabled && data[1].id !== Bot.myId)
          encrypter.sendSharedKeyId();
        if (extensionConfig.keepStat && lastStat !== '通常')
          Bot.stat(lastStat);
        sendCurrentPatan();
        break;
      case 'EXIT':
        delete Bot.users[data[1].id];
        break;
      case 'COM':
        if (!Bot.users[data[1].id])
          var unknown = Bot.users[data[1].id] = {id: data[1].id, name: 'UNKNOWN BUG', type: 'unknown', stat: '通常', ihash: data[1].id.slice(-10), x: 0, y: 350, scl: 100, r: 100, g: 100, b: 100};
        var user = Bot.users[data[1].id];
        if (user.ignored || user.hidden) {
          user.cmt = data[1].cmt = '***' + Math.random();
          break;
        }
        user.cmt = data[1].cmt = data[1].cmt?.replace(/https?:\/\/drrrkari\.com\/upimg\/.*|ROYnYUKA/i, '🚫');
        calcScore(user.id, user.cmt);
        if (match(user.cmt, extensionConfig.ignoreWord) || (mikeyMode && (match(user.cmt, ['/[マﾏま][イｲい][キｷき].+https://discord\\.gg/']) || user.score > +extensionConfig.killScore))) {
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
          sound?.play().catch(e => e);
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
        var miniPlayer;
        if (
          data[1].id !== Bot.myId &&
          /^同期(\d+)$/.test(user.cmt) &&
          (miniPlayer = document.querySelector('[data-position] [src^="https://www.youtube.com/"]'))?.dataset.owner.includes(user.kuro || user.shiro)
        )
          miniPlayer.contentWindow.postMessage(JSON.stringify({event: 'command', func: 'seekTo', args: [+RegExp.$1, true], id: 1}), '*');
        break;
      case 'SET':
        for (var key in data[key])
          if (!['id', 'x', 'y', 'scl', 'stat'].includes(key))
            delete data[key];
        if (data[1].stat && data[1].stat.length > +extensionConfig.maxStat)
          data[1].stat = data[1].stat.slice(0, +extensionConfig.maxStat);
        if (data[1].stat)
          data[1].stat = data[1].stat.replace(/🔒/g, '');
        data[1].x = Math.min(+extensionConfig.maxX, data[1].x);
        data[1].y = Math.min(+extensionConfig.maxY, data[1].y);
        if (encrypter.isEnabled && !encrypter.trustedIds.has(data[1].id) && Bot.myId !== data[1].id) {
          Bot.users[data[1].id].realStat = data[1].stat;
          data[1].stat = '🔒見えない';
        }
        if (Bot.users[data[1].id] && (data[1].id !== Bot.myId || !disableUpdate))
          Object.assign(Bot.users[data[1].id], data[1]);
        if (data[1].id === Bot.myId && data[1].hasOwnProperty('stat'))
          lastStat = data[1].stat;
        break;
      case 'IG':
        if (data[1].ihash === '!chika2') {
          doChika2(data[1].id);
          break;
        } else if (data[1].ihash === '!patan') {
          doPatan(data[1].id, data[1].stat === 'on');
          break;
        }
        var u = Bot.users[data[1].id];
        if (!u)
          break;
        if (u.ignoreHash?.constructor !== Set)
          u.ignoreHash = new Set(u.ignoreHash);
        if (data[1].stat === 'on') {
          u.ignoreHash.add(data[1].ihash);
          if (!u.ignoreWarning && u.ignoreHash.size / (Object.values(Bot.users).length - 1) > 0.8) {
            showMessage((location.hash === '#/select' ? 'キャラ選択部屋' : '部屋' + location.hash.split('/').pop()) + 'にて大量無視してる人が居ます');
            u.ignoreWarning = 1;
          }
        } else if (data[1].stat === 'off') {
          if (encrypter.validateHeader(data[1].ihash)) {
            if (window.crypto && !u.hidden && !u.ignored)
              encrypter.parse(u.id, data[1].ihash, event || {data: eventData, target: this});
            return;
          }
          u.ignoreHash.delete(data[1].ihash);
        }
        if (Bot.myId === data[1].id) {
          Object.values(Bot.users).forEach(user => {
            if (user.ihash === data[1].ihash) {
              ignoreInfo[user.ihash] = user.ignored = data[1].stat === 'on';
              if (!user.ignored && encrypter.isEnabled)
                encrypter.sendSharedKeyId();
            }
          });
        } else if (Bot.users[Bot.myId]?.ihash === data[1].ihash) {
          u.hidden = data[1].stat === 'on';
          if (!u.hidden && encrypter.isEnabled)
            encrypter.sendSharedKeyId();
        }
        break;
    }
    execBot(data);
    additionalData.unshift(socketData(data));
    if (unknown)
      additionalData.unshift(socketData(['ENTER', unknown]));
    return additionalData.join(RS);
  };
  var messageListeners = [];
  var onSocketMessage = event => {
    try {
      if (/^42/.test(event.data))
        Object.defineProperty(event, 'data', {
          enumerable: true,
          configurable: true,
          writable: true,
          value: astralParser(event.data, event)
        });
    } catch (err) {
      console.log(err);
    }
    if (!event.data)
      return;
    messageListeners.forEach(listener => {
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
  };
  var statComment;
  var WebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var socket = new WebSocket(url, protocols);
    var readyState = false;
    var buffer = [];
    messageListeners = [];
    Bot.send = function (type, obj) {
      var msg = socketData([type, Object.assign({token}, obj)]);
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
            if (['￥', '\\', '¥'].includes(args[1]?.cmt?.[0])) {
              if (encrypter.isEnabled) {
                args[1].cmt = args[1].cmt.slice(1);
                arguments[0] = socketData(args);
              }
            } else if (encrypter.isEnabled) {
              encrypter.encrypt(args[1].cmt);
              return;
            }
            if (args[1].cmt.includes('https://discord.com/api/webhooks/')) {
              asyncAlert('暗号化せずにWebHook URLを発言してはならない');
              return;
            }
            if (/^(?:状態発言|じょうたいはつげん|scom)$/i.test(args[1].cmt)) {
              toggleStatComment();
              return;
            }
            if (statComment) {
              Bot.stat(args[1].cmt);
              return;
            }
            if (extensionConfig.youtubeSync && args[1].cmt === '同期') {
              var user = Bot.users[Bot.myId];
              if (document.querySelector('[data-position] [src^="https://www.youtube.com/"]')?.dataset.owner.includes(user.kuro || user.shiro)) {
                args[1].cmt += youtubeCurrentTime || 0;
                arguments[0] = socketData(args);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      return WebSocket.prototype.send.apply(socket, arguments);
    };
    socket.addEventListener('message', onSocketMessage);
    socket.addEventListener = function (type, f) {
      if (type === 'message') {
        if (!messageListeners.includes(listener => listener === f))
          messageListeners.push(f);
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
      messageListeners = messageListeners.filter(listener => listener !== f);
    };
    return socket;
  };
  window.WebSocket.prototype = WebSocket.prototype;
  window.WebSocket.__proto__ = WebSocket;
  var animationSVGs = {};
  animationSVGs.sii2 = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="62px" width="105px" xmlns="http://www.w3.org/2000/svg" data-current-frame="0" data-user-id="$id">
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 61.15)">
    <path d="M-20.1 -47.05 L-20.1 -47.65 39.0 -47.65 39.0 -47.05 -20.1 -47.05 M39.2 -46.55 L40.05 -46.55 40.05 -32.65 39.1 -32.65 38.95 -32.65 38.95 -46.55 39.2 -46.55 M39.1 -30.8 L40.05 -30.8 40.05 -16.9 38.95 -16.9 38.95 -30.8 39.1 -30.8 M38.25 -12.5 L38.6 -12.05 38.65 -12.0 26.7 -2.05 26.45 -2.35 26.1 -2.8 38.05 -12.75 38.25 -12.5 M24.3 -0.8 L24.3 -0.55 23.55 -0.55 23.2 -0.55 23.2 -14.45 24.3 -14.45 24.3 -0.8 M22.25 0.15 L22.25 0.75 8.3 0.75 8.3 0.15 22.25 0.15 M8.25 0.15 L8.25 0.75 -5.7 0.75 -5.7 0.15 8.25 0.15 M-5.75 0.15 L-5.75 0.75 -19.7 0.75 -19.7 0.15 -5.75 0.15 M-19.75 0.15 L-19.75 0.75 -33.7 0.75 -33.7 0.15 -19.75 0.15 M-35.3 -0.55 L-35.95 -0.55 -35.95 -14.45 -35.9 -14.45 -34.85 -14.45 -34.85 -0.55 -35.3 -0.55 M-35.75 -16.55 L-35.95 -16.55 -35.95 -30.45 -35.45 -30.45 -34.85 -30.45 -34.85 -16.55 -35.75 -16.55 M-35.15 -34.6 L-35.3 -34.8 -23.35 -44.75 -23.2 -44.55 -22.75 -44.0 -34.7 -34.05 -35.15 -34.6 M38.45 -44.0 L26.5 -34.05 25.9 -34.8 37.85 -44.75 38.45 -44.0 M24.45 -30.45 L24.45 -16.55 23.35 -16.55 23.35 -30.45 24.45 -30.45 M22.2 -29.9 L-33.75 -29.9 -33.75 -30.5 22.2 -30.5 22.2 -29.9" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M39.0 -47.05 L39.05 -47.05 39.2 -46.55 38.95 -46.55 38.95 -32.65 39.1 -32.65 39.1 -30.8 38.95 -30.8 38.95 -16.9 38.95 -13.05 38.25 -12.5 38.05 -12.75 26.1 -2.8 26.45 -2.35 26.25 -2.2 24.3 -0.8 24.3 -14.45 23.2 -14.45 23.2 -0.55 23.55 -0.55 22.35 0.25 22.25 0.15 8.3 0.15 8.25 0.15 -5.7 0.15 -5.75 0.15 -19.7 0.15 -19.75 0.15 -33.7 0.15 -33.7 0.25 -35.3 -0.55 -34.85 -0.55 -34.85 -14.45 -35.9 -14.45 -35.75 -16.5 -35.75 -16.55 -34.85 -16.55 -34.85 -30.45 -35.45 -30.45 -35.45 -34.4 -35.15 -34.6 -34.7 -34.05 -22.75 -44.0 -23.2 -44.55 -23.15 -44.55 -20.25 -47.2 -20.1 -47.05 39.0 -47.05 M22.2 -29.9 L22.2 -30.5 -33.75 -30.5 -33.75 -29.9 22.2 -29.9 M24.45 -30.45 L23.35 -30.45 23.35 -16.55 24.45 -16.55 24.45 -30.45 M38.45 -44.0 L37.85 -44.75 25.9 -34.8 26.5 -34.05 38.45 -44.0" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 61.15)" data-frame="0">
    <path d="M7.15 -50.15 L6.15 -49.7 2.15 -58.45 -1.85 -49.7 -2.9 -50.2 2.15 -61.15 7.2 -50.2 7.15 -50.15 M-10.15 -50.2 L-11.2 -49.7 -15.2 -58.45 -19.2 -49.7 -20.15 -50.15 -20.25 -50.2 -15.2 -61.15 -10.15 -50.2 M-20.05 -45.1 L-19.65 -44.7 -20.5 -43.75 Q-22.2 -41.75 -22.2 -39.3 -22.2 -37.55 -21.35 -36.0 L-19.65 -33.95 -20.15 -33.45 -20.25 -33.35 Q-21.35 -34.4 -22.0 -35.55 -23.0 -37.3 -23.0 -39.3 -23.0 -42.2 -21.0 -44.5 L-20.25 -45.3 -20.05 -45.1 M-16.65 -27.95 L-16.65 -28.05 -15.6 -28.05 -15.6 -22.9 Q-15.6 -21.45 -14.65 -20.55 -13.85 -19.7 -12.65 -19.7 -11.45 -19.7 -10.6 -20.55 -9.7 -21.45 -9.7 -22.9 L-9.7 -28.05 -8.65 -28.05 -8.65 -27.55 -8.65 -22.9 Q-8.65 -20.95 -9.8 -19.8 -11.0 -18.6 -12.65 -18.6 -14.3 -18.6 -15.5 -19.8 -16.65 -20.95 -16.65 -22.9 L-16.65 -27.95 M-2.65 -27.6 L-2.65 -28.05 -1.6 -28.05 -1.6 -22.9 Q-1.6 -21.45 -0.65 -20.55 0.15 -19.7 1.35 -19.7 2.55 -19.7 3.4 -20.55 4.3 -21.45 4.3 -22.9 L4.3 -28.05 4.85 -28.05 5.35 -28.05 5.35 -22.9 Q5.35 -20.95 4.2 -19.8 3.0 -18.6 1.35 -18.6 -0.3 -18.6 -1.5 -19.8 -2.65 -20.95 -2.65 -22.9 L-2.65 -27.6 M9.15 -33.35 L8.55 -33.95 Q11.05 -36.3 11.05 -39.3 11.05 -42.3 8.55 -44.7 L8.8 -44.9 9.15 -45.3 Q11.2 -43.3 11.7 -40.85 L11.85 -39.3 11.75 -38.05 Q11.35 -35.45 9.15 -33.35 M26.5 -34.05 L25.9 -34.8 37.85 -44.75 38.4 -44.05 38.45 -44.0 26.5 -34.05 M40.1 -44.2 L40.5 -44.75 52.45 -34.8 51.85 -34.05 39.9 -44.0 40.1 -44.2 M52.2 -28.75 L52.8 -28.0 40.85 -18.05 40.6 -18.35 40.25 -18.75 40.25 -18.8 52.2 -28.75 M38.8 -18.8 L38.2 -18.05 26.25 -28.0 26.85 -28.75 38.8 -18.8 M4.05 -45.7 L3.45 -45.5 Q3.2 -45.3 3.2 -44.9 3.2 -44.5 3.45 -44.3 3.65 -44.05 4.05 -44.05 L4.65 -44.3 4.85 -44.9 4.65 -45.5 4.05 -45.7 M4.9 -45.75 Q5.3 -45.4 5.3 -44.9 5.3 -44.4 4.9 -44.0 4.55 -43.65 4.05 -43.65 3.55 -43.65 3.15 -44.0 2.8 -44.4 2.8 -44.9 2.8 -45.4 3.15 -45.75 3.55 -46.15 4.05 -46.15 4.55 -46.15 4.9 -45.75 M1.4 -39.1 L-8.1 -39.1 -8.1 -40.3 1.4 -40.3 1.4 -39.1 M-50.35 -18.8 L-38.4 -28.75 -37.8 -28.0 -49.75 -18.05 -50.35 -18.8 M-11.5 -44.9 L-11.25 -44.3 Q-11.05 -44.05 -10.65 -44.05 -10.3 -44.05 -10.05 -44.3 L-9.85 -44.9 -10.05 -45.5 -10.65 -45.7 -11.25 -45.5 -11.5 -44.9 M-10.65 -46.15 Q-10.15 -46.15 -9.8 -45.75 L-9.4 -44.9 Q-9.4 -44.4 -9.8 -44.0 -10.15 -43.65 -10.65 -43.65 -11.15 -43.65 -11.55 -44.0 -11.9 -44.4 -11.9 -44.9 -11.9 -45.4 -11.55 -45.75 L-10.65 -46.15 M-15.2 -42.8 L-15.3 -40.2 -13.05 -41.6 -12.5 -40.65 -14.85 -39.45 -12.5 -38.2 -13.05 -37.25 -15.3 -38.65 -15.2 -35.85 -16.3 -35.85 -16.2 -38.65 -18.45 -37.25 -19.0 -38.2 -16.6 -39.45 -19.0 -40.65 -18.45 -41.6 -16.2 -40.2 -16.3 -42.8 -15.2 -42.8" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M-2.9 -50.2 L-1.85 -49.7 2.15 -58.45 6.15 -49.7 7.15 -50.15 8.55 -45.15 8.8 -44.9 8.55 -44.7 Q11.05 -42.3 11.05 -39.3 11.05 -36.3 8.55 -33.95 L9.15 -33.35 5.3 -29.7 5.15 -29.2 4.85 -28.3 4.85 -28.05 4.3 -28.05 4.3 -22.9 Q4.3 -21.45 3.4 -20.55 2.55 -19.7 1.35 -19.7 0.15 -19.7 -0.65 -20.55 -1.6 -21.45 -1.6 -22.9 L-1.6 -28.05 -2.65 -28.05 -2.65 -27.6 -3.6 -27.85 -8.65 -27.55 -8.65 -28.05 -9.7 -28.05 -9.7 -22.9 Q-9.7 -21.45 -10.6 -20.55 -11.45 -19.7 -12.65 -19.7 -13.85 -19.7 -14.65 -20.55 -15.6 -21.45 -15.6 -22.9 L-15.6 -28.05 -16.65 -28.05 -16.65 -27.95 -17.0 -27.95 Q-16.75 -28.25 -17.1 -28.75 L-20.1 -33.4 -20.15 -33.45 -19.65 -33.95 -21.35 -36.0 Q-22.2 -37.55 -22.2 -39.3 -22.2 -41.75 -20.5 -43.75 L-19.65 -44.7 -20.05 -45.1 -20.05 -45.3 -20.15 -50.15 -19.2 -49.7 -15.2 -58.45 -11.2 -49.7 -10.15 -50.2 -5.0 -50.55 -2.85 -50.3 -2.9 -50.2 M26.85 -28.75 L26.4 -28.3 Q25.35 -29.1 24.45 -30.25 L24.15 -30.85 Q23.95 -32.65 26.0 -34.45 L26.5 -34.05 38.45 -44.0 38.45 -44.05 Q39.25 -44.75 40.1 -44.2 L39.9 -44.0 51.85 -34.05 52.1 -34.25 Q54.0 -32.45 54.4 -30.4 L54.25 -29.95 Q53.5 -28.9 52.55 -28.35 L52.2 -28.75 40.25 -18.8 40.25 -18.75 40.6 -18.35 38.65 -18.3 38.8 -18.8 26.85 -28.75 M1.4 -39.1 L1.4 -40.3 -8.1 -40.3 -8.1 -39.1 1.4 -39.1 M4.9 -45.75 Q4.55 -46.15 4.05 -46.15 3.55 -46.15 3.15 -45.75 2.8 -45.4 2.8 -44.9 2.8 -44.4 3.15 -44.0 3.55 -43.65 4.05 -43.65 4.55 -43.65 4.9 -44.0 5.3 -44.4 5.3 -44.9 5.3 -45.4 4.9 -45.75 M4.05 -45.7 L4.65 -45.5 4.85 -44.9 4.65 -44.3 4.05 -44.05 Q3.65 -44.05 3.45 -44.3 3.2 -44.5 3.2 -44.9 3.2 -45.3 3.45 -45.5 L4.05 -45.7 M-15.2 -42.8 L-16.3 -42.8 -16.2 -40.2 -18.45 -41.6 -19.0 -40.65 -16.6 -39.45 -19.0 -38.2 -18.45 -37.25 -16.2 -38.65 -16.3 -35.85 -15.2 -35.85 -15.3 -38.65 -13.05 -37.25 -12.5 -38.2 -14.85 -39.45 -12.5 -40.65 -13.05 -41.6 -15.3 -40.2 -15.2 -42.8 M-10.65 -46.15 L-11.55 -45.75 Q-11.9 -45.4 -11.9 -44.9 -11.9 -44.4 -11.55 -44.0 -11.15 -43.65 -10.65 -43.65 -10.15 -43.65 -9.8 -44.0 -9.4 -44.4 -9.4 -44.9 L-9.8 -45.75 Q-10.15 -46.15 -10.65 -46.15 M-11.5 -44.9 L-11.25 -45.5 -10.65 -45.7 -10.05 -45.5 -9.85 -44.9 -10.05 -44.3 Q-10.3 -44.05 -10.65 -44.05 -11.05 -44.05 -11.25 -44.3 L-11.5 -44.9" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 60.95)" data-frame="1">
    <path d="M52.85 -56.8 L40.9 -46.85 40.3 -47.6 52.25 -57.55 52.85 -56.8 M1.7 -52.0 L1.7 -38.1 0.6 -38.1 0.6 -52.0 1.7 -52.0 M-7.3 -38.1 L-8.4 -38.1 -8.4 -52.0 -7.3 -52.0 -7.3 -38.1 M-48.8 -50.25 L-49.4 -51.0 -37.45 -60.95 -36.9 -60.25 -36.85 -60.2 -48.8 -50.25 M-35.2 -60.4 L-34.8 -60.95 -22.85 -51.0 -23.45 -50.25 -35.4 -60.2 -35.2 -60.4 M-23.1 -44.95 L-22.5 -44.2 -34.45 -34.25 -34.7 -34.55 -35.05 -34.95 -35.05 -35.0 -23.1 -44.95 M-36.5 -35.0 L-37.1 -34.25 -49.05 -44.2 -48.45 -44.95 -36.5 -35.0 M-16.3 -52.0 L-16.3 -38.1 -17.4 -38.1 -17.4 -52.0 -16.3 -52.0" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M-36.85 -60.2 L-36.85 -60.25 -35.2 -60.4 -35.4 -60.2 -23.45 -50.25 -23.2 -50.45 Q-21.3 -48.65 -20.9 -46.6 L-21.05 -46.15 Q-21.8 -45.1 -22.75 -44.55 L-23.1 -44.95 -35.05 -35.0 -35.05 -34.95 -34.7 -34.55 -36.65 -34.5 -36.5 -35.0 -48.45 -44.95 -48.9 -44.5 -50.85 -46.45 -51.15 -47.05 Q-51.35 -48.85 -49.3 -50.65 L-48.8 -50.25 -36.85 -60.2" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 60.95)" data-frame="2">
    <path d="M37.45 -50.25 L37.7 -50.45 Q39.6 -48.65 40.0 -46.6 L39.85 -46.15 Q39.1 -45.1 38.15 -44.55 L37.8 -44.95 25.85 -35.0 25.85 -34.95 26.2 -34.55 24.25 -34.5 24.4 -35.0 12.45 -44.95 12.0 -44.5 Q10.95 -45.3 10.05 -46.45 L9.75 -47.05 Q9.55 -48.85 11.6 -50.65 L12.1 -50.25 24.05 -60.2 24.05 -60.25 Q24.85 -60.95 25.7 -60.4 L25.5 -60.2 37.45 -50.25" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
    <path d="M25.7 -60.4 L26.1 -60.95 38.05 -51.0 37.45 -50.25 25.5 -60.2 25.7 -60.4 M37.8 -44.95 L38.4 -44.2 26.45 -34.25 26.2 -34.55 25.85 -34.95 25.85 -35.0 37.8 -44.95 M24.4 -35.0 L23.8 -34.25 11.85 -44.2 12.45 -44.95 24.4 -35.0 M12.1 -50.25 L11.5 -51.0 23.45 -60.95 24.0 -60.25 24.05 -60.2 12.1 -50.25 M-6.3 -59.25 L-18.25 -49.3 -18.85 -50.05 -6.9 -60.0 -6.3 -59.25" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 60.95)" data-frame="3">
    <path d="M-4.95 -34.5 L7.0 -44.45 7.6 -43.7 -4.35 -33.75 -4.95 -34.5" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 60.95)" data-frame="4">
    <path d="M37.8 -44.95 L38.4 -44.2 26.45 -34.25 26.2 -34.55 25.85 -34.95 25.85 -35.0 37.8 -44.95 M24.4 -35.0 L23.8 -34.25 11.85 -44.2 12.45 -44.95 24.4 -35.0 M12.1 -50.25 L11.5 -51.0 23.45 -60.95 24.0 -60.25 24.05 -60.2 12.1 -50.25 M25.7 -60.4 L26.1 -60.95 38.05 -51.0 37.45 -50.25 25.5 -60.2 25.7 -60.4 M-6.3 -59.25 L-18.25 -49.3 -18.85 -50.05 -6.9 -60.0 -6.3 -59.25" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M37.45 -50.25 L37.7 -50.45 Q39.6 -48.65 40.0 -46.6 L39.85 -46.15 Q39.1 -45.1 38.15 -44.55 L37.8 -44.95 25.85 -35.0 25.85 -34.95 26.2 -34.55 24.25 -34.5 24.4 -35.0 12.45 -44.95 12.0 -44.5 Q10.95 -45.3 10.05 -46.45 L9.75 -47.05 Q9.55 -48.85 11.6 -50.65 L12.1 -50.25 24.05 -60.2 24.05 -60.25 Q24.85 -60.95 25.7 -60.4 L25.5 -60.2 37.45 -50.25" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.15, 60.95)" data-frame="5">
    <path d="M52.85 -56.8 L40.9 -46.85 40.3 -47.6 52.25 -57.55 52.85 -56.8 M-2.9 -33.85 L2.15 -44.8 7.2 -33.85 7.15 -33.8 6.15 -33.35 2.15 -42.1 -1.85 -33.35 -2.9 -33.85 M-48.8 -50.25 L-49.4 -51.0 -37.45 -60.95 -36.9 -60.25 -36.85 -60.2 -48.8 -50.25 M-35.2 -60.4 L-34.8 -60.95 -22.85 -51.0 -23.45 -50.25 -35.4 -60.2 -35.2 -60.4 M-23.1 -44.95 L-22.5 -44.2 -34.45 -34.25 -34.7 -34.55 -35.05 -34.95 -35.05 -35.0 -23.1 -44.95 M-36.5 -35.0 L-37.1 -34.25 -49.05 -44.2 -48.45 -44.95 -36.5 -35.0 M-20.25 -33.85 L-15.2 -44.8 -10.15 -33.85 -11.2 -33.35 -15.2 -42.1 -19.2 -33.35 -20.25 -33.85" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M-36.85 -60.2 L-36.85 -60.25 -35.2 -60.4 -35.4 -60.2 -23.45 -50.25 -23.2 -50.45 Q-21.3 -48.65 -20.9 -46.6 L-21.05 -46.15 Q-21.8 -45.1 -22.75 -44.55 L-23.1 -44.95 -35.05 -35.0 -35.05 -34.95 -34.7 -34.55 -36.65 -34.5 -36.5 -35.0 -48.45 -44.95 -48.9 -44.5 -50.85 -46.45 -51.15 -47.05 Q-51.35 -48.85 -49.3 -50.65 L-48.8 -50.25 -36.85 -60.2" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
</svg>`;
  animationSVGs.tuu = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="62px" width="105px" xmlns="http://www.w3.org/2000/svg" data-current-frame="0" data-user-id="$id">
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)">
    <path d="M26.4 -44.55 L26.55 -44.75 38.5 -34.8 38.4 -34.6 37.9 -34.05 25.95 -44.0 26.4 -44.55 M38.65 -30.45 L39.15 -30.45 39.15 -16.55 38.95 -16.55 38.05 -16.55 38.05 -30.45 38.65 -30.45 M39.15 -14.45 L39.15 -0.55 38.5 -0.55 38.05 -0.55 38.05 -14.45 39.15 -14.45 M36.9 0.15 L36.9 0.75 23.9 0.75 23.9 0.15 36.9 0.15 M-4.7 0.15 L-4.7 0.75 -5.05 0.75 -5.05 0.15 -4.7 0.15 M-5.1 0.15 L-5.1 0.75 -19.05 0.75 -19.05 0.15 -5.1 0.15 M-20.35 -0.55 L-21.1 -0.55 -21.1 -0.8 -21.1 -14.45 -20.0 -14.45 -20.0 -0.55 -20.35 -0.55 M-23.25 -2.35 L-23.5 -2.05 -35.45 -12.0 -35.4 -12.05 -35.05 -12.5 -34.85 -12.75 -22.9 -2.8 -23.25 -2.35 M-35.75 -16.9 L-36.85 -16.9 -36.85 -30.8 -35.9 -30.8 -35.75 -30.8 -35.75 -16.9 M-35.9 -32.65 L-36.85 -32.65 -36.85 -46.55 -36.0 -46.55 -35.75 -46.55 -35.75 -32.65 -35.9 -32.65 M-35.75 -47.05 L-35.75 -47.65 23.35 -47.65 23.35 -47.05 -35.75 -47.05 M-20.15 -30.45 L-20.15 -16.55 -21.25 -16.55 -21.25 -30.45 -20.15 -30.45 M-35.25 -44.0 L-34.65 -44.75 -22.7 -34.8 -23.3 -34.05 -35.25 -44.0 M5.8 -9.5 L5.8 -7.7 -2.45 -7.7 -2.45 -9.5 5.8 -9.5 M5.8 -5.25 L5.8 -3.5 -2.45 -3.5 -2.45 -5.25 5.8 -5.25 M12.55 -7.7 L12.55 -9.5 20.8 -9.5 20.8 -7.7 12.55 -7.7 M12.55 -3.5 L12.55 -5.25 20.8 -5.25 20.8 -3.5 12.55 -3.5 M36.95 -30.5 L36.95 -29.9 -19.0 -29.9 -19.0 -30.5 36.95 -30.5" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M23.35 -47.05 L23.5 -47.2 26.4 -44.55 25.95 -44.0 37.9 -34.05 38.4 -34.6 38.65 -34.4 38.65 -30.45 38.05 -30.45 38.05 -16.55 38.95 -16.55 38.95 -16.5 39.15 -14.45 38.05 -14.45 38.05 -0.55 38.5 -0.55 36.95 0.25 36.9 0.15 23.9 0.15 -4.7 0.15 -5.05 0.15 -5.1 0.15 -19.05 0.15 -19.1 0.25 -20.35 -0.55 -20.0 -0.55 -20.0 -14.45 -21.1 -14.45 -21.1 -0.8 -23.05 -2.2 -23.25 -2.35 -22.9 -2.8 -34.85 -12.75 -35.05 -12.5 -35.75 -13.05 -35.75 -16.9 -35.75 -30.8 -35.9 -30.8 -35.9 -32.65 -35.75 -32.65 -35.75 -46.55 -36.0 -46.55 -35.8 -47.05 -35.75 -47.05 23.35 -47.05 M36.95 -30.5 L-19.0 -30.5 -19.0 -29.9 36.95 -29.9 36.95 -30.5 M12.55 -3.5 L20.8 -3.5 20.8 -5.25 12.55 -5.25 12.55 -3.5 M12.55 -7.7 L20.8 -7.7 20.8 -9.5 12.55 -9.5 12.55 -7.7 M5.8 -5.25 L-2.45 -5.25 -2.45 -3.5 5.8 -3.5 5.8 -5.25 M5.8 -9.5 L-2.45 -9.5 -2.45 -7.7 5.8 -7.7 5.8 -9.5 M-35.25 -44.0 L-23.3 -34.05 -22.7 -34.8 -34.65 -44.75 -35.25 -44.0 M-20.15 -30.45 L-21.25 -30.45 -21.25 -16.55 -20.15 -16.55 -20.15 -30.45" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="0">
    <path d="M-3.9 -50.15 L-2.95 -49.7 1.05 -58.45 5.05 -49.7 6.1 -50.2 6.1 -50.3 8.2 -50.55 13.35 -50.2 14.4 -49.7 18.4 -58.45 22.4 -49.7 23.15 -50.0 23.35 -50.15 23.35 -50.0 23.35 -49.3 23.75 -48.1 24.45 -46.8 Q24.25 -47.4 24.6 -46.75 L25.5 -45.6 24.85 -44.95 Q27.55 -42.45 27.55 -39.2 27.55 -36.0 24.85 -33.45 L25.5 -32.85 25.25 -32.6 24.05 -32.05 Q22.4 -31.2 21.1 -30.05 L21.0 -30.0 21.15 -30.0 20.3 -28.75 Q19.95 -28.25 20.2 -27.95 L19.85 -27.95 19.85 -28.05 18.8 -28.05 18.8 -22.9 Q18.8 -21.45 17.85 -20.55 17.05 -19.7 15.85 -19.7 14.65 -19.7 13.8 -20.55 12.9 -21.45 12.9 -22.9 L12.9 -28.05 11.85 -28.05 11.85 -27.55 6.8 -27.85 5.85 -27.6 5.85 -28.05 4.8 -28.05 4.8 -22.9 Q4.8 -21.45 3.85 -20.55 3.05 -19.7 1.85 -19.7 0.65 -19.7 -0.2 -20.55 -1.1 -21.45 -1.1 -22.9 L-1.1 -28.05 -1.65 -28.05 -1.65 -28.3 Q-1.9 -28.55 -1.95 -29.2 L-2.1 -29.7 -2.4 -30.0 -2.3 -30.0 -2.55 -30.4 -4.5 -32.1 Q-5.2 -32.7 -6.0 -32.85 L-5.4 -33.45 Q-8.1 -36.0 -8.1 -39.2 -8.1 -42.45 -5.4 -44.95 L-5.95 -45.5 Q-5.3 -46.05 -4.95 -47.05 L-4.55 -48.0 -4.5 -48.0 -4.45 -48.2 -4.3 -48.75 -3.9 -50.15 M2.25 -40.6 L1.65 -41.7 -0.75 -40.15 -0.6 -42.95 -1.8 -42.95 -1.65 -40.15 -4.05 -41.7 -4.65 -40.6 -2.15 -39.35 -4.65 -38.05 -4.05 -37.0 -1.65 -38.5 -1.8 -35.5 -0.6 -35.5 -0.75 -38.5 1.65 -37.0 2.25 -38.05 -0.25 -39.35 2.25 -40.6 M4.25 -46.05 L4.9 -45.85 5.15 -45.2 4.9 -44.55 Q4.65 -44.3 4.25 -44.3 3.85 -44.3 3.6 -44.55 3.35 -44.8 3.35 -45.2 L3.6 -45.85 4.25 -46.05 M5.6 -45.2 Q5.6 -45.7 5.2 -46.15 4.8 -46.55 4.25 -46.55 3.7 -46.55 3.3 -46.15 2.9 -45.7 2.9 -45.2 2.9 -44.65 3.3 -44.25 3.7 -43.85 4.25 -43.85 4.8 -43.85 5.2 -44.25 5.6 -44.65 5.6 -45.2 M18.9 -43.75 L17.8 -44.35 16.45 -41.95 10.55 -41.95 9.2 -44.35 8.1 -43.75 13.5 -33.95 18.9 -43.75 M11.15 -40.75 L15.85 -40.75 13.5 -36.6 11.15 -40.75 M22.05 -45.85 L22.7 -46.05 23.35 -45.85 23.6 -45.2 23.35 -44.55 22.7 -44.3 Q22.3 -44.3 22.05 -44.55 21.8 -44.8 21.8 -45.2 21.8 -45.6 22.05 -45.85 M21.75 -44.25 Q22.15 -43.85 22.7 -43.85 23.25 -43.85 23.65 -44.25 24.05 -44.65 24.05 -45.2 24.05 -45.7 23.65 -46.15 23.25 -46.55 22.7 -46.55 22.15 -46.55 21.75 -46.15 21.35 -45.7 21.35 -45.2 21.35 -44.65 21.75 -44.25 M-49.0 -28.75 L-49.35 -28.35 Q-50.3 -28.9 -51.05 -29.95 L-51.2 -30.4 Q-50.8 -32.45 -48.9 -34.25 L-48.65 -34.05 -36.7 -44.0 -36.85 -44.2 -35.2 -44.05 -35.25 -44.0 -23.3 -34.05 -22.8 -34.45 Q-20.75 -32.65 -20.95 -30.85 L-21.25 -30.25 Q-22.15 -29.1 -23.2 -28.3 L-23.65 -28.75 -35.6 -18.8 -35.4 -18.3 -37.35 -18.35 -37.05 -18.75 -37.05 -18.8 -49.0 -28.75" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
    <path d="M-3.9 -50.15 L-4.0 -50.2 1.05 -61.15 6.1 -50.2 5.05 -49.7 1.05 -58.45 -2.95 -49.7 -3.9 -50.15 M13.35 -50.2 L18.4 -61.15 23.45 -50.2 23.35 -50.15 23.15 -50.0 22.4 -49.7 18.4 -58.45 14.4 -49.7 13.35 -50.2 M25.5 -45.6 L25.65 -45.45 Q28.45 -42.75 28.45 -39.2 28.45 -35.6 25.5 -32.85 L24.85 -33.45 Q27.55 -36.0 27.55 -39.2 27.55 -42.45 24.85 -44.95 L25.5 -45.6 M19.85 -27.95 L19.85 -22.9 Q19.85 -20.95 18.7 -19.8 17.5 -18.6 15.85 -18.6 14.2 -18.6 13.0 -19.8 11.85 -20.95 11.85 -22.9 L11.85 -27.55 11.85 -28.05 12.9 -28.05 12.9 -22.9 Q12.9 -21.45 13.8 -20.55 14.65 -19.7 15.85 -19.7 17.05 -19.7 17.85 -20.55 18.8 -21.45 18.8 -22.9 L18.8 -28.05 19.85 -28.05 19.85 -27.95 M5.85 -27.6 L5.85 -22.9 Q5.85 -20.95 4.7 -19.8 3.5 -18.6 1.85 -18.6 0.2 -18.6 -1.0 -19.8 -2.15 -20.95 -2.15 -22.9 L-2.15 -28.05 -1.65 -28.05 -1.1 -28.05 -1.1 -22.9 Q-1.1 -21.45 -0.2 -20.55 0.65 -19.7 1.85 -19.7 3.05 -19.7 3.85 -20.55 4.8 -21.45 4.8 -22.9 L4.8 -28.05 5.85 -28.05 5.85 -27.6 M-6.0 -32.85 L-6.05 -32.85 Q-8.95 -35.6 -8.95 -39.2 -8.95 -42.85 -6.05 -45.6 L-5.95 -45.5 -5.4 -44.95 Q-8.1 -42.45 -8.1 -39.2 -8.1 -36.0 -5.4 -33.45 L-6.0 -32.85 M21.75 -44.25 Q21.35 -44.65 21.35 -45.2 21.35 -45.7 21.75 -46.15 22.15 -46.55 22.7 -46.55 23.25 -46.55 23.65 -46.15 24.05 -45.7 24.05 -45.2 24.05 -44.65 23.65 -44.25 23.25 -43.85 22.7 -43.85 22.15 -43.85 21.75 -44.25 M22.05 -45.85 Q21.8 -45.6 21.8 -45.2 21.8 -44.8 22.05 -44.55 22.3 -44.3 22.7 -44.3 L23.35 -44.55 23.6 -45.2 23.35 -45.85 22.7 -46.05 22.05 -45.85 M11.15 -40.75 L13.5 -36.6 15.85 -40.75 11.15 -40.75 M18.9 -43.75 L13.5 -33.95 8.1 -43.75 9.2 -44.35 10.55 -41.95 16.45 -41.95 17.8 -44.35 18.9 -43.75 M5.6 -45.2 Q5.6 -44.65 5.2 -44.25 4.8 -43.85 4.25 -43.85 3.7 -43.85 3.3 -44.25 2.9 -44.65 2.9 -45.2 2.9 -45.7 3.3 -46.15 3.7 -46.55 4.25 -46.55 4.8 -46.55 5.2 -46.15 5.6 -45.7 5.6 -45.2 M4.25 -46.05 L3.6 -45.85 3.35 -45.2 Q3.35 -44.8 3.6 -44.55 3.85 -44.3 4.25 -44.3 4.65 -44.3 4.9 -44.55 L5.15 -45.2 4.9 -45.85 4.25 -46.05 M2.25 -40.6 L-0.25 -39.35 2.25 -38.05 1.65 -37.0 -0.75 -38.5 -0.6 -35.5 -1.8 -35.5 -1.65 -38.5 -4.05 -37.0 -4.65 -38.05 -2.15 -39.35 -4.65 -40.6 -4.05 -41.7 -1.65 -40.15 -1.8 -42.95 -0.6 -42.95 -0.75 -40.15 1.65 -41.7 2.25 -40.6 M41.6 -28.75 L53.55 -18.8 52.95 -18.05 41.0 -28.0 41.6 -28.75 M-49.0 -28.75 L-37.05 -18.8 -37.05 -18.75 -37.35 -18.35 -37.65 -18.05 -49.6 -28.0 -49.0 -28.75 M-35.6 -18.8 L-23.65 -28.75 -23.05 -28.0 -35.0 -18.05 -35.6 -18.8 M-23.3 -34.05 L-35.25 -44.0 -35.2 -44.05 -34.65 -44.75 -22.7 -34.8 -23.3 -34.05 M-36.85 -44.2 L-36.7 -44.0 -48.65 -34.05 -49.25 -34.8 -37.3 -44.75 -36.85 -44.2" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="1">
    <path d="M40.05 -60.2 L40.1 -60.25 40.65 -60.95 52.6 -51.0 52.0 -50.25 40.05 -60.2 M51.65 -44.95 L52.25 -44.2 40.3 -34.25 39.7 -35.0 51.65 -44.95 M37.95 -34.55 L37.65 -34.25 25.7 -44.2 26.3 -44.95 38.25 -35.0 38.25 -34.95 37.95 -34.55 M26.65 -50.25 L26.05 -51.0 38.0 -60.95 38.45 -60.4 38.6 -60.2 26.65 -50.25 M10.5 -52.0 L11.6 -52.0 11.6 -38.1 10.5 -38.1 10.5 -52.0 M1.5 -52.0 L2.6 -52.0 2.6 -38.1 1.5 -38.1 1.5 -52.0 M19.5 -52.0 L20.6 -52.0 20.6 -38.1 19.5 -38.1 19.5 -52.0 M-49.65 -56.8 L-49.05 -57.55 -37.1 -47.6 -37.7 -46.85 -49.65 -56.8" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M40.05 -60.2 L52.0 -50.25 52.5 -50.65 Q54.55 -48.85 54.35 -47.05 L54.05 -46.45 52.1 -44.5 51.65 -44.95 39.7 -35.0 39.9 -34.5 37.95 -34.55 38.25 -34.95 38.25 -35.0 26.3 -44.95 25.95 -44.55 Q25.0 -45.1 24.25 -46.15 24.05 -46.4 24.1 -46.6 24.5 -48.65 26.4 -50.45 L26.65 -50.25 38.6 -60.2 38.45 -60.4 40.1 -60.25 40.05 -60.2" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="2">
    <path d="M-34.6 -44.95 L-34.95 -44.55 Q-35.9 -45.1 -36.65 -46.15 L-36.8 -46.6 Q-36.4 -48.65 -34.5 -50.45 L-34.25 -50.25 -22.3 -60.2 -22.45 -60.4 Q-21.65 -60.95 -20.8 -60.25 L-20.85 -60.2 -8.9 -50.25 -8.4 -50.65 Q-6.35 -48.85 -6.55 -47.05 L-6.85 -46.45 Q-7.75 -45.3 -8.8 -44.5 L-9.25 -44.95 -21.2 -35.0 -21.0 -34.5 -22.95 -34.55 -22.65 -34.95 -22.65 -35.0 -34.6 -44.95" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
    <path d="M10.1 -60.0 L22.05 -50.05 21.45 -49.3 9.5 -59.25 10.1 -60.0 M-34.6 -44.95 L-22.65 -35.0 -22.65 -34.95 -22.95 -34.55 -23.25 -34.25 -35.2 -44.2 -34.6 -44.95 M-21.2 -35.0 L-9.25 -44.95 -8.65 -44.2 -20.6 -34.25 -21.2 -35.0 M-8.9 -50.25 L-20.85 -60.2 -20.8 -60.25 -20.25 -60.95 -8.3 -51.0 -8.9 -50.25 M-22.45 -60.4 L-22.3 -60.2 -34.25 -50.25 -34.85 -51.0 -22.9 -60.95 -22.45 -60.4" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="3">
    <path d="M8.15 -34.5 L7.55 -33.75 -4.4 -43.7 -3.8 -44.45 8.15 -34.5" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="4">
    <path d="M-34.25 -50.25 L-22.3 -60.2 -22.45 -60.4 Q-21.65 -60.95 -20.8 -60.25 L-20.85 -60.2 -8.9 -50.25 -8.4 -50.65 Q-6.35 -48.85 -6.55 -47.05 L-6.85 -46.45 Q-7.75 -45.3 -8.8 -44.5 L-9.25 -44.95 -21.2 -35.0 -21.0 -34.5 -22.95 -34.55 -22.65 -34.95 -22.65 -35.0 -34.6 -44.95 -34.95 -44.55 Q-35.9 -45.1 -36.65 -46.15 L-36.8 -46.6 Q-36.4 -48.65 -34.5 -50.45 L-34.25 -50.25" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
    <path d="M-34.25 -50.25 L-34.85 -51.0 -22.9 -60.95 -22.45 -60.4 -22.3 -60.2 -34.25 -50.25 M10.1 -60.0 L22.05 -50.05 21.45 -49.3 9.5 -59.25 10.1 -60.0 M-20.85 -60.2 L-20.8 -60.25 -20.25 -60.95 -8.3 -51.0 -8.9 -50.25 -20.85 -60.2 M-9.25 -44.95 L-8.65 -44.2 -20.6 -34.25 -21.2 -35.0 -9.25 -44.95 M-22.95 -34.55 L-23.25 -34.25 -35.2 -44.2 -34.6 -44.95 -22.65 -35.0 -22.65 -34.95 -22.95 -34.55" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 51.2, 61.15)" data-frame="5">
    <path d="M40.05 -60.2 L40.1 -60.25 40.65 -60.95 52.6 -51.0 52.0 -50.25 40.05 -60.2 M51.65 -44.95 L52.25 -44.2 40.3 -34.25 39.7 -35.0 51.65 -44.95 M37.95 -34.55 L37.65 -34.25 25.7 -44.2 26.3 -44.95 38.25 -35.0 38.25 -34.95 37.95 -34.55 M26.65 -50.25 L26.05 -51.0 38.0 -60.95 38.45 -60.4 38.6 -60.2 26.65 -50.25 M23.45 -33.85 L22.4 -33.35 18.4 -42.1 14.4 -33.35 13.35 -33.85 18.4 -44.8 23.45 -33.85 M5.05 -33.35 L1.05 -42.1 -2.95 -33.35 -3.9 -33.8 -4.0 -33.85 1.05 -44.8 6.1 -33.85 5.05 -33.35 M-49.65 -56.8 L-49.05 -57.55 -37.1 -47.6 -37.7 -46.85 -49.65 -56.8" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M40.05 -60.2 L52.0 -50.25 52.5 -50.65 Q54.55 -48.85 54.35 -47.05 L54.05 -46.45 52.1 -44.5 51.65 -44.95 39.7 -35.0 39.9 -34.5 37.95 -34.55 38.25 -34.95 38.25 -35.0 26.3 -44.95 25.95 -44.55 Q25.0 -45.1 24.25 -46.15 24.05 -46.4 24.1 -46.6 24.5 -48.65 26.4 -50.45 L26.65 -50.25 38.6 -60.2 38.45 -60.4 40.1 -60.25 40.05 -60.2" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
</svg>`;
  animationSVGs.welneco2 = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" height="74.1px" width="81.4px" xmlns="http://www.w3.org/2000/svg" data-current-frame="0" data-user-id="$id">
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 29.55, 74.4)">
    <path d="M41.85 -49.8 L43.75 -50.45 45.55 -51.05 48.25 -51.45 Q49.65 -51.45 50.6 -50.65 51.75 -49.65 51.8 -48.05 52.05 -45.0 50.05 -43.6 L49.1 -43.05 Q47.65 -42.4 45.55 -42.4 L45.3 -43.65 Q47.9 -43.65 49.25 -44.6 L49.7 -45.05 Q50.5 -45.9 50.55 -47.4 50.6 -48.75 50.0 -49.5 49.3 -50.35 48.25 -50.35 L45.7 -49.8 44.95 -49.5 42.4 -48.4 41.85 -49.8 M36.95 -40.65 L36.2 -41.4 36.6 -41.8 36.95 -42.1 Q39.45 -44.9 39.45 -48.3 39.45 -52.15 36.2 -55.2 L36.95 -55.95 Q40.45 -52.7 40.5 -48.45 L40.5 -48.3 Q40.5 -43.95 36.95 -40.65 M20.6 -34.9 L22.1 -34.2 Q22.6 -33.95 22.1 -33.8 20.7 -25.85 16.25 -21.9 L15.1 -23.4 Q19.2 -26.75 20.6 -34.9 M16.6 -15.35 L17.4 -16.05 Q19.2 -14.35 20.0 -12.75 20.9 -10.85 20.9 -8.4 20.9 -6.2 20.0 -4.3 19.15 -2.55 17.4 -0.55 L16.6 -1.35 Q18.35 -3.25 19.05 -4.8 19.85 -6.5 19.85 -8.4 19.85 -10.65 19.05 -12.25 18.35 -13.7 16.6 -15.35 M13.65 -1.05 L13.3 -0.35 12.6 -0.35 12.85 -1.0 13.3 -2.25 12.6 -2.25 12.6 -3.8 14.2 -3.8 14.2 -2.25 13.65 -1.05 M10.0 -1.0 L9.65 -0.35 8.95 -0.35 9.2 -1.05 9.65 -2.25 8.95 -2.25 8.95 -3.8 10.55 -3.8 10.55 -2.25 10.0 -1.0 M7.8 -1.15 L7.8 -0.3 2.4 -0.3 2.4 -1.15 7.8 -1.15 M2.3 -1.15 L2.3 -0.3 -3.1 -0.3 -3.1 -1.15 2.3 -1.15 M-16.15 -1.2 L-16.55 -0.35 -17.25 -0.35 -16.95 -1.15 -16.55 -2.25 -17.25 -2.25 -17.25 -3.8 -15.65 -3.8 -15.65 -2.25 -16.15 -1.2 M-18.4 -1.15 L-18.4 -0.3 -23.8 -0.3 -23.8 -1.15 -18.4 -1.15 M-25.3 -1.35 L-26.05 -0.55 Q-27.8 -2.55 -28.65 -4.3 -29.55 -6.2 -29.55 -8.4 -29.55 -10.85 -28.65 -12.75 -27.9 -14.35 -26.05 -16.05 L-25.3 -15.35 Q-27.05 -13.7 -27.75 -12.25 -28.5 -10.65 -28.5 -8.4 -28.5 -6.5 -27.75 -4.8 -27.05 -3.25 -25.3 -1.35 M-26.15 -21.5 L-26.9 -21.9 -19.4 -35.2 -18.7 -34.8 -26.15 -21.5 M-20.55 -40.55 Q-22.3 -42.55 -23.15 -44.3 -24.05 -46.2 -24.05 -48.4 -24.05 -50.85 -23.15 -52.75 -22.4 -54.35 -20.55 -56.05 L-19.8 -55.35 Q-21.55 -53.7 -22.25 -52.25 -23.0 -50.65 -23.0 -48.4 -23.0 -46.5 -22.25 -44.8 -21.55 -43.25 -19.8 -41.35 L-20.55 -40.55 M-15.15 -62.25 L-17.0 -62.25 -11.65 -74.4 -9.95 -74.4 -4.6 -62.25 -6.45 -62.25 -7.7 -65.35 -13.9 -65.35 -15.15 -62.25 M-2.55 -61.15 L1.05 -61.15 1.05 -60.3 -4.35 -60.3 -4.35 -61.15 -2.55 -61.15 M1.15 -60.3 L1.15 -61.15 6.55 -61.15 6.55 -60.3 1.15 -60.3 M6.65 -60.3 L6.65 -61.15 11.1 -61.15 12.05 -61.15 12.05 -60.3 6.65 -60.3 M12.35 -62.25 L12.4 -62.3 17.7 -74.4 19.4 -74.4 24.75 -62.25 23.8 -62.25 22.9 -62.25 21.65 -65.35 15.45 -65.35 14.2 -62.25 12.35 -62.25 M16.15 -66.95 L20.95 -66.95 18.6 -72.55 18.5 -72.55 16.15 -66.95 M6.6 -51.4 Q3.85 -48.3 3.85 -45.55 3.85 -44.1 4.25 -43.65 4.7 -43.25 5.35 -43.25 6.25 -43.25 6.85 -43.9 L7.8 -45.2 Q7.65 -45.85 7.8 -46.95 7.85 -47.75 8.4 -48.85 8.9 -49.85 9.4 -49.85 9.95 -49.85 9.95 -48.4 L9.6 -46.35 9.0 -45.0 Q9.0 -44.3 9.45 -43.8 9.95 -43.3 10.8 -43.3 11.7 -43.3 12.35 -43.95 13.5 -45.05 13.5 -47.8 13.5 -50.0 12.85 -51.7 L14.2 -52.05 Q14.95 -50.05 14.95 -47.8 14.95 -44.6 13.4 -43.05 12.45 -42.05 10.9 -42.05 9.55 -42.05 8.85 -42.75 8.3 -43.3 8.15 -43.8 L7.45 -42.9 Q6.6 -42.05 5.35 -42.05 4.15 -42.05 3.35 -42.8 2.6 -43.6 2.6 -45.55 2.6 -48.8 5.4 -52.05 L6.6 -51.4 M4.75 -25.05 L4.75 -24.25 0.7 -24.25 0.7 -22.25 -0.9 -22.25 -0.9 -24.25 -5.05 -24.25 -5.05 -25.05 -0.9 -25.05 -0.9 -26.5 -5.05 -26.5 -5.05 -27.3 -0.9 -27.3 -0.9 -27.6 -5.9 -34.3 -3.95 -34.3 -0.2 -28.95 0.0 -28.95 3.7 -34.3 5.7 -34.3 0.7 -27.6 0.7 -27.3 4.75 -27.3 4.75 -26.5 0.7 -26.5 0.7 -25.05 4.75 -25.05 M-10.85 -72.55 L-13.2 -66.95 -8.4 -66.95 -10.75 -72.55 -10.85 -72.55 M-18.2 -62.25 L-19.1 -60.35 -19.8 -60.35 -19.1 -62.25 -19.8 -62.25 -19.8 -63.8 -18.2 -63.8 -18.2 -62.25 M-17.25 -33.0 L-17.25 -34.55 -15.65 -34.55 -15.65 -33.0 -16.55 -30.9 -17.25 -30.9 -16.55 -33.0 -17.25 -33.0 M-4.4 -14.3 L-4.4 -5.8 -4.45 -5.1 Q-4.65 -4.0 -5.35 -3.25 -6.5 -2.1 -8.9 -2.1 -11.25 -2.1 -12.4 -3.25 -13.1 -3.95 -13.3 -4.9 L-13.4 -5.8 -13.4 -14.3 -11.75 -14.3 -11.75 -5.85 -11.6 -4.9 -11.15 -4.25 Q-10.35 -3.45 -8.9 -3.45 -7.4 -3.45 -6.65 -4.25 L-6.1 -5.05 -6.0 -5.85 -6.0 -14.3 -4.4 -14.3" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M45.3 -43.65 Q40.9 -41.65 36.95 -40.65 40.5 -43.95 40.5 -48.3 L40.5 -48.45 41.85 -49.8 42.4 -48.4 44.95 -49.5 45.7 -49.8 48.25 -50.35 Q49.3 -50.35 50.0 -49.5 50.6 -48.75 50.55 -47.4 50.5 -45.9 49.7 -45.05 L49.25 -44.6 Q47.9 -43.65 45.3 -43.65 M36.6 -41.8 L36.2 -41.4 Q31.3 -37.35 25.35 -36.35 23.0 -35.95 20.6 -34.9 19.2 -26.75 15.1 -23.4 L16.25 -21.9 Q17.7 -19.3 16.6 -15.35 18.35 -13.7 19.05 -12.25 19.85 -10.65 19.85 -8.4 19.85 -6.5 19.05 -4.8 18.35 -3.25 16.6 -1.35 L13.65 -1.05 14.2 -2.25 14.2 -3.8 12.6 -3.8 12.6 -2.25 13.3 -2.25 12.85 -1.0 10.0 -1.0 10.55 -2.25 10.55 -3.8 8.95 -3.8 8.95 -2.25 9.65 -2.25 9.2 -1.05 7.8 -1.15 2.4 -1.15 2.3 -1.15 -3.1 -1.15 -3.1 -0.3 Q-3.3 -1.3 -4.25 -1.3 L-16.15 -1.2 -15.65 -2.25 -15.65 -3.8 -17.25 -3.8 -17.25 -2.25 -16.55 -2.25 -16.95 -1.15 -18.4 -1.15 -23.8 -1.15 -25.3 -1.35 Q-27.05 -3.25 -27.75 -4.8 -28.5 -6.5 -28.5 -8.4 -28.5 -10.65 -27.75 -12.25 -27.05 -13.7 -25.3 -15.35 L-26.05 -16.05 -26.15 -21.5 -18.7 -34.8 -19.4 -35.2 -20.55 -40.55 -19.8 -41.35 Q-21.55 -43.25 -22.25 -44.8 -23.0 -46.5 -23.0 -48.4 -23.0 -50.65 -22.25 -52.25 -21.55 -53.7 -19.8 -55.35 L-20.55 -56.05 Q-18.15 -59.9 -15.15 -62.25 L-13.9 -65.35 -7.7 -65.35 -6.45 -62.25 -4.6 -62.25 Q-3.7 -62.15 -2.55 -61.15 L-4.35 -61.15 -4.35 -60.3 1.05 -60.3 1.15 -60.3 6.55 -60.3 6.65 -60.3 12.05 -60.3 12.05 -61.15 11.1 -61.15 12.35 -62.25 14.2 -62.25 15.45 -65.35 21.65 -65.35 22.9 -62.25 23.8 -62.25 24.75 -62.1 Q31.05 -61.15 35.85 -57.6 38.4 -55.75 36.95 -55.95 L36.2 -55.2 Q39.45 -52.15 39.45 -48.3 39.45 -44.9 36.95 -42.1 L36.6 -41.8 M-10.85 -72.55 L-10.75 -72.55 -8.4 -66.95 -13.2 -66.95 -10.85 -72.55 M4.75 -25.05 L0.7 -25.05 0.7 -26.5 4.75 -26.5 4.75 -27.3 0.7 -27.3 0.7 -27.6 5.7 -34.3 3.7 -34.3 0.0 -28.95 -0.2 -28.95 -3.95 -34.3 -5.9 -34.3 -0.9 -27.6 -0.9 -27.3 -5.05 -27.3 -5.05 -26.5 -0.9 -26.5 -0.9 -25.05 -5.05 -25.05 -5.05 -24.25 -0.9 -24.25 -0.9 -22.25 0.7 -22.25 0.7 -24.25 4.75 -24.25 4.75 -25.05 M6.6 -51.4 L5.4 -52.05 Q2.6 -48.8 2.6 -45.55 2.6 -43.6 3.35 -42.8 4.15 -42.05 5.35 -42.05 6.6 -42.05 7.45 -42.9 L8.15 -43.8 Q8.3 -43.3 8.85 -42.75 9.55 -42.05 10.9 -42.05 12.45 -42.05 13.4 -43.05 14.95 -44.6 14.95 -47.8 14.95 -50.05 14.2 -52.05 L12.85 -51.7 Q13.5 -50.0 13.5 -47.8 13.5 -45.05 12.35 -43.95 11.7 -43.3 10.8 -43.3 9.95 -43.3 9.45 -43.8 9.0 -44.3 9.0 -45.0 L9.6 -46.35 9.95 -48.4 Q9.95 -49.85 9.4 -49.85 8.9 -49.85 8.4 -48.85 7.85 -47.75 7.8 -46.95 7.65 -45.85 7.8 -45.2 L6.85 -43.9 Q6.25 -43.25 5.35 -43.25 4.7 -43.25 4.25 -43.65 3.85 -44.1 3.85 -45.55 3.85 -48.3 6.6 -51.4 M16.15 -66.95 L18.5 -72.55 18.6 -72.55 20.95 -66.95 16.15 -66.95 M-4.4 -14.3 L-6.0 -14.3 -6.0 -5.85 -6.1 -5.05 -6.65 -4.25 Q-7.4 -3.45 -8.9 -3.45 -10.35 -3.45 -11.15 -4.25 L-11.6 -4.9 -11.75 -5.85 -11.75 -14.3 -13.4 -14.3 -13.4 -5.8 -13.3 -4.9 Q-13.1 -3.95 -12.4 -3.25 -11.25 -2.1 -8.9 -2.1 -6.5 -2.1 -5.35 -3.25 -4.65 -4.0 -4.45 -5.1 L-4.4 -5.8 -4.4 -14.3 M-17.25 -33.0 L-16.55 -33.0 -17.25 -30.9 -16.55 -30.9 -15.65 -33.0 -15.65 -34.55 -17.25 -34.55 -17.25 -33.0" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 29.55, 74.4)" data-frame="0">
    <path d="M32.05 -53.8 L33.35 -52.05 Q34.2 -50.45 34.2 -48.45 34.2 -46.6 33.45 -45.05 32.95 -44.0 32.05 -43.1 29.85 -40.9 26.7 -40.9 L24.65 -41.15 Q22.8 -41.65 21.35 -43.1 19.2 -45.3 19.2 -48.45 19.2 -51.6 21.35 -53.8 23.55 -55.95 26.7 -55.95 29.55 -55.95 31.6 -54.2 L32.05 -53.8 M-3.95 -53.8 Q-1.8 -51.6 -1.8 -48.45 -1.8 -45.3 -3.95 -43.1 -6.15 -40.9 -9.3 -40.9 -12.45 -40.9 -14.65 -43.1 -16.8 -45.3 -16.8 -48.45 -16.8 -51.6 -14.65 -53.8 -12.45 -55.95 -9.3 -55.95 -6.15 -55.95 -3.95 -53.8" fill="#000000" fill-rule="evenodd" stroke="none"/>
  </g>
  <g transform="matrix(1.0, 0.0, 0.0, 1.0, 29.55, 74.4)" data-frame="1">
    <path d="M32.05 -53.8 L33.35 -52.05 Q34.2 -50.45 34.2 -48.45 34.2 -46.6 33.45 -45.05 32.95 -44.0 32.05 -43.1 29.85 -40.9 26.7 -40.9 L24.65 -41.15 Q22.8 -41.65 21.35 -43.1 19.2 -45.3 19.2 -48.45 19.2 -51.6 21.35 -53.8 23.55 -55.95 26.7 -55.95 29.55 -55.95 31.6 -54.2 L32.05 -53.8 M22.55 -52.6 Q20.8 -50.85 20.8 -48.45 20.8 -46.05 22.55 -44.3 24.3 -42.55 26.7 -42.55 29.1 -42.55 30.85 -44.3 32.6 -46.05 32.6 -48.45 32.6 -50.85 30.85 -52.6 29.1 -54.35 26.7 -54.35 24.3 -54.35 22.55 -52.6 M-9.3 -54.35 Q-11.7 -54.35 -13.45 -52.6 -15.2 -50.85 -15.2 -48.45 -15.2 -46.05 -13.45 -44.3 -11.7 -42.55 -9.3 -42.55 -6.9 -42.55 -5.15 -44.3 -3.4 -46.05 -3.4 -48.45 -3.4 -50.85 -5.15 -52.6 -6.9 -54.35 -9.3 -54.35 M-3.95 -53.8 Q-1.8 -51.6 -1.8 -48.45 -1.8 -45.3 -3.95 -43.1 -6.15 -40.9 -9.3 -40.9 -12.45 -40.9 -14.65 -43.1 -16.8 -45.3 -16.8 -48.45 -16.8 -51.6 -14.65 -53.8 -12.45 -55.95 -9.3 -55.95 -6.15 -55.95 -3.95 -53.8" fill="#000000" fill-rule="evenodd" stroke="none"/>
    <path d="M-9.3 -54.35 Q-6.9 -54.35 -5.15 -52.6 -3.4 -50.85 -3.4 -48.45 -3.4 -46.05 -5.15 -44.3 -6.9 -42.55 -9.3 -42.55 -11.7 -42.55 -13.45 -44.3 -15.2 -46.05 -15.2 -48.45 -15.2 -50.85 -13.45 -52.6 -11.7 -54.35 -9.3 -54.35 M22.55 -52.6 Q24.3 -54.35 26.7 -54.35 29.1 -54.35 30.85 -52.6 32.6 -50.85 32.6 -48.45 32.6 -46.05 30.85 -44.3 29.1 -42.55 26.7 -42.55 24.3 -42.55 22.55 -44.3 20.8 -46.05 20.8 -48.45 20.8 -50.85 22.55 -52.6" fill="#ffffff" fill-rule="evenodd" stroke="none"/>
  </g>
</svg>`;
  var XMLHttpRequest_open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (url.includes('monachatchat'))
      this.addEventListener('load', () => this.responseText.split(RS).forEach(astralParser));
    else if (/^\/img\/svg\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.svg$/.test(url))
      this.userId = RegExp.$1;
    else if (/^\/img\/kb\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.svg$/.test(url))
      return XMLHttpRequest_open.apply(this, [method, url.replace(RegExp.$1, Bot.users[RegExp.$1].realType), ...args]);
    return XMLHttpRequest_open.apply(this, arguments);
  };
  var XMLHttpRequest_send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if (this.userId) {
      Object.defineProperty(this, 'responseText', {
        value: animationSVGs[Bot.users[this.userId].realType].replace('$id', this.userId),
        enumerable: true,
        configurable: true
      });
      this.onloadend();
      this.abort();
      return;
    }
    return XMLHttpRequest_send.apply(this, arguments);
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
              element.textContent = '';
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
    var configInfoJSON = JSON.stringify(configInfo);
    var extensionConfigJSON = JSON.stringify(extensionConfig);
    configWindow.document.write(`<!doctype html>\n<head><title>☆ω拡張設定</title><meta name="viewport" content="width=device-width"></head><body><script nonce="${nonce}">var configInfo = ${configInfoJSON};(${configScript})();load(${extensionConfigJSON})</script></body>`);
    configWindow.document.close();
  };
  var toggleStatComment = () => {
    document.getElementById('toggleStatComment').selected = true;
    menu.onchange();
  };
  var createMenu = function (list) {
    var select = document.createElement('select');
    list = list.filter(opt => {
      if (opt.oninit?.() === false)
        return false;
      opt.element = document.createElement('option');
      if (opt.id)
        opt.element.id = opt.id;
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
  var pauseNotification, pauseYomiage, mikeyMode;
  var menu = createMenu([
    {
      name: '拡張メニュー',
    },
    {
      name: '連投対策',
      type: 'toggle',
      onclick: checked => {
        if (mikeyMode = checked)
          alertOnce('連投対策は誤検出されやすいため、荒らしが来た時だけ有効にしてください。', 'mikey');
      }
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
      name: '通知停止',
      type: 'toggle',
      oninit: () => !!window.Notification,
      onclick: checked => {
        pauseNotification = checked;
      }
    },
    {
      name: '読み上げ停止',
      type: 'toggle',
      oninit: () => !!window.speechSynthesis,
      onclick: checked => {
        if (pauseYomiage = checked)
          speechSynthesis.cancel();
      }
    },
    {
      name: '状態発言',
      id: 'toggleStatComment',
      type: 'toggle',
      onclick: checked => {
        statComment = checked;
        Bot.stat(statComment ? '状態発言ON' : '通常');
        document.getElementById('toggleStatCommentMobile').textContent = statComment ? '🔇' : '🔈';
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
    },
    {
      name: '赤字を消す',
      onclick: () => showMessage('')
    }
  ]);
  var showMessage = function (s) {
    var m = document.getElementById('extensionMessage');
    if (m)
      m.textContent = s;
    if (s)
      console.log(s);
  };
  var alertOnce = (msg, id) => {
    if (localStorage.getItem('extensionAlert/' + id))
      return;
    localStorage.setItem('extensionAlert/' + id, 'a');
    alert(msg);
  };
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
  var keyControlTimer;
  document.addEventListener('keydown', e => {
    if (!extensionConfig.keyControl || !Bot.users[Bot.myId] || event.target.type === 'text' || !event.key?.startsWith('Arrow'))
      return;
    e.preventDefault();
    if (event.repeat)
      return;
    var count = 0, myself = {}, direction = event.key.slice(5).toLowerCase();
    myself.x = Bot.users[Bot.myId].x;
    myself.y = Bot.users[Bot.myId].y;
    var move = () => {
      var attr = {up: {y: -5}, down: {y: 5}, right: {x: 5}, left: {x: -5}}[direction];
      count++;
      Object.keys(attr).forEach(key => {
        myself[key] += attr[key] * (count < 2 ? 2 : count < 4 ? 10 : 20);
      });
      Bot.set(myself);
    };
    clearInterval(keyControlTimer);
    keyControlTimer = setInterval(move, 250);
    move();
  });
  var patanFlag = false;
  var sendPatan = () => Bot.ignore('!patan', patanFlag = !patanFlag);
  var sendCurrentPatan = () => {
    if (document.body.dataset.ev === 'patan' && patanFlag)
      Bot.ignore('!patan', true);
  };
  var sendChika2 = () => Bot.ignore('!chika2');
  var chika2Timer = {};
  var doChika2 = id => {
    var svg = document.querySelector(`svg[data-user-id="${id}"]`);
    if (!svg)
      return;
    svg.dataset.currentFrame = '1';
    clearTimeout(chika2Timer[id]);
    chika2Timer[id] = setTimeout(() => svg.dataset.currentFrame = '0', 250);
  };
  var patanTimer = {};
  var playPatanAnimation = (id, svg, frames) => {
    clearInterval(patanTimer[id]);
    patanTimer[id] = setInterval(() => {
      if (!frames.length) {
        clearInterval(patanTimer[id]);
        return;
      }
      svg.dataset.currentFrame = frames.shift();
    }, 1000 / 12);
  };
  var doPatan = (id, closed) => {
    var svg = document.querySelector(`svg[data-user-id="${id}"]`);
    if (!svg)
      return;
    if (svg.dataset.currentFrame !== '0' && !closed)
      playPatanAnimation(id, svg, [4, 5, 0]);
    else if (svg.dataset.currentFrame !== '3' && closed)
      playPatanAnimation(id, svg, [1, 2, 3]);
  };
  var updateClock = () => {
    var clock = Array.from(document.querySelectorAll('.clock'));
    if (!clock.length)
      return;
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s/60;
    const h = now.getHours() % 12 + m/60;
    clock.forEach(clock => {
      var direction = /scale\([^\)]*-/.test(clock.parentNode.parentNode.parentNode.getAttribute('style')) ? -1 : 1;
      clock.children[0].setAttribute("transform", `rotate(${direction * h * 30}, 45, 22.5)`);
      clock.children[1].setAttribute("transform", `rotate(${direction * m * 6}, 45, 22.5)`);
      clock.children[2].setAttribute("transform", `rotate(${direction * Math.round(s * 6)}, 45, 22.5)`);
    });
  };
  setInterval(updateClock, 1000);
  document.addEventListener('keyup', e => clearInterval(keyControlTimer));
  addEventListener('load', () => {
    var observer = new MutationObserver(() => {
      var noclock = Array.from(document.querySelectorAll('svg[height="110.8px"][width="69.65px"]:not(.set)'));
      noclock.forEach(svg => {
        svg.innerHTML += '<g class="clock"><line x1="45" y1="22.5" x2="45" y2="12" stroke="black" stroke-width="1.5"/><line x1="45" y1="22.5" x2="45" y2="6" stroke="black" stroke-width="1"/><line x1="45" y1="22.5" x2="45" y2="5" stroke="red" stroke-width="0.5"/></g>';
        svg.classList.add('set');
      });
      var nokbclock = Array.from(document.querySelectorAll('svg[width="70px"][height="111px"][version="1.1"]:not(.set)'));
      nokbclock.forEach(svg => {
        svg.innerHTML += '<g class="clock"><line x1="45" y1="22.5" x2="45" y2="12" stroke="black" stroke-width="2" stroke-linecap="round"/><line x1="45" y1="22.5" x2="45" y2="6" stroke="black" stroke-width="1.5" stroke-linecap="round"/><line x1="45" y1="22.5" x2="45" y2="5" stroke="red" stroke-width="1" stroke-linecap="round"/></g>';
        svg.classList.add('set');
      });
      if (noclock.length || nokbclock.length)
        updateClock();
      if (extensionConfig.showImage)
        Array.from(document.body.querySelectorAll('[href^="https://cdn.discordapp.com/attachments/1328162542463483994/"]:not([data-youtube],[data-img])')).forEach(a => {
          if (!/\.(?:png|jpe?g|gif|bmp|webp)\?/i.test(a.href))
            return;
          var img = new Image();
          img.onload = function () {
            var logContainer = document.querySelector('.log-container');
            var isBottom = logContainer.scrollHeight !== logContainer.clientHeight && logContainer.scrollHeight - logContainer.scrollTop - logContainer.clientHeight < 2;
            var height = Math.min(img.height, 150);
            a.dataset.img = 'true';
            a.style.backgroundImage = `url("${encodeURI(a.href)}")`;
            a.style.width = Math.round(img.width * height / img.height) + 'px';
            a.style.height = height + 'px';
            if (isBottom)
              logContainer.scrollTop = logContainer.scrollHeight;
          };
          img.src = a.href;
        });
      if (extensionConfig.youtubeThumbnail)
        Array.from(document.body.querySelectorAll('a:not([data-youtube],[data-img])')).forEach(a => {
          var yt = getYouTubeInfo(a.href);
          if (!yt)
            return;
          var logContainer = document.querySelector('.log-container');
          var isBottom = logContainer.scrollHeight !== logContainer.clientHeight && logContainer.scrollHeight - logContainer.scrollTop - logContainer.clientHeight < 2;
          a.dataset.youtube = 'true';
          var thumb = {1: 'default', 2: 'mqdefault', 3: 'hqdefault'}[extensionConfig.youtubeThumbnail];
          a.style.backgroundImage = `url("https://img.youtube.com/vi/${encodeURI(yt[1])}/${thumb}.jpg")`;
          if (isBottom)
            logContainer.scrollTop = logContainer.scrollHeight;
        });
    });
    observer.observe(document.body, {subtree: true, childList: true});
    var defaultWidth = document.documentElement.clientWidth;
    document.head.append(extCSS);
    document.body.append(dialog);
    document.querySelector('meta[name=viewport]')?.remove();
    document.head.appendChild(metaViewport);
    var div = document.createElement('div');
    div.append(menu);
    div.append(createElement('button', {
      textContent: 'ログ窓',
      onclick: openLog
    }));
    div.append(createElement('button', {
      textContent: '設定',
      onclick: openConfig
    }));
    div.append(createElement('button', {
      className: 'patan',
      textContent: 'ﾊﾟﾀﾝ',
      onclick: sendPatan
    }));
    div.append(createElement('button', {
      className: 'chika2',
      textContent: 'ﾁｶﾁｶ',
      onclick: sendChika2
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
      textContent: 'ｽﾏﾎ接続維持'
    }));
    if (window.crypto && !localStorage.getItem('extensionEncryptionDisabled')) {
      div.append(createElement('input', {
        type: 'checkbox',
        id: 'encryption',
        onclick: async function () {
          this.style.display = this.nextSibling.style.display = 'none';
          await encrypter[this.checked ? 'on' : 'off']();
          this.style.display = this.nextSibling.style.display =  '';
        }
      }));
      div.append(createElement('label', {
        htmlFor: 'encryption',
        textContent: '暗号化'
      }));
      var pendingHTML = '<option>追加許可<option>全て消す';
      div.append(createElement('select', {
        id: 'pendingList',
        innerHTML: pendingHTML,
        onchange: function () {
          var index = pendingList.selectedIndex;
          if (index === 1) {
            pendingList.innerHTML = pendingHTML;
            pendingUsers = {};
          } else if (index > 1) {
            var pendingUser = pendingUsers[pendingList.value];
            if (!encrypter.candidateIds)
              encrypter.candidateIds = new Set();
            encrypter.candidateIds.add(pendingList.value);
            if (Bot.users[pendingList.value])
              encrypter.sendSharedKey(...pendingUser.args);
            else
              allowedUsers[pendingList.value] = pendingUser.args;
            delete pendingUsers[pendingList.value];
            pendingList.remove(index);
          }
          pendingList.selectedIndex = 0;
        }
      }));
    }
    div.append(createElement('span', {id:'extensionMessage'}));
    document.body.firstElementChild.before(div);
    querySelectorAsync('.panel-container').then(element => {
      var inputContainer = createElement('div', {id: 'smartInput'});
      inputContainer.setAttribute('style', 'width:1000px');
      element.after(inputContainer);
      var input = createElement('input', {
        type: 'text',
        placeholder: 'スマホ入力用',
        onkeypress: e => {
          if (e.target.value && e.key === 'Enter') {
            if (/^状態[:：](.*)$/.test(e.target.value))
              Bot.stat(RegExp.$1 || '通常');
            else
              Bot.comment(e.target.value);
            e.target.value = '';
          }
        }
      });
      var smartSize = Math.max(16, Math.ceil(16000 / defaultWidth)) + 'px';
      input.setAttribute('style', 'flex-grow:1;font-size:' + smartSize);
      inputContainer.append(input);
      var file = createElement('input', {
        type: 'file',
        onchange: e => {
          upload(e.target.files[0]);
          e.target.value = '';
        }
      });
      var uploadButton = createElement('button', {
        id: 'uploadButton',
        textContent: '＋',
        onclick: e => file.click()
      });
      uploadButton.setAttribute('style', 'font-size:' + smartSize);
      input.before(uploadButton);
      var statCommandButton = createElement('button', {
        id: 'toggleStatCommentMobile',
        textContent: '🔈',
        onclick: toggleStatComment
      });
      statCommandButton.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(statCommandButton);
      var button = createElement('button', {
        textContent: '🎮',
        onclick: e => {
          controller.style.display = controller.style.display ? '' : 'none';
        }
      });
      button.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(button);
      var mobilePatanButton = createElement('button', {
        className: 'patan',
        textContent: 'ﾊﾟﾀﾝ',
        onclick: sendPatan
      });
      mobilePatanButton.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(mobilePatanButton);
      var mobileChika2Button = createElement('button', {
        className: 'chika2',
        textContent: 'ﾁｶﾁｶ',
        onclick: sendChika2
      });
      mobileChika2Button.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(mobileChika2Button);
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
      controller.id = 'characterController';
      controller.style.marginLeft = 'auto';
      controller.style.marginRight = controller.style.width;
      inputContainer.after(controller);
      var miniPlayer = createElement('div', {id: 'miniPlayer'});
      document.body.append(miniPlayer);
      var miniPlayerButtonContainer = createElement('div');
      miniPlayer.append(miniPlayerButtonContainer);
      var miniPlayerPositionSelector = createElement('select', {
        innerHTML: configInfo.find(item => item.key === 'miniPlayer').type.slice(1).map(v => '<option>' + v).join(''),
        onchange: () => miniPlayer.setAttribute('data-position', miniPlayerPositionSelector.value)
      });
      miniPlayerPositionSelector.style.fontSize = smartSize;
      miniPlayerButtonContainer.append(miniPlayerPositionSelector);
      var miniPlayerCloseButton = createElement('button', {
        textContent: '×',
        onclick: () => {
          miniPlayer.removeAttribute('data-position');
          miniPlayerIFrame.src = 'about:blank';
        }
      });
      miniPlayerCloseButton.style.fontSize = smartSize;
      miniPlayerButtonContainer.append(miniPlayerCloseButton);
      var miniPlayerIFrame = createElement('iframe', {
        src: 'about:blank',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        scrolling: 'no',
        allowFullscreen: true,
        onload: () => {
          if (extensionConfig.youtubeSync)
            miniPlayerIFrame.contentWindow.postMessage(JSON.stringify({event: 'listening', id: 1, channel: 'widget'}), '*');
        }
      });
      miniPlayer.append(miniPlayerIFrame);
      document.body.addEventListener('click', e => {
        if (!extensionConfig.miniPlayer)
          return;
        var a = [e.target, e.target.parentNode].find(a => a.tagName === 'A');
        if (!a)
          return;
        miniPlayerIFrame.dataset.owner = '';
        var yt = getYouTubeInfo(a.href);
        if (yt) {
          miniPlayerIFrame.src = 'https://www.youtube.com/embed/' + yt[1] + '?enablejsapi=1' + (yt[2] ? '&start=' + yt[2] : '');
          miniPlayerIFrame.dataset.owner = a.parentNode.firstElementChild.textContent;
        } else if (!/iPhone|iPad/.test(navigator.userAgent) && /^https:\/\/twitcasting\.tv\/([^\/]+)/.test(a.href))
          miniPlayerIFrame.src = 'https://twitcasting.tv/' + RegExp.$1 + '/embeddedplayer/live';
        else
          return;
        e.preventDefault();
        miniPlayerPositionSelector.selectedIndex = extensionConfig.miniPlayer - 1;
        miniPlayerPositionSelector.onchange();
        miniPlayer.scrollIntoView({block: 'nearest', inline: 'nearest'});
      });
    });
  });
  var youtubeCurrentTime = 0;
  addEventListener('message', event => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.event === 'infoDelivery' && typeof data.info?.currentTime === 'number')
        youtubeCurrentTime = Math.round(data.info.currentTime);
    } catch (e) {}
  });
  document.addEventListener('click', e => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    if (sound) {
      sound.volume = 0;
      sound.muted = true;
      sound.play().catch(e => e);
      sound.addEventListener('ended', e => {
        sound.volume = extensionConfig.notifySoundVolume;
        sound.muted = false;
      }, {once: true});
    }
  }, {once: true});
  document.addEventListener('beforeunload', () => silence?.pause());
  var onerror = text => {
    if (extensionConfig.webhook)
      fetch(extensionConfig.webhook, { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify({username: Bot?.users?.[Bot.myId]?.fullName, content: text})}).catch(e => e);
  };
  addEventListener('unhandledrejection', event => {
    if (event.reason?.constructor === Event)
      return;
    if (event.reason)
      onerror('' + event.reason);
    else
      console.log(event);
  });
  addEventListener('error', event => {
    if (event.error)
      onerror('' + event.error);
    else
      console.log(event);
  });
};
try {
  inject();
} catch (err) {
  alert('拡張機能でエラーが出ました。以下の情報を管理人に報告お願いします。\nエラー：' + err);
  localStorage.setItem('/monachatchat/extension', 'false');
  location.reload();
}
