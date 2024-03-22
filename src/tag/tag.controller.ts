import {Controller, Get} from "@nestjs/common";
import {TagService} from "./tag.service";

@Controller('tags')    //Теперь такой префикс будет у всех энпоинтов этого контроллера
export class TagController {

    constructor(private readonly TagService: TagService) {
    }
    @Get()      //Метод запроса
    async findAll(): Promise<{tags: string[]}> {
        //Вид данных для фронтедна мы описываем ВНУТРИ КОНТРОЛЛЕРА
        const tags = await this.TagService.findAll();
        return {
            tags: tags.map(tag => tag.name),
        };
    }


}