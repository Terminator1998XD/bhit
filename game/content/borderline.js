class BorderLine extends GameObject{
  constructor(){
    super(new Vector3(0,Row.pool[13].y+96,5),new Size(900,1));
    window.bline = this;

    const cellsize = 180;
    const nominals = [5,10,25,10,5];
    for(let i = 0; i < 5; i++){
      const c = new ScoreCell(i,nominals[i]);
      dim.map.push(c);
      nominals[i] = c;
    }
    this.cells = nominals;
  }

  CheckIn(planetcenter){

  }

  OnRender(rect){
    g.beginPath();
    g.setLineDash([5, 3]); // Установка пунктирного стиля линии
    g.moveTo(rect.x, rect.y); // Установка начальной точки линии
    g.lineTo(rect.x+rect.w,rect.y);
    g.strokeStyle = 'white'; // Цвет линии (здесь белый)
    g.stroke(); // Отрисовка линии

    g.fillStyle = 'rgba(233, 234, 232, 0.7)';
    g.font = "35px myfont2";
    g.textAlign = 'left';
    g.textBaseline = 'middle';
    g.fillText(scoretext + score,rect.x+20,rect.y+120);

    const rectext = recordtext + record;
    g.fillText(rectext,rect.x+rect.w-g.measureText(rectext).width-20,rect.y+120);

    g.textAlign = 'center';
    g.fillText(moveRowDelay,rect.x+rect.w/2,rect.y+230);
  }
}

var listener = new Box2D.Dynamics.b2ContactListener;
listener.BeginContact = function(contact) {
    if(contact.GetFixtureA().GetBody().GetUserData() == 'floor'){
      const planet = contact.GetFixtureB().GetBody().GetUserData();
      if(planet.pos){
        const centerX = planet.pos.x+48, centerY = planet.pos.y+48;
        const carr = bline.cells;
        const cell = clamp(parseInt(centerX/180),0,carr.length-1);
        carr[cell].OnEnter();
        PlaySound('b');
      }
    }
}
pworld.SetContactListener(listener);
