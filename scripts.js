var margin = {top: 40, right: 20, bottom: 50, left: 60};

var currentGraphs = {"a": "bar", "b": "scatter", "c":"time","d":"none",
					"inputA":"a","inputB":"b","inputC":"c","inputD":"none",
					"filterA": "none", "filterB":"none",filterC:"none"};
					
function initChangeA(){
		var s = document.getElementById("filterA");
		currentGraphs.filterA = "" + s[s.selectedIndex].value;
		console.log(currentGraphs.filterA);
		a = currentGraphs.a;
		this[a](currentGraphs.inputA);		}

function back(){
	x = document.getElementById("backA");
	x.style.display = "none";
	bar("a");
}	

/*function compare(id1){
	console.log(id1);
	var rectB = document.getElementById("b").getBoundingClientRect(),
		rectA = document.getElementById("a").getBoundingClientRect();
	//console.log(rect.top, rect.right, rect.bottom, rect.left);
	d = document.getElementById("comp1");
	c = document.getElementById("comp2");
	c.style.display = "block";
	d.style.display = "block";
	a = currentGraphs.id1;
	currentGraphs.inputA = id1;
	this[a](currentGraphs.inputA);
	hide1 = document.getElementById(id1);
	hide1.style.display = "none";
	
	//	s.style.left = "100px"; //spostali in giro così quando fai i compare

	}	
*/	
function bar(name){
		//console.log(name);
		var selection = document.getElementById("filterA");
		var filter;
		if(currentGraphs.filterA == "none"){
			filter = "total";
		} else {
			d3.select("#svg"+name).remove()
			filter = currentGraphs.filterA;
		}
		console.log(filter);
		if(filter ==  "total"){
			d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var ordered = d3.nest()
					.key(function(d){return d['car-type'];})
					.entries(data)
	                .sort(function(a, b){ return d3.descending(a.values, b.values);});
		console.log(ordered);
		currentGraphs.a = "bar";
		currentGraphs.inputA = name;
		currentGraphs.filterA = filter;
		auxBar(ordered,name);
		});
		} else if (filter == "2016"  || filter == "2015" || filter == "month"){
			d3.csv("Lekagul Sensor Data.csv").then(function(data){
				if(filter == "2016"){
						currentGraphs.a = "bar";
						currentGraphs.inputA = name;
						currentGraphs.filterA = filter;
						var base = data;
						var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
						var format = d3.timeFormat("%y");
						base.forEach(function(d,i) {   
							var time = parseTime(d.Timestamp);
							d.Timestamp = format(time);
							})						
						base = base.filter(function(d) {return d['Timestamp'] == "16";})
						var ordered = d3.nest()
								.key(function(d){return d['car-type'];})
								.entries(base)
								.sort(function(a, b){ return d3.descending(a.values, b.values);});
							console.log(ordered);
							auxBar(ordered,name);
				} else if (filter == "2015"){
						currentGraphs.a = "bar";
						currentGraphs.inputA = name;
						currentGraphs.filterA = filter;
						var base = data;
						var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
						var format = d3.timeFormat("%y");
						base.forEach(function(d,i) {   
							var time = parseTime(d.Timestamp);
							d.Timestamp = format(time);
							})
						base = base.filter(function(d) {return d['Timestamp'] == "15";})
						var ordered = d3.nest()
								.key(function(d){return d['car-type'];})
								.entries(base)
								.sort(function(a, b){ return d3.descending(a.values, b.values);});
							auxBar(ordered,name);
				} else if (filter == "month"){
					d3.csv("Lekagul Sensor Data.csv").then(function(data){
						var base = data;
						var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
						var format = d3.timeFormat("%m-%y");
						base.forEach(function(d,i) {   
							var time = parseTime(d.Timestamp);
							d.Timestamp = format(time);
							})						
					//	base = base.filter(function(d) {return d['Timestamp'] == "16";})
						var ordered = d3.nest()
								.key(function(d){return d['car-type'];})
								.key(function(d) {return d['Timestamp'];})
								.rollup(function (v) {return v.length;}) //va bene così
								.entries(base)
							//	.sort(function(a, b){ return d3.descending(a.values, b.values);});
						//console.log(ordered);
						multiLine(ordered,name);
						//metti parallel coordinates
					})		
				}
			})
		};		
};

function multiLine(data,name) {
			var h = document.getElementById(name).clientHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom- 100;
			
			var //x = d3.scaleTime().range([0,w]),
		    x = d3.scalePoint().range([0, w]),
			y = d3.scaleLinear().domain([19000,0]).range([0,h]);
			
			var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b"));
			var yAxis = d3.axisLeft(y);			
			
			
			var z = d3.scaleOrdinal(d3.schemeCategory10);
			z.domain(data, function(d){return d.key;}); //mappa per ogni tipo di veicolo il coloro 
			var cols = [];
			var months = [];
			var rows= data.length;
			for (var i  = 0; i < rows; i++){
			     cols[i] = []
					months[i] = [];}
			var i;
			for(i=0;i<data.length;i++){
				var j;
				for(j=0;j<data[i].values.length;j++){
					cols[i][j]=(data[i].values[j].value);
				}
			}
			
			//console.log(cols);		
	
			
			var da0 = [];
				for (var j=0; j< data[0].values.length; j++){
					var linedata = {"type": data[0].key,"month": data[0].values[j].key, "value":+data[0].values[j].value}
					da0.push(linedata);
					months[j] = data[0].values[j].key;
				}
			x.domain(months);
			var da1 = [];
				for (var j=0; j<data[1].values.length; j++){
					var linedata = {"type": data[1].key,"month": data[1].values[j].key, "value":+data[1].values[j].value}
					da1.push(linedata);
				}
			var da2 = [];
				for (var j=0; j<data[2].values.length; j++){
					var linedata = {"type": data[2].key,"month": data[2].values[j].key, "value":+data[2].values[j].value}
					da2.push(linedata);
				}
			var da3 = [];
				for (var j=0; j<data[3].values.length; j++){
					var linedata = {"type": data[3].key,"month": data[3].values[j].key, "value":+data[3].values[j].value}
					da3.push(linedata);
				}
			var da4 = [];
				for (var j=0; j<data[1].values.length; j++){
					var linedata = {"type": data[4].key,"month": data[4].values[j].key, "value":+data[4].values[j].value}
					da4.push(linedata);
				}
			var da5 = [];
				for (var j=0; j<data[1].values.length; j++){
					var linedata = {"type": data[5].key,"month": data[5].values[j].key, "value":+data[5].values[j].value}
					da5.push(linedata);
				}
			var da6 = [];
				for (var j=0; j<data[1].values.length; j++){
					var linedata = {"type": data[6].key,"month": data[6].values[j].key, "value":+data[6].values[j].value}
					da6.push(linedata);
				}			
			
			console.log(data);
			var svg = d3.select("#"+name).append("svg")
					.attr("id", "svg"+name)
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
			svg.append("text")             
				  .attr("transform",
						"translate(" + (w/2) + " ," + 
									   (h + margin.top) + ")")
				  .style("text-anchor", "middle")
				  .text("Month");
			
			svg.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Number of readings");     
			
			svg.append("g")
				  .attr("transform", "translate(0," + h + ")")
				  .call(d3.axisBottom(x));
			
			svg.append("g")
			  .style("font","8px times")
			  .call(d3.axisLeft(y))
			var base = data;
			var circlesGr = svg.selectAll(".circleGroups")
								.data(base) 
								.enter()
								.append("g")
								.attr("fill",function(d){return z(d.key)})

			var circles = circlesGr.selectAll(".circles")
									.data(function(d){return d.values})
									.enter()
									.append("circle")
									
				circles.attr("r",2)
						.attr("cx",function(d){return x(d.key)})
						.attr("cy",function(d){return y(d.value)})
			
			var line = d3.line()
						.x(function(d,i){return x(d.key)})
						.y(function(d,i) {return y(d.value);})		
			
			var pathsGroup = svg.selectAll(".pathsGroup")
								.data(base)
								.enter()
								.append("g")
								.attr("fill","none")
								.attr("stroke",function(d){console.log(d);return z(d.key)})
						
			var paths = pathsGroup.selectAll(".paths")
									.data(function(d){return [d.values]})
									.enter()
									.append("path")
									.attr("d",line)
									.attr("class","line")
									.attr("stroke-width",2)
									.attr("id",function(d,i){return "line";})
														
							/*		o = d3.selectAll(".line")
									o.each(function(d,i){
										var totalLength = d3.select("#line").getTotalLength;
										console.log(totalLength);
										d3.selectAll("#line"+i).attr("stroke-dasharray", totalLength + " " + totalLength)
																  .attr("stroke-dashoffset", totalLength)
																  .transition()
																  .duration(2000)
									})	
			/*	
				d3.select.attr("stroke-dasharray",function(d){totalLength = x(d.length); return(totalLength + " " + totalLength)})
						  .attr("stroke-dashoffset", 0)
						  .transition()
							.duration(2000)
							.attr("stroke-dashoffset",totalLength)
						*/	
			var legendRect = 18;
			var legendSpacing = 4;
		
			legend = svg.selectAll('.legend')                     
			  .data([da0,da1,da2,da3,da4,da5,da6])                                
			  .enter()                                                
			  .append('g')                                            
			  .attr('class', 'legend')                    
			  .attr("transform", function(d,i){
				  var height = legendRect + legendSpacing;
				  var offset = height * 2 / 2;
				  var horz = -2 * legendRect;
				  var vert = i * height -offset;
				  return "translate("+ (w - 80)+","+ vert +")";
			  });
			  
			 legend.append("rect")
				.attr("width",20)
				.attr("height",20)
				.style("fill", function(d){return z(d[0].type)})
				
			legend.append("text")
				.attr("x", 25)
				.attr("y", 15)
				.text(function(d) {return d[0].type})
  }							
	
function auxBar(data,name){
			var h = document.getElementById(name).clientHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom -100;
			var i;
			count = [];
			keys = [];
			for (i=0; i< data.length; i++){
				count[i] = data[i].values.length;
			}
			count.sort(function(x, y){
			return d3.ascending(x.index, y.index);
			})
			var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-20]),
			ordered = data.sort();
			for(i=0;i<ordered.length;i++){
				keys[i] = data[i].key;
			}
			//console.log(keys);
			y = d3.scaleBand().rangeRound([0,h]);			
			y.domain(keys);
			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);
			var canvas = d3.select("#"+name).append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.attr("id", "svg"+name)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
			canvas.append("g")
				  .attr("transform", "translate(0," + h + ")")
				  .call(d3.axisBottom(x));

			  // text label for the x axis
			canvas.append("text")             
				  .attr("transform",
						"translate(" + (w/2) + " ," + 
									   (h + margin.top) + ")")
				  .style("text-anchor", "middle")
				  .text("Number of occurrences");
			
			 // Add the y Axis
			canvas.append("g")
				.call(d3.axisLeft(y));

			canvas.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Vehicle Type");      
				
			var div = d3.select("#"+name).append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

			
			canvas.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					//.attr("width",function (d){return x(d.values.length);})
					.attr("height", 30)
					.attr("y", function(d,i){return y(d.key)+5;})
					.attr("fill",function(d){if (d.key == "2P") {return "#EC9787";} else {return "steelblue";}})
					.on("mouseover", function(d,i){
								 canvas.append("text")
									 .attr('id','tooltip')
									 .text(d.values.length)
									 .attr("y", y(d.key)+22)
									.attr("x", x(d.values.length) + 5)
									.style("font-size","10px")
								d3.select(this)
									.attr("stroke","black")
									.attr("stroke-width",2);
							})
					.on("mouseout", function(d,i){
									canvas.selectAll("#tooltip")
										.remove();
									d3.select(this)
									.attr("stroke-width",0);	
					})
					.on("click", function(d){
							gateBar(d.key);
							currentGraphs.a = "gateBar";
							currentGraphs.inputA = d.key;
							})
					.transition()
					.duration(200)
					.attr("width", function(d, i) {
						return x(d.values.length);
					})
			
			var legendRect = 18;
			var legendSpacing = 4;
			
			legend = canvas.selectAll('.legend')                     // NEW
			  .data(["Park Rangers","Other"])                                   // NEW
			  .enter()                                                // NEW
			  .append('g')                                            // NEW
			  .attr('class', 'legend')                    
			  .attr("transform", function(d,i){
				  var height = legendRect + legendSpacing;
				  var offset = height * 2 / 2;
				  var horz = -2 * legendRect;
				  var vert = i * height -offset;
				  return "translate("+ (w - 130)+","+ ((h -100) - vert) +")";
			  });
			  
			 legend.append("rect")
				.attr("width",20)
				.attr("height",20)
				.style("fill",function(d,i){if (d=="Park Rangers")
									{return "#EC9787";} else {return "steelblue";}})
				
			legend.append("text")
				.attr("x", 25)
				.attr("y", 15)
				.text(function(d) {return d})
				
		var b = document.getElementById("backA");
		b.style.display = "none";
}
																		

function gateBar(key){
	var b = document.getElementById("backA");
	b.style.display = "block";
	var margin = {top: 40, right: 10, bottom: 150, left: 80};
	d3.csv("Lekagul Sensor Data.csv").then(function(data){ 
			//console.log(key);
			var filter = currentGraphs.filterA;
			var filtered; 
			if(filter == "2015"){
				var base = data;
				var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
				var format = d3.timeFormat("%y");
				base.forEach(function(d,i) {   
				var time = parseTime(d.Timestamp);
				d.Timestamp = format(time);})						
				base = base.filter(function(d) {return d['Timestamp'] == "15";})
				filtered = d3.nest()
					.key(function(d){return d['car-type'];})
					.key(function(d){return d['gate-name'];})
					.entries(base)
					.filter(function(d) {return d.key == key;});
			} else if (filter=="2016") {
				var base = data;
				var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
				var format = d3.timeFormat("%y");
				base.forEach(function(d,i) {   
				var time = parseTime(d.Timestamp);
				d.Timestamp = format(time);})						
				base = base.filter(function(d) {return d['Timestamp'] == "16";})
				filtered = d3.nest()
					.key(function(d){return d['car-type'];})
					.key(function(d){return d['gate-name'];})
					.entries(base)
					.filter(function(d) {return d.key == key;});
			}
			else if (filter=="total") {
				filtered = d3.nest()
					.key(function(d){return d['car-type'];})
					.key(function(d){return d['gate-name'];})
					.entries(data)
					.filter(function(d) {return d.key == key;});
			}
			var f = filtered[0].values;
			f.sort(function(a, b){ return d3.descending(a.values, b.values);});		
			var h = document.getElementById("a").clientHeight;
			var w = document.getElementById("a").offsetWidth;
					w = w - margin.left - margin.right;
					h = h - margin.top - margin.bottom;
			var i;		
			//console.log(f);
			keys = [];
			for(i=0;i<f.length;i++){
				keys[i] = f[i].key;
			}
			count = [];
			for (i=0; i< filtered[0].values.length; i++){
				count[i] = filtered[0].values[i].values.length;
			}

			var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-20]),
			y = d3.scalePoint().domain(keys).rangeRound([0,h]);
			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);
			d3.select("#svga").remove();
			var canvas = d3.select("#a").append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.attr("id", "svga")
					.append("g")
					.attr("transform", "translate(" + margin.left  + "," + margin.top + ")");
	
				canvas.append("g")
				  .attr("transform", "translate(0," + h + ")")
				  .call(d3.axisBottom(x));

			  // text label for the x axis
				canvas.append("text")             
				  .attr("transform",
						"translate(" + (w/2) + " ," + 
									   (h + margin.top + 20) + ")")
				  .style("text-anchor", "middle")
				  .text("Number of readings");
			
			 // Add the y Axis
				canvas.append("g")
					.style("font","8px times")
					.call(d3.axisLeft(y));
			
			// text label for the y axis
			canvas.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Sensor");      
			
			canvas.selectAll("rect")
					.data(f)
					.enter()
					.append("rect")
					//.attr("width",function (d){return x(d.values.length);})
					.attr("height", function(){return 5;})
					.attr("y", function(d,i){return y(d.key);})
					.attr("fill", function(d){if ((d.key).indexOf("ranger") > -1) {
												return "#a6cee3";   //ranger azzurro 
											} else if ((d.key).indexOf("general-gate") > -1) {
												return "#1f78b4"; // general gate blu
											} else if ((d.key).indexOf("entrance") > -1){
												return "#b2df8a";  //verdino entrance
											} else if ((d.key).indexOf("camping") > -1){
												return "#33a02c"; //verde camping
											} else { 
												return "#fb9a99"; //rosa gates 
											}})
					.transition()
					.duration(250)
					.attr("width", function(d, i) {
						return x(d.values.length);
					})
					

			var legendRect = 18;
			var legendSpacing = 4;
			
			legend = canvas.selectAll('.legend')                     // NEW
			  .data(["Ranger Camps","General gates","Entrances","Camping sites","Gates"])                                   // NEW
			  .enter()                                                // NEW
			  .append('g')                                            // NEW
			  .attr('class', 'legend')                    
			  .attr("transform", function(d,i){
				  var height = legendRect + legendSpacing;
				  var offset = height * 2 / 2;
				  var horz = -2 * legendRect;
				  var vert = i * height -offset;
				  return "translate("+ (w - 130)+","+ ((h -100) - vert) +")";
			  });
			  
			 legend.append("rect")
				.attr("width",20)
				.attr("height",20)
				.style("fill",function(d,i){if (d=="Ranger Camps") {return "#a6cee3";}
									else if (d == "General gates") {return "#1f78b4";}
									else if (d == "Camping sites") {return "#33a02c";}
									else if (d == "Gates") 		   {return "#fb9a99";}
									else if (d == "Entrances")     {return "#b2df8a";}
									})
				
			legend.append("text")
				.attr("x", 25)
				.attr("y", 15)
				.text(function(d) {return d})
	});	
}

function handleMouseIn(d)
{ 
  canvas.append("text")
     .attr('id','tooltip')
     .text(d.values.length)
     .attr({
      'x':d3.mouse(this)[0],
      'y':d3.mouse(this)[1],
      'dx':-10,
      'dy':-20
  });     
} 
 
function handleMouseOut(d)
{
  svg.selectAll("#tooltip").remove(); //removes tooltip on mouse out
      
}
//controlla perchè reduce è rotta
function time(name){
	d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
			currentGraphs.c = "time";
			currentGraphs.inputC = name;
			currentGraphs.filterC = "none";
			var ordered = d3.nest()
					.key(function(d){return d['Timestamp'];})
					.entries(data);
		///	console.log(ordered);
			
			var date = "2015-05-01 08:32:09"
			var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
			var c = parseTime(date);
			
			var format = d3.timeFormat("%y-%m-%d");
		//	console.log(c);
		//	console.log(format(c));
		//	console.log(base[0].Timestamp);
			
			ordered.forEach(function(d,i) {   
				var time = parseTime(d.key);
				d.key = format(time);
				})
			//console.log(ordered);
			
			var ordered1 = d3.nest()
						.key(function(d){return d['key'];})
						.entries(ordered);
			//console.log(ordered1);
			
			var h = document.getElementById(name).clientHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom -100;

			var max = d3.max(ordered1,function(d){return d.values.length;});
			//console.log(max);
			
			var x = d3.scaleLinear().range([0, w-margin.right]),
			y = d3.scaleLinear().range([h,0]);
			
			
			//console.log(d3.extent(ordered1, function(d) {return d.key}));
			//console.log(d3.extent(ordered1, function(d) {return d.values.length}));
			
			x.domain([0,ordered1.length]);
			y.domain(d3.extent(ordered1, function(d) {return d.values.length;}));
			
			
			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);
			
			//console.log(x(5));
			
			var line = d3.line()
						.x(function(d,i) {return x(i);})
						.y(function(d) {return y(d.values.length);})
						;//.curve(d3.curveCardinal);
			
			
			var svg = d3.select("#"+name).append("svg")
					.attr("id", "svg"+name)
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			svg.append("g")
				  .attr("transform", "translate(0," + h + ")")
				  .call(d3.axisBottom(x));

			  // text label for the x axis
			svg.append("text")             
				  .attr("transform",
						"translate(" + (w/2) + " ," + 
									   (h + margin.top) + ")")
				  .style("text-anchor", "middle")
				  .text("Day");
			
			 // Add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
	
			// text label for the y axis
			svg.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Traffic (# of readings)");
			
		var path = svg.append("path")
				.datum(ordered1)
				.attr("fill","none")
				.attr("stroke", "steelblue")
				.attr("class","line")
				.attr("stroke-width",1.5)
				.attr("d",line);
		
		var totalLength = path.node().getTotalLength();
			
			  path.attr("stroke-dasharray", totalLength + " " + totalLength)
				  .attr("stroke-dashoffset", totalLength)
				  .transition()
					.duration(2000)
					.attr("stroke-dashoffset", 0);

	});
};


function scatter(name,filter){
	currentGraphs.b = "scatter";
	currentGraphs.inputB = name;
	currentGraphs.filterB = filter;
	d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
			var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
			var format = d3.timeFormat("%d-%m-%Y");
			base.forEach(function(d,i) {   
				var time = parseTime(d.Timestamp);
				d.Timestamp = format(time);})
			
			var everyone = d3.nest()
					.key(function(d){return d['car-id'];})
					.key(function(d){return d['Timestamp']})
					.entries(data);
			
			var every = [];
			for(i=0;i<everyone.length;i++){
				var sum = 0;
				var car;
				var days = [];
				for(j=0;j<everyone[i].values.length;j++){
					sum = sum + everyone[i].values[j].values.length 
					car = everyone[i].values[j].values[0]['car-type']
					d = everyone[i].values[j].key;
					days.push(d);
				}
				var obj = {'sum':sum,"car":car,"days":days};
				every.push(obj);
			}						
			var rangers = every.filter(function(d){if(d.car == "2P"){return d}})
			var sameDayVisitors = every.filter(function(d){if(d.days.length == 1) {return d}});
			var diffDayVisitors = every.filter(function(d){if (d.days.length > 1) {return d}});
			var moreThan3 = every.filter(function(d){if(d.days.length > 2){return d}})
			var ordered;
			if(filter == "General"){
				ordered = every;		
			} else if (filter == "Rangers") {
				ordered = rangers;
			} else if (filter == "Same Day") {
				ordered = sameDayVisitors;
			} else if (filter == "Different Days") {
				ordered = diffDayVisitors;
			} else if (filter == "3 or more Days") {
				ordered = moreThan3;
			}
			var h = document.getElementById(name).clientHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom -100;
			
			var filters = ["General", "Rangers", "Same Day","Different Days","3 or more Days"];

			var s = d3.select('#'+name)
						  .append('select')
							.attr("id","sel")
							.attr('class','select')
							.on('change',onchange)

			var options = s
				  .selectAll('option')
					.data(filters)
					.enter()
					.append('option')
						.text(function (d) { return d});
			var svg = d3.select("#"+name).append("svg")
					.attr("id", "svg"+name)
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
			var legendRect = 18;
			var legendSpacing = 4;
			
			legend = svg.selectAll('.legend')                     // NEW
			  .data(["Rangers","Other"])                                   // NEW
			  .enter()                                                // NEW
			  .append('g')                                            // NEW
			  .attr('class', 'legend')                    
			  .attr("transform", function(d,i){
				  var height = legendRect + legendSpacing;
				  var offset = (w + w/2 )/2;
				  var horz = i * (w - offset);
				  var vert = -2 * legendRect;
				  return "translate("+ (w - horz + -100)+",-10)"
			  });

			 legend.append("rect")
				.attr("width",20)
				.attr("height",20)
				.style("fill",function(d,i){if (d=="Rangers") {return "#EC9787";}
											else if (d=="Other"){return "steelblue"}}) //metti a posto tutti i colori anche sul grafo con filtro generale e sposta legenda
				
			legend.append("text")
				.attr("x", 25)
				.attr("y", 15)
				.text(function(d) {return d})
			//draw 		
			var max = d3.max(ordered,function(d){return d.sum})+5;
			var x = d3.scaleLinear().domain([0, ordered.length]).range([0, w-margin.right]),
			y = d3.scaleLinear().domain([0, max]).range([h,0]);
          
			svg.append("g")
				  .attr("transform", "translate(0," + h + ")")
				  .attr("class","x") 
				  .call(d3.axisBottom(x));

			  // text label for the x axis
			svg.append("text")             
				  .attr("transform",
						"translate(" + (w/2) + " ," + 
									   (h + margin.top) + ")")
				  .style("text-anchor", "middle")
				  .text("Vehicle");
			
			var tooldiv = d3.select("#"+name).append("div")
							.attr("class","tooltip")
							.style("opacity",0)
			
			 // Add the y Axis
			svg.append("g")
				.attr("class","y")
				.call(d3.axisLeft(y));
	
			// text label for the y axis
			svg.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Number of readings"); 
			
			 svg.selectAll("circle")
					.data(ordered)
					.enter()
					.append("circle")
					.attr("cx", function (d,i){return x(i);})
					.attr("cy", function (d,i) {return y(d.sum);} )
					.attr("r", 2)
					.attr("fill",function(d){if (d.car == "2P") {return "#EC9787"} else {return "steelblue"}})
						.on("mouseover", function(d){ d3.select(this)
															.transition()
															.duration(500)
															.style("r",12)
															.attr("stroke","black")
															.attr("stroke-width",6)
													    tooldiv.transition().duration(500).style("opacity",.9);
														if(d.days.length > 5){
															tooldiv.style("width","400px")
														} else {
															tooldiv.style("width","80px")
														}
												
														tooldiv.selectAll("text")
														               .data(d.days)
																	   .enter()
																	   .append("span")
																	   .text(function(d) {return d+", "})
	
														tooldiv.style("left", (d3.event.pageX + 15) + "px")
																.style("top", (d3.event.pageY - 40) +"px")
														})
						.on("mouseout", function(d) { d3.select(this).transition().duration(500).style("r",2).attr("stroke-width",0)
														tooldiv.transition().duration(500).style("opacity",0).style("width","80px")
														tooldiv.selectAll("span").remove()})
				
						
		function onchange() {
			s = document.getElementById("sel")
			selectValue= ""+s[s.selectedIndex].value;
				if(selectValue == "General") {
						data = every;
						currentGraphs.filterB = selectValue;
						max = d3.max(every,function(d){return d.sum;})+5;
						x.domain([0,data.length]);
						y.domain([0,max]);
					} else if(selectValue == "Rangers") {
						data = rangers;
						currentGraphs.filterB = selectValue;
						max = d3.max(rangers,function(d){return d.sum;})+5;
						x.domain([0,data.length]);
						y.domain([0,max]);
					} else if(selectValue == "Same Day"){
						data = sameDayVisitors;
						currentGraphs.filterB = selectValue;
						max = d3.max(sameDayVisitors,function(d){return d.sum})+5;
						x = d3.scaleLinear().range([0, w-margin.right])
						y = d3.scaleLinear().range([h,0]);
						x.domain([0,data.length]);
						y.domain([0,max]);
					} else if(selectValue == "Different Days"){
						data = diffDayVisitors;
						currentGraphs.filterB = selectValue;
						max = d3.max(diffDayVisitors,function(d){return d.sum})+5;
						x = d3.scaleLinear().range([0, w-margin.right])
						y = d3.scaleLinear().range([h,0]);
						x.domain([0,data.length]);
						y.domain([0,max]);
					} else if (selectValue == "3 or more Days"){
						data = moreThan3;
						currentGraphs.filterB = selectValue;
						max = d3.max(moreThan3,function(d){return d.sum})+5;
						x = d3.scaleLinear().range([0, w-margin.right])
						y = d3.scaleLinear().range([h,0]);
						x.domain([0,data.length-1]);
						y.domain([0,max]);
					} 
					svg.selectAll("circle")
						.remove()
					 svg.selectAll("circle")
						.data(data)
						.enter()
						.append("circle")
						.attr("cx", function (d,i){return x(i);})
						.attr("cy", function (d,i) {return y(d.sum);} )
						.attr("r", 2)
						.attr("fill",function(d){if (d.car == "2P") {return "#EC9787"} else {return "steelblue"}})
							.on("mouseover", function(d){ d3.select(this)
															.transition()
															.duration(500)
															.style("r",12)
															.attr("stroke","black")
															.attr("stroke-width",6)
													    tooldiv.transition().duration(200).style("opacity",.9);
														if(d.days.length > 5){
															tooldiv.style("width","400px")
														} else {
															tooldiv.style("width","80px")
														}
														
														tooldiv.selectAll("text")
														               .data(d.days)
																	   .enter()
																	   .append("span")
																	   .text(function(d) {return d+", "})
																	   
														tooldiv.style("left", (d3.event.pageX + 15) + "px")
																.style("top", (d3.event.pageY - 40) +"px")
														})
						.on("mouseout", function(d) { d3.select(this).transition().duration(500).style("r",2).attr("stroke-width",0)
														tooldiv.transition().duration(500).style("opacity",0).style("width","80px")
														tooldiv.selectAll("span").remove()})			
							
					svg.select(".x")
						.transition()
						.duration(1000)
						.call(d3.axisBottom(x));
					
					svg.select(".y")
						.transition()
						.duration(1000)
						.call(d3.axisLeft(y));
		}									
			
	})}
		
/*
	
function bar1(name,filter){
		currentGraphs.a = "bar1";
		currentGraphs.inputA = name;
		currentGraphs.filterA = filter;	
		
		d3.csv("Lekagul Sensor Data.csv").then(function(data){
			//total
			var total = d3.nest()
					.key(function(d){return d['car-type'];})
					.entries(data)
	                .sort(function(a, b){ return d3.descending(a.values, b.values);});
			//2016
				var temp = data
				var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
				var format = d3.timeFormat("%y");
				temp.forEach(function(d,i) {   
					var time = parseTime(d.Timestamp);
						d.Timestamp = format(time);
					})						
				var data16 = d3.nest()
							.key(function(d){return d['car-type'];})
							.entries(temp)
							.filter(function(d) {console.log(d.values[0].Timestamp)
													if(d.values[i].Timestamp == "15"){
														return d}
							})
													
							.sort(function(a, b){ return d3.descending(a.values, b.values);});
						console.log(16,data16);
			//2015
				//temp1 = data.filter(function(d) {return d['Timestamp'] == "15";})
				var data15 = d3.nest()
							.key(function(d){return d['car-type'];})
							.entries(temp)
							.filter(function(d) {return d['Timestamp'] == "15";})
							.sort(function(a, b){ return d3.descending(a.values, b.values);});
						console.log(15,data15);
						console.log("dat",xa);
				//MONTh
				var base1 = xa;
				console.log("b",base1);
				parser = d3.timeParse("%Y-%m-%d %H:%M:%S");
				formatter = d3.timeFormat("%m-%y");
				base1.forEach(function(d,i) {   
						var time = parser(d.Timestamp);
						d.Timestamp = formatter(time);
						})						
					var monthData = d3.nest()
							.key(function(d){return d['car-type'];})
							.key(function(d) {return d['Timestamp'];})
							.rollup(function (v) {return v.length;}) //va bene così
							.entries(base1)				
			console.log("month",monthData);		
				
			/*	var base = data;
			base.forEach(function(d,i) {   
				var time = parseTime(d.Timestamp);
				d.Timestamp = format(time);
				})			
			base = base.filter(function(d){return d['Timestamp'] == "15";})
			var data15 = d3.nest()
						.key(function(d){return d['car-type'];})
						.entries(base)
						.sort(function(a, b){ return d3.descending(a.values, b.values);});	
			console.log(15,data15)
			//monthly		
			var base = data;
			var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
						var format = d3.timeFormat("%m-%y");
						base.forEach(function(d,i) {   
							var time = parseTime(d.Timestamp);
							d.Timestamp = format(time);
							})						
						var monthData = d3.nest()
								.key(function(d){return d['car-type'];})
								.key(function(d) {return d['Timestamp'];})
								.rollup(function (v) {return v.length;}) //va bene così
								.entries(base)				
			console.log("month",monthData);
	
			})

		*/

function enlarge(){
	var w = parseInt(d3.select(".container").style("width"),10);
	var h =  parseInt(d3.select(".container").style("height"),10);
	var elements = document.querySelectorAll('.container');
		for(var i=0; i<elements.length; i++){
			elements[i].style.width =  "100%";
			elements[i].style.height = "550px";
		}
	d3.select("#svga").remove();
	d3.select("#svgb").remove();
	d3.select("#sel").remove();
	d3.select("#svgc").remove();
	a = currentGraphs.a;
	this[a](currentGraphs.inputA);
	b = currentGraphs.b;
	this[b](currentGraphs.inputB,currentGraphs.filterB);
	c = currentGraphs.c;
	this[c](currentGraphs.inputC);
	}


function reduce(){
	var elements = document.querySelectorAll('.container');
		for(var i=0; i<elements.length; i++){
		elements[i].style.width =  "49%";
		elements[i].style.height = "500px";
		}
	d3.select("#svga").remove();
	d3.select("#svgb").remove();
	d3.select("#sel").remove();
	d3.select("#svgc").remove();
	a = currentGraphs.a;
	this[a](currentGraphs.inputA);
	b = currentGraphs.b;
	this[b](currentGraphs.inputB,currentGraphs.filterB);
	c = currentGraphs.c;
	this[c](currentGraphs.inputC);
}	

function force(name,filter) {   // il force graph sarà un "dettaglio" venuto fuori dalla timeline, come fare? filtro con select (per ogni mese e generale e gli passi i dati per quel periodo?
	// calcolare i dati una volta e salvarli su qualche file. salvarli tipo "entrance2-> ranger1, 32492039 volte"? 
	var margin = {top: 40, right: 20, bottom: 50, left: 10};

	d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
			var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
			var format = d3.timeFormat("%Y-%m-%d");
			base.forEach(function(d,i) {   
			time = parseTime (d.Timestamp)
			d.Timestamp = format(time)}
			)
			var h = document.getElementById(name).clientHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom ;
			var general = d3.nest()
					.key(function(d){return d['gate-name'];})
					.key(function(d){return d['car-id'];})
					.entries(base);
			console.log(general)
			
			var links = d3.nest()
						.key(function(d) {return d['car-id'];})
						.key(function(d) {return d['Timestamp'];})
						.rollup(function (v) {var arr = [];
												for(i=0;i<v.length;i++){
													arr.push(v[i]['gate-name']);
												}
											  return {"path":arr,"car":v[0]["car-id"],"type": v[0]["car-type"]}
						})
						.entries(base)
			console.log(links);
			
			var nodesGeneral = [];
			for (i=0;i<general.length;i++){
				n = general[i].key 
				obj = {"label": n}
				nodesGeneral.push(obj);
			}
			nodesGeneral = nodesGeneral.sort(function(a,b){return d3.ascending(a.label,b.label)})
			console.log(links[0].values[0].value.path)
			var paths = [];
			for(i=0;i<links.length;i++){
				p1 = []
				for(j=0;j<links[i].values.length;j++){
					p = links[i].values[j].value.path
					p1.push(p);
				}
				paths.push(p1);
			}
			listeroni = [];
			//ottieni dati del traffico per ogni singola tratta
			for(k=0;k<links.length;k++){
				var list = [];
				for(j=0;j<paths[k].length;j++){
					for(i=0;i<paths[k][j].length-1;i++){
							curr = paths[k][j][i]
							next = paths[k][j][i+1]
							//console.log(curr,next);
/*							if(list.length == 0) {
								obj = {"origin":curr, "dest":next, "count":1}
								list.push(obj);
								} else {								
									contained(list,curr,next);
								}
*/							obj = {"origin":curr, "dest":next, "count":1}
							list.push(obj);
					}
				}
				listeroni.push(list);
			}
			//cerco di ottenere i dati di traffico "generali" i.e. quante macchine fanno il percorso a->b (un passo di lunghezza)
/*				for(i=0;i<paths[0][0].length-1;i++){
					curr = paths[0][0][i]
					next = paths[0][0][i+1]
					if(list.length = 0){
						obj = {"origin":curr, "dest":next, "count":1}
						list.push(obj);
					} else if(contained(list,curr,next)) {
						list[i].count = list[i].count + 1;
					} else {
						obj = {"origin":curr, "dest":next, "count":1}
						list.push(obj);
					}
				}
*/
//toooooooooooooooooooo heavy, split dati potrebbe aiutare... puoi fare in modo che si possa selezionare tipo il mese/la settimana 
//e vai a caricare quei dati li e basta, dovrebbe farcela? quindi dipenderebbe tutto dal filtro della timeseries
	function contained(list,current,next){
				mod = false;
				for(i=0;i<list.length;i++){
					if (current == list[i].origin && next == list[i].dest){
						list[i].count = list[i].count +1;
						mod = true;
					}
				}
				if(!mod){
				obj = {"origin":current, "dest":next, "count":1}
				list.push(obj);
				}
	}

			var simulation = d3
				  .forceSimulation()
				  .force('charge', d3.forceManyBody().strength(-10))
				  .force('center', d3.forceCenter(w / 2, h / 2))
							
			var svg = d3.select("#"+name).append("svg")
					.attr("id", "svg"+name)
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			var nodeElements = svg.append("g")
					  .attr("class", "nodes")
					  .selectAll("circle")
					  .data(nodesGeneral)
					  .enter().append("circle")
						.attr("r", 5)
						.attr("fill", "blue")
			
			var textElements = svg.append("g")
					  .attr("class", "texts")
					  .selectAll("text")
					  .data(nodesGeneral)
					  .enter().append("text")
						.text(function (node) { return  node.label })
						  .attr("font-size", 10)
						  .attr("dx", 15)
						.attr("dy", 4)
			  simulation.nodes(nodesGeneral).on('tick', () => {
				nodeElements
				  .attr('cx', function (node) { return node.x })
				  .attr('cy', function (node) { return node.y })
				textElements
				  .attr('x', function (node) { return node.x })
				  .attr('y', function (node) { return node.y })
			  })
					  
			
})
}
