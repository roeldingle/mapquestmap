<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Administrator</title>


	  <link href="<?php echo $sCss;?>" rel="stylesheet" type="text/css" media="screen" />	
	<link href="<?php echo $sCssFarb;?>" rel="stylesheet"  type="text/css" />
	<!--[ IE 7]>
		<link href="<?php echo $sCssie7;?>" rel="stylesheet" type="text/css" media="screen" />
	<![end]-->
	<!--[ IE 6]>
		<link href="<?php echo $sCssie7;?>" rel="stylesheet" type="text/css" media="screen" />
	<![end]-->
	
	
	<!--
	<script language="javascript" src="<?php echo $SERVER_JQUERYJS_URL;?>"></script>
	<script language="javascript" src="<?php echo $SERVER_COMMONJS_URL;?>"></script>
	
	<script language="javascript" src="<?php echo $SERVER_BASE_URL;?>lib/js/jquery.validate.js"></script>
	<script language="javascript" src="<?php echo $PLUGIN_URL;?>js/jquery.form.js"></script> 	
	<script language="javascript" src="<?php echo $PLUGIN_URL;?>js/<?php echo $PG_NAME;?>.admin.js"></script> 
	<script type="text/javascript" src="<?php echo $SERVER_BASE_URL;?>lib/js/popup.js"></script>
	<script type="text/javascript" src="<?php echo $SERVER_BASE_URL;?>lib/js/common.js"></script>
	
	<script type="text/javascript" src="<?php echo $PLUGIN_URL;?>js/farbtastic.js"></script>
	-->
	
	
</head>
<body id="<?php echo $PG_NAME;?>"  >
	<!--hidden input-->
	<input type="hidden" id="PLUGIN_NAME" value="<?php echo $PG_NAME;?>" /><!--pluginname-->
	<input type="hidden" id="PLUGIN_URL" value="<?php echo $PG_URL;?>" /><!--pluginurl-->
	<input type="hidden" id="SEQ" value="<?php echo $iSeq;?>" /><!--pluginurl-->
	
	
	
	<input type="hidden" id="<?php echo $PG_NAME;?>_lat"  class="fix" value="<?php echo $iLat;?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_lng"  class="fix" value="<?php echo $iLng;?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_staticmap"  class="fix" value="<?php echo $aUserSetting['pmq_static_map'];?>" />
	

	
	<div id="<?php echo $PG_NAME;?>_form_container">
		
		
			<!-- message box -->			
			<!--<div class="msg_suc_box" style="display:none" ><p><span>Saved successfully.</span></p></div>	-->
			<div id="plugin_validation_message"  style="display:none" ></div>				
			<!-- // message box -->
			
		
	
		<span><label>App ID :</label> <?php echo $PG_NAME;?></span><br /><br />
	
	
		
	<div id="Mapquestmap_wrap">
		
		<div id="Mapquestmap_holder"  >
			<div id="Mapquestmap_container" >
			
			</div>	
		</div>		
	</div>
	<form id="<?php echo $PG_NAME;?>_form" >
	<table border="1" cellspacing="0" class="table_input_vr">
	<colgroup>
		<col width="115px" />
		<col width="*" />
	</colgroup>
	
	
	
	
	<tr style="display:none;" >
		<th class="padt2"><label for="show_html_value">Size</label></th>
		<td class="padt2">
			<select  class="rows" id="<?php echo $PG_NAME; ?>_mapsize" onchange="adminPageSettings.change_mapsize();" >
			<!--  
				<option value="300,300" <?php if ($aMapsize[0] == "300"){echo "selected";}?> >Small (300 X 300)</option>
				<option value="425,350" <?php if ($aMapsize[0] == "425"){echo "selected";}?>>Medium (425 X 350)</option>
				<option value="640,480" <?php if ($aMapsize[0] == "640"){echo "selected";}?> >Large (640 X 480)</option>
				<option value="custom" <?php if ($aMapsize[0] == "custom"){echo "selected";}?> >Custom</option>
				-->
				<option value="640,480" <?php if ($aMapsize[0] == "640"){echo "selected";}?> >Large (640 X 480)</option>
			</select>
			 
			 <input type='button' id='Mapquestmap_preview' value='Preview'  class='btn' style='display:none;width:100px !important' onclick="adminPageSettings.preview();" />
			
			<!-- Visible if Custom is selected -->
			<input type="hidden" id="<?php echo $PG_NAME; ?>_bcustom" value="<?php echo $size = $aMapsize[0] == "custom"?"1":"0";?>" />
			<input type="hidden" id="<?php echo $PG_NAME; ?>_custom_width" value="<?php if ($aMapsize[0] == "custom"){echo $aMapsize[1];}else{echo "0";}?>" />
			<input type="hidden" id="<?php echo $PG_NAME; ?>_custom_height" value="<?php if ($aMapsize[0] == "custom"){echo $aMapsize[2];}else{echo "0";}?>" />
			
			<div  id="<?php echo $PG_NAME; ?>_custom_container" style="<?php if ($aMapsize[0] != "custom"){echo"display:none;";} ?>" >
				
			</div>
		</td>
	</tr>
	
	<tr>
		<th><label for="module_label">Static Map<?php echo $aUserSetting['pmq_static_map'];?></label></th>
		<td>
			<span class="checkbox_options">
				<input id="Mapquestmap_static_map" type="checkbox" <?php if ($aUserSetting['pmq_static_map'] == 1){echo"checked"; } ?> onclick="adminPageSettings.get_static_map()" name="Mapquestmap_static_map">
				<label for="Mapquestmap_static_map">Generate Static Map</label>
			</span>
		</td>				
	</tr>		
	
		
	<tr>
		<th><label for="module_label">Location</label></th>
		<td>	
			
			<span class="location">
				
				<p><span class="neccesary">*</span>Add a Location on the map.</p>
				<p id="<?php echo $PG_NAME;?>_addlocation" class="space">Add Location register multiple.</p>
				<div id="Mapquestmap_location_wrap" >
				
				
				
				
				<?php $counter=0; foreach($aLoc as $val){?>
					<div class="add_location" id="Mapquestmap_<?php echo $counter;?>" >
					
						<a href="#"><img src="/_sdk/img/mapquestmap/balloon.gif" class="balloon" /></a>
						<input type="text"  value="<?php echo $val." (".$aLatLng[$counter][0].",".$aLatLng[$counter][1].")";?>" readonly name="Mapquestmap_location[]" id="Mapquestmap_location_" class="textbox" value="" />
						<a  href="javascript:adminPageSettings.remove_location(<?php echo $counter;?>);"  ><img src="/_sdk/img/mapquestmap/close_btn.gif" class="close_btn" /></a>
						
					</div>
				<?php $counter++; }?>
				
				
				
				<!--  
				<input type="hidden"  name="Mapquestmap_location[]" id="Mapquestmap_location_1" value="Manila, Philippines (14.5995124,120.9842195)" class="textbox" />
				-->
		
				</div>
			
				<p>
				<input type="hidden" id="<?php echo $PG_NAME;?>_lat"  class="fix" value="<?php echo $aUserSetting['pmq_lat'];?>" />
				<input type="hidden" id="<?php echo $PG_NAME;?>_lng"  class="fix" value="<?php echo $aUserSetting['pmq_lng'];?>" />
					<input type="button" class="btn" value="Add New Location" onclick="adminPageSettings.open_dialog()" />
				</p>
				
			</span>
		</td>				
	</tr>	
	</table>
	

	<div class="tbl_lb_wide_btn">
		<input type="button" value="Save" class="btn_apply" onclick="adminPageSettings.setting_submit()" />
		<a href="#" class="add_link" title="Reset to default" onclick="adminPageSettings.reset_default()" >Reset to Default</a>
		<?php 
			 if ($bExtensionView === 1){
			            echo '<a href="/admin/sub/?module=ExtensionPageManage&code=' . ucfirst(APP_ID) . '&etype=MODULE" class="add_link" title="Return to Manage ' . ucfirst(APP_ID) . '">Return to Manage ' . ucfirst(APP_ID) . '</a>
			            <a href="/admin/sub/?module=ExtensionPageMyextensions" class="add_link" title="Return to My Extensions">Return to My Extensions</a>';
			  }
		?>
	</div>
	</form>
	</div>
	
	<!--form for reset-->
<form method="POST" action="" name="<?php echo $PG_NAME;?>_form_reset" id="<?php echo $PG_NAME;?>_form_reset" >
<input type="hidden" name="<?php echo $PG_NAME;?>_reset" value="true" />
</form>

	
	
	
	
</body>
</html>


		
