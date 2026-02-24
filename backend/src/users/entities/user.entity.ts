import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

// Enum for user roles
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  // Unique username, trimmed and lowercase
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  username!: string;

  // Unique email, trimmed and lowercase
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email!: string;

  // Password, hidden by default in queries
  @Prop({
    required: true,
    select: false,
  })
  password!: string;

  // User first name
  @Prop({ required: true, trim: true })
  firstName!: string;

  // User last name
  @Prop({ required: true, trim: true })
  lastName!: string;

  // Role of the user with enum validation
  @Prop({
    required: true,
    enum: UserRole,
    index: true,
  })
  role!: UserRole;

  // Optional profile image URL
  @Prop()
  profileImage?: string;

  // Optional CIN with sparse index
  @Prop({
    sparse: true,
    index: true,
  })
  cin?: string;

  // Phone number (required)
  @Prop({ required: true })
  phone!: string;

  // Date of birth (required)
  @Prop({ required: true })
  dateOfBirth!: Date;

  // Email notification preferences with default values
  @Prop({
    type: {
      onUpload: { type: Boolean, default: true },
      onGrade: { type: Boolean, default: true },
      onFeedback: { type: Boolean, default: true },
    },
    default: () => ({}), // Prevents shared object reference
  })
  emailPreferences!: {
    onUpload: boolean;
    onGrade: boolean;
    onFeedback: boolean;
  };

  // Optional face recognition data (flexible storage)
  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  faceIdData?: Record<string, any>;

  // Active status, default true
  @Prop({
    default: true,
  })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
