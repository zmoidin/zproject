<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

// STORING ICD10 FOR STUDENT
$icd10 = array();
$icd10_sql = "SELECT * FROM icd10";
$icd10_result = mysqli_query($conn,$icd10_sql);
if(mysqli_num_rows($icd10_result)>0)
{
    while($icd10_row = mysqli_fetch_array($icd10_result,MYSQLI_ASSOC))
    {
    	if($icd10_row['icd_id']!='')
    	{
    		$icd10[] = $icd10_row['icd_id'];
    	}
    }
}

echo json_encode( $icd10 );
