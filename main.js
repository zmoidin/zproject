// THE FOLLOWING FUNCTIONS ARE TO BE INCLUDED IN EVERY PAGE OF THIS WEBSITE.

// GETROOTURL - RETURNS THE CORRECT BASE URL FOR MAKING RESOURCE REQUESTS
// FOR LOCALHOST IT RETURNS HTTP://LOCALHOST/DUVASAWKO/
// FOR SERVER IT RETURNS HTTP://DSTRAININGDEV.COM/
var SiteGlobalVariables;


function getRootUrl() 
{
  var rootUrl = ( window.location.origin.indexOf('localhost') > 0 ) ? 
                  window.location.origin+"/duvasawko/" : 
                  window.location.origin + "/";
  return rootUrl;
}

// IDLETIMER - TRACKS USER ACTIVITY ON THE BROWSER.
// IF USER INACTIVE FOR THE PRESCRIBED SESSIONTIME, USER IS AUTOMATICALLY LOGGED OUT.
function idleTimer(sessiontime) 
{
  var t;
  window.onmousemove = resetTimer; // CATCHES MOUSE MOVEMENTS
  window.onmousedown = resetTimer; // CATCHES MOUSE MOVEMENTS
  window.onclick = resetTimer;     // CATCHES MOUSE CLICKS
  window.onscroll = resetTimer;    // CATCHES SCROLLING
  window.onkeypress = resetTimer;  // CATCHES KEYBOARD ACTIONS

  //LOGOUT THE USER AS THERE WAS NO ACTIVITY
  function logout() 
  {
  	window.sessionStorage.clear(); 
    window.location.href = getRootUrl() +"logout"; 
    return ""; 
  }

  // RESET THE TIMER TO SESSIONTIME AS THERE WAS SOME ACTIVITY
  function resetTimer() 
  {
    clearTimeout(t);
    t = setTimeout(logout, sessiontime);  // TIME IS IN MILLISECONDS (1000 IS 1 SECOND)
  }
}

// ON PAGELOAD CALL THE TIMER TO TRACT USER ACTIVITY
idleTimer(SESSION_TIME * 1000);

// GET A COOKIE VALUE BY NAME
function getCookie(cname) 
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) 
  {
    var c = ca[i];
    while (c.charAt(0) == ' ') 
    {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) 
    {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// PAGE SIZES ARRAY FOR KENDOGRID
function getKendoGridPageSizes()
{
  
  itemsperpage=5;
  var sizes=[];
  // sizes.push('all');
  sizes.push(itemsperpage-2);
  sizes.push(itemsperpage);
  sizes.push(itemsperpage*2);
  sizes.push(itemsperpage*4);

  return sizes;
}

// PAGE SIZES ARRAY FOR KENDOGRID
function getMedicationsGridPageSizes()
{
  
  var sizes=[];
  sizes.push(3);
  sizes.push(5);
  sizes.push(10);
  return sizes;
}

// PAGE SIZES ARRAY FOR KENDOGRID
function StudentProgressPageSizes()
{
  
  itemsperpage=5;
  var sizes=[];
  sizes.push(itemsperpage-2);
  sizes.push(itemsperpage);

  return sizes;
}

// PAGE SIZES ARRAY FOR KENDOGRID
function SmallPageSizes()
{
  
  var sizes=[];
  sizes.push(1);
  sizes.push(2);

  return sizes;
}

// UPDATE KENDOGRID PAGE SIZE
function updatePageSize(pageSize, column)
{
	if (!column) column = "datagriditemsperpage";
	$.ajax({
		url: getRootUrl()+'includes/ajax/updatepagesize.php',
		type: "POST",
		data: {pageSize: pageSize, column: column},
	});
}

// SCORING ALGORITHM COMMON FUNCTIONS
// FUNCTION TO LOOKUP SCORE WEIGHTS TO CALCULATE THE SCORE.


// HELPER FUNCTIONS TO CREATE THE TOKENS FOR PARSING ICDSTRING.
function isLetter(ch) {
 return /[a-z]/i.test(ch);
}

function isDigit(ch) {
 return /\d/.test(ch);
}

function isOperator(ch) {
 return /\#|\&|\*|\||\!|\@|\$|\%|\~|\^/.test(ch);
}

function isUnaryOperator(ch) {
 return /\*|\@|\$|\^/.test(ch);
}

function isLeftParenthesis(ch) {
 return (ch === "(");
}

function isRightParenthesis(ch) {
 return (ch == ")");
}

// TOKENIZER FUNCTION TO BREAK THE ICDSTRING INTO TOKENS THAT WILL BE PARSED LATER
function tokenize(str) 
{
  //ARRAY OF TOKENS
  var result=[]; 
  
  // REMOVE SPACES THEY DON'T MATTER
  str = str.replace(/\s+/g, "");

  // CONVERT TO ARRAY OF CHARACTERS
  str=str.split("");

  var buffer="";
  str.forEach(function (char, idx)
  {
      if(isDigit(char)) 
      {
        buffer += char;
      } 
      else if(char == ".")
      {
        buffer += char;
      }
      else if (isLetter(char)) 
      {
        buffer += char;
      } 
      else if (isOperator(char)) 
      {
          if(buffer !== "") result.push(buffer);
        result.push(char);
        buffer = "";
      } 
      else if (isLeftParenthesis(char)) 
      {
        result.push(char);
      } 
      else if (isRightParenthesis(char)) 
      {
        if(buffer !== "") result.push(buffer);
        result.push(char);
        buffer = "";
      } 

      if(idx == str.length-1 && (buffer !== "") )
      {
        result.push(buffer);
        buffer="";  
      }
    });

    return result;
}

// PARSE THE TOKENS AND ADD THEM TO THE QUEUE OR STACK TO EVALUATE THE SCORES
function parse(tokens)
{
  var outQueue=[];
  var opStack=[];

  Array.prototype.peek = function() {
    return this.slice(-1)[0];
  };

  tokens.forEach(function(v) 
  {
    if (isOperator(v))
    {
      if(v == '^' || v == '@' || v == '$' || v == '*')
        outQueue.push(v);
      else
        opStack.push(v);
    }
    else if( isLeftParenthesis(v))
    {
      opStack.push(v);
    }
    else if(isRightParenthesis(v))
    {
      while(opStack.peek() && !isLeftParenthesis(opStack.peek()))
      {
        outQueue.push(opStack.pop());
      }

      // POP THE LEFT PARENTHESIS FROM THE STACK, BUT NOT ONTO THE OUTPUT QUEUE.
      opStack.pop();
    }
    else
    {
      outQueue.push(v);
    }
    
  });

  return outQueue.concat(opStack.reverse());
}

function sortNumber(a,b) 
{
    return a - b;
}

function uppercaseICD(a)
{
	a = a.replace(/\s+/g, "");
  	return (!a || a == 0 ) ? "" : a.toUpperCase();
}

function scoreICDValues(icdstr, dataicd)
{
	if(!icdstr || icdstr == "" )  return 0;

	//VAR OPERATOR = [ "AND/OR", "AND", "OR", "XOR", "[P]", "[N]", "[S]", "[OPT]", "(", ")"];
	var operator = [ "#", "&", "|", "!", "^", "@", "$", "*", "%", "~", "(", ")"];

	icdstr = icdstr.toUpperCase();
	dataicd = dataicd.map(uppercaseICD);

	// REPLACE ALL WORD OPERATORS TO SYMBOL OPERATORS
	icdstr = icdstr.replace(/por+/gi, "%");
	icdstr = icdstr.replace(/sor+/gi, "~");
	icdstr = icdstr.replace(/and+/gi, "&");
	icdstr = icdstr.replace(/or+/gi, "|");
	icdstr = icdstr.replace(/x\|+/gi, "!");
	icdstr = icdstr.replace(/\[p\]+/gi, "^");
	icdstr = icdstr.replace(/\[s\]+/gi, "$");
	icdstr = icdstr.replace(/\[opt\]+/gi, "*");
	icdstr = icdstr.replace(/\[n\]+/gi, "@");
	icdstr = icdstr.replace(/\&\/\|+/g, "#");


	var icdTokens = tokenize(icdstr);
	var parsedQue = parse(icdTokens);
	// console.log("parsedQue");
	// console.log(parsedQue);

	var icdscore=0;
	var outBuffer =[];

	if(parsedQue.length == 1)
	{
	    // THERE ARE NO OPERATORS.
	    if(dataicd.indexOf(parsedQue[0]) >=0 ) 
	    {
	        return lookupScoreWeight("icd10");
	    }
	    else
	    {
	        return 0;
	    }
	}

	// ONCE WE HAVE THE PARSED TOKENS, WE CAN START CALCULATING THE SCORES
	// LOOP THROUGH THE PARSED TOKENS
	var unaryOp_present = false;
	var unaryOp_result = true;
	for(var i=0; i<parsedQue.length; i++)
	{
	    var q = parsedQue[i];

	    // IF THE CURRENT TOKEN IS AN OPERAND PUSH TO BUFFER
	    // IF THE CURRENT TOKEN IS AN OPERATOR THEN POP THE OPERANDS FROM THE BUFFER TO PERFORM THE OPERATION 
	    if(isOperator(q))
	    {
	    	if(q == '%' || q == '~' || q == '#') q = "|";
	    	// THE OPERATOR IS AN UNARY OPERATOR, SO POP ONLY ONE OPERAND
			if(q == '^' || q == '@' || q == '$' || q == '*')
			{
				var operand1 = outBuffer.pop();

				// IF OPERAND FROM BUFFER IS BOOLEAN, THIS IS THE RESULT OF A PREVIOUS OPERATION
				// FIGURE OUT THE OPERAND FROM THE PARSED TOKENS WHEN THE PREVIOUS RESULT WAS TRUE
				// PUSH OPERAND DIRECTLY TO BUFFER IF ITS FALSE
				var uop = operand1;
				if (typeof operand1 == typeof true && operand1)
				{
				  var lastOp1 = parsedQue[i-2];
				  var lastOp2 = parsedQue[i-3];

				  // ASSUME UNARY OPERAND IS PRESENT. WE WILL SET IT TO FALSE WHEN WE DONT FIND ANY OPERAND.
				  unaryOp_present = true;

				  // IDENTIFY  IF UNARY OPERATOR PRESENT AND ALSO PICK THE OPERAND
				  if(dataicd.indexOf(lastOp1) >=0 ) uop = lastOp1;
				  else if(dataicd.indexOf(lastOp2) >=0 ) uop = lastOp2;
				  else
				  	unaryOp_present = false; // SHOULD NOT HAPPEN

				}
				else if (typeof operand1 == typeof true && !operand1)
				{
				  // IDENTIFY IF UNARY OPERANDS PRESENT OR NOT
				  var lastOp1 = parsedQue[i-2];
				  var lastOp2 = parsedQue[i-3];
				  if(dataicd.indexOf(lastOp1) >=0 || dataicd.indexOf(lastOp2) >=0 ) unaryOp_present = true;
				}
				else
				{
					 if(dataicd.indexOf(uop) >=0 ) unaryOp_present = true;
				}

				// SCORE WILL BE 0.5 ONLY FOR TRUE OPERANDS, PUSH THE OPERAND TO BUFFER FOR FURTHER COMPARISON.
				if(unaryOp_present && q == '^')
				{
				  if(dataicd.indexOf(uop) != 0)
				  {
				    // console.log("not sequenced first or not present");
				    outBuffer.push(false);
				    unaryOp_result = false;

				    if(dataicd.indexOf(uop) != -1) unaryOp_present = true;
				  } 
				  else
				  {
				    outBuffer.push(true);
				  }
				}
				else if(unaryOp_present && q == '@')
				{
				  if(dataicd.indexOf(uop) != -1)
				  {
				    outBuffer.push(true);
				  }
				  else
				  {
				    // console.log("not found [n] ");
				    unaryOp_result = false;
				    outBuffer.push(false);
				  }
				}
				else if(unaryOp_present && q =='$')
				{
					if(dataicd.indexOf(uop) == dataicd.indexOf(dataicd[dataicd.length-1]))
					{
						outBuffer.push(true);
					}
					else
					{
						if(dataicd.indexOf(uop) != -1) unaryOp_present = true;
						outBuffer.push(false);
						unaryOp_result = false;
						// console.log("not sequenced last");
					}
				}
				else if( unaryOp_present && q == '*')
				{
					if(dataicd.indexOf(uop) != -1)
					{
						outBuffer.push(true);
					}
					else
					{
						outBuffer.push(true);
						// console.log("[opt] ");
					}
				}
				else
				{
					if(!unaryOp_present) outBuffer.push(uop);
				}
			}
			else
			{
		        // BINARY OPERATORS WILL HAVE TWO OPERANDS
		        // POP TWO VALUES FROM THE BUFFER
		        var operand1 = outBuffer.pop();
		        var operand2 = outBuffer.pop();

		        // IF THE OPERAND(S) IS/ARE BOOLEAN, THEN IT IS THE RESULT OF PREVIOUS COMPARISON.
		        // FIGURE OUT THE CONDITIONS TO PERFORM THE CURRENT LOGICAL OPERATION.
		        // PUSH THE RESULT OF THE LOGICAL OPERATION TO THE BUFFER FOR FURTHER COMPARISON.
		        var cond1;
		        var cond2;
		        if (typeof operand1 == typeof true)
		        {
		          // VARIABLE IS A BOOLEAN
		          cond1 = operand1;
		        }
		        else 
		        {
		          cond1 = dataicd.indexOf(operand1) >= 0;
		        }

		        if (typeof operand2 == typeof true)
		        {
		          // VARIABLE IS A BOOLEAN
		          cond2 = operand2;
		        }
		        else 
		        {
		          cond2 = dataicd.indexOf(operand2) >=0;
		        }       

		        //BINARY OPERATOR
		        if(q == '&')
		        {
		          if( cond1 && cond2)
		          {
		            outBuffer.push(true);
		          }
		          else
		          {
		            outBuffer.push(false);
		            // console.log("and failed");
		          }
		        }
		        else if( q == '|')
		        {
		          if(cond1 || cond2)
		          {
		            outBuffer.push(true);
		          }
		          else
		          {
		            // console.log("or failed");
		            outBuffer.push(false);
		          }
		        }
		        else if( q == '!')
		        {
		          if(cond1 && cond2)
		          {
		            outBuffer.push(false);
		            // console.log("xor failed");
		          }
		          else if(cond1 || cond2)
		          {
		            outBuffer.push(true);
		          }
		          else
		          {
		            outBuffer.push(false);
		            // console.log("xor failed");
		          }
		        }
		        else
		        {
		          console.log("not matched any binary operator");
		        }
	    	}
	    }
	    else
	    {
	      // PUSH THE OPERAND TO THE BUFFER
	      outBuffer.push(q);
	    }

	   	// console.log("OutBuffer: ");
	    // console.log(outBuffer);

	}
	if(outBuffer[0] && unaryOp_result) icdscore = lookupScoreWeight("icd10");
	else icdscore=0;
	return parseFloat(icdscore);
}

// VALIDATE ICDSTRING
function validateICD(icdstr)
{
	//VAR OPERATOR = [ "AND/OR", "AND", "OR", "XOR", "[P]", "[N]", "[S]", "[OPT]", "POR", "SOR","(", ")"];
	var operator = [ "#", "&", "|", "!", "^", "@", "$", "*", "%", "~", "(", ")"];

	icdstr = icdstr.toUpperCase();
	icdstr = icdstr.trim();
	icdstr = icdstr.replace(/  +/g, ' ');

	var uoperators = icdstr.match(/\[[\d\w]*\]/gi);
	if(uoperators)
	{
		for(var i=0; i< uoperators.length; i++)
		{
			if(uoperators[i] != "[P]" && uoperators[i] != "[S]" && uoperators[i] != "[N]" && uoperators[i] != "[OPT]") 
				return "operator";
		}
	}

	// REPLACE ALL WORD OPERATORS TO SYMBOL OPERATORS
	icdstr = icdstr.replace(/por+/gi, "%");
	icdstr = icdstr.replace(/sor+/gi, "~");
	icdstr = icdstr.replace(/and+/gi, "&");
	icdstr = icdstr.replace(/or+/gi, "|");
	icdstr = icdstr.replace(/x\|+/gi, "!");
	icdstr = icdstr.replace(/\[p\]+/gi, "^");
	icdstr = icdstr.replace(/\[s\]+/gi, "$");
	icdstr = icdstr.replace(/\[opt\]+/gi, "*");
	icdstr = icdstr.replace(/\[n\]+/gi, "@");
	icdstr = icdstr.replace(/\&\/\|+/g, "#");


	var icdTokens = tokenize(icdstr);
	// console.log(icdTokens);
	if(icdTokens.length>0)
	{
		var leftBrackets = icdTokens.filter(function(x) { return x=== '('; });
		var rightBrackets = icdTokens.filter(function(x) { return x=== ')'; });

		//if(icdTokens.filter(i => i === '(').length != icdTokens.filter(i => i === ')').length) return "invalid";
		if(leftBrackets.length != rightBrackets.length) return "invalid";
	}
	

	for(var i=0; i<icdTokens.length; i++)
	{   
		var q = icdTokens[i];
		if(isOperator(q))
	    {
	    	if(q == '%' || q == '~')
			{
				var nextOp = '';
				for(var o=i+1; o<icdTokens.length; o++)
				{
					if(isOperator(icdTokens[o])) 
					{
						nextOp = icdTokens[o];
						break;
					}
				}
				if(nextOp != "")
				{
					if(q == '%' && (nextOp != '^')) return 'por';
					if(q == '~' && (nextOp != '$')) return 'sor';
				}
				else
				{
					var prevOp = '';
					for(var o=i-1; o>=0; o--)
	    			{
	    				if(isOperator(icdTokens[o])) 
	    				{
	    					prevOp = icdTokens[o];
	    					break;
	    				}
	    			}
	    			if(prevOp != "")
	    			{
		    			if(q == '%' && prevOp != '^') return 'por';
		    			if(q == '~' && prevOp != '$') return 'sor';	    				
	    			}
	    			else
	    			{
	    				if(q == '%') return 'por';
		    			if(q == '~') return 'sor';	    
	    			}
				}	
			}
		}
	}

	return "";
}

function validateEmail(emailField)
{
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (reg.test(emailField) == false) 
	{
	return false;
	}
	return true;
}

function sendEmail(to,subject,body,type)
{
	$.ajax({
	    url: getRootUrl()+'includes/ajax/send_email.php',
	    type: "POST",
	    data: {to : to, subject: subject, body:body, type:type}
	});
}

function lookupScoreWeight ( name ) 
{
	var scoringWeightsArray = SiteGlobalVariables.student_scoring_weight;
    for(var i = 0, len = scoringWeightsArray.length; i < len; i++) {
        if( scoringWeightsArray[ i ][name] )
            return parseFloat(scoringWeightsArray[ i ][name], 10);
    }
    return false;
}

$(document).ready(function() 
{
	var borwserSupported = 0;
	if(navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1)
	{
		if(navigator.userAgent.indexOf("Edge") == -1 && navigator.userAgent.indexOf("OPR") == -1)
		{
			borwserSupported =1;
		}
		
	}

	if(borwserSupported==1)
	{
		$('.login-form').show();
		$('#browserwindow').remove();

	}

	$.ajax({
	    url: getRootUrl()+'includes/ajax/get_site_global_variables.php',
	    type: "POST",
	    data: {},
	    success: function(response)
        {
            SiteGlobalVariables = JSON.parse(response);

			if(borwserSupported==0)
			{
				$('#notsupported').remove();
				var window = $("#browserwindow").kendoWindow({
			        visible: false,
			        width: "350px"
			    }).data("kendoWindow");

				var browsertitle = SiteGlobalVariables.error_message['title_UNSUPPORTED-BROWSER'];
				var browsercontent = SiteGlobalVariables.error_message['UNSUPPORTED-BROWSER'];

			    window.title('UNSUPPORTED BROWSER');
		        window.content('<p>'+browsercontent+'</p><div class="action_buttons"><button class="k-button" id="browserYesButton">YES</button><button class="k-button" id="browserNoButton"> NO</button></div>');
		        window.center().open();

		        $("#browserYesButton").click(function()
		        {
		        	$('#browserYesDone').show();
		            window.close();
		           
		        })
		        $("#browserNoButton").click(function()
		        {
		        	$('#browserNoDone').show();
		            window.close();
		        })
			}
		
        }
	});
	
	if(!window.sessionStorage.getItem('alerts'))
	{
		$(".notifications-dropdown-menu").fadeIn( "slow", function() 
		{
			window.sessionStorage.setItem('alerts', "1");
		    // Animation complete.
		       setTimeout(function () {
		        	$(".notifications-dropdown-menu").fadeOut( "slow", function() {
		        		$(".notifications-dropdown-menu").removeAttr( 'style' );
		        	});
	    	}, 2000);
	 	});
	}

	var user_role = getCookie('user_role');
	if(user_role == 'S')
	{
		messageLoad();
		function messageLoad() {

			if(SiteGlobalVariables && top_message!='')
			{
				if(SiteGlobalVariables.user_data)
				{
					var stage = SiteGlobalVariables.user_data.stage;
					var parameters = SiteGlobalVariables.trainer_parameter;

					var top_message = '';
					if(stage==1)
						top_message=parameters.stage1message;
					if(stage==2)
						top_message=parameters.stage2message;
					if(stage==3)
						top_message=parameters.stage3message;
					if(stage==4)
						top_message=parameters.stage4message;
					if(stage==5)
						top_message=parameters.stage5message;

					var tooltip = $("#tooltip_window").kendoTooltip({
						autoHide: false,
						showOn: "click",
						position: "right",
						filter: "div[id=tooltip_window]",
						content: "<p>"+top_message+"</p>"
					}).data("kendoTooltip");

					$('#stages_message').html('<div class="stage"><p>STAGE '+stage+'<img class="tooltip_info" src="img/ds_icon_info.svg" /></p></div>');
					$('body').on('click','.tooltip_info', function () {
						tooltip.show($("#stages_message"));
						$('.k-animation-container').css({'top':'12px', 'left':'305px'});
					});
				}
				
			}
			else
			{
				setTimeout(function(){ messageLoad(); }, 500);
			}
		}
	}

});