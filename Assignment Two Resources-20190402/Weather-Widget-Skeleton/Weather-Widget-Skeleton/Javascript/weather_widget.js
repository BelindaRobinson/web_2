/*
 * Constructor function for a WeatherWidget instance.
 * 
 * container_element : a DOM element inside which the widget will place its UI
 *
 */
 
function WeatherWidget(container_element){

	var _list = [];
	var _request ;
	var _currentsortorder = 1;

	var _ui = {
		
		select			:	null,
		sortbycity		:	null, //to sort by the city
		sortbymax		:	null, //to sort by the max temp
		cityentry		:	null, //gets entry from user to search for city
		cityfind		:	null, //to search for the entried city name
		container		:	null, //holds the information
		titlebar		:	null, //holds information for the title bar
		toolbar			:	null, //holds information for the toolbar
		list 			: 	null, //hold added city information

	};

	//continues all the ui information to display information and functions for ui
	var _createUI = function(container_element){
		
		_ui.container = container_element;
		_ui.container.classname = "monitor";

		_ui.titlebar = document.createElement("div");
		_ui.titlebar.classname = "title";
		_ui.titlebar.label = document.createElement("span");
		_ui.titlebar.label.innerHTML = "name";
		_ui.titlebar.appendChild(_ui.titlebar.label);

		_ui.toolbar = document.createElement("div");
		_ui.cityentry = document.createElement("input");		
		_ui.cityentry.type = "text";
		_ui.cityentry.size = 22;

		_ui.toolbar = document.createElement("div");
		_ui.toolbar.label = document.createElement("span");
		_ui.toolbar.label.innerHTML = "sort by", "city", "max temp";
		_ui.toolbar.appendChild(_ui.toolbar.label);	
		_ui.cityentry.type = "text";
		_ui.cityentry.size = 22;
		
		// creates drop down and radio buttons
		_ui._list = document.createElement("div");
			_ui._list.className = "list";
		
		_ui.cityentry = document.createElement("select");
		selectOption = document.createElement("option");
		selectOption.value = "select";
		selectOption.innerHTML = "Select Town";
		_ui.cityentry.appendChild(selectOption);
		selectionForm = document.createElement("form");
		_ui.sortbycity = document.createElement("input");
		_ui.sortbycity.type = "radio";
		_ui.sortbycity.name = "sorter";
		selectionForm.appendChild(_ui.sortbycity);
		_ui.sortbymax = document.createElement("input");
		_ui.sortbymax.type ="radio";
		_ui.sortbymax.name = "sorter";
		selectionForm.appendChild(_ui.sortbymax);

		_ui.titlebar.appendChild(_ui.sortbycity);
		_ui.toolbar.appendChild(selectionForm);
		
		_ui.cityfind = document.createElement("input");
		_ui.cityfind.type = "radio";
		_ui.cityfind.innerHTML = "Search";
		_ui.cityfind.onclick = function() {
			_addcityname(_ui.cityentry.value);
			_ui.cityentry.value = "";
		}

		_ui.sortbycity = document.createElement("input");
		_ui.sortbycity.type = "radio";
		_ui.sortbycity.innerHTML = "Sort by City";
		_ui.sortbycity.onclick = function() {
			_dosort(1);
		}

		_ui.sortbymax = document.createElement("input");
		_ui.sortbymax.type = "radio";
		_ui.sortbymax.innerHTML = "Sort by Max";
		_ui.sortbymax.onclick = function() {
			_dosort(0);
		}	
		// tried to add option in however run out of time 
		

		selectionForm = document.createElement("form");
			
		_ui.sortbycity = document.createElement("input");
		_ui.sortbycity.type = "radio";
		_ui.sortbycity.name = "sorter";
		_ui.sortbycity.checked = true;
		selectionForm.appendChild(_ui.sortbycity);

		_ui.toolbar.appendChild(_ui.cityentry);
		_ui.toolbar.appendChild(_ui.cityfind);
		_ui.toolbar.appendChild(_ui.sortbycity);
		_ui.toolbar.appendChild(_ui.sortbymax);

		_ui.list = document.createElement("div");

		_ui.select = document.createElement("select");
			_ui.select.appendChild(addOption("select", "Select Town"));
			_ui.select.appendChild(addOption("Auckland", "Auckland"));
			_ui.select.appendChild(addOption("Hamilton", "Hamilton"));
			_ui.select.appendChild(addOption("Tauranga", "Tauranga"));
			_ui.select.appendChild(addOption("Wellington", "Wellington"));
			_ui.select.appendChild(addOption("Christchurch", "Christchurch"));
			_ui.select.appendChild(addOption("Dunedin", "Dunedin"));

		_ui.select.appendChild(selectOption);

		_ui.titlebar.appendChild(_ui.select);

		_ui.container.appendChild(_ui.titlebar);
		_ui.container.appendChild(_ui.toolbar);
		_ui.container.appendChild(_ui.list);
	}

	// adds the selected city to the list
	var _addcityname = function(city){
		for(i = 0; 1< _list.length; i++) {
			if(city == _list(i).getcity()) {
				alert("already ther");
				return;				
			}
		}
		
		//getting the information from the database
		_request = new XMLHttpRequest();
		var url = "php/weather.php?location=" + city; 
		_request.open("GET", url, true);
		_request.onreadystatechange - _addnewcitylistitem;
		_request.send(city);
	}

	function addOption (value, text){
		selectOption = document.createElement("option");
		selectOption.value = value;
		selectOption.innerHTML = text;
		selectOption.addEventListener("click", addOption, true);
		return selectOption;
	}

	// adds a new new city to the list with the old one and refreshs the list
	var _addnewcitylistitem = function(){
		if (_request.readyState == 4){
			if (_request.readyState == 200) {
				var data = JSON.parse(_request.responseText);
				if(data.length == 0){
					alert("no such city");
					return;
				}
				var a = data[0].name;				
				var b = data[0].minitemp;
				var c = data[0].maxtemp;

				var witem = new weatherdata(a,b,c);
				_list.push(witem);
				_refreshweatherlist();
			}
		}
		
	}

	

	// refreshs the list after removing 
	var _refreshweatherlist = function() {
		if(_ui.list == null)
			return;
		while(_ui.list.haschildnodes()){
			_ui.list.removechild(_ui.list.lastchild);			
		}

		if(_currentsortorder == 1){
			_list.sort(_citysort);
		}	else {
			_list.sort(_maxsort);
		}	
		


		for(var i = 0; i < _list.length; i++){			
			var line = _list[i];
			_ui.list.appendChild(line.getDomElement());
		}

	}

	var _dosort = function(sortby){
		if(sortby == 1){
			_currentsortorder = 1;
		}
		else {
			_currentsortorder = 0;
		}

		_refreshweatherlist();
	}

	var _maxsort = function(a,b){
		return a.getmax() - b.getmax();
	}

	var _citysort = function(a,b){
		return a.getcity() - b.getcity();
	}

	var _weathersort = function(a,b){
		if(a.getcity() > b.getcity())
			return 1;
		else if (a.getcity() < b.getcity())
			return -1;
		else
			return 0;
	}	
	
	  var _initialise = function(container_element){
	  	_createUI(container_element);
	  	}
	  	
	  	_initialise(container_element);
	
	var weatherdate = function(name, outlook, minitemp, maxtemp){

		var _name = name;
		var _outlook = outlook;	
		var _minitemp = minitemp;
		var _maxtemp = maxtemp;

		var _ui = {
			dom_element		:	null,
			location_label	:	null,
			outlock_label	:	null,			
		};

		var _createUI = function(){

			_ui.dom_element = document.createElement("div");
			_ui.dom_element.classname = "selection";
			_ui.city_label = docunment.createElement("span");
			_ui.city_label.innerHTML = _city + " ";
			_ui.city_label.classname = "section_label";
			_ui.max_label = document.createElement("span");
			_ui.max_label.innerHTML = _max + " ";
			_ui.max_label.classname = "numeric";

			_ui.dom_element.appendChild(_ui.city_label);
			_ui.dom_element.appendChild(_ui.max_label);
		};

		this.getDomElement = function(){
			return _ui.dom_element;
		}

		this.getcity = function(){
			return _name;
		}
		
		this.getoutlook = function(){
			return  _outlook;
		}

		this.getminitemp = function(){
			return _minitemp;
		}

		this.getmax = function(){
			return _maxtemp;
		}

		_createUI();

		//debugging
		//request check the respone, if empty something is wrong, 505 error not connecting to db, php
		//check request function, is it being called, console.log(), check syntax of request, log function, js
		//check callback function, check its the wright one console.log(), check info conesole.log(), check how its displayed, js

		//write correct html
		//then convert to dom
		//check ordering for dom

		//container - classname = "monitor"
		//title - span		
		//toolbar - span "sort by"
		//			dropdown
		//			span "town"
		//			radio button
		//			span "maxtemp"
		//add title to container then make buttons then add to toolbar then toolbar to container	 
  	};  
}
	 
	 
	 
	 