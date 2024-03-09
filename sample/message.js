  var cancelList = {};

  on('COM', async user => {

    if (user.id === Bot.myId || !/^([\s\S]+)[にへ]伝言$/.test(user.cmt))
      return;

    Bot.comment('30秒以内に用件をどうぞ');
    var target = RegExp.$1;
    var message = await listenTo('', user.shiro, 30000);
    if (!message) {
      Bot.comment('キャンセルしました');
      return;
    }
    var {cancel} = on('*', (type, data) => {
      if ('AWAKE,ENTER,COM,SET'.split(',').includes(type) && (Bot.users[data?.id]?.fullName || '').indexOf(target) !== -1) {
        Bot.comment(user.fullName + 'から' + Bot.users[data.id].fullName + 'に伝言あり');
        Bot.comment(`「${message}」だってさ`);
        delete cancelList[user.ihash];
        return true;
      }
    });
    Bot.comment('承りました' + (cancelList[user.ihash] ? ' なお以前設定された伝言は削除されました' : ''));
    cancelList[user.ihash]?.();
    cancelList[user.ihash] = cancel;
  });
