import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { IPost } from './posts.types';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }
  @Get()
  async findAll() {
    return this.postsService.getAllPosts();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Pick<IPost, 'title' | 'content'>,
  ) {
    return this.postsService.updatePost(+id, body);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
