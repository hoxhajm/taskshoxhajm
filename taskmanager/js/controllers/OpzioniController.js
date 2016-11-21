app.controller('OpzioniController', ['$scope', 'crudService','$routeParams','$http','$q','$interval','uiGridConstants', function($scope, crudService,$routeParams,$http,$q,$interval,uiGridConstants) {
	var vm = $scope;
	window.vm=vm;
	vm.cat=$routeParams && $routeParams.opz || 'tasks';
    vm.data = [];
	vm.gridOptions={
		enableCellEditOnFocus: true,
		enableRowSelection: true,
		selectionRowHeaderWidth: 35,
		enableSelectAll: false,
		multiSelect:false,
		onRegisterApi:function(gridApi){
			vm.gridApi = gridApi;
			gridApi.rowEdit.on.saveRow(vm, vm.save);
		}		
	}
    vm.populateData = function(response){
        vm.data = response.data && response.data.docs ||[];
		vm.gridOptions.data=vm.data
		
		switch (true){
			case (vm.cat=='tasks'):
				vm.gridOptions.columnDefs=[
					{ name: 'incaricato',width:100},
					{ name: 'obiettivi',width:200},
					{ name: 'importanza',type:'number',width:20},
					{ name: 'scadenza',type:'date',width:100,cellFilter: 'date:"dd/MM/yyyy"'}
				];
				break;				
		}
		
    };
	vm.create=function(){
		vm.data.push({_id:null})
	};
    vm.read = function(){
		var fnd={"cat":vm.cat};
        crudService.fnd(fnd, vm.populateData);
    };	
    vm.save = function(row){
		var promise = $q.defer();
		vm.gridApi.rowEdit.setSavePromise(row,promise.promise)
		row.cat=vm.cat
        crudService.set(row,function(r){
			promise.resolve(); //promise.reject();
		});
    };
	vm.remove = function(){	
		var d=vm.gridApi.grid.selection.lastSelectedRow.entity
		vm.data.splice(vm.data.indexOf(d),1)
        crudService.del(d,function(r){
			//window.location="#/"+vm.cat+"/"
		});
    };
    vm.init = function(){
        $(function(){
			var gc=$('.ui-grid');
			var po=gc.position();
			var gh=window.innerHeight-po.top-100;
			if (gh<150) gh=150;
			gc.height(gh);
		})
        vm.read();
    };	
	vm.init();
}]);