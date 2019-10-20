$('#search-user-to-add-frient').on('keyup',function(e){
    if(e.which == 13){
        let keySearch = $(this).val();
        $.get('/search-user-to-add-friend',{keySearch:keySearch},function(data){
            $('.divContact').html(data.tableUserSide)
        })
    }
})