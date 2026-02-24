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
import { ShoppingService } from "./shopping.service";
import { CreateShoppingDto } from "./dto/create-shopping.dto";
import { UpdateShoppingDto } from "./dto/update-shopping.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";

@UseGuards(AuthTokenGuard)
@Controller("shopping")
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post("create")
  create(
    @Body() createShoppingDto: CreateShoppingDto,
    @CurrentUser() user: any
  ) {
    const userId = user.sub;
    return this.shoppingService.create(createShoppingDto, userId);
  }

  @Get("list")
  findAll(@CurrentUser() user: any) {
    const userId = user.sub;
    return this.shoppingService.findAll(userId);
  }

  @Patch("update/:id")
  update(
    @Param("id") id: string,
    @Body() updateShoppingDto: UpdateShoppingDto
  ) {
    return this.shoppingService.update(id, updateShoppingDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.shoppingService.remove(id);
  }
}
