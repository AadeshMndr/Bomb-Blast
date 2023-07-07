function collision(a, b){
    if (a.x + a.width < b.x)
    return false;
    else if (b.x + b.width < a.x)
    return false;
    else if (a.y + a.height < b.y)
    return false;
    else if (b.y + b.height < a.y)
    return false;
    else
    return true;
}

function checkCollision(a, b){
    //the thing that loops through each point of it's path of travel
    a.vel = Math.sqrt(Math.pow(a.xvel, 2) + Math.pow(a.yvel, 2));
    for (let p = 1; p <= Math.abs(a.vel); p++)
    {
        //for both dummys
        let dummyB = {
            x: a.x + (a.xvel / a.vel) * p,
            y: a.y + (a.yvel / a.vel) * p,
            xvel: a.xvel,
            yvel: a.yvel,
            width: a.width,
            height: a.height
        };
        if (collision(dummyB, b))
        {
            a.both = true;

            //horizontal test
            let dummyH = {
                x: a.x + (a.xvel / a.vel) * p,
                y: a.y,
                xvel: a.xvel,
                yvel: a.yvel,
                width: a.width,
                height: a.height
            };

            if (collision(dummyH, b))
            {
                let count = 0;
                a.hori = true;
                dummyH.x = a.x;
                while (!collision(dummyH, b))
                {
                    count++;
                    dummyH.x += Math.sign(a.xvel) * 0.01;
                    if (count >= 10000)
                    break;
                }
                dummyH.x -= Math.sign(a.xvel) * 0.01;
            }

            //vertical test
            let dummyV = {
                x: a.x,
                y: a.y + (a.yvel / a.vel) * p,
                xvel: a.xvel,
                yvel: a.yvel,
                width: a.width,
                height: a.height
            };

            if (collision(dummyV, b))
            {
                let count = 0;
                a.vert = true;
                dummyV.y = a.y;
                while (!collision(dummyV, b))
                {
                    count++;
                    dummyV.y += Math.sign(a.yvel) * 0.01;
                    if (count >= 10000)
                    break;
                }
                dummyV.y -= Math.sign(a.yvel) * 0.01;
            }

            if (!a.hori && !a.vert)
            {
                let count = 0;
                dummyB.x = a.x;
                dummyB.y = a.y;
                while (!collision(dummyB, b))
                {
                    count++;
                    dummyB.x += Math.sign(a.xvel) * 0.01;
                    dummyB.y += Math.sign(a.yvel) * 0.01;
                    if (count >= 10000)
                    break;
                }
                dummyB.x -= Math.sign(a.xvel) * 0.01;
                dummyB.y -= Math.sign(a.yvel) * 0.01;

                a.x = dummyB.x;
                a.y = dummyB.y;
            }

            if (a.hori)
            a.x = dummyH.x;
            if (a.vert)
            a.y = dummyV.y;
        }
    }     
}