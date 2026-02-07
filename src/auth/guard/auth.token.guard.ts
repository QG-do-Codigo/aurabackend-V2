import {  CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import jwtConfig from "../config/jwt-config";
import type { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";
import { Request } from "express";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) { }



    async canActivate(context: ExecutionContext): Promise <boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenHeader(request);

        if(!token) {
            throw new UnauthorizedException("Token não encontrado")
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

            const user = await this.prismaService.user.findFirst({
                where: {
                    id: payload?.sub
                }
            })

            if(!user){
                throw new UnauthorizedException("Usuário não encontrado")
            }

            request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
            
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException("Acesso não autorizado")
        }

        return true;
    }


    extractTokenHeader(request: Request) {
        const authorization = request.headers?.authorization;
    
        if(!authorization || typeof authorization !== 'string') {
          return null;
        }
    
        return authorization.split(' ')[1];
    }
}