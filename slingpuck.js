/*
 * Copyright (c) 2016-2017 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org
 */

planck.testbed('SlingPuck', function (testbed) {

    testbed.speed = 10;
    testbed.hz = 33;

    const pl = planck, Vec2 = pl.Vec2;
    const world = new pl.World({
        gravity: Vec2(0, 0)
    });

    const table = world.createBody();
    const goldenRatio = 1.618;

    const wallDef = {
        density: 0.0,
        restitution: 0.6,
        friction: 0.6,
    };

    const walls = {
        top: 50,
        right: 30,
        bottom: -30,
        left: -30,
        gateTop: 10.0,
        openingLeft: -5.0,
        openingRight: 5.0,
    };

    const wallPositions = [
        [walls.left, walls.bottom, walls.right, walls.bottom],
        [walls.right, walls.bottom, walls.right, walls.top],
        [walls.right, walls.top, walls.left, walls.top],
        [walls.left, walls.top, walls.left, walls.bottom],
        [walls.left, walls.gateTop, walls.openingLeft, walls.gateTop],
        [walls.openingRight, walls.gateTop, walls.right, walls.gateTop]
    ];

    const line = (x1, y1, x2, y2, body = wallDef) => {
        table.createFixture(pl.Edge(
            Vec2(x1, y1),
            Vec2(x2, y2)),
            body
        );
    };

    wallPositions.forEach(wall => {
        line(...wall);
    });

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
        // bullet: true,
        position: Vec2(1.0, 0.4),
        linearDamping: tableFriction
    });
    drawPuck = _ => {
        puck.createFixture(pl.Circle(puckOptions.puckSize), puckOptions);
    };
    drawPuck();

    // Elastic
    const elasticPart = {
        width: 1,
        thickness: 0.125,
        getLeft: i => {
            return elastic.left + elasticPart.width * (i + 1);
        }
    };
    const elastic = {
        partCount: (walls.right - walls.left) / elasticPart.width - 1,
        left: walls.left,
        top: -14.7,
    };
    drawElastic = _ => {
        let prevBody = table;
        for (let i = 0; i < elastic.partCount; ++i) {
            const body = world.createDynamicBody(Vec2(elasticPart.getLeft(i), elastic.top));
            body.createFixture(pl.Box(elasticPart.width / 2, elasticPart.thickness), elastic.top);

            const anchor = Vec2(elastic.left + elasticPart.width * (i + 0.5), elastic.top);
            world.createJoint(pl.DistanceJoint({
                // frequencyHz: 10.0,
                // dampingRatio: 0.9,
            }, prevBody, body, anchor));
            console.log(body.getMass());
            prevBody = body;
        }
        const anchor = Vec2(elastic.left + elasticPart.width * elastic.partCount, elastic.top);
        world.createJoint(pl.WeldJoint({}, prevBody, table, anchor));
    };
    drawElastic();

    testbed.step = function () { };

    return world;
});
