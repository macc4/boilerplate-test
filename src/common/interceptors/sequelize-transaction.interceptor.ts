import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @Inject(Sequelize)
    private readonly sequelizeInstance: Sequelize,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();

    req.transaction = transaction;

    return next.handle().pipe(
      tap({
        next: async (): Promise<void> => {
          await transaction.commit();
        },
        error: async (err: Error): Promise<Observable<never>> => {
          await transaction.rollback();
          return throwError(() => err);
        },
      }),
    );
  }
}
