/**
	Implementation for jqGrid used in kael-search.js
		
	@author Kael Santini
	@since 27/08/2012

**/
var jqGridProvider = function() {

	var $table;
	var $grid;
	var _options;

	var newGrid = function(options){
		_options = options;
		if ($grid) return $grid;
		
		var columns = options.options.gridOptions.columns;
		var colNames = $.map(options.options.gridOptions.columns, function(obj){ return obj.name; });
		var colModel = [];
		for (var i = 0; i < columns.length; i++) {
			colModel.push({
				"name" : columns[i].field,
				"index" : columns[i].field,
				"width" : columns[i].width
			});
		}
		
		$table = $("<table></table>").appendTo(_options._gridContainer);
		/*$table.jqGrid({
			datatype: "json",
			colNames: colNames,
			colModel: colModel,
			rowNum:10,
			sortname: 'id',
			viewrecords: true,
			sortorder: "desc"
		});*/
		
		//$grid = new Slick.Grid(_options._gridContainer[0], [], _options.options.gridOptions.columns, _options.options.gridOptions);
		return this;
	};
	
	var updateGrid = function(data) {
	
		// convert data for the format of grid
		var gridData = [];
		for (var i = 0; i < data.length; i++) {
			gridData[i] = {  "id" : data[i][0], "label" : data[i][1] };
		}
	};

	return {
		"newGrid" : newGrid,
		"registerEvent" : $.noop,
		"getSelectedItems" : $.noop,
		"updateGrid" : updateGrid
	};
	
};
