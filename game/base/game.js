function Init(){
	if(window['lang'] != null) return;
	window.backgroundTexture = getTex('back');

	window.lang = 'ru';
	window._advprompt = [];
	window.score = 0;
	window.exp = getTexs('exp/e',22);

	loadBackgroundTrackPosition();

	window.isPC = false;
	hideTexts();

	EngineRun();

	sdk(()=> {
        console.log('SDK initialized');
				if(isPC && myOrentation==orentations.vertical){
					$('body').css({'background-image': 'url("textures/htmlback.jpg")','background-size':'cover'});
					const neonColor = 'rgb(255, 255, 255)'; // Здесь вы можете выбрать цвет неона
					const border = '1px solid white';
					$(canvas).css({
					  'box-shadow': `0 0 10px ${neonColor}`,
					  'border-left': border,
					  'border-right': border
					});
				}

				window.record = storage.get('record') == null ? 0 : parseInt(storage.get('record'));
				window.scoretext = TXT('stxt');
				window.recordtext = TXT('rtxt');

				translateBlocks();
				fillSettings();
				resizeCanvas();
				startLevel();
				window.P = new Player();
				player = [P];
				$('#proginf').remove();
    });
}

var _loseflag = false;
function Lose(){
	if(_loseflag) return;

	_loseflag = true;
	OnPause = true;
	PlaySound('lose');

	dead_advprompt(preAlive,postAlive);

	function preAlive(){
		const planets = [...Planet.pool];
		for(const planet of planets){
			if(planet.row.index > 6){
				planet.ExplodeOnce();
			}
		}
		const mp = [...Missle.pool];
		for(const m of mp){
			m.Remove();
		}
	}

	function postAlive(){
		OnPause = false;
		_loseflag = false;
	}
}

function NewGame(){
	banner(function(){
		for(const body of Planet.bodyes){
			pworld.DestroyBody(body);
		}

		Planet.bodyes = [];

		score = 0;
		_loseflag = false;
		startLevel();
		window.P = new Player();
		player = [P];
		_advprompt = [];
		playMusic();
		$('.overlay').hide();
		if(isMobile)ysdk.adv.hideBannerAdv();
	});
}

function updlb(){
  $('.crecord').html(parseInt(score));
  $('.record').html(parseInt(record));
}

var retonp = false;

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") {
		if(!OnPause){
			OnPause = true;
			retonp = true;
		}
		pauseMusic();
		StopAllSound();
  }
	else if(retonp){
		OnPause = false;
		retonp = false;
		playMusic();
	}
});
