/*
 * Copyright (c) 2016-2017 Ali Shakiba http://shakiba.me/planck.js
 * Copyright (c) 2006-2011 Erin Catto  http://www.box2d.org
 */

planck.testbed('SlingPuck', function (testbed) {

    testbed.speed = 100;
    // testbed.hz = 3;

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
        top: 50.0,
        right: 30.0,
        bottom: -30.0,
        left: -30.0,
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
    const puckDef = {
        density: 0.05,
        friction: 0.3,
        // restitution: 1,
        puckSize: 3.125
    };
    const puckBodyOptions = {
        type: 'dynamic',
        angularDamping: 5,
        // bullet: true,
        position: Vec2(1.0, 0.4),
        linearDamping: 0.03
    };
    const puck = world.createBody(puckBodyOptions);
    drawPuck = _ => {
        puck.createFixture(pl.Circle(puckDef.puckSize), puckDef);
    };
    drawPuck();

    // Elastic
    const elasticPart = {
        halfWidth: 0.5,
        height: 0.25,
        density: 20,
        getLeft: i => {
            return elastic.left + (elasticPart.halfWidth) * (i + 0.5);
            // return elastic.left + (elasticPart.width - elasticPart.height) * (i + 0.5);
        },
        getAnchorLeft: i => {
            return elastic.left + elasticPart.halfWidth * (i + 1.0);
        },
        revoluteJointDef: {
            // speed: 0,
            // torque: 100
            // joint speed to zero, and set the maximum torque to some small, but significant value.
        },
        weldJointDef: {
            frequency: 0,
            damping: 0
        },
        prismaticJointDef: {
            // collideConnected: false,
            lowerTranslation: -0.05,
            upperTranslation: 0.1,
            enableLimit: true,
            maxMotorTorque: 100.0,
            motorSpeed: 0.0,
            enableMotor: true
        },
        fixtureDef: {
            density: 20.0,
            friction: 1.0,
            restitution: 0
        }
    };
    const elastic = {
        partCount: (walls.right - walls.left) / elasticPart.halfWidth / 2.0,
        left: walls.left,
        top: -14.7,
    };
    drawElastic = _ => {
        let prevBody = table;
        const jointTypeRatio = 2;
        for (let i = 0; i < elastic.partCount; ++i) {
            const body = world.createDynamicBody(Vec2(elastic.left + elasticPart.halfWidth + 1.0 * i, elastic.top));
            body.createFixture(pl.Box(elasticPart.halfWidth, elasticPart.height), elasticPart.fixtureDef);
            const anchor = Vec2(elastic.left + 1.0 * i, elastic.top);
            if (i % jointTypeRatio == 0) {
                world.createJoint(pl.PrismaticJoint(elasticPart.prismaticJointDef, prevBody, body, anchor));
            } else {
                world.createJoint(pl.WeldJoint(elasticPart.weldJointDef, prevBody, body, anchor));
            }

            prevBody = body;
        }
        const anchor = Vec2(elastic.left + 1.0 * elastic.partCount, elastic.top);
        world.createJoint(pl.WeldJoint({}, prevBody, table, anchor));
    };
    drawElastic();

    testbed.step = function () { };

    return world;
});
