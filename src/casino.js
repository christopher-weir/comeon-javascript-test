/* !
 * jQuery lightweight plugin boilerplate
 * URL: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 * author: @christopher-weir
 */
// eslint-disable-next-line no-unused-vars
( function ( $, window, document ) {

    var Plugin;
    var pluginName = 'casino';
    var defaults = {
    };

    /**
     * Log out the current player
     * @method logout
     * @param  {object} _user
     */
    var logout = function( _player ) {

        return new Promise( function( resolve ) {
            $.ajax( {
                url: '/logout',
                type: 'POST',
                data: {
                    username: _player.username
                }
            } )
            .done( resolve );
        } );
    };


    /**
     * Ajax call the cats and return a promise
     * @method getCategories
     */
    var getCategories = function( ) {
        return new Promise( function( resolve ) {
            $.ajax( {
                url: '/categories',
                type: 'GET'
            } )
            .done( resolve );
        } );
    };


    /**
     * Set the cats in the dom
     * @method setCategories
     * @param  {object}      _elm  - The jq elm
     * @param  {object}      _data - the cat data
     */
    var setCategories = function( _elm, _data ) {

        $( _elm ).find( '.category .item' ).hide();

        $.each( _data, function ( key, value ) {
            var $cat = $( _elm ).find( '.category .item' ).first().clone();

            $cat.find( '.header' ).text( value.name );
            $cat.show();
            $( _elm ).find( '.category.items' ).append( $cat );
        } );

        // remove the template html
        $( _elm ).find( '.category .item' ).first().remove();
    };


    /**
     * Ajax call the games and return a promise
     * @method getGames
     */
    var getGames = function( ) {
        return new Promise( function( resolve ) {
            $.ajax( {
                url: '/games',
                type: 'GET'
            } )
            .done( resolve );
        } );
    };


    /**
     * Set the games in the dom
     * @method setCategories
     * @param  {object}      _elm  - The jq elm
     * @param  {object}      _data - the games data
     */
    var setGames = function( _elm, _data ) {

        $( _elm ).find( '.game.items .item' ).hide();

        $.each( _data, function ( key, value ) {
            var $game = $( _elm ).find( '.game.items .item' ).first().clone();

            $game.find( 'img' ).attr( 'src', value.icon );
            $game.find( '.name' ).text( value.name );
            $game.find( '.play' ).attr( 'data-code', value.code );
            $game.find( '.description' ).text( value.description );
            $game.show();
            $( _elm ).find( '.game.items' ).append( $game );
        } );

        // remove the template html
        $( _elm ).find( '.game.items .item' ).first().remove();
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

        $( _this.element ).show();
        _this.setPlayer( _this.options.userDetails );
        _this.initCategories();
        _this.initGames();
        _this.initFilter();

        $( 'body' ).on( 'click', '.logout', function() {
            _this.logout();
        } );
    };


    /**
     * reset the casino state
     * @method reset
     * @param  {object} _player - new player data
     */
    Plugin.prototype.reset = function( _player ) {
        var _this = this;

        $( _this.element ).show();

        if( _player ) {
            _this.options.userDetails = _player;
            _this.setPlayer( _player );
        }
    };


    /**
     * Set/update the players details in the info box
     * @method setPlayer
     * @param  {Object}  _player - player data
     */
    Plugin.prototype.setPlayer = function( _player ) {
        var _this = this;
        $( _this.element ).find( '.player .avatar' ).attr( 'src', _player.avatar );
        $( _this.element ).find( '.player .content .name' ).text( _player.name );
        $( _this.element ).find( '.player .content .event' ).text( _player.event );
    };


    // init the cats
    Plugin.prototype.initCategories = function( ) {
        var _this = this;

        getCategories()
            .then( function( _d ) {
                setCategories( _this.element, _d );
            } );
    };


    // init the games
    Plugin.prototype.initGames = function( ) {
        var _this = this;

        getGames()
            .then( function( _d ) {

                setGames( _this.element, _d );

                $( 'body' ).on( 'click', '.game.items .item .play', function() {
                    _this.openGame( {
                        code: $( this ).data( 'code' )
                    } );
                } );
            } );
    };


    // Open a game
    Plugin.prototype.openGame = function( _game ) {
        $( this.element ).hide();
        this.options.openGame( _game );
    };


    /**
     * Handle the user logout press,
     * keep this public incase you need to use this somewhere else
     * @method logout
     */
    Plugin.prototype.logout = function() {
        var _this = this;

        logout( _this.options.userDetails )
            .then( function( _d ) {
                if( _d.status === 'success' ) {
                    $( _this.element ).hide();
                    _this.options.logout();
                    return false;
                }
                window.alert( 'there was an error' );
            } );
    };


    /**
     * initialise the filter on the search box
     * @method initFilter
     */
    Plugin.prototype.initFilter = function( ) {

        var _this = this;
        var elm = $( _this.element );

        elm.find( '.search input' ).keyup( function() {

            // get the current search input
            var query = $( this ).val();

            // loop through the list of games
            elm.find( '.game.items .item' ).each( function() {

                // store game text
                var text = $( this ).find( '.name' ).text().toLowerCase();

                // if the query is in the text show it, otherwise hide
                return ( text.indexOf( query ) === 0 ) ? $( this ).show() : $( this ).hide();
            } );
        } );
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
