/* global jQuery, $ */
jQuery(document).ready(function() {
    
    var toggle_html='<span class="toggle"></span>';

    // attach the plugin to an element
    $('#wrapper').gitdown( {    'title': 'Entwine',
                                'content': 'README.md',
                                'callback': main
    } );
    var $gd = $('#wrapper').data('gitdown');
    
    // setup progress variable
    var progress = [];
    if ( window.location.hash ) {
        if ( window.localStorage.getItem('entwine_progress') != null) {
            progress = window.localStorage.getItem('entwine_progress').split(',');
        }
    }
    window.localStorage.setItem('entwine_progress', '');

    function main() {
        
        // add choice class to section li links
        $('.section .content a[href*="#"]').addClass('choice');
        
        register_events();
        update();
    }
    
    function update() {
        var current = $('.section.current a.handle').text();
        // update window title
        document.title = current;
        
        // update browser variable with progress
        if ( progress.indexOf(current) === -1 ) progress.push(current);
        window.localStorage.setItem( 'entwine_progress', progress.join(",") );
        
        // hide all toc links
        $('.toc a').hide();
        
        // now show only those that user has progressed through
        for ( var i = 0; i < progress.length; i++ ) {
            var name = $gd.clean_name(progress[i]);
            $('a[href^="#' + name + '"]').show();
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

});