/* global angular */
'use strict'

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  var seconds = sec_num - (hours * 3600) - (minutes * 60)

  if (hours < 10) {hours = '0' + hours;}
  if (minutes < 10) {minutes = '0' + minutes;}
  if (seconds < 10) {seconds = '0' + seconds;}
  var time = hours + ':' + minutes + ':' + seconds
  return time
}

angular.module('youScriberApp').controller('CommentsCtrl', function ($scope, $window, $stateParams, $location, $rootScope, Videos, User) {
  $scope.videosService = Videos
}).filter('timefilter', function () {
  return function (input) {
    if (Array.isArray(input)) {
      input.sort(function (a, b) { return a.time - b.time })
    }
    return input
  }
}).filter('secondsfilter', function () {
  return function (input) {
    if (input) {
      input = input.toString()
      return input.toHHMMSS()
    }
    return input
  }
})
