import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


@Global() // Isso torna o Prisma disponível em todo o app sem precisar importar em todo lugar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}