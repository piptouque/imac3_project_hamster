// noprotect
var img;
var video;
var mask;
var pg;

var prevFrame;
var threshold = 25;
var step = 1; // seconds.

var lightbulbWidth = 100;
var lightbulbHeight = 160;
var lightbulbHeightOffset = 40;

var c = 0;
var acc = 0;
var move = false;

function preload(){
  img  = loadImage('assets/lamp.png');
  mask = loadImage('assets/lamp_mask2.png');

}

function setup() {
  createCanvas(1920, 1080);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  prevFrame = createImage(video.width, video.height/*,RGB*/);
	
  noStroke();

}

function draw() {
  background(255,255,255);
  translate(video.width, 0);
  scale(-1,1);
  noTint();

  pg = createGraphics(width, height);

  
  image(video,0, 0, video.width, video.height);

  pg.fill(color(255,255,0));

  pg.rect(0, height * (1 - c / 700), width, height);
  var p = pg.get();

  p.mask(mask);

  image(img, 0, 0, lightbulbWidth, lightbulbHeight);

  image(p, 
    0,
    0, 
    lightbulbWidth, 
    lightbulbHeight
  );

  var deltaTime = 1 / 24; // fixme
  
  acc += deltaTime;
  
  if (acc >= step) {
    acc = 0;
    computeLight();
  }

}

function computeLight() {

  video.loadPixels();
  prevFrame.loadPixels();

  var amountMoved = 0.0;

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

      amountMoved += diff;
    }
  }

  amountMoved /= width * height;
  console.log(amountMoved);

  move = amountMoved > threshold;

  if (move && c<700){
    c = c+10;
  }
  else if (c>0) {
    c = c-10;
  }
  
  prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
}

