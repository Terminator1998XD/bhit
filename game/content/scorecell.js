class ScoreCell extends GameObject{
  constructor(index,score){
    const pos = new Vector3(index * 180,bline.pos.y,5);
    const size = new Size(180,81);
    super(pos,size);
    this.index = index;
    this.score = score;
    this.alpha = 0.38;
  }

  OnEnter(){
    this.alpha = 1;
    this.OnUpdate = true;
    AddScore(this.score);
  }

  Update(){
    if(this.alpha > 0.38){
      this.alpha-=0.02;
    }
    else this.OnUpdate = false;
  }

  OnRender(rect){
    const {index,score, alpha} = this;
    g.fillStyle = 'rgba(255, 255, 255, '+alpha+')';
    if(index > 0)g.fillRect(rect.x,rect.y,1,rect.h);
    if(index < 4)g.fillRect(rect.x+rect.w-1,rect.y,1,rect.h);
    g.font = "40px myfont2";
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(score,rect.x+rect.w/2,rect.y+rect.h/2);
  }
}

var recordsenderInterval = null;
var lastrecsend = 0;

function recordSend(){
  if(record != lastrecsend){
    storage.set('record',record);
    storage.push();
    lastrecsend = record;
    if(lb != null){
      lb.setLeaderboardScore('lead', record);
    }
  }
}

function AddScore(score){
  if(!_loseflag){
    window.score=parseInt(window.score+score);
    if(window.score > record){
      record = window.score;

      if(storage.type == 0){
        storage.set('record',record);
      }
      else {

        if(recordsenderInterval == null){
          recordsenderInterval = setInterval(recordSend,4000);
        }

        storage.set('record',record);
        storage.push();
      }
    }
  }
}
