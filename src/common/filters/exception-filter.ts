import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { error } from "console";
import { Request, Response } from "express";
import path from "path";

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost){
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();


    response.status(status).json({
      statusCode: status,
      path: request.url,
      message: errorResponse !== "" ? errorResponse : "Erro ao realizar a requisição",
    })
  }
}