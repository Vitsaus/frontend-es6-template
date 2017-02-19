import id from './id.js';

export default class Tile {

    create(game) {

        let sprite = game.add.sprite(0, 0, 'tile');

        sprite.inputEnabled = true;

        sprite.events.onInputDown.add(() => {

            console.log('clicked tile!');

        });

        sprite.id = id();

        return sprite;

    }

}
