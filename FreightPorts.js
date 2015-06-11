(function(){

	if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")){
		document.getElementById("FreightPortsWrap").innerHTML = '<p style="font-style:italic;text-align:center;margin:30px 0px 30px 0px;">This interactive feature requires a modern browser such as Chrome, Firefox, IE9+, or Safari.</p>';
		return null;
	}

	var REPO = "/~/media/multimedia/interactives/2015/FreightPorts/";
	var REPO = "./";

	var DOM = {};
	DOM.WRAP = d3.select("#FreightPorts");
	DOM.BOXES = DOM.WRAP.selectAll(".rank-box");
	DOM.MODES = DOM.WRAP.select("#freight-port-mode").select("svg");
	DOM.COMMS = DOM.WRAP.select("#freight-port-comm");
	DOM.ODD = DOM.WRAP.select("#freight-port-odd");
	DOM.ODI = DOM.WRAP.select("#freight-port-odi");

	var formats = {};
		formats.id = function(d){return d};
		formats.pch = d3.format("+,.1%");
		formats.pct = d3.format(",.1%");
		formats.rnk = d3.format("d");
		formats.num = d3.format(",.0f");
		formats.num1 = d3.format(",.1f");
		formats.num2 = d3.format(",.2f");
		formats.numch = d3.format("+,.1f");
		formats.doll = d3.format("$,.0f");
		formats.doll3 = d3.format("$,.3f");
		formats.pdiff = function(d){return formats.numch(d) + "pp"}
		formats.pct100 = function(d){return formats.num1(d) + "%"}

	var formatNA = function(v, format){
		try{
			if(typeof v === "undefined" || v === null || isNaN(v) || !isFinite(v)){
	        	var l = "n/a";
	    	}
	    	else{
	    		var l = formats[format](v);	
	    	}
		}
		catch(e){
			var l = "n/a";
		}
		return l;
	}

	var calc_rank = function(val, outof){
		try{
			var i = outof.indexOf(val) + 1;
			var rank = (i>0 && val!==null) ? i : null;
		}
		catch(e){
			if(!Array.prototype.indexOf){
				var rank = null;
			}
			else{
				var rank = null;
			}
		}
		finally{
			return rank;
		}
	}


	d3.json(REPO + "data/FreightPortsData.json", function(ERROR, DAT){
		if(ERROR){
			return null;
		}
		else{
			DAT = {test:DAT};
			function drawPlace(id){
				try{
					var dat = DAT[id];
					var tot = dat.TOT[0];
					var maxmode = d3.max(dat.MODE, function(d,i){return d.Value_2010/tot});
					var modes = dat.MODE.map(function(d,i,a){
						var sh = d.Value_2010/tot;
						var w = ((sh/maxmode)*65)+"%"; //see below
						var l = formatNA(d.Value_2010, "doll3");
						var mode = "Mode: " + d.I_Mode;
						return {share:sh, width:w, label:l, mode:mode}
					});
					var maxcomm = d3.max(dat.COMM, function(d,i){return d.Value_2010/tot});
					var comms = dat.COMM.map(function(d,i,a){
						var sh = d.Value_2010/tot;
						var w = ((sh/maxcomm)*65)+"%"; //svg is set to 115% of container -- this brings plot area to around 80%
						var l = formatNA(d.Value_2010, "doll3");
						var comm = "Commodity: " + d.Group_ID;
						return {share:sh, width:w, label:l, comm:comm}
					});
					//var comms = dat.COMM;
					var odd = dat.ODD;
					var odi = dat.ODI;
				}
				catch(e){
					console.log(e);
					var dat = null;
					var modes = [];
					var comms = [];
					var odd = [];
					var odi = [];
				}
				DOM.WRAP.select("#port-total-val").text( formatNA(dat.TOT[0],"doll") );
				DOM.WRAP.select("#port-total-local").text( formatNA(dat.LOC[0],"pct") );
				
				//MODE PLOT
				var mode_axes = DOM.MODES.select("#freight-port-mode-anno").selectAll("path").data([1]);
				mode_axes.enter().append("path");
				mode_axes.exit().remove();
				mode_axes.attr("d","M0,0 l0, 250")
				.attr({"fill":"none","stroke":"#dddddd","stroke-width":"1px"})
				.style("shape-rendering","crispEdges");

				var mode_g = DOM.MODES.select("#freight-port-mode-plot").selectAll("g").data(modes);
				mode_g.enter().append("g").append("rect"); //also append a rect
				mode_g.exit().remove();
				
				mode_g.attr("transform",function(d,i){return "translate(0,"+((i*33)+10)+")"});
				
				var mode_t = mode_g.selectAll("text").data(function(d,i){
					return [d, d];
				});
				mode_t.enter().append("text");
				mode_t.exit().remove();
				mode_t.attr("x",function(d,i){
					return i===0 ? 0 : d.width;
				}).attr("y",function(d,i){
					return i===0 ? 12 : 15 + 11;
				}).text(function(d,i){
					return i===0 ? d.mode : d.label;
				}).attr("dx", function(d,i){
					return i===0 ? "2px" : "3px";
				}).style("font-size",function(d,i){
					return i===0 ? "13px" : "13px";
				}).classed("gray-text",function(d,i){return i===1});

				mode_g.select("rect").attr({"x":0,"y":15,"height":"12px","fill":"#20558A"})
				.attr("width",function(d,i){
					return d.width; 
				})

				//COMM PLOT
				var comm_axes = DOM.COMMS.select("#freight-port-comm-anno").selectAll("path").data([1]);
				comm_axes.enter().append("path");
				comm_axes.exit().remove();
				comm_axes.attr("d","M0,0 l0, 250")
				.attr({"fill":"none","stroke":"#dddddd","stroke-width":"1px"})
				.style("shape-rendering","crispEdges");

				var comm_g = DOM.COMMS.select("#freight-port-comm-plot").selectAll("g").data(comms);
				comm_g.enter().append("g").append("rect"); //also append a rect
				comm_g.exit().remove();
				
				comm_g.attr("transform",function(d,i){return "translate(0,"+((i*33)+10)+")"});
				
				var comm_t = comm_g.selectAll("text").data(function(d,i){
					return [d, d];
				});
				comm_t.enter().append("text");
				comm_t.exit().remove();
				comm_t.attr("x",function(d,i){
					return i===0 ? 0 : d.width;
				}).attr("y",function(d,i){
					return i===0 ? 12 : 15 + 11;
				}).text(function(d,i){
					return i===0 ? d.comm: d.label;
				}).attr("dx", function(d,i){
					return i===0 ? "2px" : "3px";
				}).style("font-size",function(d,i){
					return i===0 ? "13px" : "13px";
				}).classed("gray-text",function(d,i){return i===1});

				comm_g.select("rect").attr({"x":0,"y":15,"height":"12px","fill":"#20558A"})
				.attr("width",function(d,i){
					return d.width; 
				})

				//COMM
				/*var comm_d = DOM.COMMS.selectAll("div").data(comms);
				comm_d.enter().append("div");
				comm_d.exit().remove();
				comm_d.style({"display":"table-row"})

				var comm_cell = comm_d.selectAll("p").data(function(d,i){return ["Commodity: "+d.Group_ID, formatNA(d.Value_2010,"doll3")]});
				comm_cell.enter().append("p");
				comm_cell.exit().remove();

				comm_cell.style("width",function(d,i){return i===0 ? "72%" : "28%"})
				.classed("freight-table-cell",true)
				.style("text-align",function(d,i){return i===0 ? "left" : "right"})
				.text(function(d,i){return d});*/

				//ODI
				var odi_d = DOM.ODI.selectAll("div").data(odi);
				odi_d.enter().append("div");
				odi_d.exit().remove();
				odi_d.classed("freight-table-row",true);

				var odi_cell = odi_d.selectAll("p").data(function(d,i){return [(i+1)+". "+d.Intl_Geography, formatNA(d.Value_2010,"doll3")]});
				odi_cell.enter().append("p");
				odi_cell.exit().remove();

				odi_cell.style("width",function(d,i){return i===0 ? "72%" : "28%"})
				.classed("freight-table-cell",true)
				.style("text-align",function(d,i){return i===0 ? "left" : "right"})
				.text(function(d,i){return d});

				//ODD
				var odd_d = DOM.ODD.selectAll("div").data(odd);
				odd_d.enter().append("div");
				odd_d.exit().remove();
				odd_d.classed("freight-table-row",true);

				var odd_cell = odd_d.selectAll("p").data(function(d,i){return [(i+1)+". "+d.Dom_Geography, formatNA(d.Value_2010,"doll3")]});
				odd_cell.enter().append("p");
				odd_cell.exit().remove();

				odd_cell.style("width",function(d,i){return i===0 ? "72%" : "28%"})
				.classed("freight-table-cell",true)
				.style("text-align",function(d,i){return i===0 ? "left" : "right"})
				.text(function(d,i){return d});

				resizer();
			}
			drawPlace("test");
		}
	});

	var resizer = function(){
		var maxRankBox = 40;
		DOM.BOXES.select("div").each(function(d,i,a){
			try{
				var r = this.getBoundingClientRect();
				var h = r.bottom - r.top;
			}
			catch(e){
				var h = 40;
			}
			finally{
				if(h > maxRankBox){maxRankBox = h}
			}
		});
		DOM.BOXES.style("min-height",maxRankBox+"px");
	}

	window.addEventListener("resize", resizer);
	
})();