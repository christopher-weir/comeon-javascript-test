/* !
 * jQuery lightweight plugin boilerplate
 * URL: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 * author: @christopher-weir
 */
// eslint-disable-next-line no-unused-vars
( function ( $, window, document ) {

    var Plugin;
    var pluginName = 'loginForm';
    var defaults = {};


    /**
     * validate the form inputs here
     * @method validateInputs
     * @param  {object}       _form - form data
     */
    var validateInputs = function( _form ) {
        return new Promise( function( resolve, reject ) {
            var key;

            // if any of the inputs are empty
            // reject and throw error
            for ( key in _form ) {
                if ( _form.hasOwnProperty( key ) && _form[key].length === 0 ) {
                    return reject( {
                        error: key + ' is empty'
                    } );
                }
            }

            resolve( _form );
        } );
    };


    /**
     * Mock post the login data
     * @method postData
     * @param  {object} _form - the form data
     */
    var postData = function( _form ) {
        return new Promise( function( resolve ) {
            $.ajax( {
                url: '/login',
                type: 'POST',
                data: {
                    username: _form.username,
                    password: _form.password
                }
            } )
            .done( resolve );
        } );

    };


    /**
     * Validate the response and either throw an error or set the user
     * @method validateResponse
     * @param  {object}         _d - the received data
     */
    var validateResponse = function( _d ) {
        return new Promise( function( resolve, reject ) {
            console.log( _d );
            if( _d.status === 'success' ) {
                return resolve( _d );
            }

            reject( _d );

        } );
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

        // super basic form validation
        $( _this.element ).find( 'form' ).submit( function( e ) {

            e.preventDefault();
            _this.validateForm( {
                username: $( this ).find( 'input[name="username"]' ).val(),
                password: $( this ).find( 'input[name="password"]' ).val()
            } );
        } );
    };


    /**
     * Form validation flow
     * @method validateForm
     * @param  {object}     _form - the form data
     */
    Plugin.prototype.validateForm = function( _form ) {

        var _this = this;

        validateInputs( _form )
            .then( postData )
            .then( validateResponse )
            .then( function( _d ) {
                _d.player.username = _form.username;
                _this.submit( _d );
            } )
            .catch( function( _e ) {
                window.alert( _e.error );
            } );
    };


    /**
     * Handle submit success
     * @method submit
     * @param  {object} _d - the post response
     */
    Plugin.prototype.submit = function( _d ) {
        $( this.element ).hide();
        this.options.onSubmit( _d.player );
    };


    /**
     * Reset the form
     * @method reset
     */
    Plugin.prototype.reset = function( ) {
        $( this.element ).find( 'input[name="username"]' ).val( '' );
        $( this.element ).find( 'input[name="password"]' ).val( '' );
        $( this.element ).show();
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
