<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$response=array();

// ALL TAB NAMES ARRAY
$check_tabnames = array('md', 'bi', 'hpi', 'ros', 'pfsh', 'pe', 'ord', 'mdm', 'ip', 'aa');

// CHECK FOR CHARTNO IS CHANGED OR NOT AFTER LAODING ANY IMAGE
foreach($check_tabnames as $check_tabname)
{
	if(file_exists('../../admin/chart_loader/images/'.$_REQUEST['chartnumber'].'/'.$_REQUEST['chartnumber'].'_'.$check_tabname.'.png'))
	{
		$response[] = $check_tabname;
	}	
}

echo json_encode($response);

