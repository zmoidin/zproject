<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$sql="SELECT t.test_id FROM test t, user u WHERE u.user_id=t.user_id AND t.test=u.testnumber AND u.user_id=".$_SESSION['user_id'];
$result = $conn->query($sql);
$testdata = mysqli_fetch_array($result,MYSQLI_ASSOC);

$test_id = $testdata['test_id'];

if(isset($_REQUEST['action']) and $_REQUEST['action']=='delete')
{
	$sql = "DELETE FROM student_chart_dsgcc WHERE chart_id='".$_REQUEST['chart_id']."' AND dsgcc_id=".$_REQUEST['dsgcc_id']." AND user_id=".$_SESSION['user_id']." AND test_id=".$test_id;
	$conn->query($sql);
	exit();
}



$sql = "SELECT d.* FROM dsgcc d, student_chart_dsgcc scd WHERE scd.user_id=".$_SESSION['user_id']." AND scd.test_id=".$test_id." AND scd.chart_id='".$_REQUEST['chart_id']."' AND scd.dsgcc_id=d.dsgcc_id";
$result = $conn->query($sql);

// CHECK ROWS COUNT
if($result->num_rows>0)
{

	//INITIALIZING RETURING DATA ARRAY VARIABLE
	$return_data = array();
	while($row = $result->fetch_assoc())
	{

		// PUSHING DATABASE DATA INTO RETURING DATA ARRAY VARIABLE
		$return_data[] = array(
			'dsgcc_id' => $row['dsgcc_id'],
			'overall_risk' => $row['overallrisk'],
			'dsgcc_level' => $row['level'],
			'number' => $row['number'],
			'dsgcc_text' => mb_convert_encoding($row['text'], 'UTF-8'),
			'dsgcc_type' => $row['type']
		);
	}

	//SERVER RESPONSE TO JS FILE WITH DATA AND TOTAL ROWS
	$response=array('total'=>count($return_data), 'return_data'=>$return_data);
}
else
{
	$response=array('total'=>0, 'return_data'=>array());
}
echo json_encode($response);
exit;
?>