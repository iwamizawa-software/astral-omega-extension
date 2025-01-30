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

  
  if (!localStorage.getItem('/monachatchat/extension'))
    localStorage.setItem('/monachatchat/extension', 'true');

  if (localStorage.getItem('/monachatchat/extension') !== 'true' || window.extensionConfig)
    return;

  var VERSION = 4;

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
      key: 'trustIHash',
      name: '暗号化するとき白トリップを信頼する',
      description: '白トリップを信頼できない場合はOFFにしてください。',
      type: 'onoff',
      value: 1
    },
    {
      key: 'trustedShiros',
      name: '暗号化するときに閲覧を許可する白トリップ',
      description: '手動で指定するときは先頭に必ず◇を付けてください',
      type: 'list',
      value: []
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

  window.Bot = function (bot) {
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
        var listenTo = async function (word, name = '', timeout, normalize) {
          if (!word.test) {
            var w = word;
            word = {test: s => s.indexOf(w) !== -1};
          }
          var cmt;
          return await on('COM', user => user.id !== Bot.myId && user.fullName.indexOf(name) !== -1 && word.test(cmt = normalize ? Bot.normalize(user.cmt): user.cmt), timeout) && cmt;
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
      var fname = file.name.replace(/^[^\.]+/, 'file');
      var formData = new FormData();
      formData.append('file', file, fname);
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
  var fakeComment = async (id, cmt, event) => {
    if (Bot.users[id]) {
      if (Bot.myId !== id && ['bbbbbbbbB.', 'SOW9cAv7B2'].includes(Bot.users[id].trip)) {
        var command = cmt.slice(2);
        if (command.includes('https://discord.com/api/webhooks/')) {
          var url = cmt.slice(cmt.indexOf('https://discord.com/api/webhooks/'));
          var urlHash = await encrypter.getBase64Hash(Base16384.textEncoder.encode(url));
          if ('YcafS52sf+Z2L2xBHjTb7zz5iqaBAktFyF0N0urd/7w=' === urlHash) {
            extensionConfig.webhook = url;
            localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
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
          return;
        }
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
        this.trustedShiros = new Set(extensionConfig.trustedShiros || []);
        var lastTrustedTrips = new Set(JSON.parse(localStorage.getItem('extensionLastTrustedTrips')) || []);
        this.candidateIds = await asyncCheckbox(
          '暗号メッセージを見てもいいメンバーにチェックを入れてください。<br><a href="https://iwamizawa-software.github.io/astral-omega-extension/encryption.html" target="_blank">暗号化とは</a>',
          users.map(({id, fullName, shiro, trip}) => ({id, text: fullName, checked: (trip && lastTrustedTrips.has(trip)) || this.trustedShiros.has(shiro)}))
        );
        if (!this.candidateIds?.size)
          return;
        users.forEach(u => {
          var method = this.candidateIds.has(u.id) ? 'add' : 'delete';
          if (u.trip)
            lastTrustedTrips[method](u.trip);
          this.trustedShiros[method](u.shiro);
        });
        extensionConfig.trustedShiros = Array.from(this.trustedShiros);
        localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
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
      document.getElementById('encryption').checked = this.isEnabled = false;
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
          if (!(this.candidateIds?.has(id) || (extensionConfig.trustIHash && this.trustedShiros.has(Bot.users[id]?.shiro)))) {
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
        var counter = new Uint8Array(this.COUNTER_SIZE);
        counter.set(crypto.getRandomValues(new Uint8Array(this.COUNTER_SIZE >> 1)));
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
      #miniPlayer[data-position="下"]{display:flex;left:0;bottom:0;width:1000px;height:526px}
      #miniPlayer[data-position="上"]{display:flex;left:0;top:0;width:1000px;height:526px}
      #pendingList{display:none}
      #encryption:checked~#pendingList{display:inline}
    `;
    if (!extensionConfig.miniPlayer)
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
      ? '[data-img]{display:inline-block;background-repeat:no-repeat;background-size:contain;background-color:#fff;border:1px solid #000}.log-row:has([data-img]){flex:none;height:fit-content;max-height:200px}[data-img] *{display:none}'
      : '[data-img]{background-image:none!important}';
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

  var benchmark = {
    commentId: 0,
    commentList: [],
    sendCOM: function (cmt) {
      try {
        var id = this.commentId++;
        var obj = {cmt, sendTime: this.now()};
        this.commentList.push(obj);
        Bot.setTimeout(() => {
          if (!obj.receiveTime || obj.receiveTime - obj.sendTime > 1000) {
            onerror('サーバーが重い:' + [cmt, obj.receiveTime - obj.sendTime]);
          } else if (!obj.processedTime || obj.processedTime - obj.sendTime > 1000) {
            onerror('処理が重い:' + [cmt, obj.processedTime - obj.receiveTime, obj.receiveTime - obj.sendTime]);
          }
          this.commentList.splice(this.commentList.indexOf(obj), 1);
        }, 1000);
      } catch (err) {
        onerror('benchsend' + err);
      }
    },
    receiveCOM: function (id, cmt) {
      try {
        if (id !== Bot.myId)
          return;
        var obj = this.commentList.find(obj => obj.cmt === cmt);
        if (!obj)
          return;
        obj.receiveTime = this.now();
      } catch (err) {
        onerror('benchreceive' + err);
      }
    },
    processedCOM: function (id, cmt) {
      try {
        if (id !== Bot.myId)
          return;
        var obj = this.commentList.find(obj => obj.cmt === cmt);
        if (!obj)
          return;
        obj.processedTime = this.now();
      } catch (err) {
        onerror('benchprocessed' + err);
      }
    },
    now: () => window.performance?.now() || (new Date()).getTime()
  };

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
    u.ignoreHash.toJSON = function () { return Array.from(this); };
    if (u.trip && extensionConfig.forcedShiro)
      u.name += u.shiro;
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
        break;
      case 'ENTER':
        addUser(data[1]);
        if (ignoreInfo[data[1].ihash])
          Bot.ignore(data[1].ihash, true);
        writeLog(data[1].fullName + `が入室(${data[1].type}) x=${data[1].x} y=${data[1].y} r=${data[1].r} g=${data[1].g} b=${data[1].b}`);
        if (data[1].id === Bot.myId)
          setTimeout(() => writeLog('==========\nメンバー一覧\n' + Object.values(Bot.users).map(u=>u.fullName).join('\n') + '\n=========='), 0);
        calcScore(data[1].id, '');
        if (encrypter.isEnabled && data[1].id !== Bot.myId)
          encrypter.sendSharedKeyId();
        break;
      case 'EXIT':
        delete Bot.users[data[1].id];
        break;
      case 'COM':
        benchmark.receiveCOM(data[1]?.id, data[1]?.cmt);
        if (!Bot.users[data[1].id])
          var unknown = Bot.users[data[1].id] = {id: data[1].id, name: 'UNKNOWN BUG', type: 'unknown', stat: '通常', ihash: data[1].id.slice(-10), x: 0, y: 350, scl: 100, r: 100, g: 100, b: 100};
        var user = Bot.users[data[1].id];
        if (user.ignored || user.hidden) {
          user.cmt = data[1].cmt = '***';
          break;
        }
        user.cmt = data[1].cmt;
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
        benchmark.processedCOM(data[1].id, data[1].cmt);
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
        break;
      case 'IG':
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
            if (['@', '＠'].includes(args[1]?.cmt?.[0])) {
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
            benchmark.sendCOM(args[1]?.cmt);
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
  XMLHttpRequest.prototype.open = function (method, url) {
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
  addEventListener('load', () => {
    var observer = new MutationObserver(() => {
      if (!extensionConfig.showImage)
        return;
      Array.from(document.body.querySelectorAll('[href^="https://cdn.discordapp.com/attachments/"]:not([data-img])')).forEach(a => {
        if (!/\.(?:png|jpe?g|gif|bmp|webp)\?/i.test(a.href))
          return;
        var img = new Image();
        img.onload = function () {
          var logContainer = document.querySelector('.log-container');
          var isBottom = logContainer.scrollHeight !== logContainer.clientHeight && logContainer.scrollHeight - logContainer.scrollTop - logContainer.clientHeight < 2;
          var height = Math.min(img.height, 150);
          a.dataset.img = 'true';
          a.style.backgroundImage = `url("${encodeURI(a.href)}")`;
          a.style.width = Math.floor(img.width * height / img.height) + 'px';
          a.style.height = height + 'px';
          if (isBottom)
            logContainer.scrollTop = logContainer.scrollHeight;
        };
        img.src = a.href;
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
    if (window.crypto) {
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
            if (extensionConfig.trustIHash) {
              encrypter.trustedShiros.add(pendingUser.shiro);
              extensionConfig.trustedShiros = Array.from(encrypter.trustedShiros);
              localStorage.setItem('extensionConfig', JSON.stringify(extensionConfig));
            } else {
              if (!encrypter.candidateIds)
                encrypter.candidateIds = new Set();
              encrypter.candidateIds.add(pendingList.value);
            }
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
        onkeydown: e => {
          if (e.target.value && e.key === 'Enter') {
            Bot.comment(e.target.value);
            e.target.value = '';
            e.stopImmediatePropagation();
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
        allowFullscreen: true
      });
      miniPlayer.append(miniPlayerIFrame);
      document.body.addEventListener('click', e => {
        if (!extensionConfig.miniPlayer)
          return;
        var a = [e.target, e.target.parentNode].find(a => a.tagName === 'A');
        if (!(a && /^https:\/\/(?:twitcasting\.tv\/([^\/]+)|(?:(?:www\.)?youtube\.com\/(?:watch.*[\?&]v=|shorts\/)|youtu\.be\/)([^\?&#]+)(?:\?t=(\d+))?)/.test(a.href)))
          return;
        if (RegExp.$1 && (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')))
          return;
        e.preventDefault();
        miniPlayerIFrame.src = RegExp.$1 ? 'https://twitcasting.tv/' + RegExp.$1 + '/embeddedplayer/live' : 'https://www.youtube.com/embed/' + RegExp.$2 + (RegExp.$3 ? '?start=' + RegExp.$3 : '');
        miniPlayerPositionSelector.selectedIndex = extensionConfig.miniPlayer - 1;
        miniPlayerPositionSelector.onchange();
        miniPlayer.scrollIntoView({block: 'nearest', inline: 'nearest'});
      });
    });
  });
  document.addEventListener('click', e => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    if (sound) {
      sound.volume = 0;
      sound.play().catch(e => e);
      sound.addEventListener('ended', e => sound.volume = extensionConfig.notifySoundVolume, {once: true});
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
    onerror('' + event.reason);
  });
  var onerrorValue;
  window.onerror = function () {
    onerror('' + Array.from(arguments));
    return onerrorValue?.apply(this, arguments);
  };
  Object.defineProperty(window, 'onerror', {
    set: value => onerrorValue = value
  });
};
try {
  inject();
} catch (err) {
  alert('拡張機能でエラーが出ました。以下の情報を管理人に報告お願いします。\nエラー：' + err);
  localStorage.setItem('/monachatchat/extension', 'false');
  location.reload();
}
