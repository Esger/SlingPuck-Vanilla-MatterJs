/*
 * Copyright (c) 2016-2017 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org
 */

planck.testbed('Car', function (testbed) {

    testbed.speed = 5;
    testbed.hz = 60;

    const pl = planck, Vec2 = pl.Vec2;
    const world = new pl.World({
        gravity: Vec2(0, 0)
    });

    const table = world.createBody();

    const walls = {
        density: 0.0,
        restitution: 0.6,
        friction: 0.6,
        top: 50,
        right: 30,
        bottom: -30,
        left: -30,
        gateTop: 10.0,
        openingLeft: -5.0,
        openingRight: 5.0
    };

    const line = (x1, y1, x2, y2, body = walls) => {
        table.createFixture(pl.Edge(
            Vec2(x1, y1),
            Vec2(x2, y2)),
            body
        );
    };

    // Walls
    const drawWals = _ => {
        line(walls.left, walls.bottom, walls.right, walls.bottom);
        line(walls.right, walls.bottom, walls.right, walls.top);
        line(walls.right, walls.top, walls.left, walls.top);
        line(walls.left, walls.top, walls.left, walls.bottom);
        line(walls.left, walls.gateTop, walls.openingLeft, walls.gateTop);
        line(walls.openingRight, walls.gateTop, walls.right, walls.gateTop);
    };
    drawWals();

    // Puck
    const puckOptions = {
        density: 0.1,
        friction: 0.9,
        puckSize: 3.0
    };
    const tableFriction = 0.03;
    const puck = world.createBody({
        type: 'dynamic',
        angularDamping: 5,
        bullet: true,
        position: Vec2(1.0, 0.4),
        linearDamping: tableFriction
    });
    drawPuck = _ => {
        puck.createFixture(pl.Circle(puckOptions.puckSize), puckOptions);
    };
    drawPuck();

    // Elastic
    const elasticPart = {
        width: 0.175,
        thickness: 0.0625,
        getLeft: i => {
            return elastic.left + elasticPart.width * (i + 1);
        }
    };
    const elastic = {
        partCount: (walls.right - walls.left) / elasticPart.width - 1,
        left: walls.left,
        top: -10.0,
    };
    drawElastic = _ => {
        let prevBody = table;
        for (let i = 0; i < elastic.partCount; ++i) {
            const body = world.createDynamicBody(Vec2(elasticPart.getLeft(i), elastic.top));
            body.createFixture(pl.Box(elasticPart.width / 2, elasticPart.thickness), elastic.top);

            const anchor = Vec2(elastic.left + elasticPart.width * i, elastic.top);
            world.createJoint(pl.WeldJoint({}, prevBody, body, anchor));

            prevBody = body;
        }
        const anchor = Vec2(elastic.left + elasticPart.width * elastic.partCount, elastic.top);
        world.createJoint(pl.WeldJoint({}, prevBody, table, anchor));
    };
    drawElastic();

    testbed.step = function () { };

    return world;
});
