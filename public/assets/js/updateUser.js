let userAvatar = null;
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
            let imagePreview = $('.divAvatarUser');
            $('.divAvatarUser').html('');
            let fileReader = new FileReader();
            fileReader.onload = function(element){
                $('<img>',{
                    "src": element.target.result,
                    "class" : "changeAvatarUser styleAvatarEditUser",
                    "id" : "user-modal-avatar",
                    "width" : "150",
                    "height" : "150",
                    "alt" : "avatar"
                }).prependTo(imagePreview);
            };
            
            let fileData = $(this).prop('files')[0];
            // $('.nameAvatar').html(fileData.name)
            imagePreview.show();
            $('.divAvatarUser').append('<p>'+fileData.name+'</p>');
            fileReader.readAsDataURL(fileData);
            // nếu ảnh hợp lệ
            let formData =  new FormData();
            formData.append('avatar',fileData);
            
            userAvatar = formData;
        }else{
            toastr.warning('Trình duyệt của bạn không hỗ trợ FileReader',7);
        }
    })
})