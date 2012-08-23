/**
	Implementation for grid used in kael-search.js
		
	@author Kael Santini
	@since 23/08/2012

**/
var SlickGridProvider = function() {
	
	var $grid;
	var _options;

	var newGrid = function(options){
		_options = options;
		if ($grid) return $grid;
		
		$grid = new Slick.Grid(_options._gridContainer[0], [], _options.options.gridOptions.columns, _options.options.gridOptions);
		$grid.setSelectionModel(new Slick.RowSelectionModel());
		
		// change columns and register plugin if necessary
		if (_options.options.gridOptions.multiSelect) {
			var checkboxSelector = new Slick.CheckboxSelectColumn({
				cssClass: "slick-cell-checkboxsel"
			});
			_options.options.gridOptions.columns.splice(0, 0 , checkboxSelector.getColumnDefinition());
			this._slickGrid.setColumns(_options.options.gridOptions.columns);
			this._slickGrid.registerPlugin(checkboxSelector)
		}
		
		return this;
	};
	
	var registerEvent = function(ev, func) {
		if (ev == "doubleClick") {
			$grid.onDblClick.subscribe(func);
		} else if (ev == "keyDown") {
			$grid.onKeyDown.subscribe(func);
		}
	};
	
	var getSelectedItems = function() {
		var selectedRows = $grid.getSelectedRows();
		var selectedItem = $grid.getDataItem(selectedRows[0]);
		return selectedItem;
	};
	
	var updateGrid = function(data) {
		// convert data for the format of grid
		var gridData = [];
		for (var i = 0; i < data.length; i++) {
			gridData[i] = {  "id" : data[i][0], "label" : data[i][1] };
		}
	
		$grid.invalidateAllRows();
		$grid.setData(gridData);
		$grid.render();
	};
	
	return {
		"newGrid" : newGrid,
		"registerEvent" : registerEvent,
		"getSelectedItems" : getSelectedItems,
		"updateGrid" : updateGrid
	};
};
