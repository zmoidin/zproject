<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$returnarray = array();

$namearr = explode(' ',trim($_REQUEST['provider_name']));
$namelast1 = end($namearr);
$namelast = strtolower($namelast1);
$namelast = ucwords($namelast);

$namefirst = str_replace($namelast1,'', trim($_REQUEST['provider_name']));
$namefirst = trim($namefirst);
$namefirst = strtolower($namefirst);
$namefirst = ucwords($namefirst);

$sql = "INSERT INTO `provider` (namefirst, namelast, providerType) VALUES('".addslashes($namefirst)."','".addslashes($namelast)."','MD')";
$result = mysqli_query($conn,$sql);
$selected_id= mysqli_insert_id($conn);


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

$res=array('selected_id'=> $selected_id, 'providers'=>$returnarray);

echo json_encode($res);
exit();	
?>