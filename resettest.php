<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$todayDate = new DateTime('now');
$testdate = $todayDate->format('Y-m-d');

$sql = "SELECT t.*, u.testnumber, u.studenttype_id, u.stage from user as u, test as t WHERE t.test=u.testnumber and t.user_id=u.user_id and u.user_id=".$_SESSION['user_id'];
$result = mysqli_query($conn,$sql);

if(mysqli_num_rows($result)>0) 
{
	$row = mysqli_fetch_array($result,MYSQLI_ASSOC);
	$historysql = "SELECT * FROM testhistory WHERE test_id=".$row['test_id']." AND studenttype_id='".$row['studenttype_id']."' AND studentstage='".$row['stage']."' ORDER BY id DESC LIMIT 1";

	$historyresult = mysqli_query($conn,$historysql);
	if(mysqli_num_rows($historyresult)>0)
	{
		$historyrow = mysqli_fetch_array($historyresult,MYSQLI_ASSOC);
		$historysql = "UPDATE testhistory SET status='NotStarted', testresult='' WHERE id=".$historyrow['id'];
		mysqli_query($conn,$historysql);

		$sql="UPDATE studentanswer SET testdate='".$testdate."', cpt='', provider='', provider2='', modifier='', icd1='', icd2='', icd3='', icd4='', scorepreliminary=0, scorefinal=0, comment='', `cb-cpt`='', `cb-provider`='', `cb-icd`='', `cb-miscellaneous`='', datetimesubmitted='', updated='N', admin_updated='N', timetaken=0 WHERE testhistory_id=".$historyrow['id'];
		mysqli_query($conn,$sql);

		echo 1;
	}

}