$( document ).ready( function() {

    var app = {

        userDetails: {},


        /**
         * handle logging out of a player
         * reset userDetails and reset the form
         * @method logout
         */
        logout: function() {
            this.userDetails = {};
            $( '.login' ).loginForm( 'reset' );
        },


        /**
         * Open a game
         * @method openGame
         * @param  {object} _game - the game data to call
         */
        openGame: function( _game ) {
            $( '.ingame' ).game( 'openGame', _game );
        },


        /**
         * reload the cas, it has already been initiated
         * so in this case fade it back in
         * @method reloadCasino
         * @param  {object}     _player - TODO: handle relogin with new player
         */
        reloadCasino: function( _player ) {
            $( '.casino' ).casino( 'reInit', _player );
        },


        /**
         * Init the casino view and plugin
         * @method initCasino
         */
        initCasino: function() {
            var _this = this;

            // init the game plugin
            $( '.ingame' ).game( {
                close: _this.reloadCasino
            } );

            // init the casino plugin
            $( '.casino' ).casino( {
                userDetails: _this.userDetails,
                openGame: _this.openGame,
                logout: _this.logout
            } );
        },

        /**
         * Init the app
         * @method init
         */
        init: function() {
            var _this = this;

            $( '.login' ).loginForm( {

                onSubmit: function( _player ) {
                    _this.userDetails = _player;
                    _this.initCasino();
                }
            } );
        }
    };

    app.init();
} );
