 
var c = module.exports = {
    content:(url="", selector="")=>{
        return c.routings(url,selector);
    },
    routings:(url="", selector="")=>{
        $.ajax({
                url:url,
                success:function(data){
                    $(`#${selector}`).html(data);
                }
        });
    }
}
 //routing("./views/layouts/navbar.html", "navbar");
 

 