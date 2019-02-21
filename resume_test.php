<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$sql="UPDATE testhistory SET status='InProgress' WHERE id= '".$_SESSION['historyid']."'";
mysqli_query($conn,$sql);
// $totalTimeTaken = 0;
// if(isset($_SESSION['historyid']))
// {
// 	if(isset($_SESSION['teststatus']) && $_SESSION['teststatus']=='Paused')
// 	{

// 		//CHECK IF THIS TEST_ID EXISTS IN STUDENT ANSWER
// 		if($_SESSION['studenttype_id']=='APPLICANT')
// 		{
// 			$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.studentstage='".$_SESSION['stage']."' AND sa.testhistory_id=".$_SESSION['historyid']." GROUP BY scak.chart_id";
// 		}
// 		else
// 		{
			
// 			$tsql = "SELECT scak.chart_id, sa.updated, sa.timetaken FROM studentanswer as sa, studentchartanswerkey as scak WHERE sa.studentchartanswerkey_id=scak.studentchartanswerkey_id AND sa.studentstage='".$_SESSION['stage']."' AND sa.studenttype_id='".$_SESSION['studenttype_id']."' AND sa.testhistory_id=".$_SESSION['historyid'] ."  GROUP BY scak.chart_id  ORDER BY RAND()";
// 		}
	
		
// 		$tresult = mysqli_query($conn,$tsql);
// 		$totalQuestions = mysqli_num_rows($tresult);

// 		if($totalQuestions>0) 
// 		{
// 			// TEST WAS PREVIOUSLY STARTED, SO LOAD REMANING QUESTIONS
// 			while($chart = mysqli_fetch_array($tresult,MYSQLI_ASSOC)) 
// 			{
// 				$totalTimeTaken += $chart['timetaken'];
// 			}

// 		}


// 	}


// }

// $_SESSION['teststatus'] = 'InProgress';
// $_SESSION['totalTimeTaken']= $totalTimeTaken;
// $time = date('Y-m-d H:i:s');
// $_SESSION['startTime'] = $time;

// $_SESSION['currentTime'] = strtotime(date('Y-m-d H:i:s'));
// $response = array(
// 	'startTime' => strtotime($_SESSION['startTime']),
// 	'currentTime' => $_SESSION['currentTime'],
// 	'totaltimeTaken' => $_SESSION['totalTimeTaken']
// );

// echo json_encode( $response );
exit();	