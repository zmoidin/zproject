<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$response=array();
$chart_id = $_REQUEST['chart_id'];


// FETCH ALL HPI PARSER OPTIONS
$sql = "SELECT * FROM hpitype ORDER BY type ASC";
$hpitypes = mysqli_fetch_all($conn->query($sql), MYSQLI_ASSOC);

// FETCH ALL HPI PARSER DATA AGAINST THIS CHART
$sql = "SELECT * FROM charthpi WHERE `chart_id`=".$chart_id." LIMIT 0,120";
$charthpilist = mysqli_fetch_all($conn->query($sql), MYSQLI_ASSOC);
if(count($charthpilist)>100)
{
	$charthpilist = array();
}
$response = array('hpitypes' => $hpitypes, 'charthpilist' => $charthpilist);
echo json_encode($response);

