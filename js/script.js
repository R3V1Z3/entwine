class Entwine extends GitDown {
  
    start() {
        const entwine = this;
        this.configure_progress();
        // add choice class to section li links
        $('.section .content a[href*="#"]').addClass('choice');
        this.update();
        this.find_video_references();
        const contents_collapsible = document.querySelector('.info .field.collapsible.contents');
        if ( contents_collapsible !== null ) contents_collapsible.classList.remove('collapsed');
        // handle history
        $(window).on('popstate', function (e) {
            entwine.update();
        });
    }

    configure_progress() {
        this.progress = [];
        if ( window.location.hash ) {
            if ( window.localStorage.getItem('entwine_progress') != null) {
                this.progress = window.localStorage.getItem('entwine_progress').split(',');
            }
        }
        window.localStorage.setItem('entwine_progress', '');
    }
    
    find_video_references() {
        $('.section a img').each(function() {
            var alt = $(this).attr('alt');
            //console.log(alt);
            if ( alt === 'bg-video') {
                var url = $(this).parent().attr('href');
                var id = '';
                if(url.match('http://(www.)?youtube|youtu\.be')){
                    id = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
                }
                var iframe = '<iframe id="player" class="video-inner muted" ';
                iframe += 'src="//www.youtube.com/embed/' + id;
                iframe += '?playlist=' + id + '&';
                iframe += 'version=3&';
                iframe += 'loop=1&';
                iframe += 'autoplay=1&';
                iframe += 'rel=0&';
                iframe += 'showinfo=0&';
                iframe += 'controls=0&';
                iframe += 'autohide=1&';
                iframe += '" frameborder="0" allowfullscreen></iframe>';
                $('.inner').append(iframe);
            }
            // now remove original link
            $(this).parent().remove();
        });
    }
    
    update() {
        var current = $('.section.current').attr('id');
        // update window title
        document.title = $('.section.current a.handle').text();
        
        // update browser variable with progress
        if ( this.progress.indexOf(current) === -1 ) this.progress.push(current);
        window.localStorage.setItem( 'entwine_progress', this.progress.join(",") );
        
        // hide all toc links
        $('.toc a').hide();
        
        // now show only those that user has progressed through
        for ( var i = 0; i < this.progress.length; i++ ) {
            var id = this.progress[i];
            $('a[href^="#' + id + '"]').show();
        }
        
        // add Back button if past first section
        var header = $('.section.header').attr('id');
        if ( current === header ) {
            console.log('User at start.');
            $('.back').remove();
        } else {
            // remove any prior Back buttons first
            $('.back').remove();
            // add new button
            $('.section.current').append('<a class="back">Back</a>');
            $( ".back" ).click(function() {
                window.history.back();
            });
        }
    }
    
    // returns an array of choices available for input section
    find_choices(section) {
        var choices = [];
        var $parent = $('.section#' + section);
        var $choices = $parent.find('.content a.choice');
        $choices.each(function(i, val){
            var id = val['href'].split('#')[1];
            choices.push(id);
        });
        return choices;
    }
}