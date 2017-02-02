/* !
 * jQuery lightweight plugin boilerplate
 * URL: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 * author: @christopher-weir
 */
// eslint-disable-next-line no-unused-vars
( function ( $, window, document ) {

    var Plugin;
    var pluginName = 'game';
    var defaults = {
    };


    // The actual plugin constructor
    Plugin = function ( element, options ) {
        var _this = this;
        _this.element = element;
        _this.options = $.extend( {}, defaults, options );

        _this._defaults = defaults;
        _this._name = pluginName;

        _this.init();
    };


    Plugin.prototype = {};


    /**
     * Set the initial plugin state
     * @method init
     */
    Plugin.prototype.init = function() {
        var _this = this;
        console.log( 'init' );


        $( _this.element ).find( '.button' ).on( 'click', function() {
            _this.close();
        } );
    };


    /**
     * open a game
     * @method openGame
     * @param  {object} _game - the game to open
     */
    Plugin.prototype.openGame = function( _game ) {
        $( this.element ).show();
        comeon.game.launch( _game.code );
    };


    /**
     * close the game state
     * @method close
     */
    Plugin.prototype.close = function() {
        $( this.element ).hide();
        // TODO: there was no comeon.game.(close?) method?
        this.options.close();
    };


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options, args ) {
        return this.each( function () {

            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName,
                new Plugin( this, options ) );
                return false;
            }
            // if instance already created call method
            if( typeof options === 'string' ) {
                $.data( this, 'plugin_' + pluginName )[options]( args );
            }
        } );
    };

} )( jQuery, window, document );
