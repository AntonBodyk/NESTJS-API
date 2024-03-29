import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserEntity } from "@app/user/user.entity";
import { CreateArticalDto } from "@app/article/dto/CreateArtical.dto";
import { ArticleEntity } from "@app/article/article.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponseInterface.interface";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ArticleService {

  constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
              private dataSource: DataSource,
              @InjectRepository(UserEntity)
              private  readonly userRepository: Repository<UserEntity>,
              @InjectRepository(FollowEntity)
              private  readonly followRepository: Repository<FollowEntity>) {}
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

    if(query.favorited){
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited
        },
        relations: ['favorites']
      })

      const ids = author.favorites.map((el) => el.id);
      if(ids.length > 0){
        queryBuilder.andWhere('articles.id IN (:...ids)', {ids});
      }else{
        queryBuilder.andWhere('1=0'); //нужно что бы обрвать builder, это условие никогда не выполнится !
      }

      console.log('author', author);
    }


    if(query.limit){
      queryBuilder.limit(query.limit);
    }

    if(query.offset){
      queryBuilder.offset(query.offset);
    }

    let favoritesIds: number[] = [];
    if(userId){
      const currentUser = await this.userRepository.findOne({
        where: {
          id: userId
        },
        relations: ['favorites']
      });
      favoritesIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();    //таким способом возращаем все статьи
    const articlesWithFavorites = articles.map(article => {
      const favorited = favoritesIds.includes(article.id);
      return {...article, favorited};
    });

    return  {articles: articlesWithFavorites, articlesCount};
  }

  async addArticleToFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId
      },
      relations: ['favorites']
    })

    const isNotFavorited = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id) === -1;

    if(isNotFavorited){
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleToFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId
      },
      relations: ['favorites']
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id);

    if(articleIndex >= 0){
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async getFeed(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      where:{
        followerId: currentUserId
      }
    });

    if(follows.length === 0){
      return {articles: [], articlesCount: 0};
    }

    const followsIds = follows.map((follow) => follow.followingId);
    const queryBuilder = this.dataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorIs IN (:...ids)', {ids: followsIds});

    queryBuilder.orderBy('articles.created_at', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if(query.limit){
      queryBuilder.limit(query.limit);
    }
    if(query.offset){
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return {articles, articlesCount};
  }
}