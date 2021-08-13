// Refer script.js global varibales for any unkown variables
var selectData = {};
var apiSpecs = "";
var subCustomData = [];
// General Functions - start
var getSuffix = (suf,str) => str.substring(str.indexOf(suf)+1,str.length);
var getPrefix = (prf,str) => str.substring(0,str.indexOf(prf));
var hide = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).hide();
}
var show = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).show();
}
var mapFilter = obj => {
	let filteredMap = {};
  Object.keys(obj).forEach(key =>{
	  if(obj[key] && obj[key] != "-None-"){
		  filteredMap[key] = obj[key];
	  }
  });
  return filteredMap;
}
// Prevent char like e,+,- in number field
var preventNum = fieldList =>{
	for(let numField of fieldList){
		var invalidChars = ["-","+","e"];
		numField.addEventListener("keydown", function(e) {
			if (invalidChars.includes(e.key)) {
			  e.preventDefault();
			}
		  });
	}
	}
	preventNum($('input[type=number]'));
//ReplaceAll function
var replaceAll = (text,search,replaceWith) => text.split(search).join(replaceWith);	
//Add Row Function - start
var appendTabRow = (tabBody,rowIndex) =>{
	var subTabBody = document.getElementById(tabBody);
	var firstcloneRow = subTabBody.firstElementChild.cloneNode(true);
	// var rowText = firstcloneRow.innerHTML.replaceAll("###",rowIndex);
	var rowText = replaceAll(firstcloneRow.innerHTML,"###",rowIndex);
	var firstRow = document.createElement("tr");
	firstRow.innerHTML = rowText;
	firstRow.style = "display: true;";
	subTabBody.appendChild(firstRow);
	preventNum($('input[type=number]'));
}
//Add Row Function - end
// Clear subfrom rows - start
var clearTabRow = tabBodyId => {
	tabBody = document.getElementById(tabBodyId);
	var firstcloneRow = tabBody.firstElementChild.cloneNode(true).outerHTML;
	tabBody.innerHTML = firstcloneRow;
} 
// Clear subfrom rows - end
// Delete subfrom row - start
function delRow(thisValue){
	var firstLtr = thisValue.id.substring(0,1); // p or a or s
	var parNode = thisValue.closest("tr");
	var rowIndex = thisValue.getAttribute("index");
	var amountVal = document.getElementById(firstLtr+"_amount_"+rowIndex).value || 0;
	totalMap[firstLtr].value = totalMap[firstLtr].value - amountVal;
	calcTotal();
	parNode.remove();
}
// Delete subform row - end
// Subform Calculation - start
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
var calcTotal = () =>{
	let subTotal = document.getElementById("subTotal");
	let discountPercentage = document.getElementById("discountPercentage");
	let discount = document.getElementById("discount");
	let totalAmount = document.getElementById("totalAmount");
	subTotalVal = 0;
	for (let i in totalMap){
		currTotalVal = totalMap[i].value || 0;
		subTotalVal += Number(currTotalVal);
	}
	subTotal.value = roundToTwo(subTotalVal);
	let discountPercntVal = discountPercentage.value ? discountPercentage.value / 100 : 0;
	let discountVal = subTotalVal * discountPercntVal;
	discount.value = roundToTwo(discountVal);
	totalAmount.value = roundToTwo(subTotalVal - discountVal);
}
async function fetchPrice(event,thisVal) {
	let productId = thisVal.value;
	if(productId){
	let crmProductSingle = await getSingleRecord("Products",productId);
	console.log(crmProductSingle);
	let firstLtr = thisVal.name.substring(0,1); // p or a or s
	let descriptionVal = crmProductSingle.Description || "";
	if(firstLtr == "p"){ //pump
		let finalTxt = "\nDatasheet ref nr: "+ crmProductSingle.TDS_Ref + " ( For operating limits and warranty conditions check the datasheet )";
		descriptionVal+= apiSpecs+finalTxt;
		let cusTempMap = {Product_Id:crmProductSingle.id,Specification:apiSpecs +finalTxt,Select_Data:selectData};
		subCustomData.push(cusTempMap);
	}
    let rowIndex = thisVal.getAttribute("index");
	let quantity = document.getElementById(firstLtr+"_quantity_"+rowIndex);
	let unitPrice = document.getElementById(firstLtr+"_unitPrice_"+rowIndex);
	let description = document.getElementById(firstLtr+"_description_"+rowIndex);
	let amount = document.getElementById(firstLtr+"_amount_"+rowIndex);
	let quantityVal = quantity.value || 0;
	let unitPriceVal = crmProductSingle.Unit_Price;
	
	description.value = descriptionVal;
	unitPrice.value = unitPriceVal;
	amount.value = quantityVal * unitPriceVal;
	let tabTotalVal = 0;
	tabTotal = conMap[firstLtr];
	for(let amount of tabTotal){
		tabTotalVal += Number(amount.value);
	}
	totalMap[firstLtr].value = roundToTwo(tabTotalVal);
	calcTotal();
}
}
function calcAmount(event,thisVal){
	var firstLtr = thisVal.name.substring(0,1); // p or a or s
	var rowIndex = thisVal.getAttribute("index");
	var quantityVal = event.target.value || 0;
	var unitPrice = document.getElementById(firstLtr+"_unitPrice_"+rowIndex);
	var amount = document.getElementById(firstLtr+"_amount_"+rowIndex);
	var unitPriceVal = unitPrice.value || 0;
	amount.value = quantityVal * unitPriceVal;
	var tabTotalVal = 0;
	tabTotal = conMap[firstLtr];
	for(let amount of tabTotal){
		tabTotalVal += Number(amount.value);
	}
	totalMap[firstLtr].value = roundToTwo(tabTotalVal);
	calcTotal();
}
// Subform Calculation - end
var require = (values,by) => {
	for(value of values){
		if(by == "id"){
			let field = document.getElementById(value);
			field.required = true;
			field.className = field.className + " important";
		}
		else if(by == "name"){
			let fields = document.getElementsByName(value);
			for(i=1; i < fields.length; i++){
				field = fields[i];
				field.required = true;
				field.className = field.className + " important";
			}
		}
}
}
var notRequire = (values,by) => {
	for(value of values){
		if(by == "id"){
			let field = document.getElementById(value);
			field.required = false;
			field.className = field.className.replace(" important","");
		}
		else if(by == "name"){
			let fields = document.getElementsByName(value);
			for(i=1; i < fields.length; i++){
				field = fields[i];
				field.required = false;
				field.className = field.className.replace(" important","");
			}
		}
}
}
var formula = (name,unit,value,specificGrav) => {
	unit = unit.toLowerCase();
	value = Number(value);
	specificGrav = Number(specificGrav);
	let flowFactor = {"m3/hr":1,"lpm":0.06,"lph":0.001,"lps":3.6,"gpm (us)":0.2271};
	let headFactor = {"mlc":1,"flc":0.3048,"bar (g)":10.197,"kg/cm2":10.197};
	let temperatureFactor = {"deg c":1,"deg f":5/9};
	let factorMap = {Flow:flowFactor,Head:headFactor,Temperature:temperatureFactor};
	let convFactor = factorMap[name][unit];
	let convVal,finalVal;
	if(unit == "bar (g)" || unit == "kg/cm2"){
		convVal = value * convFactor;
		finalVal = convVal / specificGrav;
	}else if(unit == "deg f"){
		convVal = value - 32;
		finalVal = convVal * convFactor;
	}else{
		finalVal = value * convFactor;
	}
	return roundToTwo(finalVal);
}
var getRecords = async entity =>{
	let responseData = [], pageVal = 1;
	do {
		let response = await ZOHO.CRM.API.getAllRecords({Entity:entity,page:pageVal,per_page:200});
		responseData = [...responseData,...response.data];
		pageVal++;
		var boolVal = response.info.more_records;
	}
	while (boolVal);
	return responseData;
}
var getSingleRecord = async (entity,RecID) =>{
	var response = await ZOHO.CRM.API.getRecord({Entity:entity,RecordID:RecID});
	return response.data[0];
}
var getRelatedRecords = async (entity,recId,relatedList) =>{
	var response = await ZOHO.CRM.API.getRelatedRecords({Entity:entity,RecordID:recId,RelatedList:relatedList});
	return response.data;
}
var searchRecord = async (entity,searchQuery) =>{
	var response = await ZOHO.CRM.API.searchRecord({Entity:entity,Type:"criteria",Query:searchQuery});
	return response.data;
}
var getFields = async entity =>{
	var response = await ZOHO.CRM.META.getFields({Entity:entity});
	return response.fields;
}
// General Functions - end
//Hide and Show - start
// $('#pumpTotal')[0].value = 0;
// $('#accessoryTotal')[0].value = 0;
// $('#spareTotal')[0].value = 0;
$('.basic-session, .detail-session, .pumpInfo-session, .pump-session, .accessory-session, .spare-session').hide();
$('.dyk').hide();
$('.pumpTotal').hide();
$('.accessoryTotal').hide();
$('.spareTotal').hide();
$('.subTotal').hide();
$('.discountPrct').hide();
$('.discount').hide();
$('.fTotal').hide();
$('.apiTable').hide();
hide("accessoryType","select");
function typeChange(){		
	if (this.value === "Pump") {
		$('.pump-session, .accessory-session, .spare-session').show();
		$('.dyk').show();
		$('.pumpTotal').show();
		$('.accessoryTotal').show();
		$('.spareTotal').show();
		$('.subTotal').show();
		$('.discountPrct').show();
		$('.discount').show();
		$('.fTotal').show();
		hide("accessoryType","select");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
		$('#pumpTotal')[0].value = 0;
		$('#accessoryTotal')[0].value = 0;
		$('#sparePartTotal')[0].value = 0;	
	} else if (this.value === "Accessory") {
		show("accessoryType","select");
		$('.pump-session, .spare-session').hide();
		$('.accessory-session').show();
		$('.dyk').hide();
		$('.pumpTotal').hide();
		$('.accessoryTotal').show();
		$('.spareTotal').hide();
		$('.subTotal').show();
		$('.discountPrct').show();
		$('.discount').show();
		$('.fTotal').show();
		$('.basic-session').hide();
		$('.detail-session').hide();
		$('.pumpInfo-session').hide();
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
		$('#pumpTotal')[0].value = 0;
		$('#accessoryTotal')[0].value = 0;
		$('#sparePartTotal')[0].value = 0;	
		showDetailElse();
	} else if (this.value === "Spare Part") {
		$('.pump-session, .accessory-session').hide();
		$('.spare-session').show();
		$('.dyk').hide();
		$('.pumpTotal').hide();
		$('.accessoryTotal').hide();
		$('.spareTotal').show();
		$('.subTotal').show();
		$('.discountPrct').show();
		$('.discount').show();
		$('.fTotal').show();
		$('.basic-session').hide();
		$('.detail-session').hide();
		$('.pumpInfo-session').hide();
		hide("accessoryType","select");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
		$('#pumpTotal')[0].value = 0;
		$('#accessoryTotal')[0].value = 0;
		$('#sparePartTotal')[0].value = 0;	
		showDetailElse();
	} else {
		$('.pump-session, .accessory-session, .spare-session').hide();
		$('.dyk').hide();
		$('.pumpTotal').hide();
		$('.accessoryTotal').hide();
		$('.spareTotal').hide();
		$('.subTotal').hide();
		$('.discountPrct').hide();
		$('.discount').hide();
		$('.fTotal').hide();
		$('.basic-session').hide();
		$('.detail-session').hide();
		$('.pumpInfo-session').hide();
		hide("accessoryType","select");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
		$('#pumpTotal')[0].value = 0;
		$('#accessoryTotal')[0].value = 0;
		$('#sparePartTotal')[0].value = 0;	
	}

}
function showDetail(thisVal){
	if (thisVal.value == 'no') {
		// Route 2 API
		$('.basic-session').show();
		$('.detail-session').show();
		$('.pumpInfo-session').show();

		hide("series","select");
		hide("shaftSpeed","select");
		hide("size","select");
		for(let i of $("#basicSession :input")){
			notRequire([i.id],"id");
		}
		for(let i of $("#pumpInfoSession :input")){
			require([i.id],"id");
		}
		for(let i of $("#detailSession :input")){
			require([i.id],"id");
		}
		require(["pumpType"],"id");
	} else if(thisVal.value == 'yes') {
		// Route 1 No API
		$('.basic-session').show();
		$('.detail-session').hide();
		$('.pumpInfo-session').show();
		
		show("series","select");
		show("shaftSpeed","select");
		show("size","select");
		for(let i of $("#basicSession :input")){
			require([i.id],"id");
		}
		for(let i of $("#pumpInfoSession :input")){
			require([i.id],"id");
		}
		for(let i of $("#detailSession :input")){
			notRequire([i.id],"id");
		}
	}
}
function showDetailElse(){
	for(let i of document.getElementsByName("optradio")){
		i.checked = false;
	}
	for(let i of $("#basicSession :input")){
		notRequire([i.id],"id");
	}
	for(let i of $("#pumpInfoSession :input")){
		notRequire([i.id],"id");
	}
	for(let i of $("#detailSession :input")){
		notRequire([i.id],"id");
	}
}

// Hide and Show - end