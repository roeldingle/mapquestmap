<?php
class apiExec extends Controller_Api
{
	
	
    protected function post($aArgs)
    {

        require_once('builder/builderInterface.php');
        usbuilder()->init($this->Request->getAppID(), $aArgs);
        
        $oExec = new modelExec;
     
	
	#data to insert
	$aData = array(
		'pmq_idx' => '',
		'pmq_pm_idx' => 1,
	//	'pmq_title' => $aArgs['get_pmq_title'],
		'pmq_size' => $aArgs['get_pmq_size'],
		'pmq_static_map' => $aArgs['get_pmq_static_map'],
		'pmq_locations' => $aArgs['get_pmq_locations']
	
		);
	
    $dDeleted = $oExec->deleteData(2);
    if($dDeleted === true){
		$aResult = $oExec->insertData(2,$aData);
    }else{
    	$aResult = "false";
    }
	
	return $aResult;
        
    }
    
  
}
