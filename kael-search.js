/**
	Plugin for creation of referenced (1-n) fields in HTML.
	
	Dependencies (see example.html):
		jquery
		jquery-ui
		
	@author Kael Santini
	@since 06/08/2012
**/
(function($) {
	var requiredMethods = [ "newGrid", "registerEvent", "getSelectedItems", "updateGrid" ];
	$.widget( "ui-helpers.kaelsearch", {
		options: {
			gridProvider: null, // an grid implementation
		
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
			
			buttonSearch: null,
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
		
			if (!this.options.gridProvider)
				throw "kaelsearch: plugin requires gridProvider implementation to be loaded";				
			for (var i = 0; i < requiredMethods.length; i++)
				if (requiredMethods[i] in this.options.gridProvider == false)
					throw "kaelsearch: this implementation of gridProvider require methods: " + requiredMethods.join(", ");
			
			this.element.hide();
			this._newElement = this.element.clone();
			this._newElement.removeAttr("id").removeAttr("name").insertBefore(this.element).show();
		
			if (this.options.disableInput)
				this._newElement.attr("readonly", "readonly");
		
			this._dialogButton = this._getSearchButtonElement();
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
			this.options.dialogOptions.buttons.OK = $.proxy(this, "_itemSelected");
			this._dialog.dialog(this.options.dialogOptions);
		},
		
		_getSearchButtonElement: function() {
			var $button;
			if (this.options.buttonSearch) {
				$button = $(this.options.buttonSearch);
			} else {
				$button = $("<button>").button(this.options.buttonFinderOptions);
				$button.insertAfter(this.element);
			}
			return $button;
		},
		
		_dialogButtonClick: function() {
			this._dialog.dialog("open");
			this._configureGrid();
		},
		
		_configureGrid: function() {
			if (!this._grid) {
				this._gridContainer = $("<div>").css("height", this._container.height() - 20).appendTo(this._container);
				this._grid = this.options.gridProvider.newGrid(this);
				this._grid.registerEvent("doubleClick", $.proxy(this, "_itemSelected"));
				this._grid.registerEvent("keyDown", $.proxy(this, "_itemSelected"));
			}
		},
		
		_searchButtonClick: function(){
			var term = this._termInput.val();
			if (this.options.cachedResults.length > 0) {
				var results = this._filterCachedResults(term);
				this.updateGrid(results);
			} else if ($.isFunction(this.options.search)) {
				this.options.search(term, $.proxy(this, "updateGrid"));
			} else if (typeof this.options.search == "string") {
				this._doSearch(term);
			}
		},
		
		_filterCachedResults: function(term) {
			var matcher = new RegExp(term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), "i");
			return $.grep( this.options.cachedResults, function(value) {
				return matcher.test(value[1]);
			});
		},
		
		_itemSelected: function() {
			var selectedItem = this.getSelectedItem();
			if (selectedItem) {
				this.element.val(selectedItem.id);
				this._newElement.val(selectedItem.label);
			}
			this._dialog.dialog("close");
		},
		
		_keyPressed: function(e) {
			if (e.keyCode == 13) {
				this._itemSelected();
			}
		},
		
		_doSearch: function(term) {
			var self = this;
			if (this._req) this._req.abort();
			this._req = $.ajax({
				url : this.options.search,
				type : "GET",
				dataType: "json",
				data : { term : term },
				success: function(json) {
					self.updateGrid(json);
				},
				error: function() {
					self.updateGrid([]);
				}
			});
		},
		
		getSelectedItem: function() {
			return this.options.gridProvider.getSelectedItems();
		},
		
		updateGrid: function(data) {
			return this.options.gridProvider.updateGrid(data);
		},
		
		// overriding factory method
		_setOption: function( key, value ) {
			$.Widget.prototype._setOption.apply( this, arguments );
		}
	});
}(jQuery));

