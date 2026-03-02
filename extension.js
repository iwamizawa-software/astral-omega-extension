var inject = function () {

  if (navigator.userAgent.includes(';;;'))
    return;

  var forceReload;
  var reloadChat = function () {
    forceReload = true;
    location.reload();
  };
  addEventListener('load', function () {
    if (localStorage.getItem('/monachatchat/extension') !== 'true')
      return;
    var div = document.createElement('div');
    div.setAttribute('style', 'position:absolute;right:0;top:0');
    div.innerHTML = '<a href="https://iwamizawa-software.github.io/astral-omega-extension/docs/" style="text-decoration:none" target="_blank">ℹ️</a>';
    var button = document.createElement('button');
    button.textContent = 'バグ時押す';
    button.style.color = 'red';
    button.onclick = function () {
      localStorage.setItem('/monachatchat/extension', 'false');
      open('https://iwamizawa-software.github.io/astral-omega-extension/docs/bug.html');
      reloadChat();
    };
    div.appendChild(button);
    document.body.appendChild(div);
  });
  
  var nonce = window.crypto?.randomUUID?.() || Math.random() + '';
  (function setCSP() {
    var removeEventHandler = () => {
      var link = document.querySelector('[onload]');
      if (link?.rel === 'preload') {
        link.removeAttribute('onload');
        link.onload = () => link.rel = 'stylesheet';
      }
    };
    var csp = `<meta http-equiv="content-security-policy" content="script-src 'self' 'nonce-${nonce}' https://iwamizawa-software.github.io/astral-omega-extension/extension.js https://www.googletagmanager.com/;worker-src 'self' blob:">`;
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
<p><a href="https://form1ssl.fc2.com/form/?id=d541ae59d35ee868">問い合わせフォーム</a>`);
      document.close();
    });
    window.XMLHttpRequest = window.WebSocket = e => e;
    return;
  }
/*
  if (!localStorage.getItem('/monachatchat/extension') && localStorage.getItem('/monachatchat/name') !== null && localStorage.getItem('/monachatchat/name') !== '名無しさん')
    localStorage.setItem('/monachatchat/extension', 'true');*/

  var checkWebhook = async () => {
    var obj = await (await fetch('https://sub-chat.onrender.com/webhook?t=' + Date.now())).json();
    if (!Object.keys(obj).length)
      return;
    if (obj.ban) {
      extensionConfig.uploadPassword = extensionConfig.uploadUrl = extensionConfig.webhook = '';
    } else {
      if (!extensionConfig.webhook)
        showMessage('アップロードが許可されました');
      extensionConfig.webhook = obj.webhook;
      extensionConfig.uploadUrl = obj.uploadUrl;
      extensionConfig.uploadPassword = obj.uploadPassword;
    }
    localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
    applyConfig();
  };

  var VERSION = 11;
  var SUBCHAT_URL = 'https://sub-chat.onrender.com/?';
  setInterval(async () => {
    var v = +(await (await fetch('https://raw.githubusercontent.com/iwamizawa-software/astral-omega-extension/refs/heads/main/extension.js?t=' + (new Date).getTime())).text())
      ?.match(/var VERSION = (\d+);/)?.[1];
    if (VERSION < v)
      reloadChat();
    checkWebhook();
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
      key: 'hideStatCommentButton',
      name: 'スマホモードの状態発言ボタンを消す',
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
      key: 'whatifConsole',
      name: 'whatifジャンキー用画面',
      description: 'ONにするとwhatif補助画面を出せるボタンが出ます（ONしたら要リロード）',
      type: 'onoff',
      value: 0
    },
    {
      name: 'YouTube',
      type: 'separator'
    },
    {
      key: 'miniPlayer',
      name: 'YouTubeとツイキャスとTwitchをミニプレイヤーで表示',
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
      key: 'replaceWord',
      name: '検閲ワード',
      description: '指定した言葉が含まれた発言を非表示にします。',
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
      key: 'passwordForBot',
      name: '復号用パスワード',
      type: 'input',
      value: ''
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
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

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
  var getYouTubeInfo = url => url?.match(/^https:\/\/(?:(?:www\.)?youtube\.com\/(?:watch.*[\?&]v=|shorts\/|live\/|embed\/)|youtu\.be\/)([^\?&#]+)(?:\?t=(\d+))?/);

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
  var arrayBufferToBase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
  var base64ToArrayBuffer = base64 => Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
  var textEncoder = new TextEncoder();
  var textDecoder = new TextDecoder();
  var decryptFromBase64 = async (base64, returnArrayBuffer) => {
    var salt = base64ToArrayBuffer(base64.slice(0, 24));
    var iv = base64ToArrayBuffer(base64.slice(24, 40));
    var buffer = await crypto.subtle.decrypt(
      {name: 'AES-GCM', iv},
      await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 1000000,
          hash: 'SHA-256'
        },
        await crypto.subtle.importKey(
          'raw',
          textEncoder.encode(extensionConfig.passwordForBot),
          'PBKDF2',
          false,
          ['deriveKey']
        ),
        {name: 'AES-GCM', length: 256},
        true,
        ['decrypt']
      ),
      base64ToArrayBuffer(base64.slice(40))
    );
    if (returnArrayBuffer)
      return buffer;
    return textDecoder.decode(buffer);
  };
  var verifyExternalBot = async code => {
    var code = code.replace(/\r\n/g, '\n').replace(/\/\/ signature:([a-zA-Z0-9\+\/=]+)\n$/, '');
    var signature = RegExp.$1;
    return arrayBufferToBase64(await decryptFromBase64(signature, true)) === arrayBufferToBase64(await crypto.subtle.digest('SHA-256', textEncoder.encode(code)));
  };
  var whatifConsole = function () {
    var toColorEmoji = s => s.replace(/[♠♥♣♦]|Jo/g, s => ({'♣': '♣️', '♠': '♠️', '♥': '♥️', '♦': '♦️', 'Jo': '🃏'}[s]));
    var toNumber = s => '♠♥♣♦'.indexOf(s[0]) * 13 + 'A23456789⒑JQK'.indexOf(s[1]);
    var cards = Array(52);
    on('SET', async user => {
      if (user.kuro !== '◆bbbbbbbbB.')
        return;
      if (/^(\d+)｜([^｜]+)｜(.+)$/.test(user.stat)) {
        var currentCard = RegExp.$2;
        var currentNumber = toNumber(currentCard);
        if (RegExp.$1 === '0') {
          Array.from(document.querySelectorAll('#gameWindow td')).forEach(td => td.className = '');
        } else {
          var currentCell = document.getElementById('playingcard' + currentNumber);
          currentCell.classList.remove('hands');
          currentCell.classList.add('removed');
        }
        RegExp.$3.split('　').map(c => toNumber(c)).forEach(n => {
          if (n >= 0)
            document.getElementById('playingcard' + n).classList.add('hands');
        });
        Array.from(document.querySelectorAll('.currentSuit,.currentRank')).forEach(td => {
          td.classList.remove('currentSuit');
          td.classList.remove('currentRank');
        });
        Array.from(document.querySelectorAll(`[data-suit="${Math.floor(currentNumber / 13)}"] td`)).forEach(td => td.classList.add('currentSuit'));
        Array.from(document.querySelectorAll(`[data-rank="${currentNumber % 13}"]`)).forEach(td => td.classList.add('currentRank'));
        document.getElementById('gameMessage').innerHTML = toColorEmoji(user.stat.replace(/[<>]/g, '')
          .replace(/[♠♥♣♦][A23456789⒑JQK](?:　|$)/g, card => currentNumber < 0 || card[0] === currentCard[0] || card[1] === currentCard[1] ? `<span class="selectable">${card}</span>` : card)
        );
      } else if (/[♠♥♣♦]/.test(user.stat)) {
        document.getElementById('gameMessage').textContent = toColorEmoji(user.stat);
      }
    });
    if (document.getElementById('gameWindow'))
      return;
    document.head.appendChild(document.createElement('style')).textContent = `
#gameWindow {display:none;font-size:max(16px,2vw);position:absolute;z-index:10000}
#gameWindow table{border-spacing:0}
#gameWindow td{color:white;padding:3px;font-weight:bold;background-color:mediumblue;border:2px solid mediumblue}
#gameWindow td.removed{color:mediumblue}
#gameWindow td.hands{color:gold}
#gameWindow td.currentSuit{border-top-color:deepskyblue;border-bottom-color:deepskyblue}
#gameWindow td.currentRank{border-left-color:deepskyblue;border-right-color:deepskyblue}
#gameWindow td.currentSuit.currentRank{border-color:mediumblue}
#gameWindow p{margin:0;font-weight:bold;background-color:white;color:black}
#gameWindow .selectable{color:darkorange}
`;
    var gameWindow = document.createElement('div');
    gameWindow.id = 'gameWindow';
    if (document.body)
      document.body.append(gameWindow);
    else
      addEventListener('load', () => document.body.append(gameWindow));
    var table = gameWindow.appendChild(document.createElement('table'));
    for (var i = 0; i < 4; i++) {
      var tr = table.insertRow();
      tr.dataset.suit = i;
      var td = tr.insertCell();
      td.textContent = toColorEmoji('♠♥♣♦'[i]);
      for (var j = 0; j < 13; j++) {
        td = tr.insertCell();
        td.dataset.rank = j;
        td.id = 'playingcard' + (i * 13 + j);
        td.textContent = 'A23456789⒑JQK'[j];
      }
      td = tr.insertCell();
      td.textContent = toColorEmoji('♠♥♣♦'[i]);
    }
    gameWindow.appendChild(document.createElement('p')).id = 'gameMessage';
  };
  var pendingCount = 0;
  window.Bot = async function () {
    if (pendingCount++)
      return;
    do {
      await _Bot();
    } while (--pendingCount);
  };
  var _Bot = async function () {
    var bot = (extensionConfig.whatifConsole ? '(' + whatifConsole + ')();\n' : '') +
      extensionConfig.bot + (await Promise.allSettled(extensionConfig.externalBot.map(url => fetch(url + (url.includes('?') ? '&' : '?') + Date.now()).then(async res => {
      if (!res.ok)
        return;
      var externalBot = await res.text();
      if (extensionConfig.passwordForBot && !await verifyExternalBot(externalBot)) {
        console.log(`外部BOTハッシュ不一致：${url}`);
        return;
      }
      return externalBot;
    }).catch(error => console.log(`外部BOTエラー：${url} - ${error.message}`))))).map(result => result.value || '').join('\n');
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
    if (location.hash === '#/select' || location.hash === '#/')
      return;
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
    if (attr?.stat?.length > 20)
      attr.stat = attr.stat.slice(0, 20);
    Bot.send('SET', Object.assign({x, y, scl, stat}, attr));
    Object.assign(Bot.users[Bot.myId], attr);
  };
  Bot.ignore = function (ihash, ignore, fullName) {
    if (!ihash || Bot.users[Bot.myId]?.ihash === ihash)
      return;
    Bot.send('IG', {ihash, stat: ignore ? 'on' : 'off'});
    if (fullName && ignore)
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
  Bot.decrypt = decryptFromBase64;
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
  var _execBot = (type, data) => {
    var listeners = Bot.listeners[type];
    if (listeners)
      Bot.listeners[type] = listeners.filter(listener => {
        if (listener.resolved)
          return false;
        if (!listener.run) {
          try {
            var startTime = performance.now();
            var value = listener.apply(this, type === '*' ? data : [Bot.users[data[1].id]]);
            listener.maxExecutionTime = Math.max(performance.now() - startTime, listener.maxExecutionTime || 0);
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
  var execBot = data => {
    _execBot(data[0], data);
    _execBot('*', data);
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
      Array.from(dialog.querySelectorAll('[src]')).forEach(media => URL.revokeObjectURL(media.src));
      dialog.innerHTML = '';
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
  var getDetailHTML = file => {
    var mimeType = file.type.split('/')[0];
    if (mimeType === 'image')
      return `<img src="${URL.createObjectURL(file)}"><br>`;
    else if (mimeType === 'audio')
      return `<audio src="${URL.createObjectURL(file)}" controls></audio><br>`;
    else if (mimeType === 'video')
      return `<video src="${URL.createObjectURL(file)}" controls playsinline></video><br>`;
    else
      return `<iframe src="${URL.createObjectURL(new Blob([file], {type: 'text/plain;charset=utf-8'}))}" sandbox></iframe><br>`;
  };
  var displayUploading = uploading => {
    var inputBox = document.querySelector('.setting-bar-center [type=text]');
    var smartInputBox = document.querySelector('#smartInput [type=text]');
    if (!inputBox)
      return;
    smartInputBox.placeholder = inputBox.placeholder = (smartInputBox.disabled = inputBox.disabled = uploading) ? 'ファイルをアップロード中...' : '';
  };
  var processImage = async function (file) {
    const isImage = file.type.startsWith("image/");
    const isHeic = file.type === "image/heic" || file.type === "image/heif";
    const LIMIT = 10 * 1024 * 1024;
  
    if (!isImage || (!isHeic && file.size < LIMIT)) {
      return file;
    }
  
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
  
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
  
    let blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );
  
    if (blob.size >= LIMIT) {
      const ratio = Math.sqrt(LIMIT / blob.size) * 0.9;
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
  
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");
      const img = await createImageBitmap(file);
      ctx.drawImage(img, 0, 0, width, height);
      img.close();
  
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
    }
  
    return new File([blob], "file.jpg", { type: "image/jpeg" });
  };
  var canUpload = () => /^https:\/\/(?:canary\.)?discord\.com\/api\/webhooks/.test(extensionConfig.webhook);
  var upload = async file => {
    try {
      if (!/^(?:image|video|audio|text)\//.test(file.type)) {
        showMessage('画像と動画と音声とテキストファイル以外アップロードできません');
        return;
      }
      if (!file.size) {
        showMessage('ファイルの中身がない');
        return;
      }
      if (!canUpload())
        return;
      displayUploading(true);
      file = await processImage(file);
      if (extensionConfig.confirmUpload && !await asyncConfirm(getDetailHTML(file) + escapeHTML(file.name) + 'をアップロードしますか？<br><strong style="color:red">アップロードしたファイルは24時間消えないので注意してください</strong>')) {
        displayUploading(false);
        return;
      }
      var formData = new FormData();
      formData.append('file', file, file.name.replace(/^[\s\S]*?(\.[^\.]+)?$/, 'file$1'));
      formData.append('username', Bot?.users?.[Bot.myId]?.fullName);
      var result = await (await fetch(extensionConfig.webhook, {method: 'POST', body: formData})).json();
      Bot.comment(result.attachments[0].url);
      setTimeout(() => fetch(extensionConfig.webhook + '/messages/' + result.id, {method: 'DELETE'}), 60000);
      displayUploading(false);
    } catch (err) {
      alert('アップロード中にエラーが出た\n' + err);
      displayUploading(false);
    }
  };
  addEventListener('dragover', e => {
    if (!(canUpload() && e.dataTransfer.types.includes('Files')))
      return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  addEventListener('drop', e => {
    if (!(canUpload() && e.dataTransfer.types.includes('Files')))
      return;
    e.preventDefault();
    upload(e.dataTransfer.files[0]);
  });
  addEventListener('paste', async e => {
    if (!canUpload())
      return;
    if (e.clipboardData.types.includes('Files')) {
      e.preventDefault();
      upload(e.clipboardData.files[0]);
      return;
    }
    var text = e.clipboardData.getData('text/plain');
    if (text.startsWith('data:image/jpeg') || text.startsWith('data:image/png') || text.startsWith('data:image/gif')) {
      e.preventDefault();
      var blob = await (await fetch(text)).blob();
      upload(new File([blob], blob.type.replace('/', '.'), { type: blob.type }));
    }
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
    logWindow.document.querySelector('textarea').value = Object.values(Bot.users).filter(u => !u.hidden && !u.ignored).map(u => u.fullName).join('\n');
  };
  var writeLog = function (s) {
    if (!logWindow || logWindow.closed)
      return;
    var textarea = logWindow.document.body.lastElementChild;
    textarea.value = s + '\n' + textarea.value;
  };
  var socketData = obj => '42' + JSON.stringify(obj);
  var fakeComment = async (id, cmt, event) => {
    if (Bot.users[id]) {
      Object.defineProperty(event, 'data', {
        enumerable: true,
        configurable: true,
        writable: true,
        value: socketData(['COM', {id, cmt}])
      });
      onSocketMessage(event);
    } else {
      showMessage('遅延により誰かのコメントをロストしました');
    }
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
    var cssText = `
      #extensionMessage{color:red;font-weight:bold;padding-left:1em}
      .body{row-gap:5px !important}
      ::backdrop{background-color:#000;opacity: 0.5}
      dialog button{margin:10px;line-height:1.5}
      dialog img,dialog video,dialog audio,dialog iframe{max-height:60vh;max-width:80vw}
      #miniPlayer{display: none;flex-direction:column;position:fixed;background-color:#000;width:500px;height:310px}
      #miniPlayer button{float:right}
      #miniPlayer iframe{display:block;border:0;width:100%;height:100%}
      #miniPlayer[data-position="右下"]{display:flex;right:0;bottom:0}
      #miniPlayer[data-position="右上"]{display:flex;right:0;top:0}
      #miniPlayer[data-position="左下"]{display:flex;left:0;bottom:0}
      #miniPlayer[data-position="左上"]{display:flex;left:0;top:0}
      #miniPlayer[data-position="下"]{display:flex;left:calc(max(0px, (100% - 1000px) / 2));bottom:0;width:min(1000px,100%);height:526px}
      #miniPlayer[data-position="上"]{display:flex;left:calc(max(0px, (100% - 1000px) / 2));top:0;width:min(1000px,100%);height:526px}
    `;
    if (!extensionConfig.whatifConsole)
      cssText += '#whatifConsoleButton{display:none}';
    if (extensionConfig.hideStatCommentButton)
      cssText += '#toggleStatCommentMobile{display:none}';
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
    cssText += extensionConfig.smartMode ? '#extensionMenu,#logWindowButton,.setting-bar-center{display:none}#smartInput{display:flex}' : '#characterController,#silence,[for=silence],#smartInput{display:none}';
    if (!canUpload())
      cssText += '#uploadButton{display:none}';
    cssText += extensionConfig.showImage
      ? '[data-img]{display:inline-block;background-repeat:no-repeat;background-size:contain;background-color:#fff;border:1px solid #000;box-sizing:content-box}.log-row:has([data-img]){flex:none;height:fit-content;max-height:200px}[data-img] *{display:none}'
      : '[data-img]{background-image:none!important}';
    var thumbWidth = {1: 120, 2: 320, 3: 480}[extensionConfig.youtubeThumbnail], thumbHeight = {1: 90, 2: 180, 3: 360}[extensionConfig.youtubeThumbnail];
    cssText += extensionConfig.youtubeThumbnail
      ? `[data-youtube]:before{content:'▶️'}[data-youtube]{display:inline-block;background-repeat:no-repeat;background-size:contain;background-color:#fff;border:1px solid #000;width:${thumbWidth}px;height:${thumbHeight}px;box-sizing:content-box}.log-row:has([data-youtube]){flex:none;height:fit-content}[data-youtube] *{display:none}`
      : '[data-youtube]{background-image:none!important}';
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
    onbeforeunload = extensionConfig.onbeforeunload ? () => forceReload ? null : 1 : null;
    Bot();
  };
  applyConfig();

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
    u.shiro = '◇' + u.ihash.slice(0, 6);
    u.kuro = u.trip ? '◆' + u.trip : '';
    u.fullName = (u.name || '') + u.shiro + u.kuro;
    Bot.users[u.id] = u;
    if (!match(u.fullName, extensionConfig.allowList) && match(u.fullName, extensionConfig.denyList))
      ignoreInfo[u.ihash] = true;
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
        break;
      case 'ENTER':
        addUser(data[1]);
        if (ignoreInfo[data[1].ihash])
          Bot.ignore(data[1].ihash, true);
        writeLog(data[1].fullName + `が入室(${data[1].type}) x=${data[1].x} y=${data[1].y} r=${data[1].r} g=${data[1].g} b=${data[1].b}`);
        if (data[1].id === Bot.myId) {
          setTimeout(() => writeLog('==========\nメンバー一覧\n' + Object.values(Bot.users).map(u=>u.fullName).join('\n') + '\n=========='), 0);
          if (extensionConfig.keepStat && lastStat !== '通常')
            Bot.stat(lastStat);
        }
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
        if (match(user.cmt, extensionConfig.ignoreWord)) {
          Bot.ignore(user.ihash, true, user.fullName);
          break;
        }
        if (match(user.cmt, extensionConfig.replaceWord)) {
          data[1].cmt = user.cmt = '（非表示）';
          return;
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
        if (Bot.users[data[1].id] && (data[1].id !== Bot.myId || !disableUpdate))
          Object.assign(Bot.users[data[1].id], data[1]);
        if (data[1].id === Bot.myId && data[1].hasOwnProperty('stat'))
          lastStat = data[1].stat;
        break;
      case 'IG':
        var u = Bot.users[data[1].id];
        if (!u)
          break;
        if (data[1].ihash?.startsWith('?param')) {
          console.log(data[1].ihash);
          try {
            var nameList = JSON.parse(data[1].ihash.slice(6));
            var myName = Bot.users[Bot.myId].name + Bot.users[Bot.myId].shiro;
            if (nameList.includes(myName))
              fakeComment(data[1].id, '暗号化ルーム：' + SUBCHAT_URL + nameList.map(name => 'name=' + encodeURIComponent(name)).join('&'), Object.assign({}, event));
          } catch (err) {
            console.log(err);
          }
          return;
        }
        if (Bot.myId === data[1].id) {
          Object.values(Bot.users).forEach(user => {
            if (user.ihash === data[1].ihash) {
              ignoreInfo[user.ihash] = user.ignored = data[1].stat === 'on';
            }
          });
        } else if (Bot.users[Bot.myId]?.ihash === data[1].ihash) {
          u.hidden = data[1].stat === 'on';
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
            if (/https:\/\/(?:canary\.)?discord\.com\/api\/webhooks/.test(args[1].cmt)) {
              asyncAlert('WebHook URLを発言してはならない');
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
  var XMLHttpRequest_open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (url.includes('monachatchat'))
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
          if (item.type === 'separator' || !obj.hasOwnProperty(item.key) || item.hidden)
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
      var fileMenu = append('span', {
        textContent: '設定ファイル'
      });
      var loadConfigButton = fileMenu.appendChild(document.createElement('button'));
      loadConfigButton.textContent = '開く';
      loadConfigButton.onclick = () => file.click();
      var saveConfigButton = fileMenu.appendChild(document.createElement('button'));
      saveConfigButton.textContent = '保存';
      saveConfigButton.onclick = () => {
        URL.revokeObjectURL(downloadLink.href);
        downloadLink.href = URL.createObjectURL(new Blob([JSON.stringify(currentValue, null, 2) + '\n'], {type: 'application/octet-stream'}));
        downloadLink.download = 'astral-omega-extension-config.json';
        downloadLink.click();
      };
      append('input', {
        type: 'button',
        value: '設定ページを閉じる',
        onclick: function () {
          close();
        }
      }).style.marginLeft = '5em';
      configInfo.forEach(item => {
        if (item.hidden)
          return;
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
  document.addEventListener('keyup', e => clearInterval(keyControlTimer));
  var sendParam = param => Bot.ignore('?param' + param, false);
  addEventListener('load', () => {
    var observer = new MutationObserver(() => {
      if (extensionConfig.showImage)
        Array.from(document.body.querySelectorAll('[href^="https://cdn.discordapp.com/attachments/1328162542463483994/"]:not([data-youtube],[data-img])')).forEach(a => {
          if (!/\.(?:png|jpe?g|gif|bmp|webp)\?/i.test(a.href))
            return;
          var img = new Image();
          img.onload = function () {
            var logContainer = document.getElementsByClassName('log-container')[0];
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
          var logContainer = document.getElementsByClassName('log-container')[0];
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
    document.querySelector('meta[name=viewport]:not(#extensionViewport)')?.remove();
    document.head.append(metaViewport);
    setTimeout(() => dispatchEvent(new Event('resize')), 0);
    setTimeout(() => dispatchEvent(new Event('resize')), 500);
    var div = document.createElement('div');
    div.id = 'extensionBar';
    menu.id = 'extensionMenu';
    div.append(menu);
    div.append(createElement('button', {
      id: 'logWindowButton',
      textContent: 'ログ',
      onclick: openLog
    }));
    div.append(createElement('button', {
      textContent: '設定',
      onclick: openConfig
    }));
    div.append(createElement('button', {
      id: 'whatifConsoleButton',
      textContent: 'Ｗ',
      onclick: () => {
        var gameWindow = document.getElementById('gameWindow');
        if (!gameWindow) {
          alert('なんか変');
          return;
        }
        document.getElementById('extensionBar').after(gameWindow);
        gameWindow.style.display = gameWindow.style.display ? '' : 'block';
      }
    }));
    div.append(createElement('button', {
      textContent: '暗号化',
      onclick: async () => {
        var memberIds = await asyncCheckbox(
          '暗号化ルームのメンバーを選んでください（現在テスト中、不具合あるかも）<br><a href="https://iwamizawa-software.github.io/astral-omega-extension/docs/encryption.html" target="_blank">新暗号化について</a>',
          Object.values(Bot.users).filter(u => u.id !== Bot.myId).map(({id, fullName}) => ({id, text: fullName}))
        );
        if (!memberIds)
          return;
        memberIds = Array.from(memberIds).filter(id => Bot.users[id]);
        if (!memberIds.length) {
          showMessage('1人以上選んでください');
          return;
        }
        memberIds.push(Bot.myId);
        sendParam(JSON.stringify(memberIds.map(id => Bot.users[id].name + Bot.users[id].shiro)));
      }
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
      textContent: '接続維持'
    }));
    div.append(createElement('span', {id:'extensionMessage'}));
    document.body.firstElementChild.before(div);
    document.getElementById('extensionMessage').innerHTML = '';
    checkWebhook();
    querySelectorAsync('.panel-container').then(element => {
      var inputContainer = createElement('div', {id: 'smartInput'});
      inputContainer.setAttribute('style', 'width:min(1000px,100%)');
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
      var statCommentButton = createElement('button', {
        id: 'toggleStatCommentMobile',
        textContent: '🔈',
        onclick: toggleStatComment
      });
      statCommentButton.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(statCommentButton);
      var button = createElement('button', {
        textContent: '🎮',
        onclick: e => {
          controller.style.display = controller.style.display ? '' : 'none';
        }
      });
      button.setAttribute('style', 'font-size:' + smartSize);
      inputContainer.append(button);
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
        var a = [e.target, e.target.parentNode].find(a => a.tagName === 'A');
        if (!a)
          return;
        if (a.href.startsWith(SUBCHAT_URL)) {
          e.preventDefault();
          open(a.href);
          return;
        }
        if (!extensionConfig.miniPlayer)
          return;
        miniPlayerIFrame.dataset.owner = '';
        var yt = getYouTubeInfo(a.href);
        if (yt) {
          miniPlayerIFrame.src = 'https://www.youtube.com/embed/' + yt[1] + '?enablejsapi=1' + (yt[2] ? '&start=' + yt[2] : '');
          miniPlayerIFrame.dataset.owner = a.parentNode.firstElementChild.textContent;
        } else if (!/iPhone|iPad/.test(navigator.userAgent) && /^https:\/\/twitcasting\.tv\/([^\/]+)/.test(a.href))
          miniPlayerIFrame.src = 'https://twitcasting.tv/' + RegExp.$1 + '/embeddedplayer/live';
        else if (/^https:\/\/(?:www\.|m\.)?twitch\.tv\/([^\/\?]+)/.test(a.href))
          miniPlayerIFrame.src = 'https://player.twitch.tv/?channel=' + RegExp.$1 + '&parent=monachat.tech';
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
      if (event.origin === 'https://sub-chat.onrender.com') {
        if (extensionConfig.uploadUrl && extensionConfig.uploadPassword)
          event.source.postMessage({
            type: 'sub-chat:credential-response',
            uploadUrl: extensionConfig.uploadUrl,
            uploadPassword: extensionConfig.uploadPassword
          }, event.origin);
        return;
      }
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
