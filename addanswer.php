<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$sql2 = "SELECT * from `trainerparameter` LIMIT 1";
$result2 = mysqli_query($conn,$sql2);
$row2 = mysqli_fetch_array($result2,MYSQLI_ASSOC);
$limit = $row2['stageadvancement-numberofcharts'];

foreach ($_POST['models'] as $item) {

	if(isset($_SESSION['currentTime']))
	{
		$timetaken = strtotime(date('Y-m-d H:i:s')) - $_SESSION['currentTime'];
	}
	else
	{
		$timetaken = strtotime(date('Y-m-d H:i:s')) - $item['currentTime'];
	}
	

	$updatesql = "UPDATE studentanswer SET cpt = '".$item['cpt']."', provider = '".$item['provider']."', provider2 = '".$item['provider2']."', icd1 = '".$item['icd1']."', icd2 =  '".$item['icd2']."', icd3 =   '".$item['icd3']."', icd4 = '".$item['icd4']."', modifier = '".$item['modifier']."', scorepreliminary =  '".$item['scorepreliminary']."', datetimesubmitted = NOW(), comment = '".$item['comment']."', `cb-cpt` = '".$item['cbcpt']."', `cb-provider` =  '".$item['cbprovider']."', `cb-icd` = '".$item['cbicd']."', `cb-miscellaneous` = '".$item['cbmiscellaneous']."', `updated`='Y', timetaken=timetaken+'".$timetaken."' WHERE studentanswer_id= '".$item['studentanswer_id']. "'";
	mysqli_query($conn,$updatesql);

    $sql="UPDATE user SET `ctrainer-chart_id`='', `ctrainer-sessiondata`='' WHERE user_id= ".$_SESSION['user_id'];
    mysqli_query($conn,$sql);

	unset($_SESSION['currentTime']);
}

if(!empty($_SESSION['CHART_ARRAY']))
{
	if(in_array($_POST['models'][0]['chart_id'],$_SESSION['CHART_ARRAY']))
	{
		array_shift($_SESSION['CHART_ARRAY']);
		$_SESSION['QUESTION_NO']++;
	}
	
}

if(empty($_SESSION['CHART_ARRAY']))
{
	
	if($_SESSION['studenttype_id']=='APPLICANT')
	{
		$percentage_received=0;
		$status='Completed';

		$answersql="SELECT * FROM studentanswer WHERE testhistory_id=".$_SESSION['historyid'];

		$answer_result = mysqli_query($conn,$answersql);

		if(mysqli_num_rows($answer_result)>0)
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

		if($percentage_received>=$row2['applicant-success-percentage'])
        {
            $testresult='Passed';
        }
        else if($percentage_received<$row2['applicant-hardfail-percentage'])
        {
            $testresult='Failed';
        }
        else
        {
            $testresult='Failed';
        }


		if($_SESSION['teststatus']=='InProgress')
		{
			$time = date('Y-m-d H:i:s');
			$sql="UPDATE test SET timefinish='".$time."', status='".$status."' WHERE test_id=".$_SESSION['test_id'];
			mysqli_query($conn,$sql);

			$_SESSION['teststatus']==$status;

			$sql="UPDATE testhistory SET status='".$status."', testresult='".$testresult."' WHERE id=".$_SESSION['historyid'];
			mysqli_query($conn,$sql);
		}
	}
	
}

$returnarray = $_SESSION['CHART_ARRAY'];
echo json_encode($returnarray);
exit();	
?>