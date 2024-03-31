class Row extends GameObject{
  constructor(y,offset, isFree){
    super(new Vector3(0,y,1), new Size(900,96));
    this.Visible = false;
    this.planets = [];
    this.xoffset = offset ? 35 : 0;
    this.isRow = true;
    this.y = y;

    if(!isFree){
      const p = 900/96-1;
      for(let i = 0; i < p; i++){
        const planet = new Planet(this);
        this.planets.push(planet);
        planet.index = i;
        dim.map.push(planet);
      }
    }

    Row.pool.push(this);
  }

  len(){
    const planets = this.planets;
    const len = planets.length;

    if(len == 0){
      return 0;
    } else {
      let c = 0;

      for(let i = 0; i < len; i++){
        if(planets[i] != null){
          c++;
        }
      }
      return c;
    }
  }

  CopyFrom(row){
    const planets = row.planets;
    const plen = planets.length;
    const tplanets = [];

    for(let i = 0; i < plen; i++){
      const p = planets[i];
      if(p != null){
        p.row = this;
        p.pos.y = this.y;
        p.pos.x = i*96+this.xoffset;
        tplanets.push(p);
      }
      else tplanets.push(null);
    }
    this.planets = tplanets;
  }

  Generate(){
    this.planets = [];
    const p = 900/96-1;
    for(let i = 0; i < p; i++){
      const planet = new Planet(this);
      this.planets.push(planet);
      planet.index = i;
      dim.map.push(planet);
    }
  }

  GetPosByIndex(index){
    return index*96+this.xoffset;
  }
}
