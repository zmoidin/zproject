<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$totalTimeTaken = 0;
$totalSecondsAllowed = 0;
$response=array('message'=>'', 'return_data'=>array());
$returnarray = array();

// $testdate = new DateTime('tomorrow');
$todayDate = new DateTime('now');
$testdate = $todayDate->format('Y-m-d');

// IDENTIFY THE STUDENT AND CHECK IF THERE IS ALREADY A TEST IN PROGRESS.
// GET THE TESTNUMBER ASSOCIATED WITH THE STUDENT AND FIND THE TEST_ID OF THIS STUDENT.
$sql = "SELECT * from `trainerparameter` LIMIT 1";
$result = mysqli_query($conn,$sql);
$row2 = mysqli_fetch_array($result,MYSQLI_ASSOC);
$totalSecondsAllowed = (60*$row2['applicant-minutes']);
$stageadvancedailycompletionmessage = $row2['stageadvance-dailycompletion-message'];

$sql = "SELECT t.*, u.testnumber, u.studenttype_id, u.stage from user as u, test as t WHERE t.test=u.testnumber and t.user_id=u.user_id and u.user_id=".$_SESSION['user_id'];
$result = mysqli_query($conn,$sql);

if(mysqli_num_rows($result)>0) 
{
	$row = mysqli_fetch_array($result,MYSQLI_ASSOC);

	$_SESSION['testnumber'] = $row['testnumber'];
	$_SESSION['studenttype_id'] = $row['studenttype_id'];
	$_SESSION['stage'] = $row['stage'];
	$_SESSION['test_id'] = $row['test_id'];

	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		$historysql = "SELECT * FROM testhistory WHERE test_id=".$row['test_id']." AND studenttype_id='".$_SESSION['studenttype_id']."' AND studentstage='".$_SESSION['stage']."' ORDER BY id DESC LIMIT 1";
		$historyresult = mysqli_query($conn,$historysql);
		$historyrow = mysqli_fetch_array($historyresult,MYSQLI_ASSOC);
		$_SESSION['historyid'] = $historyrow['id'];
		$_SESSION['teststatus'] = $historyrow['status'];
	}
	else
	{
		$historysql = "SELECT * FROM testhistory WHERE test_id=".$row['test_id']." AND testdate='".$testdate."' AND studenttype_id='".$_SESSION['studenttype_id']."' AND studentstage='".$_SESSION['stage']."' ORDER BY id DESC LIMIT 1";

		$historyresult = mysqli_query($conn,$historysql);
		if(mysqli_num_rows($historyresult)>0)
		{
			$historyrow = mysqli_fetch_array($historyresult,MYSQLI_ASSOC);
			$_SESSION['historyid'] = $historyrow['id'];
			$_SESSION['teststatus'] = $historyrow['status'];
		}
		else
		{
			$response["message"] = "QUESTION_NOT_ASSIGNED_FOR_TODAY";
			$response["return_data"] =$returnarray;
			echo json_encode($response);
			exit();
		}
		
	}

	

}
else
{
	unset($_SESSION['testnumber']);
	unset($_SESSION['studenttype_id']);
	unset($_SESSION['stage']);
	unset($_SESSION['teststatus']);
	unset($_SESSION['test_id']);
	$response["message"] = "TEST_NOT_ASSIGNED";
	$response["return_data"] =$returnarray;
	echo json_encode($response);
	exit();
}

$_SESSION['CHART_ARRAY'] = array();

//CHECK IF THIS TEST_ID EXISTS IN STUDENT ANSWER
if($_SESSION['studenttype_id']=='APPLICANT')
{
	$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.studentstage='".$_SESSION['stage']."' AND sa.testhistory_id=".$_SESSION['historyid']." GROUP BY scak.chart_id";
}
else
{
	
	$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.testdate='".$testdate."' AND sa.studentstage='".$_SESSION['stage']."' AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.testhistory_id=".$_SESSION['historyid'] ."  GROUP BY scak.chart_id  ORDER BY RAND()";
}

$tresult = mysqli_query($conn,$tsql);
$totalQuestions = mysqli_num_rows($tresult);

if($totalQuestions>0) 
{
	// TEST WAS PREVIOUSLY STARTED, SO LOAD REMANING QUESTIONS
	while($chart = mysqli_fetch_array($tresult,MYSQLI_ASSOC)) 
	{
		
		if($chart['updated'] == 'N')
		{
			$_SESSION['CHART_ARRAY'][]=$chart['chart_id'];
		}
		$totalTimeTaken += $chart['timetaken'];
	}
	$_SESSION['totalTimeTaken']= $totalTimeTaken;

	// SET THE CORRECT QUESTION NUMBER
	$remainingQuestions = count($_SESSION['CHART_ARRAY']);
	$_SESSION['QUESTION_NO']= $totalQuestions - $remainingQuestions + 1;	
}


if(isset($_SESSION['CHART_ARRAY']) && empty($_SESSION['CHART_ARRAY']))
{
	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		// TEST ALREADY COMPLETED
		$response["message"] = "TEST_COMPLETED";
		$response["return_data"] =$returnarray;
		echo json_encode($response);
		exit();
	}
	else
	{
		// TEST ALREADY COMPLETED
		$response["message"] = "TEST_COMPLETED_FOR_TODAY";
		$response["return_data"] =$stageadvancedailycompletionmessage;
		echo json_encode($response);
		exit();
	}
	
}

if(isset($_SESSION['CHART_ARRAY']) && !empty($_SESSION['CHART_ARRAY']))
{
	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		if($_SESSION['teststatus']=='Completed')
		{
			// TEST ALREADY COMPLETED
			$response["message"] = "TEST_COMPLETED";
			$response["return_data"] =$returnarray;
			echo json_encode($response);
			exit();
		}
		if($totalSecondsAllowed<=$_SESSION['totalTimeTaken'])
		{
			// TEST ALREADY COMPLETED
			$response["message"] = "TIMES_UP";
			$response["return_data"] =$returnarray;
			echo json_encode($response);
			exit();
		} 
		else
		{
			if(isset($_SESSION['startTime']))
			{
				$time = date('Y-m-d H:i:s');
				$seconds = (strtotime($time) - strtotime($_SESSION['startTime'])) + $_SESSION['totalTimeTaken'];
				if($totalSecondsAllowed<=$seconds)
				{
					$response["message"] = "TIMES_UP";
					$response["return_data"] =$returnarray;
					echo json_encode($response);
					exit();
				}
			}
		}
	}
	else
	{
		// if($_SESSION['teststatus']=='Completed')
		// {
		// 	// TEST ALREADY COMPLETED
		// 	$response["message"] = "TEST_COMPLETED_FOR_TODAY";
		// 	$response["return_data"] =$stageadvancedailycompletionmessage;
		// 	echo json_encode($response);
		// 	exit();
		// }
	}

}
$response["total_questions"] = $totalQuestions;
$response["return_data"] = $_SESSION['CHART_ARRAY'];
echo json_encode($response);