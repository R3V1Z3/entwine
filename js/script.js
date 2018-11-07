class Entwine extends BreakDown {

    constructor(el, options) {
        super(el, options);
    }

    ready() {
        this.updateOffsets();
        this.extractSvg('filters.svg');
        this.addFx();
        this.vignette();
        this.centerView();
        this.registerAppEvents();
        this.updateSliderValue( 'outer-space', this.settings.getValue('outer-space') );
        this.centerView();
    }

    extractSvg(filename) {
        let svg = document.querySelector('#svg');
        if ( svg === undefined ) return;
        let svgFilter = this.settings.getParamValue('svg-filter');
        if ( svgFilter === undefined ) svgFilter = 'none';
        this.get(filename).then( data => {
            // add svg filters to body
            var div = document.createElement("div");
            div.id = 'svg';
            div.innerHTML = data;
            document.body.insertBefore(div, document.body.childNodes[0]);

            let select = this.wrapper.querySelector('.nav .select.svg-filter select');
            if ( select !== null ) {
                let filters = document.querySelectorAll('#svg defs filter');
                filters.forEach( i => {
                    var id = i.getAttribute('id');
                    var name = i.getAttribute('inkscape:label');
                    select.innerHTML += `<option>${name}-${id}</option>`;
                });
            }
            select.value = svgFilter;
            this.updateField(select, svgFilter);
            this.svgChange();
        }).catch(function (error) {
            console.log(error);
        });
    }

    addFx() {
        // check if fx layer already exists and return if so
        if ( this.wrapper.querySelector('.fx') === undefined ) return;
        const fx = document.createElement('div');
        fx.classList.add('fx');
        // wrap inner div with fx div
        const inner = document.querySelector(this.eidInner);
        inner.parentNode.insertBefore(fx, inner);
        fx.appendChild(inner);
        // add vignette layer to wrapper
        const vignette = document.createElement('div');
        vignette.classList.add('vignette-layer');
        this.wrapper.appendChild(vignette);
    }

    svgChange() {
        let svg = this.settings.getValue('svg-filter');
        let fx = document.querySelector('.fx');
        if ( fx === null ) return;

        let style = `
            brightness(var(--brightness))
            contrast(var(--contrast))
            grayscale(var(--grayscale))
            hue-rotate(var(--hue-rotate))
            invert(var(--invert))
            saturate(var(--saturate))
            sepia(var(--sepia))
            blur(var(--blur))
        `;
        let url = '';
        svg = svg.split('-');
        if ( svg.length > 1 ) url = ` url(#${svg[1].trim()})`;
        style += url;
        fx.style.filter = style;
    }

    vignette() {
        const v = this.settings.getValue('vignette');
        var bg = `radial-gradient(ellipse at center,`;
        bg += `rgba(0,0,0,0) 0%,`;
        bg += `rgba(0,0,0,${v/6}) 30%,`;
        bg += `rgba(0,0,0,${v/3}) 60%,`;
        bg += `rgba(0,0,0,${v}) 100%)`;
        var s = '';
        // once Dom class is implemented:
        // this.dom.style('.vignette-layer'. 'backgroundImage', bg);
        var vignette = this.wrapper.querySelector('.vignette-layer');
        if ( vignette !== null ) vignette.style.backgroundImage = bg;
    }

    updateOffsets() {
        this.inner.setAttribute( 'data-x', this.settings.getValue('offsetx') );
        this.inner.setAttribute( 'data-y', this.settings.getValue('offsety') );
    }

    updateSliderValue( name, value ) {
        var slider = this.wrapper.querySelector( `.nav .slider.${name} input` );
        slider.value = value;
        this.updateField(slider, value);
    }

    // center view by updating translatex and translatey
    centerView() {
        const $ = document.querySelector.bind(document);
        let $s = $('.section.current');
        let $fx = $('.fx');
        let $inner = $('.inner');

        // store $inner dimensions for use later, if not already set
        if( $inner.getAttribute('data-width') === null ) {
            $inner.setAttribute('data-width', $inner.offsetWidth);
            $inner.setAttribute('data-height', $inner.offsetHeight);
        }

        let innerSpace = parseInt( $('.field.inner-space input').value );
        let outerSpace = parseInt( $('.field.outer-space input').value );

        const maxw = window.innerWidth;
        const maxh = window.innerHeight;

        // start by setting the scale
        let scale = Math.min(
            maxw / ( $s.offsetWidth + innerSpace ),
            maxh / ( $s.offsetHeight + innerSpace )
        );

        // setup positions for transform
        let x = $s.offsetLeft - ( maxw - $s.offsetWidth ) / 2;
        let y = $s.offsetTop - ( maxh - $s.offsetHeight ) / 2;

        x -= parseInt( $('.field.offsetx input').value );
        y -= parseInt( $('.field.offsety input').value );

        // initiate transform
        const transform = `
            translateX(${-x}px)
            translateY(${-y}px)
            scale(${scale})
        `;
        let w = Number($inner.getAttribute('data-width'));
        let h = Number($inner.getAttribute('data-height'));
        $inner.style.width = w + outerSpace + 'px';
        $inner.style.height = h + outerSpace + 'px';
        $fx.style.width = $inner.offsetWidth + 'px';
        $fx.style.height = $inner.offsetHeight + 'px';
        $fx.style.transform = transform;
    }

    registerAppEvents() {

        if ( this.status.has('app-events-registered') ) return;
        else this.status.add('app-events-registered');

        window.addEventListener( 'resize', e => this.centerView() );

        this.events.add('.nav .collapsible.perspective .field.slider input', 'input', this.centerView);
        this.events.add('.nav .collapsible.dimensions .field.slider input', 'input', this.centerView);
        this.events.add('.nav .field.slider.fontsize input', 'input', this.centerView);
        this.events.add('.nav .field.slider.vignette input', 'input', this.vignette.bind(this));

        let f = document.querySelector('.nav .field.select.svg-filter select');
        f.addEventListener( 'change', this.svgChange.bind(this) );

        // LEFT and RIGHT arrows
        document.addEventListener('keyup', e => {
            const key = e.key;
            let c = '';
            if ( key === 'ArrowLeft' ) {
                c = this.sections.getPrev();
            }
            else if ( key === 'ArrowRight' ) {
                c = this.sections.getNext();
            }
            this.sections.setCurrent(c);
            this.goToSection();
        }, this);

        // mousewheel zoom handler
        this.events.add('.inner', 'wheel', e => {
            // disallow zoom within parchment content so user can safely scroll text
            let translatez = document.querySelector('.nav .slider.translatez input');
            if ( translatez === null ) return;
            var v = Number( translatez.value );
            if( e.deltaY < 0 ) {
                v += 10;
                if ( v > 500 ) v = 500;
            } else{
                v -= 10;
                if ( v < -500 ) v = -500;
            }
            this.settings.setValue('translatez', v);
            this.updateSliderValue( 'translatez', v );
        }, this );

        interact(this.eidInner)
        .gesturable({
            onmove: function (event) {
                var scale = this.settings.getValue('translatez');
                scale = scale * (5 + event.ds);
                this.updateSliderValue( 'translatez', scale );
                this.dragMoveListener(event);
            }
        })
        .draggable({ onmove: this.dragMoveListener.bind(this) });

    }

    dragMoveListener (event) {
        let target = event.target;
        if ( !target.classList.contains('inner') ) return;
        if ( event.buttons > 1 && event.buttons < 4 ) return;
        let x = (parseFloat(target.getAttribute('data-x')) || 0);
        let oldX = x;
        x += event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0);
        let oldY = y;
        y += event.dy;

        // when middle mouse clicked and no movement, reset offset positions
        if ( event.buttons === 4 ) {
            x = this.settings.getDefault('offsetx');
            y = this.settings.getDefault('offsety');
        }

        this.updateSliderValue( 'offsetx', x );
        this.updateSliderValue( 'offsety', y );

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        this.centerView();
    }

}

// class Entwine extends BreakDown {
//
//     start() {
//         const entwine = this;
//         this.configure_progress();
//         // add choice class to section li links
//         $('.section .content a[href*="#"]').addClass('choice');
//         this.update();
//         this.find_video_references();
//         const contents_collapsible = document.querySelector('.info .field.collapsible.contents');
//         if ( contents_collapsible !== null ) contents_collapsible.classList.remove('collapsed');
//         // handle history
//         $(window).on('popstate', function (e) {
//             entwine.update();
//         });
//     }
//
//     configure_progress() {
//         this.progress = [];
//         if ( window.location.hash ) {
//             if ( window.localStorage.getItem('entwine_progress') != null) {
//                 this.progress = window.localStorage.getItem('entwine_progress').split(',');
//             }
//         }
//         window.localStorage.setItem('entwine_progress', '');
//     }
//
//     find_video_references() {
//         $('.section a img').each(function() {
//             var alt = $(this).attr('alt');
//             //console.log(alt);
//             if ( alt === 'bg-video') {
//                 var url = $(this).parent().attr('href');
//                 var id = '';
//                 if(url.match('http://(www.)?youtube|youtu\.be')){
//                     id = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
//                 }
//                 var iframe = '<iframe id="player" class="video-inner muted" ';
//                 iframe += 'src="//www.youtube.com/embed/' + id;
//                 iframe += '?playlist=' + id + '&';
//                 iframe += 'version=3&';
//                 iframe += 'loop=1&';
//                 iframe += 'autoplay=1&';
//                 iframe += 'rel=0&';
//                 iframe += 'showinfo=0&';
//                 iframe += 'controls=0&';
//                 iframe += 'autohide=1&';
//                 iframe += '" frameborder="0" allowfullscreen></iframe>';
//                 $('.inner').append(iframe);
//             }
//             // now remove original link
//             $(this).parent().remove();
//         });
//     }
//
//     update() {
//         var current = $('.section.current').attr('id');
//         // update window title
//         document.title = $('.section.current a.handle').text();
//
//         // update browser variable with progress
//         if ( this.progress.indexOf(current) === -1 ) this.progress.push(current);
//         window.localStorage.setItem( 'entwine_progress', this.progress.join(",") );
//
//         // hide all toc links
//         $('.toc a').hide();
//
//         // now show only those that user has progressed through
//         for ( var i = 0; i < this.progress.length; i++ ) {
//             var id = this.progress[i];
//             $('a[href^="#' + id + '"]').show();
//         }
//
//         // add Back button if past first section
//         var header = $('.section.header').attr('id');
//         if ( current === header ) {
//             console.log('User at start.');
//             $('.back').remove();
//         } else {
//             // remove any prior Back buttons first
//             $('.back').remove();
//             // add new button
//             $('.section.current').append('<a class="back">Back</a>');
//             $( ".back" ).click(function() {
//                 window.history.back();
//             });
//         }
//     }
//
//     // returns an array of choices available for input section
//     find_choices(section) {
//         var choices = [];
//         var $parent = $('.section#' + section);
//         var $choices = $parent.find('.content a.choice');
//         $choices.each(function(i, val){
//             var id = val['href'].split('#')[1];
//             choices.push(id);
//         });
//         return choices;
//     }
// }
