const gd = new GitDown('#wrapper', {
    title: 'Entwine',
    content: 'README.md',
    callback: done
});

var toggle_html='<span class="toggle"></span>';
    
// setup progress variable
var progress = [];
if ( window.location.hash ) {
    if ( window.localStorage.getItem('entwine_progress') != null) {
        progress = window.localStorage.getItem('entwine_progress').split(',');
    }
}
window.localStorage.setItem('entwine_progress', '');

function done() {
    
    // add choice class to section li links
    $('.section .content a[href*="#"]').addClass('choice');
    
    register_events();
    update();
    find_video_references();
    const contents_collapsible = document.querySelector('.info .field.collapsible.contents');
    if ( contents_collapsible !== null ) contents_collapsible.classList.remove('collapsed');
}

function find_video_references() {
    $('.section a img').each(function(){
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

function update() {
    var current = $('.section.current').attr('id');
    // update window title
    document.title = $('.section.current a.handle').text();
    
    // update browser variable with progress
    if ( progress.indexOf(current) === -1 ) progress.push(current);
    window.localStorage.setItem( 'entwine_progress', progress.join(",") );
    
    // hide all toc links
    $('.toc a').hide();
    
    // now show only those that user has progressed through
    for ( var i = 0; i < progress.length; i++ ) {
        var id = progress[i];
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
function find_choices(section) {
    var choices = [];
    var $parent = $('.section#' + section);
    var $choices = $parent.find('.content a.choice');
    $choices.each(function(i, val){
        var id = val['href'].split('#')[1];
        choices.push(id);
    });
    return choices;
}

// returns an array of sections that lead to input section
function find_sections_linking_here(section) {
    // ex: path = ['living-quarters','great-hall','throne-room']
    var path = [];
    
    // for each section
    $('.section').each(function(){
        var id = $(this).find('a.handle').attr('name');
        var choices = find_choices(id);
        if ( choices.indexOf(section) != -1 ) {
            path.push(id);
        }
    });
    return path;
}

function register_events() {
    
    // handle history
    $(window).on('popstate', function (e) {
        update();
    });
    
    // hide sections and toc reference when toggled
    $( '.section .toggle' ).click(function() {
        var name = $(this).parent().attr('name');
        $( '#' + name ).hide();
        // add hidden class to toc item;
        $( '.toc a[href*="#' + name + '"]' ).addClass('hidden');
    });
    
    // add click event to toggle items in toc
    $( '.toc .toggle' ).click(function() {
        var name = $(this).parent().attr('href');
        // toggle hidden status
        if( $(this).parent().hasClass('hidden') ) {
            $(name).show();
            $(this).parent().removeClass('hidden');
        } else {
            $(name).hide();
            $(this).parent().addClass('hidden');
        }
    });
}