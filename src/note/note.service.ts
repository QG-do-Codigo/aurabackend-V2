import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class NoteService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async findAll(tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findMany({
        where: {
          userId: tokenPayLoad.sub
        }
      })

      if (!note) {
        throw new HttpException("Nota não encontrada", 404)
      }


      return note;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException("Erro interno do servidor", 500)
    }
  }

  async findByTitle(title: string, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
          userId: tokenPayLoad.sub,
        },
      });

      if (!note) {
        throw new HttpException("Nota não encontrada", 404)
      }

      return note;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException("Erro interno do servidor", 500)
    }
  }

  async findOne(id: string, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findFirst({
        where: {
          id: id
        }
      })

      if (!note) {
        throw new HttpException("Nota não encontrada", 404)
      }

      return note;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException("Erro interno do servidor", 500)
    }
  }

  async create(createNoteDto: CreateNoteDto, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findFirst({
        where: {
          title: createNoteDto.title,
          userId: tokenPayLoad.sub
        }
      })

      if (note) {
        throw new HttpException("Nota já cadastrada", 409)
      }


      const newNote = await this.prismaService.note.create({
        data: {
          title: createNoteDto.title,
          content: createNoteDto.content,
          color: createNoteDto.color,
          userId: tokenPayLoad.sub,
        }
      })

      return {
        message: "Nota criada com sucesso",
        data: newNote
      }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException("Erro interno do servidor", 500)
    }
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findFirst({
        where: {
          id: id
        }
      })

      const verifyTitleNote = await this.prismaService.note.findFirst({
        where:{
          title: updateNoteDto.title
        }
      })

      if(verifyTitleNote){
        throw new HttpException("Titulo já cadastrado", 404)
      }

      if (!note) {
        throw new HttpException('Nota não encontrada', 404)
      }

      if (note.userId !== tokenPayLoad.sub) {
        throw new UnauthorizedException("Acesso negado!")
      }

      const noteUpdate = await this.prismaService.note.update({
        where: {
          id: id
        },
        data: {
          ...updateNoteDto,
        }
      })

      return {
        message: "Nota Atualizada com Sucesso",
        data: noteUpdate
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException("Erro interno do servidor", 500)
    }
  }

  async remove(id: string, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!tokenPayLoad.sub) {
        throw new HttpException("Usúario não logado!", 400)
      }

      const note = await this.prismaService.note.findFirst({
        where: {
          id: id
        }
      })

      if (!note) {
        throw new HttpException('Nota não encontrada', 404)
      }

      if (note.userId !== tokenPayLoad.sub) {
        throw new HttpException('Não Autorizado', 401)
      }

      await this.prismaService.note.delete({
        where: {
          id: id
        }
      })

      return "Deletado com sucesso!"

    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException("Erro interno do servidor", 500)
    }
  }
}
