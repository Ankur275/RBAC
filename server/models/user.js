import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role: { 
        type: String, 
        enum: ['Admin', 'User', 'Moderator'], 
        default: 'User' 
    },

    passwordHistory: [{ password: String }],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken:[ 
        {
            token: String,
            expiresAt: Date,
        },
    ],
    
},{
    timestamps:true
})

userSchema.methods.generateEmailVerificationToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.EMAIL_VERIFICATION_SECRET,
        { expiresIn: '1h' }
    );
};

// Prevent password reuse
userSchema.methods.isPasswordReused = async function (newPassword) {
    for (const history of this.passwordHistory || []) {
        const isReused = await bcrypt.compare(newPassword, history.password);
        if (isReused) return true;
    }
    return false;
};

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.passwordHistory = (this.passwordHistory || []).slice(-4); // Keep last 4 passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        this.passwordHistory.push({ password: hashedPassword });
    }
    next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role,
            jti: new mongoose.Types.ObjectId().toString(),
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role:this.role,
            jti: new mongoose.Types.ObjectId().toString(),
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);