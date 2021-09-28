//Fields and Global Varibales
var currDate = new Date();
var currentUser;
var selectedQuote;
var productsDataLis = [];
var accessoryDataLis = [];
var spareDataLis = [];
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
var pumpSearchMethod = document.getElementById("pumpSearchMethod");
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
var shaftMoc = document.getElementById("shaftMoc");
var sealingGlandFlushing = document.getElementById("sealingGlandFlushing");
var lubrication = document.getElementById("lubrication");
var impellerType = document.getElementById("impellerType");
var flangeDrilling = document.getElementById("flangeDrilling");
//Table Fields
var pumpLis = document.getElementsByName("pump");
var pumpAmtLis = document.getElementsByName("p_amount");
var accessoryLis = document.getElementsByName("accessory");
var accessoryAmtLis = document.getElementsByName("a_amount");
var sparePartLis = document.getElementsByName("sparePart");
var sparePartAmtLis = document.getElementsByName("s_amount");
var otherProductLis = document.getElementsByName("otherProduct");
var otherProductsAmtLis = document.getElementsByName("o_amount");
var pumpTotal = document.getElementById("pumpTotal");
var accessoryTotal = document.getElementById("accessoryTotal");
var sparePartTotal = document.getElementById("sparePartTotal");
var otherProductsTotal = document.getElementById("otherProductsTotal");
var discountPercentage = document.getElementById("discountPercentage");
var discount = document.getElementById("discount");
var conMap = {p:pumpAmtLis,a:accessoryAmtLis,s:sparePartAmtLis,o:otherProductsAmtLis};
var totalMap = {p:pumpTotal,a:accessoryTotal,s:sparePartTotal,o:otherProductsTotal};
// Expressions
pumpSearchMethod.onchange = showDetail;
quoteDate.valueAsDate  = currDate;
//console.log(quoteDate.value); //quoteDate.valueAsDate.toISOString();
require([subject.id,contactName.id],"id");
// require(["optradio1"],"name");
var initPumpInformation = () => {
casingMoc.innerHTML = emptyOpt;
impellerMoc.innerHTML = emptyOpt;
shaftMoc.innerHTML = emptyOpt;
lubrication.innerHTML = emptyOpt;
shaftSealing.innerHTML = emptyOpt;
sealingGlandFlushing.innerHTML = emptyOpt;
flangeDrilling.innerHTML = emptyOpt;
}
var initDetailSpecs = () => {
	flowRate.value = "";
	head.value = "";
	temperature.value = "";
	specificGravity.value = "";
}
// Add row button code - start
var rowCount = {pumpBody:1,accessoryBody:1,sparePartBody:1,otherProductsBody:1};
async function addRow(thisVal,tabBody){
		rowVal = rowCount[tabBody];
		let conMap = {pumpBody:"pump_",accessoryBody:"accessory_",sparePartBody:"sparePart_",otherProductsBody:"otherProduct_"};
		let firstLtr = conMap[tabBody].substring(0,1);
		let mandatoryCheck = false;
		let routeMethod = false;
		let serSeries = "";
		let serSize = "";
		let serSpeed = "";
		if(pumpSearchMethod.value == "Route2" && tabBody == "pumpBody"){
			// Route 2 No API
			mandatoryCheck = true;
			routeMethod = true;
			apiSpecs = "";
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
		else if(pumpSearchMethod.value == "Route1" && tabBody == "pumpBody"){
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
					let effVal = (apiSelectedData.EFFICIENCY || "NA")+"%";
					let motorRatVal = apiSelectedData.MOTOR_RATING_KW || "NA";
					let shaftPwr = apiSelectedData.SHAFT_POWER || "NA";
					apiSpecs = "\nFlow rate: "+flowRate.value+" "+flowRateUnit.value+",  Head: "+head.value+" "+headUnit.value+",  Efficiency: "+effVal+",  Sp. Gr: "+specificGravity.value+",  Reco. Motor: "+motorRatVal+",  Pump bkW / bhp: "+shaftPwr+",  Casing MoC: "+casingMoc.value+",   Liquid Name: "+($("#liquidName")[0].value || "NA")+",  ";
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
		else if(tabBody == "accessoryBody" || tabBody == "sparePartBody"){
			if($("#"+tabBody+"Filter")[0].checked){
			let productsBasedOnPump = [];
			pumpLis.forEach(val => {
				relatedRec = productsRelations[val.value] || {};
					let productsData = relatedRec[tabBody] || [];
					productsBasedOnPump = [...productsBasedOnPump,...productsData];
			});
			if(productsBasedOnPump.length > 0){
				appendTabRow(tabBody,rowVal);
				require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
				rowCount[tabBody]++;
				let rowField = document.getElementById(conMap[tabBody]+rowVal);
				rowField.innerHTML = emptyOpt+productsBasedOnPump.map(data => {
					return '<option value="'+data.id+'">'+data.Display_Name+'-'+data.Product_Code+'</option>';
				}).join("");
			}
			else{
				swal("Invalid Selection","No porducts available with given values","info");
			}
			}
			else if(tabBody == "accessoryBody" && accessoryType.value != "-None-"){
				let filterdAccessory = accessoryDataLis.filter(data => data.Accessory_Type == accessoryType.value);
				if(filterdAccessory.length > 0){
					appendTabRow(tabBody,rowVal);
					require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
					rowCount[tabBody]++;
					let rowField = document.getElementById(conMap[tabBody]+rowVal);
					rowField.innerHTML = emptyOpt+filterdAccessory.map(data => {
						return '<option value="'+data.id+'">'+data.Display_Name+'-'+data.Product_Code+'</option>';
					}).join("");
				}
				else{
					swal("Invalid Selection","No porducts available with given values","info");
				}
			}
			else if(tabBody == "sparePartBody" && $("#sparePumpModel")[0].value != "-None-"){
				let filterdSpare = spareDataLis.filter(data => data.Pump.id == $("#sparePumpModel")[0].value);
				if(filterdSpare.length > 0){
					appendTabRow(tabBody,rowVal);
					require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
					rowCount[tabBody]++;
					let rowField = document.getElementById(conMap[tabBody]+rowVal);
					rowField.innerHTML = emptyOpt+filterdSpare.map(data => {
						return '<option value="'+data.id+'">'+data.Display_Name+'-'+data.Product_Code+'</option>';
					}).join("");
				}
				else{
					swal("Invalid Selection","No porducts available with given values","info");
				}
			}
			else{
				appendTabRow(tabBody,rowVal);
				require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
				rowCount[tabBody]++;
			}
		}
		else{
			appendTabRow(tabBody,rowVal);
			require([conMap[tabBody]+rowVal,firstLtr+"_quantity_"+rowVal],"id");
			rowCount[tabBody]++;
		}
		if(mandatoryCheck && routeMethod){
			let searchMap = {Pump_Type:pumpType.value,Series:serSeries,Shaft_Speed:serSpeed,Size:serSize};
			let filterMap = {Casing_MoC:casingMoc.value,Impeller_MoC:impellerMoc.value,Shaft_MoC:shaftMoc.value,Impeller_Type:impellerType.value,Lubrication:lubrication.value,Shaft_Sealing:shaftSealing.value,Mechanical_Seal_Flushing:sealingGlandFlushing.value,Flange_Drilling:flangeDrilling.value};
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
						return '<option value="'+data.id+'">'+data.Display_Name+'-'+data.Product_Code+'</option>';
					}).join("");
					if(finalPump.length == 1){
						$("#"+conMap[tabBody]+rowVal).val(finalPump[0].id).change();
					}
				}
				else{
					swal("Invalid Selection","No porducts available with given values","info");
				}
		}
		else if(routeMethod){
			swal("Empty Value","Select all the fields marked mandatory","error");
		}
		return rowVal;
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
		var fetchUrl = new URL("https://test.makemypump.com:8291//api/Curve/GetCurveTest");
		let pumpTypeAPI;
		crmPumpTypes.forEach(val => {
			if(val.id == pumpType.value){
				pumpTypeAPI = val.Name;
			}
		});
		let applicationTypeAPI = crmAppTypeSingle.Name;
		let flowRateVal = formula("Flow",flowRateUnit.value,flowRate.value);
		let headVal = formula("Head",headUnit.value,head.value,specificGravity.value);
		let temperatureVal = formula("Temperature",temperatureUnit.value,temperature.value);
		var params = {fld1:pumpTypeAPI,fld2:applicationTypeAPI,fld3:flowRateVal,fld4:"m3/hr",fld5:headVal,fld6:"m",fld7:temperatureVal,fld8:"d",fld9:specificGravity.value,fld10:shaftSpeed_API.value};
		Object.keys(params).forEach(key => fetchUrl.searchParams.append(key, params[key]));
		console.log(fetchUrl);
		fetch(fetchUrl)
		.then(resp => resp.json(), err => {
			swal("Unkown Error",err.toString(),"warning");
			console.log(err);
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
						tabRow += '<td style="display: '+display+';"><input type="text" name="'+obj+'" value="'+objVal+'" id="'+obj+'_'+index+'" index="'+index+'" class="form-control" disabled></td>';
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
		if(val.Name.toUpperCase() == seriesVal.toUpperCase()){
			seriesOnChange(val.id);
		}
	});
}
var seriesOnChange = async seriesVal => {
	if(seriesVal){
		impellerMoc.innerHTML = emptyOpt;
		shaftMoc.innerHTML = emptyOpt;
		sealingGlandFlushing.innerHTML = emptyOpt;
		size.innerHTML = emptyOpt;
		var shaftSpeedLis = [];
		crmSizes.forEach(val => shaftSpeedLis = shaftSpeedLis.concat(val.Shaft_Speed));
		shaftSpeedLis = [...new Set(shaftSpeedLis)];
		shaftSpeed.innerHTML =emptyOpt+shaftSpeedLis.map(data => '<option value="'+data+'">'+data+'</option>').join("");
		crmSeriesSingle = await getSingleRecord("Series",seriesVal);
		casingMoc.innerHTML =emptyOpt+crmSeriesSingle.Series_MoC.map(data => '<option value="'+data.Casing_MoC+'">'+data.Casing_MoC+'</option>').join("");
		shaftSealing.innerHTML =emptyOpt+crmSeriesSingle.Series_Seal_Flushing.map(data => '<option value="'+data.Shaft_Sealing+'">'+data.Shaft_Sealing+'</option>').join("");
		lubrication.innerHTML =emptyOpt+crmSeriesSingle.Bearing_Lubrication.map(data => '<option value="'+data+'">'+data+'</option>').join("");
		flangeDrilling.innerHTML =emptyOpt+crmSeriesSingle.Flange_Drilling.map(data => '<option value="'+data+'">'+data+'</option>').join("");

		if(crmSeriesSingle.Series_MoC.length == 1){
			$("#casingMoc").val(crmSeriesSingle.Series_MoC[0].Casing_MoC).change();
		}
		if(crmSeriesSingle.Bearing_Lubrication.length == 1){
			$("#lubrication").val(crmSeriesSingle.Bearing_Lubrication[0]).change();
		}
		if(crmSeriesSingle.Series_Seal_Flushing.length == 1){
			$("#shaftSealing").val(crmSeriesSingle.Series_Seal_Flushing[0].Shaft_Sealing).change();
		}
		if(crmSeriesSingle.Flange_Drilling.length == 1){
			$("#flangeDrilling").val(crmSeriesSingle.Flange_Drilling[0]).change();
		}
	}
}
function submitFun(submitType){
	let quoteStageVal = submitType == "submitBtn" ? "Confirmed" : "Draft";
	// var fields = document.getElementsByClassName("important");
	// for(let i of fields){
	// 	if(i.value == ""){
	// 		return false;
	// 	}
	// }
	// if(!$("#SAD_Yes")[0].checked && !$("#SAD_No")[0].checked){
	// 	return false;
	// }
	// alert("test");
	console.log(subCustomData);
	let subDataList = [];
	[pumpLis,accessoryLis,sparePartLis,otherProductLis].forEach(subEach => {
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
	if(subDataList.length == 0){
		swal("No Products Available","Add any products to the quatation","error");
		return false;
	}
	let quoteData = {
		id: selectedQuote,
		Subject:subject.value,
		Account_Name:customerName.value,
		Contact_ID:contactName.value,
		Contact_Name:contactName.value,
		Deal_Name:enquiryName.value,
		// Product_Type:productType.value,
		Quote_Stage:quoteStageVal,
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
	quoteData = mapFilter(quoteData);
	console.log(quoteData);
	currentUser = currentUser || [];
	let redirectUrl = currentUser.length > 0 ? "https://crm.zoho.in/crm/org60005855369/tab/Quotes/" : "https://crm.zoho.in/portal/FlowMart/crm/tab/Quotes/";
	if(!quoteData.id){
		ZOHO.CRM.API.insertRecord({Entity:"Quotes",APIData:quoteData}).then(function(data){
			let respData = data.data;
			if(respData){
				swal(respData[0].code,respData[0].message,"success");
				window.parent.parent.window.location = redirectUrl+respData[0].details.id;
				location.reload();//
			}
			else{
				swal("Failed","Unkown error","error");
			}
			},function(err){
				console.log(err);
				swal(err.data[0].code,JSON.stringify(err.data[0].details),"error");
			});
	}
	else{
		var config={
			Entity:"Quotes",
			APIData:quoteData
		  }
		  console.log(config);
		  ZOHO.CRM.API.updateRecord(config)
		  .then(function(data){
			  let respData = data.data;
			 if(respData){
				swal(respData[0].code,respData[0].message,"success");
				window.parent.parent.window.location = redirectUrl+respData[0].details.id;
				location.reload();
			 }
			 else{
				 swal("Failed","Unkown error","error");
			 }
		  },function(err){
			console.log(err);
			swal(err.data[0].code,JSON.stringify(err.data[0].details),"error");
		});
	}
	console.log(subCustomData);
	return false;
}
document.getElementById("quoteForm").onsubmit = function(thisVal){return submitFun(thisVal.submitter.id);}
var editMode = async quoteId =>{
	// quoteId = "156506000001896002";
	selectedQuote = quoteId;
	if(quoteId){
		$("#titleTxt")[0].innerHTML = "Edit Quote";
	getQuote = await getSingleRecord("Quotes",quoteId);
	$("#subject")[0].value = getQuote.Subject;
	$("#customerPlant")[0].value = getQuote.Customer_Plant;
	$("#quoteDate")[0].value = getQuote.Quote_Date;
	$("#custEquipmentNumber")[0].value = getQuote.Cust_Equiment_Number;
	$("#custEquipmentName")[0].value = getQuote.Cust_Equiment_Name;
	$("#liquidName")[0].value = getQuote.Liquid_Name;
	$("#contactName").val((getQuote.Contact_Name || {}).id).change();
	$("#enquiryName").val((getQuote.Deal_Name || {}).id).change();
	// $("#productType").val(getQuote.Product_Type).change();
	$("#pumpSearchMethod").val("NoRoute").change();
	$("#brand").val(getQuote.Brand).change();
	$("#quoteStage").val(getQuote.Quote_Stage).change();
	clearTabRow("pumpBody");
	clearTabRow("accessoryBody");
	clearTabRow("sparePartBody");
	clearTabRow("otherProductsBody");
	getQuote.Product_Details.forEach(async val => {
		let getProduct = await getSingleRecord("Products",val.product.id);
		let tabBody,fieldKey;
		if(getProduct.Product_Category == "Pump"){
			tabBody = "pumpBody";
			fieldKey = "pump_";
		}else if(getProduct.Product_Category == "Accessory"){
			tabBody = "accessoryBody";
			fieldKey = "accessory_";
		}else if(getProduct.Product_Category == "Spare Part"){
			tabBody = "sparePartBody";
			fieldKey = "sparePart_";
		}
		else if(getProduct.Product_Category == "Others"){
			tabBody = "otherProductsBody";
			fieldKey = "otherProduct_";
		}
		let firstLtr = tabBody.substring(0,1)+"_"; // p or a or s
		let index = await addRow(this,tabBody);
		$("#"+fieldKey+index).val(getProduct.id).change();
		$("#"+firstLtr+"quantity_"+index)[0].value = val.quantity;
		setTimeout(() => {
			$("#"+firstLtr+"description_"+index)[0].value = val.product_description;
		}, 1000);		
	});
	console.log(getQuote);
}
else{
	location.reload();
}
}
	// Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
ZOHO.embeddedApp.on("PageLoad",function(etData){
	asyncFun = async () =>{
		currentUser = (await ZOHO.CRM.CONFIG.getCurrentUser()).users;
		console.log(currentUser);
	// Load optionis
		var quotesFields = await getFields("Quotes");
		var mapData = {Brand:brand,Accessory_Type:accessoryType,Quote_Stage:quoteStage,Flow_Rate_Unit:flowRateUnit,Head_Unit:headUnit,Temperature_Unit:temperatureUnit,Shaft_Speed:shaftSpeed_API,Shaft_Speed_Unit:shaftSpeedUnit,Solid_Handling_Requirement_Unit:shrUnit,Impeller_Type:impellerType};
		for(let field of quotesFields){
			if(mapData[field.api_name]){
				mapData[field.api_name].innerHTML = field.pick_list_values.map(data => {
					if(field.api_name == "Accessory_Type" || field.api_name == "Impeller_Type"){
					return '<option value="'+data.display_value+'">'+data.display_value+'</option>';
					}else if(data.actual_value != "-None-"){
					return '<option value="'+data.display_value+'">'+data.display_value+'</option>';
					}}).join("");
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
				if(discountPercentage.value > 0){
					$('.discountPrct').show();
					$('.discount').show();
				}
				else{
					$('.discountPrct').hide();
					$('.discount').hide();
				}
			}
		});
	}
	if(crmContacts.length == 1){
		$("#contactName").val(crmContacts[0].id).change();
	}
	var crmDeals = await getRecords("Deals");
	enquiryName.innerHTML =emptyOpt+crmDeals.map(data => '<option value="'+data.id+'">'+data.Deal_Name+'</option>').join("");
	productsDataLis = await getRecords("Products");
	for (product of productsDataLis){
		let pumpId = (product.Pump || {}).id;
		let pumpName = (product.Pump || {}).name;
		let pumpKey = productsRelations[pumpId] || {};
		let accLis = pumpKey.accessoryBody || [];
		let spareLis = pumpKey.sparePartBody || [];
		if(product.Product_Category == "Pump"){
			for(let value of pumpLis){
				let opt = document.createElement("option");
				opt.text = product.Display_Name +"-"+ product.Product_Code;
				opt.value = product.id;
				value.add(opt);
			}
			let opt = document.createElement("option");
			opt.text = product.Display_Name +"-"+ product.Product_Code;
			opt.value = product.id;
			$("#sparePumpModel")[0].add(opt);
		}
		else if(product.Product_Category == "Accessory"){
			accessoryDataLis.push(product);
			for(let value of accessoryLis){
				let opt = document.createElement("option");
				opt.text = product.Display_Name +"-"+ product.Product_Code;
				opt.value = product.id;
				value.add(opt);
			}
			if(pumpId){
				accLis.push({Display_Name:product.Display_Name,id:product.id,Product_Code:product.Product_Code});
				productsRelations[pumpId] ={...productsRelations[pumpId],...{Product_Name:pumpName,accessoryBody:accLis}};
			}
		}
		else if(product.Product_Category == "Spare Part"){
			spareDataLis.push(product);
			for(let value of sparePartLis){
				let opt = document.createElement("option");
				opt.text = product.Display_Name +"-"+ product.Product_Code;
				opt.value = product.id;
				value.add(opt);
			}
			if(pumpId){
				spareLis.push({Display_Name:product.Display_Name,id:product.id,Product_Code:product.Product_Code});
				productsRelations[pumpId] ={...productsRelations[pumpId],...{Product_Name:pumpName,sparePartBody:spareLis}};
			}
		}
		else if(product.Product_Category == "Others"){
			for(let value of otherProductLis){
				let opt = document.createElement("option");
				opt.text = product.Display_Name +"-"+ product.Product_Code;
				opt.value = product.id;
				value.add(opt);
			}
		}
	}
	var getAllQuotes = await getRecords("Quotes");
		$("#quoteBody")[0].innerHTML =getAllQuotes.map(data => {
			if(data.Quote_Stage == "Draft"){
				let tabRow = '<tr>';
				tabRow += '<td><i class="fa fa-pen btn" data-dismiss="modal" id='+data.id+' onclick="editMode(this.id)"></i></td><td>'+data.Quote_Date+'</td><td>'+data.Subject+'</td><td>'+data.Quote_Stage+'</td><td>'+((data.Deal_Name || {}).name || "")+'</td><td> ₹ '+data.Grand_Total+'</td>';
				tabRow += '</tr>';
				return tabRow;
			}
		}).join("");
	crmPumpTypes = await getRecords("Pump_Types");
	crmSeries = await getRecords("Series");
	crmSizes = await getRecords("Sizes");
	pumpType.innerHTML = emptyOpt+crmPumpTypes.map(data => '<option value="'+data.id+'">'+data.Name+'</option>').join("");
	pumpType.onchange = event => {
		// Application Type & Series
		crmPumpTypes.forEach(val => {
			relatedData = JSON.parse(val.Related_Data || {});
			if(val.id == pumpType.value && !jQuery.isEmptyObject(relatedData)){
				shaftSpeed.innerHTML = emptyOpt;
				size.innerHTML = emptyOpt;
				initDetailSpecs();
				$('.apiTable').hide();
				initPumpInformation();
				applicationType.innerHTML = emptyOpt+relatedData.Application_Type.map(data => '<option value="'+data.id+'">'+data.name+'</option>').join("");
				series.innerHTML = emptyOpt+relatedData.Series.map(data => '<option value="'+data.id+'">'+data.name+'</option>').join("");
			}
		});
	}
	if(crmPumpTypes.length == 1){
	$("#pumpType").val(crmPumpTypes[0].id).change();
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
				if(val.Impeller_MoC.length == 1){
					$("#impellerMoc").val(val.Impeller_MoC[0]).change();
				}
				shaftMoc.innerHTML = emptyOpt+val.Shaft_MoC.map(shaftMoCVal => '<option value="'+shaftMoCVal+'">'+shaftMoCVal+'</option>').join("");
				if(val.Shaft_MoC.length == 1){
					$("#shaftMoc").val(val.Shaft_MoC[0]).change();
				}
			}
		});
	}
	shaftSealing.onchange = event => {
		crmSeriesSingle.Series_Seal_Flushing.forEach(val => {
			if(val.Shaft_Sealing == shaftSealing.value){
				sealingGlandFlushing.innerHTML = emptyOpt+val.Mechanical_Seal_Flushing.map(sealFlushVal => '<option value="'+sealFlushVal+'">'+sealFlushVal+'</option>').join("");
				if(val.Mechanical_Seal_Flushing.length == 1){
					$("#sealingGlandFlushing").val(val.Mechanical_Seal_Flushing[0]).change();
				}
			}
		});
	}
	// Route 1 API
	applicationType.onchange = async event => {
		initDetailSpecs();
		$('.apiTable').hide();
		initPumpInformation();
		if(applicationType.value){
		crmAppTypeSingle = await getSingleRecord("Application_Types",applicationType.value);
		}
	}
	flowRate.onchange = event => {
		$('.apiTable').hide();
		initPumpInformation();
		let flowRateVal = Number(flowRate.value);
		let flowRateMin = crmPumpTypes[0].Flow_Rate_Min;
		let flowRateMax = crmPumpTypes[0].Flow_Rate_Max;
		if(flowRateVal < flowRateMin || flowRateVal > flowRateMax){
			swal("Enter Flow Rate Value " + flowRateMin + " - " + flowRateMax,"","warning");
			flowRate.value = "";
		}
	}
	head.onchange = event => {
		$('.apiTable').hide();
		initPumpInformation();
		let headVal = Number(head.value);
		let headMin = crmPumpTypes[0].Head_Min;
		let headMax = crmPumpTypes[0].Head_Max;
		if(headVal < headMin || headVal > headMax){
			swal("Enter Head Value " + headMin + " - " + headMax,"","warning");
			head.value = "";
		}
	}
	temperature.onchange = event => {
		$('.apiTable').hide();
		initPumpInformation();
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
		$('.apiTable').hide();
		initPumpInformation();
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