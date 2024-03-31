class GameLoader{

  static textures = [];

  constructor(){
    this.ready = null;
    this.reslist = [];
    this.showprogress = false;
  }

  download(){

    const showprogress = this.showprogress
    var proginf;
    var progressinf;
    if(showprogress){
      proginf = $('<div id="proginf">').css({
        'position':'absolute',
        'left':0,'top':0,'z-index':500,'width': '100%','height': '100%',
        'background-color':'#327dbb','color':'white'
      });
      progressinf = $('<div id="progressinf">').css({
        'position':'absolute',
        'left':'50%','top':'50%','z-index':501,'transform':'translate(-50%,-50%)','font-size':'7vh'
      }).text('0%');
      $('body').append(proginf.append(progressinf));
    }

    const len = this.reslist.length;
    var complited = 0;
    for(let i = 0; i < len; i++){
      const url = this.reslist[i];
      const img = new Image();
      img.onload = () => {
        complited++;

        if(showprogress){
          progressinf.text(parseInt(complited/len*99)+'%');
        }

        if(complited == len){
          this.ready();
        }
      };
      GameLoader.textures[url.toLowerCase()] = img;
      img.src = url;
    }
  }

  AddTexArr(name, count){
    const reslist = this.reslist;
  	for(let i = 0; i < count; i++){
  		reslist.push('textures/'+name+i+'.png');
  	}
  }
}

function getTex(name){
	return GameLoader.textures['textures/'+name.toLowerCase()+".png"];
}

function getTexs(name,count){
	let arr = [];

	for(let i = 0; i < count;i++)	{
		arr.push(GameLoader.textures['textures/'+name.toLowerCase()+i+".png"]);
	}

	return arr;
}

function getTexs2(name,start,count){
	let arr = [];

	for(let i = start; i < count;i++)	{
		arr.push(GameLoader.textures['textures/'+name.toLowerCase()+i+".png"]);
	}

	return arr;
}

function getTile(map, tileID){
	return GameLoader.textures['textures/'+map.toLowerCase()+"/tile_"+tileID+".png"];
}

function getPuzzTexs(name,count){
	let arr = [];

	for(let i = 0; i < count;i++)	{
		arr.push(getPuzzTex(name+i));
	}

	return arr;
}

function getPuzzTex(texName, NW = 12, NH = 20){

    const cret = getPuzzTex.cash[texName];
    if(cret != null){
      return {
        orig: cret.orig,
        puzz: [...cret.puzz],
        width: cret.orig.width,
        height: cret.orig.height
      };
    }

    const tex = GameLoader.textures['textures/'+texName.toLowerCase()+".png"];
    //console.log("get tex "+'textures/'+texName+".png"+" result: " + tex);
    const w = tex.width/NW;
    const h = tex.height/NH;
    let ret = [];

    for (let i = 0; i < NH; i++) {
      for (let j = 0; j < NW; j++) {
        // Создание канваса для каждого кусочка изображения
        const cnv = document.createElement('canvas');
        cnv.width = w;
        cnv.height = h;
        cnv.x = j*w;
        cnv.y = i*h;
        const ctx = cnv.getContext('2d');
        ctx.drawImage(tex, j * (tex.width / NW), i * (tex.height / NH), tex.width / NW, tex.height / NH, 0, 0, w, h);
        ret.push(cnv);
      }
    }

    getPuzzTex.cash[texName] = {
      orig: tex,
      puzz: [...ret]
    };

    return {
      orig: tex,
      puzz: ret,
      width: tex.width,
      height: tex.height
    };
}

getPuzzTex.cash = {};
