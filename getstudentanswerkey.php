<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$response=array('message'=>'', 'return_data'=>array());
$returnarray = array();

$sql = "SELECT * from `trainerparameter` LIMIT 1";
$result = mysqli_query($conn,$sql);
$row2 = mysqli_fetch_array($result,MYSQLI_ASSOC);
$limit = $row2['stageadvancement-numberofcharts'];
$stageadvancedailycompletionmessage = $row2['stageadvance-dailycompletion-message'];

if(!isset($_SESSION['test_id']))
{
	// NO TEST WAS ASSIGNED TO THIS USER. RETURNS EMPTY ARRAY
	$response["message"] = "TEST_NOT_ASSIGNED";
	$response["return_data"] =$returnarray;
	echo json_encode($response);
	exit();
}
if(isset($_SESSION['CHART_ARRAY']) && empty($_SESSION['CHART_ARRAY']))
{
	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		$sql = "UPDATE testhistory SET status='Completed' WHERE id=".$_SESSION['historyid'];
		mysqli_query($conn,$sql);
		// TEST ALREADY COMPLETED
		$response["message"] = "TEST_COMPLETED";
		$response["return_data"] =$returnarray;
		echo json_encode($response);
		exit();
	}
	else
	{
		if($_SESSION['teststatus'] == 'Completed')
		{
			// TEST ALREADY COMPLETED
			$response["message"] = "TEST_COMPLETED_FOR_TODAY";
			$response["return_data"] =$stageadvancedailycompletionmessage;
			echo json_encode($response);
			exit();
		}
		else
		{
			// INSERTING QUESTION AFTER MINIMUM QUESTION ANSWERED
			$newdate = new DateTime('now');
			$testdate = $newdate->format('Y-m-d');	
			$_SESSION['CHART_ARRAY']=loadNewQuestions($conn, $_SESSION['test_id'], $_SESSION['historyid'], $testdate, $_SESSION['stage'], $_SESSION['studenttype_id'], '1');

		}
		
	}
}
if(isset($_SESSION['CHART_ARRAY']) && !empty($_SESSION['CHART_ARRAY']))
{
	if(!isset($_SESSION['startTime']))
	{
		$time = date('Y-m-d H:i:s');
		$_SESSION['startTime'] = $time;
	}

	if($_SESSION['teststatus']=='NotStarted')
	{
		if($_SESSION['studenttype_id']=='APPLICANT')
		{
			$time = date('Y-m-d H:i:s');
			$sql = "UPDATE test SET timestart='".$time."', status='InProgress' WHERE test_id=".$_SESSION['test_id'];
			mysqli_query($conn,$sql);

			$testdate=date('Y-m-d');
			$sql = "UPDATE testhistory SET testdate='".$testdate."', status='InProgress' WHERE id=".$_SESSION['historyid'];
			mysqli_query($conn,$sql);
		}
		else
		{
			$sql = "UPDATE testhistory SET status='InProgress' WHERE id=".$_SESSION['historyid'];
			mysqli_query($conn,$sql);
		}

		$_SESSION['teststatus'] = 'InProgress';
	}

	if(!isset($_SESSION['currentTime']))
	{
		$_SESSION['currentTime'] = strtotime(date('Y-m-d H:i:s'));
	}

	if(!isset($_SESSION['totalTimeTaken']))
	{
		$totalTimeTaken = 0;
		if(isset($_SESSION['historyid']))
		{
			//CHECK IF THIS TEST_ID EXISTS IN STUDENT ANSWER
			if($_SESSION['studenttype_id']=='APPLICANT')
			{
				$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.studentstage='".$_SESSION['stage']."' AND sa.testhistory_id=".$_SESSION['historyid']." AND scak.chart_id < ".TESTCHARTNUMBER." GROUP BY scak.chart_id";
			}
			else
			{
				
				$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.studentstage='".$_SESSION['stage']."' AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.testhistory_id=".$_SESSION['historyid'] ." AND scak.chart_id < ".TESTCHARTNUMBER." GROUP BY scak.chart_id  ORDER BY RAND()";
			}
		
			
			$tresult = mysqli_query($conn,$tsql);
			$totalQuestions = mysqli_num_rows($tresult);

			if($totalQuestions>0) 
			{
				// TEST WAS PREVIOUSLY STARTED, SO LOAD REMANING QUESTIONS
				while($chart = mysqli_fetch_array($tresult,MYSQLI_ASSOC)) 
				{
					$totalTimeTaken += $chart['timetaken'];
				}

			}

		}

		$_SESSION['totalTimeTaken'] = $totalTimeTaken;
	}


	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		$keysql="SELECT s.*, sa.* FROM studentanswer as s, studentchartanswerkey as sa WHERE sa.studentchartanswerkey_id=s.studentchartanswerkey_id AND sa.chart_id='".$_SESSION['CHART_ARRAY'][0]."' AND sa.chart_id < ".TESTCHARTNUMBER." AND s.updated='N' AND s.testhistory_id='".$_SESSION['historyid']."'";

		$keyresult = mysqli_query($conn,$keysql);
		$i =1;
		while($key = mysqli_fetch_array($keyresult,MYSQLI_ASSOC)) 
		{
			$returnarray[] = array(
			'index_id' => $i,
			'studentanswer_id' => $key['studentanswer_id'],
			'studentchartanswerkey_id' => $key['studentchartanswerkey_id'],
			'chart_id' => $key['chart_id'],
			'cpt' => '',
			'provider' => '',
			'provider2' => '',
			'icd1' => '',
			'icd2' => '',
			'icd3' => '',
			'icd4' => '',
			'modifier' => '',
			'feedbackcpt' => '',
			'feedbackprovider' => '',
			'feedbackmodifier' => '',
			'feedbackicd' => '',
			'answer_cpt' => $key['cpt'],
			'answer_provider' => $key['provider'],
			'answer_provider2' => $key['provider2'],
			'answer_modifier' => $key['modifier'],
			'answer_icdstring' => $key['icdstring'],
			'scorepossible' => '',
			'scorepreliminary' => '',
			'comment' => '',
			'cbcpt' => '',
			'cbprovider' => '',
			'cbicd' => '',
			'cbmiscellaneous' => '',
			'startTime' => strtotime($_SESSION['startTime']),
			'currentTime' => $_SESSION['currentTime'],
			'question_no' => $_SESSION['QUESTION_NO'],
			'totalTimeTaken' => $_SESSION['totalTimeTaken']
			);
			$i++;	
		}
	}
	else
	{

	    $sql = "select feedbacktype from studentstage where role ='".$_SESSION['studenttype_id']."' and stage= '".$_SESSION['stage']."' LIMIT 0, 1";
        $result = mysqli_query($conn,$sql);
        $feedbacktype = mysqli_fetch_array($result,MYSQLI_ASSOC);
		$keysql="SELECT s.studentanswer_id, sa.* FROM studentanswer as s, studentchartanswerkey as sa WHERE sa.studentchartanswerkey_id=s.studentchartanswerkey_id AND sa.chart_id='".$_SESSION['CHART_ARRAY'][0]."' AND sa.chart_id < ".TESTCHARTNUMBER." AND s.testhistory_id='".$_SESSION['historyid']."'";

		$keyresult = mysqli_query($conn,$keysql);
		$i =1;
		while($key = mysqli_fetch_array($keyresult,MYSQLI_ASSOC)) 
		{

			// if(is_null($key['feedbackcpt']) || empty($key['feedbackcpt'])) $key['feedbackcpt'] = $error_message['UPDATE-USER-SUCCESS'];
			//$error_message['DEFAULT-FEEDBACK']
			if(is_null($key['feedbackcpt']) || empty($key['feedbackcpt'])) $key['feedbackcpt'] = '';
			if(is_null($key['feedbackprovider']) || empty($key['feedbackprovider'])) $key['feedbackprovider'] = '';
			if(is_null($key['feedbackmodifier']) || empty($key['feedbackmodifier'])) $key['feedbackmodifier'] = '';
			if(is_null($key['feedbackicd']) || empty($key['feedbackicd'])) $key['feedbackicd'] = '';
			
			$returnarray[] = array(
				'index_id' => $i,
				'studentanswer_id' => $key['studentanswer_id'],
				'studentchartanswerkey_id' => $key['studentchartanswerkey_id'],
				'chart_id' => $key['chart_id'],
				'cpt' => '',
				'provider' => '',
				'provider2' => '',
				'icd1' => '',
				'icd2' => '',
				'icd3' => '',
				'icd4' => '',
				'modifier' => '',
				'feedbackcpt' => $key['feedbackcpt'],
				'feedbackprovider' => $key['feedbackprovider'],
				'feedbackmodifier' => $key['feedbackmodifier'],
				'feedbackicd' => $key['feedbackicd'],
				'answer_cpt' => $key['cpt'],
				'answer_provider' => $key['provider'],
				'answer_provider2' => $key['provider2'],
				'answer_modifier' => $key['modifier'],
				'answer_icdstring' => $key['icdstring'],
				'scorepossible' => '',
				'scorepreliminary' => '',
				'comment' => '',
				'cbcpt' => '',
				'cbprovider' => '',
				'cbicd' => '',
				'cbmiscellaneous' => '',
				'startTime' => strtotime($_SESSION['startTime']),
				'currentTime' => $_SESSION['currentTime'],
				'question_no' => $_SESSION['QUESTION_NO'],
				'totalTimeTaken' => $_SESSION['totalTimeTaken']
			);

			$returnarray[] = array(
				'index_id' => $i,
				'studentanswer_id' => 'feedback',
				'feedbacktype' => $feedbacktype['feedbacktype'],
				'studentchartanswerkey_id' => $key['studentchartanswerkey_id'],
				'chart_id' => $key['chart_id'],
				'cpt' => $key['cpt'],
				'provider' => $key['provider'],
				'provider2' => $key['provider2'],
				'icd1' => $key['icdstring'],
				'icd2' => '',
				'icd3' => '',
				'icd4' => '',
				'modifier' => $key['modifier'],
				'feedbackcpt' => '',
				'feedbackprovider' => '',
				'feedbackmodifier' => '',
				'feedbackicd' => '',
				'answer_cpt' => $key['cpt'],
				'answer_provider' => $key['provider'],
				'answer_provider2' => $key['provider2'],
				'answer_modifier' => $key['modifier'],
				'answer_icdstring' => $key['icdstring'],
				'scorepossible' => '',
				'scorepreliminary' => '',
				'comment' => '',
				'cbcpt' => '',
				'cbprovider' => '',
				'cbicd' => '',
				'cbmiscellaneous' => '',
				'startTime' => strtotime($_SESSION['startTime']),
				'currentTime' => $_SESSION['currentTime'],
				'question_no' => $_SESSION['QUESTION_NO'],
				'totalTimeTaken' => $_SESSION['totalTimeTaken']
			);

			$i++;
			
		}
	}	
	$response["message"] = "TEST_IN_PROGRESS";
}


$response["return_data"] =$returnarray;
echo json_encode($response);
exit();