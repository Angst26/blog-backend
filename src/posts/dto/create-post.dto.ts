import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;
}
