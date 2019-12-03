
describe("triangle app", () => {
	it('closeEnough()', () => {
		expect(closeEnough(3, 3.0000000000001)).toBeTruthy();
		expect(closeEnough(3, 3.000000000001)).toBeTruthy();
		expect(closeEnough(3, 3.00000000001)).toBeTruthy();
		expect(closeEnough(3, 3.0000000001)).toBeFalsy();
		expect(closeEnough(3, 3.000000001)).toBeFalsy();
		expect(closeEnough(3, 3.00000001)).toBeFalsy();
		
		expect(closeEnough(0, 1e-9)).toBeFalsy();
		expect(closeEnough(0, 1e-10)).toBeFalsy();
		expect(closeEnough(0, 1e-11)).toBeTruthy();
	});
	
	it('setSvg()', () => {
		setSvg(11, 12, 13);
		expect($('#A').attr('x2')).toEqual('11');
		expect($('#A').attr('y1')).toEqual('0');
		expect($('#A-text').attr('y')).toEqual('-10');

		expect($('#B').attr('x2')).toEqual('12');
		expect($('#B').attr('x1')).toEqual('0');
		expect($('#B-text').attr('x')).toBeGreaterThan('11');
		expect($('#B-text').attr('x')).toBeLessThan('19');

		expect($('#C').attr('x1')).toEqual('11');
		expect($('#C').attr('y1')).toEqual('0');
		expect($('#C').attr('x2')).toEqual('12');
		expect($('#C').attr('y2')).toEqual('13');

		expect($('#bc').attr('cx')).toEqual('12');
		expect($('#bc').attr('cy')).toEqual('13');
	});
	
	it('setResult()', () => {
		setResult('Anna', 'Karenina');
		expect($('#result').css('display')).toEqual('block');
		expect($('#result dt').html()).toEqual('Anna');
		expect($('#result dd').html()).toEqual('Karenina');

		expect($('#input-error').css('display')).toEqual('none');
		expect($('form label.ts-error').length).toEqual(0);

	});
	
	it('setError()', () => {
		setError('Alexei', 'Vronsky');
		expect($('#result').css('display')).toEqual('none');

		expect($('#input-error').css('display')).toEqual('block');
		expect($('#input-error dt').html()).toEqual('Alexei');
		expect($('#input-error dd').html()).toEqual('Vronsky');

		expect($('form label.ts-error').length).toEqual(0);

	});
	
	it('whatKindOfTriangle()', () => {
		// useful only below
		function compareThese(a, b) {
			expect(Array.isArray(a)).toBeTruthy();
			expect(Array.isArray(b)).toBeTruthy();
			expect(a.length).toEqual(b.length);
			expect(a[0]).toEqual(b[0]);
			expect(a[1]).toEqual(b[1]);
		}
		
		sides.A = sides.B = sides.C = 100;
		compareThese(whatKindOfTriangle(), ['Equilateral']);
		sides.A = 150;
		compareThese(whatKindOfTriangle(), ['Isosceles', 'B = C']);
		sides.C = 150;
		compareThese(whatKindOfTriangle(), ['Isosceles', 'A = C']);
		sides.C = 130;
		compareThese(whatKindOfTriangle(), ['Scalene']);
	});
	
	describe('figureOutEverything()', () => {
		let myInputNode;
		beforeEach(() => {
			myInputNode = $('fieldset div label:first')[0];
		});

		it('side A zero', () => {
			sides.A = 0;
			sides.B = sides.C = 100;
			figureOutEverything(myInputNode, "A");
			expect($('#input-error').css('display')).toEqual('block');
			expect($('#input-error dt').html()).toEqual("Bad Triangle");
			expect($('#input-error dd').html()).toEqual(
				"This cannot be a triangle because side A is zero.\n");
		});

		it('side A too long', () => {
			sides.A = 500;
			sides.B = sides.C = 100;
			figureOutEverything(myInputNode, "A");
			expect($('#input-error').css('display')).toEqual('block');
			expect($('#input-error dt').html()).toEqual("Bad Triangle");
			expect($('#input-error dd').html()).toEqual(
				"This cannot be a triangle; side A is too long.\n");
		});

		it('normal correct usage', () => {
			sides.A = 150;
			sides.B = sides.C = 100;
			figureOutEverything(myInputNode, "A");
			expect($('#result').css('display')).toEqual('block');
			expect($('#result dt').html()).toEqual("Isosceles");
			expect($('#result dd').html()).toEqual(
				"With sides B = C.");
		});
	});

	describe('inputHandler()', () => {
		let myInputNode;
		beforeEach(() => {
			myInputNode = $('fieldset div label:last input')[0];
		});

		it('side C bad', () => {
			myInputNode.valueAsNumber = NaN;
			inputHandler(myInputNode, 'C');
			expect($('#input-error').css('display')).toEqual('block');
			expect($('#input-error dt').html()).toEqual("Input Error");
			expect($('#input-error dd').html()).toEqual(
				"please fix the syntax of your number for side C");
		});

		it('side C good', () => {
			$('fieldset div label input').prop('valueAsNumber', 45);
			sides.A = sides.B = sides.C = 45;
			inputHandler(myInputNode, 'C');
			expect($('#result').css('display')).toEqual('block');
			expect($('#result dt').html()).toEqual("Equilateral");
			expect($('#result dd').html()).toEqual(
				"All sides are equal.");
		});
	});

});
