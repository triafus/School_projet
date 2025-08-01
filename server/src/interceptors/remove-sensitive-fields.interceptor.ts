import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class RemoveSensitiveFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.removeFields(item));
        }
        return this.removeFields(data);
      })
    );
  }

  private removeFields(data: any) {
    if (!data || typeof data !== "object") return data;

    const { password, images, ...rest } = data;
    return rest;
  }
}
