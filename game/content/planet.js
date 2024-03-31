class Planet extends GameObject{

  static bodyes = [];

  constructor(row){
    const flag = !row.isRow;
    if(flag){
      const pos = row;
      const ri = parseInt(pos.y/96);
      row = Row.pool[ri];

      var cell = clamp(parseInt((pos.x-(row ? row.xoffset:0))/96),0,8);

      while(row && row.planets[cell] != null){
        row = Row.pool[row.index + 1];
      }

      if(row == null){
        row = {y: Row.pool[Row.pool.length-1].y+96, imitation: true, isRow: false, index: Row.pool.length};
        Lose();
      }
    }
    else var cell = row.planets.length;

    super(new Vector3(cell * 96 + row.xoffset,row.y, 1), new Size(96,96));

    if(flag){
      if(!row.imitation) row.planets[cell] = this;
    } else {
      this.color = getrand(0,6);
      this.setTexture(getTex('p/'+this.color));
    }

    this.row = row;
    Planet.pool.push(this);
  }

  ExplodeOnce(){
    if(this.row.isRow) this.row.planets[this.row.planets.indexOf(this)] = null;
    Planet.pool.splice(Planet.pool.indexOf(this),1);
    dim.map.splice(dim.map.indexOf(this),1);
    new Explode(this.pos,this.size);
  }

  Explode(){
    if(this.row.isRow) this.row.planets[this.row.planets.indexOf(this)] = null;
    Planet.pool.splice(Planet.pool.indexOf(this),1);
    this.OnUpdate = true;

    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new b2CircleShape(48*pxsi);
    bodyDef.position.x = this.pos.x*pxsi;
    bodyDef.position.y = this.pos.y*pxsi;
    const body = pworld.CreateBody(bodyDef);
    this.body = body;
    this.fixture = body.CreateFixture(fixDef);
    body.SetUserData(this);
    Planet.bodyes.push(body);
  }

  Update(){
    const pbody = this.body;
    const pos_si = pbody.GetPosition();
    const pos = this.pos;
    pos.x = pos_si.x * sipx;
    pos.y = pos_si.y * sipx;
    this.Rotate = pbody.GetAngle();

    if(Math.abs(this.body.GetLinearVelocity().y) < 0.005){
      this.DestroyPlanet();
    }
  }

  DestroyPlanet(){
    dim.map.splice(dim.map.indexOf(this),1);
    new Explode(this.pos,this.size);
    pworld.DestroyBody(this.body);
    Planet.bodyes.splice(Planet.bodyes.indexOf(this.body),1);
  }

  SetColor(col){
    this.color = col;
    this.setTexture(getTex('p/'+col));
  }

  Check(){
    const n = [this];
    this.getn(n);

    if(n.length > 2){
      for(const p of n){
        p.Explode();
      }
      PlaySound('br');
    }
    else{
      PlaySound('add');
    }
  }

  getn(n){
    const cen = {x:this.pos.x+48,y:this.pos.y+48};

    for(const p of Planet.pool){
      const cenp = {x:p.pos.x+48,y:p.pos.y+48};

      if(p.color == this.color && Vector3.Distance(cen, cenp) < 180){
        if(!n.includes(p)){
          n.push(p);
          p.getn(n);
        }
      }
    }
  }
}
