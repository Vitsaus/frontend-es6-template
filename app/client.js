import './styles/main.scss';

import Chance from 'chance';

import imgTile from './images/tile.png';
import imgEnemy from './images/enemy.png';

import Tile from './src/tile.js';
import id from './src/id.js';
import move from './src/move.js';
import * as grid from './src/grid.js';

window.grid = grid;

let tile = new Tile();

const WIDTH = 32 * 10;
const HEIGHT = 32 * 10;

const enemies = 5;

let data = window.data = {
    from: null,
    to: null,
    Map: [],
    animating: false,
    chance: new Chance()
};

let game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', {
    preload: function() {

        game.load.image('tile', imgTile);
        game.load.image('enemy', imgEnemy);

    },
    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        data.tiles = game.add.group();
        data.enemies = game.add.group();

        for (let y = 0; y < 10; y++) {

            let row = [];

            for (let x = 0; x < 10; x++) {

                let yp = 32 * y;
                let xp = 32 * x;

                let tile = game.add.sprite(yp, xp, 'tile');

                tile.inputEnabled = true;

                tile.id = id();

                tile.events.onInputDown.add(() => {

                    move(game, data, tile);

                });

                tile.map = {
                    x,
                    y
                };

                data.tiles.add(tile);

                let map = {
                    id: id(),
                    tile: tile,
                    enemy: null,
                    position: {
                        x,
                        y
                    }
                };

                tile.map = map;

                row.push(map);

            }

            data.Map.push(row);

        }

        for (let i = 0; i < enemies; i++) {

            let x = data.chance.integer({ min: 0, max: 9 }) * 32;
            let y = data.chance.integer({ min: 0, max: 9 }) * 32;

            let mx = x / 32;
            let my = y / 32;

            let enemy = game.add.sprite(x, y, 'enemy');

            enemy.id = id();

            data.enemies.add(enemy);

            data.Map[my][mx].enemy = enemy;

        }

        let path = grid.findPath(data, data.Map[1][0].tile, data.Map[3][0].tile);

        console.log(path);

    },
    update: function() {

        data.tiles.forEach((tile) => {

            tile.update(game);

        });

    }
});
