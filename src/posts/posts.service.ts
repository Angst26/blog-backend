import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { IPost } from './posts.types';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: { title: string; content: string; authorId: number }) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: data.authorId,
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
