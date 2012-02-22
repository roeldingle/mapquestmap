<?php
class adminPageSettings extends Controller_Admin
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
    	$this->importJS("admin");
    	$this->importCSS('setup');
	
    	/*sequence*/
    	$iSeq = $aArgs['seq'];
    	$this->assign('iSeq', $iSeq);
    	
    	/*set the user setting*/
    	$aUserSetting = $this->oGet->getRow(2,"seq =".$iSeq);
    	
    	
    	
    	/*set default*/
    	if(empty($aUserSetting) || isset($aArgs['Mapquestmap_reset'])){
    		$aUserSetting = array(
    				'seq' => $sSeq,
    				'pmq_size' => "640,480",
    				'pmq_static_map' => 0,
    				'pmq_locations' => "Los Angeles, CA, USA(34.0522342,-118.2436849)",
    				'pmq_border_width' => 0,
    				'pmq_border_color' => "",
    				'pmq_background' => ""
    		);

    	}

    	$this->assign('aUserSetting',$aUserSetting);
    	
    	$sUrl = usbuilder()->getUrl('adminPageSettings');
    	$this->assign("sUrl",$sUrl);
    	
    	/*for custom*/
    	$aMapsize = explode(",",$aUserSetting['pmq_size']);
    	$this->assign('aMapsize', $aMapsize);

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
    	
    	
    	$this->assign('aLoc', $aData['loc']);
    	$this->assign('aLatLng', $aData['latlng']);
    	$iLen = (count($aData['latlng'])-1);
    	$this->assign('iLat', $aData['latlng'][$iLen][0]);
    	$this->assign('iLng', $aData['latlng'][$iLen][1]);


    	/*set the template*/
    	$this->view(__CLASS__);

    }
}
