// CREATE DROPDOWNLIST FROM SELECT HTML ELEMENT
var crudServiceBaseUrl=getRootUrl()+'modules/student/chart_trainer/';
var providerArray=SiteGlobalVariables.chart_provider;
var parameterData=SiteGlobalVariables.trainer_parameter;
var error_message=SiteGlobalVariables.error_message;
var sitevariable = SiteGlobalVariables.site_variables;
var scoringWeightsArray=SiteGlobalVariables.student_scoring_weight;
var student_panelbar = SiteGlobalVariables.student_panelbar;
var studentType=SiteGlobalVariables.user_data.studenttype_id;
var studentStage = SiteGlobalVariables.user_data.stage;
var chart_response = SiteGlobalVariables.chart_response;
var messageCalled=SiteGlobalVariables.chart_response.message_called;
var chart_id=SiteGlobalVariables.chart_response.return_data[0];
var icd10Array;
var left_dsgcc;
var left_cpt;
// GETTING ITEMS PER PAGE FROM COOKIE
datagriditemsperpage=SiteGlobalVariables.user_data.datagriditemsperpage;
datagriditemsperpage=Number(datagriditemsperpage);

var mail_sent='N';
var firstChartLoaded = 0;
var testCompleted = 'N';
var testStatus;
var sessionData={};
var select_hpi = [];
var hpistatus=[];
var PrevDataItem =[];
var pechk =[];
var roschk =[];

var charthpilist=[];

var panelbars = ['basicinformation', 'dmoptions', 'amountcomplexitydata', 'overallrisks', 'emsummary', 'procedures', 'providers', 'disposition', 'conclusion'];
var rightpanelbars = ['guidelines', 'evaluationgrid'];



function diagnoseManagementOptions(mode, option){
	//ANCILLARY STUDIES
	var aslabs = $("input[name='ASLabs']:checked").val();
	var aslbc = $("input[name='ASLBC']:checked").val();
	var aslo = $("input[name='ASLO']:checked").val();
	var asxray = $("input[name='ASXRay']:checked").val();
	var asekg = $("input[name='ASEKG']:checked").val();

	var ssct = $("input[name='SSCT']:checked").val();
	var ssus = $("input[name='SSUS']:checked").val();
	var ssmri = $("input[name='SSMRI']:checked").val();
	var ssscans = $("input[name='SSScans']:checked").val();
	var sston = $("input[name='SStonometry']:checked").val();
	var ssdop = $("input[name='SSDoppler']:checked").val();
	var ssother = $("input[name='SSOther']:checked").val();

	var special_stud = (asxray >=1 || ssct >=1 || ssus >=1 || ssmri >=1 || ssscans >=1 || sston >=1 || ssdop >=1 || ssother >=1 ) ? 1 : 0;

	var chart = $("#evalution_bar").data("kendoChart");
	if(mode=='No')
	{
		$('#Stable').attr('disabled', false);
		$('#Worsening').attr('disabled', false);

		$("input[name=damo_established_options][value='"+option+"']").prop('checked', true);

		sessionData.DamoEstablishedOptions = option;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(option == "Stable")
		{
			chart.options.series[0].data[0] = 1;
		}
		else
		{
			chart.options.series[0].data[0] = 2;
		}
	}
	else
	{
		$('#Stable').attr('disabled', true);
		$('#Worsening').attr('disabled', true);

		chart.options.series[0].data[0] = 4;

		var totalas = aslabs + aslbc + aslo + asxray + asekg;
		if(totalas >= 3 || special_stud > 0)
		{
			chart.options.series[0].data[0] = 5;
		}
	}
	//expandEvalPanel();
	chart.options.transitions = false;
	chart.redraw();
}

$("#diagnosis_management").kendoDropDownList();
$("#ctHPI").kendoDropDownList();
$("#ctHPI2").kendoDropDownList();
$("#ctHPI3").kendoDropDownList();
$("#ctHPI4").kendoDropDownList();
$("#ctHPI5").kendoDropDownList();
$("#ctHPI6").kendoDropDownList();
$("#ctHPI7").kendoDropDownList();
$("#ctHPI8").kendoDropDownList();
$("#ctHPI9").kendoDropDownList();
$("#ctHPI10").kendoDropDownList();
$("#conclSet").kendoDropDownList();
// $("#primary_provider").kendoDropDownList();
// $("#secondary_provider").kendoDropDownList();
// $('#damo_established_options').kendoDropDownList();
// $('#damo_established_options').data('kendoDropDownList').enable(false);
$('#Stable').attr('disabled', true);
$('#Worsening').attr('disabled', true);


$("#AAC").kendoTabStrip(
{
	animation:  
	{
		open: 
		{
			effects: "fadeIn"
		}
	}
});

$("#over-all").kendoTabStrip(
{
	animation:  
	{
		open: 
		{
			effects: "fadeIn"
		}
	}
});

$("#EM-summary").kendoTabStrip(
{
	animation:  
	{
		open: 
		{
			effects: "fadeIn"
		}
	}
});

$("#chart_loader_tabstrip2").kendoTabStrip(
{
	scrollable: true,
	animation:  
	{
		open: 
		{
			effects: "fadeIn"
		}
	}
});

$("#charttrainer_bottom2").kendoTabStrip(
{
	scrollable: true,
	animation:  {
		open: {
			effects: "fadeIn"
		}
	}
});

$("#chart_trainer_tab").kendoTabStrip(
{
	animation:  {
		open: {
			effects: "fadeIn"
		}
	}
});

// CHART LOADER TABSTRIP SHOW HIDE ON CLICK
$(".show-details-content").click(function () 
{
	var dataId = $(this).attr('data-id');
	$(".chart_trainer_bottom .tabs_li li").each(function (index, el) {
		if ($(this).attr("data-id") == dataId) {
			$(".chart_trainer_bottom .tabs_li li").removeClass('k-state-active');
			$(this).addClass('k-state-active');
			$(".tabDiv").css("display", "none");
			$(".tabDiv[data-id='" + dataId + "']").css("display", "block").css("opacity", "1");
		}
	});
	$(".view-details-content").show(); 
   
});

$(".chart_trainer_bottom .tabs_li li span").click(function(index, el) 
{
	var spanTxt = $(this).text();
	spanTxt = spanTxt.replace(/\s/g, '');
	$(".show-details-content").each(function(index, el)
	{
		if ($(this).attr("data-id") == spanTxt) {
			$(".show-details-content").removeClass('k-state-active');
			$(".show-details-content span").removeClass('k-state-selected');
			$(this).find("span:eq(0)").addClass('k-state-selected');
			$(".show-details-content .k-content").css("display", "none")
			$(this).addClass('k-state-active');
			$(this).find(".k-content").css("display", "block").css("height", "auto").css("overflow", "visible");
		}
	});
});

$("#chart_loader_tabstrip2 li").on("click", function(index, el)
{
	var dataID = $(this).attr("data-id");
	$("#chart_trainer_panelbar li").each(function(index, el) 
	{
		if($(this).attr("data-id") == dataID)
		{
			$("#chart_trainer_panelbar li").removeClass('k-state-active');
			$("#chart_trainer_panelbar li").removeClass('k-state-highlight');
			$("#chart_trainer_panelbar li span").removeClass('k-state-selected');
			$("#chart_trainer_panelbar li .k-content").css("display", "none");

			$(this).addClass('k-state-highlight');
			$(this).addClass('k-state-active');
			$(this).find("span:eq(0)").addClass('k-state-selected');
			$(this).find("li:eq(0), .medication").addClass('k-state-active');
			$(this).find(".k-content:eq(0), #EM-summary .k-content:eq(0), #AAC .k-content:eq(0), .medication").css({"display": "block", "height": "auto", "overflow": "visible", "opacity": "1"});
		}
	});
});

/*EM-summary*/
$("#EM-summary li").on("click", function(index, el)
{
	var dataID = $(this).attr("inner-data-id");
	var panelBar = $("#right_panelbar").data("kendoPanelBar");
	panelBar.select("#chart");
	panelBar.expand("#chart");

	$("#charttrainer_bottom2 li").each(function(index, el) 
	{
		if($(this).attr("inner-data-id") == dataID)
		{
			$("#charttrainer_bottom2 li").removeClass('k-state-active');
			$(this).addClass('k-state-active');
			$(".toptab").css("display", "none");
			$(".toptab[inner-data-id='" + dataID + "']").css("display", "block").css("opacity", "1");

		}
	});
});

$(".btnDiv button").on("click", function(event) 
{
	var dataID = $(this).attr("btn-data-id");
	var panelBar = $("#right_panelbar").data("kendoPanelBar");
	panelBar.select("#chart");
	panelBar.expand("#chart");

	$("#charttrainer_bottom2 li").each(function(index, el) 
	{
		if($(this).attr("inner-data-id") == dataID)
		{
			$("#charttrainer_bottom2 li").removeClass('k-state-active');
			$(this).addClass('k-state-active');
			$(".toptab").css("display", "none");
			$(".toptab[inner-data-id='" + dataID + "']").css("display", "block").css("opacity", "1");
		}

		if(dataID=='ICD10')
		{
			if(studentType=='APPLICANT')
			{
				var h = $(window).height()-400;
				h=h-30;
			}
			else
			{
				var dh = $(window).height()-170;
				var h = (dh-140)/2;
				h=h-30;
			}

			var w = $('#charttrainer_bottom2-1').width()-40;
			var chart = $("#icd10_graph").data("kendoChart");
			if(chart)
			{
				$("#icd10_graph").css( { width: w, height: h });
				chart.redraw();
			}
			
		}


	});
});

$("#charttrainer_bottom2 li").on('click', function(event) 
{
	var innerdataId = $(this).attr('inner-data-id');
	var panelBar = $("#right_panelbar").data("kendoPanelBar");
	panelBar.select("#chart");
	panelBar.expand("#chart");

	$(".toptab").css("display", "none");
	$(".toptab[inner-data-id='" + innerdataId + "']").css("display", "block").css("opacity", "1");
	/* Act on the event */
});

$("#chart_loader_tabstrip2 li").on('click', function(event) 
{
	var innerdataId = $(this).attr('inner-data-id');
	// $(".tabDiv").removeAttr('style');
	// $(".tabDiv").css("opacity", "0");
	/* Act on the event */
});

// E/M SUMMARY FOR CODERS -> ROS : CHECK ALL CHECKBOXES
$("#ROS_CT3_yes").on('click', function(event) 
{
	expandEvalPanel();
	sessionData.ROS_CT3 = $(this).val();
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	$('.roschk').prop('checked',true);
	evalgrid_rosbar();
});

// E/M SUMMARY FOR CODERS -> ROS : UNCHECK ALL CHECKBOXES
$("#ROS_CT3_no").on('click', function(event) 
{
	expandEvalPanel();
	sessionData.ROS_CT3 = $(this).val();
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	$('.roschk').prop('checked',false);
	evalgrid_rosbar();
});

$("input[name=ROS_CT2]").on('click', function(event){

	sessionData.ROS_CT2 = $(this).val();
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
});

function evalgrid_rosbar()
{
	var roscount = $(".roschk:checked").length;
	var chart = $("#evalution_bar").data("kendoChart");
	if(roscount == 1)
			chart.options.series[0].data[4] = 3;  
	else if(roscount >= 2  && roscount < 10)
			chart.options.series[0].data[4] = 4;  
	else if(roscount >= 10)
			chart.options.series[0].data[4] = 5;  
	else
			chart.options.series[0].data[4] = 0;  
	//expandEvalPanel();
	chart.options.transitions = false;
	chart.redraw();  
}

function emSummary()
{
	var HPIct = $("input[name='HPI-ct-y']:checked").val();
	var HPIchief = $("input[name='HPIchief-ct']:checked").val();

	sessionData.HPIct = HPIct;
	sessionData.HPIchief = HPIchief;

	var select_hpi = [];
	var hpistatus = [];
	for (var i = 0; i < charthpilist.length; i++) {
		select_hpi[i]=$("#select_hpi_"+i).val();
		hpistatus[i] = $("input[name='hpistatus_"+i+"']:checked").val();
	}

	sessionData.select_hpi = select_hpi;
	sessionData.hpistatus = hpistatus;
	
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

}

function overall_medication()
{
	var MIVfluids = $("input[name='IV-FLUIDS']:checked").val();
	var IV_medication = $("input[name='IV-MED-C']:checked").val();
	var IV_medication2 = $("input[name='IV-MED-NC']:checked").val();
	var IV_medication3 = $("input[name='IM-MED-NC']:checked").val();
	var IV_medication4 = $("input[name='IM-MED-C']:checked").val();
	var med_nebu_medc = $("input[name='NB-MED']:checked").val();
	var MIVfluid = $("input[name='OREE']:checked").val();
	var MIRx = $("input[name='RX']:checked").val();

	sessionData.MIVfluids = MIVfluids;
	sessionData.IV_medication = IV_medication;
	sessionData.IV_medication2 = IV_medication2;
	sessionData.IV_medication3 = IV_medication3;
	sessionData.IV_medication4 = IV_medication4;
	sessionData.med_nebu_medc = med_nebu_medc;
	sessionData.MIVfluid = MIVfluid;
	sessionData.MIRx = MIRx;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
}

function evalgrid_acdbar()
{
	// SPECIAL STUDIES
	var ssct = $("input[name='SSCT']:checked").val();
	var ssus = $("input[name='SSUS']:checked").val();
	var ssmri = $("input[name='SSMRI']:checked").val();
	var ssscans = $("input[name='SSScans']:checked").val();
	var sston = $("input[name='SStonometry']:checked").val();
	var ssdop = $("input[name='SSDoppler']:checked").val(); 
	var ssother = $("input[name='SSOther']:checked").val();

	sessionData.SSCT = ssct;
	sessionData.SSUS = ssus;
	sessionData.SSMRI = ssmri;
	sessionData.SSScans = ssscans;
	sessionData.SStonometry = sston;
	sessionData.SSDoppler = ssdop;
	sessionData.SSOther = ssother;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	//ANCILLARY ``STUDIES``
	var aslabs = $("input[name='ASLabs']:checked").val();
	var aslbc = $("input[name='ASLBC']:checked").val();
	var aslo = $("input[name='ASLO']:checked").val();
	var asxray = $("input[name='ASXRay']:checked").val();
	var asekg = $("input[name='ASEKG']:checked").val();

	// DISPOSITION VALUE - COUNTS AS ONE 
	var disposition = $("input[name='disposition']:checked").val();
	var additional_workup = 0;
	if(disposition && (disposition == "Inpatient" || disposition == "Observation" || disposition =="Transfer")) additional_workup = 1;

	sessionData.ASLabs = aslabs;
	sessionData.ASLBC = aslbc;
	sessionData.ASLO = aslo;
	sessionData.ASXRay = asxray;
	sessionData.ASEKG = asekg;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	//OTHER INFO
	var other_disc = $("input[name='other_disc']:checked").val();
	var other_ind = $("input[name='other_ind']:checked").val();
	var other_old = $("input[name='other_old']:checked").val();
	var other_rev = $("input[name='other_rev']:checked").val();
	var other_fev = $("input[name='other_fev']:checked").val();

	sessionData.other_disc = other_disc;
	sessionData.other_ind = other_ind;
	sessionData.other_old = other_old;
	sessionData.other_rev = other_rev;
	sessionData.other_fev = other_fev;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	var chart = $("#evalution_bar").data("kendoChart");
	if(chart)
	{
		var special_stud = (asxray >=1 || ssct >=1 || ssus >=1 || ssmri >=1 || ssscans >=1 || sston >=1 || ssdop >=1 || ssother >=1 ) ? 1 : 0;
		var acdcount =0;

		if(ssct >= 1 || ssus >=1 || ssmri >=1 || ssscans >= 1 || sston >= 1 || ssdop >= 1 || ssother >= 1 || asxray >= 1)
			acdcount++;
		if(aslabs >= 1 || aslbc >=1 || aslo >=1)
			acdcount++;
		if( asekg >= 1)
			acdcount++;
		if(other_disc == "Yes")
			acdcount++;
		if(other_ind == "Yes")
			acdcount = acdcount + 2;
		if(other_old == "Yes")
			acdcount++;
		if(other_rev == "Yes")
			acdcount = acdcount + 2;


		if(acdcount == 1)
			chart.options.series[0].data[1] = 1; 
		else if(acdcount == 2)
			chart.options.series[0].data[1] = 2; 
		else if(acdcount == 3)
			chart.options.series[0].data[1] = 4; 
		else if(acdcount >= 4)
			chart.options.series[0].data[1] = 5; 
		else
		chart.options.series[0].data[1] = 0;  

		var totalas = additional_workup + parseInt(aslabs) + parseInt(aslbc) + parseInt(aslo) + parseInt(asxray) + parseInt(asekg);

		if($("input[name='diagnosis_mode']:checked").val() == "yes")
		{
			if(totalas >= 3 || special_stud > 0)
				chart.options.series[0].data[0] = 5;
			else  
				chart.options.series[0].data[0] = 4;
		}
		else
		{
			chart.options.series[0].data[0] = chart.options.series[0].data[0];  
		}

		//expandEvalPanel();
		chart.options.transitions = false;
		chart.redraw(); 
	}
}


function createChart() 
{
	$("#evalution_bar").kendoChart({
		legend: {
			visible: false
		},
		seriesDefaults: {
			type: "bar"
		},
		series: [{
			name: "Evaluation",
			data: [0, 0, 0, 0, 0, 0, 0],
			color: '#CC9744'
		}],
		chartArea: 
		{
			height: 180
		},
		valueAxis: {
			min: 0,
			max: 6,
			majorUnit: 1,
			line: {
				visible: false
			},
			minorGridLines: {
				visible: true
			},
			labels: {
				skip: 1,
				rotation: "auto",
				font: "9px segoeui",
				template: "#:getLabel(value)#"
			}
		},
		categoryAxis: {
			categories: ["Diagnosis", "Amount and Complexity", "Overall Risk", "HPI", "ROS", "PMFSH", "PE"],
			labels:
			{
			  font: "9px segoeui"
			},
			majorGridLines: {
				visible: false
			}
		}
	});
}

function getLabel(value)
{
	switch(value)
	{
		case 1: return "99281";
		case 2: return "99282";
		case 3: return "99283";
		case 4: return "99284";
		case 5: return "99285";
		case 6: return "99291";
	}
}


if(studentType !='APPLICANT')
{
	$(document).ready(createChart);
	$(document).bind("kendo:skinChange", createChart);
}

// THIS FUNCTION IS CALLED WHEN RIGHT MAIN PANELBAR EXPANED
function onRightPanelbarExpand(e) {
	
	if($(e.item).attr('id')=='evaluationgrid')
	{
		setTimeout(function() {
		var chart = $("#evalution_bar").data("kendoChart");
		chart.options.transitions = false;
		chart.redraw();
		console.log('redraw called');
		 }, 100);
	}
}

function expandEvalPanel()
{
	if (document.getElementById('evaluationgrid')) 
	{
		var panelBar = $("#right_panelbar").data("kendoPanelBar");
		panelBar.select("#evaluationgrid");
		panelBar.expand('#evaluationgrid');
	}
}
// EXECUTE ON DOM READY
$(document).ready(function()
{

	//WITH KEYUP, CHECKING AND SENDING FILTER DATA TO SERVER
    //TIMER IDENTIFIER FOR TYPING AND SEARCHING
    var typingTimer;
    //TIME IN MS SO THAT IT WILL SEARCH WHEN USER STOP TYPING
    var doneTypingInterval = 750;

    $('.diagonisisList').keyup(function()
    {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //FILTER FUNCTION
    function doneTyping()
    {
        createICD10chart();
    }

	// FILTER DSGCC GRID ON CHANGING RADIO VALUES OF MEDICATION TAB
	$('.medication_radio').on('click',function()
	{
		filterDsgccGrid();
	});

	// FILTER DSGCC GRID ON CHANGING RADIO VALUES OF RISK LABELS UNDER DSGCC TAB
	$('input[name=dsgcc_level]').on('click',function()
	{
		filterDsgccGrid();
	});

	// USER EVENT: DSGCC GRID: FILTERING DATA SOURCE
	$('#search_dsgcc, #search_dsgcc1').on('keyup',function()
	{
		filterDsgccGrid();
	});


	$('.conclusionchk').on('click',function()
	{
		var cptchk='F';
		var providerchk='F';
		var icdchk='F';
		var miscellaneous='F';

		if($('#cptchk').prop("checked") == true)
		{
			cptchk='T';
		}
		if($('#providerchk').prop("checked") == true)
		{
			providerchk='T';
		}
		if($('#icdchk').prop("checked") == true)
		{
			icdchk='T';
		}
		if($('#miscellaneous').prop("checked") == true)
		{
			miscellaneous='T';
		}

		sessionData.cptchk = cptchk;
		sessionData.providerchk = providerchk;
		sessionData.icdchk = icdchk;
		sessionData.miscellaneous = miscellaneous;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$('#comment1').on('keyup',function()
	{
		var comment = $('#comment1').val();
		sessionData.comment = comment;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
	});
	
	var result = chart_response;
	if(chart_response.message=='' || chart_response.message=='TEST_IN_PROGRESS')
	{
		sessionData = JSON.parse(sessionStorage.getItem('sessionData')) ? JSON.parse(sessionStorage.getItem('sessionData')) : {};
		if(jQuery.isEmptyObject(sessionData) && chart_id)
		{
			$.ajax(
			{
				type:"POST",
				url:crudServiceBaseUrl+"save_test.php",
				data:{action:'getsessiondata', chart_id:chart_id},
				success:function(data)
				{
					var res = JSON.parse(data);
					if(res.length>0)
					{
			  
						sessionData = JSON.parse(res[0]["ctrainer-sessiondata"]);
						sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
						if(sessionData.pechk)
						{
							pechk = sessionData.pechk;
						}
						if(sessionData.roschk)
						{
							roschk = sessionData.roschk;
						}

					}
					else
					{
						sessionData.chart_id = chart_id;
						sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
					}
				}
			});
		}
		else if(sessionStorage.getItem('sessionData'))
		{
			sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
			if(sessionData.pechk)
			{
				pechk = sessionData.pechk;
			}
			if(sessionData.roschk)
			{
				roschk = sessionData.roschk;
			}

		}
		else
		{
			$.ajax(
			{
				type:"POST",
				url:crudServiceBaseUrl+"save_test.php",
				data:{action:'getsessiondata', chart_id:chart_id},
				success:function(data)
				{
					sessionData = data ? data['ctrainer-sessiondata'] : JSON.parse(sessionStorage.getItem('sessionData'));
					if(sessionData.pechk)
					{
						pechk = sessionData.pechk;
					}
					if(sessionData.roschk)
					{
						roschk = sessionData.roschk;
					}
				}
			});
		}

		if(studentType=='APPLICANT')
		{
			if(window.localStorage.getItem('testStarted')=='Y')
			{
				configureLeftTab();
				configureRightTab();

				if(chart_id)
				{
					loadChartImages(chart_id);
					getChartEmHpis(chart_id);
				}
				else
				{
					firstChartLoaded++;
				}
			}
			else
			{

				$('#total_time').html('Total time: '+parseInt(parameterData.applicantminutes)+' minutes');
				$('#remaining_time').html('Time left: '+parseInt(parameterData.applicantminutes)+' minutes');
				$('#timer').html('00:00');
				$('#start').removeClass('hiddenbutton');

			}
			

		}
		else
		{
			configureLeftTab();
			configureRightTab();

			if(chart_id)
			{
				loadChartImages(chart_id);
				getChartEmHpis(chart_id);
			}
			else
			{
				firstChartLoaded++;
			}
		}

		

	}
	else
	{ 
		if(chart_response.message=='TEST_COMPLETED' || chart_response.message=='TIMES_UP')
		{
			// SHOWING ONLY MESSAGE
			$('#chart-wrapper').html('<span class="textcompleted">'+error_message['CONCLUSION-TEST-ALREADY-COMPLETED']+'</span>');
			$('#chart-wrapper').addClass('completed');
			$('#chart-wrapper').show();
		}
		else if(chart_response.message=='QUESTION_NOT_ASSIGNED_FOR_TODAY')
		{
			$('#chart-wrapper').html('<span class="textcompleted">'+error_message['QUESTION-NOT-ASSIGNED-FOR-TODAY']+'</span>');
			$('#chart-wrapper').addClass('completed');
			$('#chart-wrapper').show();
		}
		else if(chart_response.message=='TEST_COMPLETED_FOR_TODAY')
		{
			$('#chart-wrapper').html('<span class="textcompleted">'+parameterData.stageadvancedailycompletionmessage+'</span>'); // Remove this message by parameter response
			$('#chart-wrapper').append('<input type="button" value="Reset Test" id="resetTest" />');
			$('#chart-wrapper').addClass('completed');
			$('#chart-wrapper').show();
		}
		else
		{
			if(chart_response.message=='TEST_NOT_ASSIGNED')
			{
				$('#message_area').html(error_message['CONCLUSION-TEST-NOT-ASSIGNED']);
				$('#message_area').addClass(error_message['type_CONCLUSION-TEST-NOT-ASSIGNED']);
				$('#message_area').show();
			}   
		}
	}

	$('#pause').addClass('hiddenbutton');
	$('#resume').addClass('hiddenbutton');
	$('#test_completed').addClass('hiddenbutton');

	// DISABLE EVERYTHING IF TEST STATUS IS PAUSED
	if(chart_response.test_status=='Paused')
	{
		$('#resume').removeClass('hiddenbutton');
		$('.trainer_right').css('display','none');
		$('#saveChanges').addClass('btndisabled');
		$('#next').addClass('btndisabled');

		var panelBar = $("#chart_trainer_panelbar").data("kendoPanelBar");
		if(panelBar)
		{
			for (var i = 0; i < panelbars.length; i++) 
			{
				var panelid=panelbars[i];
				if (document.getElementById(panelid)) 
				{
					panelBar.enable($("#"+panelid), false);
				}
			}
			$('.pause_overlay').show();
		}

	}

	// SHOW PAUSE BUTTON IF TEST STATUS IS RUNNING
	if(chart_response.test_status=='InProgress')
	{

		$('#pause').removeClass('hiddenbutton');
		$('#saveChanges').removeClass('btndisabled');

		var panelBar = $("#chart_trainer_panelbar").data("kendoPanelBar");
		if(panelBar)
		{
			for (var i = 0; i < panelbars.length; i++) 
			{
				var panelid=panelbars[i];
				if (document.getElementById(panelid)) 
				{
					panelBar.enable($("#"+panelid), true);
				}
			}
			$('.pause_overlay').hide();
		}

	}

	// DISPLAY THE QUESTION NUMBER AND CHART NUMBER 
	if(chart_id)
	{
		var chartDebug = '<small style="color:red"> For Testing Only: Chart '+chart_id +'</small>';

		if(studentType=='APPLICANT')
		{
			$('#question_no').html('Question '+chart_response.question_number+' ('+parameterData.applicanttestcharts+' Minimum) '+ chartDebug);
		}
		else
		{
			var chartMinMsg = (chart_response.question_number > parameterData.stageadvancementnumberofcharts) ? "" :  ' ('+parameterData.stageadvancementnumberofcharts+' Minimum) ';
			$('#question_no').html('Question '+chart_response.question_number+ + chartDebug);
		}
	}
	

	if(studentType !='APPLICANT' && Number(chart_response.question_number) > Number(parameterData.stageadvancementnumberofcharts))
	{
		if(chart_response.test_status=='InProgress' || chart_response.test_status=='Paused')
		{
			$('#test_completed').removeClass('hiddenbutton');
		}
		
	}
		
	// USER EVENT: BI: ARRIVAL MODE CLICK
	$("input[name=Arrival]").click( function () 
	{
		if($(this).is(':checked'))
		{
			sessionData.ArrivalData = $(this).val();
			sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
		}
	});

	// USER EVENT: BI: CRITICAL CARE DOCUMENTED RADIO CLICK
	$("input[name=Mode]").click( function () 
	{
		if($(this).is(':checked'))
		{
			sessionData.ModeData = $(this).val();
			sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
		}
	});

	// PARAMETER DATA
	var alert1Time=(parameterData.applicantminutes*60*parameterData.applicantalert1percentage)/100;
	var alert2Time=(parameterData.applicantminutes*60*parameterData.applicantalert2percentage)/100;
	var finalTime=(parameterData.applicantminutes*60*parameterData.applicantalertfinalpercentage)/100;

	window.localStorage.setItem('alert1Time', alert1Time);
	window.localStorage.setItem('alert2Time', alert2Time);
	window.localStorage.setItem('finalTime', finalTime);

	$("#icd10_graph").html(error_message['ICD10-DEFAULT-TEXT']);
	$("#icd10_graph").addClass('icdmessage');

	// USER EVENT: CONCLUSION GRID: SAVE BUTTON CLICK
	$("#saveChanges").kendoButton(
	{
		click: function(e) 
		{
			if(!$("#saveChanges").hasClass('btndisabled'))
			{
				var grid = $("#conclusiongrid").data("kendoGrid");
				grid.saveChanges();
			}
		}
	});

	// USER EVENT: CONCLUSION GRID: NEXT BUTTON CLICK
	$("#next").on('click', function()
	{
		if(!$("#next").hasClass('btndisabled'))
		{
			$('#conclusionfeedback_container').hide();
			$('#next').removeClass('feedbackactive')
			$('#conclusiongrid .k-textbox').val('');
			$('#saveChanges').removeClass('btndisabled');
			$('#next').addClass('btndisabled');
			var grid = $("#conclusiongrid").data("kendoGrid");
			grid.dataSource.read(); 
			grid.refresh();

			var panelBar = $("#chart_trainer_panelbar").data("kendoPanelBar");
			panelBar.select("#basicinformation");
			panelBar.expand("#basicinformation");

			$("div.conclusionr input[type='checkbox']").prop('checked', false);
			resetFormElements();
		}
	});


	loadAllProviderDropdowns();
	loadNoSplitProviderContent();

	var PROCEDURES_CT_CHECK = $( 'input[name=PROCEDURES_CT]:checked' ).val();
	if(PROCEDURES_CT_CHECK !='T' && PROCEDURES_CT_CHECK != null)
	{
		$("#procedures_primary_provider").data("kendoDropDownList").enable(false);
		$("#procedures_secondary_provider").data("kendoDropDownList").enable(false);
	}

	$('input[name=PROCEDURES_CT]').on('click',function()
	{
		var PROCEDURES_CT = $( 'input[name=PROCEDURES_CT]:checked' ).val();
		sessionData.PROCEDURES_CT = PROCEDURES_CT;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(PROCEDURES_CT=='T')
		{
			$('#procedures_modifier').removeAttr('disabled');
			$('#procedures_icd10').removeAttr('disabled');
			$("#procedures_primary_provider").data("kendoDropDownList").enable(true);
			$("#procedures_secondary_provider").data("kendoDropDownList").enable(true);
			$('input[name=PROCEDURES2_CT]').removeAttr('disabled');
		}
		else
		{
			$('#procedures_modifier').val('');
			$('#procedures_modifier').attr('disabled','disabled');
			$('#procedures_icd10').val('');
			$('#procedures_icd10').attr('disabled','disabled');
			$("#procedures_primary_provider").data("kendoDropDownList").value('');
			$("#procedures_primary_provider").data("kendoDropDownList").enable(false);
			$("#procedures_secondary_provider").data("kendoDropDownList").value('');
			$("#procedures_secondary_provider").data("kendoDropDownList").enable(false);
			$('#PROCEDURES_CT2_no').click();
			$('#additional_procedures').html('');
			$('input[name=PROCEDURES2_CT]').attr('disabled','disabled');
		}
	});


	$('input[name=PROCEDURES2_CT]').on('click',function()
	{
		var PROCEDURES_CT2 = $( 'input[name=PROCEDURES2_CT]:checked' ).val();

		sessionData.PROCEDURES2_CT = PROCEDURES_CT2;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
		if(PROCEDURES_CT2=='T')
		{
			addAnotherProcedure();
		}
		else
		{
			$('#additional_procedures').html('');
		}
	});

	$('#procedures_cpt_keyword').on('keyup',function()
	{
		filterCPTGrid();
	});
	
	$('input[name=PROVIDERS_CT]').on('click',function()
	{
		var PROVIDERS_CT = $( 'input[name=PROVIDERS_CT]:checked' ).val();

		sessionData.PROVIDERS_CT = PROVIDERS_CT;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(PROVIDERS_CT=='T')
		{
			loadYesSplitProviderContent();
		}
		else
		{
			loadNoSplitProviderContent();
		}
	});

	
	$(document).on('click','input[name=PROVIDERS2_CT]',function()
	{
		var PROVIDERS2_CT = $( 'input[name=PROVIDERS2_CT]:checked' ).val();

		sessionData.PROVIDERS2_CT = PROVIDERS2_CT;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(PROVIDERS2_CT=='T')
		{
			$('#supervising_primary').show();
			$('#midlevel_primary').hide();
		}
		else
		{
			$('#supervising_primary').hide();
			$('#midlevel_primary').show();
		}
	});

	$(document).on('change','select.hpiselects',function()
	{
		var hpiselects = $("select.hpiselects");
		var hpicount =0;

		if (document.getElementById('evalution_bar')) 
		{
			var chart = $("#evalution_bar").data("kendoChart");

			var hpivals = [];
			for(var i=0; i<hpiselects.length; i++)
			{
				if(hpiselects[i].value != 'UNK') 
				{
					if(hpivals.indexOf(hpiselects[i].value) < 0)
					{
						hpivals.push(hpiselects[i].value);
						hpicount++;
					}
				}
				if(hpicount == 4) break;
			}
			if(hpicount >= 1 && hpicount <4)
					chart.options.series[0].data[3] = 3;  
			else if(hpicount >= 4)    
					chart.options.series[0].data[3] = 5;
			else     
					chart.options.series[0].data[3] = 0;
			expandEvalPanel();        
			chart.options.transitions = false;
			chart.redraw(); 
		}

	});

	$(document).on('click','.roschk',function()
	{
		
		var roschk = [];
		$('input:checkbox.roschk').each(function () {
	        var sThisVal = (this.checked ? $(this).val() : "");
	        if(sThisVal!='')
	        {
	        	roschk.push($(this).attr('id'));
	        }
	        
	    });

		sessionData.roschk = roschk;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
		expandEvalPanel(); 
		evalgrid_rosbar();
	});

	$(".PFSH-CT .k-radio").on('click', function()
	{
		var PFSH_CT = $('input[name=PFSH_CT]:checked').val();
		var PFSH2_CT = $('input[name=PFSH2_CT]:checked').val();
		var PFSH3_CT = $('input[name=PFSH3_CT]:checked').val();

		sessionData.PFSH_CT = PFSH_CT;
		sessionData.PFSH2_CT = PFSH2_CT;
		sessionData.PFSH3_CT = PFSH3_CT;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		var pfsh = $(".PFSH-CT .k-radio:checked");
		var chart = $("#evalution_bar").data("kendoChart");
		var pfsh_ct =0;

		pfsh.each(function(rad)
		{
			pfsh_ct += this.value;
		});
		if(pfsh_ct == 1)
				chart.options.series[0].data[5] = 4
		else if(pfsh_ct > 1)
				chart.options.series[0].data[5] = 5;  
		else
				chart.options.series[0].data[5] = 0;  
		expandEvalPanel();
		chart.options.transitions = false;
		chart.redraw();
	});
	
	$("#AAC .k-radio").on('click',function()
	{
		evalgrid_acdbar();
	});

	$("#over-all-1 .k-radio").on('click',function()
	{
		overall_medication();
	});

	$(document).on('click','#EM-summary-1 .k-radio',function()
	{
		emSummary();
	});

	$(document).on('keyup', '#procedures_modifier', function () {

		sessionData.procedures_modifier = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('keyup', '#procedures_icd10', function () {

		sessionData.procedures_icd10 = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('change', '#procedures_primary_provider', function () {

		sessionData.procedures_primary_provider = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('change', '#procedures_secondary_provider', function () {

		sessionData.procedures_secondary_provider = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('keyup', '#procedures_modifier2', function () {

		sessionData.procedures_modifier2 = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('keyup', '#procedures_icd102', function () {

		sessionData.procedures_icd102 = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('change', '#procedures_primary_provider2', function () {

		sessionData.procedures_primary_provider2 = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('change', '#procedures_secondary_provider2', function () {

		sessionData.procedures_secondary_provider2 = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	});

	$(document).on('change','#EM-summary-1 .k-dropdown.hpiselects',function()
	{
		emSummary();
	});

	$(document).on('click','#EM-summary-1 .hpistatus',function()
	{
		emSummary();
	});

	$(document).on('click','.pechk',function()
	{

		var pechk = [];
		$('input:checkbox.pechk').each(function () {
	        var sThisVal = (this.checked ? $(this).val() : "");
	        if(sThisVal!='')
	        {
	        	pechk.push($(this).attr('id'));
	        }
	        
	    });

	    console.log(pechk);
		sessionData.pechk = pechk;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));


		var pecount = $(".pechk:checked").length;
		var peorganscount = $(".pechk.organs:checked").length;
		var chart = $("#evalution_bar").data("kendoChart");
		if(pecount == 1)
			chart.options.series[0].data[6] = 1;
		else if(pecount == 2 )
			chart.options.series[0].data[6] = 3;
		else if(pecount > 2)
			chart.options.series[0].data[6] = 4;
		else
			chart.options.series[0].data[6] = 0;

		if( peorganscount > 7)
				chart.options.series[0].data[6] = 5;

		expandEvalPanel();
		chart.options.transitions = false;
		chart.redraw();
	});

	$(document).on('click','input[name=pe-fev]',function(){
		sessionData.pefev = $(this).val();
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
	});

	$(document).on('click','input[name=PROVIDERS3_CT]',function()
	{
		var PROVIDERS3_CT = $( 'input[name=PROVIDERS3_CT]:checked' ).val();

		sessionData.PROVIDERS3_CT = PROVIDERS3_CT;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(PROVIDERS3_CT=='T')
		{
			loadTransferProvider();
		}
		else
		{
			$('#transfer_container').html('');
		}
	});

	$(document).on('click','#resetTest',function(){
		$('#resetTest').hide();
		$.ajax(
		{  
			type:"POST",  
			url:crudServiceBaseUrl+"resettest.php",
			data:{},  
			success:function(data)
			{
				location.reload(); 
			}
		});
	});

	// DISPOSITION RADIO BUTTON CLICK
	$('input[name=disposition]').on('click',function()
	{
		// REMEMBER SELECTION IN SESSION
		var disposition = $( 'input[name=disposition]:checked' ).val();
		sessionData.Disposition = disposition;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		evalgrid_acdbar();
	});

	// DIAGNOSIS MODE RADIO BUTTON CLICK
	$('input[name=diagnosis_mode]').on('click',function()
	{
		var mode = $( 'input[name=diagnosis_mode]:checked' ).val();

		sessionData.DiagnosisMode = mode;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		//ANCILLARY STUDIES
		var aslabs = $("input[name='ASLabs']:checked").val();
		var aslbc = $("input[name='ASLBC']:checked").val();
		var aslo = $("input[name='ASLO']:checked").val();
		var asxray = $("input[name='ASXRay']:checked").val();
		var asekg = $("input[name='ASEKG']:checked").val();

		var ssct = $("input[name='SSCT']:checked").val();
		var ssus = $("input[name='SSUS']:checked").val();
		var ssmri = $("input[name='SSMRI']:checked").val();
		var ssscans = $("input[name='SSScans']:checked").val();
		var sston = $("input[name='SStonometry']:checked").val();
		var ssdop = $("input[name='SSDoppler']:checked").val();
		var ssother = $("input[name='SSOther']:checked").val();

		// DISPOSITION VALUE - COUNTS AS ONE 
		var disposition = $("input[name='disposition']:checked").val();
		var additional_workup = 0;
		if(disposition && (disposition == "Inpatient" || disposition == "Observation" || disposition =="Transfer")) additional_workup = 1;

		var special_stud = (asxray >=1 || ssct >=1 || ssus >=1 || ssmri >=1 || ssscans >=1 || sston >=1 || ssdop >=1 || ssother >=1 ) ? 1 : 0;

		var chart = $("#evalution_bar").data("kendoChart");
		if(mode=='No')
		{
			$('#Stable').attr('disabled', false);
			$('#Worsening').attr('disabled', false);

			var established_option = $('input[name=damo_established_options]:checked').val();
			sessionData.DamoEstablishedOptions = established_option;
			sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

			if(established_option == "Stable")
			{
				chart.options.series[0].data[0] = 1;
			}
			else
			{
				chart.options.series[0].data[0] = 2;
			}
		}
		else
		{
			$('#Stable').attr('disabled', true);
			$('#Worsening').attr('disabled', true);

			chart.options.series[0].data[0] = 4;

			var totalas = additional_workup + aslabs + aslbc + aslo + asxray + asekg;
			if(totalas >= 3 || special_stud > 0)
			{
				chart.options.series[0].data[0] = 5;
			}
		}
		expandEvalPanel();
		chart.options.transitions = false;
		chart.redraw();
	});

	$('input[name=damo_established_options]').click(function()
	{
		var established_option = $(this).val();
		var chart = $("#evalution_bar").data("kendoChart");

		sessionData.DamoEstablishedOptions = established_option;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(established_option == "Stable")
		{
			chart.options.series[0].data[0] = 1;          
		}
		else
		{
			chart.options.series[0].data[0] = 2;          
		}
		chart.options.transitions = false;
		chart.redraw();
	});

	$(document).on('click','#procedures .prohead',function()
	{
		loadLeftProceduresGrid();
	});


	$('input[name=doc_by_provider]').on('click',function()
	{
		var doc_by_provider = $( 'input[name=doc_by_provider]:checked' ).val();

		sessionData.doc_by_provider = doc_by_provider;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

		if(doc_by_provider=='F')
		{
			$('.roschk').attr("disabled", true);
			$('#ros_abs').show();
		}
		else
		{
			$('.roschk').removeAttr("disabled");
			$('#ros_abs').hide();
		}
		evalgrid_rosbar();
	});

	// Block non-numeric chars.
	$(document).on('keydown', '.gridcpt, .gridmod', function (event) 
	{
		console.log(event.key);
		if(event.key=='Backspace' || event.key=='Delete' || event.key=='Tab' || !isNaN(event.key))
			return true;
		else
			return false;
	});

});

// VALIDATING ICD VALUES
function validateICD(value)
{

	if(value!='')
	{
		if(icd10Array.indexOf(value)<0)
		{
			$('#message_area').html(error_message['CHARTTRAINER-CONCLUSION-ICDWRONG']);
			$('#message_area').addClass('ERROR');
			$('#message_area').show();
			setTimeout(function(){ 
				$('#message_area').html(''); 
				$('#message_area').removeClass('ERROR');
				$('#message_area').hide();

			}, (sitevariable.messagedisplaytime*1000));
		}
		else
		{
			$('#message_area').html(''); 
			$('#message_area').removeClass('ERROR');
			$('#message_area').hide();
		}
	}

}


function resetFormElements()
{
	$("input[name=PROCEDURES_CT][value='F']").prop('checked', true);
	$('#procedures_modifier').val('');
	$('#procedures_modifier').attr('disabled','disabled');
	$('#procedures_icd10').val('');
	$('#procedures_icd10').attr('disabled','disabled');

	var elementExists = document.getElementById("procedures_primary_provider");
	if(elementExists)
	{
		$("#procedures_primary_provider").data("kendoDropDownList").value('');
		$("#procedures_primary_provider").data("kendoDropDownList").enable(false);
	}
	var elementExists = document.getElementById("procedures_secondary_provider");
	if(elementExists)
	{
		$("#procedures_secondary_provider").data("kendoDropDownList").value('');
		$("#procedures_secondary_provider").data("kendoDropDownList").enable(false);
	}
	$('#PROCEDURES_CT2_no').click();
	$('#additional_procedures').html('');
	$('input[name=PROCEDURES2_CT]').attr('disabled','disabled');

	$("input[name=PROVIDERS_CT][value='F']").prop('checked', true);
	loadNoSplitProviderContent();

	$("input[name=PROVIDERS3_CT][value='F']").prop('checked', true);
	$('#transfer_container').html('');

	$("input[name=doc_by_provider][value='T']").prop('checked', true);
	$('.roschk').removeAttr("disabled");
	$('.roschk').prop('checked',false);
	$("input[name=ROS_CT2][value='F']").prop('checked', true);
	$("input[name=ROS_CT3][value='F']").prop('checked', true);

	$('#ros_abs').hide();        
	
	$("input[name=Arrival]").removeAttr("checked");
	$("input[name=Mode]").removeAttr("checked");
	$("input.diagonisisList").val("");
	createICD10chart();

	$("input[name=diagnosis_mode]").removeAttr("checked");
	$('#Stable').attr('disabled', true);
	$('#Worsening').attr('disabled', true);

	$(".special_studies input[type=radio][value='0']").prop("checked", true);
	$(".ancillary_studies input[type=radio][value='0']").prop("checked", true);
	$(".other-information input[type=radio][value='No']").prop("checked", true);

	$(".medication input[type=radio][value='0']").prop("checked", true);

	$(".medication input[name=IV-FLUIDS][value='N']").prop("checked", true);
	$(".medication input[name=OREE][value='N']").prop("checked", true);
	$(".medication input[name=RX][value='N']").prop("checked", true);

	$("input[name=HPI-ct-y]").removeAttr("checked");
	$("input[name=HPIchief-ct]").removeAttr("checked");

	$(".PFSH-CT input[type=radio]").removeAttr("checked");
	$("input[name=pe-fev][value='F']").prop('checked', true);
	$(".PE-ct input[type=checkbox]").removeAttr("checked");

	var chart = $("#evalution_bar").data("kendoChart");
	chart.options.series[0].data[0] = 0;          
	chart.options.series[0].data[1] = 0;          
	chart.options.series[0].data[2] = 0;          
	chart.options.series[0].data[3] = 0;          
	chart.options.series[0].data[4] = 0;          
	chart.options.series[0].data[5] = 0;  
	chart.options.series[0].data[6] = 0;  
	chart.options.transitions = false;
	chart.redraw();

	// ACTIVATE EMPANEL DEFAULT TABSTRIPS 
	var EMtabStrip = $("#EM-summary").data("kendoTabStrip");
	var EMtabToActivate = $('li[inner-data-id="HPI"]');
	EMtabStrip.activateTab(EMtabToActivate);

	// ACTIVATE AAC PANEL DEFAULT TABSTRIPS 
	var AACtabStrip = $("#AAC").data("kendoTabStrip");
	var AACtabToActivate = $('li[inner-data-id="AAC_SS"]');
	AACtabStrip.activateTab(AACtabToActivate);

	// ACTIVATE OVERALL RISK PANEL DEFAULT TABSTRIPS 
	var ORtabStrip = $("#over-all").data("kendoTabStrip");
	var ORtabToActivate = $('li[inner-data-id="MED"]');
	ORtabStrip.activateTab(ORtabToActivate);
}

function myKendoAlert(content)
{
	$("<div id='kendoalert'></div>").kendoAlert({
	  content: content
	}).data("kendoAlert").open();
	$('.k-dialog-titlebar').hide();
}

// FUNCTION CALCULATES THE ANSWER POINTS FOR EACH ROW IN THE ANSWER GRID
function generateAnswerPoints(data)
{

	var totalPoints = 0;

	if(data.answer_cpt)
	{
		data.answer_cpt = data.answer_cpt.trim();

		// IF CPT ENTERED IS BETWEEN 99821-99281 THEN IT IS CPT-EM OTHERWISE IT IS CPT PROCEDURE
		if(data.answer_cpt >= 99281 && data.answer_cpt <= 99291)
		{
			totalPoints += lookupScoreWeight("cpt-em");
		}
		else if(data.answer_cpt != "")
		{
			totalPoints += lookupScoreWeight("cpt-procedure");
		}

		// ADD PROVIDER1 POINTS
		if( (data.answer_provider && data.answer_provider != "NA") || (data.answer_provider2 && data.answer_provider2 != "NA"))
			totalPoints += lookupScoreWeight("provider")

			// ADD MODIFIER POINTS
		if(data.answer_modifier)
			totalPoints += lookupScoreWeight("modifiers");

		// ADD ICDSTRING POINTS
		if( data.answer_icdstring)
			totalPoints += lookupScoreWeight("icd10"); 
	}                 

	data.scorepossible = totalPoints;
	return totalPoints;
}


function startApplicantTest()
{
	$('#start').addClass('hiddenbutton');
	window.localStorage.setItem('testStarted', 'Y');
	configureLeftTab();
	configureRightTab();

	if(chart_id)
	{
		loadChartImages(chart_id);
		getChartEmHpis(chart_id);
	}
	else
	{
		firstChartLoaded++;
	}
}

// FUNCTION CALCULATES THE QUESTION POINTS FOR EACH ROW IN THE QUESTIONS GRID
function generateQuestionPoints(data)
{
	var totalPoints = 0;
	var dataICD = [];
	if(data.icd1) dataICD.push(data.icd1);
	if(data.icd2) dataICD.push(data.icd2);
	if(data.icd3) dataICD.push(data.icd3);
	if(data.icd4) dataICD.push(data.icd4);

	// IF CPT MATCHES FOR EACH ANSWERKEY ROW
	if(data.cpt)
	{
		if(data.cpt.trim()!='')
		{
			if(data.answer_cpt.search("or") > 0)
			{
				var cpts = data.answer_cpt;
				cpts = cpts.replace(/or+/gi, "|");
				cpts = cpts.replace(/\s+/g, "");
				var cptArr = cpts.split("|");

				if(cptArr.includes(data.cpt.trim()))
				{
					if(data.cpt.trim() >= 99281 && data.cpt.trim() <= 99291)
					{
						totalPoints += lookupScoreWeight("cpt-em");
					}
					else
					{
						totalPoints += lookupScoreWeight("cpt-procedure");
					}
				}        
			}   
			else if(data.answer_cpt.trim() == data.cpt.trim()) 
			{
				if(data.cpt.trim() >= 99281 && data.cpt.trim() <= 99291)
				{
					totalPoints += lookupScoreWeight("cpt-em");
				}
				else
				{
					totalPoints += lookupScoreWeight("cpt-procedure");
				}
			}
		} 
	}    

	var prov1 = (!data.answer_provider)? "" : data.answer_provider;
	var prov2 = (!data.answer_provider2)? "" : data.answer_provider2;

	// COMPARE PROVIDER1 AND STYLE THE CELL
	if((prov1 == data.provider) && (prov2 == data.provider2))
	{
		totalPoints += lookupScoreWeight("provider");
	} 
	

	// COMPARE MODIFIER AND STYLE THE CELL
	if(data.answer_modifier == data.modifier && data.modifier != "" )
	{
		totalPoints += lookupScoreWeight("modifiers");
	}

	// CALCULATE ICD SCORE
	var icdscore = scoreICDValues(data.answer_icdstring, dataICD);
	totalPoints += icdscore;

	data.scorepreliminary = totalPoints;
	return totalPoints;
}

function getChartEmHpis(chart_id)
{
	if (document.getElementById('emhpis')) 
	{
		$.ajax(
		{  
			type:"POST",  
			url:crudServiceBaseUrl+"charthpis.php", 
			data:{chart_id: chart_id},  
			success:function(response)
			{
				var response=JSON.parse(response);
				console.log(response);

				// LOAD HPI DATA
				var hpi_content='';
				var hpitypes = response.hpitypes;
				charthpilist = response.charthpilist;

				for (var i = 0; i < charthpilist.length; i++) {
					var checked = '';
					hpi_content+= '<div class="form-group col-sm-12 justify-content-start">';
					hpi_content+= '<label>'+charthpilist[i].value+'<input type="hidden" name="hpivalue[]" value="'+charthpilist[i].value+'" /></label>';
					hpi_content+= '<div class="radio hpi-lable radio-bg-none">';
					hpi_content+= '<div class="col-md-6 gap_left">';
					hpi_content+= '<select style="width: 100%;" class="hpiselects data_'+i+'" name="hpitype_id[]" id="select_hpi_'+i+'">';
						for (var j = 0; j < hpitypes.length; j++) 
						{
							var selected = '';
							if('UNK'==hpitypes[j].hpitype_id) selected='selected';
							hpi_content+= '<option value="'+hpitypes[j].hpitype_id+'" '+selected+' >'+hpitypes[j].type+'</option>';
						}

					hpi_content+= '</select>';
					hpi_content+= '</div>';

					hpi_content+= '<div class="col-md-6 gap_right">';
					hpi_content+= '<div class="radio-bg mr-0 ml-2">';                
					hpi_content+= '<input type="radio" class="hpistatus" id="hpiradioy_'+i+'" name="hpistatus_'+i+'" value="Y" />';
					hpi_content+= '<label for="hpiradioy_'+i+'" class="k-radio-label m-0"><span class="mr10">Yes</span></label>';
					hpi_content+= '<input type="radio" class="hpistatus" id="hpiradion_'+i+'" name="hpistatus_'+i+'" value="N" checked />';
					hpi_content+= '<label for="hpiradion_'+i+'" class="k-radio-label m-0"><span>No</span></label>';
					hpi_content+= '</div>';
					hpi_content+= '</div>';

					hpi_content+= '</div></div>';
				}
				$('#emhpis').html(hpi_content);

				loadHPISessionData();
				function loadHPISessionData() {
					if(sessionData.chart_id == chart_id)
					{
						console.log(sessionData);

						$("input[name='HPI-ct-y'][value=" + sessionData.HPIct + "]").attr('checked', 'checked');
						$("input[name='HPIchief-ct'][value=" + sessionData.HPIchief + "]").attr('checked', 'checked');
						
						var hpicount =0;
						var chart = $("#evalution_bar").data("kendoChart");
						var hpivals = [];
						for (var i = 0; i < charthpilist.length; i++)
						{
							$("#select_hpi_"+i).kendoDropDownList();
							if(sessionData.select_hpi && sessionData.select_hpi[i] != null)
							{
								if(sessionData.chart_id == charthpilist[i].chart_id)
								{
									if(sessionData.hpistatus[i])
									{
										$("input[name=hpistatus_"+i+"][value=" + sessionData.hpistatus[i] + "]").attr('checked', 'checked');
									}
									

									var dropdownlist = $("#select_hpi_"+i).data("kendoDropDownList");
									dropdownlist.value(sessionData.select_hpi[i]);
									if(sessionData.select_hpi[i] != 'UNK')
									{
										if(hpivals.indexOf(sessionData.select_hpi[i]) < 0)
										{
											hpivals.push(sessionData.select_hpi[i]);
											hpicount++;
										}
									}
									if(hpicount == 4) break;


									if(hpicount >= 1 && hpicount <4)
										chart.options.series[0].data[3] = 3;
									else if(hpicount >= 4)
										chart.options.series[0].data[3] = 5;
									else
										chart.options.series[0].data[3] = 0;
									
									chart.options.transitions = false;
									chart.redraw();
								}
							}
						}



					}
					else
					{
						setTimeout(function () { loadHPISessionData(); },500);
					}
				}
			}  
		});
	}
}

function getMinuteFromSecond(seconds)
{
	var min = Math.floor(seconds/60);
	var sec = seconds-(min*60);
	if(parseInt(sec)<10)
		sec='0'+sec;
	return min+':'+sec;
}

function pauseTest()
{
	$('#test_progress').html('<div id="ds-notification-container"><div class="k-widget k-notification k-notification-warning" data-role="alert"><div><i class="fa fa-spinner fa-spin" style="font-size:16px"></i> '+error_message['CHART-TRAINER-SAVING-PROGRESS']+'</div></div></div>');
	var grid = $("#conclusiongrid").data("kendoGrid");
	var dataItem = grid.dataSource.at(0);
	var currentTime = dataItem.currentTime; // Column value from conclusion grid 
	
	$('.pause_overlay').show();
	$.ajax(
	{
		type:"POST",  
		url:crudServiceBaseUrl+"pause_test.php", 
		data:{studentanswer_id: dataItem.studentanswer_id, currentTime: dataItem.currentTime, sessiondata: sessionStorage.getItem('sessionData'), chart_id:chart_id},  
		success:function(response)
		{
			$('#test_progress').html('');
			chart_response.test_status = 'Paused';
			SiteGlobalVariables.chart_response.test_status = 'Paused';
			SiteGlobalVariables.chart_response.message_called = 0;
			messageCalled=0;
			var grid = $("#conclusiongrid").data("kendoGrid");
			//grid.destroy();
			//$("#conclusiongrid").hide();

			// DISPLAY KENDO WINDOW
			$('.content-wrapper').append('<div id="dialog"></div>');
			$('#dialog').kendoDialog({
			  width: "450px",
			  title: error_message['title_CONCLUSION-TEST-PAUSED'],
			  closable: false,
			  modal: true,
			  content: error_message['CONCLUSION-TEST-PAUSED'],
			  actions: [
				  { text: 'OK', primary: true }
			  ]
			});

			$('#pause').addClass('hiddenbutton');
			$('#resume').removeClass('hiddenbutton');

			$('.trainer_right').css('display','none');
			$('#saveChanges').addClass('btndisabled');
			$('#next').addClass('btndisabled');

			var panelBar = $("#chart_trainer_panelbar").data("kendoPanelBar");
			for (var i = 0; i < panelbars.length; i++) 
			{
				var panelid=panelbars[i];
				if (document.getElementById(panelid)) 
				{
					panelBar.enable($("#"+panelid), false);
				}
			}

		}
	});

}

function saveTest() {

	$('#test_progress').html('<div id="ds-notification-container"><div class="k-widget k-notification k-notification-warning" data-role="alert"><div><i class="fa fa-spinner fa-spin" style="font-size:16px"></i> '+error_message['CHART-TRAINER-SAVING-PROGRESS']+'</div></div></div>');
	$.ajax(
	{
		type:"POST",
		url:crudServiceBaseUrl+"save_test.php",
		data:{sessiondata: sessionStorage.getItem('sessionData'), chart_id:chart_id},
		success:function(response)
		{
			console.log(response);
			var res = JSON.parse(response);
			if(res.success == 1)
			{
				$('#test_progress').html('');
				// DISPLAY KENDO WINDOW
				$('.content-wrapper').append('<div id="dialog"></div>');
				$('#dialog').kendoDialog({
					width: "450px",
					title: error_message['title_CONCLUSION-TEST-PAUSED'],
					closable: false,
					modal: true,
					content: error_message['CONCLUSION-TEST-SAVED'],
					actions: [
						{ text: 'OK', primary: true }
					]
				});
			}
		}
	});
}

function resumeTest()
{  
	$('#test_progress').html('<div id="ds-notification-container"><div class="k-widget k-notification k-notification-warning" data-role="alert"><div><i class="fa fa-spinner fa-spin" style="font-size:16px"></i> '+error_message['CHART-TRAINER-LOADING-PROGRESS']+'</div></div></div>');
	
	$.ajax(
	{  
		type:"POST",  
		url:crudServiceBaseUrl+"resume_test.php", 
		data:{},  
		success:function(response)
		{
			$('#test_progress').html('');
			chart_response.test_status = 'InProgress';
			SiteGlobalVariables.chart_response.test_status = 'InProgress';
			$('.trainer_right').css('display','block');
			$('#pause').removeClass('hiddenbutton');
			$('#resume').addClass('hiddenbutton');
			$('#next').addClass('btndisabled');
			$('#saveChanges').removeClass('btndisabled');

			var panelBar = $("#chart_trainer_panelbar").data("kendoPanelBar");
			for (var i = 0; i < panelbars.length; i++) 
			{
				var panelid=panelbars[i];
				if (document.getElementById(panelid)) 
				{
					panelBar.enable($("#"+panelid), true);
				}
			}
			conclusionDatagrid();
			$('.pause_overlay').hide();
		}
	});
   
}

function completeTest()
{
	$('#test_progress').html('<div id="ds-notification-container"><div class="k-widget k-notification k-notification-warning" data-role="alert"><div><i class="fa fa-spinner fa-spin" style="font-size:16px"></i> '+error_message['CHART-TRAINER-COMPLETING-PROGRESS']+'</div></div></div>');
	$.ajax(
	{  
		type:"POST",  
		url:crudServiceBaseUrl+"complete_test.php", 
		data:{},  
		success:function(response)
		{

			// SHOWING ONLY MESSAGE
			$('#chart-wrapper').html('<span class="textcompleted">'+parameterData.stageadvancedailycompletionmessage+'</span>');
			$('#chart-wrapper').addClass('completed');
			$('#chart-wrapper').show();

			chart_response.test_status = 'Completed';
			SiteGlobalVariables.chart_response.test_status = 'Completed';
			chart_response.message='TEST_COMPLETED_FOR_TODAY';
			SiteGlobalVariables.chart_response.message='TEST_COMPLETED_FOR_TODAY';

		}
	});
   
}

function showMessage(startTime,currentTime, totaltimeTaken)
{
	if(testCompleted == 'N')
	{
		if(chart_response.test_status=='InProgress')
		{
			$('#pause').removeClass('hiddenbutton');
			//var total_time = parseInt(parameterData.applicantminutes) - Math.round(parseFloat(totaltimeTaken) / 60);
			$('#total_time').html('Total time: '+parseInt(parameterData.applicantminutes)+' minutes');

			// WE WILL DEDUCT TIME TAKEN FOR PREVIOUS QUESTIONS
			var total_second = parameterData.applicantminutes*60;

			var seconds = (currentTime - startTime) + totaltimeTaken;

			var remainingSec = total_second-seconds;
			var remainingMin = getMinuteFromSecond(parseInt(remainingSec));

			$('#remaining_time').html('Time left: '+remainingMin);

			var timer = getMinuteFromSecond(parseInt(seconds));

			if(seconds>total_second)
			{
				seconds=total_second;
			}

			$('#timer').html(timer);
		   
			if(seconds>=window.localStorage.getItem('finalTime'))
			{
				// SHOWING ONLY MESSAGE
				$('#chart-wrapper').html('<span class="textcompleted">'+parameterData.applicantcompletionemailmessage+'</span>');
				$('#chart-wrapper').addClass('completed');
				$('#chart-wrapper').show();

				var to=getCookie('user_email');
				var subject=parameterData.applicantcompletionemailsubject;
				var body=parameterData.applicantcompletionemailbody;
				if(mail_sent=='N')
				{
					window.sendEmail(to,subject,body,'timesup');
				}

				window.myKendoAlert(parameterData.applicantalertfinalmessage);
			}
			else if(seconds==window.localStorage.getItem('alert2Time'))
			{
				var message = parameterData.applicantalert2message;
				message = message.replace('_',remainingMin);
				
				setTimeout(function(){ 
					currentTime = currentTime+1;
					showMessage(startTime,currentTime, totaltimeTaken);
				}, 1000);
				window.myKendoAlert(message);
			}
			else if(seconds==window.localStorage.getItem('alert1Time'))
			{
				var message = parameterData.applicantalert1message;
				message = message.replace('_',remainingMin);
				setTimeout(function(){ 
					currentTime = currentTime+1;
					showMessage(startTime,currentTime, totaltimeTaken);
				}, 1000);
				window.myKendoAlert(message);

			}
			else
			{
				setTimeout(function(){ 
					currentTime = currentTime+1;
					showMessage(startTime,currentTime, totaltimeTaken);
				}, 1000);
			}
		}
		
	} 
}

function onProvider1Change(e) 
{
	
	var element = e.sender.element;
	var row = element.closest("tr");
	var grid = $("#conclusiongrid").data("kendoGrid");
	var dataItem = grid.dataItem(row);
	dataItem.provider= e.sender.value();
	dataItem.scorepreliminary=generateQuestionPoints(dataItem);

	if(sessionData.chart_id == dataItem.chart_id)
	{
		if(sessionData.dataItem)
			var PrevDataItem = sessionData.dataItem;
		else
			var PrevDataItem = [];
		if(PrevDataItem.length>0)
		{
			for (var i = 0; i < PrevDataItem.length; i++) 
			{
				if(PrevDataItem[i].id==dataItem.studentanswer_id)
				{
					PrevDataItem[i].value = dataItem;
				}
				else
				{
					PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
				}
			}
		}
		else
		{
			PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
		}
		
		sessionData.dataItem = PrevDataItem;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
	}
}

function onProvider2Change(e) 
{
	
	var element = e.sender.element;
	var row = element.closest("tr");
	var grid = $("#conclusiongrid").data("kendoGrid");
	var dataItem = grid.dataItem(row);
	dataItem.provider2=e.sender.value();
	dataItem.scorepreliminary=generateQuestionPoints(dataItem);

	if(sessionData.chart_id == dataItem.chart_id)
	{
		if(sessionData.dataItem)
			var PrevDataItem = sessionData.dataItem;
		else
			var PrevDataItem = [];
		if(PrevDataItem.length>0)
		{
			var sidArray = [];
			for (var i = 0; i < PrevDataItem.length; i++) 
			{
				sidArray.push(PrevDataItem[i].id);
				  
			}

			if(sidArray.indexOf(dataItem.studentanswer_id)>=0)
			{
				var sindex = sidArray.indexOf(dataItem.studentanswer_id);
				PrevDataItem[sindex].value = dataItem;
			}
			else
			{
				PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
			}

		}
		else
		{
			
			PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
		}
		sessionData.dataItem = PrevDataItem;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	}
}

function generateRowValue(e) 
{
	var row = e.closest("tr");
	var grid = $("#conclusiongrid").data("kendoGrid");
	var dataItem = grid.dataItem(row);
	if(e.name=='cpt')
		dataItem.cpt=e.value;
	if(e.name=='modifier')
		dataItem.modifier=e.value;
	if(e.name=='icd1')
	{
		e.value = e.value.toUpperCase();
		dataItem.icd1=e.value;
	}
	if(e.name=='icd2')
	{
		e.value = e.value.toUpperCase();
		dataItem.icd2=e.value;
	}
	if(e.name=='icd3')
	{
		e.value = e.value.toUpperCase();
		dataItem.icd3=e.value;
	}
	if(e.name=='icd4')
	{
		e.value = e.value.toUpperCase();
		dataItem.icd4=e.value;
	}
	dataItem.scorepreliminary=generateQuestionPoints(dataItem);

	if(sessionData.chart_id == dataItem.chart_id)
	{
		if(sessionData.dataItem)
			var PrevDataItem = sessionData.dataItem;
		else
			var PrevDataItem = [];
		if(PrevDataItem.length>0)
		{
			var sidArray = [];
			for (var i = 0; i < PrevDataItem.length; i++) 
			{
				sidArray.push(PrevDataItem[i].id);
				  
			}

			if(sidArray.indexOf(dataItem.studentanswer_id)>=0)
			{
				var sindex = sidArray.indexOf(dataItem.studentanswer_id);
				PrevDataItem[sindex].value = dataItem;
			}
			else
			{
				PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
			}

		}
		else
		{
			
			PrevDataItem.push({id:dataItem.studentanswer_id, value:dataItem});
		}
		sessionData.dataItem = PrevDataItem;
		sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

	}

}

function cptTemplate(data)
{

	if(data.studentanswer_id=='feedback')
		return data.cpt;
	else
		return '<input type="text" maxlength="5" name="cpt" onkeyup="generateRowValue(this);" autocomplete="off" class="k-textbox rowcpt gridcpt" value="'+data.cpt+'" id="cpt_'+data.index_id+'" />';
}

function provider1Template(data)
{
	if(data.studentanswer_id=='feedback')
		return selectProviderInKendoGrid(data.provider);
	else
		return '<input class="customDropDownTemplate provider1Template" name="provider1" autocomplete="off" id="provider1_'+data.index_id+'" />';
}

function provider2Template(data)
{
	if(data.studentanswer_id=='feedback')
		return selectProviderInKendoGrid(data.provider2);
	else
		return '<input class="customDropDownTemplate provider2Template" name="provider2" autocomplete="off" id="provider2_'+data.index_id+'" />';
}

function modifierTemplate(data)
{
	if(data.studentanswer_id=='feedback')
		return (data.modifier) ? data.modifier : "";
	else
		return '<input type="text" maxlength="2" onkeyup="generateRowValue(this);" name="modifier" class="k-textbox gridmod" autocomplete="off" value="'+data.modifier+'" id="modifier_'+data.index_id+'" />';
}

function icd1Template(data)
{
	if(data.studentanswer_id=='feedback')
		return data.icd1;
	else
		return '<input type="text" onkeyup="generateRowValue(this);" name="icd1" class="k-textbox" onblur="validateICD( this.value)" autocomplete="off" value="'+data.icd1+'" id="icd1_'+data.index_id+'" />';
}

function icd2Template(data)
{
	if(data.studentanswer_id=='feedback')
		return '';
	else
		return '<input type="text" onkeyup="generateRowValue(this);" name="icd2" class="k-textbox" onblur="validateICD(this.value)" autocomplete="off" value="'+data.icd2+'" id="icd2_'+data.index_id+'" />';
}
function icd3Template(data)
{
	if(data.studentanswer_id=='feedback')
		return '';
	else
		return '<input type="text" onkeyup="generateRowValue(this);" name="icd3" class="k-textbox" onblur="validateICD(this.value)" autocomplete="off" value="'+data.icd3+'" id="icd3_'+data.index_id+'" />';
}

function icd4Template(data)
{
	if(data.studentanswer_id=='feedback')
		return '';
	else
		return '<input type="text" onkeyup="generateRowValue(this);" name="icd4" class="k-textbox" onblur="validateICD(this.value)" autocomplete="off" value="'+data.icd4+'" id="icd4_'+data.index_id+'" />';
}

$(document).on('mouseover','.redcorner',function()
{
	$('#conclusionfeedback_container').show();
	var grid = $("#conclusiongrid").data("kendoGrid");
	var row = $(this).closest("tr");
	var dataItem = grid.dataItem(row);

	if($(this).hasClass('feedbackcpt'))
	{
		$('#conclusionfeedback_heading').html('CPT FEEDBACK');
		$('#conclusionfeedback').html(dataItem.feedbackcpt);
	}
	if($(this).hasClass('feedbackprovider'))
	{
		$('#conclusionfeedback_heading').html('PROVIDER FEEDBACK');
		$('#conclusionfeedback').html(dataItem.feedbackprovider);
	}

	if($(this).hasClass('feedbackmodifier'))
	{
		$('#conclusionfeedback_heading').html('MODIFIER FEEDBACK');
		$('#conclusionfeedback').html(dataItem.feedbackmodifier);
	}
	if($(this).hasClass('feedbackicd'))
	{
		$('#conclusionfeedback_heading').html('ICD FEEDBACK');
		$('#conclusionfeedback').html(dataItem.feedbackicd);
	}

});



// LOAD DATA IN GRID WHEN CHART FINDER TAB OPEN
function conclusionDatagrid() 
{
	// CONFIGURING KENDOGRID DATA SOURCE
	dataSource = new kendo.data.DataSource(
	{
		transport: 
		{
			read: 
			{
				url: crudServiceBaseUrl+"getstudentanswerkey.php",
				dataType : "json", 
				cache: false,
				contentType: 'application/json; charset=utf-8',
				type: "POST",
				complete: function (data) {
					chart_response.message = data.responseJSON.message;
					
					if(data.responseJSON.message=="TEST_COMPLETED")
					{
						testCompleted = 'Y';
						
						// SHOWING ONLY MESSAGE
						$('#chart-wrapper').html('<span class="textcompleted">'+error_message['CONCLUSION-TEST-COMPLETED']+'</span>');
						$('#chart-wrapper').addClass('completed');
						$('#chart-wrapper').show();

						var to=getCookie('user_email');
						var subject=parameterData.applicantcompletionemailsubject;
						var body=parameterData.applicantcompletionemailbody;
						mail_sent='Y';
						window.sendEmail(to,subject,body,'completed');

					}
					else if(data.responseJSON.message=="TEST_COMPLETED_FOR_TODAY")
					{
						// SHOWING ONLY MESSAGE
						$('#chart-wrapper').html('<span class="textcompleted">'+parameterData.stageadvancedailycompletionmessage+'</span>');
						$('#chart-wrapper').addClass('completed');
						$('#chart-wrapper').show();
						
					}
					else if(data.responseJSON.message=="TEST_NOT_ASSIGNED")
					{
						// SHOWING ONLY MESSAGE
						$('#chart-wrapper').html('<span class="texterror">'+error_message['CONCLUSION-TEST-NOT-ASSIGNED']+'</span>');
						$('#chart-wrapper').addClass('error');
						$('#chart-wrapper').show();

					}
					else
					{
						$('.conclutionoverlay').hide();

						if(chart_response.test_status=='NotStarted')
						{
							 SiteGlobalVariables.chart_response.test_status='InProgress';
							chart_response.test_status='InProgress';
							$('#pause').removeClass('hiddenbutton'); 
						}

						if(messageCalled==0 && data.responseJSON.return_data[0].startTime)
						{
							if(studentType=='APPLICANT')
							{
								showMessage(data.responseJSON.return_data[0].startTime,data.responseJSON.return_data[0].currentTime, data.responseJSON.return_data[0].totalTimeTaken);
								SiteGlobalVariables.chart_response.message_called = 1;
								messageCalled=1;
							}
							
						}

						chart_id=data.responseJSON.return_data[0].chart_id;

						if(firstChartLoaded>0)
						{
							loadChartImages(chart_id);
							getChartEmHpis(chart_id);
							sessionData.chart_id = chart_id;
							sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
						}
						firstChartLoaded++;

						var chartnumberMsg = '<small style="color:red;"> For Testing Only: Chart '+chart_id+ '</small>';
						if(studentType=='APPLICANT')
						{
							$('#question_no').html('Question '+data.responseJSON.return_data[0].question_no+' ('+parameterData.applicanttestcharts+' Minimum) '+chartnumberMsg);
							chart_response.question_number = data.responseJSON.return_data[0].question_no;
							SiteGlobalVariables.chart_response.question_number = data.responseJSON.return_data[0].question_no;

						}
						else
						{
							// PREHIRE OR TRAINEE
							if(data.responseJSON.return_data[0].question_no > parameterData.stageadvancementnumberofcharts && (chart_response.test_status=='InProgress' || chart_response.test_status=='Paused'))
							{
								$('#test_completed').removeClass('hiddenbutton'); 
							}

							// DONT SHOW MINIMUM NUMBER MESSAGE WHEN MORE THAN MINIMUM QUESTIONS ANSWERED
							var minimumChartsMsg = (data.responseJSON.return_data[0].question_no > parameterData.stageadvancementnumberofcharts) ? "" : ' ('+parameterData.stageadvancementnumberofcharts+' Minimum) ';

							$('#question_no').html('Question '+data.responseJSON.return_data[0].question_no + minimumChartsMsg + chartnumberMsg);
							chart_response.question_number = data.responseJSON.return_data[0].question_no;
							SiteGlobalVariables.chart_response.question_number = data.responseJSON.return_data[0].question_no;
						}

					}
				}
			},
			update: 
			{
				url: crudServiceBaseUrl + "addanswer.php",
				type: "POST",
				cache: false,
				dataType: "json",
				data: function(){
					$('.conclutionoverlay').html(error_message['CONCLUSION-SUBMITTING-ANSWER']);
					$('.conclutionoverlay').show();
				},
				complete: function (data) {

					sessionData = {};
					sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

					SiteGlobalVariables.chart_response.return_data = data.responseJSON;
					chart_response.return_data = data.responseJSON;

					if(data.responseJSON.length == 0 && studentType !='APPLICANT')
					{
						$('#test_completed').removeClass('hiddenbutton');
					}

					var grid = $("#conclusiongrid").data("kendoGrid");
					$('#comment1').val('');
					$('#cptchk, #providerchk, #icdchk, #miscellaneous').prop('checked',false);
					if(studentType=='APPLICANT')
					{
						grid.dataSource.read(); 
						grid.refresh();
					}
					else
					{
						$('.conclutionoverlay').hide();
						var trs = $("#conclusiongrid").find('tr');
						for (var i = 0; i < trs.length; i++)
						{
							var dataItem = grid.dataItem(trs[i]);
							if(dataItem.studentanswer_id=='feedback')
							{
								var prevDataItem = grid.dataItem(trs[i-1]);
								if(prevDataItem.cpt!='')
								{
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").html(prevDataItem.cpt);
								}
								else
								{
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").html('Null');
								}
								
								if(dataItem.cpt)
								{
									if(dataItem.cpt.trim()!='')
									{
										if(prevDataItem.cpt.trim()!=dataItem.cpt.trim())
										{
											if(dataItem.cpt.search("or") > 0)
											{
												var match_found=0;
												var cpts = dataItem.cpt;
												cpts = cpts.replace(/or+/gi, "|");
												cpts = cpts.replace(/\s+/g, "");
												var cptArr = cpts.split("|");
												if(cptArr.includes(prevDataItem.cpt))
												{
													match_found=1;
												}

												if(match_found==0)
												{
													if(prevDataItem.feedbackcpt!='')
													{
														grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").addClass('redcorner');
														grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").addClass('feedbackcpt');
													}
													grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").css('color', '#FF6A6A'); 
												}
												
													
											}
											else
											{
												if(prevDataItem.feedbackcpt!='')
												{
													grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").addClass('redcorner');
													grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").addClass('feedbackcpt');
												
												}
												grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(2)").css('color', '#FF6A6A'); 
												
											}
												  
										}
										
									}
								}
							   	
								// IF BOTH THE PROVIDER IN ANSWER ROW HAVE VALUE
								if(dataItem.provider && dataItem.provider2)
								{
									if(prevDataItem.provider!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html(selectProviderInKendoGrid(prevDataItem.provider));
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html('Null');
									}

									if(prevDataItem.provider2!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html(selectProviderInKendoGrid(prevDataItem.provider2));
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html('Null');
									}

									if(prevDataItem.provider!=dataItem.provider)
									{
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").css('color', '#FF6A6A');
									}

									if(prevDataItem.provider2!=dataItem.provider2)
									{
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").css('color', '#FF6A6A');
									}
									
								}
								else if(dataItem.provider)
								{ // IF ONLY PROVIDER 1 HAS VALUE IN ANSWER ROW 

									if(prevDataItem.provider!=dataItem.provider)
									{
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").css('color', '#FF6A6A');
									}

									if(prevDataItem.provider!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html(selectProviderInKendoGrid(prevDataItem.provider));
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html('Null');
									}

									if(prevDataItem.provider2!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html(selectProviderInKendoGrid(prevDataItem.provider2));
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").css('color', '#FF6A6A');
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html('');
									}
									grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(4)").html('');

								}
								else if(dataItem.provider2)
								{ // IF ONLY PROVIDER 2 HAS VALUE IN ANSWER ROW

									if(prevDataItem.provider2!=dataItem.provider2)
									{
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").css('color', '#FF6A6A');
									}

									if(prevDataItem.provider2!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html(selectProviderInKendoGrid(prevDataItem.provider2));
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(4)").html('Null');
									}

									if(prevDataItem.provider!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html(selectProviderInKendoGrid(prevDataItem.provider));
										if(prevDataItem.feedbackprovider!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").addClass('feedbackprovider');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").css('color', '#FF6A6A');
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(3)").html('');
									}
									grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(3)").html('');
								}
								else
								{ // NONE OF PROVIDER HAS VALUE IN ANSWER ROW
									// grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(3)").html('');
									// grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(4)").html('');
									grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(3)").html('');
									grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(4)").html('');

								}
								

								var dataICD = [];
								if(prevDataItem.icd1) dataICD.push(prevDataItem.icd1);
								if(prevDataItem.icd2) dataICD.push(prevDataItem.icd2);
								if(prevDataItem.icd3) dataICD.push(prevDataItem.icd3);
								if(prevDataItem.icd4) dataICD.push(prevDataItem.icd4);

								grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").html(prevDataItem.icd1);
								grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(6)").html(prevDataItem.icd2);
								grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(7)").html(prevDataItem.icd3);
								grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(8)").html(prevDataItem.icd4);

								var allblank=0;
								if(prevDataItem.icd1=='' && prevDataItem.icd2=='' && prevDataItem.icd3=='' && prevDataItem.icd4=='')
								{
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").html('Null');
									allblank=1;
								}

								var icdscore = scoreICDValues(prevDataItem.answer_icdstring, dataICD);

								if(prevDataItem.answer_icdstring != '' && icdscore == 0)
								{
									if(prevDataItem.icd1!='' || allblank==1)
									{
										if(prevDataItem.feedbackicd!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").addClass('feedbackicd');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").addClass('icdcorner');
										}
										
									}

									if(prevDataItem.icd2!='')
									{
										if(prevDataItem.feedbackicd!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(6)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(6)").addClass('feedbackicd');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(6)").addClass('icdcorner');
										}
										
									}
									
									if(prevDataItem.icd3!='')
									{
										if(prevDataItem.feedbackicd!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(7)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(7)").addClass('feedbackicd');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(7)").addClass('icdcorner');
										}
										
									}

									if(prevDataItem.icd4!='')
									{
										if(prevDataItem.feedbackicd!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(8)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(8)").addClass('feedbackicd');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(8)").addClass('icdcorner');
										}
										
									}

									grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(5)").html(dataItem.icdstring);
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(5)").css('color', '#FF6A6A');
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(6)").css('color', '#FF6A6A');
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(7)").css('color', '#FF6A6A');
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(8)").css('color', '#FF6A6A');

								}
								

								if(prevDataItem.modifier!='')
								{
									grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").html(prevDataItem.modifier);
								}
								else
								{
									if(dataItem.modifier && dataItem.modifier!='')
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").html('Null');
									}
									else
									{
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").html('');
									}
								}
								
								if(dataItem.modifier && dataItem.modifier!='')
								{

									if(prevDataItem.modifier!=dataItem.modifier || prevDataItem.modifier == "")
									{
										if(prevDataItem.feedbackmodifier!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").addClass('feedbackmodifier');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").css('color', '#FF6A6A');
									}

								}
								else
								{
									if(prevDataItem.modifier!='')
									{
										if(prevDataItem.feedbackmodifier!='')
										{
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").addClass('redcorner');
											grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").addClass('feedbackmodifier');
										}
										grid.tbody.find("tr[data-uid=" + prevDataItem.uid + "] td:nth-child(9)").css('color', '#FF6A6A');
									}
								}

								grid.tbody.find("tr[data-uid=" + dataItem.uid + "]").show();
							}
						}
						$('#saveChanges').addClass('btndisabled');
						$('#next').removeClass('btndisabled');
						$('#next').addClass('feedbackactive');
					}
				   
				}
			}
		},
		requestStart: function(e) {
			kendo.ui.progress($("#conclusiongrid"),true);
		},
		requestEnd: function(e) {
			kendo.ui.progress($("#conclusiongrid"),false);
		},
		pageSize: 10,
		batch: true,
		schema: 
		{ 
			data: 'return_data',
			model: 
			{
				id: "studentanswer_id",
				fields: 
				{
					index_id: 
					{
						editable: false
					},
					cpt: 
					{
						editable: true
					},
					provider: 
					{
						editable: true
					},
					provider2: 
					{
						editable: true
					},
					icd1: 
					{
						editable: true
					},
					icd2: 
					{
						editable: true
					},
					icd3: 
					{
						editable: true
					},
					icd4: 
					{
						editable: true
					},
					modifier: 
					{
						editable: true
					},
					scorepossible:
					{
						editable: true
					},
					scorepreliminary:
					{
						editable: true
					}
				   
				}    
			}
		}
	});
									
	// DEFINING KENDOGRID FOR CHART FINDER
	$("#conclusiongrid").kendoGrid(
	{
		dataSource: dataSource,
		scrollable: false,
		sortable: false,
		pageable: false,
		columns: 
		[
			{
				field: "index_id", title:"#", width: 15
			}, 
			{
				field: "cpt", title:"CPT", width: 80,  template: "#= cptTemplate(data) #"
			}, 
			{
				field: "provider", 
				title: "Provider 1",
				template: '#= provider1Template(data) #'
			},
			{
				field: "provider2", 
				title: "Provider 2", 
				template: '#= provider2Template(data) #'
			},
			{
				field: "icd1", title: "ICD 1", width: 71,  template: '#= icd1Template(data) #'
			},
			{
				field: "icd2", title: "ICD 2", width: 71,  template: '#= icd2Template(data) #'
			}, 
			{
				field: "icd3", title: "ICD 3", width: 71,  template: '#= icd3Template(data) #'
			}, 
			{
				field: "icd4", title: "ICD 4", width: 71,  template: '#= icd4Template(data) #',
			},
			{
				field: "modifier", title: "Mod", width: 58,  template: '#= modifierTemplate(data) #'
			},
			{
				hidden: true, field: "scorepossible", template: "#= generateAnswerPoints(data) #"
			},
			{
				hidden: true, field: "scorepreliminary", template: "#= generateQuestionPoints(data) #"
			},
			
		],
		navigatable: true,
		dataBound: function(e) {
			var grid = e.sender;
			var items = e.sender.items();
			items.each(function(e) {
 
				var dd1 = $(this).find('.provider1Template');
				var dataSource = new kendo.data.DataSource({
					data: providerArray
				});

				$(dd1).kendoDropDownList({
					dataSource: dataSource,
					dataTextField: "providerid",
					dataValueField: "providerval",
					filter: "startswith",
					highlightFirst: false,
					syncValueAndText: false,
					suggest: true,
					change: onProvider1Change
				}).data('kendoDropDownList');  

				var dd2 = $(this).find('.provider2Template');
				var dataSource = new kendo.data.DataSource({
					data: providerArray
				});
				$(dd2).kendoDropDownList({
					dataSource: dataSource,
					dataTextField: "providerid",
					dataValueField: "providerval",
					filter: "startswith",
					highlightFirst: false,
					syncValueAndText: false,
					suggest: true,
					change: onProvider2Change
				}).data('kendoDropDownList');  

			});


			if(sessionData.cptchk == 'T')
				$('#cptchk').prop('checked',true);
			if(sessionData.providerchk == 'T')
				$('#providerchk').prop('checked',true);
			if(sessionData.icdchk == 'T')
				$('#icdchk').prop('checked',true);
			if(sessionData.miscellaneous == 'T')
				$('#miscellaneous').prop('checked',true);

			$('#comment1').val(sessionData.comment);

			var sidArray = [];
			if(sessionData.dataItem)
			{
				for (var i = 0; i < sessionData.dataItem.length; i++) 
				{
					sidArray.push(sessionData.dataItem[i].id);
					  
				}
			}
			
			var trs = $("#conclusiongrid").find('tr');
			for (var i = 0; i < trs.length; i++)
			{
				var dataItem = grid.dataItem(trs[i]);
				if(typeof dataItem === 'object')
				{
					if(dataItem.studentanswer_id=='feedback')
					{

						grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(5)").attr('colspan','4');
						grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(6)").remove();
						grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(7)").remove();
						grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(8)").remove();
						grid.tbody.find("tr[data-uid=" + dataItem.uid + "] td:nth-child(6)").css('display','none');
						grid.tbody.find("tr[data-uid=" + dataItem.uid + "]").hide();
					}
					else
					{
						if(sessionData.dataItem)
						{
							if(sidArray.indexOf(dataItem.studentanswer_id)>=0)
							{
								var arrayindex = sidArray.indexOf(dataItem.studentanswer_id);
								var sessionRow = sessionData.dataItem[arrayindex];
								dataItem.cpt = sessionRow.value.cpt;
								dataItem.modifier = sessionRow.value.modifier;

								dataItem.provider = sessionRow.value.provider;
								dataItem.provider2 = sessionRow.value.provider2;

								dataItem.icd1 = sessionRow.value.icd1;
								dataItem.icd2 = sessionRow.value.icd2;
								dataItem.icd3 = sessionRow.value.icd3;
								dataItem.icd4 = sessionRow.value.icd4;

								dataItem.scorepreliminary = sessionRow.value.scorepreliminary;

								dataItem.cbcpt = sessionRow.value.cbcpt;
								dataItem.cbicd = sessionRow.value.cbicd;
								dataItem.cbmiscellaneous = sessionRow.value.cbmiscellaneous;
								dataItem.cbprovider = sessionRow.value.cbprovider;
								dataItem.comment = sessionRow.value.comment;

								$('#cpt_'+dataItem.index_id).val(sessionRow.value.cpt);

								var dropdownlist = $('#provider1_'+dataItem.index_id).data("kendoDropDownList");
								dropdownlist.value(sessionRow.value.provider);

								var dropdownlist = $('#provider2_'+dataItem.index_id).data("kendoDropDownList");
								dropdownlist.value(sessionRow.value.provider2);

								$('#modifier_'+dataItem.index_id).val(sessionRow.value.modifier);
								$('#icd1_'+dataItem.index_id).val(sessionRow.value.icd1);
								$('#icd2_'+dataItem.index_id).val(sessionRow.value.icd2);
								$('#icd3_'+dataItem.index_id).val(sessionRow.value.icd3);
								$('#icd4_'+dataItem.index_id).val(sessionRow.value.icd4);

							}
						}
					}
				}

			}
		},
		save: function(e) 
		{
			var scoreprelim = generateQuestionPoints($.extend(true,{},e.model, e.values));
			e.model.scorepreliminary = scoreprelim;
			e.container.parent().find("td:eq(10)").empty().html(scoreprelim);
		},
		saveChanges: function(e) {
			var rows=this.dataSource._data;
			var comment=document.getElementById("comment1").value;
			var cptchk='F';
			var providerchk='F';
			var icdchk='F';
			var miscellaneous='F';

			if($('#cptchk').prop("checked") == true){
				cptchk='T';
			}
			if($('#providerchk').prop("checked") == true){
				providerchk='T';
			}
			if($('#icdchk').prop("checked") == true){
				icdchk='T';
			}
			if($('#miscellaneous').prop("checked") == true){
				miscellaneous='T';
			}

			$.each( rows, function( key, value ) {
				value.comment=comment;
				value.cbcpt=cptchk;
				value.cbprovider=providerchk;
				value.cbicd=icdchk;
				value.cbmiscellaneous=miscellaneous;
				value.dirty = true;
			});

		}
	}).data("kendoGrid");   

}

function loadTransferProvider()
{
	var html='';
	html+='<div class="form-group justify-content-start">';
	html+='<label>To whom was the transfer of care?</label>';
	html+='<select id="transfer_provider" name="transfer_provider"></select>';
	html+='</div>';

	$('#transfer_container').html(html);

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	$('#transfer_provider').kendoDropDownList({
		dataSource: dataSource,
		dataTextField: "providerid",
		dataValueField: "providerval",
		filter: "startswith",
		highlightFirst: false,
		syncValueAndText: false,
		suggest: false,
		change: onTransferProvider
	});

	if(sessionData.transferProvider)
	{
		var dropdownlist = $("#transfer_provider").data("kendoDropDownList");
		dropdownlist.value(sessionData.transferProvider);
	}
}


function onTransferProvider(e)
{
	var transferProvider = $("#transfer_provider").val();
	sessionData.transferProvider = transferProvider;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
}

function loadNoSplitProviderContent()
{
	var html='';
	html+='<div class="form-group justify-content-start"><label>Physician</label><select id="primary_provider" name="primary_provider"></select></div>';

	$('#conditional_provider1').html(html);
	$('#conditional_provider2').html('');

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	if (document.getElementById('primary_provider')) 
	{
		$('#primary_provider').kendoDropDownList({
			dataSource: dataSource,
			dataTextField: "providerid",
			dataValueField: "providerval",
			filter: "startswith",
			highlightFirst: false,
			syncValueAndText: false,
			suggest: false,
			change: onPrimaryProviderChange
		});
	}
}

function onPrimaryProviderChange(e)
{
	var primaryProvider = $("#primary_provider").val();
	sessionData.primaryProvider = primaryProvider;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
}

function loadYesSplitProviderContent()
{
	var html='';
	html+='<div class="form-group justify-content-start">';
		html+='<label>Is there a proof of face-to-face and patient-specific information?</label>';
		html+='<div class="radio radio-bg-none"><div class="radio-bg justify-space-evenly ROS-First-rb mr-0">';      
			html+='<input class="k-radio " id="PROVIDERS2_CT_yes" name="PROVIDERS2_CT" value="T" type="radio">';
			html+='<label for="PROVIDERS2_CT_yes" class="k-radio-label mb-0"><span>Yes</span></label>';
			html+='<input class="k-radio" id="PROVIDERS2_no" name="PROVIDERS2_CT" value="F" checked="checked" type="radio">';
			html+='<label for="PROVIDERS2_no" class="k-radio-label mb-0 mr-0"><span>No</span></label>';
		html+='</div></div>';
	html+='</div>';
	$('#conditional_provider1').html(html);

	var html='';
	html+='<div class="form-group justify-content-start">';
		html+='<label>Supervising physician</label>';
		html+='<select id="supervising_provider" name="primary_provider"></select>';
		html+='<em id="supervising_primary">Primary provider</em>';
	html+='</div>';

	html+='<div class="form-group justify-content-start">';
		html+='<label>Midlevel</label>';
		html+='<select id="midlevel_provider" name="primary_provider"></select>';
		html+='<em id="midlevel_primary">Primary provider</em>';
	html+='</div>';

	$('#conditional_provider2').html(html);

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	$('#supervising_provider').kendoDropDownList({
		dataSource: dataSource,
		dataTextField: "providerid",
		dataValueField: "providerval",
		filter: "startswith",
		highlightFirst: false,
		syncValueAndText: false,
		suggest: false,
		change: onSupervisingChange
	});

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	$('#midlevel_provider').kendoDropDownList({
		dataSource: dataSource,
		dataTextField: "providerid",
		dataValueField: "providerval",
		filter: "startswith",
		highlightFirst: false,
		syncValueAndText: false,
		suggest: false,
		change: onMidlevelChange
	});
}

function onSupervisingChange(e)
{
	var SupervisingProvider = $("#supervising_provider").val();
	sessionData.SupervisingProvider = SupervisingProvider;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
}

function onMidlevelChange(e)
{
	var MidlevelProvider = $("#midlevel_provider").val();
	sessionData.MidlevelProvider = MidlevelProvider;
	sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));
}

function myKendoConfirm(title, content)
{
	return $("<div></div>").kendoConfirm({
	  title: title,
	  content: content
	}).data("kendoConfirm").open().result;
}

function addAnotherProcedure()
{
	var html='';
	html+='<div class="col-md-10">';
	html+='<div class="form-group"><label>Modifier</label><input type="text" id="procedures_modifier2" name="procedures_modifier[]" /></div>';
	html+='<div class="form-group"><label>Diagnosis ICD10</label><input type="text" id="procedures_icd102" name="procedures_icd10[]" /></div>';
	html+='<div class="form-group"><label>Primary Provider</label><select id="procedures_primary_provider2" name="procedures_primary_provider[]"></select></div>';
	html+='<div class="form-group"><label>Secondary Provider</label><select id="procedures_secondary_provider2" name="procedures_secondary_provider[]"></select></div>';
	html+='</div>';
	$('#additional_procedures').html(html);

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	$('#procedures_primary_provider2').kendoDropDownList({
		dataSource: dataSource,
		dataTextField: "providerid",
		dataValueField: "providerval",
		filter: "startswith",
		highlightFirst: false,
		syncValueAndText: false,
		suggest: false
	});

	var dataSource = new kendo.data.DataSource({
		data: providerArray
	});

	$('#procedures_secondary_provider2').kendoDropDownList({
		dataSource: dataSource,
		dataTextField: "providerid",
		dataValueField: "providerval",
		filter: "startswith",
		highlightFirst: false,
		syncValueAndText: false,
		suggest: false
	});
}


function configureLeftTab()
{
	
	var i=1;

	var isStageManual = SiteGlobalVariables.user_data.isStageManual;
	if(isStageManual=='Y')
	{
		$.each(SiteGlobalVariables.user_data, function(key, value) 
		{
			if(panelbars.indexOf(key)>=0)
			{
				if(value=='Y')
				{
					if(i==1)
					{
						$('#'+key).addClass('k-state-active');
						$('#'+key+' .panelh').addClass('k-state-selected');

					}

					if(key=='overallrisks')
					{
						loadLeftDsgccGrid(datagriditemsperpage);
					}

					if(key=='procedures')
					{
						loadLeftProceduresGrid();
					}

					if(key=='conclusion')
					{

						if(chart_response.test_status=='InProgress' || chart_response.test_status=='NotStarted')
						{
							conclusionDatagrid();
						}
						
					}
					i++;
				}
				else
				{
					$('#'+key).remove();
				}
			}
		});
	}
	else
	{
		var activePanelbar = student_panelbar[studentStage];
		$.each(activePanelbar, function(key, value) 
		{
			if(panelbars.indexOf(key)>=0)
			{

				if(value=='show')
				{
					if(i==1)
					{
						$('#'+key).addClass('k-state-active');
						$('#'+key+' .panelh').addClass('k-state-selected');

					}

					if(key=='overallrisks')
					{
						loadLeftDsgccGrid(datagriditemsperpage);
					}

					if(key=='procedures')
					{
						loadLeftProceduresGrid();
					}

					if(key=='conclusion')
					{

						if(chart_response.test_status=='InProgress' || chart_response.test_status=='NotStarted')
						{
							conclusionDatagrid();
						}
						
					}
					i++;
				}
				else
				{
					$('#'+key).remove();
				}
			}
		});
	}
			
	if(studentStage)
	{
			
		if(studentStage<=3)
		{
			if (document.getElementById('EM-summary')) 
			{
				var tabStrip = $("#EM-summary").data("kendoTabStrip");
				// tabStrip.disable(tabStrip.tabGroup.children().eq(2));
				// $('#stagedepend').removeAttr('inner-data-id');
			}
		}

		$('.trainer_left').show();

		$("#chart_trainer_panelbar").kendoPanelBar({
			expandMode: "single"
		});
		$("#evaluation_panelbar").kendoPanelBar({
			expandMode: "single",
			select: function (e) 
					{
					  if ($(e.item).is(".k-state-active")) 
					  {
						  var that = this;
						  window.setTimeout(function(){that.collapse(e.item);}, 1);
					  }
					},
			expand: function() 
			{
				 $("html, body").animate({ scrollTop: $(document).height() }, 1000);
			}
		});

		adjustPageLayout(studentType);

	}
	else
	{
		$('#chart_trainer_panelbar').remove();
		$('.trainer_left').show();
		$("#charttrainer_bottom2").getKendoTabStrip().resize();
		$("#chart_loader_tabstrip2").getKendoTabStrip().resize();
		//$('#chart_trainer_tab-1').css('height',h+'px');
	}

	loadSessionData();

	loadICDArray();
   
}

function loadICDArray()
{
	$.ajax(
	{  
		type:"POST",  
		url:crudServiceBaseUrl+"get_icd_data.php", 
		data:{},  
		success:function(response)
		{
			icd10Array = JSON.parse(response);
		}  
	}); 
}


function adjustPageLayout(studentType)
{
	var browser_height = $(window).height();
	var header_area = 170;
	var white_area = browser_height - header_area;

	$('.browser_height').css('height',white_area+'px');
	$('.browser_scroller').css('max-height',(white_area-100)+'px');
	$('.browser_scroller').css('overflow-y','scroll');


	if(studentType =='APPLICANT')
	{
		$('.evaluation_grid').css('display', 'none');
		$('.chart_trainer_bottom').remove();
		$("#charttrainer_bottom2").getKendoTabStrip().resize();
		$('.nonapplicant').remove();	

	}
	else
	{
		$("#charttrainer_bottom2").getKendoTabStrip().resize();
		$("#chart_loader_tabstrip2").getKendoTabStrip().resize();
	}
}




function configureRightTab()
{
	var i=1;
	var activePanelbar = student_panelbar[studentStage];
	$.each(activePanelbar, function(key, value) 
	{
		if(rightpanelbars.indexOf(key)>=0)
		{
			if(value=='show')
			{
				if(i==1)
				{
					//$('#'+key).addClass('k-state-active');
					//$('#'+key+' .panelh').addClass('k-state-selected');

				}
				i++;
			}
			else
			{
				$('#'+key).remove();
			}
		}
	});

	$('.trainer_right').show();

	// DEFINING RIGHT KENDO PANELBAR
	$("#right_panelbar").kendoPanelBar({expandMode: "multiple", expand: onRightPanelbarExpand});
	
}

 function loadSessionData() 
{
	// console.log('session data called');
	// console.log('session chart_id='+sessionData.chart_id);
	// console.log('normal chart_id='+chart_id);
	if(sessionData.chart_id == chart_id)
	{
		// BI PANELBAR
		if(sessionData.ArrivalData)
		{
			$("input[name=Arrival][value=" + sessionData.ArrivalData + "]").attr('checked', 'checked');

			// DIAGNOISIS LIST
			$.each(sessionData.DiagnosisData, function( index, value ) {
				console.log( index + ": " + value.name );
				$('.diagonisisList').eq(index).val(value.name)
			});
			createICD10chart();
			$("input[name=Mode][value=" + sessionData.ModeData + "]").attr('checked', 'checked');


		}
		if(sessionData.DiagnosisMode)
		{
			// DIAGNOSIS AND MANAGEMENT OPTIONS
			$("input[name=diagnosis_mode][value=" + sessionData.DiagnosisMode + "]").attr('checked', 'checked');
			if(sessionData.DiagnosisMode)
				diagnoseManagementOptions(sessionData.DiagnosisMode, sessionData.DamoEstablishedOptions);
		}

		if(sessionData.Disposition)
		{
			// DISPOSITION
			$("input[name=disposition][value=" + sessionData.Disposition + "]").attr('checked', 'checked');
			evalgrid_acdbar();
		}
		// AMOUNT AND COMPLEXITY OF DATA
		if(sessionData.SSCT || sessionData.ASLabs || sessionData.other_disc)
		{
			//SPECIAL STUDY
			$("input[name=SSCT][value='" + sessionData.SSCT+ "']").attr('checked', 'checked');
			$("input[name=SSUS][value='" + sessionData.SSUS+ "']").attr('checked', 'checked');
			$("input[name=SSMRI][value='" + sessionData.SSMRI+ "']").attr('checked', 'checked');
			$("input[name=SSScans][value='" + sessionData.SSScans+ "']").attr('checked', 'checked');
			$("input[name=SStonometry][value='" + sessionData.SStonometry+ "']").attr('checked', 'checked');
			$("input[name=SSDoppler][value='" + sessionData.SSDoppler+ "']").attr('checked', 'checked');
			$("input[name=SSOther][value='" + sessionData.SSOther+ "']").attr('checked', 'checked');

			//ANCILLARY STUDIES
			$("input[name=ASLabs][value='" + sessionData.ASLabs+ "']").attr('checked', 'checked');
			$("input[name=ASLBC][value='" + sessionData.ASLBC+ "']").attr('checked', 'checked');
			$("input[name=ASLO][value='" + sessionData.ASLO+ "']").attr('checked', 'checked');
			$("input[name=ASXRay][value='" + sessionData.ASXRay+ "']").attr('checked', 'checked');
			$("input[name=ASEKG][value='" + sessionData.ASEKG+ "']").attr('checked', 'checked');

			//OTHER INFO
			$("input[name=other_disc][value='" + sessionData.other_disc+ "']").attr('checked', 'checked');
			$("input[name=other_ind][value='" + sessionData.other_ind+ "']").attr('checked', 'checked');
			$("input[name=other_old][value='" + sessionData.other_old+ "']").attr('checked', 'checked');
			$("input[name=other_rev][value='" + sessionData.other_rev+ "']").attr('checked', 'checked');
			$("input[name=other_fev][value='" + sessionData.other_fev+ "']").attr('checked', 'checked');
			evalgrid_acdbar();
		}

		//OVERALL RISKS
		if(sessionData.MIVfluids)
		{
			//MEDICATION
			$("input[name=IV-FLUIDS][value='" + sessionData.MIVfluids+ "']").attr('checked', 'checked');
			$("input[name=IV-MED-C][value='" + sessionData.IV_medication+ "']").attr('checked', 'checked');
			$("input[name=IV-MED-NC][value='" + sessionData.IV_medication2+ "']").attr('checked', 'checked');
			$("input[name=IM-MED-NC][value='" + sessionData.IV_medication3+ "']").attr('checked', 'checked');
			$("input[name=IM-MED-C][value='" + sessionData.IV_medication4+ "']").attr('checked', 'checked');
			$("input[name=NB-MED][value='" + sessionData.med_nebu_medc+ "']").attr('checked', 'checked');
			$("input[name=OREE][value='" + sessionData.MIVfluid+ "']").attr('checked', 'checked');
			$("input[name=RX][value=" + sessionData.MIRx+ "]").attr('checked', 'checked');
		}

		//E/M SUMMARY FOR CODERS
		if(sessionData.HPIct || sessionData.HPIchief)
		{
			//HPI
			$("input[name=HPI-ct-y][value='" + sessionData.HPIct+ "']").prop('checked', true);
			$("input[name=HPIchief-ct][value='" + sessionData.HPIchief+ "']").prop('checked', true);
		}

		if(sessionData.doc_by_provider || sessionData.ROS_CT2 || sessionData.ROS_CT3)
		{
			//ROS
			$("input[name=doc_by_provider][value=" + sessionData.doc_by_provider+ "]").prop('checked', true);
			doc_by_provider(sessionData.doc_by_provider);
			$("input[name=ROS_CT2][value=" + sessionData.ROS_CT2+ "]").prop('checked', true);

			$("input[name=ROS_CT3][value=" + sessionData.ROS_CT3+ "]").prop('checked', true);
			if(sessionData.ROS_CT3)
				ros_ct3(sessionData.ROS_CT3);
		}

		if(sessionData.PFSH_CT || sessionData.PFSH2_CT || sessionData.PFSH3_CT)
		{
			//PFSH
			$("input[name=PFSH_CT][value=" + sessionData.PFSH_CT+ "]").prop('checked', true);
			$("input[name=PFSH2_CT][value=" + sessionData.PFSH2_CT+ "]").prop('checked', true);
			$("input[name=PFSH3_CT][value=" + sessionData.PFSH3_CT+ "]").prop('checked', true);
			if(sessionData.PFSH_CT || sessionData.PFSH2_CT || sessionData.PFSH3_CT)
				PFSH();

		}

		if(sessionData.pefev || sessionData.pechk)
		{
			$("input[name='pe-fev'][value='"+sessionData.pefev+"']").prop('checked', true);

			$.each(sessionData.pechk, function( index, value ) {
				console.log( index + ": " + value );
				$(".pechk[name='"+value+"']").prop('checked', true);
				data_PE();
			});
		}

		if(sessionData.PROCEDURES_CT)
		{
			//PROCEDURES
			$("input[name=PROCEDURES_CT][value=" + sessionData.PROCEDURES_CT+ "]").prop('checked', true);
			if(sessionData.PROCEDURES_CT == 'T')
			{
				loadAllProviderDropdowns();
				$('#procedures_modifier').removeAttr('disabled');
				$('#procedures_icd10').removeAttr('disabled');
				$('#procedures_modifier').val(sessionData.procedures_modifier);
				$('#procedures_icd10').val(sessionData.procedures_icd10);

				$('input[name=PROCEDURES2_CT]').removeAttr('disabled');

				var procedures_primary_provider = $("#procedures_primary_provider").data("kendoDropDownList");
				procedures_primary_provider.enable(true);
				procedures_primary_provider.value(sessionData.procedures_primary_provider);

				var procedures_secondary_provider = $("#procedures_secondary_provider").data("kendoDropDownList");
				procedures_secondary_provider.enable(true);
				procedures_secondary_provider.value(sessionData.procedures_secondary_provider);

				if(sessionData.PROCEDURES2_CT == 'T')
				{
					addAnotherProcedure();
					$("input[name=PROCEDURES2_CT][value=" + sessionData.PROCEDURES2_CT+ "]").prop('checked', true);
					$('#procedures_modifier2').removeAttr('disabled');
					$('#procedures_icd102').removeAttr('disabled');
					$('#procedures_modifier2').val(sessionData.procedures_modifier2);
					$('#procedures_icd102').val(sessionData.procedures_icd102);

					var procedures_primary_provider2 = $("#procedures_primary_provider2").data("kendoDropDownList");
					procedures_primary_provider2.enable(true);
					procedures_primary_provider2.value(sessionData.procedures_primary_provider2);

					var procedures_secondary_provider2 = $("#procedures_secondary_provider2").data("kendoDropDownList");
					procedures_secondary_provider2.enable(true);
					procedures_secondary_provider2.value(sessionData.procedures_secondary_provider2);
				}
			}
		}

		if(sessionData.PROVIDERS_CT || sessionData.PROVIDERS2_CT || sessionData.PROVIDERS3_CT)
		{
			// PROVIDERS
			$("input[name=PROVIDERS_CT][value=" + sessionData.PROVIDERS_CT+ "]").prop('checked', true);
			$("input[name=PROVIDERS2_CT][value=" + sessionData.PROVIDERS2_CT+ "]").prop('checked', true);
			if(sessionData.PROVIDERS2_CT)
			{
				if(sessionData.PROVIDERS2_CT=='T')
				{
					$('#supervising_primary').show();
					$('#midlevel_primary').hide();
				}
				else
				{
					$('#supervising_primary').hide();
					$('#midlevel_primary').show();
				}
			}

			$("input[name=PROVIDERS3_CT][value=" + sessionData.PROVIDERS3_CT+ "]").prop('checked', true);
			if(sessionData.PROVIDERS3_CT)
			{
				if(sessionData.PROVIDERS3_CT=='T')
				{
					loadTransferProvider();
					if(sessionData.transferProvider)
					{
						var dropdownlist = $("#transfer_provider").data("kendoDropDownList");
						dropdownlist.value(sessionData.transferProvider);
					}
				}
			}
		}

		setTimeout(function() {
			var chart = $("#evalution_bar").data("kendoChart");
			chart.options.transitions = false;
			chart.redraw();
			console.log('redraw called2');
		 }, 100);
	}
	else
	{
		setTimeout(function(){ loadSessionData(); }, 500);
	}
}


function data_PE()
{
	var pecount = $(".pechk:checked").length;
	var peorganscount = $(".pechk.organs:checked").length;
	var chart = $("#evalution_bar").data("kendoChart");
	if(pecount == 1)
		chart.options.series[0].data[6] = 1;
	else if(pecount == 2 )
		chart.options.series[0].data[6] = 3;
	else if(pecount > 2)
		chart.options.series[0].data[6] = 4;
	else
		chart.options.series[0].data[6] = 0;

	if( peorganscount > 7)
		chart.options.series[0].data[6] = 5;

	chart.options.transitions = false;
	chart.redraw();
}

function PFSH()
{
	var pfsh = $(".PFSH-CT .k-radio:checked");
	var chart = $("#evalution_bar").data("kendoChart");
	var pfsh_ct =0;

	pfsh.each(function(rad)
	{
		pfsh_ct += this.value;
	});
	if(pfsh_ct == 1)
		chart.options.series[0].data[5] = 4
	else if(pfsh_ct > 1)
		chart.options.series[0].data[5] = 5;
	else
		chart.options.series[0].data[5] = 0;
	//expandEvalPanel();
	chart.options.transitions = false;
	chart.redraw();
}

function ros_ct3(data)
{

	// if(data == 'T')
	// {
	// 	$('.roschk').prop('checked',true);
	// 	evalgrid_rosbar();
	// }
	// else
	// {
		if(sessionData.roschk)
		{
			$.each(sessionData.roschk, function( index, value ) {
				$(".roschk[id='"+value+"']").prop('checked', true);
			});
		}
		else
		{
			$('.roschk').prop('checked',false);
		}
		evalgrid_rosbar();

	//}
}

function doc_by_provider(data) 
{
	if(data=='F')
	{
		$('.roschk').attr("disabled", true);
		$('#ros_abs').show();
	}
	else
	{
		$('.roschk').removeAttr("disabled");
		$('#ros_abs').hide();
	}
	evalgrid_rosbar();
}

function createICD10chart() 
{
	if(studentType=='APPLICANT')
	{
		var h = $(window).height()-400;
		 h=h-30;
	}
	else
	{
		var dh = $(window).height()-170;
		var h = (dh-140)/2;
		h=h-30;
	}


	diagonisisList=[];
	$('.diagonisisList').each(function(i, obj) {
		if(obj.value.length>0)
		{
			diagonisisList.push(obj.value);
		}
		else
		{
			if($(this).hasClass('k-invalid'))
			{
				$(this).removeClass('k-invalid');
				$(this).parent().find('.k-tooltip-validation').remove();
			}
		}
	});

	if(diagonisisList.length>0)
	{
		$.ajax(
		{  
			type:"POST",  
			url:crudServiceBaseUrl+"get_chart_data.php", 
			data:{diagonisisList: diagonisisList},  
			success:function(response)
			{
				var result = JSON.parse(response);
				if(result.series)
				{
					sessionData.DiagnosisData = result.series;
					sessionStorage.setItem("sessionData",  JSON.stringify(sessionData));

					$("#icd10_graph").html('');
					$("#icd10_graph").removeClass('icdmessage');

					$("#icd10_graph").kendoChart({
						title: {
							text: error_message['ICD10-GRAPH-HEADING'] 
						},
						chartArea: { margin: 0, padding: 0, height: (screen.height * 0.50), width: (screen.width * 0.35) },
						plotArea: { margin: 0, padding: 0, height: (screen.height * 0.50), width: (screen.width * 0.35) },
						legend: {
							position: "bottom"
						},
						seriesDefaults: {
							type: "column"
						},
						series: result.series,
						valueAxis: {
							min: 0,
							max: 10,
							majorUnit: 1,
							labels: {
								format: "{0}"
							},
							line: {
								visible: false
							},
							axisCrossingValue: 0
						},
						categoryAxis: {
							categories: result.cptlist,
							line: {
								visible: false
							},
							labels: {
								padding: {top: 10}
							}
						},
						chartArea: {
							height: h
						},
					});
				
				}
				else
				{
					$("#icd10_graph").html(result.message);
					$("#icd10_graph").addClass('icdmessage');
				}


				$('.diagonisisList').each(function(i, obj) 
				{
					if(result.not_found.indexOf(obj.value)>=0)
					{
						if(!$(this).hasClass('k-invalid'))
						{
							$(this).addClass('k-invalid');
							$(this).parent().append('<span class="k-widget k-tooltip k-tooltip-validation k-invalid-msg" data-for="subject" role="alert"><span class="k-icon k-i-warning"></span> '+error_message['CHARTTRAINER-BASICINFORMATION-NOSUCHCODE']+'</span>')

						}
					}
					else
					{
						if($(this).hasClass('k-invalid'))
						{
							$(this).removeClass('k-invalid');
							$(this).parent().find('.k-tooltip-validation').remove();
						}
					}
				});
			}  
		}); 
	}
	 
}


function filterDsgccGrid()
{
	var filterOptions = [];

	var dsgcc_level = $('input[name=dsgcc_level]:checked').val();
	if(dsgcc_level && dsgcc_level!='' && dsgcc_level!='1')
	{
		filterOptions.push({field: "OverallRisk",operator: "eq",value: dsgcc_level});
	}

	var search_dsgcc = $('#search_dsgcc').val();   
	if(search_dsgcc!='')
	{
		filterOptions.push({field: "text",operator: "contains",value: search_dsgcc});
	}

	var search_dsgcc1 = $('#search_dsgcc1').val();
	if(search_dsgcc1!='')
	{
		filterOptions.push({field: "text",operator: "contains",value: search_dsgcc1});
	}

	// OPTIONS FROM MEDICATION TAB
	var medicationmapping_id ='';
	var medicationmapping_id2 ='';

	var IV_FLUIDS = $( 'input[name=IV-FLUIDS]:checked' ).val();
	if(IV_FLUIDS=='Y')
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'IV-FLUIDS';
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'IV-FLUIDS';
	  }
	  if(medicationmapping_id2=='')
	  {
		medicationmapping_id2 = 'IV-FLUIDS';
	  }
	}
	var IV_MED_C = $( 'input[name=IV-MED-C]:checked' ).val();
	if(IV_MED_C!=0 )
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'IV-MED-C-'+IV_MED_C;
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'IV-MED-C-'+IV_MED_C;
	  }
	}
	var IM_MED_C = $( 'input[name=IM-MED-C]:checked' ).val();
	if(IM_MED_C!=0 )
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'IM-MED-C-'+IM_MED_C;
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'IM-MED-C-'+IM_MED_C;
	  }
	}
	var OREE = $( 'input[name=OREE]:checked' ).val();
	if(OREE=='Y')
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'OREE';
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'OREE';
	  }
	  if(medicationmapping_id2=='')
	  {
		medicationmapping_id2 = 'OREE';
	  }
	}
	var IV_MED_NC = $( 'input[name=IV-MED-NC]:checked' ).val();
	if(IV_MED_NC!=0 )
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'IV-MED-NC-'+IV_MED_NC;
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'IV-MED-NC-'+IV_MED_NC;
	  }

	}
	var IM_MED_NC = $( 'input[name=IM-MED-NC]:checked' ).val();
	if(IM_MED_NC!=0 )
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'IM-MED-NC-'+IM_MED_NC;
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'IM-MED-NC-'+IM_MED_NC;
	  }
	}
	var NB_MED = $( 'input[name=NB-MED]:checked' ).val();
	if(NB_MED!=0 )
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'NB-MED-'+NB_MED;
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'NB-MED-'+NB_MED;
	  }
	}
	var RX = $( 'input[name=RX]:checked' ).val();
	if(RX== 'Y')
	{
	  if(medicationmapping_id=='')
	  {
		medicationmapping_id = 'RX';
	  }
	  else
	  {
		medicationmapping_id = medicationmapping_id+'+'+'RX';
	  }
	  if(medicationmapping_id2=='')
	  {
		medicationmapping_id2 = 'RX';
	  }
	}

	if(medicationmapping_id2!='')
	{
	  var added = 0;
	  if(IV_MED_C!=0 || IV_MED_NC!=0)
	  {
		medicationmapping_id2 = medicationmapping_id2+'+'+'IV-MED';
		added=1;
	  }
	  if((IM_MED_C!=0 || IM_MED_NC!=0) && added==0)
	  {
		medicationmapping_id2 = medicationmapping_id2+'+'+'IM-MED';
		added=1;
	  }
	  if(added==0)
	  {
		medicationmapping_id2='';
	  }
	}

	if(medicationmapping_id!='')
	{
		filterOptions.push({field: "medicationmapping_id",operator: "eq",value: medicationmapping_id});
	}

	if(medicationmapping_id2!='')
	{
		filterOptions.push({field: "medicationmapping_id2",operator: "eq",value: medicationmapping_id2});
	}

	/////

	if(filterOptions.length>0)
	{
		$("#left_dsgcc_grid").data("kendoGrid").dataSource.filter(
		{
			logic: "and",
			filters: filterOptions
		});
	} 
	else 
	{
		$("#left_dsgcc_grid").data("kendoGrid").dataSource.filter({});
	}
}

function loadLeftDsgccGrid(datagriditemsperpage)
{
	// CONFIGURING LEFT DSGCC KENDOGRID DATA SOURCE
	dataSource = new kendo.data.DataSource(
	{
		transport: 
		{
			read:  
			{
				url: crudServiceBaseUrl+'ajax_chart_trainer.php?action=read_dsgcc',
				dataType : "json",
				cache: false,
				contentType: 'application/json; charset=utf-8',
				type: "GET"
			}
		},
		pageSize: 3,
		schema: 
		{
			total: "total",
			data: "return_data",  
			model: 
			{  
				id: "dsgcc_id",
				fields: 
				{
					OverallRisk: {type: "string"},
					Level: {type: "string"}, 
					Type: {type: "string"},                   
					Number: {type: "number"},
					Text: {type: "string"}, 
					Action: {type: "string"}
				}
			}
		},
		serverPaging: true,
		serverFiltering: true,
	});

	// LOADING LEFT DSGCC KENDOGRID
	left_dsgcc=$("#left_dsgcc_grid").kendoGrid(
	{
		dataSource: dataSource,
		pageable:
		{
			pageSizes: [3,5],
			buttonCount: 2
		},  
		scrollable: false,
		sortable: true,
		columns: 
		[
			{field: "OverallRisk", title: "Overall Risk", width: 90},  
			{field: "Level", title: "CPT", width: 50},        
			{field: "Number", title: "Bullet", width: 50},
			{field: "Type", width: 50}, 
			{field: "Text"},
			{ command: {
					text: "showDetails",
					template: "<a class='k-grid-decreaseIndent k-custom-pointer' onclick='selectRowDsgcc($(this))' style='margin:15px; padding:6px' ><span class='fa fa-plus'></span></a>"
				}, width:70
			}

		],
		change: selectRowDsgcc,
		
	}).data("kendoGrid");

	// UPDATE PAGE SIZE
	var pageSizeDropDownList = left_dsgcc.wrapper.children(".k-grid-pager").find("select").data("kendoDropDownList");
	pageSizeDropDownList.bind("change", grid_page_size_update);


	left_dsgcc.element.on("click", "tbody tr td:last-child", clickonlastcolumndsgcc);
}



function clickonrowdsgcc()
{
	var chkvalue = $(this).find('.k-checkbox').trigger('click');
}

// HANDLE AND BLOCKING CLICKING EFFECT ON LAST COLUMN OF GRID ROW
function clickonlastcolumndsgcc(e) 
{
	e.stopPropagation();
}

// FUNTION TO SELECT ROW 
function selectRowDsgcc(e) 
{
	checkedDsgccIds = {};
	var row = e.select().closest("tr");
	var grid = $('#left_dsgcc_grid').data('kendoGrid');
	var dataItem = grid.dataItem(row);
	var dsgcc_id = dataItem.dsgcc_id;
	checkedDsgccIds[dsgcc_id] = true;

	var formdata = 
	{
		chart_id: chart_id,
		checkedDsgccIds: checkedDsgccIds,
	};

	$.ajax(
	{  
		type:"POST",  
		url: crudServiceBaseUrl+'/chart_dsgcc_create.php',  
		data: formdata,  
		success:function(data)
		{

			var response = JSON.parse(data);
			if(response.success == "1")
			{
				current_dsgcc_tabular_data(chart_id);

				$('#message_area').html(response.message);
				$('#message_area').show();

				setTimeout(function()
				{
					$('#message_area').html('');
					$('#message_area').hide();

				}, (sitevariable.messagedisplaytime*1000));
			}
			else
			{
			   
			}
		}  
	});
}


// LOAD RIGHT SIDE DSGCC
function current_dsgcc_tabular_data(chart_id) 
{
	// CONFIGURING KENDOGRID DATA SOURCE
	dataSource = new kendo.data.DataSource(
	{
		transport: 
		{
			read:  
			{
				url: crudServiceBaseUrl + "/chartdsgcc.php?chart_id="+chart_id,
				dataType : "json", 
				cache: false,
				contentType: 'application/json; charset=utf-8',
				type: "GET",
			},
			destroy: 
			{
				url: crudServiceBaseUrl+'/chartdsgcc.php?chart_id='+chart_id+'&action=delete',
				type: "POST",
				cache: false,
				dataType: "json"
			}
		},
		requestEnd: function(e) 
		{
			var grid = $('#current_dsgcc_result').data('kendoGrid');
			evalgrid_riskbar(grid);
		},
		pageSize: datagriditemsperpage,
		schema: 
		{
			total: "total",
			data: "return_data",  
			model: 
			{
				id: "dsgcc_id",
				fields: 
				{
					overall_risk: 
					{
						editable: false, nullable: false
					},
					dsgcc_level: 
					{
						editable: false, nullable: false
					},
					number: 
					{
						editable: false, nullable: false
					},
					dsgcc_text: 
					{
						editable: false, nullable: false
					},
					dsgcc_type: 
					{
						editable: false, nullable: false
					},
					Action: {},
				}
				
			}
		},
	}

	);
									
	// DEFINING KENDOGRID FOR CHART FINDER
	current_dsgcc_result = $("#current_dsgcc_result").kendoGrid(
	{
		dataSource: dataSource,
		scrollable: false,
		sortable: true,
		pageable:
		{
			pageSizes: getKendoGridPageSizes(),
			buttonCount: 2
		},  
		columns: 
		[
			{
				field: "overall_risk", title: "Overall Risk", width: 90
			},
			{
				field: "dsgcc_level", title:"CPT", width: 50
			},
			{
				field: "number", title: "Bullet", width: 50
			},
			{
				field: "dsgcc_type", title: "Type", width: 50
			}, 
			{
				field: "dsgcc_text", title: "Text"
			},
			{
				field: "Action", 
				width: 90, 
				command: [
					{name: "Delete",  
						click: function(e)
						{
							e.preventDefault();
							var tr = $(e.target).closest("tr");
							var grid = $('#current_dsgcc_result').data('kendoGrid');
							var data = grid.dataItem(tr);
							$("#current_dsgcc_result").data("kendoGrid").dataSource.remove(data);
							$("#current_dsgcc_result").data("kendoGrid").dataSource.sync();

							// MESSAGES
							setTimeout(function () {
								$('#message_area').html(error_message['DSGCC-DELETE-SUCCESS']);
								$('#message_area').addClass('ERROR');
								$('#message_area').show();
							});

							setTimeout(function()
							{
								$('#message_area').html(''); 
								$('#message_area').removeClass('ERROR');
								$('#message_area').hide();
							}, (sitevariable.messagedisplaytime*1000));
						}                              
					}
				]
			}
		   
		],
		dataBound: function(e) 
		{
			var grid = e.sender;
			evalgrid_riskbar(grid);
		}
	}).data("kendoGrid");     
}

function evalgrid_riskbar(grid)
{
	var items =  grid.dataSource.data();
	var chart = $("#evalution_bar").data("kendoChart");
	var overall_risks=[];

	items.forEach(function(e) {
		if(overall_risks.indexOf(e.overall_risk) < 0)
			overall_risks.push(e.overall_risk);
	});
	
	if(overall_risks.indexOf("Critical Care") > -1)
		chart.options.series[0].data[2] = 6; 
	else if(overall_risks.indexOf("High") > -1)
		chart.options.series[0].data[2] = 5;  
	else if(overall_risks.indexOf("High Moderate") > -1)    
		chart.options.series[0].data[2] = 4;  
	else if(overall_risks.indexOf("Low Moderate")> -1)       
		chart.options.series[0].data[2] = 3; 
	else if(overall_risks.indexOf("Low") > -1)       
		chart.options.series[0].data[2] = 2; 
	else if(overall_risks.indexOf("Minimal") > -1)      
		chart.options.series[0].data[2] = 1;  
	else              
		chart.options.series[0].data[2] = 0; 

	//expandEvalPanel();
	chart.options.transitions = false;
	chart.redraw();
}

function loadAllProviderDropdowns()
{
	if (document.getElementById('procedures_primary_provider')) 
	{
		var dataSource = new kendo.data.DataSource({
			data: providerArray
		});

		$('#procedures_primary_provider').kendoDropDownList({
			dataSource: dataSource,
			dataTextField: "providerid",
			dataValueField: "providerval",
			filter: "startswith",
			highlightFirst: false,
			syncValueAndText: false,
			suggest: false
		});
	}

	if (document.getElementById('procedures_secondary_provider')) 
	{
		var dataSource = new kendo.data.DataSource({
			data: providerArray
		});

		$('#procedures_secondary_provider').kendoDropDownList({
			dataSource: dataSource,
			dataTextField: "providerid",
			dataValueField: "providerval",
			filter: "startswith",
			highlightFirst: false,
			syncValueAndText: false,
			suggest: false
		});
	}
}

function loadChartImages(chartNumber)
{
	var tabArray = ['md', 'bi', 'hpi', 'ros', 'pfsh', 'pe', 'ord', 'mdm', 'ip', 'aa'];
	for (var i = 0; i < tabArray.length; i++) 
	{
		$('#'+tabArray[i]+'_image').html('');
	}

	$.ajax(
	{  
		type:"POST",  
		url:crudServiceBaseUrl+"chart_images.php", 
		data:{chartnumber: chartNumber},  
		success:function(response)
		{
			//createICD10chart(chartNumber);
			current_dsgcc_tabular_data(chartNumber);
			var response=JSON.parse(response);
			$.each(response, function( index, value ) {
				$('#'+value+'_image').html('<div style="width: 100%;"><a href="modules/admin/chart_loader/images/'+chartNumber+'/'+chartNumber+'_'+value+'.png" class="pull-right round-button" target="_blank">Open Image in New Tab</a><img style="max-width:100%; height:auto;" src="modules/admin/chart_loader/images/'+chartNumber+'/'+chartNumber+'_'+value+'.png" /></div>');
			});
		}  
	});
}

function selectProviderInKendoGrid(provierid)
{
	if(provierid=='')
	{
		return 'NA';
	}
	else
	{
		for(i=0;i<providerArray.length;i++)
		{
			if(providerArray[i].providerval==provierid)
			{
				return providerArray[i].providerid
			}
		}
	}
	
	return 'NA';
}

function filterCPTGrid()
{
	var filterOptions = [];
	var procedures_cpt_keyword = $('#procedures_cpt_keyword').val();   
	if(procedures_cpt_keyword!='')
	{
		filterOptions.push({field: "cpt_id",operator: "startswith",value: procedures_cpt_keyword});
	}

	if(filterOptions.length>0)
	{
		$("#procedure_grid").data("kendoGrid").dataSource.filter(
		{
			logic: "and",
			filters: filterOptions
		});
	} 
	else 
	{
		$("#procedure_grid").data("kendoGrid").dataSource.filter({});
	}
}

function loadLeftProceduresGrid()
{
	// CONFIGURING LEFT DSGCC KENDOGRID DATA SOURCE
	dataSource = new kendo.data.DataSource(
	{
		transport: 
		{
			read:  
			{
				url: crudServiceBaseUrl+'loadcpt.php',
				dataType : "json", 
				cache: false,
				contentType: 'application/json; charset=utf-8',
				type: "GET"
			}
		},
		pageSize: datagriditemsperpage,
		schema: 
		{
			total: "total",
			data: "return_data",  
			model: 
			{  
				id: "cpt_id",
				fields: 
				{
					cpt_id: {type: "string"},
					description: {type: "string"}, 
					year: {type: "year"}, 
				}
			}
		},
		serverPaging: true,
		serverFiltering: true,
	});

	// LOADING LEFT DSGCC KENDOGRID
	left_cpt=$("#procedure_grid").kendoGrid(
	{
		dataSource: dataSource,
		pageable:
		{
			pageSizes: getKendoGridPageSizes(),
			buttonCount: 2
		},  
		scrollable: false,
		sortable: true,
		columns: 
		[
			{selectable: true, headerTemplate:'Applicable', width: 50 },
			{field: "cpt_id", title: "CPT", width: 45},  
			{field: "description", title: "Description"},
			{field: "year", title: "Year", width: 45},
		],
		//change: selectRowCpt,
		
	}).data("kendoGrid");

	// UPDATE PAGE SIZE
	var pageSizeDropDownList = left_cpt.wrapper.children(".k-grid-pager").find("select").data("kendoDropDownList");
	pageSizeDropDownList.bind("change", grid_page_size_update);
}

// SAVING ITEM PER PAGE IN DB FOR OVERVIEW GRID
function grid_page_size_update(e) 
{
	var pageSize = e.sender.value();
	if(!pageSize || pageSize == 'undefined')
	{
		pageSize = 0;
	}

	// UPDATING SITE GLOBAL VARIABLE
	SiteGlobalVariables.user_data.datagriditemsperpage = pageSize;

	// updatePageSize FUNCTION CALLED FROM main.js
	updatePageSize(pageSize, 'datagriditemsperpage');
}

$("#overallrisks, #amountcomplexitydata, #emsummary").on('click', function(event) 
{

	if(!$(this).find('li').hasClass('k-state-active'))
	{
		$("#chart_trainer_panelbar li .k-content").css("display", "none");
		$(this).find("li:eq(0), .medication").addClass('k-state-active');
		$(this).find(".k-content:eq(0), #EM-summary .k-content:eq(0), #AAC .k-content:eq(0), .medication").css({"display": "block", "height": "auto", "overflow": "visible", "opacity": "1"});
	}

	if($(this).find('li').hasClass('k-state-active'))
	{

		var ac = $(this).find('li.k-state-active').attr('aria-controls');
		$(this).find('#'+ac).css({"display": "block", "height": "auto", "overflow": "visible", "opacity": "1"});
	}
});

$("#providers .k-link.panelh").on('click', function(event) 
{

	if(sessionData.chart_id == chart_id)
	{
		if(sessionData.PROVIDERS_CT)
		{
			if(sessionData.PROVIDERS_CT=='T')
			{
				loadYesSplitProviderContent();
				if(sessionData.SupervisingProvider)
				{
					var dropdownlist = $("#supervising_provider").data("kendoDropDownList");
					dropdownlist.value(sessionData.SupervisingProvider);
				}

				if(sessionData.MidlevelProvider)
				{
					var dropdownlist = $("#midlevel_provider").data("kendoDropDownList");
					dropdownlist.value(sessionData.MidlevelProvider);
				}
			}
			else
			{
				loadNoSplitProviderContent();

				if(sessionData.primaryProvider)
				{
					var dropdownlist = $("#primary_provider").data("kendoDropDownList");
					dropdownlist.value(sessionData.primaryProvider);
				}
			}
		}
	}
});