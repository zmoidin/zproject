<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$returnarray = array();

$sql = "SELECT * from `provider` ORDER BY namelast ASC";
$result = mysqli_query($conn,$sql);
$returnarray[] = array('providerid'=>'Select Provider','providerval'=>'');

if($result) 
{
	while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) 
	{
		//FOR CAPITALISE WORDS
		$row['namefirst'] = strtolower($row['namefirst']);
		$row['namefirst'] = ucfirst($row['namefirst']);
		$row['namelast'] = strtolower($row['namelast']);
		$row['namelast'] = ucfirst($row['namelast']);
		//FOR UPPER CASE WORDS
		$row['providerType'] = strtoupper($row['providerType']);
		
	 	$returnarray[] = array('providerid'=>$row['namelast'].', '.$row['namefirst'].' '.$row['providerType'],'providerval'=>$row['provider_id']);
	} 
}
mysqli_free_result($result);


echo json_encode($returnarray);
exit();	
?>