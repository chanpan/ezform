
module.exports = routing=(url="", selector="")=>{
    $.ajax({
        url:url,
        success:function(data){
            $(`#${selector}`).html(data);
        }
    });
}
 //routing("./views/layouts/navbar.html", "navbar");
 routing("./views/ezform/index.html", "root");
 