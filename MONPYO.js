var selSec = '案件管理台帳'; // 選択中業務(初期値)
var qNo = '';                // 受付No引継ぎ
const tSchema = 'test';      // 環境に合わせて変える
const tDatSrc = 'Provider=MSDASQL; Data Source=Connector_MariaDB'; // 環境に合わせて変える
var itemName = ['受付No','受付日時','受付所属','受付者','受付手段','受付状況','部門コード',
                '所属','発信者','TEL','要件区分','業務名','概要','問合内容','添付資料有無',
                '添付資料名','回避策有無','回避策','問合せ票送付日','回答内容','回答者所属',
                '回答者','承認者','回答予定日','回答日時','回答日数','回答期限','完了日',
                '回答添付資料','別件で回答済み','回答書送付','追跡予定日','追跡作業日',
                '追跡検証','上申区分','上申確認','備考','承認日時','同日ID'];  // 項目見出し
var trPoint = [6,12,13,14,16,18,19,20,23,28,33,36,37];                         // 改行項目番号
var inpSize = [25,16,10,15,15,8,5,15,15,25,8,30,177,175,3,100,3,150,10,175,15,15,15,10,16,5,10,10,25,25,10,10,10,5,6,5,176,16,5];
var mustItem = ['questionDtTm','questionBelonging','questionStaff','belonging','operationName','requirement'];  // 必須入力項目ID
var maxLeng = [19,,25,25,6,6,4,50,25,25,6,50,255,999,1,255,1,255,,999,50,25,25,,,11,,,255,128,,,,2,5,2,999,,11];
function go_ReLoad() {
  selSec = $(selGYM).val();
  setList();
}
// 一覧画面
function setList() {
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
  var mySql = "SELECT section FROM MONPYO GROUP BY section";
  cn.Open(tDatSrc);
  try {
    rs.Open(mySql, cn);
  } catch (e) {
    cn.Close();
    alert('対象テーブル検索不能' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    return;
  }
  var strDoc = '';
  var hitFlg = 0;
  strDoc += '<td><select id="selGYM" onchange="go_ReLoad()" align="left">';
  while (!rs.EOF){
    if (rs(0).value == selSec) {
      strDoc += '<option value="' + rs(0).value + '" selected>' + rs(0).value + '</option>';
      hitFlg = 1;
    } else {
      strDoc += '<option value="' + rs(0).value + '">' + rs(0).value + '</option>';
    }
    rs.MoveNext();
  }
  if (hitFlg == 0) { selSec = '案件管理台帳'; }    // 業務削除されたので初期値に戻す
  strDoc += '</select><a href="#" onClick="insPage()">新規追加</a></td>';
  rs.Close();
  $('#idx01').replaceWith('<div id="idx01">' + strDoc + '</div>');
  var mySql = "SELECT questionNo,operationName,belonging,DATE_FORMAT(expectedDt,'%Y/%m/%d'),questionSituation FROM MONPYO WHERE section ='"
            + selSec + "' ORDER BY questionDtTm DESC";
  try {
    rs.Open(mySql, cn);
  } catch (e) {
    cn.Close();
    alert('対象テーブル検索不能' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    return;
  }
  if (rs.EOF){
    rs.Close();
    cn.Close();
    rs = null;
    cn = null;
    clrScr();
    $('#tabs').tabs( { active: 1} );
    return;
  }
  var strDoc = '';
  while (!rs.EOF){
    strDoc += '<tr><td style="width:175px;" align="CENTER"><a href="#" onClick=updPage("' + rs(0).value + '")>' + rs(0).value + '</a></td>';
    strDoc += '<td width="425">' + rs(1).value + '</td>';
    strDoc += '<td width="120">' + rs(2).value + '</td>';
    strDoc += '<td width="90" align="CENTER">' + rs(3).value + '</td>';
    if (rs(4).value == '受付中') {
      strDoc += '<td width="60" align="CENTER"><font color="red">' + rs(4).value + '</font></td></tr>';
    } else if (rs(4).value == '継続中') {
      strDoc += '<td width="60" align="CENTER"><font color="blue">' + rs(4).value + '</font></td></tr>';
    } else {
      strDoc += '<td width="60" align="CENTER">' + rs(4).value + '</td></tr>';
    }
    rs.MoveNext();
  }
  $('#lst01').replaceWith('<tbody id="lst01">' + strDoc + '</tbody>');
  if (hitFlg == 0) { $('#selGYM').val('案件管理台帳'); }
  rs.Close();
  cn.Close();
  rs = null;
  cn = null;
  strDoc = '';
  $('#tabs').tabs( { active: 0} );
  $('#li02').css('visibility','hidden');
}
// 編集画面
function updPage(myNo) {
  qNo = myNo;
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
  var mySql = "SELECT * FROM MONPYO WHERE questionNo = '" + qNo + "'";
  cn.Open(tDatSrc);
  try {
    rs.Open(mySql, cn);
  } catch (e) {
    cn.Close();
    document.write('対象レコード検索不能' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    alert('対象レコード検索不能');
    return;
  }
  var strDoc = '';
  if (!rs.EOF){
    strDoc += '<tr><td><table><tr><td bgcolor="#CCCCFF">' + itemName[0] + '</td><td>' + rs(0).Value + '</td>';
    for ( var i = 1; i < rs.Fields.Count; i++ ) {
      if (trPoint.indexOf(i) >= 0) {
        strDoc += '<tr><td><table><tr>';
      }
      strDoc += '<td bgcolor="#CCCCFF">' + itemName[i] + '</td>';
      if (rs(i).Type == 133) {
        strDoc += '<td style="border-style: none;"><input type="date" size="10" id="' + rs(i).Name + '" value="';
        if (rs(i).Value !== null) {
          strDoc += formatDate(rs(i).Value,'YYYY-MM-DD');
        }
        strDoc += '"></td>';
      } else if (rs(i).Type == 135) {
        strDoc += '<td style="border-style: none;"><input type="datetime" size="16" id="' + rs(i).Name + '" value="';
        if (rs(i).Value !== null) {
          strDoc += formatDate(rs(i).Value,'YYYY-MM-DD hh:mm');
        }
        strDoc += '"></td>';
      } else if (rs(i).Type == 203) {
        strDoc += '<td style="border-style: none;"><textarea rows="3" cols="' + inpSize[i]
                + '" id="' + rs(i).Name + '">' + rs(i).Value + '</textarea></td>';
      } else if (rs(i).Type == 3) {
        strDoc += '<td style="border-style: none;"><input type="number" size="' + inpSize[i]
                + '" id="' + rs(i).Name + '" value="' + rs(i).Value + '"></td>';
      } else if (rs(i).Type == 16) {
        strDoc += '<td style="border-style: none; padding: 0px 20px;}"><input type="checkbox" id="'
                + rs(i).Name + '" value=1 title="有"';
        if (rs(i).Value === 1) { strDoc += ' checked="checked"'; }
        strDoc += '></td>';
      } else {
        strDoc += '<td style="border-style: none;"><input type="text" size="' + inpSize[i] + '" id="' + rs(i).Name + '" value="';
        if (rs(i).Value !== null) { strDoc += rs(i).Value; }
        strDoc += '" maxlength="' + maxLeng[i] + '"></td>';
      }
      if (trPoint.indexOf(i + 1) >= 0) {
        strDoc += '</tr></table></td></tr>';
      }
    }
  }
  $('#lst02').replaceWith('<tbody id="lst02">' + strDoc + '</tbody>');
  rs.Close();
  cn.Close();
  rs = null;
  cn = null;
  $.datetimepicker.setLocale('ja');
  $("#sendDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#expectedDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#termDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#settlementDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#responseDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#followUpPlanDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#followUpDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#questionDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $("#answerDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $("#approvalDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $('#insert').hide();
  $('#update').show();
  $('#delete').show();
  $('#tabs').tabs( { active: 1} );
  $('#li02').css('visibility','visible');
}
// レコード新規画面
function insPage() {
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
// var mySql = "SELECT * FROM MONPYO LIMIT 1";
  var mySql = "SELECT COLUMN_COMMENT,COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH"
            + " FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = '" + tSchema
            + "' AND TABLE_NAME = 'monpyo' ORDER BY ORDINAL_POSITION";
  cn.Open(tDatSrc);
  try {
    rs.Open(mySql, cn);
  } catch (e) {
    cn.Close();
    document.write('対象レコード検索不能' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    alert('対象レコード検索不能');
    return;
  }
  var strDoc = '';
  var i = 0;
  while (!rs.EOF){
    // 改行
    if (trPoint.indexOf(i) >= 0 || i == 0) {
      strDoc += '<tr><td><table><tr>';
    }
    strDoc += '<td bgcolor="#CCFFFF">' + rs(0).Value + '</td>';
    if (rs(2).Value == 'date') {
      strDoc += '<td style="border-style: none;"><input type="date" size="10" id="'
             + rs(1).Value + '" value=""></td>';
    } else if (rs(2).Value == 'datetime') {
      strDoc += '<td style="border-style: none;"><input type="datetime" size="16" id="'
             + rs(1).Value + '" value=""></td>';
    } else if (rs(2).Value == 'text') {
      strDoc += '<td style="border-style: none;"><textarea rows="3" cols="' + inpSize[i] + '" id="'
             + rs(1).Value + '"></textarea></td>';
    } else if (rs(2).Value == 'int') {
      strDoc += '<td style="border-style: none;"><input type="number" size="' + inpSize[i] + '" id="'
             + rs(1).Value + '" value=""></td>';
    } else if (rs(2).Value == 'tinyint') {
      strDoc += '<td style="border-style: none; padding: 0px 20px;}"><input type="checkbox" id="'
             + rs(1).Value + '" value=1></td>';
    } else {
      strDoc += '<td style="border-style: none;"><input type="text" size="' + inpSize[i] + '" id="'
             + rs(1).Value + '" value="" maxlength="' + rs(3).Value + '"></td>';
    }
    // 行終端
    if (trPoint.indexOf(i + 1) >= 0) {
      strDoc += '</tr></table></td></tr>';
    }
    i += 1;
    rs.MoveNext();
  }
  $('#lst02').replaceWith('<tbody id="lst02">' + strDoc + '</tbody>');
  rs.Close();
  cn.Close();
  rs = null;
  cn = null;
  $("#sendDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#expectedDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#termDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#settlementDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#responseDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#followUpPlanDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#followUpDt").datetimepicker({ timepicker:false,format:"Y-m-d" });
  $("#questionDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $("#answerDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $("#approvalDtTm").datetimepicker({ format:"Y-m-d H:i", step:10 });
  $('#insert').show();
  $('#update').hide();
  $('#delete').hide();
  $('#tabs').tabs( { active: 1} );
  $('#li02').css('visibility','visible');
}
// 日付時刻のフォーマット
function formatDate(date, format) {
  var day = new Date(date);
  format = format.replace(/YYYY/, day.getFullYear());
  format = format.replace(/MM/, ('0' + (day.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/, ('0' + day.getDate()).slice(-2));
  format = format.replace(/hh/, ('0' + day.getHours()).slice(-2));
  format = format.replace(/mm/, ('0' + day.getMinutes()).slice(-2));
  format = format.replace(/ss/, ('0' + day.getSeconds()).slice(-2));
  return format;
}
// 更新処理
function updRec() {
  var mySql = "";
  var errFlg = 0;
  $('#lst02 input').each(function() {
    if (mySql == "") { 
      mySql += "UPDATE MONPYO SET ";
    } else {
      mySql += ",";
    }
    if ($(this).val() == '') {
      if (mustItem.indexOf($(this).attr('id')) >= 0) {
        atError ( $(this).attr('id'), '必須項目が入力されていません！');
        errFlg = 1;
        return false;
      }
      mySql += $(this).attr('id') + " = null";
    } else if ($(this).attr('type') == "number") {
      if ( isNaN($(this).val()) ) { 
        atError ( $(this).attr('id'), '数値を入力してください！');
        errFlg = 1;
        return false;
      }
      mySql += $(this).attr('id') + " = " + $(this).val();
    } else if ($(this).attr('type') == "checkbox") {
      if ($(this).prop("checked")) {
        mySql += $(this).attr('id') + ' = 1';
      } else {
        mySql += $(this).attr('id') + ' = 0';
      }
    } else if ($(this).attr('type') == "date") {
      if ( !isDate ( $(this).val()) ) {
        atError ( $(this).attr('id'), '日付形式(YYYY-MM-DD)で入力してください！');
        errFlg = 1;
        return false;
      }
      mySql += $(this).attr('id') + " = '" + $(this).val() + "'";
    } else if ($(this).attr('type') == "datetime") {
      if ( !isDateTime ( $(this).val()) ) {
        atError ( $(this).attr('id'), '日付時刻形式(YYYY-MM-DD HH:MM)で入力してください！');
        errFlg = 1;
        return false;
      }
      mySql += $(this).attr('id') + " = '" + $(this).val() + "'";
    } else {
      mySql += $(this).attr('id') + " = '" + $(this).val() + "'";
    }
  });
  $('#lst02 textarea').each(function() {
    mySql += "," + $(this).attr('id') + " = '" + $(this).val() + "'";
  });
  if (errFlg != 0) {
    alert('エラーがあります、再入力してください！');
    return;
  }
  mySql += " WHERE questionNo = '" + qNo + "'";
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
  cn.Open(tDatSrc);
  try {
    var rs = cn.Execute(mySql);
    alert('対象レコード更新完了');
  } catch (e) {
    cn.Close();
    alert('対象レコード更新失敗 ' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    return;
  }
  cn.Close();
  rs = null;
  cn = null;
  $('#li02').css('visibility','hidden');
  setList();
}
function insRec() {
  var mySql  = "";
  var mySql2 = "";
  var i = 0;
  var errFlg = 0;
  $('#lst02 input').each(function() {
    if (mySql == "") { 
      mySql  += "INSERT INTO MONPYO (";
      mySql2 += ") VALUES (";
    } else {
      mySql  += ",";
      mySql2 += ",";
    }
    mySql += $(this).attr('id');
    if ($(this).val() == '') {
      if ( i == 0 ) {
        atError ( $(this).attr('id'), 'KEY項目が入力されていません！');
        errFlg = 1;
        return false;
      }
      if (mustItem.indexOf($(this).attr('id')) >= 0) {
        atError ( $(this).attr('id'), '必須項目が入力されていません！');
        errFlg = 1;
        return false;
      }
      mySql2 += "null";
    } else if ($(this).attr('type') == "number") {
      if ( isNaN($(this).val()) ) { 
        atError ( $(this).attr('id'), '数値を入力してください！');
        errFlg = 1;
        return false;
      }
      mySql2 += $(this).val();
    } else if ($(this).attr('type') == "checkbox") {
      if ($(this).prop("checked")) {
        mySql2 += '1';
      } else {
        mySql2 += '0';
      }
    } else if ($(this).attr('type') == "date") {
      if ( !isDate ( $(this).val()) ) {
        atError ( $(this).attr('id'), '日付形式(YYYY/MM/DD)で入力してください！');
        errFlg = 1;
        return false;
      }
      mySql2 += " '" + $(this).val() + "'";
    } else if ($(this).attr('type') == "datetime") {
      if ( !isDateTime ( $(this).val()) ) {
        atError ( $(this).attr('id'), '日付時刻形式(YYYY-MM-DD HH:MM)で入力してください！');
        errFlg = 1;
        return false;
      }
      mySql2 += " '" + $(this).val() + "'";
    } else {
      mySql2 += " '" + $(this).val() + "'";
    }
    i = i + 1;
  });
  $('#lst02 textarea').each(function() {
    mySql  += "," + $(this).attr('id');
    mySql2 += ",'" + $(this).val() + "'";
  });
  if (errFlg != 0) {
    alert('エラーがあります、再入力してください！');
    return;
  }
  mySql += mySql2 + ")";
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
  cn.Open(tDatSrc);
  try {
    var rs = cn.Execute(mySql);
    alert('対象レコード登録完了');
  } catch (e) {
    cn.Close();
    if ((e.number & 0xFFFF) == '1062') {
      alert('対象レコードは、既に登録されています。');
    } else {
      alert('対象レコード登録失敗 ' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    }
    return;
  }
  cn.Close();
  rs = null;
  cn = null;
  selSec = $(section).val();
  $('#li02').css('visibility','hidden');
  setList();
}
function delRec() {
  var mySql = "DELETE FROM MONPYO WHERE questionNo = '" + qNo + "'";
  if( confirm('本当に削除しますか？')) {
  } else {
    alert('削除キャンセルしました！');
    return;
  }
  var cn = new ActiveXObject('ADODB.Connection');
  var rs = new ActiveXObject('ADODB.Recordset');
  cn.Open(tDatSrc);
  try {
    var rs = cn.Execute(mySql);
    alert('対象レコード削除完了');
  } catch (e) {
    cn.Close();
    alert('対象レコード削除失敗 ' + (e.number & 0xFFFF) + ' ' + e.message + ' ' + mySql);
    return;
  }
  cn.Close();
  rs = null;
  cn = null;
  $('#li02').css('visibility','hidden');
  setList();
}
function isDate ( strDate ) {
  if (strDate == '') return true;
  if(!strDate.match(/^\d{4}-\d{1,2}-\d{1,2}$/)){
    return false;
  } 
  var date = new Date(strDate);  
  if(date.getFullYear() !=  strDate.split('-')[0] 
    || date.getMonth() != strDate.split('-')[1] - 1
    || date.getDate() != strDate.split('-')[2]){
    return false;
  } else {
    return true;
  }
}
function isDateTime ( strDateTime ) {
  if (strDateTime == '') return true;
  if(!strDateTime.match(/^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/)){
    if(!strDateTime.match(/^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}$/)){
      return false;
    }
  }
  return true;
}
function atError ( str, msg ) {
  alert(msg);
  $('#' + str).focus();
}
