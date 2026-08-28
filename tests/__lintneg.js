const o = { a: 1, a: 2 };
const c = 1; c = 2;
switch (o.a) { case 1: break; case 1: break; }
if (o.a === NaN) { debugger }
function broken( {
