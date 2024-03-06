import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BlogsService } from '../src/blogs/application/blogs.service';
import { AppModule } from '../src/app.module';

describe('Cats', () => {
  let app: INestApplication;
  const blogsService = { getBlogs: () => request('/blogs') };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BlogsService)
      .useValue(blogsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET catsrt`, () => {
    return request(app.getHttpServer()).get('/blogs').expect(200).expect({
      data: blogsService.getBlogs(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
