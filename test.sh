#!/bin/bash

cd `dirname $0`

cat > index.testing.html <<PREFACE
<link rel="shortcut icon" type="image/png" href="jasmine/lib/jasmine-3.5.0/jasmine_favicon.png">
<link rel="stylesheet" type="text/css" href="jasmine/lib/jasmine-3.5.0/jasmine.css">

<script type="text/javascript" src="jasmine/lib/jasmine-3.5.0/jasmine.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-3.5.0/jasmine-html.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-3.5.0/boot.js"></script>

<script>
	// this splits the screen so the right half is jasmine
	setTimeout(() => {
		$('.ts-app').css('min-width', '50%');
	}, 1000);
</script>

PREFACE

cat index.html >> index.testing.html

open index.testing.html

