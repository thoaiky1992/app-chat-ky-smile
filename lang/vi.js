 const transValidation = {
    email_incorrect : "Email không hợp lệ !!! ",
    password_incorrect : "Mật khẩu tối thiểu phải 8 kí tự , ít nhất 1 chữ cái và 1 chữ số !!!  ",
    password_confirmation_incorrect : "Mật khẩu xác nhận không chính xác !!",
    update_phone : 'Số điện thoại phải bắt đầu bằng số 0 và giới hạn 10-11 kí tự số'
}
const transErrors = {
    account_in_use : 'Email này đã được sử dụng !!!',
    account_not_active : 'Email đã được đăng ký nhưng chưa active tài khoản ! vui lòng kiểm tra Mail hoặc liên hệ với bộ phận hỗ trợ',
    account_removed : 'Tài khoản này đã bị xoá khỏi hệ thống',
    account_undefined : 'Tài khoản này không tồn tại',
    user_current_password_failed : 'Mật khẩu này không tồn tại !!!',
    token_undefined : 'Token không tồn tại !!!',
    login_failed : ' Sai tài khoản hoặc mật khẩu',
    server_error : 'Có lỗi ở phía server trong quá trình đăng nhập ! xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để xử lý , xin cảm ơn',
    avatar_type : 'Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG',
    avatar_size : 'File không được vượt quá 1MB .',
    conversation_not_found : "cuộc trò chuyện không tồn tại",
    image_message_type : 'Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG',
    image_message_size : 'File không được vượt quá 1MB .',
    attachment_message_size : 'File không được vượt quá 1MB .',
    email_not_find : "Email này không tồn tại !!!"
}
const transSuccess = {
    userCreated : (userEmail) => {
        return `Tài khoản ${userEmail} đã được tạo , vui lòng kiểm tra email và active tài khoản trước khi đăng nhập`;
    },
    forgotPassword : (email) => {
        return `Chúng tôi đã gửi mật khẩu mới đến ${email} !!! Vui lòng check mail ...`;
    },
    account_actived:'Kích hoạt tài khoản thành công ! Giờ bạn có thể login vào ứng dụng ',
    loginSuccess : (username) => {
        return `Xin chào ${username} , chúc bạn có 1 ngày thật vui vẽ và tốt lành ...`;
    },
    logout_success : 'Đăng xuất tài khoản thành cmn công nhé ',
    user_info_or_avatar_updated : 'Cập nhập thông tin thành công',
    user_password_updated : 'Cập nhật mật khẩu thành công',
    
}
const transMail = {
    subject : 'Xác nhận tài khoản',
    subject_forgot_password : 'Quên Mật Khẩu App Chat Kỳ Smile',
    template : (linkVerify) => {
        return `
            <h2>Bạn nhận được Email này vì đã đăng kí tài khoản trên ứng dụng Chat - Kỳ Smile .</h2>
            <h3>Vui lòng click vào link dưới để xác nhận kích hoạt tài khoản .</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
            <h4>Chúc bạn có 1 ngày thật vui vẽ</h4>
        `;
    },
    template_forgot_password : (password) => {
        return `
            <h2>Bạn nhận được Email này vì muốn lấy lại mật khẩu tài khoản trên ứng dụng Chat - Kỳ Smile .</h2>
            <h3>Dưới đây là mật khẩu mới của bạn .</h3>
            <h3>Mật khẩu : <span style="color:blue;font-weight:bold;">${password}<span></h3>
            <h4>Hãy đăng nhập vào ứng dụng và đổi ngay lập tức</h4>
            <h4>Và nếu có gặp vấn đề trục trặc gì thì vui lòng liên hệ với bộ phận kĩ thuật để được hỗ trợ</h4>
            <h4>Chúc bạn có 1 ngày thật vui vẽ</h4>
        `;
    },
    send_failed : 'Có lỗi trong quá trình gửi email , vui lòng liên hệ lại với bộ phận hỗ trợ của chúng tôi .'
}
module.exports = {
    transValidation,
    transErrors,
    transSuccess,
    transMail
}