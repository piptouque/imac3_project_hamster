// noprotect
var img;
var video;
var mask;

var prevFrame;
var threshold = 120;
var c = 0;

var w = window.innerWidth  * 0.8;
var h = window.innerHeight;

var lightbulbWidth  = w * 0.1;
var lightbulbHeight =  lightbulbWidth * 1.6;
var lightbulbHeightOffset = 0.28;

var stop = false;

function preload(){
  
  img = loadImage('assets/lamp.png');
  mask = loadImage('assets/lamp_mask2.png');
  imgWin = loadImage('assets/BRAVO.png');
}

function setup() {
  createCanvas(w, h);

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(w, h);
  video.hide();
  prevFrame = createImage(video.width, video.height/*,RGB*/);
	
  //let c = color(255,255,0);
  //fill(c);
  noStroke();
  
  //image(imgStart,0,0);
  button = createButton("Bouge pour remplir l'ampoule ! Appuie sur l'écran pour commencer !");
  button.size(w,h);
  button.position(0, 0);
  button.mousePressed(start);  
}

function start(){
	button.hide();
}

function draw() {
  background(255,255,255);
  translate(video.width, 0);
  scale(-1,1);
  noTint();

if(!stop){
  
  image(video,0, 0, video.width, video.height);

  pg = createGraphics(width, height);
  pg.fill(color(255, 255, 0));

  pg.rect(
    0,
    height * (1 - c / 700) - height * lightbulbHeightOffset,
    width,
    height
  );
  var p = pg.get();

  p.mask(mask);
  
  image(img,0,0, lightbulbWidth, lightbulbHeight);
  image(p, 0, 0, lightbulbWidth, lightbulbHeight);
  
  
 
  video.loadPixels();
  prevFrame.loadPixels();

  var move  = false;
  
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      // Step 1, what is the location into the array
      var loc = (x + y * width) * 4;      
      
         // Step 2, what is the previous color
      var r1 = prevFrame.pixels[loc    ];
      var g1 = prevFrame.pixels[loc + 1];
      var b1 = prevFrame.pixels[loc + 2];

      // Step 3, what is the current color
      var r2 = video.pixels[loc    ];
      var g2 = video.pixels[loc + 1];
      var b2 = video.pixels[loc + 2];
    
      var diff = dist(r1, g1, b1, r2, g2, b2);
      
      if (diff > threshold)
      {
        move = true;
      }
    }
  }

}
else{
	image(imgWin,0,0,701,327);
}

  if (move && c<700){
    c = c+10;
    console.log(c);
  }
  else if (c>0) {
    if (c>=500){
  		
  		stop = true;
	}
    c = c-10;	
  }


  prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!

}
