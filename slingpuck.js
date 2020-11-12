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
    line(walls.left, walls.bottom, walls.right, walls.bottom);
    line(walls.right, walls.bottom, walls.right, walls.top);
    line(walls.right, walls.top, walls.left, walls.top);
    line(walls.left, walls.top, walls.left, walls.bottom);
    line(walls.left, walls.gateTop, walls.openingLeft, walls.gateTop);
    line(walls.openingRight, walls.gateTop, walls.right, walls.gateTop);

    // Puck
    const puckOptions = {
        density: 0.1,
        friction: 0.9
    };
    const puckSize = 3.0;
    const tableFriction = 0.03;
    const puck = world.createBody({
        type: 'dynamic',
        angularDamping: 5,
        // bullet: true,
        position: Vec2(1.0, 0.4),
        linearDamping: tableFriction
    });
    puck.createFixture(pl.Circle(puckSize), puckOptions);

    // Elastics
    const elasticPartWidth = 1.0;
    const elasticPartThickness = 0.125;
    const elasticPartCount = (walls.right - walls.left) / elasticPartWidth / 2;
    const elasticLeft = -20, elasticTop = 5.0;
    const strength = 10.0;
    const anchorOffset = 1;
    const whatisthis = 0;
    let prevBody = table;
    // const elastick

    // korte stokjes
    for (let i = 0; i < elasticPartCount; ++i) {
        const body = world.createDynamicBody(Vec2(elasticLeft + elasticPartWidth / 2 + elasticPartWidth * i, elasticTop));
        body.createFixture(pl.Box(0.5, 0.125), 20.0);

        const anchor = Vec2(elasticLeft + elasticPartWidth * i, elasticTop);
        world.createJoint(pl.WeldJoint({}, prevBody, body, anchor));

        prevBody = body;
    }

    // for (let i = 0; i < elasticPartCount; ++i) {
    //     const elasticPart = world.createBody({
    //         type: 'dynamic',
    //         density: 1,
    //         position: Vec2(left + elasticPartWidth * (2 * i + anchorOffset), elasticBottom),
    //     });
    //     elasticPart.createFixture(pl.Box(elasticPartWidth, elasticPartThickness), strength);

    //     const anchor = Vec2(elasticPartWidth * (2 * i + anchorOffset), whatisthis);
    //     world.createJoint(pl.WeldJoint({
    //         frequencyHz: 15.0,
    //         dampingRatio: 0.9,
    //     }, prevBody, elasticPart, anchor));

    //     prevBody = elasticPart;
    // }
    // const anchor = Vec2(elasticPartWidth * (elasticPartCount - anchorOffset), whatisthis);
    // world.createJoint(pl.WeldJoint({}, prevBody, table, anchor));

    testbed.step = function () {
    };

    return world;
});
