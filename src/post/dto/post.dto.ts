import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;
  title: string;
}

export class UpdatePostDto {
  id: string;
  content: string;
  title: string;
}
