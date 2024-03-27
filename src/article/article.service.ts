import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticalDto } from "@app/article/dto/CreateArtical.dto";
import { ArticleEntity } from "@app/article/article.entity";
import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";

@Injectable()
export class ArticleService {

  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) {
  }
  async createArticle(currentUser: UserEntity, createArticleDto: CreateArticalDto): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();
    Object.assign(newArticle, createArticleDto);

    if(!newArticle.tagList){
      newArticle.tagList = [];
    }

    newArticle.slug = this.getSlug(createArticleDto.title);   //вот так генерим slug(будет уникальным)

    newArticle.author = currentUser; //добавляет связь и сохраняет в currentUser
    return await this.articleRepository.save(newArticle);
  }

  buildArticalResponse(article: ArticleEntity): ArticleResponseInterface{
    return {article: article};
  }

  private getSlug(title: string): string{
    return slugify(title, {lower: true}) + '-' + ((Math.random() * Math.pow(36, 6) | 0).toString());
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {        //хорошая практика работать с сущностями!
    return await this.articleRepository.findOne({where: {slug}});
  }

  async deleteArticle(currentUserId: number, slug: string): Promise<DeleteResult>{      //результат удаления, в виде объекта + удаление сразу с зависимостью !!!
    const article = await this.findBySlug(slug);

    if(!article){
      throw new HttpException('artical does not exist', HttpStatus.NOT_FOUND);
    }

    if(article.author.id !== currentUserId){
      throw new HttpException('Чмо, ты не автор, не удаляй!', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({slug});
  }

  async updateArticle(currentUserId: number, slug: string, updateArticleDto: CreateArticalDto): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if(!article){
      throw new HttpException('artical does not exist', HttpStatus.NOT_FOUND);
    }

    if(article.author.id !== currentUserId){
      throw new HttpException('Чмо, ты не автор, не удаляй!', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }
}