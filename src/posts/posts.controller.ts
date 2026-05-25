import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import type {IPost} from './posts.types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  async create(
    @Body() body: { title: string; content: string; authorId: number },
  ) {
    return this.postsService.createPost(body);
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
