<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");


if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'getsessiondata')
{
    $sql="SELECT `ctrainer-sessiondata` FROM user WHERE `ctrainer-chart_id`=".$_REQUEST['chart_id']." AND user_id= ".$_SESSION['user_id'];
    $result = mysqli_query($conn,$sql);
    $userData = array();
    if ($result)
    {
        while($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
        {
            $userData[] = $row;
        }
    }
    echo json_encode($userData);
    die();
}

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
$response=array('success'=>$success, 'return_data'=>$message);
echo json_encode($response);
die();