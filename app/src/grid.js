import PF from 'pathfinding';

export function getMatrix(data) {

    let grid = [];

    for (let y = 0; y < data.Map.length; y++) {

        let row = [];

        for (let x = 0; x < data.Map[y].length; x++) {

            let tile = data.Map[y][x];

            if (tile.enemy) {

                row.push(1);

            } else {

                row.push(0);

            }

        }

        grid.push(row);

    }

    return grid;

}

export function getGrid(matrix) {

    return new PF.Grid(matrix);

}

export function getPath(grid, from, to) {

    let ax = from.x / 32;
    let ay = from.y / 32;
    let bx = to.x / 32;
    let by = to.y / 32;

    let finder = new PF.AStarFinder();
    let path = finder.findPath(ax, ay, bx, by, grid);

    return path;

}

export function findPath(data, from, to) {

    let matrix = getMatrix(data);
    let grid = getGrid(matrix);
    let path = getPath(grid, from, to);

    return path;

}
