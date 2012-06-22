	/************
	Configuration
	*************/
	//Number of pieces
	var pieces = 15;

	//Container element
	var container = $("#container");

	//Piece width
	var pieceW = 100;
	var pieceBorder = 2;

	//Piece tag
	var pieceTag = "div";

	//Hole class
	var hole = "hole";

	//Piece class
	var piece = "piece";

	//Controls IDs	 
	var start = "#start";
	var test = "#test";
	var reset = "#reset";
	var win = "#win";
	var moves = "#moves";

	//Variables
	completedFlag = 0;
	startFlag = 0;

	/*******************************
	Generate original array sequence
	********************************/
	var original = [];

	for (var l = 1; l <= pieces; l++) {
		original.push(l);
	}
	original.push(0);

	/****************************
	Generate random array
	*****************************/
	function getNumArray(numPicks, low, high) {
		var len = high - low + 1;
		var nums = new Array(len);
		var selections = [],
			i;
		for (i = 0; i < len; i++) {
			nums[i] = i + low;
		}

		for (var i = 0; i < numPicks; i++) {
			var index = Math.floor(Math.random() * nums.length);
			selections.push(nums[index]);
			nums.splice(index, 1);
		}
		return (selections);
	}

	/******************
	Setting Up
	*******************/
	function setup() {
		//Make the container empty
		container.empty();

		container.css('width', pieceW * Math.sqrt(pieces + 1));
		container.css('height', pieceW * Math.sqrt(pieces + 1));
	}

	/******************
	Start the functions
	*******************/
	function init(flag) {

		//Setting up environment
		setup();

		$(win).hide();

		//Flags to default	
		completedFlag = 0;
		startFlag = 0;

		//Make the button enabled
		$(start).removeAttr("disabled");

		//Check Mode
		if (flag == "start") {
			//Generate random array	for the puzzle
			var deck = getNumArray((pieces + 1), 0, pieces);
		} else if (flag == "reset") {
			//Demo array to test game
			var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
		} else {
			//Initialize the board
			var deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15];
		}
		for (var i = 0; i < (pieces + 1); i++) {
			var current = deck[i];

			//Printing the element
			if (current > 0) {
				//Print the piece
				var element = "<" + pieceTag + " id='" + current + "' class='" + piece + "'>" + current + "</" + pieceTag + ">";
			} else if (current == 0) {
				//Print the hole for element with 0 value
				element = "<" + pieceTag + " id=" + 0 + " class='" + hole + "'>0</" + pieceTag + ">";
			}
			container.append(element);
		}
		container.find('div').css('width',(pieceW-(2*pieceBorder))/3);
		container.find('div').css('width',(pieceW-(2*pieceBorder))/3);
		container.find('div').css('padding',(pieceW-(2*pieceBorder))/3);
	}

	function correct() {
		var final = [];

		//Get all values from the container
		container.find(pieceTag).each(function () {
			//Pushing the values to array
			if ($(this).text()) final.push($(this).text());
			else final.push(0);
		});

		//Comparing initial array and final array for equality
		if (original.toString() == final.toString()) {
			container.find(pieceTag).each(function () {
				if ($(this).not().hasClass("piece")) {
					$(this).delay(1000).addClass("correct");
				}
				if ($(this).not().hasClass("hole")) {
					$(this).delay(1000).addClass("empty");
				}
			});
			//alert("Congrats you are the winner !");
			$(win).show();
			return true;
		}
		return false;
	}


	function updateMoves() {
		$(moves).text(parseInt($(moves).text()) + 1);
		return;
	}

	function resetMoves() {
		$(moves).text(0);
		return;
	}

	$(document).ready(function () {
		init('reset');





		$(start).click(function () {
			$(this).attr('disabled', 'disabled');
			init('start');
			resetMoves();
			//Started puzzle
			startFlag = 1;
		});

		$(reset).click(function () {
			$(start).removeAttr('disabled');
			init('reset');
			resetMoves();
		});

		$(test).click(function () {
			$(start).removeAttr('disabled');
			init('test');
			resetMoves();

			//Started puzzle
			startFlag = 1;
		});

		//Click event of the piece
		$(".piece").live('click', function () {

			if (!completedFlag) {
				var thisHole = $(".hole");

				//Getting position of the piece
				var myTop = $(this).position().top;
				var myLeft = $(this).position().left;

				//Getting position of the hole
				var hTop = thisHole.position().top;
				var hLeft = thisHole.position().left;

				//Getting position of current piece
				var offX = (myLeft - hLeft);
				var offY = (myTop - hTop);

				//Getting abs position of current piece
				var offXA = Math.abs(myLeft - hLeft);
				var offYA = Math.abs(myTop - hTop);

				//Checking whether its a valid move
				if ((offXA !== offYA) && (offXA <= pieceW) && (offYA <= pieceW)) {

					//Swapping the hole with a piece
					thisHole.text($(this).text());
					thisHole.addClass(piece);
					thisHole.removeClass(hole);

					$(this).text("0");
					$(this).addClass(hole);
					$(this).removeClass(piece);

					updateMoves();
				}

				//Checking the solution
				if (startFlag) {
					if (correct()) completedFlag = 1;
				}
			}
		});
	});