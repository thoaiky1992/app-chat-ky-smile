const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema  = new Schema({
    username    : String,
    gender      : {type: String , default : 'male'},
    phone       : {type: String , default : null},
    address     : {type: String , default : null},
    avatar      : {type: String , default : 'avatar-default.jpg'},
    role        : {type: String , default : 'user'},
    local       : {
        email       : {type:String,trim : true},
        password    : String,
        isActive    : {type:Boolean,default:false},
        verifyToken : String
    },
    facebook : {
        uid     : String,
        token   : String,
        email   : {type:String,trim : true}
    },
    google  : {
        uid     : String,
        token   : String,
        email   : {type:String,trim : true}
    },
    type : String,
    createdAt : {type:String,default:Date.now},
    updatedAt : {type:String,default:null},
    deletedAt : {type:String,default:null},
});
UserSchema.statics = { // UserSchema.statics : để tìm bản ghi và truy vấn
    createNew(item){
        return this.create(item)
    },
    findByEmail(email){
        return this.findOne({"local.email":email}).exec();
    },
    findUserByIdToUpdatePassword(id){
        return this.findById(id).exec();
    },
    findUserByIdForSessionToUse(id){
        return this.findById(id,{"local.password" : 0}).exec();
    },
    removeById(id){
        return this.findByIdAndRemove(id).exec();
    },
    findByToken(token){
        return this.findOne({"local.verifyToken":token}).exec();
    },
    verify(token){
        return this.findOneAndUpdate(
            {"local.verifyToken":token},
            {"local.isActive" : true,"local.verifyToken":null}
        ).exec();
    },
    findEmailAndChangPassword(email,newPassword){
        return this.findOneAndUpdate(
            {"local.email":email},
            {"local.password" : newPassword}
        ).exec();
    },
    findByFacebookUid(uid){
        return this.findOne({"facebook.uid":uid}).exec();
    },
    findByGoogleUid(uid){
        return this.findOne({"google.uid":uid}).exec();
    },
    updateUser(id,item){
        return this.findByIdAndUpdate(id,item).exec(); // tuy đã update nhưng nó trả về dữ liệu cũ
    },
    updatePassword(id,hashedPassword){
        return this.findByIdAndUpdate(id,{"local.password":hashedPassword}).exec();
    },
    /**
     * find all users for add contactt
     * @param {array} deprecatedUserIds 
     * @param {string} keyword 
     */
    findAllOrAddContact(deprecatedUserIds, keyword){
        return this.find({
            $and : [
                {_id : { $nin : deprecatedUserIds }}, // nin (not in) : tìm những ID ko nằm trong mảng ID
                {"local.isActive" : true},
                {
                    $or : [ // $regex : tìm những uername gần giống với keyword
                        {'username' : { $regex : new RegExp(keyword,"i") } }, 
                        {'local.email' : { $regex : new RegExp(keyword,"i") } },
                        {'facebook.email' : { $regex : new RegExp(keyword,"i") } },
                        {'google.email' : { $regex : new RegExp(keyword,"i") } }
                    ]
                }
            ]
        },{_id:1,username:1,address:1,avatar:1}).exec();
    },
    getNormalUserDataById(id){
        return this.findById(id,{_id:1,username:1,address:1,avatar:1}).exec();
    },
    findAllToAddGroupChat(friendIds, keyword){
        return this.find({
            $and : [
                {_id : { $in : friendIds }}, // in : tìm những ID  nằm trong mảng ID
                {"local.isActive" : true},
                {
                    $or : [ // $regex : tìm những uername gần giống với keyword
                        {'username' : { $regex : new RegExp(keyword,"i") } }, 
                        {'local.email' : { $regex : new RegExp(keyword,"i") } },
                        {'facebook.email' : { $regex : new RegExp(keyword,"i") } },
                        {'google.email' : { $regex : new RegExp(keyword,"i") } }
                    ]
                }
            ]
        },{_id:1,username:1,address:1,avatar:1}).exec();
    },
}
UserSchema.methods = { // UserSchema.methods: đã tìm được bản ghi và truy vấn trong bản ghi đó
    comparePassword(password){
        return bcrypt.compare(password,this.local.password); // return a Promise has result is true or false
    }
}
module.exports = mongoose.model("user",UserSchema);