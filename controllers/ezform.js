 
var fs = require("./fs.js");
var ezf = module.exports = {
   
    load:(ezf_id="", selector)=>{
        $(`#${selector}`).html('');
        let url = "https://www.thaicarecloud.org/api/v1/desktop/get-ezform";
        $.ajax({
            url:url,
            type:"GET",
            data:{
                nut_token:"549968af6006a2fe6c016bf9070b4899",
                ezf_id:ezf_id,
            },
            dataType:"JSON",
            success:function(data){
                 fs.writer(data.ezform.ezf_id,JSON.stringify(data));
                 ezf.genform(selector,data.ezform.ezf_name,data.ezform.ezf_id,data);
                console.log(data);
               // console.log(data.ezfields);  //ezfields  ,  ezchoices ,  ezform
                
              // $("#ezform-button").html(ezf.ezf_button());
            },error: function (data) {
                $.ajax({
                    url:`./assets/db/${ezf_id}.json`,
                    dataType:"JSON",
                    success:function(data){
                        ezf.genform(selector,data.ezform.ezf_name,data.ezform.ezf_id,data);
                    }
                })
            },
        });
    },
    genform:(selector="", title="",ezf_id="", data)=>{
        $("#ezf-title").html(title+"<hr>");
        $(".frm-ezforms").attr("id", ezf_id);
        $.each(data.ezfields, (k, v) => {
            $(`#${selector}`).append(ezf.ezf_field(v));
            //  $('.datepicker').datepicker({
            //     format: 'yyyy/mm/dd',
            //         todayBtn: true,
            //         language: 'th',             //เปลี่ยน label ต่างของ ปฏิทิน ให้เป็น ภาษาไทย   (ต้องใช้ไฟล์ bootstrap-datepicker.th.min.js นี้ด้วย)
            //         thaiyear: true              //Set เป็นปี พ.ศ.
            //     }).datepicker("setDate", "0");  //กำหนดเป็นวันปัจุบัน
        });
    },
    error:(message)=>{
        return `<div class="alert alert-danger alert-dismissible" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <strong>คำเตือน</strong> ${message}</div>`;
    },
    ezf_field:(ezf_field)=>{
         if(ezf_field.ezf_field_type == 1){
            return `
            <div id="${ezf_field.ezf_field_id}">
                <label>${ezf_field.ezf_field_label}</label>
                <input type='text' id='${ezf_field.ezf_field_name}' name='${ezf_field.ezf_field_name}' class='form-control'>
            </div>
            `;
         }
         else if(ezf_field.ezf_field_type == 7){
            return `
            <div id="${ezf_field.ezf_field_id}">
                <label>${ezf_field.ezf_field_label}</label>
                <div class="input-group date" data-provide="datepicker">
                    <input type="text" class="form-control datepicker" id='${ezf_field.ezf_field_name}' name='${ezf_field.ezf_field_name}'>
                    <div class="input-group-addon">
                        <span class="glyphicon glyphicon-th"></span>
                    </div>
                </div>
                
            </div>
            `;
         }
        else if(ezf_field.ezf_field_type == 19){
             return `
            <div id="${ezf_field.ezf_field_id}">
                <label>${ezf_field.ezf_field_label}</label>
                <input type='checkbox' id='${ezf_field.ezf_field_name}' name='${ezf_field.ezf_field_name}' class='form-control'>
            </div>
            `;
        }   
    },
    fields:(frm)=>{
        let f = $(`#${frm}`).serializeArray();
        let data = {};
        $.each(f, function (k, v) {
          data[v.name] = v.value;
        });
        return data;
    },
    save:(ezf_id)=>{
        let frm = $(ezf_id).attr('id');  
        let data = ezf.fields(frm);
        let sql=`CREATE TABLE IF NOT EXISTS tbdata_${frm} (ezf_id TEXT PRIMARY KEY ,`; 
        //let values = '{';

        //id auto
        var d = new Date();
        var n = d.getTime();
        let values =  '"ezf_id":"'+n+'",'; //"ezf_id:'"+n+"' , ";

        $.each(data,(k,v)=>{
            sql += `${k} Text ,`
            values += '"'+k+'":"'+v+'",';//k+":"+v+" ,";
        });
        sql = sql.substring(0, sql.length-2);
        values = values.substring(0, values.length-2);  
        sql += " )";
        values += '"';
         //values += '"}'+'\'';
        
        ezf.sqlite(sql, `tbdata_${frm}`,values);
        return false;
    },
    sqlite:(sql,table='',values='')=>{
        let sq = require("./sqlite.js");
 
         var dddd = JSON.parse(JSON.stringify('{'+values+'}'));
         var val = JSON.parse(dddd);
        
         
        if(sq.careateTable(sql) || !sq.careateTable(sql)){
           
            if(sq.create(table,val)){
                sq.test(table);
            }
        }
        
    }    
             
}