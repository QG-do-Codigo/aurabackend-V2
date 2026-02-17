import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { TOKEN_PAYLOAD_PARAM } from 'src/auth/param/token-payload-param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }

  @ApiOperation({summary: "Listar todas as Notas referente ao usúario logado"})
  @ApiResponse({status: 200, description: "Lista todas as Notas!"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Nota não encontrada"})
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(
    @TOKEN_PAYLOAD_PARAM() tokenpayload : PayloadTokenDto
  ) {
    return this.noteService.findAll(tokenpayload);
  }

  @ApiOperation({summary: "Listar uma ou mais notas referente ao titulo"})
  @ApiResponse({status: 200, description: "Lista as notas referentes ao titulo!"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Nota não encontrada"})
  @UseGuards(AuthTokenGuard)
  @Get('filter')
  findByTitle(
    @Query('title') title: string,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  ) {
    return this.noteService.findByTitle(title, tokenPayLoad);
  }

  @ApiOperation({summary: "Listar uma nota especifica pelo id"})
  @ApiResponse({status: 200, description: "Lista a nota referente ao id"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Nota não encontrada"})
  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  
  ) {
    return this.noteService.findOne(id, tokenPayLoad);
  }

  @ApiOperation({summary: "Cadastrar uma nova Nota"})
  @ApiResponse({status: 201, description: "Nota cadastrada com sucesso!"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Titulo ja cadastrado para esse usúario!"})
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto, 
    @Body() createNoteDto: CreateNoteDto,
  ) {
    return this.noteService.create(createNoteDto, tokenPayLoad);
  }

  @ApiOperation({summary: "Atualizar uma Nota"})
  @ApiResponse({status: 201, description: "Nota atualizada com sucesso!"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Titulo ja cadastrado para esse usúario!"})
  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) 
    id: string, 
    @Body() updateNoteDto: UpdateNoteDto,
    @TOKEN_PAYLOAD_PARAM() tokenPayload: PayloadTokenDto
  ) {
    return this.noteService.update(id, updateNoteDto, tokenPayload);
  }

  @ApiOperation({summary: "Deletar uma Nota"})
  @ApiResponse({status: 201, description: "Nota deletada com sucesso!"})
  @ApiResponse({status: 401, description: "Usúario não autorizado ou não logado!"})
  @ApiResponse({status: 404, description: "Nota não encontrada!"})
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id',ParseUUIDPipe) 
    id: string,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  ) {
    return this.noteService.remove(id, tokenPayLoad);
  }
}
