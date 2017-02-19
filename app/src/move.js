export default function move(game, data, tile) {

    if (data.animating) return;

    if (data.from) {

        data.to = tile;

    } else {

        data.from = tile;
        return;

    }

    if (data.animating || data.to.enemy) {

        data.from = null;
        data.to = null;

        return;

    }

    let fx = data.from.x / 32;
    let fy = data.from.y / 32;
    let tx = data.to.x / 32;
    let ty = data.to.y / 32;

    if (!data.from || !data.to) {

        data.from = null;
        data.to = null;

        return;

    }

    console.log('tween!', data.from, data.to);

    let enemy = null;

    if (!data.Map[fy][fx].enemy) {

        console.log('from tile has no enemy!', data.Map[fy][fx]);

        data.from = null;
        data.to = null;
        data.animating = false;

        return;

    }

    if (data.Map[ty][tx].enemy) {

        console.log('to tile has enemy!', data.Map[ty][tx]);

        data.from = null;
        data.to = null;
        data.animating = false;

        return;

    }

    console.log('from tile has enemy!', data.Map[fy][fx]);

    enemy = data.Map[fy][fx].enemy;

    let tween = game.add.tween(enemy).to({
        x: data.to.x,
        y: data.to.y
    }, 300, Phaser.Easing.Linear.In, true);

    data.animating = true;

    tween.onComplete.add(function() {

        data.Map[fy][fx].enemy = null;
        data.Map[ty][tx].enemy = enemy;

        console.log('tween finished!', 'from: ',
        data.Map[fy][fx].enemy, 'to, ', data.Map[ty][tx].enemy);

        data.from = null;
        data.to = null;
        data.animating = false;

    });

}
