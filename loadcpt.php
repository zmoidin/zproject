<?php
require_once ("../../../includes/config.php");

$condition=1;
$condition.=" AND isActive='Y'";

if(isset($_REQUEST['filter']))
{
    foreach ($_REQUEST['filter']['filters'] as $key=>$item) 
    {
        $condition.=" ".$_REQUEST['filter']['logic']." ";
        $condition.=$item['field'];
        if($item['operator']=='eq')
        {
            $condition.="='".$item['value']."'";
        }
        if($item['operator']=='contains')
        {
            $condition.=" LIKE '%".$item['value']."%'";
        }
        if($item['operator']=='startswith')
        {
            $condition.=" LIKE '".$item['value']."%'";
        }
    }
}

if (isset($_REQUEST['page'])) 
{
    if($_REQUEST['page'] == 1) 
    {
        $start = 0;
    } 
    else 
    {
        $start = $_REQUEST['skip'];
    }
    $limit = $_REQUEST['pageSize'];
} 
else 
{
    $start = 0;
    $limit = 10;
}
$orderby='cpt_id';


// GETTING DSGCC DATA WITH APPLYING ABOVE FILTER
$sql = "SELECT * FROM cpt WHERE $condition ORDER BY $orderby LIMIT ".$start.", ".$limit;
$result = $conn->query($sql);

//FETCHING DSGCC TOTAL ROWS REQUIRED FOR PAGINATION
$sql1 = "SELECT COUNT(cpt_id) as total FROM cpt WHERE $condition";
$result1 = $conn->query($sql1);
$total = $result1->fetch_array();

// CHECK ROWS COUNT
if($result->num_rows>0)
{

    //INITIALIZING RETURING DATA ARRAY VARIABLE
    $return_data = array();
    while($row = $result->fetch_assoc())
    {

        // PUSHING DATABASE DATA INTO RETURING DATA ARRAY VARIABLE
        $return_data[] = array(
            'cpt_id' => $row['cpt_id'],
            'description' => $row['description'],
            'year' => $row['year'],
            'notes' => $row['notes']
        );
    }

    //SERVER RESPONSE TO JS FILE WITH DATA AND TOTAL ROWS
    $response=array('total'=>$total['total'], 'return_data'=>$return_data);
}
else
{
    $response=array('total'=>$total['total'], 'return_data'=>array());
}
echo json_encode($response);
exit;