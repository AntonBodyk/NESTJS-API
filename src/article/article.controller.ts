import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query
} from "@nestjs/common";
import {ArticleService} from "@app/article/article.service";
import {AuthGuard} from "@app/user/guards/auth.guard";
import { UserDecorator } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticalDto } from "@app/article/dto/CreateArtical.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import {
  ArticlesResponseInterface,
} from "@app/article/types/articlesResponseInterface.interface";

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@UserDecorator('id') userId: number, @Query() query: any ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(userId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(@UserDecorator('id') currentUserId: number, @Query() query: any ):
    Promise<ArticlesResponseInterface>{
    return await this.articleService.getFeed(currentUserId, query);
  }
  @Post()
  @UseGuards(AuthGuard)
  async create(@UserDecorator() currentUser: UserEntity, @Body('article') createArticalDto: CreateArticalDto ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(currentUser, createArticalDto);
    return this.articleService.buildArticalResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticalResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string){
    return await this.articleService.deleteArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(@UserDecorator('id') currentUserId: number,
                @Param('slug') slug: string,
                @Body('article') updateArticleDto: CreateArticalDto): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(currentUserId, slug, updateArticleDto);
    return this.articleService.buildArticalResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(currentUserId, slug);
    return this.articleService.buildArticalResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleToFavorites(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleToFavorites(currentUserId, slug);
    return this.articleService.buildArticalResponse(article);
  }
}