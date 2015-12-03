//deal the audio element
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context=new window.AudioContext();
var myaudio=document.getElementById("myaudio");
var source=context.createMediaElementSource(myaudio);
var analyser=context.createAnalyser();
source.connect(analyser);
analyser.connect(context.destination);
//draw canvas
var mycanvas=document.getElementById("mycanvas");
var width=mycanvas.width;
var height=mycanvas.height;
var lineWidth=width/60;
var gap=width/800;
var lineNumber=width/(gap+lineWidth);
//获取绘画环境
var ctx=mycanvas.getContext('2d');
//定义渐变样式
var gradient=ctx.createLinearGradient(0,0,0,300);
gradient.addColorStop(1,'#0f0');
gradient.addColorStop(0.5,'#ff0');
gradient.addColorStop(0,'#f00');
//频谱头的Style
var capStyle=ctx.createLinearGradient(0,0,0,300);
capStyle.addColorStop(1,'#0f0');
capStyle.addColorStop(0.5,'#ff0');
capStyle.addColorStop(0,'#f00');
var capHeight=height/20;
//draw
var lastData=new Array();
var drawMeter = function() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var step = Math.round(array.length / lineNumber); //计算采样步长
    ctx.clearRect(0, 0, width, height); //清理画布准备画画
    for (var i = 0; i < lineNumber; i++) {
        var value = array[i * step];
        value=value>height?height:value;
        //获取第一个画面的Data
        if (lastData.length<Math.round(lineNumber)){
        	lastData.push(value);
        }
        //绘制频谱头
        ctx.fillStyle=capStyle;
        if (value<lastData[i]){
        	ctx.fillRect(i * 8, height - (--lastData[i]), lineWidth, capHeight);
        } else {
        	ctx.fillRect(i * 8, height - value, lineWidth, capHeight);
        	lastData[i]=value;	//更新数据
        }
        //绘制频谱图
        ctx.fillStyle=gradient;
        ctx.fillRect(i * 8, height-value+capHeight, lineWidth, height);
    }
    requestAnimationFrame(drawMeter);
}
requestAnimationFrame(drawMeter);
//播放音频列表
var musiclist=['cby-nmwm.mp3','cxc-djjy.mp3','do-not-let-it-pass.mp3','far-away.mp3','tfboys.mp3','zbc-nianlun.mp3'];
var musicMax=6;
var musicCur=0;
myaudio.onended=function(){
	var musicNext=Math.floor(Math.random()*musicMax);
	if (musicCur!=musicNext) {
		musicCur=musicNext;
	} else {
        musicNext=Math.floor(Math.random()*musicMax);
    }
	myaudio.src='music/'+musiclist[musicCur];
	myaudio.play();
};