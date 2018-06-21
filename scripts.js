var margin = {top: 50, right: 10, bottom: 150, left: 50};

var currentGraphs = {"a": "bar", "b": "scatter", "c":"time","d":"none",
					"inputA":"a","inputB":"b","inputC":"c","inputD":"none"};
	
	
	
	
function bar(name){
		currentGraphs.a = "bar";
		currentGraphs.inputA = name;
		d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
		//	console.log(base);
			var ordered = d3.nest()
					.key(function(d){return d['car-type'];})
					.entries(data)
	                .sort(function(a, b){ return d3.descending(a.values, b.values);});
		console.log(ordered);

								
	//	var margin = {top: 50, right: 20, bottom: 200, left: 50};
			var h = document.getElementById(name).scrollHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;
			
			
			var i;
			count = [];
			for (i=0; i< ordered.length; i++){
				count[i] = ordered[i].values.length;
			}
			
			count.sort(function(x, y){
			return d3.ascending(x.index, y.index);
			})
			
			var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-20]),
			y = d3.scaleLinear().domain([0, 7]).range([0,h]);
			
		//	console.log(d3.max(count));
			ordered = ordered.sort();
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
									   (h + margin.top + 20) + ")")
				  .style("text-anchor", "middle")
				  .text("Number of occurrences");
			
			 // Add the y Axis
			canvas.append("g")
				.call(d3.axisLeft(y));
			
		/*	canvas.selectAll("rect")
					.data(ordered)
					.enter()
					.append("text")
					.attr("fill","black")
					.attr("x", -25)
					.attr("y", function(d,i){return y(i)+20;})
					.text(function(d) {return d.key;});
*/
			
			
			// text label for the y axis
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
					.data(ordered)
					.enter()
					.append("rect")
					.attr("width",function (d){return x(d.values.length);})
					.attr("height", 30)
					.attr("y", function(d,i){return y(i);})
					.attr("fill",function(d){if (d.key == "2P") {return "#EC9787";} else {return "steelblue";}})
					.on("mouseover", function(d,i){
								 canvas.append("text")
									 .attr('id','tooltip')
									 .text(d.values.length)
									 .attr("y", y(i)+20)
									.attr("x", x(d.values.length) + 5)
									.style("font-size","10px");
							})
					.on("mouseout", function(d,i){
									canvas.selectAll("#tooltip")
										.remove();
					})
					.on("click", function(d){
							gateBar(d.key);
							currentGraphs.a = "gateBar";
							currentGraphs.inputA = d.key;
							});
		});
};

function gateBar(key){
	d3.csv("Lekagul Sensor Data.csv").then(function(data){
			console.log(key);
			var filtered = d3.nest()
					.key(function(d){return d['car-type'];})
					.key(function(d){return d['gate-name'];})
					.entries(data)
					.filter(function(d) {return d.key == key;});
					
				
				
					console.log(filtered);
	
		var f = filtered[0].values;
	    f.sort(function(a, b){ return d3.descending(a.values, b.values);});
		
		console.log(f);
		
		
		
		var h = document.getElementById("a").scrollHeight;
		var w = document.getElementById("a").offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;
		
		
		var i;		
		count = [];
		for (i=0; i< filtered[0].values.length; i++){
			count[i] = filtered[0].values[i].values.length;
		}
		
		var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-20]),
		y = d3.scaleLinear().domain([0, count.length]).range([0,h]);
		var xAxis = d3.axisBottom(x);
		var yAxis = d3.axisLeft(y);

			d3.select("#svga").remove();
			
			var canvas = d3.select("#a").append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
					.attr("id", "svga")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
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
					.call(d3.axisLeft(y));
			
		/*	canvas.selectAll("rect")
					.data(ordered)
					.enter()
					.append("text")
					.attr("fill","black")
					.attr("x", -25)
					.attr("y", function(d,i){return y(i)+20;})
					.text(function(d) {return d.key;});
*/
			
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
					.attr("width",function (d){return x(d.values.length);})
					.attr("height", function(){return 5;})
					.attr("y", function(d,i){return y(i);})
					.attr("fill", function(d){if ((d.key).indexOf("ranger") > -1) {
												return "red";
											} else if ((d.key).indexOf("general-gate") > -1) {
												return "green";
											} else if ((d.key).indexOf("entrance") > -1){
												return "blue"; 
											} else if ((d.key).indexOf("camping") > -1){
												return "gray";
											} else { //gates
												return "black";
											}
									})
					.on("click", function(){d3.select("#svga").remove();
											bar("a");
											});

	});

	
}

function assignColor(){
	c 
	return "steelblue";
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


function scatter(name){
		d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
		//	console.log(base);
			var ordered = d3.nest()
					.key(function(d){return d['car-id'];})
					.entries(data);
		//	console.log(ordered);
			
			var max = d3.max(ordered,function(d){return d.values.length;});
		//	console.log(max);
			
			//var margin = {top: 20, right: 20, bottom: 50, left: 50};
			var h = document.getElementById(name).scrollHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;

			
			var x = d3.scaleLinear().domain([0, ordered.length]).range([0, w-margin.right]),
			y = d3.scaleLinear().domain([0, max]).range([h,0]);

			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);

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
									   (h + margin.top + 20) + ")")
				  .style("text-anchor", "middle")
				  .text("Vehicle");
			
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
				  .text("Number of readings");      
				console.log(ordered);
			//manca l'append dei dati 
			 svg.selectAll("circle")
				.data(ordered)
				.enter()
				.append("circle")
				.attr("cx", function (d,i){return x(i);})
				.attr("cy", function (d,i) {return y(d.values.length);} )
				.attr("r", 2)
				.attr("fill","steelblue");
		});
};

	
function time(name){
	d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
		//	console.log(base);
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
			
			var h = document.getElementById(name).scrollHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;

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
									   (h + margin.top + 20) + ")")
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
			
			svg.append("path")
				.datum(ordered1)
				.attr("fill","none")
				.attr("stroke", "steelblue")
				.attr("class","line")
				.attr("stroke-width",1.5)
				.attr("d",line);
	});
};


//Dimension functions

function enlarge(){
	var w = parseInt(d3.select(".container").style("width"),10);
	var h =  parseInt(d3.select(".container").style("height"),10);
	var elements = document.querySelectorAll('.container');
		for(var i=0; i<elements.length; i++){
			elements[i].style.width =  "100%";
			elements[i].style.height = "500px";
		}
	d3.select("#svga").remove();
	d3.select("#svgb").remove();
	d3.select("#svgc").remove();
	a = currentGraphs.a;
	this[a](currentGraphs.inputA);
	b = currentGraphs.b;
	this[b](currentGraphs.inputB);
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
	d3.select("#svgc").remove();
	a = currentGraphs.a;
	this[a](currentGraphs.inputA);
	b = currentGraphs.b;
	this[b](currentGraphs.inputB);
	c = currentGraphs.c;
	this[c](currentGraphs.inputC);
}	