<?php
require_once ("../../../includes/config.php");
if($_REQUEST['action']=='configure_tab')
{
    $sql = "SELECT * FROM user WHERE user_id=".$_SESSION['user_id'];
    $result = mysqli_query($conn,$sql);
    $user_row = mysqli_fetch_array($result,MYSQLI_ASSOC);

    if($user_row['isStageManual']=='Y')
    {
        $panel_row['stage'] = $user_row['stage'];
        $panel_row['studenttype_id'] = $user_row['studenttype_id'];
        $panel_row['basicinformation'] = $user_row['panelbar-bi'];
        $panel_row['dmoptions'] = $user_row['panelbar-dmo'];
        $panel_row['amountcomplexitydata'] = $user_row['panelbar-acd'];
        $panel_row['overallrisks'] = $user_row['panelbar-or'];
        $panel_row['emsummary'] = $user_row['panelbar-em'];
        $panel_row['procedures'] = $user_row['panelbar-procedure'];
        $panel_row['providers'] = $user_row['panelbar-provider'];
        $panel_row['conclusion'] = $user_row['panelbar-conclusion'];

    }
    else
    {
        // GETTING DATA FROM studentpanelbar TABLE FOR THE CURRENT USER
        $sql = "SELECT spb.*, u.studenttype_id FROM user u, studentpanelbar spb WHERE u.stage=spb.stage AND u.user_id=".$_SESSION['user_id'];
        $result = mysqli_query($conn,$sql);
        if(mysqli_num_rows($result)>0)
        {
            $panel_row = mysqli_fetch_array($result,MYSQLI_ASSOC);
        }
        else
        {
            $panel_row = array();
        }
    }

	

	echo json_encode($panel_row);
	exit;
}

// READING DATA 
if($_REQUEST['action']=='read_dsgcc')
{

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

    // CREATING CONDITION FROM FILTERS
    $condition=1;
    $medicationmapping_id = '';
    $medicationmapping_id2 = '';
    if(isset($_REQUEST['filter']))
    {
        foreach ($_REQUEST['filter']['filters'] as $key=>$item) 
        {
            if($item['field']!='medicationmapping_id' && $item['field']!='medicationmapping_id2')
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
            }
            else
            {
                if($item['field']=='medicationmapping_id')
                {
                    $medicationmapping_id = $item['value'];
                }
                if($item['field']=='medicationmapping_id2')
                {
                    $medicationmapping_id2 = $item['value'];
                }
            }
            
        }
        $orderby='level DESC';
    }
    else
    {
        $orderby='dsgcc_id';
    }

    $bulletarray = array();
    if($medicationmapping_id!='')
    {
        $sql = "SELECT * FROM medicationmapping WHERE medicationmapping_id='".$medicationmapping_id."'";
        $result = mysqli_query($conn,$sql);
        if(mysqli_num_rows($result)>0) 
        {
            $bulletarray = mysqli_fetch_array($result,MYSQLI_ASSOC);
        }
    }

    if(count($bulletarray)==0 && $medicationmapping_id2!='')
    {
        $sql = "SELECT * FROM medicationmapping WHERE medicationmapping_id='".$medicationmapping_id2."'";
        $result = mysqli_query($conn,$sql);
        if(mysqli_num_rows($result)>0) 
        {
            $bulletarray = mysqli_fetch_array($result,MYSQLI_ASSOC);
        }
    }

    if(count($bulletarray)>0)
    {
        $mapping_added = 0;
        if($bulletarray['lmmo']!='')
        {
            $condition.=" AND ((overallrisk='Low Moderate' AND type='MO' AND number IN (".$bulletarray['lmmo']."))";
            $mapping_added = 1;
        }

        if($bulletarray['lmcs']!='')
        {
            if($mapping_added == 1)
            {
                $condition.=" OR (overallrisk='Low Moderate' AND type='CS' AND number IN (".$bulletarray['lmcs']."))";
            }
            else
            {
                $condition.=" AND ((overallrisk='Low Moderate' AND type='CS' AND number IN (".$bulletarray['lmcs']."))";
                $mapping_added = 1;
            }
        }

        if($bulletarray['hmmo']!='')
        {
            if($mapping_added == 1)
            {
                $condition.=" OR (overallrisk='High Moderate' AND type='MO' AND number IN (".$bulletarray['hmmo']."))";
            }
            else
            {
                $condition.=" AND ((overallrisk='High Moderate' AND type='MO' AND number IN (".$bulletarray['hmmo']."))";
                $mapping_added = 1;
            }
        }

        if($bulletarray['hmcs']!='')
        {
            if($mapping_added == 1)
            {
                $condition.=" OR (overallrisk='High Moderate' AND type='CS' AND number IN (".$bulletarray['hmcs']."))";
            }
            else
            {
                $condition.=" AND ((overallrisk='High Moderate' AND type='CS' AND number IN (".$bulletarray['hmcs']."))";
                $mapping_added = 1;
            }
        }

        if($bulletarray['hmo']!='')
        {
            if($mapping_added == 1)
            {
                $condition.=" OR (overallrisk='High' AND type='MO' AND number IN (".$bulletarray['hmo']."))";
            }
            else
            {
                $condition.=" AND ((overallrisk='High' AND type='MO' AND number IN (".$bulletarray['hmo']."))";
                $mapping_added = 1;
            }
        }

        if($bulletarray['hcs']!='')
        {
            if($mapping_added == 1)
            {
                $condition.=" OR (overallrisk='High' AND type='CS' AND number IN (".$bulletarray['hcs']."))";
            }
            else
            {
                $condition.=" AND ((overallrisk='High' AND type='CS' AND number IN (".$bulletarray['hcs']."))";
                $mapping_added = 1;
            }
        }

        if($mapping_added == 1)
            $condition.=")";
    }

    // GETTING DSGCC DATA WITH APPLYING ABOVE FILTER
    $sql = "SELECT * FROM dsgcc WHERE $condition ORDER BY $orderby LIMIT ".$start.", ".$limit;
    $result = $conn->query($sql);

    //FETCHING DSGCC TOTAL ROWS REQUIRED FOR PAGINATION
    $sql1 = "SELECT COUNT(dsgcc_id) as total FROM dsgcc WHERE $condition";
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
                'dsgcc_id' => $row['dsgcc_id'],
                'OverallRisk' => $row['overallrisk'],
                'Level' => $row['level'],
                'Number' => $row['number'],
                'Text' => $row['text'],
                'Type' => $row['type']
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
}
?>