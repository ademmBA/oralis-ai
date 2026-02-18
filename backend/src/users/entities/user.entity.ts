import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, enum: ['student', 'instructor', 'admin'], index: true })
    role: string;

    @Prop()
    profileImage?: string;

    @Prop({ index: true, sparse: true })
    cin?: string;

    @Prop({required: true})
    phone?: string;

    @Prop({required: true})
    dateOfBirth?: Date;

    @Prop({
        type: {
            onUpload: { type: Boolean, default: true },
            onGrade: { type: Boolean, default: true },
            onFeedback: { type: Boolean, default: true },
        },
        default: {},
    })
    emailPreferences: {
        onUpload: boolean;
        onGrade: boolean;
        onFeedback: boolean;
    };

    @Prop({ type: Object })
    faceIdData?: Record<string, any>;

    @Prop({ default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);