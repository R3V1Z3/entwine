/* global jQuery, $ */
jQuery(document).ready(function() {
    
    var toggle_html='<span class="toggle"></span>';

    // attach the plugin to an element
    $('#wrapper').gitdown( {    'title': 'Entwine',
                                'content': 'README.md',
                                'callback': main
    } );
    var $gd = $('#wrapper').data('gitdown');

    function main() {
        
        // setup progress variable
        var progress = [];
        if ( window.location.hash ) {
            if ( window.localStorage.getItem('entwine_progress') != null) {
                progress = window.localStorage.getItem('entwine_progress').split(',');
            }
        }
        window.localStorage.setItem('entwine_progress', '');
        
        // add choice class to section li links
        $('.section .content a[href*="#"]').addClass('choice');
        
        // configure 
        // get section names and set them in plugin
        // $gd.set_sections(s)
        
        update_toc();
        register_events();
    }
    
    function update_toc() {
        
        // add toggle buttons to sections
        if ( $('.section .toggle').length < 1 ) {
            $('.section a.handle').each(function() {
                var t = $(this).html();
                $(this).html( t + toggle_html );
            });
        }
        
        // add toggle buttons to toc
        $( '.info .toc a' ).each(function() {
            var t = $(this).html();
            $(this).html( t + toggle_html );
            var name = $(this).attr('name');
            // hide toc links for hidden sections
            if ( $('#' + name).is(':hidden') ){
                $(this).addClass('hidden');
            } else $(this).removeClass('hidden');
        });
    }
    
    function register_events() {
        
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