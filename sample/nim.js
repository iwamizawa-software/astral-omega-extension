  var lock = {};

  on('COM', async player => {

    if (player.id === Bot.myId || lock[player.ihash] || player.cmt !== 'いしとり')
      return;

    var end = function (cause, result) {
      Bot.comment(cause + 'で私の' + (result ? '負け' : '勝ち') + 'です 同一プレイヤーは起動が5分制限されます');
      lock[player.ihash] = 1;
      setTimeout(() => delete lock[player.ihash], 300000);
    };

    Bot.comment('交互に石を取り最後に取った人が勝ち 1.先攻 2.後攻　10秒以内に数字を発言');
    var select = await listenTo(/^[12]$/, player.shiro, 10000, true);
    if (!select) {
      end('時間切れ');
      return;
    }

    var stone = 12 + (Math.random() * 8 | 0);
    if (select === '2')
      var take = stone % 4 || 3;

    while (1) {

      if (take) {
        Bot.comment('私は' + stone + '個の石から' + take + '個取りました');
        stone -= take;
      }
      Bot.comment('残りの石は' + stone + '個です あなたが取る数を1～3で10秒以内に発言 4で降参');
      take = await listenTo(/^[1-4]$/, player.shiro, 10000, true);
      if (!take) {
        end('時間切れ');
        return;
      }
      if (take === '4') {
        end('リタイヤ');
        return;
      }
      stone -= take;
      if (stone <= 0) {
        end('あなたが最後に石を取ったの', true);
        return;
      }
      if (stone < 4) {
        end('私は最後に石を' + stone + '個取ったの');
        return;
      }
      take = stone === 4  ? 1 : (stone % 4 || 3);
    }
  });
