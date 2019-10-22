let userAvatar = null;
let update = false;
$(function(){
    $(document).on('click','.changeAvatarUser',function(){
        $('#avatarUser').trigger('click');
    })
    $(document).on('change','#avatarUser',function(){
        let fileData = $(this).prop('files')[0];
        let math = ['image/png','image/jpg','image/jpeg'];
        if($.inArray(fileData.type,math) === -1){
            toastr.warning('Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG');
            $(this).val(null);
            return false;
        }
        if(typeof (FileReader) != "undefined"){
            let fileReader = new FileReader();
            fileReader.onload = function(element){
                let img = $('<img>',{
                    "src": element.target.result,
                    "class" : "changeAvatarUser styleAvatarEditUser",
                    "id" : "user-modal-avatar",
                    "width" : "150",
                    "height" : "150",
                    "alt" : "avatar"
                });
                $('.divAvatarUser').html(img);
            };
            fileReader.readAsDataURL(fileData);
            let formData =  new FormData();
            formData.append('avatar',fileData);
            userAvatar = formData;
            update = true;
        }else{
            toastr.warning('Trình duyệt của bạn không hỗ trợ FileReader',7);
        }
    })
    $('.btnSutmitEditUser').on('click',function(e){
        e.preventDefault();
        if(!($('#checkbox')[0].checked)){
            toastr.warning('Vui lòng tích chọn đồng ý điều khoản trước khi thay đổi thông tin');
            return;
        }
        callUpdateInfoUser();
        if(userAvatar !== null){
            callUpdateAvatar();
        }
        if(update = true){
            toastr.success('Cập nhật thông tin thành công',"",{timeOut:5000});
            update = false;
        }
        $('#checkbox')[0].checked = false;
    })
})
function callUpdateAvatar(){
    $.ajax({
        url : '/update-avatar',
        type : 'post',
        cache : false,
        contentType : false,
        processData : false,
        data : userAvatar,
        success:function(result){
            $('#imgLeftSideBar').attr('src',result.imageSrc);
            $('#avatarUser').val(null);
            userAvatar = null;
            update = true;
        },
        error:function(error){
            console.log(error)
        }
    });
}
function callUpdateInfoUser(){
    let username = $('#name').val();
    let address = $('#address').val();
    let phone = $('#phone').val();
    let gender = "";
    let genderTemp = document.getElementsByClassName('gender');
    for(let i = 0 ; i < genderTemp.length ; i++){
        if(genderTemp[i].checked == true ){
            gender = genderTemp[i].value;
        }
    }
    if(username == ""){
        toastr.warning('Username không được để trống')
        .then(function(){
            $('#name').focus();
        });
        return;
    }else if(address == ""){
        toastr.warning('Address không được để trống');
        $('#address').focus();
        return;
    }else if(phone == ""){
        toastr.warning('Phone không được để trống');
        $('#phone').focus();
        return;
    }else{
        $.ajax({
            url : '/udpate-info-user',
            type : 'POST',
            data : {username : username , address : address , phone : phone , gender : gender},
            success : function ( data ){
                update = true;
            },  
            error : function ( error ){
                console.log(error)
            }

        })
    }
    
}