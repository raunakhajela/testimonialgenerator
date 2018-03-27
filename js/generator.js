$(function () {

	var isFilterEnabled = false;
	var isScriptsAdded = false;
	var selectedCategories = new Array();
	var checkbox = $(".cats").find('input[type="checkbox"]');
	var isLoading = true;

	var filterIt = function () {
			selectedCategories = [];
			var checked = $(".cats").find('input[type="checkbox"]:checked');
			if(checked.length > 0){
				isFilterEnabled = true;
				checked.each(function () {
					selectedCategories.push($(this).val());
				});
			} else{
				isFilterEnabled = false;
			}
			
	};

	var shuffle = function(a) {
	    var j, x, i;
	    for (i = a.length; i; i--) {
	        j = Math.floor(Math.random() * i);
	        x = a[i - 1];
	        a[i - 1] = a[j];
	        a[j] = x;
	    }
	};

	var getQuotes = function () {

		isLoading = true;

		var url="assets/js/quotes.json";

		loader();

		$.getJSON(url,function (data) {

			shuffle(data);

			var quotesList = '';

			$.each(data,function (index,value) {

				if(isFilterEnabled){
					for(var i=0;i<selectedCategories.length;i++) {
						if(selectedCategories[i] == value.cat){
							quotesList += '<li class="stack__item">'
									   + '<span class="cpy" data-clipboard-text="'+value.quote+'">copy</span>'
									   + '<div class="quote"><span class="qt">“</span><h3>'+value.quote+'</h3></div>'
									   + '<span class="author">'+value.author+'</span>'
									   + '</li>';
						}
					}
				} else{
					quotesList += '<li class="stack__item">'
							   + '<span class="cpy" data-clipboard-text="'+value.quote+'">copy</span>'
									   + '<div class="quote"><span class="qt">“</span><h3>'+value.quote+'</h3></div>'
							   + '<span class="author">'+value.author+'</span>'
							   + '</li>';
				}
				
			});

			document.getElementById('stack_yuda').innerHTML = quotesList;

			if(isScriptsAdded){
				$("[data-file='dynamic']").remove();
			}

			loadFile("assets/js/main.js", "js"); 
			
			isScriptsAdded = true;
			isLoading = false;
			loader();
		});
		
		$('.cpy').tooltip({
		  trigger: 'click',
		  placement: 'bottom'
		});

		var clipboard = new Clipboard('.cpy');

		clipboard.on('success', function(e) {
		  setTooltip(e.trigger, 'Testimonial Copied!');
		  hideTooltip(e.trigger);
		  $('body').focus();
		});

		clipboard.on('error', function(e) {
		  setTooltip(e.trigger, 'Copying Testimonial Failed!');
		  hideTooltip(e.trigger);
		  $('body').focus();
		});

	};

	function setTooltip(btn, message) {
	  $(btn).tooltip('hide')
	    .attr('data-original-title', message)
	    .tooltip('show');
	}

	function hideTooltip(btn) {
	  setTimeout(function() {
	    $(btn).tooltip('hide');
	  }, 1000);
	}

	getQuotes();

	checkbox.on('change',function (e) {
		$('body').focus();
		filterIt();
		getQuotes();
	});

	if( document.createElement('svg').getAttributeNS ) {

		var checkbxsCheckmark = Array.prototype.slice.call( document.querySelectorAll( 'ul.ac-checkmark input[type="checkbox"]' ) ),
			pathDefs = {
				checkmark : ['M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16'],
				},
			animDefs = {
				checkmark : { speed : .2, easing : 'ease-in-out' }
			};

		function createSVGEl( def ) {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			if( def ) {
				svg.setAttributeNS( null, 'viewBox', def.viewBox );
				svg.setAttributeNS( null, 'preserveAspectRatio', def.preserveAspectRatio );
			}
			else {
				svg.setAttributeNS( null, 'viewBox', '0 0 100 100' );
			}
			svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
			return svg;
		}

		function controlCheckbox( el, type, svgDef ) {
			var svg = createSVGEl( svgDef );
			el.parentNode.appendChild( svg );
			
			el.addEventListener( 'change', function() {
				if( el.checked ) {
					draw( el, type );
				}
				else {
					reset( el );
				}
			} );
		}

		checkbxsCheckmark.forEach( function( el, i ) { controlCheckbox( el, 'checkmark' ); } );
		
		function draw( el, type ) {
			var paths = [], pathDef, 
				animDef,
				svg = el.parentNode.querySelector( 'svg' );

			switch( type ) {
				case 'checkmark': pathDef = pathDefs.checkmark; animDef = animDefs.checkmark; break;
			};
			
			paths.push( document.createElementNS('http://www.w3.org/2000/svg', 'path' ) );

			for( var i = 0, len = paths.length; i < len; ++i ) {
				var path = paths[i];
				svg.appendChild( path );

				path.setAttributeNS( null, 'd', pathDef[i] );

				var length = path.getTotalLength();
				// Clear any previous transition
				//path.style.transition = path.style.WebkitTransition = path.style.MozTransition = 'none';
				// Set up the starting positions
				path.style.strokeDasharray = length + ' ' + length;
				if( i === 0 ) {
					path.style.strokeDashoffset = Math.floor( length ) - 1;
				}
				else path.style.strokeDashoffset = length;
				// Trigger a layout so styles are calculated & the browser
				// picks up the starting position before animating
				path.getBoundingClientRect();
				// Define our transition
				path.style.transition = path.style.WebkitTransition = path.style.MozTransition  = 'stroke-dashoffset ' + animDef.speed + 's ' + animDef.easing + ' ' + i * animDef.speed + 's';
				// Go!
				path.style.strokeDashoffset = '0';
			}
		}

		function reset( el ) {
			Array.prototype.slice.call( el.parentNode.querySelectorAll( 'svg > path' ) ).forEach( function( el ) { el.parentNode.removeChild( el ); } );
		}


	}

	function loadFile(filename, filetype){
		if (filetype=="js"){ 
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
			fileref.setAttribute("data-file", "dynamic")
		}
		if (typeof fileref!="undefined")
  			document.getElementsByTagName("head")[0].appendChild(fileref)
	};


	function loader() {
		if(isLoading){
			$('.loader').addClass('active');
			$('#stack_yuda').removeClass('active');
		}
		else
		{
			window.setTimeout(function () {
				$('.loader').removeClass('active');
				$('#stack_yuda').addClass('active');
			},1000);
			
		}
	};


});//main