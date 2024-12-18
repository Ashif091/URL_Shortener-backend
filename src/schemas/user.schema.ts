import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';


@Schema({ collection: 'User' }) 

export class User{
    @Prop({ type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), required: true })
    _id: mongoose.Types.ObjectId;

    
@Prop({required:true})
name:string;

@Prop({required:false})
email?:string

@Prop({required:false})
password?:string

}

export const UserSchema=SchemaFactory.createForClass(User)