//Fields and Global Varibales
var currDate = new Date();
var productsDataLis = [];
var productsRelations = {};
var crmPumpTypes;
var crmAppTypeSingle;
var crmSeries;
var crmSeriesSingle;
var crmSizes;
var emptyOpt = '<option value="">-None-</option>';
var subject = document.getElementById("subject");
var accountName = document.getElementById("accountName");
var contactName = document.getElementById("contactName");
var dealName = document.getElementById("dealName");
var productType = document.getElementById("productType");
var accessoryType = document.getElementById("accessoryType");
var brand = document.getElementById("brand");
var quoteStage = document.getElementById("quoteStage");
var quoteDate = document.getElementById("quoteDate");
// Route 1&2 Fields
var pumpType = document.getElementById("pumpType");
var applicationType = document.getElementById("applicationType");
var series = document.getElementById("series");
var shaftSpeed = document.getElementById("shaftSpeed");
var size = document.getElementById("size");
var flowRate = document.getElementById("flowRate");
var flowRateUnit = document.getElementById("flowRateUnit");
var specifiGravity = document.getElementById("specifiGravity");
var head = document.getElementById("head");
var headUnit = document.getElementById("headUnit");
var temperature = document.getElementById("temperature");
var temperatureUnit = document.getElementById("temperatureUnit");
var shaftSpeed_API = document.getElementById("shaftSpeed_API");
var shaftSpeedUnit = document.getElementById("shaftSpeedUnit");
var shr = document.getElementById("shr");
var shrUnit = document.getElementById("shrUnit");
var casingMoc = document.getElementById("casingMoc");
var shaftSealing = document.getElementById("shaftSealing");
var impellerMoc = document.getElementById("impellerMoc");
var sealingGlandFlushing = document.getElementById("sealingGlandFlushing");
var lubrication = document.getElementById("lubrication");
var flangeDrilling = document.getElementById("flangeDrilling");
//Table Variables
var pumpLis = document.getElementsByName("pump");
var pumpAmtLis = document.getElementsByName("p_amount");
var accessoryLis = document.getElementsByName("accessory");
var accessoryAmtLis = document.getElementsByName("a_amount");
var sparePartLis = document.getElementsByName("sparePart");
var sparePartAmtLis = document.getElementsByName("s_amount");
var pumpTotal = document.getElementById("pumpTotal");
var accessoryTotal = document.getElementById("accessoryTotal");
var sparePartTotal = document.getElementById("sparePartTotal");
var discountPercentage = document.getElementById("discountPercentage");
var conMap = {p:pumpAmtLis,a:accessoryAmtLis,s:sparePartAmtLis};
var totalMap = {p:pumpTotal,a:accessoryTotal,s:sparePartTotal};
// Expressions
productType.onchange = typeChange;
quoteDate.valueAsDate  = currDate;
//quoteDate.valueAsDate.toISOString();
require([subject.id,contactName.id,productType.id],"id");
require(["optradio1"],"name");
// Add row button code - start
var rowCount = {pumpBody:1,accessoryBody:1,sparePartBody:1};
async function addRow(thisVal,tabBody){
		rowVal = rowCount[tabBody];
		let conMap = {pumpBody:"pump_",accessoryBody:"accessory_",sparePartBody:"sparePart_"};
		let firstLtr = conMap[tabBody].substring(0,1);
		if(document.getElementById("DYK_Yes").checked && tabBody == "pumpBody"){
			// Route 2 No API
			let mandatoryCheck = true;
			for(let i of $("#basicSession :input")){
				if(!i.value){
					mandatoryCheck = false;
				}
			}
			for(let i of $("#pumpInfoSession :input")){
				if(!i.value){
					mandatoryCheck = false;
				}
			}
			if(mandatoryCheck){
				// var searchMap = {Casing_MoC:"CF%208M%20%5C%28SS316%5C%29"};
				var searchMap = {Pump_Type:pumpType.value,Series:series.value,Shaft_Speed:shaftSpeed.value,Size:size.value};
				var filterMap = {Casing_MoC:casingMoc.value,Impeller_MoC:impellerMoc.value,Lubrication:lubrication.value,Shaft_Sealing:shaftSealing.value,Mechanical_Seal_Flushing:sealingGlandFlushing.value,Flange_Drilling:flangeDrilling.value};
				var searchQuery = "(";
				var encodeMap = {"(":"%28",")":"%29",",":"%2C"};
				var escpChar = "%5C";
				for(let key in searchMap){
					var fieldVal = searchMap[key];
					for( let escpKey in encodeMap){
						fieldVal = fieldVal.replaceAll(escpKey,escpChar+encodeMap[escpKey]);
					}
					searchQuery += "("+key+":equals:"+fieldVal+")and";
				}
				searchQuery = searchQuery.endsWith("and") ? searchQuery.slice(0,searchQuery.length - 3) + ")" : searchQuery + ")";
				console.log(searchQuery);
				var resPump = await searchRecord("Products",searchQuery) || [];
				console.log(resPump);
					var finalPump = resPump.filter(val => {
						let rtnVal = true;
						for(key in filterMap){
							if(val[key] != filterMap[key]){
								rtnVal = false;
							}
						}
						return rtnVal;
					});
					if(finalPump != ""){
						appendTabRow(tabBody,rowVal);
						require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
						rowCount[tabBody]++;
						// console.log(finalPump);
						let rowField = document.getElementById(conMap[tabBody]+rowVal);
						rowField.innerHTML = emptyOpt+finalPump.map(data => {
							return '<option value="'+data.id+'">'+data.Product_Name+'-'+data.Product_Code+'</option>';
						}).join("");
					}
					else{
						swal("Invalid Selection","No porducts available with given values","info");
					}
			}
			else{
				swal("Empty Value","Select all the fields marked mandatory","error");
			}
		}
		else if(document.getElementById("DYK_No").checked && tabBody == "pumpBody"){
			
		}
		else{
			appendTabRow(tabBody,rowVal);
			require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
			rowCount[tabBody]++;
			pumpLis.forEach(val => {
				relatedRec = productsRelations[val.value];
				if(relatedRec){
					let productsData = relatedRec[tabBody] || [];
					if(productsData.length > 0){
						let rowField = document.getElementById(conMap[tabBody]+rowVal);
						rowField.innerHTML = emptyOpt+productsData.map(data => {
							return '<option value="'+data.id+'">'+data.Product_Name+'-'+data.Product_Code+'</option>';
						}).join("");
					}
				}
			});	
		}
}
// Add row button code - end
document.getElementById("searchBtn").onclick = event => {
	// Route 1 API
	let mandatoryCheck = true;
	for(let i of $("#basicSession :input")){
		if(i.value == "" && i.id == "pumpType"){
			console.log(i);
			mandatoryCheck = false;
		}
	}
	for(let i of $("#detailSession :input")){
		if(i.value == "" && i.id != "searchBtn"){
			console.log(i);
			mandatoryCheck = false;
		}
	}
	if(mandatoryCheck){
		var fetchUrl = new URL("http://test.makemypump.com:8288//api/Curve/GetCurveTest");
		var params = {fld1:"Horizontal",fld2:"Water",fld3:"70",fld4:"m3/hr",fld5:"30",fld6:"m",fld7:"40",fld8:"",fld9:"1",fld10:"1450"};
		Object.keys(params).forEach(key => fetchUrl.searchParams.append(key, params[key]));
		console.log(fetchUrl);
		fetch(fetchUrl)
		.then(resp => resp.json(), err => swal("Unkown Error",err.toString(),"warning"))
		.then(data => {
			if(data.Table1){
				$('.apiTable').show();
				var rtn = data.Table1.map((val,index) => {
					let visCln = ["SERIES","SIZE","SPEED","DIA","EFFICIENCY","SHAFT_POWER"];
					let tabRow = '<tr>';
					for(obj in val){
						let objVal = val[obj];
						let display = "none";
						if(visCln.includes(obj)){
							display = "true";
						}
						tabRow += '<td style="display: '+display+';"><input type="text" name="'+obj+'" value="'+objVal+'" id="'+obj+'_'+index+'" index="'+index+'" class="form-control"></td>';
					}
					tabRow += '<td><input type="checkbox" class="btn-check" name="checkBtn" id="checkBtn_'+index+'" index="'+index+'" onClick="checkApiRow(this)"></td>';
					tabRow += '</tr>';
					return tabRow;
				});
				document.getElementById("apiBody").innerHTML = rtn.join("");
			}
		});
	}
	else{
		swal("Empty Value","Select all the fields marked mandatory","error");
	}

}
function checkApiRow(thisVal){
	var rowIndex = thisVal.getAttribute("index");
	for(let chk of document.getElementsByName("checkBtn")){
		if(chk.id != thisVal.id){
		chk.checked = false;
		}
	}
	seriesVal = document.getElementById("SERIES_"+rowIndex).value;
	crmSeries.forEach(val => {
		if(val.Name == seriesVal){
			seriesOnChange(val.id);
		}
	});
}
var seriesOnChange = async seriesVal => {
	if(seriesVal){
		var shaftSpeedLis = [];
		crmSizes.forEach(val => shaftSpeedLis = shaftSpeedLis.concat(val.Shaft_Speed));
		shaftSpeedLis = [...new Set(shaftSpeedLis)];
		shaftSpeed.innerHTML =emptyOpt+shaftSpeedLis.map(data => '<option value="'+data+'">'+data+'</option>').join("");
		crmSeriesSingle = await getSingleRecord("Series",seriesVal);
		casingMoc.innerHTML =emptyOpt+crmSeriesSingle.Series_MoC.map(data => '<option value="'+data.Casing_MoC+'">'+data.Casing_MoC+'</option>').join("");
		shaftSealing.innerHTML =emptyOpt+crmSeriesSingle.Series_Seal_Flushing.map(data => '<option value="'+data.Shaft_Sealing+'">'+data.Shaft_Sealing+'</option>').join("");
		lubrication.innerHTML =emptyOpt+crmSeriesSingle.Bearing_Lubrication.map(data => '<option value="'+data+'">'+data+'</option>').join("");
		flangeDrilling.innerHTML =emptyOpt+crmSeriesSingle.Flange_Drilling.map(data => '<option value="'+data+'">'+data+'</option>').join("");
	}
}
function submitFun(thisVal){
	// var fields = document.getElementsByClassName("important");
	// for(i of fields){
	// 	if(i.value == ""){
	// 		return false;
	// 	}
	// }
}
	// Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
ZOHO.embeddedApp.on("PageLoad",function(etData){
	asyncFun = async () =>{
	// Load optionis
		var quotesFields = await getFields("Quotes");
		var mapData = {Brand:brand,Accessory_Type:accessoryType,Quote_Stage:quoteStage,Flow_Rate_Unit:flowRateUnit,Head_Unit:headUnit,Temperature_Unit:temperatureUnit,Shaft_Speed:shaftSpeed_API,Shaft_Speed_Unit:shaftSpeedUnit,Solid_Handling_Requirement_Unit:shrUnit};
		for(let field of quotesFields){
			if(mapData[field.api_name]){
				mapData[field.api_name].innerHTML = field.pick_list_values.map(data => {
					if(data.actual_value != "-None-"){
					return '<option value="'+data.actual_value+'">'+data.display_value+'</option>';
					}}).join("");
			}
		}
	productsDataLis = await getRecords("Products");
	for (product of productsDataLis){
		let pumpId = (product.Pump || {}).id;
		let pumpName = (product.Pump || {}).name;
		if(pumpId){
			pumpKey = productsRelations[pumpId] || {};
			let accLis = pumpKey.accessoryBody || [];
			let spareLis = pumpKey.sparePartBody || [];
			if(product.Product_Category == "Accessory"){
				accLis.push({Product_Name:product.Product_Name,id:product.id,Product_Code:product.Product_Code});
			}
			else if(product.Product_Category == "Spare Part"){
				spareLis.push({Product_Name:product.Product_Name,id:product.id,Product_Code:product.Product_Code});
			}
			productsRelations[pumpId] = {Product_Name:pumpName,accessoryBody:accLis,sparePartBody:spareLis};
		}
		var eleAndCat = {Pump:pumpLis,Accessory:accessoryLis,Spare_Part:sparePartLis};
		for(key in eleAndCat){
		if(product.Product_Category == key.replace("_"," ")){
			let opt = document.createElement("option");
			opt.text = product.Product_Name +"-"+ product.Product_Code;
			opt.value = product.id;
			var attPrc = document.createAttribute("price");
			attPrc.value = product.Unit_Price;
			opt.setAttributeNode(attPrc);
			var attDes = document.createAttribute("description");
			attDes.value = product.Description;
			opt.setAttributeNode(attDes);
			for(let value of eleAndCat[key]){
					value.add(opt);
			}
		}
	}
	}
	var crmContacts = await getRecords("Contacts");
	contactName.innerHTML =emptyOpt+crmContacts.map(data => {
		let attr = "";
		if(crmContacts.length == 1 ){
			attr = "selected";
			discountPercentage.value = data.Discount || 0;
		}
		return '<option value="'+data.id+'" '+attr+'>'+data.Full_Name+'</option>';
	}).join("");
	contactName.onchange = event => {
		crmContacts.forEach(val => {
			if(val.id == contactName.value){
				discountPercentage.value = val.Discount || 0;
			}
		});
	}
	var crmAccounts = await getRecords("Accounts");
	accountName.innerHTML =emptyOpt+crmAccounts.map(data => '<option value="'+data.id+'">'+data.Account_Name+'</option>').join("");
	var crmDeals = await getRecords("Deals");
	dealName.innerHTML =emptyOpt+crmDeals.map(data => '<option value="'+data.id+'">'+data.Deal_Name+'</option>').join("");
	crmPumpTypes = await getRecords("Pump_Types");
	// console.log(JSON.parse(crmPumpTypes[0].Related_Data));
	// var crmApplicationTypes = await getRecords("Application_Types");
	crmSeries = await getRecords("Series");
	crmSizes = await getRecords("Sizes");
	pumpType.innerHTML = emptyOpt+crmPumpTypes.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");
	pumpType.onchange = event => {
		// Application Type & Series
		crmPumpTypes.forEach(val => {
			if(val.id == pumpType.value){
				relatedData = JSON.parse(val.Related_Data);
				applicationType.innerHTML = emptyOpt+relatedData.Application_Type.map(data => '<option value="'+data.id+'">'+data.name+'</option>').join("");
				series.innerHTML = emptyOpt+relatedData.Series.map(data => '<option value="'+data.id+'">'+data.name+'</option>').join("");
			}
		});
	}
	// Route 2 no API
	series.onchange = event => seriesOnChange(series.value);
	shaftSpeed.onchange = event => {
		size.innerHTML = emptyOpt+crmSizes.map(data => {
			if(data.Shaft_Speed.includes(shaftSpeed.value)){
			return '<option value="'+data.id+'">'+data.Name+'</option>';
			}
		}).join("");
	}
	casingMoc.onchange = event => {
		crmSeriesSingle.Series_MoC.forEach(val => {
			if(val.Casing_MoC == casingMoc.value){
				impellerMoc.innerHTML =	emptyOpt+val.Impeller_MoC.map(impellerVal => '<option value="'+impellerVal+'">'+impellerVal+'</option>').join("");
			}
		});
	}
	shaftSealing.onchange = event => {
		crmSeriesSingle.Series_Seal_Flushing.forEach(val => {
			if(val.Shaft_Sealing == shaftSealing.value){
				sealingGlandFlushing.innerHTML = emptyOpt+val.Mechanical_Seal_Flushing.map(sealFlushVal => '<option value="'+sealFlushVal+'">'+sealFlushVal+'</option>').join("");
			}
		});
	}
	// Route 1 API
	applicationType.onchange = async event => {
		temperature.value = "";
		shr.value = "";
		specifiGravity.value = "";
		if(applicationType.value){
		crmAppTypeSingle = await getSingleRecord("Application_Types",applicationType.value);
		}
	}
	flowRate.onchange = event => {
		let flowRateVal = Number(flowRate.value);
		let flowRateMin = crmPumpTypes[0].Flow_Rate_Min;
		let flowRateMax = crmPumpTypes[0].Flow_Rate_Max;
		if(flowRateVal < flowRateMin || flowRateVal > flowRateMax){
			swal("Enter Flow Rate Value " + flowRateMin + " - " + flowRateMax,"","warning");
			flowRate.value = "";
		}
	}
	head.onchange = event => {
		let headVal = Number(head.value);
		let headMin = crmPumpTypes[0].Head_Min;
		let headMax = crmPumpTypes[0].Head_Max;
		if(headVal < headMin || headVal > headMax){
			swal("Enter Head Value " + headMin + " - " + headMax,"","warning");
			head.value = "";
		}
	}
	temperature.onchange = event => {
		let tempVal = Number(temperature.value);
		if(applicationType.value){
			let tempMin = crmAppTypeSingle.Temperature_Min;
			let tempMax = crmAppTypeSingle.Temperature_Max;
			if(tempVal < tempMin || tempVal > tempMax){
				swal("Enter temperature value "+ tempMin+" - "+tempMax,"","warning");
				temperature.value = "";
			}
			else{
				crmAppTypeSingle.Seal_Flushing.forEach(val => {
					let tempMin = val.Temperature_Min;
					let tempMax = val.Temperature_Max;
					if(tempVal >= tempMin && tempVal <= tempMax){
						sealingGlandFlushing.innerHTML =emptyOpt+'<option value="'+val.Mechanical_Seal_Flushing+'">'+val.Mechanical_Seal_Flushing+'</option>';
					}
				});
			}
		}
		else{
			swal("Select application type","","warning");
			temperature.value = "";
		}
	}
	shr.onchange = event => {
		let shrVal = Number(shr.value);
		if(applicationType.value){
			if(shrVal < 0 || shrVal > crmAppTypeSingle.Solid_Handling_Requirement_SHR)
			{
				swal("Enter Solid Handling Requirement Value 0 - " + crmAppTypeSingle.Solid_Handling_Requirement_SHR + "","","warning");
				shr.value = "";
			}
		}
		else{
			swal("Select application type","","warning");
			shr.value = "";
		}
	}
	specifiGravity.onchange = event => {
		let specifiGravityVal = Number(specifiGravity.value);
		if(applicationType.value){
			let SpGMin = crmAppTypeSingle.Specific_Gravity_Min;
			let SpGMax = crmAppTypeSingle.Specific_Gravity_Max;
			if(specifiGravityVal < SpGMin || specifiGravityVal > SpGMax){
				swal("Enter Specific Gravity Value "+ SpGMin+" - "+SpGMax,"","warning");
				specifiGravity.value = "";
			}
		}
		else{
			swal("Select application type","","warning");
			specifiGravity.value = "";
		}

	}
}
asyncFun();
});
//initialize the widget
ZOHO.embeddedApp.init();