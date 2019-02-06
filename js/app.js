var gDriveApp = angular.module('gDriveApp', []);

gDriveApp.factory('gdocs', function () {
  var gdocs = new GDocs();
  return gdocs;
});

function DocsController($scope, $http, gdocs) {

  function modifyDOM() {
    var keywords=[];
  //  console.log(document.body);
    var foundKeywords = document.getElementsByClassName("feedback");
    for(i=0; i<foundKeywords.length; i++){
      console.log(foundKeywords[i]);
      keywords.push(foundKeywords[i].innerText);
    }
    console.log("foundKeywords: ", foundKeywords);
    return keywords;
  }
  
  chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
      //Here we have just the innerHTML and not DOM structure
      console.log('Popup script:')
      console.log("output: ", results);

      $http({
        method: 'GET',
        params: {
          'alt': 'media'
        },
        url: "../source/TripDecisionFlowchart.json"
      }).then(function (data) {
        $scope.keywordDefinitions = data.data;
        // var wb = XLSX.read(data.data, {type:"binary"});
        // $scope.keywordDefinitions = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    
        // $scope.$apply(function ($scope) {}); // Inform angular we made changes.
      }, function (data, status, headers, config) {});
    

    });
  


  //   $scope.readDoc = function(retry){

  //     if (gdocs.accessToken) {
  //       var config = {
  //         headers: {
  //           'Authorization': 'Bearer ' + gdocs.accessToken
  //         }, 
  //         params: {'alt': 'json'},

  //         responseType: 'arraybuffer'
  //       };
  //     //  https://drive.google.com/file/d/1rC2wuTJvvaD6G_cwKOblVx8uS9V-rKmc/view?usp=sharing
  //     //  https://drive.google.com/open?id=1rC2wuTJvvaD6G_cwKOblVx8uS9V-rKmc

  //     // https://drive.google.com/uc?export=download&id=1rC2wuTJvvaD6G_cwKOblVx8uS9V-rKmc

  //     // https://drive.google.com/open?id=1U4IXs4toqEdp_YmIP1XYC39LUgUQWbdd
  //       $http({
  //         method:'GET',
  //         headers: {
  //           'Authorization': 'Bearer ' + gdocs.accessToken
  //         }, 
  //         params: {'alt': 'media'},
  //         url:'https://drive.google.com/uc?export=download&id=1U4IXs4toqEdp_YmIP1XYC39LUgUQWbdd'
  //        // url:"https://drive.google.com/corp/drive/u/0/my-drive/codebeautify.json"
  //       }).then(function(data) {
  //         console.log(data);
  //         $scope.keywordDefinitions = data.data;  

  //         // var wb = XLSX.read(data.data, {type:"binary"});
  //         // $scope.keywordDefinitions = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  //         console.log($scope.keywordDefinitions);
  //         $scope.$apply(function($scope) {}); // Inform angular we made changes.
  //       }, function(data, status, headers, config) {
  //         if (status == 401 && retry) {
  //           gdocs.removeCachedAuthToken(
  //               gdocs.auth.bind(gdocs, true, 
  //                   $scope.fetchDocs.bind($scope, false)));
  //         }
  //       });


  //       // https://docs.google.com/spreadsheets/d/17b64oQTRkn5O7FraNbOPhQkgVoa6EqNGPXzEZZxA8jo/edit?ts=5c51757b#gid=0

  //       $http.get("https://spreadsheets.google.com/feeds/list/17b64oQTRkn5O7FraNbOPhQkgVoa6EqNGPXzEZZxA8jo/od6/public/values?alt=json", config).
  //       success((resp) => {
  //         console.log(resp);

  //       }).
  //       error(function(data, status, headers, config) {
  //       });
  //     }
  //   }

  // Toggles the authorization state.
  $scope.toggleAuth = function (interactive) {
    if (!gdocs.accessToken) {
      gdocs.auth(interactive, function () {
      //  $scope.readDoc(false);
      });
    } else {
      gdocs.revokeAuthToken(function () {});
    }
  }

  // Controls the label of the authorize/deauthorize button.
  $scope.authButtonLabel = function () {
    if (gdocs.accessToken)
      return 'Deauthorize';
    else
      return 'Authorize';
  }

  $scope.toggleAuth(true);
}

DocsController.$inject = ['$scope', '$http', 'gdocs']; // For code minifiers.

// Init setup and attach event listeners.
document.addEventListener('DOMContentLoaded', function (e) {
  var closeButton = document.querySelector('#close-button');
  closeButton.addEventListener('click', function (e) {
    window.close();
  });
});

