const moveRowDelayCfg = 10;

function startLevel(){
  dim.map = [];
  Planet.pool = [];
  Missle.pool = [];
  Row.pool = [];
  window.moveRowDelay = moveRowDelayCfg;

  for(let i = 0; i < 14; i++){
    var row = new Row(i*96, i % 2 == 0, i > 6);
    row.index = i;
    dim.map.push(row);
  }

  OnPause = false;

  CreateBorders();

  dim.map.push(new BorderLine());
}

function moveRow(){
  let i = 0;
  const pool = Row.pool;
  const len = pool.length;
  window.moveRowDelay = moveRowDelayCfg;
  for(;i < len; i++){
    const row = pool[i];

    if(row.len() == 0){
      for(; i > 0; i--){
        pool[i].CopyFrom(pool[i-1]);
      }
      pool[0].Generate();
      return;
    }
  }

  let mrow = new Row(i*96, i % 2 == 0, i > 6);
  mrow.index = Row.pool.length;
  dim.map.push(mrow);

  for(; i > 0; i--){
    pool[i].CopyFrom(pool[i-1]);
  }
  pool[0].Generate();

  Lose();
}

function CreateBorders(){

  if(CreateBorders.flag) return;
  CreateBorders.flag = true;

  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(900 * pxsi, 5*pxsi);
  bodyDef.position.Set(0, 0);
  pworld.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(0, 1425*pxsi);

  const floor = pworld.CreateBody(bodyDef);
  floor.CreateFixture(fixDef);
  floor.SetUserData('floor');

  fixDef.shape.SetAsBox(1*pxsi, 1600*pxsi);
  bodyDef.position.Set(-48*pxsi, 0);
  pworld.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(850 * pxsi, 0);
  pworld.CreateBody(bodyDef).CreateFixture(fixDef);
}

CreateBorders.flag = false;
