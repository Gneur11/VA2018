function bar(name){
		d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
		//	console.log(base);
			var ordered = d3.nest()
					.key(function(d){return d['car-type'];})
					.entries(data);
	
	//	console.log(ordered);

								
		var margin = {top: 20, right: 20, bottom: 50, left: 50};
			var h = document.getElementById(name).scrollHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;

			var i;
		count = [];
		for (i=0; i< ordered.length; i++){
			count[i] = ordered[i].values.length;
		}
			
			
			var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-100]),
			y = d3.scaleLinear().domain([0, 7]).range([0,h]);
			
			console.log(d3.max(count));
			
			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);

			var canvas = d3.select("#"+name).append("svg")
					.attr("width", w + margin.left + margin.right)
					.attr("height", h + margin.top + margin.bottom)
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
				  .text("Vehicle");
			
			 // Add the y Axis
			canvas.append("g")
				.call(d3.axisLeft(y));
	
			// text label for the y axis
			canvas.append("text")
				.attr("transform", "rotate(-90)")
				  .attr("y", 0 - margin.left)
				  .attr("x",0 - (h / 2))
				  .attr("dy", "1em")
				  .style("text-anchor", "middle")
				  .text("Number of readings");      
		
		canvas.selectAll("rect")
					.data(ordered)
					.enter()
					.append("rect")
					.attr("width",function (d){return x(d.values.length);})
					.attr("height", 30)
					.attr("y", function(d,i){return y(i);})
					.attr("fill","blue")
					
	/*	canvas.selectAll("text")
					.data(ordered)
					.enter()
					.append("text")
					.attr("fill","black")
					.attr("y", function(d,i){return y(i);})
					.text(function(d) {return d.key;});
		*/	
		});
};


 function test(name) {
	var svgContainer = d3.select("#"+name).append("svg")
                                     .attr("width", 200)
                                     .attr("height", 200);
 
 //Draw the Rectangle
 var rectangle = svgContainer.append("rect")
                             .attr("x", 10)
                             .attr("y", 10)
                            .attr("width", 50)
                            .attr("height", 100)
							.attr("transform","translate("+20+","+20+")");

};

function scatter(name){
		d3.csv("Lekagul Sensor Data.csv").then(function(data){
			var base = data;
		//	console.log(base);
			var ordered = d3.nest()
					.key(function(d){return d['car-id'];})
					.entries(data);
			console.log(ordered);
			
			var max = d3.max(ordered,function(d){return d.values.length;});
			console.log(max);
			
			var margin = {top: 20, right: 20, bottom: 50, left: 50};
			var h = document.getElementById(name).scrollHeight;
			var w = document.getElementById(name).offsetWidth;
			    w = w - margin.left - margin.right;
				h = h - margin.top - margin.bottom;

			
			var x = d3.scaleLinear().domain([0, ordered.length]).range([0, w]),
			y = d3.scaleLinear().domain([0, max]).range([h,0]);

			var xAxis = d3.axisBottom(x);
			var yAxis = d3.axisLeft(y);

			var svg = d3.select("#"+name).append("svg")
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
				
			//manca l'append dei dati 
			 svg.selectAll("circle")
				.data(ordered)
				.enter()
				.append("circle")
				.attr("cx", function (d,i){return x(i);})
				.attr("cy", function (d,i) {return y(d.values.length);} )
				.attr("r", 2)
				.attr("fill","blue");
			
		console.log(y(40));
		console.log("ciao");
		console.log(x(20));
			
			
			
			});
			
	};
