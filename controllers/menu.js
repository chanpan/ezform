var m = module.exports = {
    menu:(url="", selector="")=>{
        return m.routings(url,selector);
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