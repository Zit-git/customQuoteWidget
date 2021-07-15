//Fields and Global Varibales
var currDate = new Date();
var productsDataLis = [];
var productsRelations = {};
var apiTableData;
var crmPumpTypes;
var crmAppTypeSingle;
var crmSeries;
var crmSeriesSingle;
var crmSizes;
var emptyOpt = '<option value="">-None-</option>';
var subject = document.getElementById("subject");
var customerName = document.getElementById("customerName");
var contactName = document.getElementById("contactName");
var enquiryName = document.getElementById("enquiryName");
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
var specificGravity = document.getElementById("specificGravity");
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
//Table Fields
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
var discount = document.getElementById("discount");
var conMap = {p:pumpAmtLis,a:accessoryAmtLis,s:sparePartAmtLis};
var totalMap = {p:pumpTotal,a:accessoryTotal,s:sparePartTotal};
// Expressions
productType.onchange = typeChange;
quoteDate.valueAsDate  = currDate;
//console.log(quoteDate.value); //quoteDate.valueAsDate.toISOString();
require([subject.id,contactName.id,productType.id],"id");
require(["optradio1"],"name");
// Add row button code - start
var rowCount = {pumpBody:1,accessoryBody:1,sparePartBody:1};
async function addRow(thisVal,tabBody){
		rowVal = rowCount[tabBody];
		let conMap = {pumpBody:"pump_",accessoryBody:"accessory_",sparePartBody:"sparePart_"};
		let firstLtr = conMap[tabBody].substring(0,1);
		let mandatoryCheck = false;
		let routeMethod = false;
		let serSeries = "";
		let serSize = "";
		let serSpeed = "";
		if(document.getElementById("DYK_Yes").checked && tabBody == "pumpBody"){
			// Route 2 No API
			mandatoryCheck = true;
			routeMethod = true;
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
			serSeries = series.value;//series.options[series.selectedIndex].text;
			serSize = size.value;
			serSpeed = shaftSpeed.value;
		}
		else if(document.getElementById("DYK_No").checked && tabBody == "pumpBody"){
			// Route 1 API
			mandatoryCheck = true;
			routeMethod = true;
			let seriesChk = document.getElementsByName("checkBtn");
			seriesChk.forEach(thisVal => {
				if(thisVal.checked){
					let rowIndex = thisVal.getAttribute("index");
					let apiSelectedData = apiTableData[rowIndex];
					serSeries = document.getElementById("SERIES_"+rowIndex).value;
					serSize = document.getElementById("SIZE_"+rowIndex).value;
					serSpeed = document.getElementById("SPEED_"+rowIndex).value;
					let effVal = apiSelectedData.EFFICIENCY+"%";
					let motorRatVal = apiSelectedData.MOTOR_RATING_KW || "";
					let shaftPwr = apiSelectedData.SHAFT_POWER || "";
					apiSpecs = "Flow rate: "+flowRate.value+",  Head: "+head.value+",  Efficiency: "+effVal+",  Sp. Gr: "+specificGravity.value+",  Reco. Motor: "+motorRatVal+",  Pump bkW: "+shaftPwr+",  Casing MoC: "+casingMoc.value+",   Liquid Name: "+$("#liquidName")[0].value+",  ";
					selectData.apiTableData = apiSelectedData;
				}
			});
			if(serSeries != ""){
				for(let i of $("#pumpInfoSession :input")){
					if(!i.value){
						mandatoryCheck = false;
					}
				}
				let detailDataMap = {};
				for(let i of $("#detailSession :input")){
					if(i.parentNode.tagName == "DIV" && i.type != "button"){
					detailDataMap[i.id] = i.value;
					}
				}
				selectData = {...selectData, ...detailDataMap};
			}
			else{
				mandatoryCheck = false;
				swal("Invalid Selection","Select any one of the result in the pump specification list or Click the SEARCH Button","info");
			}
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
		if(mandatoryCheck && routeMethod){
			let searchMap = {Pump_Type:pumpType.value,Series:serSeries,Shaft_Speed:serSpeed,Size:serSize};
			let filterMap = {Casing_MoC:casingMoc.value,Impeller_MoC:impellerMoc.value,Lubrication:lubrication.value,Shaft_Sealing:shaftSealing.value,Mechanical_Seal_Flushing:sealingGlandFlushing.value,Flange_Drilling:flangeDrilling.value};
			selectData = {...selectData, ...searchMap, ...filterMap};
			console.log(selectData);
			let searchQuery = "(";
			for(let key in searchMap){
				searchQuery += "("+key+":equals:"+searchMap[key]+")and";
			}
			searchQuery = searchQuery.endsWith("and") ? searchQuery.slice(0,searchQuery.length - 3) + ")" : searchQuery + ")";
			console.log(searchQuery);
			let resPump = await searchRecord("Products",searchQuery) || [];
			console.log(resPump);
				let finalPump = resPump.filter(val => {
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
					let rowField = document.getElementById(conMap[tabBody]+rowVal);
					rowField.innerHTML = emptyOpt+finalPump.map(data => {
						return '<option value="'+data.id+'">'+data.Product_Name+'-'+data.Product_Code+'</option>';
					}).join("");
				}
				else{
					swal("Invalid Selection","No porducts available with given values","info");
				}
		}
		else if(routeMethod){
			swal("Empty Value","Select all the fields marked mandatory","error");
		}
}
// Add row button code - end
document.getElementById("searchBtn").onclick = event => {
	let mandatoryCheck = true;
	for(let i of $("#detailSession :input")){
		if(i.value == "" && i.id != "searchBtn"){
			mandatoryCheck = false;
		}
	}
	if(mandatoryCheck){
		$('#loadingDiv').show();
		$('#searchBtn').hide();
		var fetchUrl = new URL("http://test.makemypump.com:8288//api/Curve/GetCurveTest");
		let pumpTypeAPI;
		crmPumpTypes.forEach(val => {
			if(val.id == pumpType.value){
				pumpTypeAPI = val.Name;
			}
		});
		let applicationTypeAPI = crmAppTypeSingle.Name;
		var params = {fld1:pumpTypeAPI,fld2:applicationTypeAPI,fld3:flowRate.value,fld4:"m3/hr",fld5:head.value,fld6:"m",fld7:temperature.value,fld8:"",fld9:specificGravity.value,fld10:shaftSpeed_API.value};
		Object.keys(params).forEach(key => fetchUrl.searchParams.append(key, params[key]));
		console.log(fetchUrl);
		fetch(fetchUrl)
		.then(resp => resp.json(), err => {
			swal("Unkown Error",err.toString(),"warning");
			$('#loadingDiv').hide();
			$('#searchBtn').show();
		})
		.then(data => {
			if(data.Table1){
				apiTableData = data.Table1;
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
			else{
				swal("Unkown Error",data.toString(),"warning");
			}
			$('#loadingDiv').hide();
			$('#searchBtn').show();
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
	// for(let i of fields){
	// 	if(i.value == ""){
	// 		return false;
	// 	}
	// }
	// if(!$("#SAD_Yes")[0].checked && !$("#SAD_No")[0].checked){
	// 	return false;
	// }
	alert("test");
	console.log(subCustomData);
	let subDataList = [];
	[pumpLis,accessoryLis,sparePartLis].forEach(subEach => {
		subEach.forEach(data => {
			if(data.value){
				let firstLtr = data.name.substring(0,1); // p or a or s
				let rowIndex = data.getAttribute("index");
				let quantity = document.getElementById(firstLtr+"_quantity_"+rowIndex);
				let description = document.getElementById(firstLtr+"_description_"+rowIndex);
				let dataMap = {product:data.value,quantity:Number(quantity.value),product_description:description.value};
				subDataList.push(dataMap);
			}
		});
	});
	let quoteData = {
		id: "156506000001738053",
		Subject:subject.value,
		Account_Name:customerName.value,
		Deal_Name:enquiryName.value,
		Product_Type:productType.value,
		Quote_Stage:quoteStage.value,
		Quote_Date:quoteDate.value,
		Customer_Plant:$("#customerPlant")[0].value,
		Cust_Equiment_Number:$("#custEquipmentNumber")[0].value,
		Cust_Equiment_Name:$("#custEquipmentName")[0].value,
		Liquid_Name:$("#liquidName")[0].value,
		Brand:brand.value,
		Accessory_Type: accessoryType.value,
		Discount:discountPercentage.value+"%",
		Product_Details:subDataList
	};
// ZOHO.CRM.API.insertRecord({Entity:"Quotes",APIData:quoteData,Trigger:[]}).then(function(data){
// 	console.log(data);
// 	});
	// var config={
	// 	Entity:"Quotes",
	// 	APIData:quoteData,
	// 	Trigger:[]
	//   }
	// //   console.log(config);
	//   ZOHO.CRM.API.updateRecord(config)
	//   .then(function(data){
	// 	  console.log(data);
	//   });
	// console.log(subDataList);
	return false;
}
document.getElementById("quoteForm").onsubmit = function(){return submitFun();}
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
			for(let value of eleAndCat[key]){
					value.add(opt);
			}
		}
	}
	}
	var crmContacts = await getRecords("Contacts");
	contactName.innerHTML =emptyOpt+crmContacts.map(data => {
		return '<option value="'+data.id+'">'+data.Full_Name+'</option>';
	}).join("");
	contactName.onchange = event => {
		crmContacts.forEach(data => {
			if(data.id == contactName.value){
				let accountData = data.Account_Name || {};
				let accId = accountData.id || "-None-";
				let accName = accountData.name || "-None-";
				customerName.innerHTML = '<option value="'+accId+'" selected>'+accName+'</option>';
				discountPercentage.value = data.Discount || 0;
			}
		});
	}
	var crmDeals = await getRecords("Deals");
	enquiryName.innerHTML =emptyOpt+crmDeals.map(data => '<option value="'+data.id+'">'+data.Deal_Name+'</option>').join("");
	crmPumpTypes = await getRecords("Pump_Types");
	crmSeries = await getRecords("Series");
	crmSizes = await getRecords("Sizes");
	pumpType.innerHTML = emptyOpt+crmPumpTypes.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");
	pumpType.onchange = event => {
		// Application Type & Series
		crmPumpTypes.forEach(val => {
			relatedData = JSON.parse(val.Related_Data || {});
			if(val.id == pumpType.value && !jQuery.isEmptyObject(relatedData)){
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
		specificGravity.value = "";
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
	specificGravity.onchange = event => {
		let specificGravityVal = Number(specificGravity.value);
		if(applicationType.value){
			let SpGMin = crmAppTypeSingle.Specific_Gravity_Min;
			let SpGMax = crmAppTypeSingle.Specific_Gravity_Max;
			if(specificGravityVal < SpGMin || specificGravityVal > SpGMax){
				swal("Enter Specific Gravity Value "+ SpGMin+" - "+SpGMax,"","warning");
				specificGravity.value = "";
			}
		}
		else{
			swal("Select application type","","warning");
			specificGravity.value = "";
		}

	}
}
asyncFun();
});
//initialize the widget
ZOHO.embeddedApp.init();