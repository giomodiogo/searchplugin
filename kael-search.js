/**
	Plugin for creation of referenced (1-n) fields in HTML.
	
	Dependencies (see example.html):
		jquery
		jquery-ui
		
		slickgrid
		
	@author Kael Santini
	@since 06/08/2012

**/
(function($) {
	$.widget( "ui-helpers.kaelsearch", {

		options: {
			title: "Search",
			disableInput: true,
			cachedResults: [],
			search: $.noop,
			
			buttonFinderOptions : { 
				icons: {
					primary: "ui-icon-search"
				},
				text: false
			},
			
			buttonSearchOptions : {
				icons: {
					primary: "ui-icon-search"
				},
				text: false
			},
			
			dialogOptions : {
				modal: true,
				autoOpen: false,
				height: 430,
				width: 500
			},
			
			gridOptions : {
				columns: [
					{
						id: "idPK",
						field: "id",
						name: "ID",
						sortable: true,
						resizable: true,
						width: 25
					},
					{
						id: "idLbl",
						name: "Description",
						field: "label",
						sortable: true
					}
				],
				enableCellNavigation: true,
				//autoHeight: true,
				forceFitColumns: true,
				multiSelect: false
			}
			
		},
		
		_init: function() {
		
			this.element.hide();
			this._newElement = this.element.clone();
			this._newElement.removeAttr("id").removeAttr("name").insertBefore(this.element).show();
		
			if (this.options.disableInput)
				this._newElement.attr("readonly", "readonly").attr("disabled", "disabled");
		
			this._dialogButton = $("<button>").button(this.options.buttonFinderOptions);
			this._dialogButton.insertAfter(this.element);
			this._dialogButton.click($.proxy(this, "_dialogButtonClick"));
			
			this._dialog = $("<div>").attr("title", this.options.title);
						
			this._container = this._dialog;
			
			this._termInput = $("<input>").attr("type", "text").addClass("text ui-widget-content ui-corner-all").css("width", "100%");
			this._termInput.appendTo(this._container);
			
			this._searchButton = $("<button>").css({"position":"absolute", "top" : "10px", "right" : "15px"});
			this._searchButton.button(this.options.buttonSearchOptions);
			this._searchButton.appendTo(this._container);
			this._searchButton.click($.proxy(this, "_searchButtonClick"));
			
			this.options.dialogOptions.buttons = {};
			this.options.dialogOptions.buttons.OK = $.proxy(this, "_okButtonClick");
			this._dialog.dialog(this.options.dialogOptions);
			
		},
		
		_dialogButtonClick: function() {
			this._dialog.dialog("open");
			this._configureGrid();
		},
		
		_configureGrid: function() {
			if (!this._slickGrid) {
				
				this._gridContainer = $("<div>").css("height", this.options.dialogOptions.height - 100).appendTo(this._container);
				this._slickGrid = new Slick.Grid(this._gridContainer[0], [], this.options.gridOptions.columns, this.options.gridOptions);
				this._slickGrid.setSelectionModel(new Slick.RowSelectionModel());
				// change columns and register plugin if necessary
				if (this.options.gridOptions.multiSelect) {
					var checkboxSelector = new Slick.CheckboxSelectColumn({
						cssClass: "slick-cell-checkboxsel"
					});
					this.options.gridOptions.columns.splice(0, 0 , checkboxSelector.getColumnDefinition());
					this._slickGrid.setColumns(this.options.gridOptions.columns);
					this._slickGrid.registerPlugin(checkboxSelector)
				}
				
				
			}
		},
		
		_searchButtonClick: function(){
			if (this.options.cachedResults.length > 0) {
				this._updateGrid(this.options.cachedResults);
			} else {
				this.options.search(this._termInput.val(), $.proxy(this, "updateGrid"));
			}
		},
		
		_okButtonClick: function() {
			var selectedRows = this._slickGrid.getSelectedRows();
			var selectedItem = this._slickGrid.getDataItem(selectedRows[0]);
			this.element.val(selectedItem.id);
			this._newElement.val(selectedItem.label);
			this._dialog.dialog("close");
		},
		
		updateGrid: function(data) {
			this._slickGrid.invalidateAllRows();
			this._slickGrid.setData(data);
			this._slickGrid.render();
		},
		
		// overriding factory method
		_setOption: function( key, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
		}
	});
}(jQuery));

