<?php
class apiExec extends Controller_Api
{
	
	
    protected function post($aArgs)
    {

        require_once('builder/builderInterface.php');
		usbuilder()->init($this, $aArgs);
		
		/*sequence*/
		$iSeq = $aArgs['get_seq'];
        
        $oExec = new modelExec;
        $oGet = new modelGet;
     
	
	#data to insert
	$aData = array(
		'pmq_idx' => '',
		'seq' => $iSeq,
		'pmq_size' => $aArgs['get_pmq_size'],
		'pmq_static_map' => $aArgs['get_pmq_static_map'],
		'pmq_locations' => str_replace(" ","",$aArgs['get_pmq_locations'])
	
		);
      
     $bSeqExist = $oGet->getRow(2,"seq =".$iSeq);
     
     if(empty($bSeqExist)){
     	$aResult = $oExec->insertData(2,$aData);
     }else{
        $dDeleted = $oExec->deleteData(2,"seq =".$iSeq);
        if($dDeleted === true){
        	$aData['pmq_idx'] = $bSeqExist['pmq_idx'];
        	$aResult = $oExec->insertData(2,$aData);
        }else{
        	$aResult = "false";
        }
     } 
        
        
	return $aResult;
        
    }
    
  
}
