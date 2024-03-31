class Player extends GameObject{
  static firstlaunch = true;
  constructor(){
    super(new Vector3(900/2-96/2,1450,10), new Size(96,96));
    this.color = Planet.pool[getrand(0,Planet.pool.length)].color;
    this.setTexture(getTex('p/'+this.color));
    this.OnUpdate = true;
    this.line = [];
  }

  OnRender(rect){
    //тут линию нарисовать
    g.save();
    g.resetTransform();
    g.scale(scaleX,scaleY);
    g.beginPath();
    g.setLineDash([5, 3]); // Установка пунктирного стиля линии
    g.moveTo(this.pos.x+48, this.pos.y+48); // Установка начальной точки линии
    for (const point of this.line) {
      g.lineTo(point.x, point.y); // Добавление точек к линии
    }
    g.strokeStyle = 'white'; // Цвет линии (здесь белый)
    g.stroke(); // Отрисовка линии
    g.restore();
    //основной рендер
    g.drawImage(this.NextFrame(),rect.x,rect.y,rect.w,rect.h);
  }

  Update(){
    let fromRot = Math.atan2(my - this.pos.y, mx - this.pos.x)
    this.Rotate = fromRot;

    let line = [];
    let lastrect = null;
    let fromX = this.pos.x+48;
    let fromY = this.pos.y+48;
    let toX = Math.cos(fromRot) * 5000;
    let toY = Math.sin(fromRot) * 5000;

    do{
      for(let i = 0; i < 3; i++){
        const b = borders[i];
        if(b == lastrect) continue;
        var intersect = lineIntersectsRectangle(fromX,fromY,toX,toY,b.x,b.y,b.w,b.h);
        if(intersect){
          fromX = intersect.x;
          fromY = intersect.y;

          if(fromX < 450){
            fromRot += 100*GradToRad;
          } else {
            fromRot -= 100*GradToRad;
          }

          toX = Math.cos(fromRot) * 5000;
          toY = Math.sin(fromRot) * 5000;
          lastrect=b;
          line.push({x:fromX,y:fromY});
          break;
        }
      }
    }
    while(intersect);

    line.push({x:toX,y:toY});

    let llll = line.length;

    const pp = Planet.pool;
    const ppl = Planet.pool.length;
    const newlines = [];

    if(llll == 1){
      fromX = this.pos.x+48;
      fromY = this.pos.y+48;

      let pi = false;
      let dis = -100;

      for(let j = 0; j < ppl; j++){
        const a = pp[j];
        const pos2 = a.pos;
        var intersect = lineIntersectsSphere(fromX,fromY,toX,toY,pos2.x+48,pos2.y+48,50);
        if(intersect){
          if(intersect.y > dis){
            dis = intersect.y;
            pi = intersect;
          }
        }
      }

      if(pi){
        newlines.push(pi);
      } else {
        newlines.push(line[0]);
      }
    } else {
    line = [{x:this.pos.x+48,y:this.pos.y+48},...line];
    llll = line.length;
    for(let i = 1; i < llll; i++){
      newlines.push(line[i-1]);
      fromX = line[i-1].x;
      fromY = line[i-1].y;
      toX = line[i].x;
      toY = line[i].y;

      let pi = false;
      let dis = -100;

      for(let j = 0; j < ppl; j++){
        const a = pp[j];
        const pos2 = a.pos;
        var intersect = lineIntersectsSphere(fromX,fromY,toX,toY,pos2.x+48,pos2.y+48,50);
        if(intersect){
          if(intersect.y > dis){
            dis = intersect.y;
            pi = intersect;
          }
        }
      }

      if(pi){
        newlines.push(pi);
        break;
      }
    }
    newlines.splice(0,1);
  }

    this.line = newlines;

    if(AnyMouseDown || AnyTouchUp){
      AnyMouseDown = false;
      AnyTouchUp = false;
      dim.map.push(new Missle(this.color, newlines));
      this.GoNext();
      PlaySound('s');
      moveRowDelay--;
      if(moveRowDelay == 0){
        moveRow();
      }

      if(Player.firstlaunch){
        playMusic();
        Player.firstlaunch = false;
      }
    }
  }

  GoNext(){
    this.Visible = true;
    this.OnUpdate = true;

    const len = Planet.pool.length;

    if(len == 0){

      return;
    }

    this.color = Planet.pool[getrand(0,len)].color;
    this.setTexture(getTex('p/'+this.color));
  }
}
