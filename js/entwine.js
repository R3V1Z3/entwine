/* global $, jQuery, location, HtmlWhitelistedSanitizer, URLSearchParams, URL */
var TOC = [];

// get URL parameters
let params = (new URL(location)).searchParams;
var path = '/' + window.location.hostname.split('.')[0];
path += window.location.pathname;

var debug = '';

var progress = [];
if ( window.location.hash ) {
    if ( window.localStorage.getItem('entwine_progress') != null) {
        progress = window.localStorage.getItem('entwine_progress').split(',');
    }
}
window.localStorage.setItem('entwine_progress', '');

// set default options
var options = {
    hide_info: false,
    hide_github_fork: false,
    hide_command_count: false,
    hide_gist_details: false,
    hide_css_details: false,
    hide_toc: false,
    disable_hide: false,
    parameters_disallowed: ''
};

// set defaults for param which holds list of URL parameters
var param = {
    header: 'h1',
    heading: 'h2',
    fontsize: 100,
    gist: 'default',
    gist_filename: '',
    css: 'default',
    cssfilename: '',
    preprocess: false
};

// key is name, value is gist id
var example_gist = {};
var example_css = {};

jQuery(document).ready(function() {
    
    main();
    
    // Starting point
    function main() {
        // Start by loading README.md file to get options and potentially content
        $.ajax({
            url : "README.md",
            dataType: "text",
            success : function (data) {
                // README.md successfully pulled, grab examples from it
                pull_options(data);
                extract_parameters( param );
                var gist = param['gist'];
                if ( !gist || gist === 'default' ) {
                    param['gist'] === 'default';
                    load_css(data);
                } else {
                    load_gist(param['gist']);
                }
            }
        });
    }
    
    // Start content rendering process
    function su_render(data) {
        render_info();
        register_events();
        
        // hide selectors at start
        $('#info .selector').hide();
    }
    
    function render_sections() {
        
        // header section
        var header = param['header'];
        var heading = param['heading'];
        if ( $('#wrapper ' + header).length ) {
            $('#wrapper ' + header).each(function() {
                var name = css_name( $(this).text() );
                $(this).wrapInner('<a class="handle" name="' + name + '"/>');
                $(this).nextUntil(heading).andSelf().wrapAll('<div class="section header" id="' + name + '"/>');
                $(this).nextUntil(heading).wrapAll('<div class="content"/>');
            });
        } else {
            //no header, so we'll add an empty one
            $('#wrapper').prepend('<div class="header"></div>');
        }
        
        // create sections
        $('#wrapper ' + heading).each(function() {
            var name = css_name( $(this).text() );
            $(this).wrapInner('<a class="handle" name="' + name + '" href="#' + name + '"/>');
            $(this).nextUntil(heading).andSelf().wrapAll('<div class="section" id="' + name + '"/>');
            $(this).nextUntil(heading).wrapAll('<div class="content"/>');
        });
        
        // add relevant classes to section headings
        $('.section ' + heading).addClass('heading');
        
        // add choice class to section li links
        $('.content a[href*="#"]').addClass('choice');
    }
    
    function section_change() {
        jump_to_hash();
        update_toc();
    }
    
    function get_current_section_id() {
        return $('.section.current').attr('id');
    }
    
    function jump_to_hash() {
        
        // remove Back button if it exists
        $('#back').clone().attr('id', 'back-animation').appendTo('.section.current').fadeOut(500, function() {
            $(this).remove();
        });
        $('#back').remove();
        
        var title = '';
        var hash = location.hash;
        var header_hash = '#' + $('.section.header').attr('id');
        if( hash && $(hash).length > 0 && hash != header_hash ) {
            // go to location
            $('.section.current').addClass('old').removeClass('current');
            $('.section' + hash).removeClass('old').addClass('current');
            title = $('.section.header a.handle').text();
            title += ' - ' + $('.section.current a.handle').text();
            
            // render Back button
            $('.section.current').append('<a id="back">Back</a>');
            $( "#back" ).click(function() {
                window.history.back();
            });
        } else {
            $('.section.current').addClass('old').removeClass('current');
            $('.section.header').removeClass('old').addClass('current');
            title = $('.section.header a.handle').text();
            $('#back').remove();
        }
        
        // update window title
        document.title = title;
        var current = get_current_section_id();
        
        // update browser variable with progress
        if ( progress.indexOf(current) === -1 ) progress.push(current);
        window.localStorage.setItem( 'entwine_progress', progress.join(",") );
        
    }
    
    function update_toc() {
        var html = '';
        var class_html = '">';
        // iterate section classes and get id name to compose TOC
        for ( var i = 0; i < progress.length; i++ ) {
            var name = progress[i];
            if ( progress[i] === get_current_section_id() ) {
                class_html = '" class="current">';
            } else class_html = '">';
            html += '<a href="#' + name + class_html;
            html += $('.section#' + progress[i] + ' a.handle').text();
            html += '</a>';
        }
        $('#toc').html( html );
    }
    
    function register_events() {
        
        // handle history
        $(window).on('popstate', function (e) {
            section_change();
        });
    }

});
