import {Injectable} from "@nestjs/common";
import {TagEntity} from "@app/tag/tag.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TagService {
    constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {   //injectim репозиторий который сможет работать с тегом!
    }
    async findAll(): Promise<TagEntity[]> {             //асинхронная операция всегда возращает промисс
        return await this.tagRepository.find();             //вот так можно вернуть все записи с таблицы БД
    }
}