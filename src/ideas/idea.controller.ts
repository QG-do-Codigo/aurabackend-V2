import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { IdeaService } from "./idea.service";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";

@UseGuards(AuthTokenGuard)
@Controller("idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.ideaService.create(createIdeaDto, userId);
  }

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ideaService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideaService.update(+id, updateIdeaDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ideaService.remove(+id);
  }
}
