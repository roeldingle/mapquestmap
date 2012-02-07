var Mapquestmap_admin= {
	map: null,
	zoom: null,
	sc: null,
	p: null,
	set_size_custom: function(){
		
		var width = $.trim($("#Mapquestmap_width").val());
		var height = $.trim($("#Mapquestmap_height").val());
		
		$("#Mapquestmap_custom_width").val(width);
		$("#Mapquestmap_custom_height").val(height);
	
	},
	
	preview: function(){
	
		if(oValidator.formName.getMessage('Mapquestmap_form')){
			var width = $.trim($("#Mapquestmap_width").val());
			var height = $.trim($("#Mapquestmap_height").val());
			
			var style = "width:"+width+"px; height:"+height+"px;";
			$('#Mapquestmap_map').attr("style",style);
			Mapquestmap_admin.map.setSize(new MQA.Size(width,height));
			
			Mapquestmap_admin.get_static_map();
			Mapquestmap_admin.get_locations();
			
		}
		
	},
	display: function(){
		
		bMap = $("#Mapquestmap_staticmap").val();
		Mapquest.init();
		Mapquest.zoom();
		Mapquest.view_control();
		Mapquest.traffic();
		Mapquest.insetmapcontrol();
		
		if(bMap == 1){
			Mapquestmap_admin.get_static_map();
		}
		if($("#Mapquestmap_bcustom").val() == 1){
			
			Mapquestmap_admin.change_mapsize();
		}
		
		/*give locations*/
		Mapquestmap_admin.map.removeAllShapes();
		var aData = Mapquestmap_admin.get_locations();
		$.each(aData, function(key, val){
			Mapquest.add_poi(val.loc,val.lat,val.lng);
		
		});
	},
	remove_location: function(id){
	$(".err_div_loc").remove();
		Mapquestmap_admin.close_popup();
		var size = $('#Mapquestmap_location_wrap').children("div").size();
		if(size <= 1){
		$("#Mapquestmap_"+id).append("<span style='color:red;font-style:italic;' class='err_div_loc' >You must maintain at least one(1) location.</span>");
		}else{
		$("#Mapquestmap_"+id).remove();
		}
		$('#Mapquestmap_static_map').attr('checked', false);
		Mapquestmap_admin.get_static_map();
		
		Mapquestmap_admin.map.removeAllShapes();
		var aData = Mapquestmap_admin.get_locations();
		$.each(aData, function(key, val){
			Mapquest.add_poi(val.loc,val.lat,val.lng);
		
		});
		
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
	setting_submit: function(form){
		var PLUGIN_NAME = $("#PLUGIN_NAME").val();
		var PLUGIN_URL = $("#PLUGIN_URL").val();
		
		Mapquestmap_admin.close_popup();
		
		
		
		if(oValidator.formName.getMessage('Mapquestmap_form')){
			
		//if custom preview map in custom 
		var sMapsize = $("#Mapquestmap_mapsize").val();
		if(sMapsize == "custom"){
			Mapquestmap_admin.preview();
		}
			
			
			
			var str_loc_val = '';
			$.each($("input[name='Mapquestmap_location[]']"), function(){
				loc_val = $(this).val();
				 str_loc_val += "+"+loc_val;
			 });
			 location_str = str_loc_val.substr(1);
		
			var pmq_title = $("#"+PLUGIN_NAME+"_map_title").val();
			var pmq_size = ($("#"+PLUGIN_NAME+"_mapsize").val() == "custom")? "custom,"+$.trim($("#Mapquestmap_width").val())+","+$.trim($("#Mapquestmap_height").val()) : $("#"+PLUGIN_NAME+"_mapsize").val();
			var pmq_static_map = ($('#'+PLUGIN_NAME+'_static_map:checked').val() !== undefined)?1:0;
			var pmq_locations = location_str;
			var pmq_border_width = $("#"+PLUGIN_NAME+"_border_width").val();
			var pmq_border_color = $("#"+PLUGIN_NAME+"_border_color").val();
			var pmq_background = $("#"+PLUGIN_NAME+"_background").val();
			
			
				$.ajax({  
					url: usbuilder.getUrl("apiExec"),
					type: 'post',
					dataType: 'json',
					data: {
					action: 'setting_submit',
					get_pmq_title: pmq_title,
					get_pmq_size: pmq_size,
					get_pmq_static_map: pmq_static_map,
					get_pmq_locations: pmq_locations
					
				},
					success: function(data){
					
					if(data.Data === true){
						oValidator.generalPurpose.getMessage(true, "Saved successfully");
						Mapquestmap_admin.close_popup();
						scroll(0,0);
						}else{
							oValidator.generalPurpose.getMessage(false, "Failed");
							Mapquestmap_admin.close_popup();
							scroll(0,0);
						}
				
					}
				});
		}
		
	},
	add_location: function(locations,lat,lng){
		Mapquestmap_admin.close_popup();
		var PLUGIN_URL = $("#PLUGIN_URL").val();
		var id = $('#Mapquestmap_location_wrap').children("div").size() +1;
		var sLocation = '';
		sLocation += '<div class="add_location" id="Mapquestmap_'+id+'" >';
		sLocation += '<a href="#"><img src="/_sdk/img/mapquestmap/balloon.gif" class="balloon" /></a>&nbsp';
		sLocation += '<input type="text" readonly name="Mapquestmap_location[]" id="Mapquestmap_location_'+id+'" value="'+locations+'('+lat+','+lng+')" class="textbox" />&nbsp';
		sLocation += '<a  href="javascript:Mapquestmap_admin.remove_location('+id+');"  ><img src="/_sdk/img/mapquestmap/close_btn.gif" class="close_btn" /></a>';
		sLocation += '</div>';
		
		$("#Mapquestmap_location_wrap").append(sLocation);
		
		$('#Mapquestmap_static_map').attr('checked', false);
		Mapquestmap_admin.get_static_map();
		
		Mapquest.add_poi(locations,lat,lng);
	
		
	},
	
	set_search: function(){
		
	var PLUGIN_NAME = $("#PLUGIN_NAME").val();
	var PLUGIN_URL = $("#PLUGIN_URL").val();
	var search = $.trim($("#Mapquestmap_searchtext").val());
	$("#Mapquestmap_searchresult").empty();
	
	if(oValidator.formName.getMessage('Mapquest_search_popup')=== false || search == ""){
	
			$("#Mapquestmap_searchtext").val('');
			$("#Mapquestmap_searchtext").focus();
						
		}else{
	
			$("#Mapquestmap_searchresult").append('<div id="Mapquestmap_img_container" style="margin:50px 50px 50px 50px" ><img src="/_sdk/img/mapquestmap/loader.gif" ></div>');
			$("#Mapquestmap_searchresult").append("<div id='Mapquestmap_err'></div>");
			
			var s = setTimeout(function(){
			$("#Mapquestmap_img_container").remove();
			$("#Mapquestmap_err").append("<p class='error_message'>Error retriving data.<p>");
			return;
			}
			,60000);
			
			$.ajax({
				url: usbuilder.getUrl("apiGet"),
				type: 'post',
				dataType: 'json',
					data: {
						action: 'search',
						get_search: search
					},
					success: function(data){
						
						if (data['Data'].length > 0){
							$("#Mapquestmap_searchresult").empty();
								var string = "<ul>"
								$.each(data['Data'], function(key, val){
								string += '<li><span class="desc"><a href="javascript:Mapquestmap_admin.add_location(\'' + val['sAdd'] + '\','+val['sLat']+','+val['sLng']+')">' + val['sAdd'] + '</a></span></li>';
								});
								string += '</ul>'
								$("#Mapquestmap_searchresult").append(string);
							}
							else {
								$("#Mapquestmap_searchresult").empty().append("<p class='error_message'>No results found.<p>");
							}
							 
							
						}
				});
		}
		
	},
	
	open_dialog: function(){
		$(".err_div_loc").remove();
		Mapquestmap_admin.close_popup();
		$("#dialog_search").remove();
		$("body").append("<div id='dialog_search' class='popup' style='display:none' ></div>");
		
		popup.load("dialog_search").skin("admin").layer({
				width: 450,
				title: "Add Location",
				resize: false,
				draggable: false
				
				
		});
			var sData ='';
				sData +='<div class="Mapquestmap_searchcontent"><form id="Mapquest_search_popup"><label>Search:</label>&nbsp;<input id="Mapquestmap_searchtext"  type="text"  fw-filter="isFill" /></div>';
				sData +='<div id="Mapquestmap_searchresult"></div></form><br />';
				sData +='<center><input  type="button" class="btn_apply" value="Search" onclick="Mapquestmap_admin.set_search()"/> &nbsp';
				sData +='<input  type="button" class="btn_apply" value="Close" onclick="Mapquestmap_admin.close_popup()"/></center>';
				$("#dialog_search").append(sData);
				
	
	},
	
	get_static_map: function(){
		
		var bValidForm = "true";//$("#Mapquestmap_form").validateForm(); 
		if(bValidForm === false){ 
			$('#Mapquestmap_static_map').attr("checked",false);
	     }else{
			$('#Mapquestmap_static_map_holder').remove();
			
			if($('#Mapquestmap_static_map:checked').val() !== undefined){
			var size = $('#Mapquestmap_mapsize').val();
			
			if(size == "custom"){
			var width = $.trim($("#Mapquestmap_custom_width").val());
			var height = $.trim($("#Mapquestmap_custom_height").val());
			
				size = ""+width+","+height;
			}
			
			
			var count = 1;
			$('#Mapquestmap_map').hide();
			
			var aData = Mapquestmap_admin.get_locations();
			var len = aData.length;
			
			var iZoom = (len == 1 || len == 0) ? "&zoom="+3 : "";
				
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
			}
			Mapquestmap_admin.map.removeControl(Mapquestmap_admin.traffic);
			Mapquestmap_admin.map.removeControl(Mapquestmap_admin.view_control);
			
			Mapquest.view_control();
			Mapquest.traffic();
			
			$('#Mapquestmap_map').show();
		}
		
	},
	get_mapsize: function(){
		var size = $('#Mapquestmap_mapsize').val();
		var style = '';
		switch(size){
			case "640,480" :
			style = "width:640px; height:480px;";
			break;
			case "425,350" :
			style = "width:425px; height:350px;";
			break;
			case "300,300" :
			style = "width:300px; height:300px;";
			break;
			case "custom" :
			style = "custom";
			break;
		}
		return style;
	
	},
	change_mapsize: function(){
		
		Mapquestmap_admin.close_popup();
		var style = Mapquestmap_admin.get_mapsize();
	
		
		$("#Mapquestmap_custom_container").empty();
		$("#Mapquestmap_custom_container").hide();
		$("#Mapquestmap_preview").hide();
		if(style == "custom"){
			Mapquestmap_admin.display_custom();
			$("#Mapquestmap_preview").show();
			
		}else{
		
		$('#Mapquestmap_map').attr("style",style);
		var size = $('#Mapquestmap_mapsize').val();
		var ALatlng = new Array();
		aLatlng = size.split(",");
		Mapquestmap_admin.map.setSize(new MQA.Size(parseFloat(aLatlng[0]),parseFloat(aLatlng[1])));
		
		Mapquestmap_admin.get_static_map();
		Mapquestmap_admin.get_locations();
		
		}
		
	},
	display_custom: function(evt){
	var PLUGIN_NAME = $("#PLUGIN_NAME").val();
	
	
	$("#"+PLUGIN_NAME+"_custom_container").show();
	var cus_width = $("#"+PLUGIN_NAME+"_custom_width").val();
	var cus_height = $("#"+PLUGIN_NAME+"_custom_height").val();
	
	$("#"+PLUGIN_NAME+"_custom_container").empty();
	var sCustomData = '';
	sCustomData += '<table height="80px" class="custom_size"  ><tbody><tr><td width="20"><span class="neccesary">*</span><label for="module_label">Width</label></td>';
	sCustomData += '<td ><input name="Mapquestmap_width" id="Mapquestmap_width"  class="fix2" type="text" size="2"  onkeyup="Mapquestmap_admin.set_size_custom();" value="'+cus_width+'" fw-filter="isFill&isNumber"  /></td>';
	sCustomData += '</tr><tr><td width="20"><span class="neccesary">*</span><label for="module_label">Height</label>&nbsp;</td><td>';
	sCustomData += '<input id="Mapquestmap_height" name="Mapquestmap_height" class="fix2" type="text" size="2"  onkeyup="Mapquestmap_admin.set_size_custom();" value="'+cus_height+'" fw-filter="isFill&isNumber"  />';
	sCustomData += '</tr></tbody></table>';
	
	$("#"+PLUGIN_NAME+"_custom_container").append(sCustomData);
	
	//&isNumberMin[300]&isNumberMax[480]   &isNumberMin[300]&isNumberMax[640]
	
	},	
	display_option: function(evt){
	var PLUGIN_NAME = $("#PLUGIN_NAME").val();
	
	
		if(evt == 'open'){
			$(".module_title2").show();
			$(".module_title").hide();
			$("#"+PLUGIN_NAME+"_option_table").slideDown("slow").show();
		}else{
			$(".module_title").show();
			$(".module_title2").hide();
			$("#"+PLUGIN_NAME+"_option_table").slideUp("slow").hide();
		
		}
		
		
	
		
	},
	success_display: function(data){
		var PLUGIN_NAME = $("#PLUGIN_NAME").val();
		var PLUGIN_URL = $("#PLUGIN_URL").val();
		
		if(data === true){
			$(".msg_suc_box p span").empty().text("Saved successfully.");
			$(".msg_suc_box").show(0, function(){
				
			}).delay(3000).fadeOut("slow",function(){
				
			});
		}else {
			$(".msg_suc_box p span").empty().text("No data changed.");
			$(".msg_suc_box").show(0, function(){
			
			}).delay(3000).fadeOut("slow",function(){
				
			});	
		}

	},
	/*reset to default*/
	reset_default: function(){
		
		$("#Mapquestmap_form_reset").submit();
		
	},

	removeTags: function(string){
		   
        if(string){
          var mydiv = document.createElement("div");
           mydiv.innerHTML = string;
            if (document.all){
                return mydiv.innerText;
            }   
            else{
                return mydiv.textContent;
            }                           
      }
	},
	/*close dialog box with popup class*/
	close_popup: function(){
		popup.close("dialog_search");
	}
	
}

var Mapquest ={
	add_poi: function(loc, lat, lng){
		var PLUGIN_URL = $("#PLUGIN_URL").val();
		 function buildPoi(){
				p=new MQA.Poi({lat:lat, lng:lng});
					
				var icon=new MQA.Icon("/_sdk/img/mapquestmap/balloon.png",25,30);
				p.setIcon(icon);
				p.setInfoTitleHTML('<div style="width:100px;text-align:center;font-weight:bold">'+loc+'</div>');
				p.setInfoContentHTML('lat:'+lat+' lng:'+lng);
					return p;
				}
	
				function addPoi(){
					Mapquestmap_admin.map.addShape(buildPoi());
					
					var aData = Mapquestmap_admin.get_locations();
					var len = aData.length;
					
					if(len == 1){
					Mapquestmap_admin.map.setZoomLevel(5);
					}else{
					Mapquestmap_admin.map.bestFit();
					}
				}
	  
				function addShapeCollection(){
					sc=new MQA.ShapeCollection();
					sc.add(buildPoi());
					Mapquestmap_admin.map.addShapeCollection(sc);
				}
				
				addPoi();
		
	},
	option: function(){
		var PLUGIN_NAME = $("#PLUGIN_NAME").val();
		var PLUGIN_URL = $("#PLUGIN_URL").val();
	
		var options={ 
			  elt:document.getElementById(PLUGIN_NAME+'_map'),      
			  zoom: 1,                                  
			  mtype: "map", 
				latLng:{lat:parseFloat($("#Mapquestmap_lat").val()), lng:parseFloat($("#Mapquestmap_lng").val())},  	
			  bestFitMargin:0,                         
			  zoomOnDoubleClick:true ,
				useRightClick:true 				  
			};
			
			return options;
	},
	init: function(){
	var style = Mapquestmap_admin.get_mapsize();

	if(style == "custom"){
		var width = $("#Mapquestmap_custom_width").val();
		var height = $("#Mapquestmap_custom_height").val();
		style = "width:"+width+"px; height:"+height+"px;";
		
		
	}
	
	$('#Mapquestmap_container').append("<div id='Mapquestmap_map' style='"+style+"'></div>");
	
	var PLUGIN_NAME = $("#PLUGIN_NAME").val();
		var PLUGIN_URL = $("#PLUGIN_URL").val();
			var options = Mapquest.option();
			Mapquestmap_admin.map = new MQA.TileMap(options);
			
			return Mapquestmap_admin.map;
			
	},
	location: function(){
	var PLUGIN_URL = $("#PLUGIN_URL").val();
	var aData = Mapquestmap_admin.get_locations();
	var p;
	var icon;
	$.each(aData, function(key, val){
	
		MQA.withModule('geocoder', function() {
		
			MQA.Geocoder.constructPOI=function(location){
			 p = new MQA.Poi({lat:val.lat,lng:val.lng});
			icon=new MQA.Icon("/_sdk/img/mapquestmap/balloon.png",25,30);
				p.setIcon(icon);
				p.setInfoTitleHTML('<div style="width:100px;text-align:center;font-weight:bold">'+val.loc+'</div>');
				return p;
			};
			
			Mapquestmap_admin.map.geocodeAndAddLocations({lat:val.lat,lng:val.lng}, function(){
			Mapquestmap_admin.map.bestFit();});
			
		});
	
	});
	
	},
	zoom: function(){
		MQA.withModule("smallzoom", function() {
				Mapquestmap_admin.map.addControl(
				Mapquestmap_admin.zoom =  new MQA.SmallZoom(),new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
			});
			
	},
	view_control: function(){
		MQA.withModule('viewoptions', function() {
			Mapquestmap_admin.map.addControl(
			Mapquestmap_admin.view_control = new MQA.ViewOptions());
		});
	},
	traffic: function(){
		MQA.withModule('traffictoggle', function() {
			Mapquestmap_admin.map.addControl(
			Mapquestmap_admin.traffic = new MQA.TrafficToggle());
		});
	
	},
	insetmapcontrol: function(){
		MQA.withModule('insetmapcontrol', function() {
			var options={
			size:{ width:120, height:120},
			zoom:3,
			mapType:"hyb",
			minimized:false };
			Mapquestmap_admin.map.addControl(
			new MQA.InsetMapControl(options),
			new MQA.MapCornerPlacement(MQA.MapCorner.BOTTOM_RIGHT)
			);
		});
	}
	
}
jQuery(document).ready(function($){
	Mapquestmap_admin.display();
		$(document).keypress(function(e) {
			if(e.keyCode == 13) {
			return false;
			}
		});
});

