const orentations = {vertical: 0, horizontal: 1};
const platforms = {yandex: 0, vkplay: 1};

const myOrentation = orentations.vertical;
const platform = platforms.yandex;
const gameViewport = [900,1600];

const mainLoader = new GameLoader();
mainLoader.showprogress = true;

mainLoader.reslist.push('textures/back.png');

var reslist_audios = [
	"lose.wav","b.mp3",'s.mp3', 'add.mp3','br.mp3'
];

mainLoader.AddTexArr('exp/e',22);
mainLoader.AddTexArr('p/',6)

document.addEventListener('DOMContentLoaded', function() {
	mainLoader.ready = Init;
	mainLoader.download();
});

const gameid = 33543;

const borders = [
	{x:-1, y:0,w:2,h:1600},
	{x:899, y:0,w:2,h:1600},
	{x:0, y:1599,w:900,h:2}
]
