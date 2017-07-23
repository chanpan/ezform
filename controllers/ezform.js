var fs = require('fs');
var ezf = module.exports = {
   
    load:(ezf_id="", selector)=>{
        let url = "http://dpmcloud.dev/api/v1/desktop/get-ezform";
        $.ajax({
            url:url,
            type:"GET",
            data:{
                nut_token:"549968af6006a2fe6c016bf9070b4899",
                ezf_id:ezf_id,
            },
            dataType:"JSON",
            success:function(data){
               // console.log(data.ezfields);  //ezfields  ,  ezchoices ,  ezform
                $("#ezf-title").html(data.ezform.ezf_name+"<hr>");
                    $(".frm-ezforms").attr("id", data.ezform.ezf_id);
                    $.each(data.ezfields,(k,v)=>{ 
                        $(`#${selector}`).append(ezf.ezf_field(v));
                    });
              // $("#ezform-button").html(ezf.ezf_button());
            }
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
        
         console.log(val);
        if(sq.careateTable(sql) || !sq.careateTable(sql)){
           
            if(sq.create(table,val)){
                sq.test(table);
            }
        }
        
    }    
             
}