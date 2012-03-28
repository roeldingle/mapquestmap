<?php
class frontPageMapquestMap extends Controller_Front
{

	protected $oGet;

    protected function run($aArgs)
    {

      require_once('builder/builderInterface.php');
    usbuilder()->init($this, $aArgs);
    

 	/*assign objects*/
    $this->oGet = new modelGet;
    
	$this->display($aArgs);

    }

    protected function display($aArgs){
    	
    	/*define page*/
    	$this->assign('PG_NAME','Mapquestmap'); #pluginname
    	$this->assign('PG_URL',usbuilder()->getUrl(__CLASS__)); #pluginurl
    	usbuilder()->validator(array('form' => 'Mapquestmap_form'));
    	usbuilder()->validator(array('form' => 'Mapquest_search_popup'));
    	
    	/*Mapquest curl*/
    	$sMapQuest_url = 'http://www.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd|luu2nuu1ll%2C8g%3Do5-h0tg0';
    	$this->externalJS($sMapQuest_url);
    	
    	
    	/*set the user setting*/
    	$aUserSetting = $this->oGet->getRow(2,"seq =".$this->getSequence());
    	
    	/*set default*/
    	if(empty($aUserSetting)){
    		$aUserSetting = array(
    			//	'pmq_title' => "Map title",
    				'pmq_size' => "300,300",
    				'pmq_static_map' => 0,
    				'pmq_locations' => "Los Angeles, CA, USA(34.0522342,-118.2436849)",
    				'pmq_border_width' => 0,
    				'pmq_border_color' => "",
    				'pmq_background' => ""
    		);
    	
    	}
    	
    	$this->assign('aUserSetting',$aUserSetting);
    	
    	
    	
    	/*for loc lat lng*/
    	if(empty($aUserSetting)){
    		$aUserSetting['pmq_locations'] = "+Los Angeles, CA, USA(34.0522342,-118.2436849)";
    	}else{
    		$aUserSetting['pmq_locations'] = ($aUserSetting['pmq_locations'] != "")? $aUserSetting['pmq_locations']:"Los Angeles, CA, USA(34.0522342,-118.2436849)";
    		$sLocations = explode("+",$aUserSetting['pmq_locations']);
    		$coun = 0;
    		foreach($sLocations as $val){
    			$aLocation = explode("(",$sLocations[$coun]);
    	
    			$aLoc['loc'] = $aLocation[0];
    			$aLoc['latlng'] = str_replace(")","",explode(",",$aLocation[1]));
    	
    			$aData['loc'][]= $aLocation[0];
    			$aData['latlng'][]= $aLoc['latlng'];
    	
    			$coun++;
    		}
    	}
    	
    	
    	
    	/*for custom*/
    	$aMapsize = explode(",",$aUserSetting['pmq_size']);
    	$this->assign('aMapsize', $aMapsize);
    	
    	
    	$PG_NAME = 'Mapquestmap';
    	$iTitleWidth = ($aMapsize[0] == "custom")?$aMapsize[1]: $aMapsize[0];
    	$iContainerWidth =  ($aMapsize[0] == "custom")? $aMapsize[1]: $aMapsize[0];
    	$iContainerHeight =  ($aMapsize[0] == "custom")?$aMapsize[2]:$aMapsize[1];
    	$iMapWidth =  ($aMapsize[0] == "custom")?$aMapsize[1]:$aMapsize[0];
    	$iMapHeight = ($aMapsize[0] == "custom")?$aMapsize[2]:$aMapsize[1];
    	
    	
    	
    	$aLoc = $aData['loc'];
    	$aLatLng = $aData['latlng'];
    	$iLen = (count($aData['latlng'])-1);
    	$iLat = $aData['latlng'][$iLen][0];
    	$iLng = $aData['latlng'][$iLen][1];
    	
    	$iRealMapWidth =  ($aMapsize[0] == "custom")?$aMapsize[1]: $aMapsize[0];
    	$iRealMapHeight = ($aMapsize[0] == "custom")?$aMapsize[2]: $aMapsize[1];
    	
    	
    	$sData = '';
    	$sData .='<div class="Mapquestmap_map" style="width:100%;height:100%;" ></div>';
    	
    	
    	$sData .='<div class="'.$PG_NAME.'_container" style="display:none;" > ' ;
  
	    	$counter=0;
	    	foreach($aLoc as $val){
		    	$sData .='<div class="add_location" class="'.$PG_NAME.'_'.$counter.'" style="display:none;" >';
		    	$sData .='<input type="text"  name="'.$PG_NAME.'_location[]" class="'.$PG_NAME.'_location_'.$counter.'" value="'.$val." "." (".$aLatLng[$counter][0].",".$aLatLng[$counter][1].')" class="textbox" />';
		    	$sData .='</div>';
		    	$counter++;
	    	}
	    
    	
    	//$sData .='</div>';
    	#<!--map hidden settings-->
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_PLUGIN_NAME"   value="'.$PG_NAME.'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_PLUGIN_URL"   value="'.usbuilder()->getUrl(__CLASS__).'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_staticmap"   value="'.$aUserSetting['pmq_static_map'].'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_lat"   value="'.$iLat.'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_lng"   value="'.$iLng.'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_width"   value="'.$iRealMapWidth.'" />';
    	$sData .='<input type="hidden" class="'.$PG_NAME.'_height"   value="'.$iRealMapHeight.'" />';
    	$sData .='</div>';
    	$this->assign('display',$sData);
    	
    	$this->init_js($aArgs);
    	
    }
    
    
    
    protected function init_js($aArgs){
    
    	$sJs = '
    	sdk_Module("'.usbuilder()->getModuleSelector().'").ready(function($M){
    			var frontPageIndex= {
						map: null,
					display_front: function(){
						var PLUGIN_NAME = $M(".Mapquestmap_PLUGIN_NAME").val();
						var PLUGIN_URL = $M(".Mapquestmap_PLUGIN_URL").val();
						
						//give 100% size for the parent div
						$M(".Mapquestmap_map").parent().css("width","100%");
						$M(".Mapquestmap_map").parent().css("height","100%");
						
						//get the size of parent div
						var iMapWidth = $M(".Mapquestmap_map").parent().width();
						var iMapHeight = $M(".Mapquestmap_map").parent().height();
						
						/*set a minimum value if height is 0*/
						var iMinheigth = 200;
						
						if(iMapHeight == 0){
							iMapHeight = iMinheigth;
						}
						
						$M(".Mapquestmap_map").css("width",iMapWidth);
						$M(".Mapquestmap_map").css("height",iMapHeight);
						
						bMap = $M("."+PLUGIN_NAME+"_staticmap").val();
						
						if(bMap == 1){
							frontPageIndex.get_static_map();
						
						}else{
						
							var aMapSetting = {
								iLat: parseFloat($M("."+PLUGIN_NAME+"_lat").val()),
								iLng: parseFloat($M("."+PLUGIN_NAME+"_lng").val()),
								iZoom: 1
							}
								frontPageIndex.mapquest_init(aMapSetting);
							
						}
						
					},
					
					mapquest_init: function(aMapSetting){
						
						var PLUGIN_NAME = $M(".Mapquestmap_PLUGIN_NAME").val();
						var PLUGIN_URL = $M(".Mapquestmap_PLUGIN_URL").val();
						
						
							/*Create an object for options*/
							var options={ 
							  elt:$M(".Mapquestmap_map").get(0),       
							  zoom: aMapSetting.iZoom,                                  
							  latLng:{lat:aMapSetting.iLat, lng:aMapSetting.iLng},  
							  mtype: "map",                              
							  bestFitMargin:0,                         
							  zoomOnDoubleClick:true,
								useRightClick:true 			  
							};
				
							/*Construct an instance of MQA.TileMap with the options object*/
							frontPageIndex.map = new MQA.TileMap(options);
							
							
							
							/*set controllers*/
							frontPageIndex.mapquest_screen_zoom("smallzoom");
							frontPageIndex.mapquest_view_control();
							frontPageIndex.mapquest_traffic();
							frontPageIndex.mapquest_insetmapcontrol();
							
							
							/*add locations*/
							var aData = frontPageIndex.get_locations();
							
							var poi;
							var sc;
							$.each(aData, function(key, val){
								
								 function buildPoi(){
								poi=new MQA.Poi({lat:val.lat, lng:val.lng});
								var icon=new MQA.Icon("[IMG]/balloon.png",25,30);
								poi.setIcon(icon);
									poi.setInfoTitleHTML("<div style=\'width:120px;\'>"+val.loc+"</div>");
									poi.setInfoContentHTML("<div style=\'width:120px;\'>Latlng: "+val.lat+","+val.lng+"</div>");
									return poi;
								}
					
								function addPoi(){
									frontPageIndex.map.addShape(buildPoi());
									
									var aData = frontPageIndex.get_locations();
									var len = aData.length;
									
									if(len == 1){
										frontPageIndex.map.setZoomLevel(5);
									}else{
										frontPageIndex.map.bestFit();
									}
								}
					  
								function addShapeCollection(){
									sc=new MQA.ShapeCollection();
									sc.add(buildPoi());
									frontPageIndex.map.addShapeCollection(sc);
								}
								
								addPoi();
								
							});
							/*end add locations*/
							return frontPageIndex.map;
					},
					
					get_static_map: function(){
						
						$M(".Mapquestmap_static_map_holder").remove();
						
						
						//var width = $.trim($(".Mapquestmap_width").val());
						//var height = $.trim($(".Mapquestmap_height").val());
						
						var iMapWidth = $M(".Mapquestmap_map").parent().width();
						var iMapHeight = $M(".Mapquestmap_map").parent().height();
						
						var	size = ""+iMapWidth+","+iMapHeight;
						
						var count = 1;
						$M(".Mapquestmap_map").hide();
						
						var aData = frontPageIndex.get_locations();
						var len = aData.length;
						
						var iZoom = (len == 1) ? "&zoom="+3 : "";
							
							var static_map = "http://www.mapquestapi.com/staticmap/v3/getmap?key=";
							static_map += "Fmjtd|luu2nuu1ll%2C8g%3Do5-h0tg0"; 
							static_map += "&center="+$M(".Mapquestmap_lat").val()+","+$M(".Mapquestmap_lng").val()+""; 
							static_map += iZoom; 
							static_map += "&size="+size; 
							static_map += "&type=map"; 
							static_map += "&imagetype=gif"; 
							static_map += "&pois="; 
							$.each(aData, function(key, val){
							static_map += "orange_1-"+count+","+val.lat+","+val.lng+"|"; 
							count++;
							});
							
							$M(".Mapquestmap_map").parent().append("<div class=\'Mapquestmap_static_map_holder\'>");
							$M(".Mapquestmap_static_map_holder").append("<img src=\'"+static_map+"\' />");
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
						var id = $M(".Mapquestmap_location_wrap").children("div").size();
						
						$.each($M("input[name=\'Mapquestmap_location[]\']"), function(){
							idx = $M(this).val();
							 strid += "+"+idx;
					
							location_str = strid.substr(1);
							
							
							locations = location_str.split("+");
							
							$.each(locations, function(index){
							
								
								aLocation = locations[index].split("(");
								aLocation["loc"] = aLocation[0];
								aLocation["latlng"] = aLocation[1];
								
								aLatlng = aLocation["latlng"].split(",");
								
								lat = parseFloat(aLatlng[0]);
								lng_len = aLatlng[1].length;
								lng = parseFloat(aLatlng[1].substr(0,lng_len-1));
								
								
								sData[i] = {lat: lat, lng: lng,loc: aLocation["loc"]};
							});
							
							
							i++;
						
						});	
						
						return sData;
				
					},
					mapquest_add_poi: function(loc, lat, lng){
						
						 function buildPoi(){
				          var poi=new MQA.Poi({lat:lat, lng:lng});
				          poi.setInfoTitleHTML(loc)
				          return poi;
				        }
					
				        function addPoi(){
				        	frontPageIndex.map.addShape();
				        }
					  
				        function addShapeCollection(){
				          var sc=new MQA.ShapeCollection();
				          sc.add(buildPoi());
				          frontPageIndex.map.addShapeCollection(sc);
				        }
						
					},
					mapquest_screen_zoom: function(type){
						if(type == "smallzoom"){
						MQA.withModule(type, function() {
							frontPageIndex.map.addControl(
								new MQA.SmallZoom(),new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
							});
						
						}else{
							MQA.withModule(type, function() {
								frontPageIndex.map.addControl(
							 new MQA.SmallZoom(), new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
							});
						
						}
					},
					mapquest_insetmapcontrol: function(){
						MQA.withModule("insetmapcontrol", function() {
							var options={
							size:{ width:120, height:120},
							zoom:3,
							mapType:"hyb",
							minimized:false };
							frontPageIndex.map.addControl(
							new MQA.InsetMapControl(options),
							new MQA.MapCornerPlacement(MQA.MapCorner.BOTTOM_RIGHT)
							);
						});
					},
					mapquest_view_control: function(){
						MQA.withModule("viewoptions", function() {
							frontPageIndex.map.addControl(
							new MQA.ViewOptions());
						});
					},
					mapquest_traffic: function(){
						MQA.withModule("traffictoggle", function() {
							frontPageIndex.map.addControl(
							new MQA.TrafficToggle());
						});
					
					}
				
				}
				
					frontPageIndex.display_front();
    	});';
    
    
    
    	$this->writeJs($sJs);
    
    }
}
