<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$sql="UPDATE testhistory SET status='Paused' WHERE id= '".$_SESSION['historyid']."'";
mysqli_query($conn,$sql);

$timetaken = strtotime(date('Y-m-d H:i:s')) - $_SESSION['currentTime'];
$sql="UPDATE studentanswer SET timetaken=timetaken+'".$timetaken."' WHERE studentanswer_id='".$_REQUEST['studentanswer_id']."'";
mysqli_query($conn,$sql);
unset($_SESSION['currentTime']);
unset($_SESSION['startTime']);
unset($_SESSION['totalTimeTaken']);

$_SESSION['teststatus'] = 'Paused';

$val = (array)json_decode($_REQUEST['sessiondata']);
$val = json_encode($val);

$sql="UPDATE user SET `ctrainer-chart_id`=".$_REQUEST['chart_id'].", `ctrainer-sessiondata`='".$val."' WHERE user_id= ".$_SESSION['user_id'];
if(mysqli_query($conn,$sql))
{
    $success=1;
    $message = $error_message['UPDATE-USER-SUCCESS'];
}
else
{
    $success=0;
    $message = mysqli_error($conn);
}
exit();	