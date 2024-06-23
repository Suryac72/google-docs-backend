import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type GoogleDocsDocument = HydratedDocument<Document>;

@Schema()
export class Document {
  @Prop()
  _id: string;
  @Prop({ type: MongooseSchema.Types.Mixed }) 
  data: Record<string, any>;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
