<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
		
// CHECK IF ANY CHECKED IDS
if(isset($_REQUEST['checkedDsgccIds']))
{
	$success_dsgcc = 1;
	$message_dsgcc = $error_message['SUCCESS-CHARTDSGCCFORM-UPDATE'];
	$dsgcc_ids = $_REQUEST['checkedDsgccIds'];

	$sql="SELECT t.test_id FROM test t, user u WHERE u.user_id=t.user_id AND t.test=u.testnumber AND u.user_id=".$_SESSION['user_id'];
	$result = $conn->query($sql);
	$testdata = mysqli_fetch_array($result,MYSQLI_ASSOC);

	$test_id = $testdata['test_id'];


	$resultdsgcc = $conn->query("SELECT `dsgcc_id` FROM `student_chart_dsgcc` WHERE chart_id='".$_REQUEST['chart_id']."' AND user_id=".$_SESSION['user_id']);
	$rowdsgcc = mysqli_fetch_all($resultdsgcc,MYSQLI_ASSOC);
	$dsgccids = array_column($rowdsgcc, 'dsgcc_id');
	foreach($dsgcc_ids as $dsgcc_id=>$dsgcc_val)
	{
		if(!in_array($dsgcc_id, $dsgccids))
		{
			// PREPARE QUERY TO BE EXECUTED ON DATABASE 
			$sql = "INSERT INTO student_chart_dsgcc (`user_id`, `test_id`, `chart_id`, `dsgcc_id`) VALUES(".$_SESSION['user_id'].", ".$test_id.", ".$_REQUEST['chart_id'].", ".$dsgcc_id.")";
			mysqli_query($conn,$sql);
			$success_dsgcc = 1;
			$message_dsgcc = $error_message['SUCCESS-CHARTDSGCCFORM-INSERT'];
		}	
	}
	echo json_encode(array('success' => $success_dsgcc, 'message' => $message_dsgcc));
	exit;
}
else
{
	exit();
}	

?>