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
import { HealthService } from "./health.service";
import { CreateHealthDto } from "./dto/create-health.dto";
import { UpdateHealthDto } from "./dto/update-health.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";

@UseGuards(AuthTokenGuard)
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post("create")
  create(@Body() createHealthDto: CreateHealthDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.healthService.create(createHealthDto, userId);
  }

  @Get("list")
  findAll() {
    return this.healthService.findAll();
  }

  @Get("view/:id")
  findOne(@Param("id") id: string) {
    return this.healthService.findOne(id);
  }

  @Patch("update/:id")
  update(@Param("id") id: string, @Body() updateHealthDto: UpdateHealthDto) {
    try {
      return this.healthService.update(id, updateHealthDto);
    } catch (error) {
      console.error("Error updating health reminder:", error);
    }
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.healthService.remove(id);
  }
}
