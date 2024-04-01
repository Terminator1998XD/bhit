var canvas = document.createElement("canvas");
var g = canvas.getContext("2d");
document.body.appendChild(canvas);

resizeCanvas();

var isMobile = false;

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  const overlay = $('.overlay');

  if(myOrentation == orentations.vertical){
      if(isMobile){

        canvas.width = window.innerWidth;
        canvas.style.marginLeft = 'unset';
        overlay.css({'left': 0});
      }
      else {

        const scale = Math.min(window.innerWidth / gameViewport[0], window.innerHeight / gameViewport[1]);
        canvas.width = gameViewport[0] * scale;

        const str = `calc(50% - ${canvas.width / 2}px)`;
        canvas.style.marginLeft = str;
      }
  } else {
    canvas.width = window.innerWidth;
  }

  canvas.height = window.innerHeight;
  window.scaleX = canvas.width/gameViewport[0];
  window.scaleY = canvas.height/gameViewport[1];
}

var AnyMouseDown = false, AnyMouseUp = false;
var AnyTouchDown = false, AnyTouchUp = false;
var GameSpeed = 1;

var mx = 0, my = 0;
window.addEventListener('mousedown', function(event) {
  AnyMouseDown = true;
  AnyMouseUp = false;
  const rect = canvas.getBoundingClientRect();
  mx = (event.clientX - rect.left) / scaleX; // Получаем координату X точки нажатия мышью
  my = (event.clientY - rect.top) / scaleY; // Получаем координату Y точки нажатия мышью
});

window.addEventListener('mousemove', function(event) {
  const rect = canvas.getBoundingClientRect();
  mx = (event.clientX - rect.left) / scaleX; // Получаем координату X точки нажатия мышью
  my = (event.clientY - rect.top) / scaleY; // Получаем координату Y точки нажатия мышью
});

window.addEventListener('touchmove', function(event) {
  const rect = canvas.getBoundingClientRect();
  mx = (event.touches[0].clientX - rect.left) / scaleX; // Получаем координату X точки касания
  my = (event.touches[0].clientY - rect.top) / scaleY; // Получаем координату Y точки касания
});

window.addEventListener('touchstart', function(event) {
  if(!OnPause) event.preventDefault();
  AnyTouchDown = true;
  AnyTouchUp = false;
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches[0]; // Получаем первое касание
  mx = (touch.clientX - rect.left) / scaleX; // Получаем координату X точки касания
  my = (touch.clientY - rect.top) / scaleY; // Получаем координату Y точки касания
});

window.addEventListener('mouseup', function(event) {
  AnyMouseDown = false;
  AnyMouseUp = true;
});

window.addEventListener('touchend', function(event) {
  if(!OnPause) event.preventDefault();
  AnyTouchDown = false;
  AnyTouchUp = true;
});

var dim = new Dim(0);
var player = [];

var effects = new Array(500);
var effects_length = 0;
function effects_push(element){
  const id = effects_length;
  effects[id] = element;
  if(effects_length < 498) effects_length++;
  element.effectID = id;
}
function effects_remove(element){
  const lastel = effects_length - 1;
  const id = element.effectID;

  if(id != lastel){
    const swap = effects[lastel];
    swap.effectID = id;
    effects[id] = swap;
  }

  effects_length = lastel;
}

var camera = new Vector2(0,0), CameraFovW = 0, CameraFovH = 0, scaleX = 1, scaleY = 1;
var OnPause = true;
const RadToGrad = 180.0/Math.PI, GradToRad = Math.PI/180.0;

function Render()
{
	g.resetTransform();
	g.scale(scaleX, scaleY);
  g.drawImage(backgroundTexture,0,0,900,1600);

  CameraFovW = camera.x + canvas.width * (1/scaleX);
  CameraFovH = camera.y + canvas.height * (1/scaleY);

  DrawArray(dim.map);
  DrawEffects();
  DrawArray(player);

  g.resetTransform();

  requestAnimationFrame(Render);
}

function DrawArray(curmap) {
  const length = curmap.length;
  for (let obj = 0; obj < length; obj++) {
    const drawable = curmap[obj];

    if (drawable !== null && drawable.Visible) {

      const x = drawable.pos.x;
      const y = drawable.pos.y;
      const w = drawable.size.w;
      const h = drawable.size.h;

      if (drawable.allwaysdraw || (x >= camera.x - w && y >= camera.y - h && x - w <= CameraFovW && y - h <= CameraFovH))  {
        const pivot = drawable.pivot;
        const tx = x - camera.x + w / 2 + pivot.x;
        const ty = y - camera.y + h / 2 + pivot.y;

        g.save();
        g.translate(tx, ty);
        const Rotate = drawable.Rotate;
        g.rotate(Rotate);

        //LastScreenSpace.x = tx;
        //LastScreenSpace.y = ty;
        //drawable.LastScreenSpace = LastScreenSpace;

        drawable.OnRender({x: -drawable.size.w / 2 - pivot.x,y: -drawable.size.h / 2 - pivot.y,w: w,h: h});

        g.restore();
      }
    }
  }
}

function DrawEffects() {
  for (let obj = 0; obj < effects_length; obj++) {
    const drawable = effects[obj];

    if (drawable !== null && drawable.Visible) {
      const x = drawable.pos.x;
      const y = drawable.pos.y;
      const w = drawable.size.w;
      const h = drawable.size.h;

      if (x >= camera.x - w && y >= camera.y - h && x - w <= CameraFovW && y - h <= CameraFovH) {
        const pivot = drawable.pivot;
        const tx = x - camera.x + w / 2 + pivot.x;
        const ty = y - camera.y + h / 2 + pivot.y;

        g.translate(tx, ty);

        if(drawable.OnRender({x: -drawable.size.w / 2,y: -drawable.size.h / 2,w: w,h: h})){
          obj -= 1;
        }

        //if (Rotate !== 0) g.rotate(-Rotate);
        g.translate(-tx, -ty);
      }
    }
  }
}

var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2AABB = Box2D.Collision.b2AABB
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

var pworld = new b2World(new b2Vec2(0, 10),true);

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.9;
var bodyDef = new b2BodyDef;
const pxsi = 0.001;
const sipx = 1/pxsi;

function Update(){
  if (!OnPause) {
    pworld.Step(1 / 60, 10, 10);
    pworld.DrawDebugData();
    pworld.ClearForces();

    const mappp = dim.map;
    for (let obj = 0; obj < mappp.length; obj++) {
      const u = mappp[obj];

      if (u.OnUpdate) u.Update();

      /*const components = u.updcomponents;
      for(let i = 0; i < components.length; i++){
        components[i].Update();
      }*/
    }

    for (let i = 0; i < player.length; i++) {
      const p = player[i];
      if(p.OnUpdate)p.Update();

      /*const components = p.updcomponents;
      for(let i = 0; i < components.length; i++){
        components[i].Update();
      }*/
    }
  }

  for (let obj = 0; obj < effects_length; obj++) {
    effects[obj].Update();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function EngineRun(){
  Render();
  setInterval(Update, 1000/20);
}

function getrand(min, max) {
  max = max - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
