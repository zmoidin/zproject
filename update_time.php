<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
if($_REQUEST['answer_id']!='')
{
	$sql="UPDATE studentanswer SET timetaken=timetaken+5 WHERE studentanswer_id= '".$_REQUEST['answer_id']."'";
	mysqli_query($conn,$sql);
}

exit();	