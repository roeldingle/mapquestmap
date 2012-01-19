var Mapquestmap_front= {

	/*display of front*/
	display_front: function(){
		var PLUGIN_NAME = $("#Mapquestmap_PLUGIN_NAME").val();
		var PLUGIN_URL = $("#Mapquestmap_PLUGIN_URL").val();
		
		bMap = $("#PG_"+PLUGIN_NAME+"_staticmap").val();
		
		if(bMap == 1){
			Mapquestmap_front.get_static_map();
		
		}else{
		
			var aMapSetting = {
				iLat: parseFloat($("#PG_"+PLUGIN_NAME+"_lat").val()),
				iLng: parseFloat($("#PG_"+PLUGIN_NAME+"_lng").val()),
				iZoom: 1
			}
				Mapquestmap_front.mapquest_init(aMapSetting);
			
		}
		
	},
	change_title_color: function(){
	
		var back_color = $("#Mapquestmap_background").val();
		var title_color = Mapquestmap_front.oppositeColor(back_color);
		
		
		$("#Mapquestmap_title").css("color", title_color);
	
	},
	oppositeColor : function(color){
		var origDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
		var newDigits = new Array();
		var newColor = "";
		
		$.each(origDigits, function(key, val){
			newDigits[key] = val;
		});
		
		newDigits.reverse()
		color = color.replace("#", "");
		aColor = color.split("")
		
		$.each(aColor, function(){
			for (key in origDigits){
				if (this == origDigits[key]) newColor += newDigits[key];
			}
		})
		
		return "#" + newColor;
	},
	mapquest_init: function(aMapSetting){
		var PLUGIN_NAME = $("#Mapquestmap_PLUGIN_NAME").val();
		var PLUGIN_URL = $("#Mapquestmap_PLUGIN_URL").val();
		
			MQA.EventUtil.observe(window, 'load', function() {
		
			/*Create an object for options*/
			var options={ 
			  elt:document.getElementById('Mapquestmap_map'),       
			  zoom: aMapSetting.iZoom,                                  
			  latLng:{lat:aMapSetting.iLat, lng:aMapSetting.iLng},  
			  mtype: "map",                              
			  bestFitMargin:0,                         
			  zoomOnDoubleClick:true,
				useRightClick:true 			  
			};

			/*Construct an instance of MQA.TileMap with the options object*/
			window.map = new MQA.TileMap(options);
			
			/*set controllers*/
			Mapquestmap_front.mapquest_screen_zoom("smallzoom");
			Mapquestmap_front.mapquest_view_control();
			Mapquestmap_front.mapquest_traffic();
			Mapquestmap_front.mapquest_insetmapcontrol();
			
			
			/*add locations*/
			var aData = Mapquestmap_front.get_locations();
			var poi;
			var sc;
			$.each(aData, function(key, val){
				 function buildPoi(){
				poi=new MQA.Poi({lat:val.lat, lng:val.lng});
				var icon=new MQA.Icon(PLUGIN_URL+"images/balloon.png",25,30);
				poi.setIcon(icon);
					poi.setInfoTitleHTML('<div style="width:120px;">'+val.loc+'</div>');
					poi.setInfoContentHTML('<div style="width:120px;">Latlng: '+val.lat+','+val.lng+'</div>');
					return poi;
				}
	
				function addPoi(){
					window.map.addShape(buildPoi());
					
					var aData = Mapquestmap_front.get_locations();
					var len = aData.length;
					
					if(len == 1){
					window.map.setZoomLevel(5);
					}else{
					window.map.bestFit();
					}
				}
	  
				function addShapeCollection(){
					sc=new MQA.ShapeCollection();
					sc.add(buildPoi());
					window.map.addShapeCollection(sc);
				}
				
				addPoi();
				
			});
			/*end add locations*/

		});
	
	},
	
	get_static_map: function(){
		
		$('#Mapquestmap_static_map_holder').remove();
		
		
		var width = $.trim($("#Mapquestmap_width").val());
		var height = $.trim($("#Mapquestmap_height").val());
		
		var	size = ""+width+","+height;
		
		var count = 1;
		$('#Mapquestmap_map').hide();
		
		var aData = Mapquestmap_front.get_locations();
		var len = aData.length;
		
		var iZoom = (len == 1) ? "&zoom="+3 : "";
			
			var static_map = 'http://www.mapquestapi.com/staticmap/v3/getmap?key=';
			static_map += 'Fmjtd|luu2nuu1ll%2C8g%3Do5-h0tg0'; 
			static_map += '&center='+$("#Mapquestmap_lat").val()+','+$("#Mapquestmap_lng").val()+''; 
			static_map += iZoom; 
			static_map += '&size='+size; 
			static_map += '&type=map'; 
			static_map += '&imagetype=gif'; 
			static_map += '&pois='; 
			$.each(aData, function(key, val){
			static_map += 'orange_1-'+count+','+val.lat+','+val.lng+'|'; 
			count++;
			});
			
			$('#Mapquestmap_holder').append("<div id='Mapquestmap_static_map_holder'  >");
			$('#Mapquestmap_static_map_holder').append("<img src='"+static_map+"' />");
			return;
		
	},
	get_locations: function(){
	
		var strid = "";
		var lat;
		var lng;
		var lng_len;
		var location_str;
		var idx;
		var locations = new Array();
		var sData = new Array;
		var aLocation = new Array();
		var aLatlng = new Array();
		var i = 0;
		var id = $('#Mapquestmap_location_wrap').children("div").size();
		
		$.each($("input[name='Mapquestmap_location[]']"), function(){
			idx = $(this).val();
			 strid += "+"+idx;
	
			location_str = strid.substr(1);
			
			locations = location_str.split("+");
			
			$.each(locations, function(index){
			
				
				aLocation = locations[index].split("(");
				aLocation['loc'] = aLocation[0];
				aLocation['latlng'] = aLocation[1];
				
				
				
				aLatlng = aLocation['latlng'].split(",");
				
				lat = parseFloat(aLatlng[0]);
				lng_len = aLatlng[1].length;
				lng = parseFloat(aLatlng[1].substr(0,lng_len-1));
				
				
				sData[i] = {lat: lat, lng: lng,loc: aLocation['loc']};
			});
			
			
			i++;
		
		});	
		
		return sData;

	},
	mapquest_add_poi: function(loc, lat, lng){
		
		 function buildPoi(){
          var poi=new MQA.Poi({lat:lat, lng:lng});
          poi.setInfoTitleHTML(loc);
         // poi.setInfoContentHTML('Home of the Denver Broncos');
          return poi;
        }
	alert(buildPoi());
        function addPoi(){
          window.map.addShape();
        }
	  
        function addShapeCollection(){
          var sc=new MQA.ShapeCollection();
          sc.add(buildPoi());
          window.map.addShapeCollection(sc);
        }
		
	},
	mapquest_screen_zoom: function(type){
		if(type == "smallzoom"){
		MQA.withModule(type, function() {
				map.addControl(
				new MQA.SmallZoom(),new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
			});
		
		}else{
			MQA.withModule(type, function() {
			map.addControl(
			 new MQA.SmallZoom(), new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
			});
		
		}
	},
	mapquest_insetmapcontrol: function(){
		MQA.withModule('insetmapcontrol', function() {
			var options={
			size:{ width:120, height:120},
			zoom:3,
			mapType:"hyb",
			minimized:false };
			map.addControl(
			new MQA.InsetMapControl(options),
			new MQA.MapCornerPlacement(MQA.MapCorner.BOTTOM_RIGHT)
			);
		});
	},
	mapquest_view_control: function(){
		MQA.withModule('viewoptions', function() {
			map.addControl(
			new MQA.ViewOptions());
		});
	},
	mapquest_traffic: function(){
		MQA.withModule('traffictoggle', function() {
			map.addControl(
			new MQA.TrafficToggle());
		});
	
	},
	
	/*close dialog box with popup class*/
	close_popup: function(){
	$(".popup").popUp("close");
	}


}

$(document).ready(function(){
	Mapquestmap_front.display_front();
	Mapquestmap_front.change_title_color();
});



