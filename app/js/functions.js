// Refer script.js global varibales for any unkown variables
var selectData = {};
var apiSpecs = "";
// General Functions - start
var getSuffix = (suf,str) => str.substring(str.indexOf(suf)+1,str.length);
var getPrefix = (prf,str) => str.substring(0,str.indexOf(prf));
var hide = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).hide();
}
var show = (id,fieldType) => {
    $('label[for='+id+'], '+fieldType+'#'+id).show();
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
//Add Row Function - start
var appendTabRow = (tabBody,rowIndex) =>{
	var subTabBody = document.getElementById(tabBody);
	var firstcloneRow = subTabBody.firstElementChild.cloneNode(true);
	var rowText = firstcloneRow.innerHTML.replaceAll("###",rowIndex);
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
    let rowIndex = thisVal.getAttribute("index");
	let pumpSpec = document.getElementById(firstLtr+"_specs_"+rowVal);
	let pumpSelectData = document.getElementById(firstLtr+"_selectData_"+rowVal);
	if(pumpSpec && pumpSelectData){
		let finalTxt = "Datasheet ref nr: "+ crmProductSingle.TDS_Ref + " ( For operating limits and warranty conditions check the datasheet )";
		pumpSpec.value = JSON.stringify(apiSpecs +finalTxt);
		pumpSelectData.value = JSON.stringify(selectData);
	}
	let quantity = document.getElementById(firstLtr+"_quantity_"+rowIndex);
	let unitPrice = document.getElementById(firstLtr+"_unitPrice_"+rowIndex);
	let description = document.getElementById(firstLtr+"_description_"+rowIndex);
	let amount = document.getElementById(firstLtr+"_amount_"+rowIndex);
	let quantityVal = quantity.value || 0;
	let unitPriceVal = crmProductSingle.Unit_Price;
	let descriptionVal = crmProductSingle.Description || "";
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
var getRecords = async entity =>{
	var response = await ZOHO.CRM.API.getAllRecords({Entity:entity});
	return response.data;
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
// Date fields setup - start
// $("#quoteDate").datepicker({
// 	autoclose: true,
// 	todayHighlight: true
// }).datepicker('update', new Date());
// Date fields setup - end

//Hide and Show - start
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
// $('#productType').on('change', function () {
	// document.getElementById("productType").onchange = function () {
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
		// notRequire(["accessoryType"],"id");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");	
		// appendTabRow("pumpBody",1);
		// appendTabRow("accessoryBody",1);
		// appendTabRow("sparePartBody",1);		
		// require(["pump_1","accessory_1","sparePart_1","p_quantity_1","a_quantity_1","s_quantity_1"],"id");
	} else if (this.value === "Accessory") {
		show("accessoryType","select");
		// require(["accessoryType"],"id");
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
		showDetailElse();
		// appendTabRow("accessoryBody",1);
		// notRequire(["pump_1","sparePart_1","p_quantity_1","s_quantity_1"],"id");
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
		// notRequire(["accessoryType"],"id");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
		showDetailElse();
		// appendTabRow("sparePartBody",1);
		// require(["sparePart_1","a_sparePart_1"],"id");
		// notRequire(["pump_1","accessory_1","p_quantity_1","a_quantity_1"],"id");
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
		// notRequire(["accessoryType"],"id");
		clearTabRow("pumpBody");
		clearTabRow("accessoryBody");
		clearTabRow("sparePartBody");
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
		// require(["series","shaftSpeed","size"],"id");
		// require(["pumpType","applicationType","specificGravity","flowRate","flowRateUnit","head","headUnit","temperature","temperatureUnit","shaftSpeed_API","shaftSpeedUnit","shr","shrUnit"],"id");
		// require(["casingMoc","shaftSealing","impellerMoc","sealingGlandFlushing","lubrication","flangeDrilling"],"id");
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
		// notRequire(["applicationType","specificGravity","flowRate","flowRateUnit","head","headUnit","temperature","temperatureUnit","shaftSpeed_API","shaftSpeedUnit","shr","shrUnit"],"id");
		// require(["pumpType","series","shaftSpeed","size","casingMoc","shaftSealing","impellerMoc","sealingGlandFlushing","lubrication","flangeDrilling"],"id");
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
	// notRequire(["series","shaftSpeed","size"],"id");
	// notRequire(["pumpType","applicationType","specificGravity","flowRate","flowRateUnit","head","headUnit","temperature","temperatureUnit","shaftSpeed_API","shaftSpeedUnit","shr","shrUnit"],"id");
	// notRequire(["casingMoc","shaftSealing","impellerMoc","sealingGlandFlushing","lubrication","flangeDrilling"],"id");
}

// Hide and Show - end
// //Currency Format - start
// function currencyFormat(){
// $("input[data-type='currency']").on({
// 	keyup: function () {
// 		formatCurrency($(this));
// 	},
// 	blur: function () {
// 		formatCurrency($(this), "blur");
// 	}
// });
// }
// currencyFormat();
// function formatNumber(n) {
// 	// format number 1000000 to 1,234,567
// 	return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// }
// function formatCurrency(input, blur) {
// 	// appends $ to value, validates decimal side
// 	// and puts cursor back in right position.

// 	// get input value
// 	var input_val = input.val();

// 	// don't validate empty input
// 	if (input_val === "") {
// 		return;
// 	}

// 	// original length
// 	var original_len = input_val.length;

// 	// initial caret position 
// 	var caret_pos = input.prop("selectionStart");

// 	// check for decimal
// 	if (input_val.indexOf(".") >= 0) {

// 		// get position of first decimal
// 		// this prevents multiple decimals from
// 		// being entered
// 		var decimal_pos = input_val.indexOf(".");

// 		// split number by decimal point
// 		var left_side = input_val.substring(0, decimal_pos);
// 		var right_side = input_val.substring(decimal_pos);

// 		// add commas to left side of number
// 		left_side = formatNumber(left_side);

// 		// validate right side
// 		right_side = formatNumber(right_side);

// 		// On blur make sure 2 numbers after decimal
// 		if (blur === "blur") {
// 			right_side += "00";
// 		}

// 		// Limit decimal to only 2 digits
// 		right_side = right_side.substring(0, 2);

// 		// join number by .
// 		input_val = left_side + "." + right_side;

// 	} else {
// 		input_val = formatNumber(input_val);
// 		input_val = input_val;

// 		// final formatting
// 		if (blur === "blur") {
// 			input_val += ".00";
// 		}
// 	}

// 	// send updated string to input
// 	input.val(input_val);

// 	// put caret back in the right position
// 	var updated_len = input_val.length;
// 	caret_pos = updated_len - original_len + caret_pos;
// 	input[0].setSelectionRange(caret_pos, caret_pos);
// }
// //Currency Format - end