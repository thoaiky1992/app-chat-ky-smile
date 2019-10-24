
$('#search-user-to-add-frient').on('keyup',function(e){
    if(e.which == 13){
        let keySearch = $(this).val();
        let thiss = $(this);
        $.get('/search-user-to-add-friend',{keySearch:keySearch},function(data){
            $('.divContact').html(data.tableUserSide)
            thiss.val('');
        })
    }
})
$(function(){
    $(document).on('click','.add-friend',function(){
        let idUserReceiver = $(this).attr('data-id');
        let thiss = $(this);
        $.get('/add-contact',{idUserReceiver:idUserReceiver},function(data){
            if(data.success){
                thiss.parent().parent().remove();
                socket.emit('add-new-contact',idUserReceiver)
            }
        })
    })



    socket.on('response-add-new-contact',function(data){
        let itemNofity = `
        <li> 
            <a href="javascript:void(0);">
                <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                    <img src="assets/images/${data.user.avatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                </div>
                <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                    <h4>${data.user.username} đã gửi cho bạn 1 lời mời kết bạn</h4>
                    <p><i class="zmdi zmdi-time"></i> 14 mins ago </p>
                </div>
            </a> 
        </li>`;
        $('.list-unstyled').append(itemNofity);
        onNotifyNavbar();
    })
})