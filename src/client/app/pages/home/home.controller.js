kdApp.controller('home.controller', function($scope, baseService)
{
   $scope.header = 'Welcome home!';
   baseService.GET('/data/site.data.json','?v1').then( function(res){
      eventService.events = res.data.events;
      $scope.events = eventService.events;
      console.log($scope);
   });
});