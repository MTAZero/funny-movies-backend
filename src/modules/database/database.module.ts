import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    tbl_users,
    tbl_users_schema,
} from './schemas';
import {
    UserFactoryService,
} from './services';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: tbl_users.name,
                schema: tbl_users_schema,
            },
        ]),
    ],
    providers: [
        UserFactoryService,
    ],
    exports: [
        UserFactoryService,
      
    ],
})
export class DatabaseModule {}
