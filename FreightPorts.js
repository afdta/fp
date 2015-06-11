(function(){

	if(!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")){
		document.getElementById("CityIncomes").innerHTML = '<p style="font-style:italic;text-align:center;margin:30px 0px 30px 0px;">This interactive feature requires a modern browser such as Chrome, Firefox, IE9+, or Safari.</p>';
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

	return true;

	/////////////////OLD CODE BELOW FROM CITY INCOMES



	var DOM = {};
	DOM.WRAP = d3.select("#CityIncomes");
	DOM.LIST = d3.select("#CityList");
	DOM.PIN = d3.select("#PinnedList");
	DOM.INPUT = d3.select("#place-search");
	DOM.INPUT.node().value = null;
	DOM.WCHECK = document.getElementById("width-sampler");





	var selectedTile = null;;
	var scrollTopTween= function(dist){
		try{
			var top = selectedTile.offsetTop;
		}
		catch(e){
			var top = 0;
		}
		var start = DOM.LIST.node().scrollTop;

		return function(time){
			var st = start + (time*(top-start));
			DOM.LIST.node().scrollTop = st;
		}
	}

	var stackedCols = ["#afeaff","#8ac6ff","#65a4e5","#3e83c1","#00649f","#053769"];

	var buildStack = function(sel){

		var svg = sel.selectAll("svg.stacked-bar").data(function(d,i){return [d]});
		svg.enter().append("svg").classed("stacked-bar",true);
		svg.exit().remove();

		var g = svg.selectAll("g").data(function(d,i){
			var l1 = 0;
			var l2 = d.P20_1;
			var l3 = d.P20_1 + d.P20_2;
			var l4 = d.P20_1 + d.P20_2 + d.P20_3;
			var l5 = d.P20_1 + d.P20_2 + d.P20_3 + d.P20_4;
			var l6 = d.P20_1 + d.P20_2 + d.P20_3 + d.P20_4 + d.P15_5;

			var dim =  [{w: d.P20_1, l:l1}, 
			        {w: d.P20_2, l:l2}, 
			        {w: d.P20_3, l:l3}, 
			        {w: d.P20_4, l:l4}, 
			        {w: d.P15_5, l:l5}, 
			        {w: d.P5_5, l:l6}];
			return dim;
		});
		var gEnter = g.enter().append("g");
		gEnter.append("title");
		gEnter.append("rect");
		gEnter.append("text").classed("stacked-bar-label",true);
		g.exit().remove();;

		g.select("rect")
		.attr("width",function(d,i){return d.w+"%"})
		.attr("x",function(d,i){return d.l+"%"})
		.attr({"y":0,"height":25})
		.attr("fill",function(d,i){;
			return stackedCols[i];
		})

		g.select("text")
		.attr({"y":18,"text-anchor":"middle"})
		.attr("x",function(d,i){return ((d.w*0.5)+d.l)+"%";})
		.text(function(d,i){return formatNA(d.w,"num1")+"%";})
		.classed("white-text",function(d,i){
			return i>2;
		});

		g.select("title").text(function(d,i){return formatNA(d.w,"num1")+"%";});

		showHideLabels();
	}

	var showHideLabels = function(){
		try{
			var sRect = DOM.WCHECK.getBoundingClientRect();
			var width = sRect.right - sRect.left; 
			var stackedWidth = width - 5; //5px right padding
		}
		catch(e){
			var stackedWidth = 600; 
		}

		DOM.WRAP.classed("CIMobile",stackedWidth < 450)
		DOM.PIN.style("width",width+"px");

		var labels = DOM.WRAP.selectAll("text.stacked-bar-label");
		labels.classed("hide-label",function(d,i){
			var w = (d.w/100)*stackedWidth;
			if(w < 33){
				var t = true;
			}
			else{
				var t = false
			}
			return t;
		})
	}
	
	window.addEventListener("resize", showHideLabels);

	document.addEventListener("keypress",function(ev){
		try{
			var kc = ev.keyCode;
			if(kc===13){
				DOM.INPUT.node().blur();
			}
		}
		catch(e){
			return null;
		}
	});

	var sortKey = "P5_5";
	var big_cities = true;
	DOM.WRAP.classed("big-cities-only",big_cities);
	var RANKREF = null;

	var sortByKey = function(a,b){
		try{
			if(a[sortKey]===null){var d = 1}
			else if(b[sortKey]===null){var d = -1}
			else{var d = b[sortKey] - a[sortKey]};
		}
		catch(e){
			var d = 0;
		}
		return d;
	};

	var setRankRef = function(dat){
		if(big_cities){
			dat = dat.filter(function(d,i){return d.TotHH >= 100000 || dat.Place === "United States";})
		}

		if(sortKey in {"P20_1":1, "P20_2":1, "P20_3":1, "P20_4":1, "P15_5":1, "P5_5":1}){
			var isNum = true;
			RANKREF = dat.map(function(d,i){return Math.round( d[sortKey]*10 )});
		}
		else{
			sortKey = "Place";
			var isNum = false;
			RANKREF = dat.map(function(d,i){return d.Place});
		}
		RANKREF.sort(function(a,b){return a<=b ? 1 : -1}); //descending
		RANKREF.isNum = isNum;
	}

	var set_ranks = function(sel){
		var ranks = sel.select("span.tile-rank");
		if(RANKREF){
			ranks.text(function(d,i){
				var val = RANKREF.isNum && d[sortKey]!==null ? Math.round( d[sortKey]*10 ) : d[sortKey];
				var r = (d.Place !== "United States" && RANKREF.isNum) ? (calc_rank(val, RANKREF) + ". ") : "";		
				return r;		
			});
		}
	}

	d3.json(REPO + "CityIncomesData.json", function(ERROR, DAT){
		if(ERROR){
			return null;
		}
		else{
			var pinnedDat = DAT.filter(function(d,i){
				return d.Place == "United States";
			});
			var drawPinned = function(dat){
				dat.sort(sortByKey);

				var tiles = DOM.PIN.selectAll("div.place-tile").data(dat);
				tiles.enter().append("div").classed("place-tile",true);
				tiles.exit().remove();
				tiles.classed("now-open",false);

				var tileT = tiles.selectAll("p.tile-title").data(function(d,i){return [d]});
				tileT.enter().append("p").classed("tile-title",true);
				tileT.exit().remove();
				tileT.html(function(d,i){
					return '<span class="tile-rank"></span>' + d.Place;
				})

				var tilePin = tiles.selectAll("p.pin-tile").data(function(d,i){return d.Place !== "United States" ? [d] : []});
				tilePin.enter().append("p").classed("pin-tile",true).text("Remove");
				tilePin.exit().remove();

				tiles.classed("small-city",function(d,i){
					return d.TotHH < 100000 && d.Place !== "United States";
				})

				buildStack(tiles);

				set_ranks(tiles);

				return tiles;
			}

			var CP; //hold copy of DAT
			var drawTiles = function(){
				CP = DAT.filter(function(d,i){
					return !!d.Place && d.Place !== "United States"; //filter out
				});
				CP.sort(sortByKey);

				tiles = DOM.LIST.selectAll("div.place-tile").data(CP);
				tiles.enter().append("div").classed("place-tile",true);
				tiles.exit().remove();
				tiles.classed("now-open",false);

				var tileT = tiles.selectAll("p.tile-title").data(function(d,i){return [d]});
				tileT.enter().append("p").classed("tile-title",true);
				tileT.exit().remove();
				tileT.html(function(d,i){
					return '<span class="tile-rank"></span>' + d.Place;
				})

				var tilePin = tiles.selectAll("p.pin-tile").data(function(d,i){return [d]});
				tilePin.enter().append("p").classed("pin-tile",true).text("Compare");
				tilePin.exit().remove();

				//stacked bar charts -- drawn here using buildStack();
				buildStack(tiles); //after resetting ref, rebuild stacked bar charts

				tiles.on("mousedown",function(d,i){
					var thiz = d3.select(this);
					selectedTile = this;
					DOM.LIST.transition().duration(500).tween("scrollTop",scrollTopTween)
						.each("end",function(d,i){
							this.scrollTop = selectedTile.offsetTop; //in case anything happens during transition, correct at end
						});
				});	

				tiles.classed("small-city",function(d,i){
					return d.TotHH < 100000 && d.Place !== "United States";
				})

				setRankRef(CP);
				set_ranks(tiles);
				return tiles;
			} //end drawTiles function

			var tiles = drawTiles(); //note: this initializes CP and RANKREF
			var pinned_tiles = drawPinned(pinnedDat);

			var removePinned = function(d,i){
				var city = d.Place;
				pinnedDat = pinnedDat.filter(function(d,i){return d.Place !== city});
				pinned_tiles = drawPinned(pinnedDat);
				pinned_tiles.select(".pin-tile").on("mousedown",removePinned); //rebind
				tiles.filter(function(d,i){return d.Place === city}).classed("place-is-pinned",false); //return to list
				DOM.WRAP.classed("max-pinned",pinnedDat.length > 4);
			}
			pinned_tiles.select(".pin-tile").on("mousedown",removePinned);

			tiles.select(".pin-tile").on("mousedown",function(d,i){
				d3.event.stopPropagation();
				if(pinnedDat.length > 4){
					DOM.WRAP.classed("max-pinned",true);
				} //can't keep pinning
				else{
					DOM.WRAP.classed("max-pinned",false);
					d3.select(this.parentNode).classed("place-is-pinned",true);
					pinnedDat.push(d);
					pinned_tiles = drawPinned(pinnedDat);
					pinned_tiles.select(".pin-tile").on("mousedown",removePinned);
					if(pinnedDat.length > 4){
						DOM.WRAP.classed("max-pinned",true);
					} //can't keep pinning					
				}

			});

			var buttons = d3.selectAll(".pctl-button");
			var limit100 = d3.select("#limit-100k");

			var setButtonBack = function(){
				buttons
				.style("background-color",function(d,i){
					return d3.select(this).classed("button-selected") ? stackedCols[i] : "#eeeeee";
				})
				buttons.select("p").style("color",function(d,i){
					var s = d3.select(this.parentNode).classed("button-selected");
					return s && i > 2 ? "#ffffff" : "#333333";
				})
			}
			setButtonBack();
			buttons.select("div").style("background-color",function(d,i){return stackedCols[i];}); 

			var pressButton = function(){
				if(!tiles){return null}
				buttons.classed("button-selected",false);
				var thiz = d3.select(this);
				thiz.classed("button-selected",true);
				var id = thiz.attr("id");
				if(id=="select-p5_5"){sortKey = "P5_5";} 
				else if(id=="select-p15_5"){sortKey = "P15_5";}
				else if(id=="select-p20_4"){sortKey = "P20_4";}
				else if(id=="select-p20_3"){sortKey = "P20_3";}
				else if(id=="select-p20_2"){sortKey = "P20_2";}
				else if(id=="select-p20_1"){sortKey = "P20_1";}
				else{
					sortKey = "Place";
				}
				DOM.LIST.node().scrollTop = 0;
				
				//re-rank
				setRankRef(CP); //depends: sortKey (set above) and big_cities (not set here, defaults to true)
				set_ranks(tiles);
				set_ranks(pinned_tiles);

				//and re-sort
				tiles.sort(sortByKey);	
				setButtonBack();
			}
			buttons.on("mousedown",pressButton);

			var filterTiles = function(query){
				if(!tiles){return null;}
				else if(!query){tiles.classed("hidden-tile",false)}
				else{
					tiles.classed("hidden-tile",function(d,i){
						return d.Place.search(query.reg) === -1;
					});
				}
				showHideLabels();
			}

			limit100.on("mousedown",function(d,i){
				if(tiles){
					var sel = limit100.classed("limit-100k-selected");
					limit100.classed("limit-100k-selected",!sel);
					DOM.WRAP.classed("big-cities-only",!sel);
					big_cities = !sel;

					//re-rank
					setRankRef(CP); //depends: sortKey (not set here) and big_cities (set here, defaults to true)
					set_ranks(tiles);
					set_ranks(pinned_tiles);					
				}

			})

			var inputTimer;
			DOM.INPUT.on("input",function(d,i){
				clearTimeout(inputTimer);
				var val = this.value;
				var reg = new RegExp("\\b" + val,"i");
				var reg0 = new RegExp("^"+val,"i");
				if(val.length > 0){
					var searchQuery = {string:val, reg:reg, reg0:reg0, len:val.length};
				}
				else{
					var searchQuery = null;
					this.value = null;
				}
				inputTimer = setTimeout(function(){filterTiles(searchQuery)},50);
			});	
	
		} 
	}); //end d3.json
	
})();