function Canvas($canvas) {

    // should we check for url parameters within the canvas itself?
    // seems helpful, the MODE can easily be handled this way:
    // - DEBUG MODE
    // - LIVE MODE
    // add option when instantiating canvas to allow access to url parameters
    function getQueryVars() {
        // from here: http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
        function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
        }
        var url = getURLParameter('url');
        if (!url) url = 'https://soundcloud.com/ugotsta/those-are-not-goblins';
        var text = getURLParameter('text');
        if (!text) text = '';
    }
    
    // replce with interact.js
    // code used from: http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
    //
    // handles Touch functionality
    function touchHandler(event) {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";

        switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
        }
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0 /*left*/ , null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }

    // initialization of the Touch events
    function touchInit() {
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);
    }
    
    // initialize Touch events
    touchInit();

    // declare Debug object
    function Debug() {
        // add the debug console div to the canvas
        $canvas.append('<div id="debug"><p>Debug console.</p></div>');
        var $debug = $('#debug');

        // method to easily write messages to debug console
        this.log = function(string) {
            // add the new content
            $debug.append(string);
            // scroll to bottom of terminal
            $debug.scrollTop($debug[0].scrollHeight);
        },
        this.hide = function() {
            $debug.hide();
        },
        this.show = function() {
            $debug.show();
        };
    }

    // add some background for the grid
    $canvas.append('<div class="canvas-background"></div>');

    // add tooltip effect
    $canvas.tooltip({
        track: true,
        hide: false
    });

    // keep context-menu from popping up
    $canvas.bind("contextmenu", function(e) {
        return false;
    });

    // STARTUP PROCESS
    //
    // this whole process will be fully customizable in a way that allows for
    // users to load the software without the debug console, toolbox or other
    // components, in order so that the software can be included as a fully
    // configurable application within a web page
    //
    // the software can run as a widget of sorts within any web page,
    // where the startup process loads a specific canvas setup:
    //    ex: 1. the software loads as a web-based voting/polling form
    //        2. it loads as a theme building software
    //        3. it loads as an inform map editor
    //
    //  this all depends on the startup process and how the canvas is
    //  instantiated
    //
    // create debug console
    this.debug = new Debug();
    // create toolbox
    this.toolbox = new Toolbox();

    // modules_list holds all the modules that belong to the toolbox
    this.modules_list = [];
    // modules holds all the modules that have been added to the canvas
    this.modules = [];

    function Toolbox() {
        // add the toolbox div to the canvas
        $canvas.append('<div id="toolbox"><div class="toolbox-title"><h2>Toolbox</h2></div></div>');
        var $toolbox = $('#toolbox');
        // make toolbox draggable
        $toolbox.draggable({
            handle: ".toolbox-title"
        });
        // make toolbox resizable
        $toolbox.resizable();
        // here we'll need to go through all the available_modules array
        // and create one of each in the toolbox
        $toolbox.append('<div class="modules-list"></div>');
        this.modules_list = getModulesList();
        this.modules_list.forEach(function(element, index, array) {
            // we'll need to adjust this so that it creates a toolbox version of
            // modules: ui-toolbox class added
            $('.modules-list').append(element);
        });
        
        // make toolbox modules draggable
        $('.module').draggable({
            helper: 'clone',
            opacity: 0.75,
            cursor: 'move',
            revert: "invalid",
            scroll: true
        });
    }

    function getModulesList() {
        var list = [];
        var module_code = {
            name: 'Note',
            html: '<textarea class="mod-textarea" disabled>Note</textarea></div></div>',
            onCreation: ''
        };
        //list.push(module_code);
        list.push('<div class="module module-note ui-toolbox" title="Note"><div class="module-canvas"><textarea class="mod-textarea" disabled>Note</textarea></div></div>');
        list.push('<div class="module module-number ui-toolbox" title="Number"><div class="module-canvas"><input class="number" name="number" value="0" size="4" disabled/></div><div class="module-output" title="Output"></div></div>');
        list.push('<div class="module module-addition ui-toolbox" title="Addition"><div class="module-input" title="Input to add"></div><div class="module-input" title="Input to add"></div><div class="module-canvas"><h3>+</h3></div><div class="module-output" title="Output of addition operation"></div></div>');
        list.push('<div class="module module-readout ui-toolbox" title="Readout"><div class="module-input" title="Input to display"></div><div class="module-canvas">Readout</div></div>');
        return list;
    }

    // declare Module object
    // top and left are optional, if not provided, ui-toolbox class will be assumed?
    function Module($container, type, top, left) {
        // add div to specified container
        var $module = $('<div class="module ui-toolbox></div>');
        $container.prepend($module);
        
    }

    // declare Input object
    function Input() {

    }

    // declare Input object
    function Output() {

    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.floor(Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
    }

    function calculateAngle(x1, y1, x2, y2) {
        return (Math.atan2(y2 - y1, x2 - x1)) * 180 / Math.PI;
    }

    // simple helper function for cross-browser rotations
    function css_rotate($object, angle) {
        $object.css('-moz-transform', 'rotate(' + angle + 'deg)');
        $object.css('-moz-transform-origin', '0% 40%');
        $object.css('-webkit-transform', 'rotate(' + angle + 'deg)');
        $object.css('-webkit-transform-origin', '0% 40%');
        $object.css('-o-transform', 'rotate(' + angle + 'deg)');
        $object.css('-o-transform-origin', '0% 40%');
        $object.css('-ms-transform', 'rotate(' + angle + 'deg)');
        $object.css('-ms-transform-origin', '0% 40%');
    }

    // find and return the id of the node that connects output_id
    function find_node_output(output_id) {
        // get all nodes
        var $nodes = $('.node');
        var id = 0;
        $nodes.each(function(index) {
            var input_id = $(this).data("node").from;
            if (input_id === output_id) {
                id = $(this).attr('id');
            }
        });
        return id;
    }

    // function to update appearance of node
    function update_node($node, x1, y1, x2, y2) {
        var height = 6 + "px";
        var width = calculateDistance(x1, y1, x2, y2) + "px";
        $node.css({
            top: y1,
            left: x1,
            height: height,
            width: width
        });
        css_rotate($node, calculateAngle(x1, y1, x2, y2));
    }

    function createModule($target) {
        // get target
        var $new = $target.clone();
        // generate uniqute id for target
        $new.uniqueId();
        // store that unique id for later use
        var id = $new.attr('id');
        //generate unique id for all children
        $new.children().uniqueId();
        // get offset so it places well when dropped
        var $offset = $target.offset();
        // add it to canvas
        $canvas.append($new);
        // adjust position with offset
        $new.css({
            top: $offset.top,
            left: $offset.left,
            opacity: 1
        });
        // remove all toolbox based classes
        $new.removeClass('ui-draggable ui-draggable-dragging ui-toolbox');
        // make it draggable
        $new.draggable({
            drag: function(event, ui) {
                // create array of all output modules within parent module
                var $outputs = $(this).find(".module-output");
                // iterate through them
                if ($outputs.length > 0) {
                    $outputs.each(function(index) {
                        // var $output = $(this);
                        // var node_id = $(this).data("node").node_id;
                        // var out_to = $(this).data("node").to;
                        // store id for this output
                        var output_id = $(this).attr('id');

                        // we could simply store node ids in output data

                        // this is far preferred for speed purposes
                        // with many objects onscreen, all calling functions,
                        //     dragging will incur a heavy payload

                        // get node that contains this id
                        var node_id = find_node_output(output_id);
                        //debug.log(node_id);
                        if (node_id !== 0) {
                            // node found, lets adjust it
                            var $node = $('#' + node_id);
                            var position = $('#' + $node.data("node").from).offset();
                            var x1 = position.left;
                            var y1 = position.top;

                            position = $('#' + $node.data("node").to).offset();
                            var x2 = position.left;
                            var y2 = position.top;

                            update_node($node, x1, y1, x2, y2);
                        }
                    });
                }
            }
        });
        //make outputs draggable
        $('#' + id + ' .module-output').draggable({
            helper: 'clone',
            //cursor: 'move',
            revertDuration: 0,
            start: function(event, ui) {
                // create the temporary node_drag div
                $canvas.append('<div class="node-drag"></div>');
                // store event.target for use later
                $target = $(event.target);
                // give the output some highlight color
                $(this).css({
                    'background-color': 'red'
                });
                // select the node_drag div
                var $node_drag = $('.node-drag');
                // center the node_drag div in the output
                $node_drag.css({
                    top: event.pageY - $target.height() + 4,
                    left: event.pageX - $target.width() + 4
                });
                // add this output's id to the node's data
                $node_drag.data("from", {
                    parent: $(event.target).attr('id')
                });
            },
            drag: function(event, ui) {
                var $node_drag = $('.node-drag');
                var x1 = $(this).offset().left;
                var y1 = $(this).offset().top;
                var x2 = event.pageX;
                var y2 = event.pageY;

                update_node($node_drag, x1, y1, x2, y2);
            },
            revert: function($droppable) {
                $(this).css({
                    'background-color': '#fff'
                });
                if ($droppable === false) {
                    $('.node-drag').remove();
                    return true;
                }
                else {
                    // we can access attributes with droppable.attr('id')
                    if ($droppable.hasClass('module-input')) {
                        $(this).css({
                            'background-color': '#00f'
                        });
                    }
                    return false;
                }
            }
        });
        // make inputs droppable
        $('#' + id + ' .module-input').droppable({
            accept: '.module-output',
            drop: function(event, ui) {
                var $node_drag = $('.node-drag');
                var $added = $node_drag.clone();
                $canvas.append($added);
                $added.removeClass('node-drag');
                $added.addClass('node');
                // give the node a uniqueId
                $added.uniqueId();
                // clone() doesn't appear to maintain all css, so lets adjust
                $added.css({
                    position: 'absolute',
                    top: $node_drag.position.top,
                    left: $node_drag.position.left
                });
                // add some data to the node
                $added.data("node", {
                    from: $node_drag.data("from").parent,
                    to: $(event.target).attr('id')
                });
                //$(ui.draggable) holds draggable target
                $added.css({
                    'background-color': '#00f'
                });
                // remove the node-drag div
                $node_drag.remove();
                $(this).css({
                    'background-color': '#00f'
                });
            }
        });
        // NOTE MODULE
        if ($new.hasClass('module-note')) {
            $new.resizable({
                alsoResize: '#' + id + ' .mod-textarea'
            });
            $new.find('.mod-textarea').prop("disabled", false);
        }
        else if ($new.hasClass('module-number')) {
            // NUMBER MODULE  
        }
    }

    // handle mouse events on canvas
    $canvas.mousedown(function(event) {
        switch (event.which) {
            // right-mouse
        case 1:
            break;
            // middle-mouse
        case 2:
            alert('Middle mouse pressed!');
            break;
            // right-mouse
        case 3:
            $('#toolbox').css({
                top: event.pageY,
                left: event.pageX
            });
            break;
        }
    });

    // make the canvas a drop target
    $canvas.droppable({
        accept: '.module',
        drop: function(event, ui) {
            var $target = ui.helper;
            if ($target.hasClass('ui-toolbox')) {
                createModule($target);
            }
        }
    });

}