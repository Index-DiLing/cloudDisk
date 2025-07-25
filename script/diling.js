
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
    var per = false;
    const url = "http://127.0.0.1:8086"
    $(".search_input").keydown(
        function(event){
            if(event.which===13){
                fetch(url+"/file/list",
                    {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            key: $(".key_input").val(),
                            name: $(".search_input").val()
                        })
                    }
                )
            }
        }
    );

    $(".file_download_button").click(function(){
        fetch(url+"/file/registerSingleUseKey",
            {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: $(this).children(".file_id").text(),
                    key: $(".key_input").val()
                })
            }
        ).then(data=>{
            fetch(url+"/file/download",
                {
                    method:'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:data.text()
                });
        });
    });

    $(".file_permission_input").click(function(){
        if($(this).children("img")[0].style.display === "none"){
            $(this).children("img")[0].style.display = "block";
            per = true;
        }else{
            $(this).children("img")[0].style.display = "none";
            per = false;
        }
    });

    $(".close_button").click(function(){
        $(".upload_form").css("animation","fadeOut 0.5s ease 0s");
        setTimeout(function(){
            $(".upload_form").hide();
            $(".upload_form_label").children("img").attr("src","/svg/submit.svg");
            $("submit-form-file")[0].files = 0;
        },400);
    });
    $(".upload_guide_button").click(function(){
        $(".upload_form").css("animation","fadeIn 0.5s ease 0s").show();
    });

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
        ).then(response => response.json())
            .then(data => {
                //这里需要处理一下
            }).catch(error => {
            console.log("上传失败"+error);
        });
    });
    $(".help_guide_button").on("click",function(){
        const form = new FormData();
        form.append("key","7fffffffeeeeeee0");
        form.append("id",1);
        fetch(url+"/file/registerSingleUseKey",
            {
                method:'POST',
                body:form
            }
        )
            .then(response => response.text()).then(data => {
            console.log(data);
            var a = document.createElement("a");
            a.href = url+"/file/download?singleUseKey="+data;
            a.click();
        });
    });
});