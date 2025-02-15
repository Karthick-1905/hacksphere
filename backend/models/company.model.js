const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryptjs = require('bcryptjs');
const {JWT_EXPIRES_IN,JWT_SECRET} = require('../utils/keys.js');

const CompanySchema = new Schema({
    company_name: { type: String, required: true },
    company_email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gst_number: { type: String, required: true, unique: true },
    phone_no: { type: String, required: true },
    location: { type: String },
    industry_type: { type: String }, // New field
    website: { type: String }, // New field
    logo_url: { type: String }, // New field
    is_verified: { type: Boolean, default: false }, // New field
  },{timestamps:true});


CompanySchema.pre('save',async function(){
    const salt =  await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
})
CompanySchema.methods.comparePassword = async function(password){
    const isMatch = await bcryptjs.compare(password,this.password);
    return isMatch;
}
CompanySchema.methods.createJWT = function(){
    const payLoad = {company_id:this._id}
    const token = jwt.sign(payLoad,JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
    return token;
}

CompanySchema.methods.toJSON = function(){
    var obj =  this.toObject();
    delete obj.password;
    return obj;
}




const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;