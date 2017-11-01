// variables 
var dirs = ['LEFT', 'RIGHT'];
var wind = getRandomInt(10, 100);
var windDir = dirs[Math.floor(Math.random()*dirs.length)]; // LEFT or RIGHT
var spin = 0;
var speed = 0;
var time = 0;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var wickets = 0;

var sLeft = '+=10px';
var sRight = 0;

var ballSpeedB = 800; // mili seconds to throw a ball before tap for 0% increase in slider
var ballSpeedA = 500; // mili seconds to throw a ball after tap for 0% increase in slider

$('#wind').html(wind);



function startGame() {
	createjs.Sound.play("cheering");	
	var cheerInterval = setInterval(function() {
		createjs.Sound.play("cheering");	
	}, 3000);
	
	$('#spalsh').hide();
	$('#footer').hide();
	// total time for game is 1 min
	var totalInterval = setInterval(function() {
		time++;
		if(time < 60) {
			$('#time').html(time);
		} else {
			createjs.Sound.play("timeOver");	

			setTimeout(function() {
				createjs.Sound.stop();
			}, 500);

			clearInterval(cheerInterval);
			clearInterval(totalInterval);
			$('#sWickets').html(wickets);
			$('#game-over').show();
			$('#replay').show();
		}
	}, 1000);		
}

// get random number for wind
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// setting ball posotion
$('#ball').css('left', (screenWidth/2 - 16)+ "px");

// setting stumps posotion
$('#stumps').css('left', (screenWidth/2 + 25)+ "px");

// slider events
$("#spin").slider({
	value: 50,
	change: function( event, ui ) {
		spin = ui.value;
		// for left side spin
		if(spin < 50) {
			var nD = 50 - spin;

			// adding wind
			if(windDir === 'LEFT') {
				sLeft = "-=" + (((90 * nD) / 50) + (wind)) + "px"; // same directions
			} else {
				sLeft = "-=" + (((90 * nD) / 50) - ((wind))) + "px"; // opposite directions
			}
		}

		// for right side spin
		if(spin >= 50) {
			var pD = -(50 - spin);

			// adding wind
			if(windDir === 'LEFT') {
				sLeft = "+=" + (((90 * pD) / 50) - ((wind))) + "px"; // opposite directions
			} else {
				sLeft = "+=" + (((90 * pD) / 50) + (wind)) + "px"; // same directions 
			}
		}
	}
});

// for left side spin
if(spin < 50) {
	var nD = 0;

	// adding wind
	if(windDir === 'LEFT') {
		sLeft = "-=" + (((90 * nD) / 50) + (wind)) + "px"; // same directions
	} else {
		sLeft = "-=" + (((90 * nD) / 50) - ((wind))) + "px"; // opposite directions
	}
}

// for right side spin
if(spin >= 50) {
	var pD = 0;

	// adding wind
	if(windDir === 'LEFT') {
		sLeft = "+=" + (((90 * pD) / 50) - ((wind))) + "px"; // opposite directions
	} else {
		sLeft = "+=" + (((90 * pD) / 50) + (wind)) + "px"; // same directions 
	}
}

$('#dir').html(windDir.split('')[0]);

$("#speed").slider({
	change: function( event, ui ) {
		speed = 100 - ui.value;
		if(speed < 40)
			speed = 40;
		ballSpeedB = (800 * speed) / 100;
		ballSpeedA = (400 * speed) / 100;
	}
});


// tap on button
$('#ball').on('click', function(e) {

	$(this).animate({
		bottom: '+=35%',
		height: '-=24px',
		left: '+=50px'
	}, ballSpeedB, function() {

		createjs.Sound.play("ballTappi");	

		// after ball tap to ground
		$(this).animate({
			bottom: '+=20%',
			height: '-=12px',
			left: sLeft
		}, ballSpeedA, function() {

			// detecting collision
			var stumps = {x: $('#stumps').offset().left, y: $('#stumps').offset().top, width: $('#stumps').width(), height: $('#stumps').height()};
			var ball = {x: $('#ball').offset().left, y: $('#ball').offset().top, width: $('#ball').width(), height: $('#ball').height()};

			if (stumps.x < ball.x + ball.width &&
			   stumps.x + stumps.width > ball.x &&
			   stumps.y < ball.y + ball.height &&
			   stumps.height + stumps.y > ball.y) {
				createjs.Sound.play("stumps");	
				$('#stumps').attr('src', 'images/broken_stumps.png')
								
				setTimeout(function() {
					wickets++;
					$('#wickets').html(wickets);
					$('#cover-text').html('BOWLED!');
					$('#cover').show();					
				}, 500);

			} else {
				createjs.Sound.play("lifeLost");	
				$('#cover-text').html('MISSED!');
				$('#cover').show();					
			}

			$(this).hide();
			setTimeout(function(){
				resetAll();
			},1000);
		});
	});
});

function resetAll() {
	$('#cover').hide();
	wind = getRandomInt(10, 100);
	windDir = dirs[Math.floor(Math.random()*dirs.length)]; // LEFT or RIGHT
	spin = 50;
	speed = 0;

	sLeft = '+=10px';
	sRight = 0;

	ballSpeedB = 800; // mili seconds to throw a ball before tap for 0% increase in slider
	ballSpeedA = 500; // mili seconds to throw a ball after tap for 0% increase in slider		

	$("#spin").slider({
		value: 50
	});	

	$("#speed").slider({
		value: 0
	});	


	$('#wind').html(wind);

	$('#ball').show();
	// setting ball posotion
	$('#ball').css({
		'left': (screenWidth/2 - 16)+ "px",
		'bottom': "10%",
		'height': "48px"
	});

	// setting stumps posotion
	$('#stumps').css('left', (screenWidth/2 + 25)+ "px").attr('src', 'images/stumps.png');

	// for left side spin
	if(spin < 50) {
		var nD = 0;

		// adding wind
		if(windDir === 'LEFT') {
			sLeft = "-=" + (((90 * nD) / 50) + (wind)) + "px"; // same directions
		} else {
			sLeft = "-=" + (((90 * nD) / 50) - ((wind))) + "px"; // opposite directions
		}
	}

	// for right side spin
	if(spin >= 50) {
		var pD = 0;

		// adding wind
		if(windDir === 'LEFT') {
			sLeft = "+=" + (((90 * pD) / 50) - ((wind))) + "px"; // opposite directions
		} else {
			sLeft = "+=" + (((90 * pD) / 50) + (wind)) + "px"; // same directions 
		}
	}

	$('#dir').html(windDir.split('')[0]);

}