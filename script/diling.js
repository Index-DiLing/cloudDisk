
const fileIcon={
    "zip":"zip",
    "7z":"7z",
    "mp4":"video",
    "mp3":"audio",
    "png":"image",
    "pptx":"powerpoint",
    "xlsx":"excel",
    "docx":"word",
    "apk":"apk",
    "exe":"exe",
    "txt":"txt",
    "cpp":"code",
    "java":"code",
    "js":"code",
    "html":"code",
    "css":"code",
    "py":"code"
};
$(document).ready(function(){
    let per = false;
    const url = "http://127.0.0.1:8086"

    $(".key_input").on("keydown", function(e) {
        if (e.key==='Enter'){

            fetch(url+"/file/list"+`?key=${$(this).val()}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    for (const key in data){
                        const viewer = data[key];
                        const file = $( "<div class=\"file\">" +
                            "            <div class=\"file_icon\"></div>" +
                            "            <div class=\"file_name\">"+viewer.name+"</div>\n" +
                            "            <div class=\"file_id\">"+viewer.id +"</div>\n" +
                            "            <div class=\"file_size\">"+viewer.size+"MB</div>\n" +
                            "            <div class=\"file_time\">"+viewer.time+"</div>\n" +
                            "            <div class=\"file_uploader\">"+viewer.uploaderName+"</div>\n" +
                            "            <div class=\"file_counts\">"+viewer.counts+"</div>\n" +
                            "            <div class=\"file_download_button\">下载</div>\n" +
                            "            <div class=\"file_label_button\"></div>\n" +
                            "            <div class=\"file_delete_button\">删除</div>\n" +
                            "            </div>");
                        $(".file_container").append(file);
                    }
                })
                .catch(err => console.log(err));

        }
    });


    $(".search_input").keydown(
        function(event){
            if(event.which===13){
                //TODO
            }
        }
    );
    //下载
    $(".file_container").on("click",".file>.file_download_button",function (){
        console.log("AAA")
        const form = new FormData();
        form.append("key",$(".key_input").val());
        form.append("id",$(this).siblings(".file_id").text());
        fetch(url+"/file/registerSingleUseKey",
            {
                method:'POST',
                body:form
            }
        ).then(response => response.text()).then(data => {
            console.log(data);
            const a = document.createElement("a");
            a.href = url+"/file/download?singleUseKey="+data;
            a.click();
        });
    });
    //对勾
    $(".file_permission_input").click(function(){
        if($(this).children("img")[0].style.display === "none"){
            $(this).children("img")[0].style.display = "block";
            per = true;
        }else{
            $(this).children("img")[0].style.display = "none";
            per = false;
        }
    });
    //关闭与打开
    $(".close_button").click(function(){
        $(".upload_form").css("animation","fadeOut 0.5s ease 0s");
        setTimeout(function(){
            $(".upload_form").hide();
            $(".upload_form_label").children("img").attr("src","/svg/submit.svg");
            $(".text_file_info").text("")
            $("note").text("");
            $("submit-form-file").val(0);
        },400);
    });
    $(".upload_guide_button").click(function(){
        $(".upload_form").css("animation","fadeIn 0.5s ease 0s").show();
    });
    //表单
    $("#submit-form-file").on("change",function(){
        const file = $(this)[0].files[0];
        $("#name.text_file_info").text("文件名: "+file.name);
        $("#size.text_file_info").text("文件大小: "+file.size/1024/1024+"MB");
        const extension = file.name.split(".").pop();
        const icon = extension in fileIcon? fileIcon[extension] : "file";
        $(".upload_form_label").children("img").attr("src","/svg/file_icon/"+icon+".svg");
    });
    $(".file_upload_button").on("click",function(){
        const file = $("#submit-form-file")[0].files[0];
        const key = $(".key_input").val();
        const note = $("#note").val();
        const permission = per;
        const formData = new FormData();
        formData.append("file",file);
        formData.append("key",key);
        formData.append("note",note);
        formData.append("permission",permission);
        fetch(url+"/file/upload",
            {
                method:'POST',
                body: formData
            }
        ).then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
            console.log("上传失败"+error);
        });
    });
    $(".help_guide_button").on("click",function(){

    });

});