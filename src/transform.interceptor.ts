/* eslint-disable prettier/prettier */

import { 
  ClassSerializerInterceptor, 
  Injectable
} from '@nestjs/common';


@Injectable()
export class CustomSerializeInterceptor extends ClassSerializerInterceptor {}
