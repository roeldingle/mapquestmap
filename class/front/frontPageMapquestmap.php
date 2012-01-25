<?php
class frontPageMapquestmap extends Controller_Front
{

	protected $oGet;

    protected function run($aArgs)
    {

    require_once('builder/builderInterface.php');
    

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
    	$this->importJS("frontPageIndex");
    	//$this->importCSS('front');
    	
    	/*set the user setting*/
    	$aUserSetting = $this->oGet->getRow(2,null);
    	
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
    	$sData = '<div id="Mapquestmap_holder" style="height:100%;width:100%;"  >';
    	$sData .='<div id="Mapquestmap_map" ></div>';
    	$sData .='<div id="'.$PG_NAME.'_container" style="display:none;" > ' ;
  
    	if(count($aLoc) != 0){
	    	$counter=0;
	    	foreach($aLoc as $val){
		    	$sData .='<div class="add_location" id="'.$PG_NAME.'_'.$counter.'" style="display:none;" >';
		    	$sData .='<input type="text"  name="'.$PG_NAME.'_location[]" id="'.$PG_NAME.'_location_'.$counter.'" value="'.$val." "." (".$aLatLng[$counter][0].",".$aLatLng[$counter][1].')" class="textbox" />';
		    	$sData .='</div>';
		    	$counter++;
	    	}
	    }else{
	    	$sData .='<input type="hidden"  name="'.$PG_NAME.'_location[]" id="'.$PG_NAME.'_location_"'.$counter.'" value="Manila, Philippines (14.5995124,120.9842195)" class="textbox" />';
    	} 
    	
    	#<!--map hidden settings-->
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_PLUGIN_NAME"  class="fix" value="'.$PG_NAME.'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_PLUGIN_URL"  class="fix" value="'.usbuilder()->getUrl(__CLASS__).'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_staticmap"  class="fix" value="'.$aUserSetting['pmq_static_map'].'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_lat"  class="fix" value="'.$iLat.'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_lng"  class="fix" value="'.$iLng.'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_width"  class="fix" value="'.$iRealMapWidth.'" />';
    	$sData .='<input type="hidden" id="'.$PG_NAME.'_height"  class="fix" value="'.$iRealMapHeight.'" />';
    	$sData .='</div>';
    	$this->assign('Mapquestmap',$sData);
    	
    }
}
