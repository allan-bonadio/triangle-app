//
// triangle app - project for Tradeshift
//                (C) 2019 Allan Bonadio
//

const log = console.log.bind(console);

ts.ui.ready(function() {
	log("The Ready event has come!");
	
	setEvents();
	figureOutEverything();
});

function closeEnough(a, b) {
	return Math.abs(a - b) < 1e-10;
}

/* ********************************************* math */

const sides = {A: 3, B: 4, C: 5};

/* 
You start with triangles with sides A, B and C
with vertices ab, bc, and ca.  Put ab at (0, 0)
and put ac at (A, 0).  Must find coords of point bc, bcx and bcy.
Write equations for the three lengths as A**2 = (vector ab - vector ca)**2
and simplify because of zeroes.  Some algebra gets you to:
2 bcx A = A**2 + B**2 - C**2
and bcy = sqrt(B**2 - bcx**2)
and a negative under the square root means an impossible triangle 
(one side way too large)
*/

// fill in the blanks in the graphic.  Must be scaled, pixel coordinates.
function setSvg(A, bcx, bcy) {
	
	// offset the viewBox in case bcx gets negative
	let xMin = Math.min(0, bcx);
	$('svg').attr('viewBox', `${xMin - 25} -25 350 350`);
	
	// fill in the graph.  first the dots
	$('circle#ab').attr({cx:   0, cy:   0});
	$('circle#bc').attr({cx: bcx, cy: bcy});
	$('circle#ca').attr({cx:   A, cy:   0});
	
	// and their labels
	$('text#ab-text').attr({x:     -10, y: -10});
	$('text#bc-text').attr({x: bcx + 5, y: bcy + 15});
	$('text#ca-text').attr({x:   A + 10, y:   0});
	
	// then the lines
	$('line#A').attr({x1: 0, y1: 0, x2:   A, y2:   0})
	$('line#B').attr({x1: 0, y1: 0, x2: bcx, y2: bcy});
	$('line#C').attr({x1: A, y1: 0, x2: bcx, y2: bcy});
	
	// and their labels
	$('text#A-text').attr({x:      A * .4, y:      - 10}).html('A = '+ sides.A);
	$('text#B-text').attr({x:   bcx * .55 + 10, y: bcy/2 - 10}).html('B = '+ sides.B);
	$('text#C-text').attr({x: (A + bcx + 20)/2, y: bcy/2+10}).html('C = '+ sides.C);
}

// report a successful result, what kind of triangle it is.
// Either setResult() or setError() must be called for every keystroke.
function setResult(heading, result) {
	// remove all error stuff
	$('#input-error').hide();
	$('form label').removeClass('ts-error');

	// show good stuff
	$('#result dt').html(heading);
	$('#result dd').html(result);
	$('#result').show();
}

// report an error, including details if possible.  
// Pass which input box node, or null if none.  (or a jQ or a css selector)
// Either setResult() or setError() must be called for every keystroke.
function setError(heading, message, inputBox) {
	// remove all good stuff
	$('#result').hide();

	// show the sad results
	$('#input-error dt').html(heading);
	$('#input-error dd').html(message);
	$('#input-error').show();

	// mark which box.  which you can't see with the focus on it...
	$(inputBox).parents('label').addClass('ts-error');
}

// decide if this is isosceles or what
function whatKindOfTriangle() {
	if (closeEnough(sides.A, sides.B)) {
		if (closeEnough(sides.A, sides.C))
			return ['Equilateral'];
		return ['Isosceles', 'A = B'];
	}

	if (closeEnough(sides.A, sides.C))
		return ['Isosceles', 'A = C'];
	else if (closeEnough(sides.B, sides.C))
		return ['Isosceles', 'B = C'];
	return ['Scalene'];
}

// pass it the <input node and which one it was, 
// and this will change all the widgets just right.
function figureOutEverything(inputBox, side) {
	let bcy, error = '', badSide = 'x';

	if (closeEnough(sides.A, 0))
		error += "This cannot be a triangle because side A is zero.\n";
	if (closeEnough(sides.B, 0))
		error += "This cannot be a triangle because side B is zero.\n";
	if (closeEnough(sides.C, 0))
		error += "This cannot be a triangle because side C is zero.\n";

	// location of the bc vertex.
	let bcx = (sides.A * sides.A + sides.B * sides.B - sides.C * sides.C) / (2 * sides.A);
	
	// the determinant tells if it's an impossible or degenerate triangle.
	let det = sides.B * sides.B - bcx * bcx;
	if (closeEnough(det, 0)) {
		error += "This cannot be a triangle; it's collapsed flat.\n";
		bcy = 0;
	}
	else if (det < 0) {
		// whose fault is it?
		if (sides.A > sides.B) {
			badSide = 'A';
			if (sides.C > sides.A)
				badSide = 'C';
		}
		else {
			badSide = 'B';
			if (sides.C > sides.B)
				badSide = 'C';
		}
		error += `This cannot be a triangle; side ${badSide} is too long.\n`;
		bcy = 0;
		bcx = 0;
	}
	else {
		// this is why it had to be positive
		bcy = Math.sqrt(det);
	}
	
	// cook up a scaling factor ready for whatever numbers
	let xSpan = Math.max(sides.A, bcx) - Math.min(0, bcx);
	let ySpan = Math.max(sides.B, sides.C);
	let scale = 300 / Math.max(xSpan, ySpan);
	setSvg(sides.A * scale, bcx * scale, bcy * scale);
	
	if (error) {
		// show error box, and try to find which input box to redden
		setError("Bad Triangle", error, $('#length-'+ badSide));
		return;
	}

	let [what, which] = whatKindOfTriangle();
	if (which)
		which = "With sides "+ which +".";  // isosceles
	else
		which = what == 'Equilateral' ? "All sides are equal." : "All sides are unequal."
	setResult(what, which);
}

/* ********************************************* input events */

// handles each keystroke
function inputHandler(target, side) {
	// input type Number just filters characters, so it does allow two 
	// decimal pts and two Es and assorted + and - in the wrong places
	// but the built in converter usually gets it right 
	// (except it flags '5e' while you're typing)
	if (isNaN(target.valueAsNumber)) {
		setError("Input Error", 
			"please fix the syntax of your number for side "+ side, 
			target);
		return;
	}

	// these numbers really mean the same positive or negative
	sides[side] = Math.abs(target.valueAsNumber);
	
	figureOutEverything(target, side);
}

// wires up the input boxes to respond to events
function setEvents() {
	$('#length-A, #length-B, #length-C').on('input', ev => {
		let side = ev.target.id.substr(7);
		inputHandler(ev.target, side);
	});
}
