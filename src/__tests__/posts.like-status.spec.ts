import { ENTITIES, LIKE_STATUSES, TestManager } from "./test-manager.spec";
import mongoose from "mongoose";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { appSettings } from "../app.settings";
import { AuthController } from "../auth/presentation/auth.controller";
import { correctLoginData, correctRegistrationData } from "./registration.data";
import { UserForTestModel } from "../users/domain/users-schema";

describe("Blogs", () => {
  let app: INestApplication;
  let testManager: TestManager;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthController)
      .useClass(AuthController)
      .compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();

    httpServer = app.getHttpServer();
    testManager = new TestManager(app, httpServer);
  });

  const mongoURI = process.env.MONGO_NEST_URL as string;
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await app.close();
  });
  it("TEST DELETE ALL", async () => {
    await testManager.deleteAll();
  });

  const confirmationCode = "1234";

  describe("Posts LIKESTATUS", () => {

    it("TEST DELETE ALL", async () => {
      await testManager.deleteAll();
    });

    it("Correct registration expect 204", async () => {
      const reponse: any = await testManager.registration(correctRegistrationData);
      expect(reponse.status).toEqual(204);
    });
    it("Correct RegistrationConfirmation should return true", async () => {
      const reponse: any = await testManager.registrationConfirmation(confirmationCode);
      expect(reponse).toEqual(204);
    });
    let accessToken:string
    it("Correct loginCreatedUserByRegistration should return true", async () => {
      const reponse: any = await testManager.loginCreatedUserByRegistration(correctLoginData);
      accessToken = reponse.accessToken
      expect(reponse).toEqual(204);
    });

    let blogId_One: any;
    it(`CREATE BLOG`, async () => {
      const response = await testManager.createBlog("string");
      blogId_One = response.id;

      expect(blogId_One).toEqual("Some Blog Id");
    });

    let postId_One: any;
    it(`CREATE POST BY BLOG ID`, async () => {
      const postResp = await testManager.craetePostByBlogId(blogId_One);
      postId_One = postResp.id
      console.log(postId_One, "postId_One");
      expect(postId_One).toEqual("Some POst Id");
    });


    // it(`LIKE POST BY REG USER`, async () => {
    //   const postResp = await testManager.craetePostByBlogId(blogId_One);
    //   postId_One = postResp.id
    //   console.log(postId_One, "postId_One");
    //   expect(postId_One).toEqual("Some POst Id");
    // });


    it('LIKE POST', async () => {
     const postData = await testManager.likeEntity(
       ENTITIES.POSTS, accessToken,
        postId_One, LIKE_STATUSES.LIKE)
      console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
      // console.log('LIKE COMMENT', 'comment', comment)
      expect(JSON.parse(postData.text)).toEqual('some')
    });
    it('LIKE POST', async () => {
      const postData = await testManager.likeEntity(
        ENTITIES.POSTS, accessToken,
        postId_One, LIKE_STATUSES.LIKE)
      console.log(postData.body.extendedLikesInfo, 'comment.body.likesInfo')
      // console.log('LIKE COMMENT', 'comment', comment)
      expect(JSON.parse(postData.text)).toEqual('some')
    });
    it('Get post by id', async ()=>{
      const postResp = await testManager.getPost(postId_One,accessToken)
      expect(postResp).toEqual('post some')
    })

  });
});
