var jpdbBaseUrl = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studDBName = 'SCHOOL-DB';
var studRelationName = 'STUDENT-TABLE';
var connToken = "90933183|-31949319671245870|90951018"

$('#rollNo').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no)
}

function getStudRollAsJson(){
    var rollNo = $('#rollNo').val();
    var jsonStr =  {
        rollNo:rollNo
    };
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#studName').val(record.name);
    $('#studClass').val(record.class);
    $('#studBirth').val(record.birth);
    $('#studAddress').val(record.address);
    $('#studEnrol').val(record.enrol);

}
function resetData(){
    $('#rollNo').val("");
    $('#studName').val("");
    $('#studClass').val("");
    $('#studBirth').val("");
    $('#studAddress').val("");
    $('#studEnrol').val("");
    $('#rollNo').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#rollNo').focus();

}

function validateData(){
    var rollNo, studName, studClass, studBirth, studAddress, studEnrol;
    rollNo = $('#rollNo').val();
    studName = $('#studName').val();
    studClass = $('#studClass').val();
    studBirth = $('#studBirth').val();
    studAddress = $('#studAddress').val();
    studEnrol = $('#studEnrol').val();

    if(rollNo=== ''){
        alert("Student Roll No missing");
        $('#rollNo').focus()
        return "";
    }
    if(studName=== ''){
        alert("Student Name missing");
        $('#studName').focus()
        return "";
    }
    if(studClass=== ''){
        alert("Student Class missing");
        $('#studClass').focus()
        return "";
    }
    if(studBirth=== ''){
        alert("Student Date of Birth missing");
        $('#studBirth').focus()
        return "";
    }
    if(studAddress=== ''){
        alert("Student Address missing");
        $('#studAddress').focus()
        return "";
    }
    if(studEnrol=== ''){
        alert("Student Enrollment Date missing");
        $('#studEnrol').focus()
        return "";
    }
    var jsonStrObj = {
        rollNo:rollNo,
        name:studName,
        class:studClass,
        birth:studBirth,
        address:studAddress,
        enrol: studEnrol
    };
    return JSON.stringify(jsonStrObj)

}
function getStud(){
    var studRollJsonObj = getStudRollAsJson();
    var getRequest = createGET_BY_KEYRequest(connToken,studDBName,studRelationName,studRollJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseUrl,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status=== 400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#rollNo').focus();
    }
    else if (resJsonObj.status === 200){
        $('#rollNo').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#studName').focus()
    }
    console.log("It works")

}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return '';
    }
    var putRequest = createPUTRequest(connToken , jsonStrObj,studDBName, studRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseUrl,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetData();
    $('#rollNo').focus();
}
function changeData(){
    $('#change').prop('disabled',true);
    jsonChg = validateData()
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,studDBName,studRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseUrl,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetData();
    $('#rollNo').focus();
}