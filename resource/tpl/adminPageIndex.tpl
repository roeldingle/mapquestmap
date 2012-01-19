<div id="<?php echo $PG_NAME;?>_main_wrap">
	<div id="mapquest_wrap"  >
		<h3 id="<?php echo $PG_NAME;?>_title" style="max-width:<?php if ($aMapsize[0] == "custom"){echo $aMapsize[1];}else{echo $aMapsize[0];}?>px;" ><?php echo $aUserSetting.pmq_title;?></h3>
		<div id="<?php echo $PG_NAME;?>_holder">
			<div id="<?php echo $PG_NAME;?>_container" <?php if($aUserSetting.pmq_static_map == 0){?> style='width:<?php if ($aMapsize[0] == "custom"){echo $aMapsize[1];}else{echo $aMapsize[0];}?>px; height:<?php if ($aMapsize[0] == "custom"){echo $aMapsize[2];}else{echo $aMapsize[1];}?>px;'<?php }?> >
				<div id='<?php echo $PG_NAME;?>_map' style='width:<?php if ($aMapsize[0] == "custom"){echo $aMapsize[1];}else{echo $aMapsize[0];}?>px; height:<?php if ($aMapsize[0] == "custom"){echo $aMapsize[2];}else{echo $aMapsize[1];}?>px;'></div>
			</div>	
		</div>		
	</div>
	
	<?php 
		if(count($aLoc) != 0){
			$counter=0; 
			foreach($aLoc as $val){
	?>
		<div class="add_location" id="<?php echo $PG_NAME;?>_<?php echo $counter;?>" style="display:none" >
		<input type="text"  name="<?php echo $PG_NAME;?>_location[]" id="<?php echo $PG_NAME;?>_location_<?php echo $counter;?>" value="<?php echo $val[$counter]." "." (".echo $aLatLng[$counter][0].",".$aLatLng[$counter][1].")";?>" class="textbox" />
		</div>
	<?php }
		}else{
		?>
		<input type="hidden"  name="<?php echo $PG_NAME;?>_location[]" id="<?php echo $PG_NAME;?>_location_<?php echo $counter;?>" value="Manila, Philippines (14.5995124,120.9842195)" class="textbox" />
	<?php } ?>
	
	<!--map hidden settings-->
	<input type="hidden" id="<?php echo $PG_NAME;?>_staticmap"  class="fix" value="<?php echo $aUserSetting.pmq_static_map; ?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_lat"  class="fix" value="<?php echo $iLat; ?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_lng"  class="fix" value="<?php echo $iLng; ?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_width"  class="fix" value="<?php if ($aMapsize[0] == "custom"){echo $aMapsize[1];}else{echo $aMapsize[0];}?>" />
	<input type="hidden" id="<?php echo $PG_NAME;?>_height"  class="fix" value="<?php if ($aMapsize[0] == "custom"){echo $aMapsize[2];}else{echo $aMapsize[1];}?>" />
	


</div>