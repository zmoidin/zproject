<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");

$colorArray = array('#CC9744', '#9f6614', '#F0F0F0', '#666666');

$namelist=array();
$datalist=array();
$not_found=array();
if($_REQUEST['diagonisisList'])
{
    asort($_REQUEST['diagonisisList']);
	$series = array();
	$cptlist = array('99281', '99282', '99283', '99284', '99285' , '99288', '99291');

    foreach ($_REQUEST['diagonisisList'] as $key => $value)
    {
        $count = array();
        $sql="SELECT * FROM icd10_cpt_count WHERE icd10='".$value."' AND cpt BETWEEN 99281 AND 99291 GROUP BY cpt ORDER BY cpt ASC, count DESC";
		$result = mysqli_query($conn,$sql);
		if(mysqli_num_rows($result)>0)
		{
			$rows = mysqli_fetch_all($result,MYSQLI_ASSOC);
			foreach ($rows as  $val)
	        {
	            $count[] = $val['count'];
	        }
	        $max_val = max($count);
	        $namelist[] = $value;

	        $sql="SELECT * FROM icd10_cpt_count WHERE icd10='".$value."' AND cpt BETWEEN 99281 AND 99291 GROUP BY cpt ORDER BY cpt ASC, count DESC";
	        $result = mysqli_query($conn,$sql);
			if(mysqli_num_rows($result)>0) 
			{
				while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) 
				{
					$datalist[$value][$row['cpt']] = ($row['count'] *10)/$max_val;

				}
			}
		}
		else
		{
			$not_found[]=$value;
		}
		
	}
	
}

if(count($namelist)>0)
{
	$k=0;
	foreach ($namelist as $key1 => $value1) 
	{

		$seriesData=array();

		foreach ($cptlist as $item) 
		{
			if(isset($datalist[$value1][$item]))
				$seriesData[] = $datalist[$value1][$item];
			else
				$seriesData[] = 0;
		}

		$color = $colorArray[$k];

		$series[] = array('name'=>$value1, 'data'=> $seriesData, 'color'=> $color);

		$k++;
	}

	$response = array('series' => $series, 'cptlist' => $cptlist, 'not_found' => $not_found);

	echo json_encode($response);
}
else
{
	$response = array('message'=> $error_message['NO-ICD10-DATA'], 'not_found' => $not_found);
	echo json_encode($response);
}
