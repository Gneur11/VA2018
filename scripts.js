var margin = {top: 50, right: 10, bottom: 150, left: 50};
function bar(name){
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
			
			var x = d3.scaleLinear().domain([0, d3.max(count)]).range([0, w-50]),
			y = d3.scaleLinear().domain([0, 7]).range([0,h]);
			
			console.log(d3.max(count));
			ordered = ordered.sort();
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
				  .text("Number of occurrences");
			
			 // Add the y Axis
		//	canvas.append("g")
			//	.call(d3.axisLeft(y));
			
			canvas.selectAll("rect")
					.data(ordered)
					.enter()
					.append("text")
					.attr("fill","black")
					.attr("x", -25)
					.attr("y", function(d,i){return y(i)+20;})
					.text(function(d) {return d.key;});

			
			
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
					.attr("fill","steelblue")
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
					});
				

		
		
		});
};



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
			console.log(ordered);
			
			var max = d3.max(ordered,function(d){return d.values.length;});
			console.log(max);
			
			//var margin = {top: 20, right: 20, bottom: 50, left: 50};
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
				.attr("fill","steelblue");
			
			
			});
	};
