<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$paramsql = "SELECT * from `trainerparameter` LIMIT 1";
$paramresult = mysqli_query($conn,$paramsql);
$paramdata=mysqli_fetch_array($paramresult,MYSQLI_ASSOC); 
$stage_chart_number = $paramdata['stageadvancement-numberofcharts'];

$percentage_received = 0;
$answersql="SELECT * FROM studentanswer WHERE testhistory_id=".$_SESSION['historyid']." AND updated='Y'";

$answer_result = $conn->query($answersql);
if($answer_result->num_rows>0)
{
	$test_total_mark = 0;
	$test_total_scored = 0;
	while($answer = mysqli_fetch_array($answer_result,MYSQLI_ASSOC)) 
	{
		$test_total_mark += $answer['scorepossible'];
		if($answer['admin_updated']=='Y')
		{
			$test_total_scored += $answer['scorefinal'];
		}
		else
		{
			$test_total_scored += $answer['scorepreliminary'];
		}
	}
	$percentage_received = ($test_total_scored/$test_total_mark)*100;
}

// PREHIRE OR TRAINEE
if($_SESSION['stage']<4)
{
	if($percentage_received >= $paramdata['stageadvancement-percentagecorrecttoadvance'])
	{
		$testresult='Passed';
	}
	else
	{
		$testresult='Failed';
	}
}
else if($_SESSION['stage'] == 4)
{
	if($percentage_received >= $paramdata['stageadvancement-stage4completionpercentage'])
	{
		$testresult='Passed';
	}
	else
	{
		$testresult='Failed';
	}
}

$upcoming_type=$_SESSION['studenttype_id'];
$upcoming_stage=$_SESSION['stage'];

if($upcoming_type!='' && $upcoming_stage!='' && $testresult=='Failed')
{
	// UPDATE TESTRESULT IN TESTHISTORY TABLE
	$sql="UPDATE testhistory SET status='Completed', testresult='".$testresult."' WHERE id= '".$_SESSION['historyid']."'";
	mysqli_query($conn,$sql);
	
	// LOAD NEW TEST FOR THIS STUDENT FOR NEXT DAY
	$testdate = date("Y-m-d", strtotime("+1 day"));

	// INSERT IN TESTHISTORY TABLE 
	$sql = "INSERT INTO testhistory(test_id, testdate, studentstage, studenttype_id, status) VALUES('".$_SESSION['test_id']."', '".$testdate."','".$upcoming_stage."', '".$upcoming_type."', 'NotStarted')";
	mysqli_query($conn,$sql);
	$newhistory_id = mysqli_insert_id($conn);

	loadNewQuestions($conn, $_SESSION['test_id'], $newhistory_id, $testdate, $upcoming_stage, $upcoming_type, $stage_chart_number);

}

$_SESSION['teststatus'] = 'Completed';




echo $_SESSION['teststatus'];
exit();	