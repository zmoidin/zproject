<?php
// INCLUDING THE CONFIG FILES
require_once ("../../../includes/config.php");
require_once ("../../../includes/auth.php");
$returnarray = array();

$sql = "SELECT * from `trainerparameter` LIMIT 1";
$result = mysqli_query($conn,$sql);
if(mysqli_num_rows($result)>0) 
{
	$row2 = mysqli_fetch_array($result,MYSQLI_ASSOC);

	$returnarray['stageadvancementnumberofcharts'] = $row2['stageadvancement-numberofcharts'];
	$returnarray['stageadvancementchartperhour'] = $row2['stageadvancement-chartperhour'];
	$returnarray['stageadvancementpercentagecorrecttoadvance'] = $row2['stageadvancement-percentagecorrecttoadvance'];
	$returnarray['stageadvancementstage4completionpercentage'] = $row2['stageadvancement-stage4completionpercentage'];
	$returnarray['stageadvancedailycompletionmessage'] = $row2['stageadvance-dailycompletion-message'];


	$returnarray['applicanttestcharts'] = $row2['applicant-testcharts'];
	$returnarray['applicantalert1percentage'] = $row2['applicant-alert1-percentage'];
	$returnarray['applicantalert1message'] = $row2['applicant-alert1-message'];

	$returnarray['applicantminutes'] = $row2['applicant-minutes'];
	$returnarray['applicantalert2percentage'] = $row2['applicant-alert2-percentage'];
	$returnarray['applicantalert2message'] = $row2['applicant-alert2-message'];

	$returnarray['applicantsuccesspercentage'] = $row2['applicant-success-percentage'];
	$returnarray['applicantalertfinalpercentage'] = $row2['applicant-alertfinal-percentage'];
	$returnarray['applicantalertfinalmessage'] = $row2['applicant-alertfinal-message'];

	$returnarray['applicanthardfailpercentage'] = $row2['applicant-hardfail-percentage'];
	$returnarray['applicantshowscore'] = $row2['applicant-showscore'];


	$returnarray['applicantcompletionemailsubject'] = $row2['applicant-completionemailsubject'];
	$returnarray['applicantcompletionemailbody'] = $row2['applicant-completionemailbody'];
	$returnarray['applicantcompletionemailmessage'] = $row2['applicant-completionemailmessage'];

	$returnarray['applicantsuccessemailactive'] = $row2['applicant-successemailactive'];
	$returnarray['applicantsuccessemailsubject'] = $row2['applicant-successemailsubject'];
	$returnarray['applicantsuccessemailbody'] = $row2['applicant-successemailbody'];

	$returnarray['applicantfailemailactive'] = $row2['applicant-failemailactive'];
	$returnarray['applicantfailemailsubject'] = $row2['applicant-failemailsubject'];
	$returnarray['applicantfailemailbody'] = $row2['applicant-failemailbody'];

}

echo json_encode($returnarray);
exit();	