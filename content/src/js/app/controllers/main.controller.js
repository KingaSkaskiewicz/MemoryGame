app.controller('mainCtrl', function ($scope, $interval, $timeout) {

    $scope.model = {};

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    var checkTime = function (i) {
        if (i < 10) { i = "0" + i };
        return i;
    }

    var checkTimeMs = function (i) {
        if (i < 10) {
            i = "00" + i;
        } else if (i < 100 && i >= 10) {
            i = "0" + i;
        }
        return i;
    }


    $scope.model.stoper = {
        aktualnyCzas: "00:00:00:000",
        aktualnyCzasHelper: null,
        dodatkowyCzas: 0,
        isStopped: true,
        h: "00", 
        m: "00",
        s: "00",
        ms: "000",
        resetujCzas: function () {
            this.aktualnyCzasHelper = new Date();
            this.aktualnyCzas = "00:00:00:000";
        },
        rozpocznijCzas: function () {
            this.aktualnyCzasHelper = new Date();
            this.isStopped = false;

            var tiknijCzas = function () {

                if ($scope.model.stoper.isStopped) {
                    return;
                }

                var ileTikowDateTimeMinelo = (new Date() - $scope.model.stoper.aktualnyCzasHelper) + $scope.model.stoper.dodatkowyCzas;
                var roznica = new Date(ileTikowDateTimeMinelo).addHours(-1);

                $scope.model.stoper.h = roznica.getHours();
                $scope.model.stoper.m = roznica.getMinutes();
                $scope.model.stoper.s = roznica.getSeconds();
                $scope.model.stoper.ms = roznica.getMilliseconds();
                $scope.model.stoper.h = checkTime($scope.model.stoper.h);
                $scope.model.stoper.m = checkTime($scope.model.stoper.m);
                $scope.model.stoper.s = checkTime($scope.model.stoper.s);
                $scope.model.stoper.ms = checkTimeMs($scope.model.stoper.ms);


                $scope.model.stoper.aktualnyCzas = $scope.model.stoper.h + ":" + $scope.model.stoper.m + ":" + $scope.model.stoper.s + ":" + $scope.model.stoper.ms;
            }

            $interval(tiknijCzas, 20);
        },
        stopCzas: function () {
            this.isStopped = true;
        },
        zapauzujCzas: function () {
            this.isStopped = true;
            this.dodatkowyCzas += new Date() - this.aktualnyCzasHelper;
        }

    }

    $scope.model.game = {
        isGameCompleted: false,
        isPreView: false,
        gamePending: false,
        lastTileClicked: null,
        resetGame: function () {
            this.isGameCompleted = false;
            this.startGame();
        },
        startGame: function () {
            this.isPreView = true;

            shuffle(this.tilesArray);

            for (var i = 0; i < this.tilesArray.length; i++) {
                this.tilesArray[i].isOpened = true;
            }
            $timeout(function () {
                for (var i = 0; i < $scope.model.game.tilesArray.length; i++) {
                    $scope.model.game.tilesArray[i].isOpened = false;
                }
                $scope.model.game.isPreView = false;
                $scope.model.stoper.rozpocznijCzas();
                $scope.model.stoper.resetujCzas();
            }, 3500)

        },
        tilesArray: [
            { type: 'a', isOpened: false, iconClass: 'fa-smile' },
            { type: 'a', isOpened: false, iconClass: 'fa-smile' },
            { type: 'b', isOpened: false, iconClass: 'fa-battery-half' },
            { type: 'b', isOpened: false, iconClass: 'fa-battery-half' },
            { type: 'c', isOpened: false, iconClass: 'fa-apple-alt' },
            { type: 'c', isOpened: false, iconClass: 'fa-apple-alt' },
            { type: 'd', isOpened: false, iconClass: 'fa-archway' },
            { type: 'd', isOpened: false, iconClass: 'fa-archway' },
            { type: 'e', isOpened: false, iconClass: 'fa-anchor' },
            { type: 'e', isOpened: false, iconClass: 'fa-anchor' },
            { type: 'f', isOpened: false, iconClass: 'fa-bell' },
            { type: 'f', isOpened: false, iconClass: 'fa-bell' },
            { type: 'e', isOpened: false, iconClass: 'fa-ice-cream' },
            { type: 'e', isOpened: false, iconClass: 'fa-ice-cream' },
            { type: 'f', isOpened: false, iconClass: 'fa-kiwi-bird' },
            { type: 'f', isOpened: false, iconClass: 'fa-kiwi-bird' }
        ],
        onTileClicked: function (position) {
            if (this.isPreView || !this.gamePending || this.tilesArray[position].isOpened) {
                return;
            }

            this.tilesArray[position].isOpened = true;

            this.isGameCompleted = true;
            for (var i = 0; i < this.tilesArray.length; i++) {
                if (!this.tilesArray[i].isOpened) {
                    this.isGameCompleted = false;
                    break;
                }
            }
            if (this.isGameCompleted) {
                $scope.model.stoper.stopCzas();
                return;

            }


            if (this.lastTileClicked === null) {
                this.lastTileClicked = this.tilesArray[position];
            } else {
                if (this.tilesArray[position].type === this.lastTileClicked.type) {
                    this.tilesArray[position].isOpened = true;
                    this.lastTileClicked = null;
                } else {
                    var lastTimeCLickedHelper = this.lastTileClicked;
                    this.lastTileClicked = null;

                    $timeout(function () {
                        $scope.model.game.tilesArray[position].isOpened = false;
                        lastTimeCLickedHelper.isOpened = false;
                    }, 1000);

                }
            }
        }

    }
   

    


    $scope.onStartButtonClicked = function () {
        $scope.model.game.gamePending = true;

        $scope.model.game.startGame();



        



    }
});