import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { IPost } from './posts.types';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: createPostDto.authorId,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id: id },
      include: {
        author: true,
      },
    });
  }

  async updatePost(id: number, body: Pick<IPost, 'title' | 'content'>) {
    const { content, title } = body;
    return this.prisma.post.update({
      where: { id: id },
      data: {
        title,
        content,
      },
    });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({
      where: { id: id },
    });
  }
}
