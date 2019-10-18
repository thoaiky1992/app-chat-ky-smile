let ramdomPassword = () => {
    let alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let number = ['0','1','2','3','4','5','6','7','8','9'];
    let randomPassword = '';
    for(let i = 0 ; i < 8 ; i++){
        if(i % 2 == 0){
            randomPassword += alpha[Math.floor(Math.random()*26)];
        }
        else{
            randomPassword += number[Math.floor(Math.random()*10)];
        }
    }
    return randomPassword;
}
module.exports = {
    ramdomPassword
}