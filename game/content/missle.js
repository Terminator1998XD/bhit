class Missle extends GameObject{

  constructor(color, line){
    super(new Vector3(P.pos.x,P.pos.y,1),new Size(96,96));
    this.curve = [P.pos, ...line];
    this.CalcTotalLength();
    this.Rotate = P.Rotate;
    this.color = color;
    this.pp = 0;
    this.setTexture(getTex('p/'+color));
    this.OnUpdate = true;
    this.flag = 0;
    Missle.pool.push(this);
  }

  Remove(){
    dim.map.splice(dim.map.indexOf(this),1);
    Missle.pool.splice(Missle.pool.indexOf(this),1);
  }

  Update(){
    const pos = this.pos;
    const rot = this.Rotate;
    const size = this.size;

    this.pp += 0.1;
    const p = this.getVec(this.pp);
    pos.x = p.x-48;
    pos.y = p.y-48;

    if(this.pp > 0.9){      
      dim.map.splice(dim.map.indexOf(this),1);
      const planet = new Planet(this.getVec(0.9));
      planet.SetColor(this.color);
      planet.Check();
      dim.map.push(planet);
      this.OnUpdate = false;
      Missle.pool.splice(Missle.pool.indexOf(this),1);
    }
  }

  getVec(prog){
    const points = this.curve;
    /*if(points.length < 2){
      return {x:1, y:1,z:2};
    }*/
    const totalLength = this.totalLength;
    // Находим длину, соответствующую заданному углу
    var targetLength = totalLength * prog;
    // Находим точку на кривой по углу
    var currentLength = 0;
    for (var i = 1; i < points.length; i++) {
        var dx = points[i].x - points[i - 1].x;
        var dy = points[i].y - points[i - 1].y;
        var segmentLength = Math.sqrt(dx * dx + dy * dy);

        if (currentLength + segmentLength >= targetLength) {
            var percentOnSegment = (targetLength - currentLength) / segmentLength;
            return {
                x: points[i - 1].x + dx * percentOnSegment,
                y: points[i - 1].y + dy * percentOnSegment,
                z: 2
            };
        }

        currentLength += segmentLength;
    }

    // Если что-то пошло не так, вернуть последнюю точку
    return { x: points[points.length - 1].x, y: points[points.length - 1].y, z: 2};
  }

  CalcTotalLength(){
    var totalLength = 0;
    const points = this.curve;
    for (var i = 1; i < points.length; i++) {
        var dx = points[i].x - points[i - 1].x;
        var dy = points[i].y - points[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    this.totalLength = totalLength;
  }
}
