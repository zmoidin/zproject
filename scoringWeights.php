<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$returnarray = array();

$sql = "SELECT item, weight from `studentscoringweight`";
$result = mysqli_query($conn,$sql);
if($result) 
{
	while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) 
	{
	 	$returnarray[] = array($row['item']=>$row['weight']);
	} 
}
mysqli_free_result($result);


echo json_encode($returnarray);
exit();	
?>