import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticalDto } from "@app/article/dto/CreateArtical.dto";
import { ArticleEntity } from "@app/article/article.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponseInterface.interface";

@Injectable()
export class ArticleService {

  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
              private dataSource: DataSource,
              @InjectRepository(UserEntity)
              private  readonly userRepository: Repository<UserEntity>) {}
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

  async findAll(userId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
                                                      .getRepository(ArticleEntity)
                                                      .createQueryBuilder('articles')
                                                      .leftJoinAndSelect('articles.author', 'author');    //создаем queryBuilder

    queryBuilder.orderBy('articles.created_at', 'DESC');  //вот так делается сортировка значений!!!

    const articlesCount = await queryBuilder.getCount(); //возращаем общее кол-во записей в запросе
    //ВАЖНО ДЕЛАТЬ ПОСЛЕ ПОДСЧЕТА ЗАПИСЕЙ!!!

    if(query.tag){
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      });
    }

    if(query.author){
      const author = await this.userRepository.findOne({
        where: {
          username: query.author
        }
      });

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id
      });
    }

    if(query.limit){
      queryBuilder.limit(query.limit);
    }

    if(query.offset){
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();    //таким способом возращаем все статьи


    return  {articles, articlesCount};
  }
}