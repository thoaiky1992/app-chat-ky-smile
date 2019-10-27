function convertTimestampToHumanTime(timestamp){
    if(!timestamp){
        return "";
    }
    return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}
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
                increaseNumberNotiContact("dang-cho-xac-nhan")
                socket.emit('add-new-contact',idUserReceiver)
            }
        })
    })
    socket.on('response-add-new-contact',function(data){
        let itemNofity = `
        <li> 
            <a href="javascript:void(0);" class="a-notify" style="width: 100%;height: 80px;padding: 10px;">
                <div style="width: 100% !important;height: 70px;background: #c8f0f7;padding-top: 8px;padding-left: 5px">
                    <div class="icon-circle bg-blue" style="width: 36px;float: left;height: auto;">
                        <img src="assets/images/${data.user.avatar}" style="border-radius: 50%;" width="36" height="36" alt="">
                    </div>
                    <div class="menu-info" style="float: left;height: auto;width: 200px;padding-bottom: 10px;">
                        <h4>${data.user.username} đã gửi cho bạn 1 lời mời kết bạn</h4>
                        <p><i class="zmdi zmdi-time"></i> ${ convertTimestampToHumanTime(Date.now()) } </p>
                    </div>
                </div>
            </a> 
        </li>`;
        $('.load-more-list-user-contact-received').parent().parent().remove()
        $('.table-contact-received tbody').prepend(`
        <tr class="tr-contact-received" data-id="${data.user._id}">
            <td>
                <img src="assets/images/${data.user.avatar}" style="object-fit: cover;" width="40" height="40" class="rounded-circle avatar" alt="">
                <p class="c_name">${data.user.username}</p>
            </td>
            <td class="table-phone-mobile">
                <span class="phone"><i class="zmdi zmdi-phone m-r-10"></i>${data.user.phone}</span>
            </td>
            <td class="table-address-mobile">
                <address><i class="zmdi zmdi-pin"></i>${data.user.address}</address>
            </td>
            <td>
                <button data-id="${data.user._id}" class="btn btn-default btn-icon btn-simple btn-icon-mini btn-round approve-add-friend">
                    <i class="zmdi zmdi-plus"></i>
                </button>
                <button data-id="${data.user._id}" class="btn btn-default btn-icon btn-simple btn-icon-mini btn-round delete-add-friend">
                    <i class="zmdi zmdi-delete"></i>
                </button>
            </td>
        </tr>
        <tr>
            <td class="text-center" colspan="4">
                <span class="load-more-list-user-contact-received">Xem Thêm...</span>
                <div class="lds-ripple" style="display:none;"><div></div><div></div></div>
            </td>
        </tr>
        `);
        $('.list-unstyled').prepend(itemNofity);
        onNotifyNavbar();
        increaseNumberNotiContact('yeu-cau-ket-ban');
    })
})
